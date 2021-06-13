import { Command, Select } from "./deps.ts";
import { build as commandBuild } from "./commands/build.ts";
import { details as commandDetails } from "./commands/details.ts";

const { args, readTextFileSync } = Deno;
const { version } = JSON.parse(readTextFileSync("./package.json"));

export interface GlobalOptions {
	config: string;
}

const main = new Command()
	.name("xeho91-colors")
	.stopEarly()
	.description("CLI for automated tasks in xeho91's colors project.")
	.version(version)
	.option(
		"-c, --config [file:string]",
		"Specify the config file path.",
		{
			default: "./colors.config.json",
			global: true,
		},
	)
	.action(async () => {
		const decision = await Select.prompt({
			message: "What do you want to do?",
			options: [
				{ name: "Build assets for colors", value: "build" },
				{ name: "Get color details", value: "details" },
			],
		});

		switch(decision) {
			case "build":
				await commandBuild.parse(args);
				break;

			case "details":
				await commandDetails.parse(args);
				break;
		}

		Deno.exit(0);
	})
	.command("build", commandBuild)
	.command("details", commandDetails);

await main.parse(args);
