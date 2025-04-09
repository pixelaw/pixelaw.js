import { type Bounds, MAX_DIMENSION, type Pixel } from "../../types"
import { numRGBAToHex } from "../../utils"
import { getZoomLevel } from "./utils"
import type Canvas2DRenderer from "./index.ts"

/**
 * Rendering methods for Canvas2DRenderer
 * This file contains all the methods related to rendering the grid and cells
 */
export class RenderingMethods {
    private renderer: Canvas2DRenderer

    constructor(renderer: Canvas2DRenderer) {
        this.renderer = renderer
    }

    /**
     * Renders the grid and cells
     */
    public render(): void {
        // Clear canvas
        this.renderer.ctx.fillStyle = this.renderer.options.backgroundColor
        this.renderer.ctx.fillRect(0, 0, this.renderer.canvas.width, this.renderer.canvas.height)

        // Draw visible cells
        this.drawCells()

        // Draw grid lines if enabled
        if (this.renderer.options.showGridLines && getZoomLevel(this.renderer.zoom) !== "far") {
            this.drawGridLines()
        }

        // Draw glowing cells last to ensure glow is on top
        this.drawGlowingCells()
    }

    private getRenderableBounds(): Bounds {
        let [[left, top], [right, bottom]] = this.renderer.getBounds()

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

        const { cellSize } = this.renderer.options

        this.renderer.ctx.strokeStyle = this.renderer.options.gridLineColor
        this.renderer.ctx.lineWidth = 1

        // Draw vertical grid lines
        for (let x = left; x <= right; x++) {
            const screenX = Math.floor(x * cellSize * this.renderer.zoom + this.renderer.offsetX) + 0.5
            this.renderer.ctx.beginPath()
            this.renderer.ctx.moveTo(screenX, top * cellSize * this.renderer.zoom + this.renderer.offsetY)
            this.renderer.ctx.lineTo(screenX, (bottom + 1) * cellSize * this.renderer.zoom + this.renderer.offsetY)
            this.renderer.ctx.stroke()
        }

        // Draw horizontal grid lines
        for (let y = top; y <= bottom; y++) {
            const screenY = Math.floor(y * cellSize * this.renderer.zoom + this.renderer.offsetY) + 0.5
            this.renderer.ctx.beginPath()
            this.renderer.ctx.moveTo(left * cellSize * this.renderer.zoom + this.renderer.offsetX, screenY)
            this.renderer.ctx.lineTo((right + 1) * cellSize * this.renderer.zoom + this.renderer.offsetX, screenY)
            this.renderer.ctx.stroke()
        }
    }

    private drawGlowingCells(): void {
        for (const [key, glow] of this.renderer.glowingCells.entries()) {
            const [x, y] = key.split(",").map(Number)
            const pixel = this.renderer.core.pixelStore.getPixel([x, y])

            if (!pixel) continue

            const { cellSize } = this.renderer.options
            const screenX = x * cellSize * this.renderer.zoom + this.renderer.offsetX
            const screenY = y * cellSize * this.renderer.zoom + this.renderer.offsetY
            const screenSize = cellSize * this.renderer.zoom

            // Apply glow effect
            this.renderer.ctx.shadowBlur = glow.size * glow.intensity
            this.renderer.ctx.shadowColor = `rgba(${glow.color[0]}, ${glow.color[1]}, ${glow.color[2]}, ${glow.intensity})`

            // Draw cell with glow
            this.renderer.ctx.fillStyle = numRGBAToHex(pixel.color as number)
            this.renderer.ctx.fillRect(screenX, screenY, screenSize, screenSize)

            // Reset shadow settings
            this.renderer.ctx.shadowBlur = 0

            // Draw the inside of the cell again
            this.drawCell(pixel)
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
                const pixel = this.renderer.core.pixelStore.getPixel([x, y])

                if (!pixel) continue
                this.drawCell(pixel)
            }
        }
    }

    /**
     * Draws a single cell
     */
    private drawCell(pixel: Pixel): void {
        const { cellSize } = this.renderer.options

        // Calculate screen coordinates
        const screenX = pixel.x * cellSize * this.renderer.zoom + this.renderer.offsetX
        const screenY = pixel.y * cellSize * this.renderer.zoom + this.renderer.offsetY
        const screenSize = cellSize * this.renderer.zoom

        // Draw cell background
        this.renderer.ctx.fillStyle = numRGBAToHex(pixel.color as number)
        this.renderer.ctx.fillRect(screenX, screenY, screenSize, screenSize)

        const zoomlevel = getZoomLevel(this.renderer.zoom)
        if (zoomlevel === "close") {
            // The icon
            const fontWeight = "300"
            this.renderer.ctx.font = `${fontWeight} ${screenSize * 0.2}px "Noto Emoji", serif`
            this.renderer.ctx.textAlign = "center"
            this.renderer.ctx.textBaseline = "middle"
            this.renderer.ctx.fillStyle = "#000000"
            this.renderer.ctx.fillText(pixel.text, screenX + screenSize / 2, screenY + screenSize * 0.55)

            // The app name
            this.renderer.ctx.font = `${fontWeight} ${screenSize * 0.2}px Arial, sans-serif`
            this.renderer.ctx.textAlign = "center"
            this.renderer.ctx.textBaseline = "middle"
            this.renderer.ctx.fillStyle = "#000000"
            this.renderer.ctx.fillText(pixel.app, screenX + screenSize / 2, screenY + screenSize * 0.1)
        } else if (zoomlevel === "mid") {
            if (!pixel.text) return
            const fontWeight = "300"
            this.renderer.ctx.font = `${fontWeight} ${screenSize * 0.8}px "Arial", serif`
            this.renderer.ctx.textAlign = "center"
            this.renderer.ctx.textBaseline = "middle"
            this.renderer.ctx.fillStyle = "#000000"
            this.renderer.ctx.fillText(pixel.text, screenX + screenSize / 2, screenY + screenSize * 0.55)
        }
    }
}
