const fs = require("fs");

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

const increment = process.argv.includes("increment");

let version = packageJson.version;

if (increment) {
  console.log("=== Incrementing version ===");
  const versionParts = version.split(".");
  const lastVersionPart = versionParts.pop();
  versionParts.push(parseInt(lastVersionPart, 10) + 1);
  version = versionParts.join(".");

  packageJson.version = version;
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
}

console.log("=== Version updated to " + version + " ===");
