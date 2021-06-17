import type { DetailsArgument } from "./commands/details.ts";

import type { Color } from "./helpers/Color.ts";

export type { SelectValueOptions } from "https://deno.land/x/cliffy@v0.19.1/mod.ts";

export type { Color };
export type ColorCode = "hsl" | "rgb" | "hex";

export interface ColorsData {
	[groupName: string]: {
		[colorName: string]: Color;
	};
}

export interface GlobalOptions {
	// config: string;
}

export interface BuildOptions extends GlobalOptions {
	output: string;
}
export interface BuildCSSoptions extends BuildOptions {
	variant: ColorCode;
}

export interface DetailsOptions extends GlobalOptions {
	variant: ColorCode;
}
export type DetailsArgument = [colors: string[]];
