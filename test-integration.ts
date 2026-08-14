/**
 * Integration test: mounts the tool registry + this plugin inside a real
 * harness context and runs each registered tool's execute (no model, no key).
 * Run from a DeepSeek Harness checkout:
 *   node --import tsx/esm ../<your-plugin>/test-integration.ts
 * @module test-integration
 */

import { Context } from '@deepseek-ai/cordis'
import { SystemPrompt } from '@deepseek-ai/dsh-system-prompt'
import { ToolRuntime } from '@deepseek-ai/dsh-tools'

const ctx = new Context()
await ctx.plugin(SystemPrompt, {})
await ctx.plugin(ToolRuntime, { mode: 'both' })
const mod = await import('./src/index.ts')
await ctx.plugin(mod, {})

const exec = { signal: new AbortController().signal } as never
for (const tool of ctx.tools.schemas()) {
  console.log(`--- ${tool.name} ---`)
  console.log(JSON.stringify(tool, null, 2))
  const definition = ctx.tools.get(tool.name)
  try {
    // Run with example arguments per tool — adjust as needed.
    const result = await definition?.execute({ who: 'world' }, exec)
    console.log('execute:', result)
  } catch (error) {
    console.log('execute ERROR:', (error as Error).message)
  }
}
