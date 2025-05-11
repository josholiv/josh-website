import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import expressiveCode from "astro-expressive-code"; // expressive code for markdown code block themes
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: "https://josholivier.netlify.app/",
  integrations: [preact(), expressiveCode({
    themes: ['kanagawa-dragon'],
  })],
    }, mdx(),
);