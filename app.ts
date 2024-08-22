// A static site generator. Extremely simple.
// Using Bun, Pug, Sass, TypeScript, Markdown and RSS.
// Made by [Kex1016](https://github.com/Kex1016)

// Importing the necessary modules
import fs from 'fs';
import path from 'path';
import * as Pug from 'pug';
import Markdown from 'markdown-it';
import yaml from "yaml";
import xml from "xml";
import Settings from "./settings.ts";

const Md = new Markdown();

const inputPath = path.join(__dirname, Settings.inputDir);
const outputPath = path.join(__dirname, Settings.outputDir);
const templatePath = path.join(__dirname, Settings.templateDir);

// Clear out the output directory
if (fs.existsSync(outputPath)) {
    fs.rmSync(outputPath, {recursive: true, force: true});
}

fs.mkdirSync(outputPath);

console.log("Copying static files...");
const staticFiles = fs.readdirSync(path.join(__dirname, "public"));
for (const file of staticFiles) {
    fs.cpSync(path.join(__dirname, "public", file), path.join(outputPath, file), {recursive: true});
}

type Post = {
    title: string,
    description: string,
    date: string,
    image?: string,
    tags?: string[],
    slug?: string,
    type: string,
};
const posts: Post[] = [];
const pages: Post[] = [];

async function processDirectory(directory: string) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            await processDirectory(filePath);
        } else {
            await processFile(filePath);
        }
    }
}

async function processFile(filePath: string) {
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const folder = path.dirname(filePath).substring(inputPath.length + 1);
    const currentDir = folder.split(path.sep).pop();
    if (!currentDir) throw new Error("No current directory found.");
    const isComplex = currentDir.toLowerCase() === name.toLowerCase();

    // If markdown, read
    if (ext === '.md') {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Get the metadata and the body
        const meta = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!meta) {
            console.error("No metadata found in", filePath);
            return;
        }

        const metadata = meta[1];
        const body = meta[2];
        const data = yaml.parse(metadata) as Post;
        if (!data.type) {
            data.type = "post";
        }

        if (!data.slug) {
            data.slug = name;
        }

        if (data.image && !/^https?:\/\//g.test(data.image)) {
            // yes, i know this is horrible, but it works.
            data.image = `/posts/${data.slug}/${data.image}`
        }

        if (data.tags) {
            const _t = [];
            for (const tag of data.tags) {
                _t.push(tag.toLowerCase().replace(/ /g, "-"));
            }
            data.tags = _t;
        }

        if (data.type === "post") posts.push(data);
        else pages.push(data);

        const postTemplate = Pug.compileFile(path.join(templatePath, 'post.pug'), {pretty: Settings.isPretty});
        const postPath = path.join(outputPath, folder, isComplex ? '' : data.slug);
        if (!fs.existsSync(postPath)) {
            fs.mkdirSync(postPath, {recursive: true});
        }
        fs.writeFileSync(path.join(postPath, 'index.html'), postTemplate({
            title: `haiiro - ${data.title.toLowerCase()}`,
            type: data.type,
            post: {
                title: data.title,
                description: data.description,
                date: data.date,
                image: data.image,
                tags: data.tags,
                content: Md.render(body),
                type: data.type,
            },
            canonical: `${Settings.siteUrl}/${folder}/${isComplex ? '' : data.slug}`,
            metaDesc: data.description,
            ogImage: data.image,
            currentPage: data.slug,
        }));
    } else {
        const dest = path.join(outputPath, folder);
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true});
        }

        const file = path.basename(filePath);
        fs.copyFileSync(filePath, path.join(dest, file));
    }

    console.log("Processed file:", filePath);
}

// For starters, let's just compile the index.
const indexTemplate = Pug.compileFile(path.join(templatePath, 'index.pug'), {pretty: Settings.isPretty});
fs.writeFileSync(path.join(outputPath, 'index.html'), indexTemplate({
    title: 'haiiro',
    canonical: Settings.siteUrl,
    currentPage: 'home',
}));

// Process the site directory
await processDirectory(inputPath);
console.log("Done processing files.");

// get the tags from the posts
type Tag = {
    [tag: string]: Post[]
};

console.log("Rendering tags...");
const tags: Tag = {};
posts.forEach(post => {
    if (post.tags) {
        post.tags.forEach(tag => {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(post);
        });
    }
});

console.log("Rendering the post list page...");
if (!fs.existsSync(path.join(outputPath, Settings.postDir))) {
    fs.mkdirSync(path.join(outputPath, Settings.postDir), {recursive: true});
}

const postListTemplate = Pug.compileFile(path.join(templatePath, 'posts.pug'), {pretty: Settings.isPretty});
fs.writeFileSync(path.join(outputPath, 'posts', 'index.html'), postListTemplate({
    title: 'haiiro - posts',
    posts: posts,
    canonical: `${Settings.siteUrl}/posts`,
    currentPage: 'posts',
    tags: tags,
}));

console.log("Rendering tag pages...")
for (const tag in tags) {
    const tagTemplate = Pug.compileFile(path.join(templatePath, 'tag.pug'), {pretty: Settings.isPretty});

    if (!fs.existsSync(path.join(outputPath, 'tags', tag))) {
        fs.mkdirSync(path.join(outputPath, 'tags', tag), {recursive: true});
    }

    fs.writeFileSync(path.join(outputPath, 'tags', tag, 'index.html'), tagTemplate({
        title: `haiiro - ${tag}`,
        posts: tags[tag],
        tag: tag,
        canonical: `${Settings.siteUrl}/tags/${tag}`,
        currentPage: `tags/${tag}`,
    }));
}

console.log("Generating RSS feed...");
const feedObject = {
    rss: [
        {
            _attr: {
                version: "2.0",
                "xmlns:atom": "http://www.w3.org/2005/Atom",
            },
        },
        {
            channel: [
                {
                    "atom:link": {
                        _attr: {
                            href: `${Settings.siteUrl}/feed.xml`,
                            rel: "self",
                            type: "application/rss+xml",
                        },
                    },
                },
                {
                    title: "haiiro",
                },
                {
                    link: `${Settings.siteUrl}/`,
                },
                {description: "A simple blog for a simple person."},
                {language: "en-US"},
                {lastBuildDate: new Date().toUTCString()},
                ...posts.map(post => ({
                    item: [
                        {title: post.title},
                        {link: `${Settings.siteUrl}/${post.slug}`},
                        {description: post.description},
                        {pubDate: new Date(post.date).toUTCString()},
                        ...(post.tags || []).map(tag => ({
                            category: tag,
                        })),
                    ],
                })),
            ],
        },
    ],
};

fs.writeFileSync(path.join(outputPath, 'index.xml'), xml(feedObject, {declaration: true}));

console.log(`Total posts: ${posts.length}`);
console.log(`Total tags: ${Object.keys(tags).length}`);
for (const tag in tags) {
    console.log(`Tag: ${tag} has ${tags[tag].length} posts.`);
}
console.log(`Total pages: ${pages.length}`);
console.log("Done.");