import { DojoImageTool } from "./dojo-image-tool"; // Adjust the import path as necessary

async function main(filePath: string) {
	try {
		const dojoImageTool = DojoImageTool.fromFile(filePath);
		const sozoScript = dojoImageTool.generateSozo();
		console.log(sozoScript);
	} catch (error) {
		console.error("Error generating Sozo script:", error);
	}
}

// Example usage
main("./data/initial.png");
