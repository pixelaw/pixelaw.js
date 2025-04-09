import { type ZOOM_LEVEL, ZOOM_MID_MAX, ZOOM_CLOSE_MAX } from "./types"

/**
 * Determines the zoom level based on the current zoom value
 */
export function getZoomLevel(zoom: number): ZOOM_LEVEL {
    if (zoom < ZOOM_MID_MAX) return "far"
    if (zoom < ZOOM_CLOSE_MAX) return "mid"
    return "close"
}
