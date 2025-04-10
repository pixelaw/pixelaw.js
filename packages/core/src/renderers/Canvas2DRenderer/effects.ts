import type { Coordinate } from "../../types"
import { hexToRgb } from "../../utils"
import { GlowingCell } from "./types"
import type Canvas2DRenderer from "./index.ts"

/**
 * Effects management for Canvas2DRenderer
 * This file contains methods for managing visual effects like glowing cells and inertia
 */
export class EffectsManager {
    private renderer: Canvas2DRenderer

    constructor(renderer: Canvas2DRenderer) {
        this.renderer = renderer
    }

    /**
     * Starts a glow effect on a specific cell
     */
    public addGlow(coordinate: Coordinate, duration: number, htmlColor: string, intensity: number, size: number) {
        const rgb = hexToRgb(htmlColor)

        const key = `${coordinate[0]},${coordinate[1]}`
        const existingCell = this.renderer.glowingCells.get(key)
        if (existingCell) {
            existingCell.startTime = Date.now()
            existingCell.duration = duration
        } else {
            this.renderer.glowingCells.set(key, {
                intensity,
                duration,
                startTime: Date.now(),
                color: rgb,
                size,
            })
        }
        if (!this.renderer.glowInterval) {
            this.startGlowInterval()
        }
    }

    /**
     * Starts the interval for updating glow effects
     */
    public startGlowInterval() {
        this.renderer.glowInterval = setInterval(() => {
            const currentTime = Date.now()
            for (const [key, cell] of this.renderer.glowingCells.entries()) {
                const elapsed = currentTime - cell.startTime
                cell.intensity = Math.max(0, 1 - elapsed / cell.duration)
                if (cell.intensity <= 0) {
                    this.renderer.glowingCells.delete(key)
                }
            }

            if (this.renderer.glowingCells.size === 0) {
                clearInterval(this.renderer.glowInterval!)
                this.renderer.glowInterval = null
            }

            this.renderer.requestRender()
        }, 50) // 20fps
    }

    /**
     * Starts zoom inertia
     */
    public startZoomInertia(): void {
        if (this.renderer.zoomInertiaInterval) {
            clearInterval(this.renderer.zoomInertiaInterval)
        }

        this.renderer.zoomInertiaInterval = setInterval(() => {
            if (Math.abs(this.renderer.zoomInertiaVelocity) < 0.001) {
                clearInterval(this.renderer.zoomInertiaInterval)
                this.renderer.zoomInertiaInterval = null
                return
            }

            // Calculate new zoom level
            const newZoom = Math.max(
                this.renderer.options.minZoom,
                Math.min(this.renderer.options.maxZoom, this.renderer.zoom * (1 + this.renderer.zoomInertiaVelocity)),
            )

            // Calculate the midpoint of the canvas as the zoom center
            const midX = this.renderer.canvas.width / 2
            const midY = this.renderer.canvas.height / 2

            // Calculate world coordinates before zoom
            const worldXBefore = (midX - this.renderer.offsetX) / this.renderer.zoom
            const worldYBefore = (midY - this.renderer.offsetY) / this.renderer.zoom

            // Calculate world coordinates after zoom
            const worldXAfter = (midX - this.renderer.offsetX) / newZoom
            const worldYAfter = (midY - this.renderer.offsetY) / newZoom

            // Adjust offset to keep the midpoint fixed
            this.renderer.offsetX += (worldXAfter - worldXBefore) * newZoom
            this.renderer.offsetY += (worldYAfter - worldYBefore) * newZoom

            // Update zoom and render
            this.renderer.updateZoom(newZoom)
            this.renderer.zoomInertiaVelocity *= this.renderer.decelerationFactor // Apply deceleration

            this.renderer.requestRender()
            this.renderer.updateCenter()
            this.renderer.updateBounds()
        }, 30) // Approximately 30fps
    }

    /**
     * Starts pan inertia
     */
    public startPanInertia(): void {
        if (this.renderer.panInertiaInterval) {
            clearInterval(this.renderer.panInertiaInterval)
        }

        if (Math.abs(this.renderer.panInertiaVelocity[0]) < 4 && Math.abs(this.renderer.panInertiaVelocity[1]) < 4)
            return

        this.renderer.panInertiaInterval = setInterval(() => {
            // Apply velocity to offset
            this.renderer.offsetX += this.renderer.panInertiaVelocity[0]
            this.renderer.offsetY += this.renderer.panInertiaVelocity[1]

            // Decelerate
            this.renderer.panInertiaVelocity[0] *= this.renderer.decelerationFactor
            this.renderer.panInertiaVelocity[1] *= this.renderer.decelerationFactor

            // Stop inertia when velocity is low
            if (
                Math.abs(this.renderer.panInertiaVelocity[0]) < 0.01 &&
                Math.abs(this.renderer.panInertiaVelocity[1]) < 0.01
            ) {
                clearInterval(this.renderer.panInertiaInterval)
                this.renderer.panInertiaInterval = null
            }

            // Render with new offset
            this.renderer.requestRender()
            this.renderer.updateCenter()
            this.renderer.updateBounds()
        }, 30) // Approximately 30fps
    }

    public addNotification(coordinate: Coordinate, duration: number, text: string): void {
        const key = `${coordinate[0]},${coordinate[1]}`
        // this.renderer.activeNotifications.set(key, {
        //     startTime: Date.now(),
        //     duration,
        //     text,
        // })

        if (!this.renderer.glowInterval) {
            this.startGlowInterval()
        }
    }
}
