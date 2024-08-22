# haiiro site generator

This repo houses the posts, the comments and the generator itself
for [haiiro.moe](https://haiiro.moe). It's a project made with
[Bun](https://bun.sh), markdown-it, and Pug.

## Running

You will need [Bun](https://bun.sh) (v1.1.20 or above).

1. Clone the repo: `git clone https://github.com/Kex1016/haiiro.git`
2. Run `bun i` inside the repo's folder
3. Change `settings.ts` as you see fit. **Don't delete any settings.**
4. Run `bun run build` to build the files
5. Your files are now in the `Settings.outputDir` folder (default: `dist`).
