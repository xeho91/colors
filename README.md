# xeho91' colors

The purpose of this repository is to automate the process of adjusting my brand
colours. And also train my coding skills.

## Technology stack

- [Deno]
- [Cliffy]
- [PostCSS]

[Deno]: https://github.com/denoland/deno/
[Cliffy]: https://github.com/c4spar/deno-cliffy/
[PostCSS]: https://github.com/postcss/postcss/

## Features

1. Uses [**CSS custom properties**], with all of the color code properties
2. Has source-maps, for easier debugging.
3. Additional colors info available via [`colors.json`](./dist/colors.json).
4. Contains CLI written in [TypeScript] for [**automated tasks**](#automated-tasks).

[CSS custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*/
[TypeScript]: https://github.com/microsoft/typescript/

## CSS usage

If you use for example [PostCSS], you can just import them with the following
code:

```css
@import "@xeho91/colors";
```

Each color has a **name**, and **properties** based on the color code used. I
prefer to use **HSLA**.\
The properties are named with following format `--<name>_<property>`.

Example:

```css
:root {
	--clairvoyant_alpha: 1;
	--clairvoyant_hue: 297deg;
	--clairvoyant_saturation: 84%;
	--clairvoyant_lightness: 10%;
	--clairvoyant_HSL: var(--clairvoyant_hue), var(--clairvoyant_saturation), var(--clairvoyant_lightness);
	--clairvoyant_HSLA: hsla(var(--clairvoyant_HSL), var(--clairvoyant_alpha));
}
```

However, the variable to use it for coloring background, color or fill is named
with the following format `--color-<name>`.

Example:

```css
body {
  color-background: var(--color-clairvoyant);
}
```

To make it darker, lighter, or whatever needs to be done, it can be used like
this:

```css
body {
  color-background: hsla(
    var(--clairvoyant_alpha),
    var(--clairvoyant_hue),
    calc(var(--clairvoyant_lightness) + 20%),
    var(--clairvoyant_alpha)
  );
}
```

It may be too verbose, but at least it gives the full control, without breaking
the brand guidelines.

To make the more transparent, is possible to use it like this:

```css
body {
  color-background: hsla(var(--clairvoyant_HSL), 0.75);
}
```

## CLI usage

**NOTE:** Requires [Deno], until I am going to be able to compile or bundle.
At the moment due to the issues with upstream and `swc`, I can't.

1. Install the package globally with Node.JS package of your choice.\
   I use `pnpm`, so in my case `pnpm install --global @xeho91/colors`.
2. Edit the [`colors.config.json`](./colors.config.json) if needed.
3. Use `xeho91-colors --help` to view available options and commands.
4. If you're lazy, just use `xeho91-colors` and it will ask you what do you
   want to do.

## Automated tasks

- [x] Generate the CSS output with desired color code variant _(HSL, RGB, or HEX)_
- [x] Display the color's data for all of the colors or specific ones
  - [ ] display them with some sorting options
- [ ] Adding/deleting new colors to the config
- [ ] Modifying existing colors in the config
