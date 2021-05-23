import { Input } from "https://deno.land/x/cliffy/prompt/input.ts";

import { generateColorsDetails } from "../utils/Color.ts";
import writeToJSON from "../utils/writeToJSON.ts";
import writeToCSS from "../utils/writeToCSS.ts";

import type { GlobalOptions } from "../mod.ts";

export interface BuildOptions extends GlobalOptions {
    input: string;
    output: string;
}

export type BuildArguments = [file: "css" | "json"];

const { exit } = Deno;

export async function build(fileType: BuildArguments[0], options: BuildOptions) {

    try {
        const colorsData = generateColorsDetails(options);

        if (!fileType) {
            const decision = await Input.prompt({
                message: "What do you want to build?",
				list: true,
				info: true,
				suggestions: ["css", "json"],
				validate: (result) => result === "css" || result === "json",
            });

			fileType = decision as BuildArguments[0];
        }

        if (fileType === "json") {
            writeToJSON(colorsData, options);
            exit(0);
        }

        if (fileType === "css") {
			await writeToCSS(colorsData, options);
            exit(0);
        }
    } catch (error) {
        throw new Error(error);
    }
}
