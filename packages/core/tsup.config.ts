import alias from "esbuild-plugin-alias"
import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/engines/dojo/DojoEngine.ts", "src/engines/dojo/DojoSqlPixelStore.webworker.ts"],
    esbuildPlugins: [
        alias({
            "@": "./src",
        }),
    ],
    minify: false,
    splitting: false,
    loader: {
    },
    dts: true,
    format: ["esm"],
    watch: process.env.WATCH === "true",
    clean: true,
})
