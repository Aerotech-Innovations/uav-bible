# Contributing

## Adding a New Page

1. Create a `.md` file in the relevant section folder (e.g., `docs/hardware/lidar.md`)
2. Add it to the sidebar in `docs/.vitepress/config.ts`
3. Open a PR — GitHub Actions will build a preview automatically

## Markdown Tips

VitePress supports standard Markdown plus these extras:

**Custom containers:**

::: tip
Useful tips go here.
:::

::: warning
Warn teammates about common mistakes.
:::

::: danger
Critical safety information.
:::

**Code blocks with line highlighting:**

```python{2}
def arm_drone():
    vehicle.armed = True  # this line is highlighted
    time.sleep(1)
```

## Commit Convention

```
feat: add lidar wiring guide
fix: correct motor numbering diagram
docs: update preflight checklist
```
