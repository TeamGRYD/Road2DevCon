---
sidebar_position: 7
title: Feed
---

# 📣 Feed

The **Feed** tab collects community posts from **X**, **YouTube** and **Instagram**, grouped by topic. Topics are stacked vertically, and each topic's posts scroll horizontally. Videos (tweets with video, YouTube videos and Shorts, Instagram Reels) play inline in the card.

Every submission and every vote is a transaction on `FeedContract.sol` (Sepolia), tied to the submitter's profile in the [Profile Registry](/profiles).

## Using the feed

| Action | How |
|---|---|
| **Browse** | Scroll down through topics, sideways through posts |
| **Sort** | **🔥 Top** (upvotes − downvotes, newest first on ties) or **🕒 New** |
| **Submit** | Tap the **+** button, paste a link, pick a topic, confirm the transaction |
| **Vote** | ▲ / ▼ on any card. Tap your active vote again to clear it. Each change is a transaction |

You need a connected wallet with a **registered profile** to submit or vote. You can't vote on your own posts.

## Supported links

| Platform | Accepted URLs |
|---|---|
| X | `x.com/{user}/status/{id}`, `twitter.com/…/status/{id}` (mobile links and query params are fine) |
| YouTube | `youtube.com/watch?v={id}`, `youtu.be/{id}`, `youtube.com/shorts/{id}` |
| Instagram | `instagram.com/p/{code}`, `instagram.com/reel/{code}` |

The post must be **public**. The portal stores a canonical ID (tweet ID, video ID or shortcode), not the raw URL, so the same post can't be submitted twice to one topic, whichever URL form was used.

Embeds use each platform's public embed code (`widgets.js`, `youtube-nocookie.com`, Instagram's `embed.js`), so no API keys are needed. Embeds load only when a card scrolls near the viewport.

## FeedContract

| Function | Who | Description |
|---|---|---|
| `submit(topicId, platform, mediaId)` | Registered | `platform`: `0` X, `1` YouTube, `2` Instagram. `mediaId`: 1–32 chars of `[A-Za-z0-9_-]` |
| `vote(id, value)` | Registered, not the submitter | `value`: `1` up, `-1` down, `0` clear |
| `setHidden(id, hidden)` | Owner | Moderation |
| `transferOwnership(newOwner)` | Owner | |
| `getTopicCount(topicId)` | View | |
| `getTopicBatch(topicId, start, count)` | View | Paginated submissions (includes hidden; the portal filters them) |
| `getUserVotes(user, ids[])` | View | A wallet's votes for many submissions |

Feed votes are completely separate from quiz scores.

The portal reads through these view functions, not event logs, because public Sepolia RPCs limit how far back a log query can reach.

## Moderation

The deploying wallet is the feed's **owner** and can call `setHidden(id, true)` from Remix or Etherscan to hide spam, NSFW or off-topic posts. Hidden posts disappear from the portal and can't be voted on. `setHidden(id, false)` restores them. Hand moderation to another wallet with `transferOwnership`.

## Topics

Topics live in `src/config/topics.js` and are added by pull request. See [Feed Topics](/topics).

## Testing

In the **Remix VM**, after deploying `ProfileRegistry` (finalized, with a few profiles) and `FeedContract(registry)`:

1. `submit(0, 0, "1846987139428634858")` from a registered account works; from an unregistered one it reverts with *Not registered*.
2. Submitting the same `(platform, mediaId)` to topic `0` again reverts; submitting it to topic `1` works.
3. `mediaId` values like `""`, `bad"id` or 33 characters revert with *Invalid media ID*.
4. Vote `1` → `-1` → `0` from one account and check `upvotes` / `downvotes` after each step. Voting the same value twice reverts with *Vote unchanged*.
5. Voting on your own submission reverts.
6. `setHidden(id, true)` from a non-owner reverts. From the owner it works, and voting on that post then reverts.
7. `getTopicBatch(0, 0, 50)` returns the expected submissions.
