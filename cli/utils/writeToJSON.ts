import type { BuildOptions } from "../commands/build.ts";
import type { DetailedData } from "./Color.ts";

const { writeTextFileSync } = Deno;

export default function writeToJSON(data: DetailedData, options: BuildOptions) {
	const VERBOSE = options.verbose;
    const outputPath = options.output;

	VERBOSE && console.log("Saving the color details in JSON format to:", outputPath, "...");
	writeTextFileSync(outputPath, JSON.stringify(data, null, 2));
	console.log("Success!");
}
