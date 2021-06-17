import { buildCSSfiles } from "../../helpers/css.ts";
import { success } from "../../utils/log.ts";
import { Command, EnumType, Input, Select } from "../../deps.ts";

import type { BuildCSSoptions, BuildOptions, ColorCode } from "../../types.ts";

const colorVariant = new EnumType(["hsl", "rgb", "hex"]);

export const css = new Command<BuildCSSoptions>()
	.type("colorVariant", colorVariant)
	.description("Build CSS style files.")
	.option<{ color: typeof colorVariant }>(
		"-v, --variant [code:colorVariant]",
		"Choose a color code variant",
	)
	.action(async ({ variant, output, ...options }) => {
		if (!variant || typeof variant === "boolean") {
			const decision = await Select.prompt({
				message: "Pick a color code variant to use.",
				options: [
					{ name: "HSL(A) - Hue Saturation Lightness", value: "hsl" },
					{ name: "RGB(A) - Red Green Blue", value: "rgb" },
					{ name: "HEX(A) - Hexadecimal code", value: "hex" },
				],
			});

			variant = decision as ColorCode;
		}

		if (!output) {
			const decision = await Input.prompt({
				message: "In which directory path do you want to save the output?",
				default: "./dist/",
				suggestions: ["./dist/"],
			});

			output = decision;
		}

		await buildCSSfiles({ variant, output, ...options });
		console.log(success("Finished!"));
	});
