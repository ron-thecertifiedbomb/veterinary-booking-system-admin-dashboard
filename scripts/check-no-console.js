const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");

const allowedFiles = [path.normalize("src/utils/logger.ts")];

const forbiddenPatterns = ["console.log", "console.warn", "console.error"];

function walk(directory) {
  const entries = fs.readdirSync(directory);

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(entry)) {
      continue;
    }

    const relativePath = path.relative(projectRoot, fullPath);
    const normalizedPath = path.normalize(relativePath);

    if (allowedFiles.includes(normalizedPath)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    for (const pattern of forbiddenPatterns) {
      if (content.includes(pattern)) {
        console.error(`Forbidden ${pattern} found in ${relativePath}`);
        process.exit(1);
      }
    }
  }
}

walk(srcRoot);

console.log("No direct console usage found.");
