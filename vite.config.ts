import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ exclude: ['src/main.ts'], tsconfigPath: './tsconfig.app.json' }), libInjectCss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      name: 'GoogleDocumentView Vue Component',
      fileName: 'google-document-view',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
