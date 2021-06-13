import { info } from "../utils/log.ts";
import { task } from "../utils/task.ts";
import { join, z } from "../deps.ts";

const { readTextFileSync, cwd } = Deno;

export const ColorsConfigSchema = z.object({
	colors: z.array(z.object({
		hex: z.string().regex(
			new RegExp("^#\[0-9a-f]{6}$", "i"),
			"It must be a HEX, with pattern: '#xxxxxx' where x is a number or a letter between A-F",
		),

		name: z.string(),

		group: z.string(),
	})),
});

export type ColorsConfigData = z.infer<typeof ColorsConfigSchema>;

declare global {
	interface Window {
		colorsConfigData: ColorsConfigData;
	}
}

/** Read the configuration file from specified path */
export async function loadColorsConfig(path: string) {
	const configPath = join(cwd(), path);
	let data = {};

	await task(
		`Reading the colors config from (${info(`file://${configPath}`)})...`,
		() => {
			data = JSON.parse(readTextFileSync(configPath));
		},
	);

	await task("Validating the config data...", () => {
		data = ColorsConfigSchema.parse(data);
	}, { succeed: "valid." });

	Object.assign(window, { colorsConfigData: data as ColorsConfigData });
}

await loadColorsConfig("./colors.config.json");

/** Get saved data from the Deno's global object - window */
export function getColorsConfigData(): ColorsConfigData {
	return (window as Window).colorsConfigData;
}
