import type { Manifest } from "@dojoengine/core";
import type { InteractParam, InteractParams, Position } from "@pixelaw/core";
import { poseidonHashMany } from "@scure/starknet";
import type { DojoInteraction } from "../DojoInteraction.ts";
import { convertTextToHex, generateRandomFelt252 } from "../utils/utils.ts";
import type { InterfaceType } from "./types.ts";
import type { DojoEngine } from "../DojoEngine.ts";

const DEFAULT_PARAMETERS_TYPE = "pixelaw::core::utils::DefaultParameters";

export const isPrimitive = (type: string) => {
  return (
    type === "core::u8" ||
    type === "core::u16" ||
    type === "core::u32" ||
    type === "core::u64" ||
    type === "core::u128" ||
    type === "core::u256" ||
    type === "core::bool" ||
    type === "core::felt252"
  );
};

export const convertSnakeToPascal = (snakeCaseString: string) => {
  return snakeCaseString
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

export function findContract(manifest: Manifest, contractName: string) {
  return manifest.contracts.find((c) => c.name.includes(contractName));
}

export function findInterface(
  abi: any[],
  interfaceName: string,
  strict?: boolean,
): InterfaceType | undefined {
  const methods = abi.find(
    (x) => x.type === "interface" && x.name.includes(interfaceName),
  ) as InterfaceType | undefined;
  if (!methods && strict)
    throw new Error(`unknown interface: ${interfaceName}`);
  return methods;
}

export function findFunctionDefinition(
  abi,
  interfaceName,
  methodName: string,
  strict = false,
) {
  const methods = findInterface(abi, interfaceName, strict);
  if (!methods?.items) {
    if (strict) throw new Error(`no methods for interface: ${interfaceName}`);
    return [];
  }

  let functionDef = methods.items.find(
    (method) => method.name === methodName && method.type === "function",
  );
  if (!functionDef) {
    functionDef = methods.items.find(
      (method) => method.name === "interact" && method.type === "function",
    );
    if (!functionDef && strict)
      throw new Error(`function ${methodName} not found`);
  }
  return functionDef;
}

export function extractParameters(functionDef: any) {
  const parameters = [];
  for (const input of functionDef.inputs) {
    if (input.type !== DEFAULT_PARAMETERS_TYPE) {
      parameters.push(input);
    }
  }
  return parameters;
}

export async function prepareParams(
  interaction: DojoInteraction,
  rawParams: InteractParam[],
  abi: any[],
): Promise<InteractParam[]> {
  const result: InteractParam[] = [];
  const storage = interaction.engine.core.storage;
  const address = interaction.engine.core.wallet?.address;
  const positionString = `${interaction.position.x}_${interaction.position.y}`;
  for (const rawParam of rawParams) {
    const param = { ...rawParam };

    const [nameFirst, ...nameRemaining] = rawParam.name.split("_");

    // Check if the name as a prefix
    if (nameRemaining.length > 0) {
      if (nameFirst === "crc") {
        // TODO check that nameRemaining has 2 elements, for varname and vartype
        param.name = nameRemaining[0];
        // @ts-ignore TODO
        param.type = nameRemaining[1];

        // setup a "transformer" that, after choosing a value, encodes it and calls the right function name.
        param.transformer = async () => {
          const salt = `0x${generateRandomFelt252().toString(16)}`;
          // Store the original values
          await storage.setItem(
            `param_${address}-${positionString}-${param.name}`,
            param.value,
          );
          await storage.setItem(
            `param_${address}-${positionString}-${param.name}-salt`,
            salt,
          );
          param.name = rawParam.name;
          param.type = rawParam.type;
          param.variants = rawParam.variants;

          // @ts-ignore TODO
          param.value = `0x${poseidonHashMany([BigInt(param.value), BigInt(salt)]).toString(16)}`;
          console.log("hash:", param.value);
          console.log("salt:", salt);
        };
      } else if (nameFirst === "crv") {
        // TODO check that nameRemaining has 1 elements, for varname
        const originalParamName = nameRemaining[0];

        // TODO this param does not require user input, but is read from storage
        const origValue = await storage.getItem<number>(
          `param_${address}-${positionString}-${originalParamName}`,
        );

        param.value = origValue;
        param.systemOnly = true;
      } else if (nameFirst === "crs") {
        // TODO check that nameRemaining has 1 elements, for varname
        // param.name = nameRemaining[0]

        // this param does not require user input, but is read from storage
        const salt = await storage.getItem<number>(
          `param_${address}-${positionString}-${nameRemaining[0]}-salt`,
        );
        param.value = salt;
        console.log("saltout:", param.value);
        param.systemOnly = true;
      } else {
        // Nothing, the name just had underscores but no special prefix
      }
    }

    param.variants = [];
    // const transformer = undefined

    if (!isPrimitive(param.type)) {
      // If the type is not a primitive, let's look for an Enum with this name
      const typeDefinition = abi.find((x) => {
        return x.type === "enum" && x.name.endsWith(param.type);
      });
      if (typeDefinition?.type === "enum") {
        for (const index in typeDefinition.variants) {
          const variant = typeDefinition.variants[index];
          if (variant.name !== "None") {
            param.variants.push({
              name: variant.name,
              value: Number.parseInt(index),
            });
          }
        }
        param.type = "enum";
      } else {
        // @ts-ignore pre-processing
        if (param.type === "pixelaw::core::utils::Emoji") {
          param.type = "emoji";
          param.transformer = async () => {
            param.value = convertTextToHex(param.value as string);
          };
        }
      }
    } else if (param.type === "core::felt252") {
      param.type = "string";
    }
    result.push(param);
  }
  return result;
}
