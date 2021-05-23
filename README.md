# xeho91' colors

The purpose of this repository is to automate the process of adjusting my brand
colours. And also train my coding skills!

## Technology stack

- [Deno]
- [Cliffy]
- [PostCSS]

[Deno]: https://github.com/denoland/deno/
[Cliffy]: https://github.com/c4spar/deno-cliffy
[PostCSS]: https://github.com/postcss/postcss

## Usage

1. Edit the [`config.json`](./config.json) or provide own entry file based on
   this template.
2. Run:

```sh
npm build
```

or

```sh
deno run --unstable --allow-env=NODE-ENV --allow-read --allow-write cli/mod.ts build
```

to start generating **JSON** or **CSS** output.
