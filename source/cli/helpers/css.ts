import { getColorsConfigData } from "../helpers/config.ts";
import { getAllColorsGroups, getColorData } from "../helpers/data.ts";
import { info } from "../utils/log.ts";
import { task } from "../utils/task.ts";
import { join, postCSS, postCSSimport } from "../deps.ts";

import type { BuildCSSoptions, ColorCode } from "../types.ts";

const { cwd, mkdirSync, writeTextFileSync, readTextFileSync } = Deno;

/** Create directories for all of the color groups */
async function createGroupDirectories(dir: string) {
	await task(
		`Creating directories for each color group in (${info(`file://${dir}`)})...`,
		() => {
			const groups = getAllColorsGroups();

			groups.forEach((name) => {
				const outputPath = join(dir, "css", name);

				try {
					mkdirSync(outputPath, { recursive: true });
				} catch (error) {
					throw new Error(error);
				}
			});
		},
	);
}

/** Generate a CSS code for single color, with selected color's variant properties */
function generateColorCSScode(name: string, variant: ColorCode) {
	const variables: string[] = [];

	function addVariable(varName: string, value: number | string, unit = "") {
		variables.push(`--${varName}: ${value}${unit};`);
	}

	function wrap(...args: string[]) {
		return args.map((param) => `var(--${name}_${param})`).join(", ");
	}

	const data = getColorData(name);

	switch (variant) {
		case "hsl":
			addVariable(`${name}_alpha`, data.alpha);
			addVariable(`${name}_hue`, data.HSL.hue, "deg");
			addVariable(`${name}_saturation`, data.HSL.saturation, "%");
			addVariable(`${name}_lightness`, data.HSL.lightness, "%");
			addVariable(`${name}_HSL`, `${wrap("hue", "saturation", "lightness")}`);
			addVariable(`${name}_HSLA`, `hsla(${wrap("HSL", "alpha")})`);
			break;

		case "rgb":
			addVariable(`${name}_alpha`, data.alpha);
			addVariable(`${name}_red`, data.RGB.red);
			addVariable(`${name}_green`, data.RGB.green);
			addVariable(`${name}_blue`, data.RGB.blue);
			addVariable(`${name}_RGB`, `${wrap("red", "green", "blue")}`);
			addVariable(`${name}_RGBA`, `rgba(${wrap("RGB", "alpha")})`);
			break;

		case "hex":
			addVariable(`${name}_HEX`, data.hex);
			addVariable(`${name}_HEXA`, data.hexa);
			break;
	}

	return `:root {\n\t${variables.join("\n\t")}\n}`;
}

/** Generate a CSS code for single color, with selected color's variant properties */
function generateGlobalCSScode(variant: ColorCode) {
	const imports: string[] = [];
	const variables: string[] = [];
	const colors = getColorsConfigData().colors;
	let code = "";

	function addImport(name: string, group: string) {
		imports.push(`@import "./${group}/${name}.css";`);
	}

	function addVariable(name: string, variant: ColorCode) {
		variables.push(`--color-${name}: var(--color_${variant.toUpperCase()}A);`);
	}

	colors.forEach(({ name, group }) => {
		addImport(name, group);
		addVariable(name, variant);
	});

	code += `${imports.join("\n")}\n`;
	code += `\n:root {\n\t${variables.join("\n\t")}\n}`;

	return code;
}

/** Create CSS files for every color */
async function createColorsFiles(dir: string, variant: ColorCode) {
	await task("Creating CSS style files for each color...", () => {
		const colors = getColorsConfigData().colors;
		colors.forEach(({ name, group }) => {
			const colorCSScode = generateColorCSScode(name, variant);
			const outputPath = join(dir, "css", group, `${name}.css`);

			writeTextFileSync(outputPath, colorCSScode);
		});
	});
}

/** Create a global CSS file to import all of the colors and summary variables */
async function createGlobalFile(dir: string, variant: ColorCode) {
	const outputPath = join(dir, "css", "global.css");

	await task(
		`Creating a global CSS (${info(`file://${outputPath}`)})...`,
		() => {
			const globalCSScode = generateGlobalCSScode(variant);

			writeTextFileSync(outputPath, globalCSScode);
		},
	);
}

async function generateBundleCSScode(from: string, to: string) {
	const code = readTextFileSync(from);
	const processor = postCSS([postCSSimport()]);
	const { css } = await processor.process(code, {
		from,
		to,
		map: { inline: true },
	});

	return css;
}

/** Create one bundled file to include all imported variables */
async function createBundleFile(dir: string) {
	const outputPath = join(dir, "colors.css");

	await task(
		`Creating a bundle with PostCSS (${info(`file://${outputPath}`)})...`,
		async () => {
			const globalCSSfilePath = join(dir, "css", "global.css");
			const bundledCSScode = await generateBundleCSScode(
				globalCSSfilePath,
				outputPath,
			);

			writeTextFileSync(outputPath, bundledCSScode);
		},
	);
}

/** Create CSS files from the colors data, with specified color code variant */
export async function buildCSSfiles({ output, variant }: BuildCSSoptions) {
	const outputDir = join(cwd(), output);

	await createGroupDirectories(outputDir);
	await createColorsFiles(outputDir, variant);
	await createGlobalFile(outputDir, variant);
	await createBundleFile(outputDir);
}
