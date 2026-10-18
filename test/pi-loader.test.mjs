import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

// Pi's CLI explicitly installs this validator. Loading theme.ts alone skips schema validation.
const host = dirname(fileURLToPath(import.meta.resolve("@earendil-works/pi-coding-agent")));
const themeModule = await import(pathToFileURL(join(host, "modes/interactive/theme/theme.js")));
const { validateThemeJson } = await import(pathToFileURL(join(host, "modes/interactive/theme/theme-schema.js")));
const { THEME_TOKENS } = await import(pathToFileURL(join(host, "modes/interactive/theme/theme-tokens.js")));
themeModule.setThemeJsonValidator(validateThemeJson);
const themesDir = new URL("../themes/", import.meta.url);
const files = readdirSync(themesDir).filter((file) => file.endsWith(".json"));
const names = new Set();

for (const file of files) {
  test(`${file} loads through Pi 1.3.0 schema and renderer in both color modes`, () => {
    const path = new URL(file, themesDir);
    const json = JSON.parse(readFileSync(path, "utf8"));
    assert.equal(json.name, file.slice(0, -5));
    assert.notEqual(json.name, "system");
    assert.ok(!names.has(json.name), `duplicate theme ${json.name}`);
    names.add(json.name);
    for (const mode of ["truecolor", "256color"]) {
      const theme = themeModule.loadThemeFromPath(path, mode);
      assert.equal(theme.name, json.name);
      assert.equal(theme.appearance, file === "orgm-light.json" ? "light" : "dark");
      for (const [token, descriptor] of Object.entries(THEME_TOKENS)) {
        assert.ok(theme.colors[token], `${file}: unresolved ${token}`);
        const rendered = descriptor.slot === "background" ? theme.bg(token, "text") : theme.fg(token, "text");
        assert.ok(rendered.includes("text"));
        assert.ok(!rendered.includes("undefined"));
      }
    }
  });
}

test("the real loader rejects invalid schema, missing colors, and broken variable references", () => {
  const dir = mkdtempSync(join(tmpdir(), "pi-themes-loader-"));
  const base = JSON.parse(readFileSync(new URL("orgm.json", themesDir), "utf8"));
  try {
    for (const mutate of [
      (theme) => { theme.metadata = "not allowed"; },
      (theme) => { theme.colors.notAToken = "#fff"; },
      (theme) => { theme.colors.text = undefined; },
      (theme) => { theme.colors.text = "missingVariable"; },
      (theme) => { theme.vars.cycle = "cycle"; theme.colors.text = "cycle"; },
      (theme) => { theme.name = "light/dark"; },
    ]) {
      const json = structuredClone(base);
      mutate(json);
      const path = join(dir, "invalid.json");
      writeFileSync(path, JSON.stringify(json));
      assert.throws(() => themeModule.loadThemeFromPath(path));
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
