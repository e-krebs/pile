import { type UserConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { crx, type ManifestV3Export } from '@crxjs/vite-plugin';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

import manifestJson from './manifest.json';

const manifest = manifestJson as ManifestV3Export;

// https://vitejs.dev/config/
export default {
  plugins: [react(), tailwindcss(), svgr({ include: '**/*.svg' }), crx({ manifest })],
  resolve: {
    alias: [
      { find: 'public', replacement: resolve(__dirname, './public') },
      { find: 'components', replacement: resolve(__dirname, './src/components') },
      { find: 'content', replacement: resolve(__dirname, './src/content') },
      { find: 'env.json', replacement: resolve(__dirname, './src/env.json') },
      { find: 'helpers', replacement: resolve(__dirname, './src/helpers') },
      { find: 'hooks', replacement: resolve(__dirname, './src/hooks') },
      { find: 'library', replacement: resolve(__dirname, './src/library') },
      { find: 'services', replacement: resolve(__dirname, './src/services') },
      { find: 'utils', replacement: resolve(__dirname, './src/utils') },
      { find: 'tailwind.css', replacement: resolve(__dirname, './src/tailwind.css') },
      { find: 'tailwind.css?inline', replacement: resolve(__dirname, './src/tailwind.css?inline') },
    ],
  },
  build: {
    rollupOptions: {
      input: {
        pocketOauth: resolve(__dirname, 'src/pages/oauth/pocket.html'),
      },
    },
  },
  server: { hmr: { host: 'localhost', port: 300 } },
} satisfies UserConfig;
