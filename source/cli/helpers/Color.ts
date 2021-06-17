import { channel, isDark } from "../deps.ts";

export class Color {
	hex: string;
	hexa: string;

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

	alpha: number;

	polarity: "dark" | "light";

	constructor(hex: string) {
		this.hex = hex;
		this.hexa = `${hex}FF`;

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

		this.polarity = isDark(this.hex) ? "dark" : "light";
	}

	getColorProperty(variable: string) {
		return Math.round(channel(this.hex, variable));
	}
}
