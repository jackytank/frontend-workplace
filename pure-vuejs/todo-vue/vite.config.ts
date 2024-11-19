import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { pluginAPIRoutes } from 'vite-plugin-api-routes';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    pluginAPIRoutes({
      routeBase: '/rest-api',
      dirs: [
        {
          dir: 'src/rest-api',
          route: '',
          exclude: []
        }
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'public',
          dest: ''
        }
      ]
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    })
  ],
  publicDir: false,
});
