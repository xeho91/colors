import { Command, Select } from "../deps.ts";

import { css as subCommandCSS } from "./build/css.ts";
import subCommandJSON from "./build/json.ts";

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

		switch (decision) {
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
