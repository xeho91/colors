import { build as cmdBuild } from "./commands/build.ts";
import { details as cmdDetails } from "./commands/details.ts";
import { Command, fromFileUrl, join, Select } from "./deps.ts";

const moduleRootPath = join(fromFileUrl(import.meta.url), "../../../");

const { args, readTextFileSync } = Deno;
const { version } = JSON.parse(
	readTextFileSync(join(moduleRootPath, "package.json")),
);

export interface GlobalOptions {
	// config: string;
}

const main = new Command()
	.name("xeho91-colors")
	.stopEarly()
	.description("CLI for automated tasks in xeho91's colors project.")
	.version(version)
	// .option(
	// 	"-c, --config [file:string]",
	// 	"Specify the config file path.",
	// 	{
	// 		default: join(moduleRootPath, "colors.config.json"),
	// 		global: true,
	// 	},
	// )
	.action(async () => {
		const decision = await Select.prompt({
			message: "What do you want to do?",
			options: [
				{ name: "Build assets for colors", value: "build" },
				{ name: "Get color details", value: "details" },
			],
		});

				switch (decision) {
					case "build":
						await cmdBuild.parse(args);
						break;

					case "details":
						await cmdDetails.parse(args);
						break;
				}

		Deno.exit(0);
	})
	.command("build", cmdBuild)
	.command("details", cmdDetails);

await main.parse(args);
