import { getColorsConfigData } from "../helpers/config.ts";
import { getAllColorsNames, printColorsData } from "../helpers/data.ts";
import capitalize from "../utils/capitalize.ts";
import { Checkbox, Command, EnumType } from "../deps.ts";

import type {
	DetailsArgument,
	DetailsOptions,
	GlobalOptions,
	SelectValueOptions,
} from "../types.ts";

/** Create options with the color names and values for the Select prompt */
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
