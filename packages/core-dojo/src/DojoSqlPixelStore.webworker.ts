import type {Pixel} from "./generated/models.gen.ts"

function numberToUtf16String(num: number): string {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    view.setUint32(0, num)

    const decoder = new TextDecoder("utf-16")
    return decoder.decode(buffer)
}

function utf16StringToNumber(str: string): number {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(str)

    if (encoded.length > 4) {
        throw new Error("Input string is too long to convert to a 32-bit number.")
    }

    const buffer = new Uint8Array(4)
    buffer.set(encoded, 4 - encoded.length)

    const view = new DataView(buffer.buffer)
    return view.getUint32(0)
}

function parseText(str: string): string {
    if (!str.length) return str

    // The string now contains hex representing utf8 codepoints
    // Convert hex string to a Uint8Array
    const bytes = new Uint8Array(str.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    // Decode the byte array to a string using UTF-8
    const decoder = new TextDecoder("utf-8")
    return decoder.decode(bytes)
}

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
            const x = d[2] >> 16
            const y = d[2] & 0xffff
            const text = parseText(d[1])
            // const text = numberToUtf16String(utf16StringToNumber("😍"))
            const pixel = { color, x, y, text } as Pixel
            const key = `${x}_${y}`
            result[key] = pixel
        }

        self.postMessage({ success: true, data: result })
    } catch (error) {
        // @ts-ignore
        self.postMessage({ success: false, error: error.message })
    }
}
