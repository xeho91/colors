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
4. Contains CLI written in [TypeScript] for [**automated task**](#automated-tasks).

[CSS custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*/
[TypeScript]: https://github.com/microsoft/typescript/

## CLI usage

**NOTE:** Requires [Deno], until I am going to be able to compile the binary files.

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
