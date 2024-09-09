---
title: I made a tool to rescore your AL library!
description: The "I made a" gimmick continues forever...
slug: al-rescorer
date: 2024-03-30 18:50:00+0100
tags:
  - typescript
  - webdev
  - anilist
---

# Hi!

Here's this month's "I made a" post! This time, I made a tool to
quickly re-score your AniList library! It's my first go at publishing
a full web app, and I'm honestly pretty happy with how it turned out.

## What does it do?

It's simple:
- You log in with your AniList account
- You go to the list view, and select an item
- You edit the item directly, or go to the bulk editor to edit multiple items at once
- You save your changes
- Done!

## How does it work?

The app uses the AniList API to fetch your library data, and then
sends the changes back to the API. It's a pretty simple setup, but
it's been a great learning experience for me. Even if the code is
*i n c r e d i b l y* messy. I'll clean it up eventually, I promise.

If you really want to know the specifics, I used [Bun](https://bun.sh/),
[TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/),
[Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/),
[React Router](https://reactrouter.com/), and [shadcn/ui](https://ui.shadcn.com/).
Actually, I wanna say a HUGE thank you to the people behind `shadcn/ui`!
It's a great library, and it made my life so much easier.

## Where can I find it?

You can find the app at https://haiiro.moe/rescorer and the source code
over on [GitHub](https://github.com/Kex1016/anilist-rescore). The
next minor release will include many fixes, including a mobile mode.
For now, it's desktop only. Sorry!

That's all for now! I hope you enjoy the tool, and I'll see you next
month for another "I made a" post! *(I hope.)*