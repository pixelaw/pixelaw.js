
import { type Bounds, MAX_DIMENSION, QUERY_BUFFER } from "@pixelaw/core"

export function getQueryBounds(viewBounds: Bounds): Bounds {
    const [[left, top], [right, bottom]] = viewBounds
    let l = 0
    let t = 0
    let r = 0
    let b = 0

    if (left < QUERY_BUFFER) {
        l = MAX_DIMENSION + 1 - QUERY_BUFFER
    } else {
        l = left - (left % QUERY_BUFFER)
    }

    if (top < QUERY_BUFFER) {
        t = MAX_DIMENSION + 1 - QUERY_BUFFER
    } else {
        t = top - (top % QUERY_BUFFER)
    }

    if (right > MAX_DIMENSION - QUERY_BUFFER + 1) {
        r = 0
    } else {
        r = right + (QUERY_BUFFER - (right % QUERY_BUFFER))
    }

    if (bottom > MAX_DIMENSION - QUERY_BUFFER + 1) {
        b = 0
    } else {
        b = bottom + (QUERY_BUFFER - (bottom % QUERY_BUFFER))
    }

    return [
        [l, t],
        [r, b],
    ]
}

export const SUBSCRIPTION_QUERY = {
    pixelaw: {
        Pixel: {
            $: {
                where: {
                    And: [
                        { x: { $gte: 0 } },
                        { y: { $gte: 0 } },
                        { x: { $lte: MAX_DIMENSION } },
                        { y: { $lte: MAX_DIMENSION } },
                    ],
                },
            },
        },
    },
}
