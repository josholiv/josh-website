import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import expressiveCode from "astro-expressive-code";
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: "https://josholivier.netlify.app/",
  output: 'server',
  adapter: netlify(),
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
        'axios',
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