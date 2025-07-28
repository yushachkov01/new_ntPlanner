import fs from 'fs';
import path from 'path';

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import vitePluginImp from 'vite-plugin-imp';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import relay from 'vite-plugin-relay';
import tsconfigPaths from 'vite-tsconfig-paths';

function antdStyleResolver(name: string) {
  try {
    const pkgRoot = path.dirname(require.resolve('antd/package.json'));
    const cssPath = path.join(pkgRoot, 'es', name, 'style', 'index.css');
    return fs.existsSync(cssPath) ? `antd/es/${name}/style/index.css` : false;
  } catch {
    return false;
  }
}

export default defineConfig({
  plugins: [
    relay,
    react(),

    vitePluginImp({
      libList: [{ libName: 'antd', libDirectory: 'es', style: antdStyleResolver }],
    }),

    nodePolyfills({ protocolImports: true }),
    tsconfigPaths(),

    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),

    commonjs(),
    visualizer({ filename: 'stats.html', open: false }),
  ],

  optimizeDeps: { include: ['events'] },

  build: {
    chunkSizeWarningLimit: 500,

    commonjsOptions: { transformMixedEsModules: true },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (/node_modules[/\\]react-dom/.test(id)) return 'react-dom';
          if (/node_modules[/\\]react[/\\]/.test(id)) return 'react';
          if (id.includes('@aws-sdk')) return 'aws-sdk';
          if (id.includes('js-yaml')) return 'yaml';

          const antdMatch = id.match(/node_modules[/\\]antd[/\\]es[/\\]([^/\\]+)[/\\]/);
          if (antdMatch) {
            return `antd-${antdMatch[1]}`;
          }
        },
      },
    },
  },
});
