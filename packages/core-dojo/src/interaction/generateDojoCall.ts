import { getContractByName, type Manifest } from "@dojoengine/core";
import { type InteractParam, NAMESPACE, type Position } from "@pixelaw/core";
import type { Call } from "starknet";

export default function generateDojoCall(
	manifest: Manifest,
	params: InteractParam[],
	contractName: string,
	action: string,
	position: Position,
	color: number,
): Call {
	const contract = getContractByName(manifest, NAMESPACE, contractName);

	const player_override = 1;
	const system_override = 1;
	const area_hint = 1;
	const position_x = position.x;
	const position_y = position.y;

	const calldata = [
		player_override,
		system_override,
		area_hint,
		position_x,
		position_y,
		color,
	];

	for (const param of params) {
		if (param.value) {
			calldata.push(param.value);
		}
	}

	return {
		contractAddress: contract.address,
		entrypoint: action,
		calldata,
	};
}
