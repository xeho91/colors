import { buildJSONfile } from "../../helpers/json.ts";
import { success } from "../../utils/log.ts";
import { Command, Input } from "../../deps.ts";

import type { BuildOptions } from "../../types.ts";

const json = new Command()
	.description("Build JSON data file with colors config.")
	.action(async ({ output }: BuildOptions) => {
		if (!output || typeof output === "boolean") {
			const decision = await Input.prompt({
				message: "In which directory path do you want to save the output?",
				default: "./dist/",
				suggestions: ["./dist/"],
			});

			output = decision;
		}

		await buildJSONfile(output);
		console.log(success("Finished!"));
	});

export default json;
