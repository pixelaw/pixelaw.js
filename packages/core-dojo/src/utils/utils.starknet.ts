import type { App } from "@pixelaw/core" // BEWARE: it seems that using this in a service/webworker crashes with error:
import { type BigNumberish, type RpcProvider, shortString } from "starknet"
import type { SimpleContract } from "../types.ts"
// BEWARE: it seems that using this in a service/webworker crashes with a "global not found" ponycode error

export async function getClass(provider: RpcProvider, system: BigNumberish): Promise<any> {
    const ch = await provider.getClassHashAt(system)
    return await provider.getClass(ch)
}

export async function getAbi(provider: RpcProvider, app: App): Promise<SimpleContract> {
    let name = felt252ToString(app.name).toLowerCase()

    const cl = await getClass(provider, app.system)

    const tag = `pixelaw-${name}_actions`
    name = `pixelaw::apps::${name}::app::${name}_actions`

    return {
        kind: "DojoContract",
        address: app.system,
        abi: cl.abi,
        name,
        tag,
    }
}

export const felt252ToString = (felt252Input: string | number | bigint) => {
    let result = felt252Input

    if (typeof result === "bigint" || typeof result === "object") {
        result = `0x${result.toString(16)}`
    }
    if (result === "0x0" || result === "0") return ""
    if (typeof result === "string") {
        try {
            // biome-ignore lint/suspicious/noControlCharactersInRegex: Somehow null characters are in the string
            return shortString.decodeShortString(result).replace(/^\u0000+/, "")
        } catch (e) {
            return result
        }
    }
    return result.toString()
}

export const formatAddress = (address: string) => {
    if (address.length > 30) {
        return `${address.substr(0, 6)}...${address.substr(address.length - 4, address.length)}`
    }

    return address
}
export const felt252ToUnicode = (felt252: string | number) => {
    const string = felt252ToString(felt252)
    if (string.includes("U+")) {
        const text = string.replace("U+", "")
        const codePoint = Number.parseInt(text, 16)
        return String.fromCodePoint(codePoint)
    }
    return string
}
