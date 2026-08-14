# {{TITLE}} (dsh-plugin template)

A ready-to-publish [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin skeleton. Everything is a plugin: this template gives you the bundle format, the tool DSL, config validation, tests, and the publishing checklist in one place.

## Quick start

```sh
# 1. Scaffold a new plugin from this template
node scripts/scaffold.mjs dsh-myplugin --description "What it does"

# 2. Edit the skeleton
cd ../dsh-myplugin
#    - src/index.ts: replace the demo `hello` tool with your capability
#    - src/index.ts: adjust Config fields
#    - README.md: describe install, usage, config

# 3. Test inside a DeepSeek Harness checkout
#    (requires the template at <checkout>/scratch-plugin/dsh-plugin-template)
node --import tsx/esm scratch-plugin/dsh-myplugin/test-integration.ts

# 4. Build (commit lib/ — users install without build permission)
pnpm exec tsc -p tsconfig.local.json   # inside a harness checkout
# or from a standalone clone with deps installed:
npm install && npm run build

# 5. Try it in the Web UI (from the harness checkout)
pnpm dsh --profile web --patch ./scratch-plugin/dsh-myplugin/cordis.patch.yml
```

## Publishing checklist

- [ ] Package name is free on npm (`curl -s -o /dev/null -w "%{http_code}" https://registry.npmjs.org/<name>` → 404)
- [ ] `lib/` is built and committed (GitHub installs run no build scripts)
- [ ] `repository` field in package.json points at your GitHub repo
- [ ] README documents install, usage, and every Config key
- [ ] Push to GitHub as its **own repository** (one plugin per repo — the ecosystem convention; `dsh plugin add "github:you/repo"` needs a package root)
- [ ] Add topics: `dsh-plugin`, `deepseek-harness`
- [ ] (optional) `npm publish` — users then run `dsh plugin add <name>`
- [ ] (optional) Add the repo to [awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) (README.md + README.zh-CN.md, one line each)

## Structure

```
├── package.json           # dsh.bundle.patch — the bundle manifest
├── cordis.patch.yml       # the layer inserted when a profile lists this bundle
├── src/index.ts           # plugin: name / inject / Config / apply + tools
├── test-integration.ts    # keyless harness-context test
├── tsconfig.json          # clean build config (ships to users)
└── tsconfig.local.json    # build inside a harness checkout (workspace type paths)
```

## Conventions worth keeping (learned the hard way)

- **Optional tool parameters omit `required`** — `required: false` is rejected by the schema compiler.
- **Config via Schemastery** (`z.object` from `@deepseek-ai/schemastery`): every tunable is a Config field, invalid config fails the load loudly.
- **Bounds on complete results**: cap file size, pages, characters; truncate at meaningful boundaries and tell the model how to continue.
- **Node resolution**: relative imports use `.js` extensions (NodeNext ESM); `@deepseek-ai/*` deps are declared in `dependencies` and resolve from the profile's node_modules.
- **`npm install` in a subdirectory of a pnpm workspace fails** (`workspace:` protocol) — scaffold outside the harness checkout for standalone work, or keep the local build inside the checkout with `tsconfig.local.json`.

## License

MIT.
