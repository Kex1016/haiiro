import Bun from "bun";
import fs from "fs";
import path from "path";
import Settings from "./settings.ts";

const srv = Bun.serve({
  fetch(req: Request): Response | Promise<Response> {
    // Serve all the files in the Settings.outputDir directory
    const outputPath = path.join(__dirname, Settings.outputDir);
    const url = new URL(req.url);
    const file = url.pathname;
    const filePath = path.join(outputPath, file);
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        // Serve index.html if it exists
        const index = path.join(filePath, "index.html");
        if (fs.existsSync(index)) {
          return new Response(fs.readFileSync(index), {
            status: 200,
            headers: {
              "content-type": "text/html",
            },
          });
        } else {
          // Serve a directory listing
          const files = fs.readdirSync(filePath);
          const list = files
            .map((f) => `<li><a href="${path.join(file, f)}">${f}</a></li>`)
            .join("");

          return new Response(`<ul>${list}</ul>`, {
            status: 200,
            headers: {
              "content-type": "text/html",
            },
          });
        }
      }

      let contentType;
      // Map the file extension to a content type
      // Extremely scuffed way of doing it. This only needs to work for local testing.
      const ext = path.extname(file);
      switch (ext) {
        case ".html":
          contentType = "text/html";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".js":
          contentType = "application/javascript";
          break;
        case ".json":
          contentType = "application/json";
          break;
        case ".xml":
          contentType = "application/xml";
          break;
        case ".svg":
          contentType = "image/svg+xml";
          break;
        default:
          contentType = "text/plain";
          break;
      }

      return new Response(fs.readFileSync(filePath), {
        headers: {
          "content-type": contentType,
        },
      });
    }
    return new Response("Not found", { status: 404 });
  },
  port: 3000,
});

console.log(`Server running at ${srv.url}`);
