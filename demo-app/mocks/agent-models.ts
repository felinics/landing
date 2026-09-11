// Public catalogs checked 2026-09-11. Demo choices do not imply account access.
// https://learn.chatgpt.com/docs/models
// https://code.claude.com/docs/en/model-config
const catalog = (rows: string[][]) => ({
  configured_model_id: rows[0]![0],
  configured_reasoning_effort: 'medium',
  models: rows.map(([id, name, description], index) => ({
    id, name, description, default: index === 0,
  })),
})

export const codexModels = catalog([
  ['gpt-6-astra', 'GPT 6 Astra'],
  ['gpt-5.6-sol', 'GPT 5.6 Sol'],
  ['gpt-5.6-terra', 'GPT 5.6 Terra'],
  ['gpt-5.6-luna', 'GPT 5.6 Luna'],
  ['gpt-5.3-codex-spark', 'GPT 5.3 Codex Spark', 'Research preview; requires eligible ChatGPT Pro access.'],
  ['gpt-5.5', 'GPT 5.5'],
])

export const claudeCodeModels = catalog([
  ['claude-sonnet-5', 'Claude Sonnet 5'],
  ['claude-opus-5', 'Claude Opus 5'],
  ['claude-haiku-4-5', 'Claude Haiku 4.5'],
  ['claude-fable-5-1', 'Claude Fable 5.1', 'Availability depends on your account and provider.'],
  ['claude-fable-5', 'Claude Fable 5', 'Availability depends on your account and provider.'],
])
