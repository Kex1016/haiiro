// A static site generator. Extremely simple.
// Using Bun, Pug, Sass, TypeScript, Markdown and RSS.
// Made by [Kex1016](https://github.com/Kex1016)

// Importing the necessary modules
import fs from 'fs';
import path from 'path';
import * as Pug from 'pug';
import Markdown from 'markdown-it';

const Md = new Markdown();

// Defining the paths
const inputPath = path.join(__dirname, 'site');
const outputPath = path.join(__dirname, 'dist');
const templatePath = path.join(__dirname, 'templates');

// Creating the output directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

// The recursive function that looks through the input directory
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

// The function that processes a file
async function processFile(filePath: string) { // TODO
    console.log("Processing file:", filePath);
}

// For starters, let's just compile a template.
const indexTemplate = Pug.compileFile(path.join(templatePath, 'index.pug'), {pretty: true});

// Write the compiled files to the output directory
fs.writeFileSync(path.join(outputPath, 'index.html'), indexTemplate({
    title: 'Hello, World!',
    content: Md.render('# Hello, World!')
}));