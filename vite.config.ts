import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import pluginVue from '@vitejs/plugin-vue';
import IconsResolver from 'unplugin-icons/resolver';
import pluginIcon from 'unplugin-icons/vite';
import pluginComponents from 'unplugin-vue-components/vite';
import pluginVueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import pluginVueDevTools from 'vite-plugin-vue-devtools';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    pluginVueRouter(),
    pluginVue(),
    pluginVueDevTools(),
    pluginComponents({
      dts: true,
      resolvers: [
        PrimeVueResolver(),
        IconsResolver({ prefix: 'Icon' }),
      ],
    }),
    pluginIcon(),
  ],

  envPrefix: ['VITE_', 'COMMIT_REF'],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 7408,
  },
});
