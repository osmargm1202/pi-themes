import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

test("package exposes Pi themes", () => {
  assert.equal(pkg.name, "pi-themes");
  assert.deepEqual(pkg.pi.themes, ["./themes"]);
  const themes = readdirSync(new URL("../themes", import.meta.url)).filter((name) => name.endsWith(".json"));
  assert.equal(themes.length, 13);
  assert.ok(themes.includes("orgm.json"));
  assert.ok(themes.includes("orgm-light.json"));
});
