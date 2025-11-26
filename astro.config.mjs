// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://Calebp98.github.io',
  base: '/rfds',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
