/**
 * {{TITLE}} — a DeepSeek Harness plugin template.
 *
 * Replace this demo tool with your own capability. The structure to keep:
 * - named exports `name` / `inject` / `Config` / `apply` (no default export —
 *   the Loader discards function plugins that have one)
 * - `inject` lists the services this plugin needs before `apply` runs
 * - every registration goes through `ctx` and is cleaned up automatically
 *
 * Docs: https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/user/develop/basic/
 * @module {{NAME}}
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = '{{NAME}}'

export const inject = ['tools']

/** Deployment-tunable behavior. Anything two deployments may set differently is a Config field. */
export interface Config {
  /** Example tunable; delete or replace with your own fields. */
  greeting: string
}

/** Schemastery configuration: validates on load and fills defaults. */
export const Config: z<Config> = z.object({
  greeting: z.string().default('Hello'),
})

export function apply(ctx: Context, config: Config) {
  // Required dependencies (tools) are ready before apply runs.
  console.log(`[${name}] plugin loaded!`)

  ctx.tools.register(defineTool({
    name: 'hello',
    description: 'Demo tool: greets someone with the configured greeting.',
    parameters: {
      who: { type: 'string', required: true, description: 'The name to greet' },
      // Optional parameters OMIT `required` entirely — `required: false` is rejected.
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `${config.greeting}, ${args.who}!`
    },
  }))
}
