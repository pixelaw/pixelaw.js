import type { Bounds } from "./types.ts"

export function areBoundsEqual(boundsA: Bounds, boundsB: Bounds): boolean {
    // Compare top-left coordinates
    if (boundsA[0][0] !== boundsB[0][0] || boundsA[0][1] !== boundsB[0][1]) {
        return false
    }
    // Compare bottom-right coordinates
    if (boundsA[1][0] !== boundsB[1][0] || boundsA[1][1] !== boundsB[1][1]) {
        return false
    }
    return true
}

export function sleepMs(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
