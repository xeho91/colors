import postCSS from "https://deno.land/x/postcss/mod.js";
import postCSSimport from "https://deno.land/x/postcss_import/mod.js";

import { parse } from "https://deno.land/std/path/mod.ts";

import type { BuildOptions } from "../commands/build.ts";
import type { DetailedData } from "./Color.ts";

const { mkdirSync, writeTextFileSync } = Deno;

export default async function writeToCSS(data: DetailedData, options: BuildOptions) {
    const VERBOSE = options.verbose;
    const outputPath = parse(options.output).dir;

    const groupNames = Object.keys(data);

    /** Create directories for all of the color groups */
    function createDirectories() {
        groupNames.forEach((name) => {
            const directoryPath = `${outputPath}/css/${name}`;

            try {
                mkdirSync(directoryPath, { recursive: true });
                VERBOSE && console.log(`Created directory: ${directoryPath}`);
            } catch (error) {
                throw new Error(error);
            }
        });
    }

    const globalCSSfilePath = `${outputPath}/css/global.css`;

    /** Create CSS files for every color */
    function createFiles() {
        const globalCSSimports: string[] = [];
        const globalCSSvariables: string[] = [];

        groupNames.forEach((groupName) => {
            const colorsInGroup = Object.values(data[groupName]);

            colorsInGroup.forEach((color) => {
                const colorCSSvariables: string[] = [];

                function addVariable(name: string, param: string, value: number | string, unit = "") {
                    return `--${name}${param}: ${value}${unit};`;
                }

                function wrap(...parameters: string[]) {
                    return parameters
                        .map((param) => {
                            return `var(--${color.name}_${param})`;
                        })
                        .join(", ");
                }

                // AlPHA
                colorCSSvariables.push(addVariable(color.name, "_alpha", color.alpha));

                // HSL
                colorCSSvariables.push(addVariable(color.name, "_hue", color.HSL.hue, "deg"));
                colorCSSvariables.push(addVariable(color.name, "_saturation", color.HSL.saturation, "%"));
                colorCSSvariables.push(addVariable(color.name, "_lightness", color.HSL.lightness, "%"));
                colorCSSvariables.push(addVariable(color.name, "_HSL", `${wrap("hue", "saturation", "lightness")}`));
                colorCSSvariables.push(addVariable(color.name, "_HSLA", `hsla(${wrap("HSL", "alpha")})`));

                // RGB
                colorCSSvariables.push(addVariable(color.name, "_red", color.RGB.red));
                colorCSSvariables.push(addVariable(color.name, "_green", color.RGB.green));
                colorCSSvariables.push(addVariable(color.name, "_blue", color.RGB.blue));
                colorCSSvariables.push(addVariable(color.name, "_RGB", `${wrap("red", "green", "blue")}`));
                colorCSSvariables.push(addVariable(color.name, "_RGBA", `rgba(${wrap("RGB", "alpha")})`));

                // HEX
                colorCSSvariables.push(addVariable(color.name, "_HEX", color.hex));
                colorCSSvariables.push(addVariable(color.name, "_HEXA", color.hexa));

                globalCSSimports.push(`@import "./${groupName}/${color.name}.css";`);
                globalCSSvariables.push(addVariable("color-", color.name, `var(--${color.name}_HSLA)`));

                const colorFilePath = `${outputPath}/css/${groupName}/${color.name}.css`;
                const colorCSSoutput = `:root {\n${colorCSSvariables.map((line) => `\t${line}`).join("\n")}\n}`;

                VERBOSE && console.log("Created file:", colorFilePath);
                writeTextFileSync(colorFilePath, colorCSSoutput);
            });
        });

        const globalCSSoutput = `${globalCSSimports.join("\n")}\n\n:root {\n${
            globalCSSvariables.map((line) => `\t${line}`).join("\n")
        }\n}`;

        VERBOSE && console.log("Created global file for CSS colors:", globalCSSfilePath);
        writeTextFileSync(globalCSSfilePath, globalCSSoutput);
    }

	async function bundleFiles() {
		const bundleFilePath = `${outputPath}/colors.css`;
		const code = await Deno.readTextFile(globalCSSfilePath);

		const { css } = await postCSS([postCSSimport()]).process(
			code,
			{
				from: globalCSSfilePath,
				to: bundleFilePath,
				map: { inline: true },
			}
		);

		VERBOSE && console.log("Created bundled file:", bundleFilePath);
		writeTextFileSync(bundleFilePath, css);
	}

    VERBOSE && console.log("Creating directories...");
    createDirectories();

    VERBOSE && console.log("Creating CSS files for each color...");
    createFiles();

    VERBOSE && console.log("Bundling CSS files...");
    await bundleFiles();

    console.log("Success!");
}
