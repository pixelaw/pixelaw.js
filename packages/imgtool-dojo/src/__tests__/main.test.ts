import { PNG } from "pngjs";
import { beforeAll, describe, expect, it } from "vitest";
import { DojoImageTool } from "../dojo-image-tool.ts";

describe("PngToFeltEncoder", () => {
	let imageBuffer: Buffer;

	beforeAll(() => {
		// Prepare a small PNG buffer for testing
		const png = new PNG({ width: 2, height: 2 });
		png.data = Buffer.from([
			0,
			0,
			0,
			255, // Black pixel
			255,
			255,
			255,
			255, // White pixel
			255,
			0,
			0,
			255, // Red pixel
			0,
			255,
			0,
			255, // Green pixel
		]);
		imageBuffer = PNG.sync.write(png);
	});

	it("should generate correct pixel rows", () => {
		const encoder = new DojoImageTool(imageBuffer, { x: 0, y: 0 });
		const pixelRows = encoder.generatePixelRows();

		expect(pixelRows).toBeInstanceOf(Array);
		expect(pixelRows.length).toBeGreaterThan(0);

		// Further assertions can be made based on expected output
		expect(pixelRows[0]).toHaveProperty("position");
		expect(pixelRows[0]).toHaveProperty("image_data");
	});

	it("should generate correct Sozo command string", () => {
		const encoder = new DojoImageTool(imageBuffer, { x: 0, y: 0 });
		const pixelRows = encoder.generatePixelRows();
		const sozoCommand = encoder.generateSozo(pixelRows);

		expect(typeof sozoCommand).toBe("string");
		expect(sozoCommand).toContain("sozo");
	});

	// Add more tests as needed for other methods
});
