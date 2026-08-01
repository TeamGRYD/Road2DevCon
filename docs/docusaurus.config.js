// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Road to DevCon 8",
  tagline: "Workshops Edition — Documentation & Resources",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://wiki.road2devcon.quest",
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: "/",

  // GitHub pages deployment config
  organizationName: "TeamGRYD",
  projectName: "RoadToDevcon8",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/social-card.png",
      navbar: {
        title: "Road to DevCon 8",
        logo: {
          alt: "DevCon 8 Logo",
          src: "img/devcon8-logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "https://github.com/TeamGRYD/Road2DevCon",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://devcon.org",
            label: "DevCon.org",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              { label: "Getting Started", to: "/getting-started" },
              { label: "Presentations", to: "/presentations" },
              { label: "Quests", to: "/quests" },
              { label: "Resources", to: "/resources" },
            ],
          },
          {
            title: "Ecosystem",
            items: [
              { label: "DevCon 8", href: "https://devcon.org" },
              { label: "Ethereum.org", href: "https://ethereum.org" },
              { label: "GRYD", href: "https://gryd.wtf" },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GRYD on X",
                href: "https://x.com/TeamGRYD",
              },
              {
                label: "GitHub",
                href: "https://github.com/TeamGRYD/Road2DevCon",
              },
              {
                label: "DevCon on X",
                href: "https://x.com/EFDevcon",
              },
            ],
          },
        ],
        copyright: `Built for DevCon 8 Mumbai 🇮🇳 with 💗 by <a href="https://x.com/TeamGRYD" target="_blank" rel="noopener noreferrer">GRYD</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["solidity"],
      },
      colorMode: {
        defaultMode: "dark",
        respectPrefersColorScheme: true,
      },
    }),
};

export default config;
