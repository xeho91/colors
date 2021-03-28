var khroma = require("khroma");

class Color {
	constructor(hexa, name) {
		this.name = name;

		this.polarity = khroma.isDark(hexa) ? "dark" : "light";

		this.hexa = hexa;
		this.hex = khroma.hex(this.hexa);

		this.alpha = this.channel("a");

		this.HSL = {
			hue: this.channel("h"),
			saturation: this.channel("s"),
			lightness: this.channel("l"),
		};

		this.hsla = `hsla(${this.HSL.hue}deg, ${this.HSL.saturation}%, ${this.HSL.lightness}%, ${this.alpha})`;

		this.RGB = {
			red: this.channel("r"),
			green: this.channel("g"),
			blue: this.channel("b"),
		};

		this.rgba = `rgba(${this.RGB.red}, ${this.RGB.green}, ${this.RGB.blue}, ${this.alpha})`;
	}

	channel(variable) {
		return Math.round(khroma.channel(this.hex, variable));
	}
}

var colors = {
	brand: [
		new Color("#2D042FFF", "clairvoyant"),
		new Color("#E28f4BFF", "terracotta"),
	],

	supplementary: [
		new Color("#261003FF", "kilamanjaro"),
		new Color("#E1B594FF", "calico"),
	],

	gradient: [
		new Color("#520844FF", "mulberry"),
		new Color("#9D133CFF", "disco"),
		new Color("#DF4F27FF", "punch"),
	],
};

module.exports = colors;
