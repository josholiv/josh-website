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
      themes: ['vitesse-dark', 'vitesse-light'],
      useDarkModeMediaQuery: false,
      emitExternalStylesheet: false,
      themeCssSelector: (theme) => {
        if (theme.name === 'vitesse-dark') return '[data-theme="dark"]';
        return '[data-theme="light"]';
      },
      customizeTheme: (theme) => {
        // Remap backgrounds to match the site palette
        if (theme.type === 'dark') {
          theme.bg = '#272727';           // neutral-800 = --bg-secondary dark
          theme.colors['editor.background'] = '#272727';
          theme.colors['terminal.background'] = '#272727';
        } else {
          theme.bg = '#e7e7e7';           // neutral-100 = --bg-secondary light
          theme.colors['editor.background'] = '#e7e7e7';
          theme.colors['terminal.background'] = '#e7e7e7';
        }
        // Adjust syntax token colors to use the site's accessible palette
        theme.settings.unshift(
          // Keywords / control flow → purple
          { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.expression'],
            settings: { foreground: theme.type === 'dark' ? '#c184ff' : '#852cdd' } },  // purple-400 / purple-600
          // Strings → green
          { scope: ['string', 'string.quoted'],
            settings: { foreground: theme.type === 'dark' ? '#84e084' : '#1c701c' } },  // green-300 / green-600
          // Functions → blue
          { scope: ['entity.name.function', 'support.function', 'meta.function-call'],
            settings: { foreground: theme.type === 'dark' ? '#48a4ff' : '#2163a5' } },  // blue-400 / blue-600
          // Types / classes → pink
          { scope: ['entity.name.type', 'support.type', 'support.class', 'entity.other.inherited-class'],
            settings: { foreground: theme.type === 'dark' ? '#ff6bb5' : '#b4246c' } },  // pink-400 / pink-600
          // Numbers / constants → orange
          { scope: ['constant.numeric', 'constant.language', 'constant.other'],
            settings: { foreground: theme.type === 'dark' ? '#ffc062' : '#8c5400' } },  // orange-300 / orange-600
          // Comments → muted neutral
          { scope: ['comment', 'punctuation.definition.comment'],
            settings: { foreground: theme.type === 'dark' ? '#616161' : '#a0a0a0', fontStyle: 'italic' } },  // neutral-600 / neutral-400
          // Variables / parameters → neutral text
          { scope: ['variable', 'variable.parameter', 'variable.other'],
            settings: { foreground: theme.type === 'dark' ? '#a0a0a0' : '#454545' } },  // neutral-400 / neutral-700
          // HTML/JSX tags → red
          { scope: ['entity.name.tag', 'punctuation.definition.tag'],
            settings: { foreground: theme.type === 'dark' ? '#ff7474' : '#c60000' } },  // red-400 / red-600
          // Attributes → orange
          { scope: ['entity.other.attribute-name'],
            settings: { foreground: theme.type === 'dark' ? '#e68a00' : '#8c5400' } },  // orange-400 / orange-600
        );
      },
      styleOverrides: {
        borderRadius: '7px',
        borderWidth: '0px',
        codeFontFamily: '"Ubuntu Mono", monospace',
        codeFontSize: '0.9rem',
        codePaddingBlock: '0.5rem',
        codePaddingInline: '0.75rem',
        frames: {
          shadowColor: 'transparent',
          frameBoxShadowCssValue: 'none',
        },
      },
    }),
    mdx()
  ],
  vite: {
    cacheDir: './.vite-cache',
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/STLLoader',
        'preact',
        'preact/hooks',
        'preact/devtools',
      ],
    },
    ssr: {
      optimizeDeps: {
        include: [
          'lucide-preact',
          '@astrojs/preact/server.js',
          'preact',
          'preact/hooks',
          'preact/devtools',
          'astro/zod',
        ],
      },
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