var colors = require("../index.js");
var fs = require("fs-extra");
var path = require("path");

// colors.brand.forEach((color) => {
// 	const outputPath = path.join("./test", "brand", `${color.name}.css`);
// 	const variables = color;
// 	const output = `:root{\n${variables}\n}`;
// 	fs.writeFileSync(outputPath, variables);
// });

const task = process.argv[2];

if (task == "json") {
	const outputPath = path.join("./dist", "colors.json");

	console.log(`Building JSON file to: ${outputPath}...`);
	fs.outputFile(outputPath, JSON.stringify(colors, null, 2));
	console.log("Done!");
} else if (task == "css") {
	Object.keys(colors).forEach((type) => {
		colors[type].forEach((color) => {
			let CSSvariables = "";
			const outputPath = path.join("./build", type, `${color.name}.css`);

			function addVariable(name, value, unit = "") {
				CSSvariables += `\n\t--${color.name}_${name}: ${value}${unit};`;
			}

			function wrap(...parameters) {
				return parameters
					.map((param) => {
						return `\n\t\tvar(--${color.name}_${param})`;
					})
					.join(", ");
			}

			// Alpha
			addVariable("alpha", color.alpha);

			// HSL
			addVariable("hue", color.HSL.hue, "deg");
			addVariable("saturation", color.HSL.saturation, "%");
			addVariable("lightness", color.HSL.lightness, "%");
			addVariable("HSL", `${wrap("hue", "saturation", "lightness")}`);
			addVariable("HSLA", `hsla(${wrap("HSL", "alpha")}\n\t)`);

			//RGB
			addVariable("red", color.RGB.red);
			addVariable("green", color.RGB.green);
			addVariable("blue", color.RGB.blue);
			addVariable("RGB", `${wrap("red", "green", "blue")}`);
			addVariable("RGBA", `rgba(${wrap("RGB", "alpha")}\n\t)`);

			// Hexs
			addVariable("HEX", color.hex);
			addVariable("HEXA", color.hexa);

			const output = `:root{${CSSvariables}\n}`;

			console.log(`Creating a CSS file for color: "${color.name}"...`);
			fs.outputFile(outputPath, output);
			console.log("Done!");
		});
	});
} else {
	console.log(
		'What do you want to build?\nPlease add argument: "json" or "css".'
	);
}
