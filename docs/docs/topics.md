---
sidebar_position: 8
title: Feed Topics
---

# 🗂️ Adding a Feed Topic

Feed topics are defined in `src/config/topics.js` and added through a **pull request**, the same workflow as events in `src/config/events.js`. No contract change or redeploy is needed: `FeedContract` stores submissions against a numeric topic ID, and the portal shows the topics listed in the config.

## Topic fields

```js
{
  id: 1,                                   // on-chain topic ID (0–255)
  title: 'Your best Road to DevCon moment', // row heading + submit picker label
  emoji: '📸',
  description: 'Photos and clips from the workshops.',
  // archived: true,                       // optional: hide from feed + picker
}
```

## Steps

1. Open `src/config/topics.js`.
2. Add a new entry at the end of `TOPICS` with the **next unused `id`**.
3. Open a pull request. Once merged and deployed, the topic appears as a new row on the Feed and in the submit picker.

## Rules

:::warning IDs are append-only
Never reuse, renumber or delete a topic entry. Existing on-chain submissions point at the ID; changing it would move them under the wrong topic.
:::

- **To retire a topic**, set `archived: true`. Its posts stay on-chain but are no longer shown.
- The contract accepts any `uint8` topic ID, so someone calling it directly could post to an ID that isn't configured. The portal ignores those submissions.
