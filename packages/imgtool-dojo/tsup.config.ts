import {defineConfig} from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    minify: false,
    splitting: false,
    loader: {},
    dts: true, // Enable declaration file generation
    format: ["esm"],
    watch: process.env.WATCH === "true",
    clean: true,
})
