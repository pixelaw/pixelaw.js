import {defineConfig} from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/DojoEngine.ts", "src/DojoSqlPixelStore.webworker.ts"],
    esbuildPlugins: [
        // alias({
        //     "@": "./src",
        // }),
    ],
    minify: false,
    splitting: false,
    loader: {},
    dts: true, // Enable declaration file generation
    format: ["esm"],
    watch: process.env.WATCH === "true",
    clean: true,
})
