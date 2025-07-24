import { type Options, defineConfig } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
  ...(tsupConfig as Options),
  entry: [
    "src/index.ts",
    "src/DojoEngine.ts",
    "src/DojoSqlPixelStore.webworker.js",
  ],
});
