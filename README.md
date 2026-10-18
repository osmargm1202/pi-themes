# pi-themes

ORGM Pi themes package.

## Install

```bash
pi install git:github.com/osmargm1202/pi-themes
```

This package is also loaded by the ORGM bundle:

```bash
pi install git:github.com/osmargm1202/pi-harness
```

## Themes

- `catppuccin-mocha`
- `cyberpunk`
- `dracula`
- `everforest`
- `gruvbox`
- `midnight-ocean`
- `nord`
- `ocean-breeze`
- `orgm`
- `orgm-light`
- `rose-pine`
- `synthwave`
- `tokyo-night`

## Pi 1.3.0 compatibility

Validated against **Pi 1.3.0** (Node.js `>=22.19.0`). This is a data-only package:
there are no runtime dependencies, extensions, or host implementation copies in
the published package. The host is pinned to exactly `1.3.0` only for development.

All 13 themes are loaded with Pi's real theme loader **with its schema validator
installed**, in both truecolor and 256-color modes. Tests exercise every semantic
color role, including optional scrollbar, search, and `thinkingMax` fallbacks,
and reject invalid roles, missing required colors, and broken variable references.
The test intentionally uses internal host validation modules, so future host
upgrades require rechecking those paths and contracts.

`orgm` and `orgm-light` keep custom `cyan`/`purple` palette colors under `vars`,
not `colors`: Pi 1.3.0 rejects undocumented semantic color roles. Palette values
and documented semantic role assignments are otherwise unchanged.

Select a theme with `/settings`, or try `pi --theme ./themes --use-theme orgm`
without changing saved settings. Use `/reload` after editing package themes;
Pi only automatically watches user themes at `<agent-dir>/themes/<name>.json`.
Automated validation does not certify visual contrast or every terminal's rendering.

## Development

```bash
npm install --ignore-scripts
npm run lint
npm test
npm run pack:check
```

There is no TypeScript source or standalone typecheck target; Pi schema and color
resolution checks in `npm test` validate the JSON data contract. Lint checks JS/JSON
without reformatting the palettes.
