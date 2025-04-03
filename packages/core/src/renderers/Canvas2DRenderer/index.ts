import { type Coordinate, type Bounds, type Pixel, MAX_DIMENSION } from "../../types"
import { areBoundsEqual, areCoordinatesEqual, numRGBAToHex } from "../../utils.ts"
import type { PixelawCore } from "../../PixelawCore.ts"

export const ZOOM_MAX = 30
export const ZOOM_CLOSE_MAX = 22
export const ZOOM_MID_MAX = 4
export const ZOOM_FAR_MAX = 0.25
export const ZOOM_DEFAULT = 0.25

export type ZOOM_LEVEL = "far" | "mid" | "close"

export function getZoomLevel(zoom: number): ZOOM_LEVEL {
    if (zoom < ZOOM_MID_MAX) return "far"
    if (zoom < ZOOM_CLOSE_MAX) return "mid"
    return "close"
}

/**
 * Configuration options for the grid renderer
 */
export interface Canvas2DRendererOptions {
    cellSize: number
    defaultZoom: number
    minZoom: number
    maxZoom: number
    backgroundColor: string
    gridLineColor: string
    showGridLines: boolean
}

/**
 * Default configuration for the grid renderer
 */
const DEFAULT_OPTIONS: Canvas2DRendererOptions = {
    cellSize: 10,
    defaultZoom: ZOOM_DEFAULT,
    minZoom: ZOOM_FAR_MAX,
    maxZoom: ZOOM_MAX,
    backgroundColor: "#000000",
    gridLineColor: "#444444",
    showGridLines: true,
}
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined"

/**
 * Manages the rendering of a grid of cells on a canvas
 */
export default class Canvas2DRenderer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private core: PixelawCore
    private options: Canvas2DRendererOptions

    // Viewport state
    private zoom: number
    private center: Coordinate = [0, 0]
    private bounds: Bounds = [
        [0, 0],
        [0, 0],
    ]

    private offsetX = 0
    private offsetY = 0
    private isRendering = false
    private dragStartTime = 0
    private lastDragTime = 0

    private dragStartCoord: Coordinate | null = null
    private lastDragPoint: Coordinate = [0, 0]
    private initialPinchDistance: number | null = null
    private initialPinchZoom: number

    // For panning "inertia"
    private panInertiaVelocity: [number, number]
    private panInertiaInterval: NodeJS.Timeout

    // For zooming "inertia"
    private zoomInertiaVelocity: number
    private zoomInertiaInterval: NodeJS.Timeout

    private readonly decelerationFactor = 0.9 // Adjust for desired deceleration

    // TODO do something useful with the options
    constructor(core: PixelawCore, options: Partial<Canvas2DRendererOptions> = {}) {
        // Create a new canvas element
        this.canvas = document.createElement("canvas")
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        this.canvas.style.display = "block"
        this.canvas.style.cursor = "grab"

        // Get canvas context
        const ctx = this.canvas.getContext("2d")
        if (!ctx) {
            throw new Error("Failed to get canvas 2D context")
        }
        this.ctx = ctx

        // Initialize properties
        this.core = core
        this.options = { ...DEFAULT_OPTIONS, ...options }
        this.zoom = core.getZoom()

        // Initialize event listeners
        this.initEventListeners()

        // Set initial canvas size when it's attached to the DOM
        const resizeObserver = new ResizeObserver(() => {
            this.resizeCanvas()
        })
        resizeObserver.observe(this.canvas)

        this.subscribeToEvents()

        this.setCenter(core.getCenter())

        this.requestRender()
    }

    private subscribeToEvents() {
        if (!this.core.pixelStore) throw new Error("PixelStore not initialized")
        // TODO decide on whether pixelstore cacheupdated goes to a global event bus or not
        this.core.pixelStore.eventEmitter.on("cacheUpdated", (_timestamp: number) => {
            console.log("cacheUpdated")
            this.requestRender()
        })

        this.core.events.on("pixelStoreUpdated", (timestamp: number) => {
            console.log(`pixelStoreUpdated at: ${timestamp}`)

            this.requestRender()
        })
        this.core.events.on("tileStoreUpdated", (timestamp: number) => {
            console.log(`tileStoreUpdated at: ${timestamp}`)

            this.requestRender()
        })
    }

    private requestRender() {
        if (!this.isRendering) {
            this.isRendering = true
            if (isBrowser) {
                requestAnimationFrame(() => {
                    this.render()
                    this.isRendering = false
                })
            } else {
                setImmediate(() => {
                    this.render()
                    this.isRendering = false
                })
            }
        }
    }

    public setContainer(container: HTMLElement) {
        this.canvas.width = container.clientWidth
        this.canvas.height = container.clientHeight
        container.appendChild(this.canvas)
    }

    /**
     * Initializes event listeners for user interaction
     */
    private initEventListeners(): void {
        // Mouse wheel for zooming
        this.canvas.addEventListener("wheel", this.handleWheel.bind(this))

        // Mouse events for panning
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
        this.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this))

        // Touch events for mobile
        this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this))
        this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this))
        this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this))
    }

    /**
     * Resizes the canvas to fill its container
     */
    private resizeCanvas(): void {
        const container = this.canvas.parentElement

        if (container) {
            this.canvas.width = container.clientWidth
            this.canvas.height = container.clientHeight
            this.render()

            this.updateBounds()
            this.setCenter(this.center)
        }
    }

    /**
     * Handles mouse wheel events for zooming
     */
    private handleWheel(event: WheelEvent): void {
        event.preventDefault()

        // Calculate zoom center (mouse position)
        const rect = this.canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        // Calculate world coordinates before zoom
        const worldXBefore = (mouseX - this.offsetX) / this.zoom
        const worldYBefore = (mouseY - this.offsetY) / this.zoom

        // Update zoom level
        const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1
        this.zoomInertiaVelocity = (zoomDelta - 1) * 0.1 // Adjust multiplier for desired speed

        const newZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, this.zoom * zoomDelta))

        // Calculate world coordinates after zoom
        const worldXAfter = (mouseX - this.offsetX) / newZoom
        const worldYAfter = (mouseY - this.offsetY) / newZoom

        // Adjust offset to keep the point under the mouse fixed
        this.offsetX += (worldXAfter - worldXBefore) * newZoom
        this.offsetY += (worldYAfter - worldYBefore) * newZoom

        this.updateZoom(newZoom)
        this.updateCenter()
        this.updateBounds()

        this.render()
        this.startZoomInertia()
    }

    /**
     * Handles mouse down events for panning
     */
    private handleMouseDown(event: MouseEvent): void {
        event.preventDefault()
        clearInterval(this.panInertiaInterval)
        this.panInertiaInterval = null

        this.dragStartTime = Date.now()
        this.dragStartCoord = [event.clientX, event.clientY]
        this.lastDragPoint = [event.clientX, event.clientY]

        // this.canvas.style.cursor = "grabbing"
    }

    /**
     * Handles mouse move events for panning
     */
    private handleMouseMove(event: MouseEvent): void {
        // TODO when doing hover effects, this has to be changed
        if (!this.dragStartTime) return

        const currentTime = Date.now()
        const timeDiff = currentTime - this.lastDragTime
        this.lastDragTime = currentTime

        // Calculate the distance moved
        const deltaX = event.clientX - this.lastDragPoint[0]
        const deltaY = event.clientY - this.lastDragPoint[1]

        // Update last mouse position
        this.lastDragPoint = [event.clientX, event.clientY]

        // Update offset
        this.offsetX += deltaX
        this.offsetY += deltaY

        // Calculate velocity based on the change in position and time
        if (timeDiff > 0) {
            this.panInertiaVelocity = [(deltaX / timeDiff) * 15, (deltaY / timeDiff) * 15]
            // console.log("velo", this.panInertiaVelocity)
        }

        // Render with new offset
        this.render()

        this.updateCenter()
        this.updateBounds()
        event.preventDefault()
    }

    /**
     * Handles mouse up events for panning
     */
    private handleMouseUp(event: MouseEvent): void {
        let totalDistance = 0
        const timeDiff = Date.now() - this.dragStartTime

        if (this.dragStartCoord !== null) {
            const startPos = this.dragStartCoord
            const endPos: Coordinate = [event.clientX, event.clientY]
            totalDistance = Math.sqrt((endPos[0] - startPos[0]) ** 2 + (endPos[1] - startPos[1]) ** 2)

            const deltaX = event.clientX - this.lastDragPoint[0]
            const deltaY = event.clientY - this.lastDragPoint[1]

            // Update last mouse position
            this.lastDragPoint = [event.clientX, event.clientY]

            // Update offset
            this.offsetX += deltaX
            this.offsetY += deltaY

            // Start inertia
            this.startPanInertia()
        }

        if (timeDiff > 10 && timeDiff < 1500 && totalDistance < 10) {
            // Click!
            const rect = this.canvas.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top

            const x = Math.floor((mouseX - this.offsetX) / (this.zoom * this.options.cellSize))
            const y = Math.floor((mouseY - this.offsetY) / (this.zoom * this.options.cellSize))

            this.core.events.emit("cellClicked", [x, y])
        }

        this.dragStartTime = 0
        this.dragStartCoord = null
    }

    // Implement the zoom inertia logic
    private startZoomInertia(): void {
        if (this.zoomInertiaInterval) {
            clearInterval(this.zoomInertiaInterval)
        }

        this.zoomInertiaInterval = setInterval(() => {
            if (Math.abs(this.zoomInertiaVelocity) < 0.001) {
                clearInterval(this.zoomInertiaInterval)
                this.zoomInertiaInterval = null
                return
            }

            // Calculate new zoom level
            const newZoom = Math.max(
                this.options.minZoom,
                Math.min(this.options.maxZoom, this.zoom * (1 + this.zoomInertiaVelocity)),
            )

            // Calculate the midpoint of the canvas as the zoom center
            const midX = this.canvas.width / 2
            const midY = this.canvas.height / 2

            // Calculate world coordinates before zoom
            const worldXBefore = (midX - this.offsetX) / this.zoom
            const worldYBefore = (midY - this.offsetY) / this.zoom

            // Calculate world coordinates after zoom
            const worldXAfter = (midX - this.offsetX) / newZoom
            const worldYAfter = (midY - this.offsetY) / newZoom

            // Adjust offset to keep the midpoint fixed
            this.offsetX += (worldXAfter - worldXBefore) * newZoom
            this.offsetY += (worldYAfter - worldYBefore) * newZoom

            // Update zoom and render
            this.updateZoom(newZoom)
            this.zoomInertiaVelocity *= this.decelerationFactor // Apply deceleration

            this.render()
            this.updateCenter()
            this.updateBounds()
        }, 30) // Approximately 60fps
    }

    // Implement inertia
    private startPanInertia(): void {
        if (this.panInertiaInterval) {
            clearInterval(this.panInertiaInterval)
        }

        if (Math.abs(this.panInertiaVelocity[0]) < 4 && Math.abs(this.panInertiaVelocity[1]) < 4) return

        this.panInertiaInterval = setInterval(() => {
            // Apply velocity to offset
            this.offsetX += this.panInertiaVelocity[0]
            this.offsetY += this.panInertiaVelocity[1]

            // Decelerate
            this.panInertiaVelocity[0] *= this.decelerationFactor
            this.panInertiaVelocity[1] *= this.decelerationFactor

            // Stop inertia when velocity is low
            if (Math.abs(this.panInertiaVelocity[0]) < 0.01 && Math.abs(this.panInertiaVelocity[1]) < 0.01) {
                clearInterval(this.panInertiaInterval)
                this.panInertiaInterval = null
            }

            // Render with new offset
            this.render()
            this.updateCenter()
            this.updateBounds()
        }, 30) // Approximately 60fps
    }

    /**
     * Handles touch start events for panning on mobile
     */
    private handleTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            event.preventDefault()
            this.dragStartTime = Date.now()
            this.dragStartCoord = [event.touches[0].clientX, event.touches[0].clientY]
            this.lastDragPoint = [event.touches[0].clientX, event.touches[0].clientY]
        } else if (event.touches.length === 2) {
            event.preventDefault()
            const [touch1, touch2] = Array.from(event.touches)
            this.initialPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            this.initialPinchZoom = this.zoom
        }
    }

    /**
     * Handles touch move events for panning on mobile
     */
    private handleTouchMove(event: TouchEvent): void {
        if (event.touches.length === 1 && this.dragStartTime) {
            this.handleMouseMove(event.touches[0] as unknown as MouseEvent)
        } else if (event.touches.length === 2 && this.initialPinchDistance !== null) {
            // Handle pinch move
            const [touch1, touch2] = Array.from(event.touches)

            const newPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            const pinchRatio = newPinchDistance / this.initialPinchDistance
            const newZoom = Math.max(
                this.options.minZoom,
                Math.min(this.options.maxZoom, this.initialPinchZoom * pinchRatio),
            )

            // Calculate the midpoint between the two touch points
            const rect = this.canvas.getBoundingClientRect()
            const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left
            const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top

            // Adjust offset to keep the midpoint fixed
            const worldXBefore = (midX - this.offsetX) / this.zoom
            const worldYBefore = (midY - this.offsetY) / this.zoom

            const worldXAfter = (midX - this.offsetX) / newZoom
            const worldYAfter = (midY - this.offsetY) / newZoom

            this.offsetX += (worldXAfter - worldXBefore) * newZoom
            this.offsetY += (worldYAfter - worldYBefore) * newZoom

            // TODO fix
            // Calculate zoom inertia velocity based on the change in zoom
            this.zoomInertiaVelocity = (newZoom / this.zoom - 1) * 0.1 // Adjust multiplier for desired speed

            this.updateZoom(newZoom)
            this.updateCenter()
            this.updateBounds()
            this.render()
        }
    }

    /**
     * Handles touch end events for panning on mobile
     */
    private handleTouchEnd(event: TouchEvent): void {
        if (event.touches.length === 0) {
            // Reset pinch-related variables when all touches are lifted
            // TODO
            // this.initialPinchDistance = null
            // this.initialZoom = this.zoom
            const mouseEvent = { clientX: this.lastDragPoint[0], clientY: this.lastDragPoint[1] }
            this.handleMouseUp(mouseEvent as unknown as MouseEvent)
        } else if (event.touches.length === 1) {
            // Still one touch remaining after pinching
            this.dragStartTime = Date.now()
            this.dragStartCoord = [event.touches[0].clientX, event.touches[0].clientY]
            this.lastDragPoint = [event.touches[0].clientX, event.touches[0].clientY]

            this.startZoomInertia()
            // Handle as a mouse up event if there's still one touch remaining
        }
    }

    /**
     * Renders the grid and cells
     */
    public render(): void {
        // Clear canvas
        this.ctx.fillStyle = this.options.backgroundColor
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Draw visible cells
        this.drawCells()

        // Draw grid lines if enabled
        if (this.options.showGridLines && getZoomLevel(this.zoom) !== "far") {
            this.drawGridLines()
        }
    }

    private getRenderableBounds(): Bounds {
        let [[left, top], [right, bottom]] = this.getBounds()

        left = Math.max(left, 0)
        top = Math.max(top, 0)
        right = Math.min(MAX_DIMENSION, right)
        bottom = Math.min(MAX_DIMENSION, bottom)

        return [
            [left, top],
            [right, bottom],
        ]
    }

    /**
     * Draws grid lines
     */
    private drawGridLines(): void {
        const [[left, top], [right, bottom]] = this.getRenderableBounds()

        const { cellSize } = this.options

        this.ctx.strokeStyle = this.options.gridLineColor
        this.ctx.lineWidth = 1

        // Draw vertical grid lines
        for (let x = left; x <= right; x++) {
            const screenX = Math.floor(x * cellSize * this.zoom + this.offsetX) + 0.5
            this.ctx.beginPath()
            this.ctx.moveTo(screenX, top * cellSize * this.zoom + this.offsetY)
            this.ctx.lineTo(screenX, (bottom + 1) * cellSize * this.zoom + this.offsetY)
            this.ctx.stroke()
        }

        // Draw horizontal grid lines
        for (let y = top; y <= bottom; y++) {
            const screenY = Math.floor(y * cellSize * this.zoom + this.offsetY) + 0.5
            this.ctx.beginPath()
            this.ctx.moveTo(left * cellSize * this.zoom + this.offsetX, screenY)
            this.ctx.lineTo((right + 1) * cellSize * this.zoom + this.offsetX, screenY)
            this.ctx.stroke()
        }
    }

    /**
     * Draws cells in the visible region using Bounds
     */
    private drawCells(): void {
        const [[left, top], [right, bottom]] = this.getRenderableBounds()

        // Get all cells in the region
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                const pixel = this.core.pixelStore.getPixel([x, y])

                if (!pixel) continue
                this.drawCell(pixel)
            }
        }
    }

    /**
     * Draws a single cell
     */
    private drawCell(pixel: Pixel): void {
        const { cellSize } = this.options

        // Calculate screen coordinates
        const screenX = pixel.x * cellSize * this.zoom + this.offsetX
        const screenY = pixel.y * cellSize * this.zoom + this.offsetY
        const screenSize = cellSize * this.zoom

        // Draw cell background
        this.ctx.fillStyle = numRGBAToHex(pixel.color as number)
        this.ctx.fillRect(screenX, screenY, screenSize, screenSize)

        const zoomlevel = getZoomLevel(this.zoom)
        if (zoomlevel === "close") {
            // The icon
            const fontWeight = "300"
            this.ctx.font = `${fontWeight} ${screenSize * 0.2}px "Noto Emoji", serif`
            this.ctx.textAlign = "center"
            this.ctx.textBaseline = "middle"
            this.ctx.fillStyle = "#000000"
            this.ctx.fillText(pixel.text, screenX + screenSize / 2, screenY + screenSize * 0.55)

            // The app name
            this.ctx.font = `${fontWeight} ${screenSize * 0.2}px Arial, sans-serif`
            this.ctx.textAlign = "center"
            this.ctx.textBaseline = "middle"
            this.ctx.fillStyle = "#000000"
            this.ctx.fillText(pixel.app, screenX + screenSize / 2, screenY + screenSize * 0.1)
        } else if (zoomlevel === "mid") {
            if (!pixel.text) return
            const fontWeight = "300"
            this.ctx.font = `${fontWeight} ${screenSize * 0.8}px "Arial", serif`
            this.ctx.textAlign = "center"
            this.ctx.textBaseline = "middle"
            this.ctx.fillStyle = "#000000"
            this.ctx.fillText(pixel.text, screenX + screenSize / 2, screenY + screenSize * 0.55)
        }
    }

    /**
     * Converts screen coordinates to grid coordinate as a Coordinate type
     */
    public screenToGridCoordinate(screenX: number, screenY: number): Coordinate {
        const gridX = Math.floor((screenX - this.offsetX) / (this.zoom * this.options.cellSize))
        const gridY = Math.floor((screenY - this.offsetY) / (this.zoom * this.options.cellSize))
        return [gridX, gridY]
    }

    /**
     * Gets the current zoom level
     */
    public getZoom(): number {
        return this.zoom
    }

    /**
     * Gets the current visible bounds
     */
    public getBounds(): Bounds {
        const topLeft = this.screenToGridCoordinate(0, 0)
        const bottomRight = this.screenToGridCoordinate(this.canvas.width, this.canvas.height)
        return [topLeft, bottomRight]
    }

    /**
     * Sets the zoom level
     */
    public setZoom(zoom: number): void {
        if (this.zoom !== zoom) {
            // Set zoom level first
            this.zoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, zoom))

            this.core.events.emit("zoomChanged", this.zoom)
        }
    }

    /**
     * Gets the center position in grid coordinates
     */
    private getCenter(): Coordinate {
        const centerX = Math.floor((this.canvas.width / 2 - this.offsetX) / (this.zoom * this.options.cellSize))
        const centerY = Math.floor((this.canvas.height / 2 - this.offsetY) / (this.zoom * this.options.cellSize))
        return [centerX, centerY]
    }

    /**
     * Centers the viewport on the specified coordinate
     */
    public setCenter(newCenter: Coordinate): void {
        if (this.getCenter() !== newCenter) {
            // Then calculate the offset needed to center on the specified coordinates
            this.offsetX = this.canvas.width / 2 - newCenter[0] * this.options.cellSize * this.zoom
            this.offsetY = this.canvas.height / 2 - newCenter[1] * this.options.cellSize * this.zoom

            this.updateCenter()
            this.updateBounds()
        }
    }

    // Update this.center and emit event, if applicable
    private updateCenter(): void {
        const currentCenter = this.center
        const newCenter = this.getCenter()
        if (!areCoordinatesEqual(currentCenter, newCenter)) {
            this.center = newCenter
            this.core.events.emit("centerChanged", newCenter)
        }
    }

    private updateZoom(newZoom: number): void {
        const currentZoom = this.zoom
        if (currentZoom !== newZoom) {
            this.zoom = newZoom
            this.core.events.emit("zoomChanged", newZoom)
        }
    }

    private updateBounds(): void {
        const currentBounds = this.bounds
        const newBounds = this.getBounds()
        if (!areBoundsEqual(currentBounds, newBounds)) {
            this.bounds = newBounds
            this.core.events.emit("boundsChanged", newBounds)
        }
    }
}
