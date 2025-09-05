import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import expressiveCode from "astro-expressive-code";
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: "https://josholivier.netlify.app/",
  integrations: [
    preact(),
    expressiveCode({
      themes: ['synthwave-84'],
    }),
    mdx()
  ],
  vite: {
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/loaders/STLLoader'],
    },
    resolve: {
      alias: {
        three: 'three',
      },
    },
  },
});
