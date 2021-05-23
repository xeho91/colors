import { isDark, toHex, channel } from "https://cdn.skypack.dev/khroma";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { z } from "https://deno.land/x/zod@v3.0.0/mod.ts";

import type { BuildOptions } from "../commands/build.ts";
import type { DetailsOptions } from "../commands/details.ts";

export class Color {
    name: string;

    polarity: "dark" | "light";

    hexa: string;
    hex: string;

    alpha: number;

    HSL: {
        hue: number;
        saturation: number;
        lightness: number;
    };

    RGB: {
        red: number;
        green: number;
        blue: number;
    };

    constructor(hexa: string, name: string) {
        this.name = name;

        this.hexa = hexa;
        this.hex = toHex(this.hexa);

		this.polarity = isDark(this.hexa) ? "dark" : "light";

        this.alpha = this.getColorProperty("a");

        this.HSL = {
            hue: this.getColorProperty("h"),
            saturation: this.getColorProperty("s"),
            lightness: this.getColorProperty("l"),
        };

        this.RGB = {
            red: this.getColorProperty("r"),
            green: this.getColorProperty("g"),
            blue: this.getColorProperty("b"),
        };
    }

    getColorProperty(variable: string) {
        return Math.round(channel(this.hex, variable));
    }
}

const ColorInputData = z.array(z.tuple([
    z.string().regex(
        new RegExp("^#\[0-9a-f]{8}$", "i"),
        "It must be a HEX, with pattern: '#xxxxxxxx' where x is a number or a letter between A-F",
    ), // Color hex
    z.string(), // Color name
]));

const InputSchema = z.object({}).catchall(ColorInputData);
export type InputData = z.infer<typeof InputSchema>;

export type DetailedData = Record<string, Color[]>;

const { readFileSync } = Deno;
const decoder = new TextDecoder("utf-8");

/** Generate an Object with colors grouped and with details */
export function generateColorsDetails(options: BuildOptions & DetailsOptions) {
    const VERBOSE = options.verbose;
    const inputPath = options.input;

    let inputData: InputData;

    VERBOSE && console.log("Reading & validating the colors from the input file:", inputPath);
    if (existsSync(inputPath)) {
        inputData = InputSchema.parse(JSON.parse(decoder.decode(readFileSync(inputPath))));
    } else {
        throw new Error(`Could not load the specified input file path: ${inputPath}`);
    }

    const detailedData: DetailedData = {};
    const groupNames = Object.keys(inputData);

    VERBOSE && console.log("Generating the data from the input...");
    groupNames.forEach((group) => {
        const groupedColors = inputData[group];
        const transformedEntries = groupedColors.map((colorEntry) => {
            const [hex, name] = colorEntry;

            return new Color(hex, name);
        });

        Object.assign(detailedData, { [group]: transformedEntries });
    });

    VERBOSE && console.log("Success!");
    return detailedData;
}
