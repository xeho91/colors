import type { GlobalOptions } from "../mod.ts";

export interface DetailsOptions extends GlobalOptions {
    hsl?: boolean;
    rgb?: boolean;
    hex?: boolean;
}

export type DetailsArguments = [colorName: string];

export function details(colorName: string, options: DetailsOptions) {
	//
	console.log("I'm about to give you color details");
	console.log(colorName, options);
}
