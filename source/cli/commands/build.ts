import type { GlobalOptions } from "cli/mod.ts";
import { Command } from "cliffy/command/mod.ts";
import { Select } from "cliffy/prompt/mod.ts";

import { css as subCommandCSS } from "commands/build/css.ts";
import subCommandJSON from "commands/build/json.ts";

export interface BuildOptions extends GlobalOptions {
	output: string;
}

export const build = new Command<BuildOptions>()
	.description("Build the JSON data file or CSS styles files.")
	.option(
		"-o, --output [directory:string]",
		"Specify the output directory path.",
		{
			global: true,
		},
	)
	.action(async (_, ...args) => {
		const decision = await Select.prompt({
			message: "Which asset(s) do you want to build?",
			options: [
				{
					name: "CSS - style files",
					value: "css",
				},
				{
					name: "JSON - data file with colors details",
					value: "json",
				},
			],
		});

		switch(decision) {
			case "css":
				await subCommandCSS.parse(args);
				break;

			case "json":
				await subCommandJSON.parse(args);
				break;
		}

		Deno.exit(0);
	})
	.command("css", subCommandCSS)
	.command("json", subCommandJSON);
