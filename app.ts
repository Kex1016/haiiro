// A static site generator. Extremely simple.
// Using Bun, Pug, Sass, TypeScript, Markdown and RSS.
// Made by [Kex1016](https://github.com/Kex1016)

// Importing the necessary modules
import fs from 'fs';
import path from 'path';
import * as Pug from 'pug';
import Markdown from 'markdown-it';

const Md = new Markdown();

const inputPath = path.join(__dirname, 'site');
const outputPath = path.join(__dirname, 'dist');
const templatePath = path.join(__dirname, 'templates');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

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

async function processFile(filePath: string) { // TODO
    console.log("Processing file:", filePath);
}

// For starters, let's just compile the index.
const indexTemplate = Pug.compileFile(path.join(templatePath, 'index.pug'), {pretty: true});
fs.writeFileSync(path.join(outputPath, 'index.html'), indexTemplate({
    title: 'Hello, World!',
    content: Md.render('# Hello, World!')
}));