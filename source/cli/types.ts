import type { SelectValueOptions } from "https://deno.land/x/cliffy@v0.19.1/mod.ts";
import type { BuildCSSoptions } from "./commands/build/css.ts";
import type { BuildOptions } from "./commands/build.ts";
import type { DetailsArgument, DetailsOptions } from "./commands/details.ts";
import Color from "./helpers/Color.ts";
import type { ColorsData } from "./helpers/data.ts";
import type { GlobalOptions } from "./mod.ts";

type ColorCode = "hsl" | "rgb" | "hex";

export type {
	BuildCSSoptions,
	BuildOptions,
	Color,
	ColorCode,
	ColorsData,
	DetailsArgument,
	DetailsOptions,
	GlobalOptions,
	SelectValueOptions,
};
