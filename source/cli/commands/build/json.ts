import { Command } from "cliffy/command/mod.ts";
import { Input } from "cliffy/prompt/mod.ts";
import { buildJSONfile } from "helpers/json.ts";

import type { BuildOptions } from "commands/build.ts";

const json = new Command()
	.description("Build JSON data file with colors config.")
	.action(async ({ output } : BuildOptions) => {
		if (!output || typeof output === "boolean") {
			const decision = await Input.prompt({
				message:
					"In which directory path do you want to save the output?",
				default: "./dist/",
				suggestions: ["./dist/"],
			});

			output = decision;
		}

		await buildJSONfile(output);
		console.log("Finished!");
	});

export default json;
