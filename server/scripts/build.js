import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { build } from "esbuild";

import { logger } from "../utils/logger.js";
import { wait } from "../utils/wait.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get dependencies
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8"),
);
const dependencies = Object.keys(packageJson.dependencies || {});

async function buildApp() {
  try {
    logger.info("Building Express app...");
    await wait(1000);

    await build({
      entryPoints: ["index.js"],
      bundle: true,
      outfile: "./dist/index.js",
      platform: "node",
      target: "node18",
      format: "esm",
      external: [
        ...dependencies,
        "fs",
        "path",
        "http",
        "https",
        "crypto",
        "os",
        "util",
        "stream",
        "events",
        "url",
        "querystring",
        "zlib",
      ],
      minify: process.env.NODE_ENV === "production",
      sourcemap: process.env.NODE_ENV !== "production",
      loader: {
        ".js": "js",
        ".json": "json",
      },
      define: {
        "process.env.NODE_ENV": `"${process.env.NODE_ENV || "development"}"`,
      },
      banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
        `.trim(),
      },
      metafile: true,
    });

    logger.success("✅ Build completed successfully!");
    await wait(500);
    logger.info("📦 Output: ./dist/index.js");
  } catch (error) {
    logger.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Run build
buildApp();
