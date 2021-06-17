#!/bin/sh

deno install \
	--root="." \
	--unstable \
	--name="xeho91-colors" \
	--allow-read \
	--allow-write \
	--allow-env="DENO_ENV" \
	--no-check \
	"./source/cli/mod.ts"
