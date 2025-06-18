import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Simple page flip",
  description: "A util library for generating page flip effect stylesheet",
  base: process.env.BASE ?? '/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Get started', link: '/get-started' },
      { text: 'API references', link: '/api-references' }
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Setup', link: '/get-started' },
        ]
      },
      {
        text: 'References',
        items: [
          { text: 'API', link: '/api-references' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mmis1000/simple-page-flip' }
    ]
  }
})
