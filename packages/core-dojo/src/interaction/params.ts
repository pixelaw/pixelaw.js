import type {Manifest} from "@dojoengine/core"
import type {Param} from "@pixelaw/core"
import type {InterfaceType} from "./types.ts"

const DEFAULT_PARAMETERS_TYPE = "pixelaw::core::utils::DefaultParameters"

const isPrimitive = (type: string) => {
    return (
        type === "core::u8" ||
        type === "core::u16" ||
        type === "core::u32" ||
        type === "core::u64" ||
        type === "core::u128" ||
        type === "core::u256" ||
        type === "core::bool" ||
        type === "core::felt252"
    )
}

const convertSnakeToPascal = (snakeCaseString: string) => {
    return snakeCaseString
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
}

function findContract(manifest: Manifest, contractName: string) {
    return manifest.contracts.find((c) => c.name.includes(contractName))
}

function findInterface(abi: any[], interfaceName: string, strict?: boolean): InterfaceType | undefined {
    const methods = abi.find((x) => x.type === "interface" && x.name.includes(interfaceName)) as
        | InterfaceType
        | undefined
    if (!methods && strict) throw new Error(`unknown interface: ${interfaceName}`)
    return methods
}

function findFunctionDefinition(abi, interfaceName, methodName: string, strict?: boolean) {
    const methods = findInterface(abi, interfaceName, strict)
    if (!methods?.items) {
        if (strict) throw new Error(`no methods for interface: ${interfaceName}`)
        return []
    }

    let functionDef = methods.items.find((method) => method.name === methodName && method.type === "function")
    if (!functionDef) {
        functionDef = methods.items.find((method) => method.name === "interact" && method.type === "function")
        if (!functionDef && strict) throw new Error(`function ${methodName} not found`)
    }
    return functionDef
}

function extractParameters(functionDef: any, abi: any[]) {
    const parameters = []
    for (const input of functionDef.inputs) {
        if (input.type !== DEFAULT_PARAMETERS_TYPE) {
            parameters.push(input)
        }
    }
    return parameters
}

class NormalParam {
    constructor(
        public name: string,
        public type: string,
    ) {}
}

function paramFromName({ name, type }: Param) {
    const parts = param.name.split("_")
    if (parts.length === 1) return new NormalParam(name, type)
}

function processParams(rawParams: Param[], abi: any[]): Param[] {
    const result: Param[] = []

    for (const rawParam of rawParams) {
        const param = { ...rawParam }

        const [nameFirst, ...nameRemaining] = rawParam.name.split("_")

        // Check if the name as a prefix
        if (nameRemaining.length > 0) {
            if (nameFirst === "crc") {
                // TODO check that nameRemaining has 2 elements, for varname and vartype
                param.name = nameRemaining[0]
                param.type = nameRemaining[1]

                // TODO setup a "transformer" that, after choosing a value, encodes it and calls the right function name.
                param.transformer = (p: Param) => {
                    // TODO switch name to real function param (e.g. crc_move_Move)
                }
            } else if (nameFirst === "crv") {
                // TODO check that nameRemaining has 1 elements, for varname
                param.name = nameRemaining[0]
            } else if (nameFirst === "crs") {
                // TODO check that nameRemaining has 1 elements, for varname
                param.name = nameRemaining[0]
            } else {
                // Nothing, the name just had underscores but no special prefix
            }
        }

        // const isPrimitiveType = rawParam.type.includes("core::integer") || rawParam.type.includes("core::felt252")

        param.variants = []
        // const transformer = undefined

        if (!isPrimitive(param.type)) {
            // If the type is not a primitive, let's look for an Enum with this name
            const typeDefinition = abi.find((x) => {
                return x.type === "enum" && x.name.endsWith(param.type)
            })
            if (typeDefinition?.type === "enum") {
                for (const index in typeDefinition.variants) {
                    const variant = typeDefinition.variants[index]
                    if (variant.name !== "None") {
                        param.variants.push({
                            name: variant.name,
                            value: Number.parseInt(index),
                        })
                    }
                }
                param.type = "enum"
            }
        } else if (param.type === "core::felt252") {
            param.type = "string"
        }
        result.push(param)
    }
    return result
}

export default function getParams(
    manifest: Manifest,
    contractName: string,
    methodName: string,
    strict?: boolean,
): Param[] {
    const interfaceName = `I${convertSnakeToPascal(contractName)}`
    const contract = findContract(manifest, contractName)
    if (!contract) return []

    const functionDef = findFunctionDefinition(contract.abi, interfaceName, methodName, strict)
    if (!functionDef) return []

    const rawParams = extractParameters(functionDef, contract.abi)
    console.log("rawParams", rawParams[0])
    const params = processParams(rawParams, contract.abi)
    console.log("params", params[0])
    return params
}
