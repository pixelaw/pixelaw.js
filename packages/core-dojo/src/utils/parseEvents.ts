import type { Pixel } from "@pixelaw/core"
import { type BigNumberish, type LegacyContractClass, type RpcProvider, shortString } from "starknet"

import { convertFullHexString } from "./utils.ts"
export function parseEventsFromSimulation(modelId, json): Pixel[] {
    const invocation = json[0].transaction_trace.execute_invocation.calls

    const extractEvents = (calls) => {
        return calls.reduce((events, call) => {
            if (call.events && call.events.length > 0) {
                const pixelEvents = call.events.filter((e) => {
                    return e.keys.includes(modelId)
                })
                events = events.concat(pixelEvents)
            }
            if (call.calls && call.calls.length > 0) {
                events = events.concat(extractEvents(call.calls))
            }
            return events
        }, [])
    }

    const events = extractEvents(invocation)

    const pixels = events.map((e) => {
        const ret = {
            x: Number.parseInt(e.data[1], 16),
            y: Number.parseInt(e.data[2]),
            app: e.data[4],
            color: e.data[5],
            created_at: Number.parseInt(e.data[6]),
            updated_at: Number.parseInt(e.data[7]),
            timestamp: Number.parseInt(e.data[8]),
            owner: e.data[9],
            text: convertFullHexString(e.data[10]),
            action: shortString.decodeShortString(e.data[11]),
        } as Pixel
        return ret
    })

    return pixels
}
