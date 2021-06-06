import { Command, EnumType } from "cliffy/command/mod.ts";
import { Checkbox } from "cliffy/prompt/mod.ts";
import { getColorsConfigData } from "helpers/config.ts";
import { getAllColorsNames, printColorsData } from "helpers/data.ts";
import capitalize from "utils/capitalize.ts";

import type { GlobalOptions } from "cli/mod.ts";
import type { ColorCode } from "cli/types.ts";
import type { SelectValueOptions } from "cliffy/prompt/mod.ts";

export interface DetailsOptions extends GlobalOptions {
	variant: ColorCode;
}

/** Create ColorsNames with color names and values for the select ColorsNames prompt */
function createOptions() {
	const options: SelectValueOptions = [];
	const colors = getColorsConfigData().colors;

	colors.forEach(({ name, group }, index) => {
		const previousGroup = colors[index - 1]?.group;

		// Push new separator with group nane, if it's different than previous
		if (previousGroup !== group) {
			options.push(Checkbox.separator(`----------- ${capitalize(group)}`));
		}

		options.push({ name: capitalize(name), value: name });
	});

	return options;
}

export type DetailsArgument = [colors: string[]];

const ColorsNames = new EnumType([
	"all",
	...getAllColorsNames(),
]);

export const details = new Command<
	DetailsOptions,
	DetailsArgument,
	GlobalOptions
>()
	.type("ColorsNames", ColorsNames)
	.description("View details of specific color name")
	.arguments("[colors...:ColorsNames]")
	.action(async (_, args) => {
		if (!args) {
			const decisions = await Checkbox.prompt({
				message: "Which color details do you want?",
				options: [
					{ name: "All", value: "all" },
					...createOptions(),
				],
				minOptions: 1,
			});

			args = decisions;
		}

		if (args.includes("all")) {
			printColorsData(getAllColorsNames());
		} else {
			printColorsData(args);
		}

		Deno.exit(0);
	});
