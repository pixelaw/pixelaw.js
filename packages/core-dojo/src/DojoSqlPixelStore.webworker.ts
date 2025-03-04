import {parseText} from "./utils/utils.ts"

self.onmessage = async (event) => {
    const query = event.data.query
    const toriiUrl = event.data.toriiUrl

    try {
        const result: Record<string, any> = {}
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
            const pixel = { color, x, y, text, action }
            const key = `${x}_${y}`
            result[key] = pixel
        }

        self.postMessage({ success: true, data: result })
    } catch (error) {
        // @ts-ignore
        self.postMessage({ success: false, error: error.message })
    }
}
