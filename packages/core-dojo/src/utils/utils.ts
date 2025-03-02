export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// takes a "0x000000000000000000" string and turns it into utf8 emoji
export function convertFullHexString(str) {
    const result = str.replace("0x", "").replace(/^0+/, "")
    if (!result.length) return ""
    return parseText(result)
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
