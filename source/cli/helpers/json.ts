import { existsSync, join } from "../deps.ts";
import { getAllColorsData } from "../helpers/data.ts";
import { info } from "../utils/log.ts";
import { task } from "../utils/task.ts";

const { cwd, mkdirSync, writeTextFileSync } = Deno;

export async function buildJSONfile(output: string) {
	const dirPath = join(cwd(), output);
	const filePath = join(dirPath, "colors.json");

	await task(
		`Saving the colors details to JSON (${info(`file://${filePath}`)})...`,
		() => {
			const data = getAllColorsData();

			if (!existsSync(dirPath)) {
				mkdirSync(dirPath);
			}

			writeTextFileSync(filePath, JSON.stringify(data, null, 2));
		},
	);
}
