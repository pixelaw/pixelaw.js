// TODO technically this is only 248bits randomness..
export function generateRandomFelt252(): bigint {
    let randomBytes: Uint8Array

    if (typeof window !== "undefined" && window.crypto) {
        // Browser environment
        randomBytes = new Uint8Array(31)
        window.crypto.getRandomValues(randomBytes)
    } else {
        // Node.js environment
        const crypto = require("node:crypto")
        randomBytes = crypto.randomBytes(31)
    }

    return BigInt(
        `0x${Array.from(randomBytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}`,
    )
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// takes a "0x000000000000000000" string and turns it into utf8 emoji
export function convertFullHexString(str) {
    // debugger
    const result = str.replace("0x", "").replace(/^0+/, "")
    if (!result.length) return ""
    const r = parseText(result)
    console.log("r", r, str.length)
    return r
}

export function parseText(str: string): string {
    if (!str.length) return str

    // The string now contains hex representing utf8 codepoints
    // Convert hex string to a Uint8Array
    const bytes = new Uint8Array(str.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    // Decode the byte array to a string using UTF-8
    const decoder = new TextDecoder("utf-8")
    return decoder.decode(bytes)
}

export function convertTextToHex(str: string): string {
    if (!str.length) return str

    // Encode the string to a Uint8Array using UTF-8
    const encoder = new TextEncoder()
    const bytes = encoder.encode(str)

    // Convert the byte array to a hex string
    return `0x${Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")}`
}
