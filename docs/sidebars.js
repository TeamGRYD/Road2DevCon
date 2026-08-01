/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: '📊 Presentations',
      link: { type: 'doc', id: 'presentations/index' },
      items: [
        'presentations/censorship-resistance',
        'presentations/open-source',
        'presentations/privacy',
        'presentations/security',
        'presentations/devcon8',
      ],
    },
    {
      type: 'category',
      label: '⚔️ Workshop Quests',
      link: { type: 'doc', id: 'quests/index' },
      items: [
        'quests/quest-1',
        'quests/quest-2',
      ],
    },
    'quizzes',
    'smart-contract',
    'resources',
  ],
};

export default sidebars;
