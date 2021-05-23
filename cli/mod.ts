import { Command } from "https://deno.land/x/cliffy/command/mod.ts";
import { build as commandBuild, BuildArguments, BuildOptions } from "./commands/build.ts";
import { details as commandDetails, DetailsArguments, DetailsOptions } from "./commands/details.ts";

const { args } = Deno;

export interface GlobalOptions {
    verbose?: boolean;
}

await new Command()
	.allowEmpty(false)
    .description("CLI for automated tasks in this project.")
    .version("1.0.0")
    .example("build --verbose", "Build the JSON and CSS file with a verbose logging message.")
    .globalOption("--verbose", "Turn on the process logging messages.")
    .command(
        "build",
        new Command<BuildOptions, BuildArguments, GlobalOptions>()
            .description("Build the JSON and CSS file.")
            .option("--input [type:string]", "Specify the input file path", {
                default: "./config.json",
            })
            .option("--output [type:string]", "Specify the output directory path", {
                default: "./dist/colors.json",
            })
            .arguments("[file:string]")
            .action((options: BuildOptions, file: BuildArguments[0]) => {
                commandBuild(file, options);
            }),
    )
    .command(
        "details",
        new Command<DetailsOptions, DetailsArguments, GlobalOptions>()
            .description("View details of specific color name")
            .option("--hsl", "Get HSL(A) details only.")
            .option("--hex", "Get HEX(A) details only.")
            .option("--rgb", "Get RGB(A) details only.")
            .arguments("[color: string]")
            .action((
                options: DetailsOptions,
                colorName: DetailsArguments[0],
            ) => {
                commandDetails(colorName, options);
            })
			.hidden(),
    )
    .parse(args);
