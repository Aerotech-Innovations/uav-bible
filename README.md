# UAV Bible

UAV Bible is the team knowledge base for Aerotech Innovations, built with [VitePress](https://vitepress.dev/). All content lives as Markdown under `docs/` and covers topics like PX4 development, MAVLink protocol, hardware wiring, and more.

## Getting Started

```bash
npm install
```

| Command | Description |
|---------|-------------|
| `npm run docs:dev` | Start the local dev server with hot reload at `http://localhost:5173/uav-bible/` |
| `npm run docs:build` | Build for production — output goes to `docs/.vitepress/dist/` |
| `npm run docs:preview` | Preview the production build locally before deploying |

## Contributing

1. Create a `.md` file under `docs/<section>/`
2. Register it in the `sidebar` inside `docs/.vitepress/config.ts`
3. Open a PR — GitHub Actions will build a preview automatically

Commit message format:

```
feat: add lidar wiring guide
fix: correct motor numbering diagram
docs: update preflight checklist
```
