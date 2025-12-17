import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: '.',
  base: '/pwakemon/',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        globIgnores: ['**/assets/loveball.png'],
        navigateFallback: '/pwakemon/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 2,
            }
          },
          {
            // Cache all local sprite/assets requests after first load
            urlPattern: /\/pwakemon\/assets\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-assets',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/pokeapi\.co\/api\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokemon-sprites',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      manifest: {
        name: "Pwakémon",
        short_name: "Pwakémon",
        start_url: "/pwakemon/",
        scope: "/pwakemon/",
        display: "standalone",
        background_color: "#1b1d23",
        theme_color: "#e53935",
        icons: [
          {
            src: "./assets/loveball.png",
            sizes: "80x80",
            type: "image/png"
          },
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ]
});
