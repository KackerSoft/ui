import packageJson from "../package.json" assert { type: "json" };
import fs from "fs";

// check if --increment flag is set
const increment = process.argv.includes("increment");

// read version and versionCode from package.json
let version = packageJson.version;

if (increment) {
    console.log("=== Incrementing version ===");
    // increment version
    const versionParts = version.split(".");
    const lastVersionPart = versionParts.pop();
    versionParts.push(parseInt(lastVersionPart) + 1);
    version = versionParts.join(".");

    // update package.json
    packageJson.version = version;

    // write package.json
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
}

console.log("=== Version updated to " + version + " ===");
