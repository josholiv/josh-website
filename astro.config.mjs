import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import expressiveCode from "astro-expressive-code";
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: "https://josholivier.com/",
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    preact(),
    expressiveCode({
      themes: ['github-dark'],
    }),
    mdx()
  ],
  vite: {
    cacheDir: './.vite-cache',
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/STLLoader',
        'lucide-preact',
        'preact',
        'preact/hooks',
      ],
      exclude: [],
      noDiscovery: true,
    },
    server: {
      watch: {
        ignored: ['**/.venv/**'],
      },
    },
    resolve: {
      alias: {
        three: 'three',
      },
    },
  },
});