import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import relay from "vite-plugin-relay";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import commonjs from "vite-plugin-commonjs";

export default defineConfig(() => {
  return {
    plugins: [
      relay,
      react(),
      nodePolyfills({ protocolImports: true }),
      tsconfigPaths(),
      nodePolyfills({
        protocolImports: true,
      }),
      tsconfigPaths(),
      legacy({
        targets: ["defaults", "not IE 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      }),
      commonjs(),
    ],
    optimizeDeps: {
      include: ["events"],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
    }
  };
});
