import { parseText } from "./utils/utils.ts"

let postMessageFunction

if (typeof self !== "undefined") {
    // Browser environment
    postMessageFunction = globalThis.self.postMessage.bind(globalThis.self)
    globalThis.self.onmessage = handleMessage
} else {
    // Node.js environment
    const { parentPort } = await import("node:worker_threads")
    if (parentPort) {
        postMessageFunction = (message) => parentPort.postMessage(message)
        parentPort.on("message", handleMessage)
    }
}

async function handleMessage(event) {
    const data = event.data ? event.data : event
    const query = data.query
    const toriiUrl = data.toriiUrl

    try {
        const result = {}
        const response = await fetch(`${toriiUrl}/sql?query=${query}`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const json = await response.json()

        for (const j of json) {
            const d = JSON.parse(j.d)
            const color = d[0]
            const x = d[3] >> 16
            const y = d[3] & 0xffff
            const text = parseText(d[1])
            const action = parseText(d[2])
            const app = parseText(d[4])
            const pixel = { color, x, y, text, action, app }
            const key = `${x}_${y}`
            result[key] = pixel
        }

        postMessageFunction({ success: true, data: result })
    } catch (error) {
        postMessageFunction({ success: false, error: error.message })
    }
}
