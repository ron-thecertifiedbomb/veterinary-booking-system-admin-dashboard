const fs = require("fs");
const path = require("path");

const targetPath = path.join(
  __dirname,
  "../node_modules/react-native-css-interop/dist/metro/index.js",
);

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, "utf8");

  // Check if it's already patched
  if (!content.includes("addedFiles: []")) {
    console.log(
      "Patching react-native-css-interop for Metro 0.83+ compatibility...",
    );

    // Use a flexible regular expression to match the eventsQueue block regardless of indentation or quotes
    const searchRegex =
      /(eventsQueue:\s*\[\s*\{\s*filePath,[\s\S]*?type:\s*['"]change['"],?\s*\},?\s*\],?)/;

    if (searchRegex.test(content)) {
      const replaceString = `$1
                    changes: {
                        addedDirectories: new Set(),
                        removedDirectories: new Set(),
                        addedFiles: [],
                        modifiedFiles: [[filePath, { isSymlink: false, modifiedTime: Date.now() }]],
                        removedFiles: [],
                    },
                    rootDir: "",`;

      fs.writeFileSync(targetPath, content.replace(searchRegex, replaceString));
      console.log("✅ Patch applied successfully!");
    } else {
      console.log(
        "⚠️ Could not find the exact string to replace. The file might have changed.",
      );
    }
  } else {
    console.log("✅ react-native-css-interop is already patched.");
  }
}
