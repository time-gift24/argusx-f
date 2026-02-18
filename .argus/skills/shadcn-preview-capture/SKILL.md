---
name: shadcn-preview-capture
description: "Capture shadcn/ui component previews using Playwright. Use when: (1) Getting shadcn/ui component preview pages from ui.shadcn.com, (2) Taking screenshots of UI components with static/dynamic states, (3) Automating hover, expand, focus interactions to capture component behaviors. Triggered by requests involving shadcn/ui preview screenshots, component visual testing, or capturing UI states."
---

# Shadcn Preview Capture

Use a scenario-driven Playwright script so dynamic states are validated before screenshot.

## Mandatory Workflow

1. Build preview URL.
2. Write a scenario JSON with interaction actions and assertions.
3. Run the capture script.
4. Fail fast if dynamic states do not differ from default.

Do not use plain `npx playwright screenshot` for interactive components. It cannot verify whether click/hover/focus actually changed the UI.

## URL Construction

Primary pattern:

```text
https://ui.shadcn.com/preview/radix/{component}-example?item={component}-example&style=mira&theme=cyan&font=nunito-sans&menuAccent=bold&radius=medium&template=vite
```

If 404, open create page and read left sidebar links:

```text
https://ui.shadcn.com/create?base=radix&style=mira&baseColor=neutral&theme=cyan&iconLibrary=lucide&font=nunito-sans&menuAccent=bold&menuColor=default&radius=medium&template=vite&rtl=false
```

See `references/URL_REFERENCE.md` for component URLs.

## Script-First Capture

Use:

```bash
node .argus/skills/shadcn-preview-capture/scripts/capture_interactions.mjs \
  --url "<preview-url>" \
  --scenario "<scenario-json-path>" \
  --out-dir "previews/shadcn/<component>" \
  --viewport 1440x1200 \
  --full-page
```

### Script Guarantees

- Supports `click`, `hover`, `press`, `fill`, `type`, `drag`, `check`, `uncheck`, `waitFor`, `wait`.
- Runs assertions after interactions (e.g. `visible`, `attr`, `textIncludes`, `count`).
- Supports `mustDifferFrom` and `mustDifferFromPrevious`; exits with error when screenshots are identical.
- Supports `reset: true` per shot to reload page before a new state branch.

## Scenario Authoring Rules

- Always include a baseline shot (for example `default`).
- For non-default states, set `mustDifferFrom` (usually `default`).
- For overlays/popovers/dialogs, add assertions such as:
  - popup/listbox/dialog is visible
  - trigger `aria-expanded="true"`
- Prefer stable selectors (`role + name`, label text, data attributes) over fragile class selectors.

See `references/INTERACTIONS.md` for scenario schema and ready-to-use examples.

## Output Convention

Save screenshots to:

```text
previews/shadcn/<component>/
```

Recommended file names:

- `<component>-default.png`
- `<component>-hover.png`
- `<component>-open.png`
- `<component>-active.png`
- `<component>-disabled.png`

## Post-Capture Verification

The script already blocks identical shots when `mustDifferFrom` is set. For extra validation, run:

```bash
find previews/shadcn/<component> -name '*.png' -print0 | xargs -0 md5
```

If hashes are identical for different states, the state capture is invalid and must be redone with better selectors/assertions.
