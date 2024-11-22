---
title: Haiiro version... three?
description: Welcome back, 2014!
slug: the-new-new-haiiro
image: cover.png
date: 2024-11-22 20:50:00+0100
tags:
  - webdev
  - typescript
---

# Hiii!!! >.<

Yep, new Haiiro! Again. I had an idea that was too good to pass up. So, now there are more people than just me!

The new version of the main site uses Deno v2, because I wanted to try it out. It's also a site generator, except instead of this personal site,
the new one is much simpler and way more focused on automation. So...

## How exactly?

The main principle stays the same as before:

- Make some Pug and SCSS files for templates and styles.
- Write the content in either Markdown or straight into the Pug files.
- Run the generator script to compile everything into HTML and CSS.

Where it differs is that this time around I've built the entire system around it being automated.
The generator is now a compiled binary using Deno's `deno compile` feature, and I have made a cron job that runs it every 5 minutes.
This means that I can add any amount of people to the group and they can upload whatever they want, and it will be live as soon as the cron job runs.

## What's next?

The plan for the future is to just keep adding more features of course. Some of these include a proper way to edit the main page for others, a way to
add blog posts from all the members, some sort of admin panel or online editor thingy, and an easier way to add new members.

If I do go through with the admin panel idea I will have to make a whole back-end for it, which I'm not sure how I feel about. I do like making back-end things,
but the whole idea of the site is to be simple and easy to use. We'll see how it goes.

## And that's it!

I hope you like the new site! I'm really excited to see where this goes and also excited to see what the others will do with it :D
