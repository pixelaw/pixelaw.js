import {poseidonHashMany} from "@scure/starknet" // TODO: change SALT to a dynamic constant
import type {AbiType, Coordinate, EnumType, ParamDefinitionType} from "./types.ts"

// TODO: change SALT to a dynamic constant
const SALT = 12345

const PREFIX = "pixelaw"

const setStorage = (appName: string, paramName: string, position: Coordinate, value: Record<string, number>) => {
    const storageKey = `${PREFIX}::${appName}::${position[0]}::${position[1]}::${paramName}`
    localStorage.setItem(storageKey, JSON.stringify(value))
}

const getStorage = (appName: string, paramName: string, position: { x: number; y: number }, key: string) => {
    const storageKey = `${PREFIX}::${appName}::${position.x}::${position.y}::${paramName}`
    const storageItem = localStorage.getItem(storageKey)
    if (!storageItem) return null

    const parsedItem = JSON.parse(storageItem)
    return parsedItem[key] as number
}

const isPrimitive = (type: string) => {
    return (
        type === "u8" ||
        type === "u16" ||
        type === "u32" ||
        type === "u64" ||
        type === "u128" ||
        type === "u256" ||
        type === "usize" ||
        type === "bool" ||
        type === "felt252"
    )
}

export const isInstruction = (paramName: string) => {
    const [instruction, ...otherValues] = paramName.split("_")
    switch (instruction) {
        case "cr":
            return otherValues.length === 2
        case "rv":
        case "rs":
            return otherValues.length === 1
        default:
            return false
    }
}

type InterpretType = (
    appName: string,
    position: Coordinate,
    typeInstruction: string,
    abi: AbiType,
) => ParamDefinitionType

export const interpret: InterpretType = (
    appName: string,
    position: Coordinate,
    typeInstruction: string,
    abi: AbiType,
) => {
    const [instruction, ...otherValues] = typeInstruction.split("_")
    switch (instruction) {
        case "cr": {
            let finalizedType: "number" | "string" | "enum" = "number"
            const [type, name] = otherValues
            let variants: { name: string; value: number }[] = []
            if (!isPrimitive(type)) {
                // for now assuming that all nonPrimitives are enums
                const typeDefinition: EnumType | undefined = abi.find(
                    (typeDef) => typeDef.name.includes(type) && typeDef.type === "enum",
                ) as unknown as EnumType | undefined
                if (!typeDefinition) throw new Error(`unknown type definition: ${type}`)
                variants = typeDefinition.variants
                    .map((variant, index) => {
                        return {
                            name: variant.name,
                            value: index,
                        }
                    })
                    .filter((variant) => variant.name !== "None")
                finalizedType = "enum"
            } else if (type === "felt252") finalizedType = "string"
            return {
                value: undefined,
                name,
                transformValue: (value: number) => {
                    setStorage(appName, name, position, { value, salt: SALT })
                    return poseidonHashMany([BigInt(value), BigInt(SALT)])
                },
                variants,
                type: finalizedType,
            }
        }

        case "rv": {
            const [name] = otherValues
            return {
                transformValue: undefined,
                name,
                variants: [],
                type: "number",
                value: getStorage(appName, name, position, "value") ?? 0,
            }
        }

        case "rs": {
            const [name] = otherValues
            return {
                transformValue: undefined,
                name,
                variants: [],
                type: "number",
                value: getStorage(appName, name, position, "salt") ?? 0,
            }
        }

        default:
            throw new Error(`unknown instruction: ${typeInstruction}`)
    }
}

export default interpret
