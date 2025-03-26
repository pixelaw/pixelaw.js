export const ZOOM_TILEMODE = 3000
export const ZOOM_FACTOR = 100
export const ZOOM_MAX = 30000 // 100 pixels per cell side
export const ZOOM_MIN = 50 // 0.5 pixels per cell side
export const ZOOM_SCALEFACTOR = 1.1

export const ZOOM_CLOSE_MIN = 30000
export const ZOOM_CLOSE_MAX = 20000
export const ZOOM_MID_MAX = 3000
export const ZOOM_FAR_MAX = 50

export const ZOOM_CLOSE = 0
export const ZOOM_MID = 1
export const ZOOM_FAR = 2

export type ZOOM_LEVEL = "far" | "mid" | "close"

export function getZoomLevel(zoom: number): ZOOM_LEVEL {
    if (zoom < ZOOM_MID_MAX) return "far"
    if (zoom < ZOOM_CLOSE_MAX) return "mid"
    return "close"
}
