// @/scripts/generate-schemas.ts

import fs from "fs";
import path from "path";

const dir = path.resolve("src/db/schemas");
const schemaFileDir = path.resolve("src/db");
const files = fs
  .readdirSync(dir)
  .filter((file) => file !== "index.ts" && file.endsWith(".ts"));

const exports = files
  .map((file) => `export * from "./${file.replace(".ts", "")}";`)
  .join("\n");

fs.writeFileSync(path.join(dir, "index.ts"), exports);

fs.writeFileSync(
  path.join(schemaFileDir, "schema.ts"),
  `export * from "@/db/schemas"`,
);

console.log("index.ts generated");
