import { type Canvas, type CanvasRenderingContext2D, createCanvas } from "canvas"
import type { Bounds, Coordinate, PixelCoreEvents, PixelStore, TileStore } from "../../types.ts"
import { ZOOM_MAX, ZOOM_MIN, ZOOM_SCALEFACTOR, ZOOM_TILEMODE } from "./constants.ts"
import { drawGrid } from "./drawGrid.ts"
import { drawOutline } from "./drawOutline.ts"
import { drawPixels } from "./drawPixels.ts"
import { applyWorldOffset, cellForPosition, getCellSize, handlePixelChanges } from "./utils.ts"

import type { Emitter } from "mitt"

export abstract class AbstractCanvas2DRenderer {
    protected pixelOffset: Coordinate = [0, 0]
    protected worldOffset: Coordinate = [0, 0]
    protected hoveredCell: Coordinate | undefined
    protected lastDragPoint: Coordinate = [0, 0]
    protected dragStart = 0
    protected dragStartPoint: Coordinate | null = null
    protected tileStore: TileStore
    protected pixelStore: PixelStore
    protected zoom = 2000
    protected center: Coordinate = [0, 0]
    protected pixelCoreEvents: Emitter<PixelCoreEvents>
    protected isRendering = false
    protected initialPinchDistance: number | null = null
    protected initialZoom: number = this.zoom

    constructor(
        pixelCoreEvents: Emitter<PixelCoreEvents>,
        tileStore: TileStore,
        pixelStore: PixelStore,
        initialZoom: number,
        initialCenter: Coordinate,
    ) {
        this.prepareCanvas()
        // this.canvas = createCanvas(800, 600)
        // this.bufferCanvas = createCanvas(800, 600)
        //
        // this.context = this.canvas.getContext("2d")
        // this.bufferContext = this.bufferCanvas.getContext("2d")
        this.tileStore = tileStore
        this.pixelStore = pixelStore
        this.pixelCoreEvents = pixelCoreEvents

        this.setZoom(initialZoom)
        this.setCenter(initialCenter)

        this.subscribeToEvents()
        this.requestRender()
    }

    protected abstract prepareCanvas()
    protected abstract requestRender()
    protected abstract render()
    protected abstract getCanvasDimensions(): number[]

    protected subscribeToEvents() {
        if (!this.pixelStore) throw new Error("PixelStore not initialized")

        this.pixelStore.eventEmitter.on("cacheUpdated", (_timestamp: number) => {
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

    private calculateCenter(): Coordinate {
        const [width, height] = this.getCanvasDimensions()

        const viewportCenter: Coordinate = [width / 2, height / 2]
        const adjustedCenter: Coordinate = [
            viewportCenter[0] + this.pixelOffset[0],
            viewportCenter[1] + this.pixelOffset[1],
        ]
        const centerCell = cellForPosition(this.zoom, [0, 0], adjustedCenter)
        return applyWorldOffset(this.worldOffset, centerCell)
    }

    private calculateWorldViewBounds(): Bounds {
        const [canvasWidth, canvasHeight] = this.getCanvasDimensions()
        const topLeft = applyWorldOffset(this.worldOffset, [0, 0])
        const bottomRightCell = cellForPosition(this.zoom, this.pixelOffset, [canvasWidth, canvasHeight])
        const bottomRight = applyWorldOffset(this.worldOffset, bottomRightCell)
        return [topLeft, bottomRight]
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
}
