import type { Bounds, Coordinate } from "./types.ts";

export function areBoundsEqual(boundsA: Bounds, boundsB: Bounds): boolean {
	// Compare top-left coordinates
	if (boundsA[0][0] !== boundsB[0][0] || boundsA[0][1] !== boundsB[0][1]) {
		return false;
	}
	// Compare bottom-right coordinates
	if (boundsA[1][0] !== boundsB[1][0] || boundsA[1][1] !== boundsB[1][1]) {
		return false;
	}
	return true;
}
export function areCoordinatesEqual(
	coord1: Coordinate,
	coord2: Coordinate,
): boolean {
	return coord1[0] === coord2[0] && coord1[1] === coord2[1];
}
export function sleepMs(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
export const numRGBAToHex = (rgba: number | undefined) => {
	if (rgba === undefined) return "#0000EE"; // TODO Maybe return default color?
	const color = rgba >>> 8;
	return `#${color.toString(16).padStart(6, "0")}`;
};

export function hexToRgb(input: string): [number, number, number] {
	// Remove the hash at the start if it's there
	const hex = input.replace(/^#/, "");

	// Parse the r, g, b values
	const bigint = Number.parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return [r, g, b];
}

export function parsePixelError(
	input: string,
): { coordinate: Coordinate; error: string } | null {
	const regex = /^(\d+)_(\d+)\s+(.+)$/;
	const match = input.match(regex);

	if (match) {
		const x = Number.parseInt(match[1], 10);
		const y = Number.parseInt(match[2], 10);
		const error = match[3];

		return {
			coordinate: [x, y],
			error,
		};
	}
	return {
		coordinate: null,
		error: input,
	};
}
