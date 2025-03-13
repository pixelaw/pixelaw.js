import type { Dimension } from "../../types"

// biome-ignore lint/suspicious/noExplicitAny: TODO fix later
export function drawOutline(context: any, dimensions: Dimension) {
    // Draw outline
    context.beginPath()
    context.rect(0, 0, dimensions[0], dimensions[1])
    context.lineWidth = 2
    context.strokeStyle = "black"
    context.stroke()
}
