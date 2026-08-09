import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

const site = process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-ibm-plex-sans',
      weights: ['400', '500', '600'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Source Serif 4',
      cssVariable: '--font-source-serif-4',
      weights: ['500', '600', '700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
