import { type Options, defineConfig } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    minify: false,
    splitting: false,
    dts: true, // Enable declaration file generation
});
