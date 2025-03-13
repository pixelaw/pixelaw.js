import { type Canvas, type CanvasRenderingContext2D, createCanvas } from "canvas"
import type { Bounds, Coordinate, PixelCoreEvents, PixelStore, TileStore } from "../../types.ts"
import { ZOOM_MAX, ZOOM_MIN, ZOOM_SCALEFACTOR, ZOOM_TILEMODE } from "./constants.ts"
import { drawGrid } from "./drawGrid.ts"
import { drawOutline } from "./drawOutline.ts"
import { drawPixels } from "./drawPixels.ts"
import { applyWorldOffset, cellForPosition, getCellSize, handlePixelChanges } from "./utils.ts"

import type { Emitter } from "mitt"
import { AbstractCanvas2DRenderer } from "./AbstractCanvas2DRenderer.ts"

export class NodeCanvas2DRenderer extends AbstractCanvas2DRenderer {
    protected canvas: Canvas
    protected context: CanvasRenderingContext2D | null
    protected bufferCanvas: Canvas
    protected bufferContext: CanvasRenderingContext2D | null

    protected getCanvasDimensions(): number[] {
        return [this.canvas.width, this.canvas.height]
    }

    protected render() {
        if (!this.context || !this.bufferContext) return

        this.prepareCanvas()

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

    protected requestRender() {
        if (!this.isRendering) {
            this.isRendering = true
            setImmediate(() => {
                this.render()
                this.isRendering = false
            })
        }
    }

    protected prepareCanvas() {
        const width = this.canvas.width
        const height = this.canvas.height

        if (!this.context || !this.bufferContext) return

        this.canvas.width = width
        this.canvas.height = height

        this.context.imageSmoothingEnabled = false

        this.bufferCanvas.width = width
        this.bufferCanvas.height = height
        this.bufferContext.imageSmoothingEnabled = false

        this.bufferContext.clearRect(0, 0, width, height)
    }
}
