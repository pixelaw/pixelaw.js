import { type Manifest, getContractByName } from "@dojoengine/core"
import { NAMESPACE } from "@pixelaw/core"
import type { Param, Position } from "@pixelaw/core"
import type { Call } from "starknet"
import type { InterfaceType } from "./types.ts"

const DEFAULT_PARAMETERS_TYPE = "pixelaw::core::utils::DefaultParameters"

const convertSnakeToPascal = (snakeCaseString: string) => {
    return snakeCaseString
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
}

export function generateDojoCall(
    manifest: Manifest,
    params: Param[],
    contractName: string,
    action: string,
    position: Position,
    color: number,
): Call {
    const contract = getContractByName(manifest, NAMESPACE, contractName)

    const player_override = 1
    const system_override = 1
    const area_hint = 1
    const position_x = position.x
    const position_y = position.y

    const calldata = [player_override, system_override, area_hint, position_x, position_y, color]

    for (const param of params) {
        if (param.value) {
            calldata.push(param.value)
        }
    }

    return {
        contractAddress: contract.address,
        entrypoint: action,
        calldata,
    }
}

export default function getParamsDef(
    manifest: Manifest,
    contractName: string,
    methodName: string,
    strict?: boolean,
): Param[] {
    const interfaceName = `I${convertSnakeToPascal(contractName)}`
    const contract = manifest.contracts.find((c) => c.name.includes(contractName))
    if (!contract) return []
    const abi = contract?.abi
    const methods = abi.find((x) => x.type === "interface" && x.name.includes(interfaceName)) as
        | InterfaceType
        | undefined

    if (!methods) {
        if (strict) throw new Error(`unknown interface: ${interfaceName}`)
        return []
    }
    if (!methods?.items) {
        if (strict) throw new Error(`no methods for interface: ${interfaceName}`)
        return []
    }

    let functionDef = methods.items.find((method) => method.name === methodName && method.type === "function")
    if (!functionDef) {
        functionDef = methods.items.find((method) => method.name === "interact" && method.type === "function")
        if (!functionDef) {
            if (strict) throw new Error(`function ${methodName} not found`)
            return []
        }
    }
    const parameters = []
    for (const input of functionDef.inputs) {
        if (input.type !== DEFAULT_PARAMETERS_TYPE) {
            parameters.push(input)
        }
    }

    const result = []
    for (const param of parameters) {
        const isPrimitiveType = param.type.includes("core::integer") || param.type.includes("core::felt252")
        let type: "number" | "string" | "enum" = "number"
        const variants: { name: string; value: number }[] = []
        const transformer = undefined
        if (!isPrimitiveType) {
            const typeDefinition = abi.find((x) => x.name === param.type)
            if (typeDefinition?.type === "enum") {
                for (const index in typeDefinition.variants) {
                    const variant = typeDefinition.variants[index]
                    if (variant.name !== "None") {
                        variants.push({
                            name: variant.name,
                            value: Number.parseInt(index),
                        })
                    }
                }
                type = "enum"
                // transformer = (val: string) => Number.parseInt(val)
            }
        } else if (param.type.includes("core::felt252")) {
            type = "string"
        }
        result.push({
            name: param.name,
            type,
            variants,
            transformer,
            value: undefined,
        })
    }
    return result
}
