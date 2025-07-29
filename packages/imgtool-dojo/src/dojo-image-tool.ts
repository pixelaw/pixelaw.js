import * as fs from "node:fs";
import { Writable } from "node:stream";
import { PNG } from "pngjs";
import { Account, CallData, Contract, RpcProvider } from "starknet";

const entrypoint = "pixel_row";
type PixelRow = { position: { x: number; y: number }; image_data: string[] };
type PixelRows = PixelRow[];

export class DojoImageTool {
	private imageBuffer: Buffer;

	constructor(imageBuffer: Buffer) {
		this.imageBuffer = imageBuffer;
	}

	static fromFile(filePath: string): DojoImageTool {
		const imageBuffer = fs.readFileSync(filePath);
		return new DojoImageTool(imageBuffer);
	}

	static createPng(size: number): Buffer {
		const png = new PNG({ width: size, height: size });

		for (let y = 0; y < png.height; y++) {
			for (let x = 0; x < png.width; x++) {
				const idx = (png.width * y + x) << 2;

				// Create gradient from red to blue
				const red = Math.round(255 * (1 - y / png.height));
				const blue = Math.round((255 * y) / png.height);

				png.data[idx] = red;
				png.data[idx + 1] = 0;
				png.data[idx + 2] = blue;
				png.data[idx + 3] = 255;
			}
		}

		const chunks: Buffer[] = [];
		const bufferStream = new Writable({
			write(chunk, _encoding, callback) {
				chunks.push(chunk);
				callback();
			},
		});

		png.pack().pipe(bufferStream);

		return Buffer.concat(chunks);
	}

	generatePixelRows(): PixelRows {
		const pixelRows = [];
		const png = PNG.sync.read(this.imageBuffer);

		const pixels = [];
		for (let i = 0; i < png.data.length; i += 4) {
			pixels.push(Array.from(png.data.slice(i, i + 4)));
		}

		const BUFFER_SIZE = 1000;
		let buffer = [];
		const PIXELS_PER_FELT = 7;
		let x_offset = 0;
		for (let last_pixel = 0; last_pixel < pixels.length; last_pixel++) {
			const x = last_pixel % png.width;
			const y = Math.floor(last_pixel / png.width);

			buffer.push(pixels[last_pixel]);

			if (
				buffer.length === BUFFER_SIZE ||
				x === png.width - 1 ||
				last_pixel === pixels.length - 1
			) {
				const feltPixels: number[][] = [];
				for (let i = 0; i < buffer.length; i += PIXELS_PER_FELT) {
					const chunk = buffer.slice(i, i + PIXELS_PER_FELT).flat();
					feltPixels.push(chunk);
				}

				const image_data: string[] = feltPixels.map((pixel) => {
					const buf = Buffer.from(pixel);
					const hexString = buf.toString("hex");
					return "0x0000000".concat(hexString).padEnd(65, "0");
				});

				buffer = [];

				pixelRows.push({ position: { x: x_offset, y: y }, image_data });

				if (x === png.width - 1) {
					x_offset = 0;
				} else {
					x_offset = x;
				}
			}
		}
		return pixelRows;
	}

	generateSozo(pRows?: PixelRows): string {
		const pixelRows = pRows ?? this.generatePixelRows();

		let result = "";
		for (const { position, image_data } of pixelRows) {
			result += `sozo execute --wait pixelaw-paint_actions pixel_row \
1 1 1 ${position.x} ${position.y} 0 ${image_data.length} ${image_data.join(" ")}
`;
		}
		return result;
	}

	async execute(pRows: PixelRows) {
		const pixelRows = pRows ?? this.generatePixelRows();

		const provider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050" });

		const account0 = new Account(
			provider,
			"0x003c4dd268780ef738920c801edc3a75b6337bc17558c74795b530c0ff502486",
			"0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
		);

		const contractAddress =
			"0x1f04b61e71f2afa9610c422db007807f73ebad6b4c069e72bb6e22ff032a93c";
		const { abi } = await provider.getClassAt(contractAddress);
		if (abi === undefined) {
			throw new Error("no abi.");
		}
		const myTestContract = new Contract(abi, contractAddress, provider);
		myTestContract.connect(account0);

		for (const { position, image_data } of pixelRows) {
			const defaultParams = {
				for_player: 0,
				for_system: 0,
				position,
				color: "0xAFAFAF",
			};

			const calldata = CallData.compile({
				defaultParams,
				image_data,
			});

			try {
				const result = await account0.execute({
					contractAddress,
					entrypoint,
					calldata,
				});
				await provider.waitForTransaction(result.transaction_hash);

				console.log({ result });
			} catch (e) {
				console.error({ calldata }, e);
			}
		}
	}

	async run() {
		const pixelRows = await this.generatePixelRows();
		console.log(this.generateSozo(pixelRows));
		await this.execute(pixelRows);
	}
}
// // Example usage with a buffer
// ;(async () => {
//     const imageBuffer = fs.readFileSync("doc/initial.png") // Read the file into a buffer
//     const encoder = new PngToFeltEncoder(imageBuffer, { x: 0, y: 0 })
//     await encoder.run()
// })()
