import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],

  resolve: { dedupe: ['react', 'react-dom'] },

  optimizeDeps: {
    include: ['react', 'react-dom', '@ant-design/cssinjs'],
    force: true,
  },

  build: {
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },

    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules[\\/](react|react-dom)[\\/]/.test(id)) return 'react';
          if (/node_modules[\\/](react-router|react-router-dom)[\\/]/.test(id)) return 'router';
          if (/node_modules[\\/](graphql|@apollo|graphql-ws|graphql-request)[\\/]/.test(id))
            return 'graphql';
          if (id.includes('@aws-sdk')) return 'aws-sdk';
          if (id.includes('js-yaml')) return 'yaml';
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },
});
