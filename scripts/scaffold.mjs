#!/usr/bin/env node
/**
 * Scaffold a new DeepSeek Harness plugin from this template.
 *
 * Usage:
 *   node scripts/scaffold.mjs <plugin-name> [--description "what it does"] [--dir <target>] [--git]
 *
 * The plugin name must be `dsh-` followed by lowercase letters, digits, or
 * dashes (e.g. `dsh-my-plugin`). The target directory defaults to
 * `<parent-of-template>/<plugin-name>`.
 * @module scaffold
 */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const TEMPLATE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const EXCLUDED = new Set(['.git', 'node_modules', 'scripts'])
const TOKEN_FILES = ['package.json', 'cordis.patch.yml', 'README.md', 'README.en.md', 'LICENSE', 'src/index.ts', 'test-integration.ts']

function fail(message) {
  console.error(`scaffold: ${message}`)
  process.exit(1)
}

const args = process.argv.slice(2)
const name = args.find(arg => !arg.startsWith('--'))
if (name === undefined) fail('missing plugin name — usage: node scripts/scaffold.mjs dsh-my-plugin [--description "..."] [--dir <target>] [--git]')
if (!/^dsh-[a-z0-9-]+$/.test(name)) fail(`invalid plugin name ${JSON.stringify(name)}: expected dsh- plus lowercase letters, digits, or dashes`)

const descriptionArg = args.indexOf('--description')
const description = descriptionArg !== -1 ? args[descriptionArg + 1] : 'A DeepSeek Harness plugin.'
const dirArg = args.indexOf('--dir')
const target = resolve(dirArg !== -1 ? args[dirArg + 1] : join(TEMPLATE_ROOT, '..', name))
const withGit = args.includes('--git')

if (existsSync(target) && readdirSync(target).length > 0) {
  fail(`target directory ${target} already exists and is not empty`)
}

const title = name
  .replace(/^dsh-/, '')
  .split('-')
  .filter(Boolean)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

/** Copy one file, replacing template tokens for known text files. */
function copyFile(from, to) {
  const content = readFileSync(from, 'utf8')
  const relative = from.slice(TEMPLATE_ROOT.length + 1)
  if (TOKEN_FILES.includes(relative)) {
    const rendered = content
      .replaceAll('{{NAME}}', name)
      .replaceAll('{{DESCRIPTION}}', description)
      .replaceAll('{{TITLE}}', title)
    writeFileSync(to, rendered)
  } else {
    writeFileSync(to, content)
  }
}

/** Recursively copy the template tree minus {@link EXCLUDED}. */
function copyTree(from, to) {
  mkdirSync(to, { recursive: true })
  for (const entry of readdirSync(from)) {
    if (EXCLUDED.has(entry)) continue
    const source = join(from, entry)
    const dest = join(to, entry)
    if (statSync(source).isDirectory()) {
      copyTree(source, dest)
    } else {
      copyFile(source, dest)
    }
  }
}

copyTree(TEMPLATE_ROOT, target)
console.log(`scaffolded ${name} at ${target}`)

if (withGit) {
  execSync('git init -b main -q', { cwd: target, stdio: 'ignore' })
  console.log('initialized git repository (main)')
}

console.log(`
Next steps:
  1. Edit ${join(target, 'src/index.ts')} — replace the demo \`hello\` tool with your capability.
  2. Build: tsc -p tsconfig.json (deps: npm install) — commit lib/ before publishing.
  3. Inside a DeepSeek Harness checkout, test: node --import tsx/esm scratch-plugin/${name}/test-integration.ts
  4. Replace YOUR_GITHUB_USERNAME in package.json (repository field).
  5. Publish per README.md's checklist — one plugin per repo, topics: dsh-plugin, deepseek-harness.`)
