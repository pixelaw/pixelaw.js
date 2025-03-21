import type { Coordinate, Dimension, PixelStore } from "../../types.ts"
import { ZOOM_TILEMODE } from "./constants.ts"
import { applyWorldOffset, getCellSize, numRGBAToHex } from "./utils.ts"

export function drawPixels(
    // biome-ignore lint/suspicious/noExplicitAny: TODO fix later
    context: any,
    zoom: number,
    pixelOffset: Coordinate,
    dimensions: Dimension,
    worldTranslation: Coordinate,
    _hoveredCell: Coordinate | undefined,
    pixelStore: PixelStore,
) {
    const cellSize = getCellSize(zoom)
    const gridDimensions = [Math.ceil(dimensions[0] / cellSize), Math.ceil(dimensions[1] / cellSize)]
    context.beginPath()
    const doBorder = zoom <= ZOOM_TILEMODE ? 1 : 0

    // How many pixels a cell extends offscreen
    const offsets: Coordinate = [0 - pixelOffset[0], 0 - pixelOffset[1]]

    const drawPixel = (cellX: number, cellY: number, sizeAdjustment = 0) => {
        const worldCoords = applyWorldOffset(worldTranslation, [cellX, cellY])

        const pixel = pixelStore.getPixel(worldCoords)
        if (!pixel) return

        context.fillStyle = numRGBAToHex(pixel.color as number)

        const [x, y, w, h] = getRect(offsets, cellX, cellY, cellSize, doBorder, sizeAdjustment)

        context.fillRect(x, y, w, h)

        // const emojis = ["R", "O", "😍", "😎", "🤔", "😢", "😜", "😇", "😡", "🥳"]
        // pixel.text = emojis[Math.floor(Math.random() * emojis.length)]

        if (!pixel.text) return

        const fontWeight = "300"
        context.font = `${fontWeight} ${cellSize * 0.8}px "Noto Emoji", serif`
        context.textAlign = "center"
        context.textBaseline = "middle"
        context.fillStyle = "#000000"
        context.fillText(pixel.text, x + w / 2, y + h * 0.55)
    }

    for (let x = 0; x <= gridDimensions[0]; x++) {
        for (let y = 0; y <= gridDimensions[1]; y++) {
            drawPixel(x, y)
        }
    }

    // if (hoveredCell && zoom > ZOOM_TILEMODE) {
    //     drawPixel(hoveredCell[0], hoveredCell[1], 15)
    // }
}

function getRect(
    [offsetX, offsetY]: Coordinate,
    x: number,
    y: number,
    cellSize: number,
    doBorder: number,
    sizeAdjustment: number,
): number[] {
    const startDrawingAtX = offsetX + x * cellSize
    const startDrawingAtY = offsetY + y * cellSize

    return [
        startDrawingAtX + doBorder - sizeAdjustment,
        startDrawingAtY + doBorder - sizeAdjustment,
        cellSize - doBorder + sizeAdjustment * 2,
        cellSize - doBorder + sizeAdjustment * 2,
    ]
}
