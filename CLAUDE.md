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

## VitePress Markdown extras

Custom containers available in all pages:

```md
::: tip / ::: warning / ::: danger
```

Code blocks support line highlighting: ` ```python{2} `.
