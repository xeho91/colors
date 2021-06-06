import { colors } from "cliffy/ansi/colors.ts";
import { Cell, Table } from "cliffy/table/mod.ts";
import Color from "./Color.ts";
import { getColorsConfigData } from "./config.ts";

export interface ColorsData {
	[groupName: string]: {
		[colorName: string]: Color;
	};
}

/** Create a color data for a specified color name */
export function getColorData(name: string) {
	const desiredColor = getColorsConfigData().colors
		.find((color) => color.name === name);

	if (desiredColor) {
		return new Color(desiredColor.hex);
	} else {
		throw new Error(
			`"${desiredColor}" was not found in the colors configuration.`,
		);
	}
}

/** Create data for all of the colors in the config */
export function getAllColorsData() {
	const results: ColorsData = {};
	const colors = getColorsConfigData().colors;

	colors.forEach(({ name, group }) => {
		if (!results[group]) {
			Object.assign(results, { [group]: {} });
		}

		results[group][name] = getColorData(name);
	});

	return results;
}

/** Return an array of all of the colors names from the config */
export function getAllColorsNames(): string[] {
	const colors = getColorsConfigData().colors;

	return colors.map((color) => color.name);
}
/** Return an array of all of the colors groups from the config */
export function getAllColorsGroups(): string[] {
	const colors = getColorsConfigData().colors;

	return Array.from(new Set(colors.map((color) => color.group)));
}

/** Create a formatted table for printing the color(s) details */
function createTable() {
	const headerStyle = colors.bold.underline.white;
	const subHeaderStyle = colors.bold.white;

	return new Table()
		.header([
			Cell.from(headerStyle("Name")).rowSpan(2).border(false),
			Cell.from(headerStyle.bgCyan("HEX")).rowSpan(2).border(false),
			Cell.from(headerStyle.bgCyan("HEXA")).rowSpan(2).border(false),
			Cell.from(headerStyle.bgMagenta("HSL")).colSpan(3).border(false),
			Cell.from(headerStyle.bgBlue("RGB")).colSpan(3).border(false),
			Cell.from(headerStyle.bgBlack("Alpha")).rowSpan(2).border(false),
			Cell.from(headerStyle("Polarity")).rowSpan(2).border(false),
		])
		.body([
			[
				Cell.from(subHeaderStyle.bgMagenta("Hue (deg)")).border(false),
				Cell.from(subHeaderStyle.bgMagenta("Saturation (%)")).border(
					false,
				),
				Cell.from(subHeaderStyle.bgMagenta("Lightness (%)")).border(
					false,
				),
				Cell.from(colors.bgBlue("Red")).border(false),
				Cell.from(colors.bgBlue("Green")).border(false),
				Cell.from(colors.bgBlue("Blue")).border(false),
			],
		])
		.border(true);
}

/** Create row from the color's data for displaying in the table */
function createRow(name: string) {
	const data = getColorData(name);
	const row = [
		name,
		...Object
			.values(data)
			.map((cell) => {
				if (typeof cell === "object") {
					return Object.values(cell);
				} else {
					return cell;
				}
			})
			.flat(),
	];

	return row;
}

/** Print the desired range of colors data in a formatted table */
export function printColorsData(colorsNames: string[]) {
	const table = createTable();

	colorsNames.forEach((name) => table.push(createRow(name)));
	table.render();
}
