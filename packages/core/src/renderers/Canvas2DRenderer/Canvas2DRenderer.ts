import type { Bounds, Coordinate, PixelCoreEvents, PixelStore, TileStore } from "../../types.ts"
import { ZOOM_MAX, ZOOM_MIN, ZOOM_SCALEFACTOR, ZOOM_TILEMODE } from "./constants.ts"
import { drawGrid } from "./drawGrid.ts"
import { drawOutline } from "./drawOutline.ts"
import { drawPixels } from "./drawPixels.ts"
import { applyWorldOffset, cellForPosition, getCellSize, handlePixelChanges } from "./utils.ts"

import type { Emitter } from "mitt"

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined"

export class Canvas2DRenderer {
    private canvas: any
    private context: CanvasRenderingContext2D | null
    private bufferCanvas: any
    private bufferContext: CanvasRenderingContext2D | null
    private pixelOffset: Coordinate = [0, 0]
    private worldOffset: Coordinate = [0, 0]
    private hoveredCell: Coordinate | undefined
    // private worldView: Bounds = [
    //     [0, 0],
    //     [0, 0],
    // ]

    private lastDragPoint: Coordinate = [0, 0]
    private dragStart = 0
    private dragStartPoint: Coordinate | null = null
    private tileStore: TileStore
    private pixelStore: PixelStore
    private zoom = 2000
    private center: Coordinate = [0, 0]
    private pixelCoreEvents: Emitter<PixelCoreEvents>
    private isRendering = false
    private initialPinchDistance: number | null = null
    private initialZoom: number = this.zoom

    constructor(
        pixelCoreEvents: Emitter<PixelCoreEvents>,
        tileStore: TileStore,
        pixelStore: PixelStore,
        initialZoom: number,
        initialCenter: Coordinate,
    ) {
        if (isBrowser) {
            this.canvas = document.createElement("canvas")
            this.bufferCanvas = document.createElement("canvas")
            this.setZoom(initialZoom)
            this.setCenter(initialCenter)
            this.setupEventListeners()
            this.context = this.canvas.getContext("2d")
            this.bufferContext = this.bufferCanvas.getContext("2d")


        } else {
            import("canvas").then(({ createCanvas }) => {
                this.canvas = createCanvas(800, 600) // Default size, adjust as needed
                this.bufferCanvas = createCanvas(800, 600)
                this.setZoom(initialZoom)
                this.setCenter(initialCenter)
                this.subscribeToEvents()
                this.requestRender()
            })

        }
        this.tileStore = tileStore
        this.pixelStore = pixelStore
        this.pixelCoreEvents = pixelCoreEvents




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
        this.pixelStore.prepare(this.calculateWorldViewBounds())
        this.pixelStore.refresh()
        this.requestRender()
    }

    private subscribeToEvents() {
        if (!this.pixelStore) throw new Error("PixelStore not initialized")
        // TODO decide on whether pixelstore cacheupdated goes to a global event bus or not
        this.pixelStore.eventEmitter.on("cacheUpdated", (timestamp: number) => {
            this.requestRender()
        })

        this.pixelCoreEvents.on("pixelStoreUpdated", (timestamp: number) => {
            console.log(`pixelStoreUpdated at: ${timestamp}`)

            this.requestRender()
        })
        this.pixelCoreEvents.on("tileStoreUpdated", (timestamp: number) => {
            console.log(`tileStoreUpdated at: ${timestamp}`)

            this.requestRender()
        })
    }

    private setupEventListeners() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
        this.canvas.addEventListener("wheel", this.handleWheel.bind(this), { passive: false })
        this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this), { passive: false })

        // Add touch event listeners for mobile support
        this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false })
        this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false })
        this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false })
    }

    private handleMouseDown(event: MouseEvent) {
        this.dragStart = Date.now()
        this.hoveredCell = undefined
        this.dragStartPoint = [event.clientX, event.clientY]
        this.lastDragPoint = [event.clientX, event.clientY]
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.dragStart) {
            const mouse: Coordinate = [event.clientX, event.clientY]
            this.drag(this.lastDragPoint, mouse)
            this.lastDragPoint = mouse
        } else {
            if (this.zoom > ZOOM_TILEMODE) {
                // Only when zoomed in, we'll handle hovered Pixel
                const rect = this.canvas.getBoundingClientRect()

                const viewportCell = cellForPosition(this.zoom, this.pixelOffset, [
                    event.clientX - rect.left,
                    event.clientY - rect.top,
                ])
                const hoveredWorldCell = applyWorldOffset(this.worldOffset, viewportCell)
                if (
                    (!this.hoveredCell && viewportCell) ||
                    (this.hoveredCell &&
                        (this.hoveredCell[0] !== hoveredWorldCell[0] || this.hoveredCell[1] !== hoveredWorldCell[1]))
                ) {
                    this.hoveredCell = hoveredWorldCell

                    this.pixelCoreEvents.emit("cellHovered", viewportCell)
                }
            }
        }
    }

    private handleMouseLeave(_event: MouseEvent) {
        this.hoveredCell = undefined
        this.pixelCoreEvents.emit("cellHovered", undefined)
    }

    private handleMouseUp(event: MouseEvent) {
        let distance = 0
        if (this.dragStartPoint !== null) {
            const startPos = this.dragStartPoint
            const endPos: Coordinate = [event.clientX, event.clientY]
            distance = Math.sqrt((endPos[0] - startPos[0]) ** 2 + (endPos[1] - startPos[1]) ** 2)
        }

        const timeDiff = Date.now() - this.dragStart
        if (timeDiff < 500 && distance < 10) {
            // It's a click
            const rect = this.canvas.getBoundingClientRect()
            const viewportCell = cellForPosition(this.zoom, this.pixelOffset, [
                event.clientX - rect.left,
                event.clientY - rect.top,
            ])
            const worldClicked = applyWorldOffset(this.worldOffset, viewportCell)

            this.pixelCoreEvents.emit("cellClicked", worldClicked)
        } else {
            // It's the end of a drag
            const mouse: Coordinate = [event.clientX, event.clientY]
            this.drag(this.lastDragPoint, mouse)
            this.setCenter(this.calculateCenter())
        }

        this.dragStart = 0
        this.dragStartPoint = null
    }

    private handleWheel(event: WheelEvent) {
        event.preventDefault()
        const rect = this.canvas.getBoundingClientRect()
        let newZoom = this.zoom

        if (event.deltaY < 0 && this.zoom < ZOOM_MAX) {
            newZoom *= ZOOM_SCALEFACTOR
        } else if (event.deltaY > 0 && this.zoom > ZOOM_MIN) {
            newZoom /= ZOOM_SCALEFACTOR
        }

        newZoom = Math.round(Math.min(Math.max(newZoom, ZOOM_MIN), ZOOM_MAX))

        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const mouseCellBeforeZoom = cellForPosition(this.zoom, this.pixelOffset, [mouseX, mouseY])
        const mouseCellAfterZoom = cellForPosition(newZoom, this.pixelOffset, [mouseX, mouseY])

        const cellDiffX = mouseCellAfterZoom[0] - mouseCellBeforeZoom[0]
        const cellDiffY = mouseCellAfterZoom[1] - mouseCellBeforeZoom[1]

        this.setZoom(newZoom)
        this.setCenter(this.calculateCenter())

        this.worldOffset = [this.worldOffset[0] + cellDiffX, this.worldOffset[1] + cellDiffY]
        this.requestRender()
    }

    private handleTouchStart(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.handleMouseDown(event.touches[0] as unknown as MouseEvent)
        } else if (event.touches.length === 2) {
            event.preventDefault()
            const [touch1, touch2] = Array.from(event.touches)
            this.initialPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            this.initialZoom = this.zoom
        }
    }

    private handleTouchMove(event: TouchEvent) {
        if (event.touches.length === 1) {
            this.handleMouseMove(event.touches[0] as unknown as MouseEvent)
        } else if (event.touches.length === 2 && this.initialPinchDistance !== null) {
            event.preventDefault()
            const [touch1, touch2] = Array.from(event.touches)
            const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

            const scaleFactor = currentDistance / this.initialPinchDistance
            let newZoom = Math.round(this.initialZoom * scaleFactor)

            // Ensure the new zoom level does not exceed ZOOM_MAX
            newZoom = Math.min(Math.max(newZoom, ZOOM_MIN), ZOOM_MAX)

            // Calculate the midpoint between the two touch points
            const rect = this.canvas.getBoundingClientRect()
            const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left
            const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top

            // Calculate mouse cells before and after zoom
            const mouseCellBeforeZoom = cellForPosition(this.zoom, this.pixelOffset, [midX, midY])
            const mouseCellAfterZoom = cellForPosition(newZoom, this.pixelOffset, [midX, midY])

            const cellDiffX = mouseCellAfterZoom[0] - mouseCellBeforeZoom[0]
            const cellDiffY = mouseCellAfterZoom[1] - mouseCellBeforeZoom[1]

            this.setZoom(newZoom)
            this.worldOffset = [this.worldOffset[0] + cellDiffX, this.worldOffset[1] + cellDiffY]
            this.requestRender()
        }
    }

    private handleTouchEnd(event: TouchEvent) {
        if (event.touches.length === 0) {
            // Reset pinch-related variables when all touches are lifted
            this.initialPinchDistance = null
            this.initialZoom = this.zoom
        } else if (event.touches.length === 1) {
            // Handle as a mouse up event if there's still one touch remaining
            this.handleMouseUp(event.touches[0] as unknown as MouseEvent)
        }
    }

    private render() {
        if (!this.context || !this.bufferContext) return

        this.prepareCanvas()

        // drawTiles(
        //     this.bufferContext,
        //     this.zoom,
        //     this.pixelOffset,
        //     [this.canvas.width, this.canvas.height],
        //     this.worldOffset,
        //     this.tileStore.tileset!,
        // )
        drawPixels(
            this.bufferContext,
            this.zoom,
            this.pixelOffset,
            [this.canvas.width, this.canvas.height],
            this.worldOffset,
            this.hoveredCell,
            this.pixelStore,
        )
        drawOutline(this.bufferContext, [this.canvas.width, this.canvas.height])
        drawGrid(this.bufferContext, this.zoom, this.pixelOffset, [this.canvas.width, this.canvas.height])
        this.context.drawImage(this.bufferCanvas, 0, 0)
    }

    private prepareCanvas() {
        const width = this.canvas.width
        const height = this.canvas.height

        if (!this.context || !this.bufferContext) return

        // These lines are needed, otherwise an interesting ghosting effect..
        this.canvas.width = width
        this.canvas.height = height

        this.context.imageSmoothingEnabled = false

        this.bufferCanvas.width = width
        this.bufferCanvas.height = height
        this.bufferContext.imageSmoothingEnabled = false

        this.bufferContext.clearRect(0, 0, width, height)
    }

    private calculateCenter(): Coordinate {
        const width = this.canvas.width
        const height = this.canvas.height
        const viewportCenter: Coordinate = [width / 2, height / 2]
        const adjustedCenter: Coordinate = [
            viewportCenter[0] + this.pixelOffset[0],
            viewportCenter[1] + this.pixelOffset[1],
        ]
        const centerCell = cellForPosition(this.zoom, [0, 0], adjustedCenter)
        return applyWorldOffset(this.worldOffset, centerCell)
    }

    private calculateWorldViewBounds(): Bounds {
        const topLeft = applyWorldOffset(this.worldOffset, [0, 0])
        const bottomRightCell = cellForPosition(this.zoom, this.pixelOffset, [this.canvas.width, this.canvas.height])
        const bottomRight = applyWorldOffset(this.worldOffset, bottomRightCell)
        return [topLeft, bottomRight]
    }

    private drag(lastDragPoint: Coordinate, mouse: Coordinate) {
        const cellWidth = getCellSize(this.zoom)
        const [newPixelOffset, newWorldOffset] = handlePixelChanges(
            [...this.pixelOffset],
            [...this.worldOffset],
            [lastDragPoint[0] - mouse[0], lastDragPoint[1] - mouse[1]],
            cellWidth,
        )

        this.pixelOffset = newPixelOffset
        this.worldOffset = newWorldOffset
        this.requestRender()
    }

    public setZoom(newZoom: number) {
        if (this.zoom === newZoom || newZoom < 500) return
        this.zoom = newZoom
        this.pixelCoreEvents.emit("zoomChanged", newZoom)
    }

    public setCenter(newCenter: Coordinate) {
        if (this.center === newCenter) return
        this.center = newCenter
        this.pixelCoreEvents.emit("centerChanged", newCenter)
        this.pixelStore.prepare(this.calculateWorldViewBounds())
        this.pixelStore.refresh()
        this.requestRender()
    }

    // private setWorldView(newBounds: Bounds) {
    //     this.worldView = newBounds
    //     this.pixelCoreEvents.emit("worldViewChanged", newBounds)
    // }

    public destroy() {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this))
        this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this))
        this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this))
        this.canvas.removeEventListener("wheel", this.handleWheel.bind(this))
    }
}
