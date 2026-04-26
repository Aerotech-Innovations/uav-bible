# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A VitePress-powered documentation site — the UAV knowledge base for Aerotech Innovations. All content is Markdown; the only code is the VitePress config and optional Vue theme files.

## Commands

```bash
npm run docs:dev       # local dev server with hot reload
npm run docs:build     # production build → docs/.vitepress/dist/
npm run docs:preview   # serve the production build locally
```

## Architecture

```
docs/
  index.md                  # home page (hero layout)
  guide/                    # current content section
  public/images/            # static assets (SVGs, etc.)
  .vitepress/
    config.ts               # site title, nav, sidebar, search, editLink, base URL
    theme/index.ts          # custom theme entry (extends default)
```

**Adding a new page** requires two steps:
1. Create `docs/<section>/<slug>.md`
2. Register it in the `sidebar` array in `docs/.vitepress/config.ts`

The site is deployed to GitHub Pages under `/uav-bible/` — the `base` option in `config.ts` must stay set to `'/uav-bible/'`.

`tsconfig.json` covers only `.vitepress/**/*.ts` and `.vue` files; path alias `@/*` maps to `docs/.vitepress/*`.

## Commit convention

```
feat: add lidar wiring guide
fix: correct motor numbering diagram
docs: update preflight checklist
```

## Document quality review

Whenever you create or edit a page under `docs/`, check:

1. **Factual accuracy** — verify product specs (sensor resolutions, model numbers, weights, TOPS ratings), regulatory details (regulation numbers, thresholds, dates), and company/country attributions against what you know. Flag anything you cannot confirm.
2. **Information currency** — note if a regulation, product, or standard cited is likely to have been superseded since your knowledge cutoff (August 2025). Flag it with a `> ⚠️ 需核实是否仍为最新版本` blockquote so editors know to verify.
3. **Internal consistency** — check that the same fact (e.g. a sensor resolution, a version number) is stated the same way everywhere it appears in the file.

If you find errors, fix them and list each change with the original value → corrected value so the author can verify.

## VitePress formatting toolkit

### Colored containers

Use these to give content visual hierarchy. Pick the container that matches the semantic weight:

| Container | Color | When to use |
|---|---|---|
| `::: tip` | Green | Recommendations, best practices, cost summaries |
| `::: info` | Blue | Key decisions, scope definitions, neutral callouts |
| `::: warning` | Yellow | Compliance requirements, operational constraints, night/BVLOS ops |
| `::: danger` | Red | Safety-critical requirements, hard regulatory blocks, supply-chain bans |
| `::: details` | — | Long tables or reference lists that clutter the page when expanded |

### Inline badges

Use `<Badge>` for priority or status labels inside tables:

```md
<Badge type="danger" text="M" />   <!-- Must — red -->
<Badge type="warning" text="S" />  <!-- Should — yellow -->
<Badge type="tip" text="N" />      <!-- Nice-to-have — green -->
<Badge type="info" text="TBD" />   <!-- Neutral label — blue -->
```

For risk registers or status tables, prefer Chinese labels so the badge scale doesn't collide with M/S/N:

```md
<Badge type="danger" text="高" />
<Badge type="warning" text="中" />
<Badge type="tip" text="低" />
```

### General formatting guidance

When writing or editing any page, apply these principles:

- **Wrap key callouts** — don't leave critical constraints or decisions as plain prose. Put them in the appropriate container so they stand out on scan.
- **Collapse large tables** — BOM lists, full supplier tables, or long reference lists should go inside `::: details` with a one-line summary above.
- **Highlight numbers that matter** — bold key thresholds, distances, weights, and dates inline (e.g. `**122 m AGL**`, `**45 min**`).
- **Use tables for comparisons** — any prose that lists 3+ options with trade-offs belongs in a table.
- **One container per concept** — don't stack multiple `::: danger` blocks back-to-back; consolidate or use a table instead.

Code blocks support line highlighting: ` ```python{2} `.
