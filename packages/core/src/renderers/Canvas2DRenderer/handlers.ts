import type { Coordinate } from "../../types"
import type Canvas2DRenderer from "./index.ts"

/**
 * Event handlers for Canvas2DRenderer
 * This file contains all the event handlers for mouse and touch interactions
 */
export class EventHandlers {
    private renderer: Canvas2DRenderer

    constructor(renderer: Canvas2DRenderer) {
        this.renderer = renderer
    }

    /**
     * Initializes event listeners for user interaction
     */
    public initEventListeners(): void {
        // Mouse wheel for zooming
        this.renderer.canvas.addEventListener("wheel", this.handleWheel.bind(this))

        // Mouse events for panning
        this.renderer.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        this.renderer.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
        this.renderer.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this))
        this.renderer.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this))

        // Touch events for mobile
        this.renderer.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this))
        this.renderer.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this))
        this.renderer.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this))
    }

    /**
     * Handles mouse wheel events for zooming
     */
    public handleWheel(event: WheelEvent): void {
        event.preventDefault()

        // Calculate zoom center (mouse position)
        const rect = this.renderer.canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        // Calculate world coordinates before zoom
        const worldXBefore = (mouseX - this.renderer.offsetX) / this.renderer.zoom
        const worldYBefore = (mouseY - this.renderer.offsetY) / this.renderer.zoom

        // Update zoom level
        const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1
        this.renderer.zoomInertiaVelocity = (zoomDelta - 1) * 0.1 // Adjust multiplier for desired speed

        const newZoom = Math.max(
            this.renderer.options.minZoom,
            Math.min(this.renderer.options.maxZoom, this.renderer.zoom * zoomDelta),
        )

        // Calculate world coordinates after zoom
        const worldXAfter = (mouseX - this.renderer.offsetX) / newZoom
        const worldYAfter = (mouseY - this.renderer.offsetY) / newZoom

        // Adjust offset to keep the point under the mouse fixed
        this.renderer.offsetX += (worldXAfter - worldXBefore) * newZoom
        this.renderer.offsetY += (worldYAfter - worldYBefore) * newZoom

        this.renderer.updateZoom(newZoom)
        this.renderer.updateCenter()
        this.renderer.updateBounds()

        this.renderer.requestRender()
        this.renderer.effects.startZoomInertia()
    }

    /**
     * Handles mouse down events for panning
     */
    public handleMouseDown(event: MouseEvent): void {
        event.preventDefault()
        clearInterval(this.renderer.panInertiaInterval)
        this.renderer.panInertiaInterval = null

        this.renderer.dragStartTime = Date.now()
        this.renderer.dragStartCoord = [event.clientX, event.clientY]
        this.renderer.lastDragPoint = [event.clientX, event.clientY]

        // this.renderer.canvas.style.cursor = "grabbing"
    }

    /**
     * Handles mouse move events for panning
     */
    public handleMouseMove(event: MouseEvent): void {
        // TODO when doing hover effects, this has to be changed
        if (!this.renderer.dragStartTime) return

        const currentTime = Date.now()
        const timeDiff = currentTime - this.renderer.lastDragTime
        this.renderer.lastDragTime = currentTime

        // Calculate the distance moved
        const deltaX = event.clientX - this.renderer.lastDragPoint[0]
        const deltaY = event.clientY - this.renderer.lastDragPoint[1]

        // Update last mouse position
        this.renderer.lastDragPoint = [event.clientX, event.clientY]

        // Update offset
        this.renderer.offsetX += deltaX
        this.renderer.offsetY += deltaY

        // Calculate velocity based on the change in position and time
        if (timeDiff > 0) {
            this.renderer.panInertiaVelocity = [(deltaX / timeDiff) * 15, (deltaY / timeDiff) * 15]
            // console.log("velo", this.renderer.panInertiaVelocity)
        }

        // Render with new offset
        this.renderer.requestRender()

        this.renderer.updateCenter()
        this.renderer.updateBounds()
        event.preventDefault()
    }

    /**
     * Handles mouse up events for panning
     */
    public handleMouseUp(event: MouseEvent): void {
        let totalDistance = 0
        const timeDiff = Date.now() - this.renderer.dragStartTime

        if (this.renderer.dragStartCoord !== null) {
            const startPos = this.renderer.dragStartCoord
            const endPos: Coordinate = [event.clientX, event.clientY]
            totalDistance = Math.sqrt((endPos[0] - startPos[0]) ** 2 + (endPos[1] - startPos[1]) ** 2)

            const deltaX = event.clientX - this.renderer.lastDragPoint[0]
            const deltaY = event.clientY - this.renderer.lastDragPoint[1]

            // Update last mouse position
            this.renderer.lastDragPoint = [event.clientX, event.clientY]

            // Update offset
            this.renderer.offsetX += deltaX
            this.renderer.offsetY += deltaY

            // Start inertia
            this.renderer.effects.startPanInertia()
        }

        if (timeDiff > 10 && timeDiff < 1500 && totalDistance < 10) {
            // Click!
            const rect = this.renderer.canvas.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top

            const x = Math.floor(
                (mouseX - this.renderer.offsetX) / (this.renderer.zoom * this.renderer.options.cellSize),
            )
            const y = Math.floor(
                (mouseY - this.renderer.offsetY) / (this.renderer.zoom * this.renderer.options.cellSize),
            )

            this.renderer.core.events.emit("cellClicked", [x, y])
        }

        this.renderer.dragStartTime = 0
        this.renderer.dragStartCoord = null
    }

    /**
     * Handles touch start events for panning on mobile
     */
    public handleTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            event.preventDefault()
            this.renderer.dragStartTime = Date.now()
            this.renderer.dragStartCoord = [event.touches[0].clientX, event.touches[0].clientY]
            this.renderer.lastDragPoint = [event.touches[0].clientX, event.touches[0].clientY]
        } else if (event.touches.length === 2) {
            event.preventDefault()
            const [touch1, touch2] = Array.from(event.touches)
            this.renderer.initialPinchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY,
            )
            this.renderer.initialPinchZoom = this.renderer.zoom
        }
    }

    /**
     * Handles touch move events for panning on mobile
     */
    public handleTouchMove(event: TouchEvent): void {
        if (event.touches.length === 1 && this.renderer.dragStartTime) {
            this.handleMouseMove(event.touches[0] as unknown as MouseEvent)
        } else if (event.touches.length === 2 && this.renderer.initialPinchDistance !== null) {
            // Handle pinch move
            const [touch1, touch2] = Array.from(event.touches)

            const newPinchDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
            const pinchRatio = newPinchDistance / this.renderer.initialPinchDistance
            const newZoom = Math.max(
                this.renderer.options.minZoom,
                Math.min(this.renderer.options.maxZoom, this.renderer.initialPinchZoom * pinchRatio),
            )

            // Calculate the midpoint between the two touch points
            const rect = this.renderer.canvas.getBoundingClientRect()
            const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left
            const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top

            // Adjust offset to keep the midpoint fixed
            const worldXBefore = (midX - this.renderer.offsetX) / this.renderer.zoom
            const worldYBefore = (midY - this.renderer.offsetY) / this.renderer.zoom

            const worldXAfter = (midX - this.renderer.offsetX) / newZoom
            const worldYAfter = (midY - this.renderer.offsetY) / newZoom

            this.renderer.offsetX += (worldXAfter - worldXBefore) * newZoom
            this.renderer.offsetY += (worldYAfter - worldYBefore) * newZoom

            // TODO fix
            // Calculate zoom inertia velocity based on the change in zoom
            this.renderer.zoomInertiaVelocity = (newZoom / this.renderer.zoom - 1) * 0.1 // Adjust multiplier for desired speed

            this.renderer.updateZoom(newZoom)
            this.renderer.updateCenter()
            this.renderer.updateBounds()
            this.renderer.requestRender()
        }
    }

    /**
     * Handles touch end events for panning on mobile
     */
    public handleTouchEnd(event: TouchEvent): void {
        if (event.touches.length === 0) {
            // Reset pinch-related variables when all touches are lifted
            // TODO
            // this.renderer.initialPinchDistance = null
            // this.renderer.initialZoom = this.renderer.zoom
            const mouseEvent = { clientX: this.renderer.lastDragPoint[0], clientY: this.renderer.lastDragPoint[1] }
            this.handleMouseUp(mouseEvent as unknown as MouseEvent)
        } else if (event.touches.length === 1) {
            // Still one touch remaining after pinching
            this.renderer.dragStartTime = Date.now()
            this.renderer.dragStartCoord = [event.touches[0].clientX, event.touches[0].clientY]
            this.renderer.lastDragPoint = [event.touches[0].clientX, event.touches[0].clientY]

            this.renderer.effects.startZoomInertia()
            // Handle as a mouse up event if there's still one touch remaining
        }
    }
}
