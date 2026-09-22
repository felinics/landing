import scenario from './scenario.json'
import installedSkillData from './installed-skills.json'
import workspaceTemplate from './workspace-template.json'
import { demoLocale } from './locale'
export type RecordData = Record<string, any>
export const now = '2026-09-10T08:00:00Z'
// Scripted content ships in English (with one zh session for multilingual flavor).
// Japanese swaps every visitor-facing string; ids, paths and keys stay stable.
const ja = demoLocale === 'ja'
if (ja) {
  const folderNames: Record<string, string> = { daily: 'デイリープランナー', research: 'リサーチノート', tracker: '読書トラッカー', studio: 'デザインスタジオ' }
  for (const folder of scenario.folders) folder.name = folderNames[folder.key] ?? folder.name
  // The product's own ja locale keeps "Cloud Computer" as branding, so only the
  // user-named remote machine is localized here.
  const computerNames: Record<string, string> = { "Alex's Mac Mini": 'Alex の Mac mini' }
  for (const computer of scenario.computers) computer.name = computerNames[computer.name] ?? computer.name
}
export const user = { id: 'demo-user', username: 'alex', display_name: 'Alex Chen', role: 'admin', is_active: true, last_login_at: now, timezone: 'Asia/Singapore', avatar_url: '', metadata: { onboarding_completed: true }, created_at: now, updated_at: now }
export const bots = (ja ? [
  ['memoh', 'Memoh', '毎日の相棒。調べもの、創作、そして記憶を。'],
  ['research', 'リサーチアシスタント', '出典を探し、アイデアをつなぎ、明快なリサーチブリーフを書く。'],
  ['developer', '開発コンパニオン', '専用ワークスペースで、じっくりソフトウェアを作る。'],
  ['studio', 'クリエイティブスタジオ', 'アイデアを物語・画像・プレゼンテーションに。'],
] : [
  ['memoh', 'Memoh', 'Your everyday companion. Research, create, and remember.'],
  ['research', 'Research Assistant', 'Find sources, connect ideas, and write clear research briefs.'],
  ['developer', 'Dev Companion', 'Build thoughtful software in a dedicated workspace.'],
  ['studio', 'Creative Studio', 'Turn ideas into stories, images, and presentations.'],
]).map(([name, display_name, description]) => ({ id: `bot-${name}`, name, display_name, metadata: { description }, avatar_url: '', owner_user_id: user.id, is_active: true, status: 'ready', check_state: 'ok', check_issue_count: 0, current_user_permissions: ['chat', 'manage', 'workspace_read', 'workspace_write'], timezone: 'Asia/Singapore', created_at: now, updated_at: now }))
export const providers = [
  ['OpenAI', 'openai'], ['Anthropic', 'anthropic'], ['DeepSeek', 'openai'],
  ['Z.ai', 'openai'], ['Moonshot', 'openai'],
].map(([name, client_type], i) => ({ id: `provider-${i}`, name, icon: name!.toLowerCase(), client_type, provider_template_id: name!.toLowerCase(), enable: true, config: { api_key: 'demo-key', base_url: '' }, metadata: {}, created_at: now, updated_at: now }))
// Display names follow the supplied production screenshot; IDs are demo-local.
export const models = [
  { id: 'model-1', name: 'DeepSeek V4.1 Flash', model_id: 'deepseek-v4.1-flash', provider_id: 'provider-2', type: 'chat' },
  { id: 'model-0', name: 'GPT 5.6 Sol', model_id: 'gpt-5.6-sol', provider_id: 'provider-0', type: 'chat' },
  { id: 'model-2', name: 'GPT 6 Astra', model_id: 'gpt-6-astra', provider_id: 'provider-0', type: 'chat' },
  { id: 'model-3', name: 'GPT 5.6 Luna', model_id: 'gpt-5.6-luna', provider_id: 'provider-0', type: 'chat' },
  { id: 'model-6', name: 'GLM 5.3 Flash', model_id: 'glm-5.3-flash', provider_id: 'provider-3', type: 'chat' },
  { id: 'model-7', name: 'Claude Sonnet 5', model_id: 'claude-sonnet-5', provider_id: 'provider-1', type: 'chat' },
  { id: 'model-8', name: 'Kimi K3', model_id: 'kimi-k3', provider_id: 'provider-4', type: 'chat' },
  { id: 'model-9', name: 'Claude Opus 5', model_id: 'claude-opus-5', provider_id: 'provider-1', type: 'chat' },
  { id: 'model-4', name: 'text-embedding-3-small', model_id: 'text-embedding-3-small', provider_id: 'provider-0', type: 'embedding' },
  { id: 'model-5', name: 'GPT Image 1', model_id: 'gpt-image-1', provider_id: 'provider-0', type: 'image' },
].map(model => ({ ...model, enable: true, config: { context_window: 200000, max_tokens: 16384, vision: true, tool_call: true }, reasoning: { supported: true, efforts: ['low','medium','high'], default_effort: 'high' } }))
export const settings = { chat_model_id: 'model-1', compaction_model_id: 'model-0', chat_runtime: 'native', default_bot_agent_id: '', reasoning_effort: 'high', language: 'en', timezone: 'Asia/Singapore', compaction_enabled: true, compaction_threshold: 80000, compaction_target_percent: 50, search_provider_id: 'search-0', memory_provider_id: 'memory-0', fetch_provider_id: 'fetch-0', image_model_id: 'model-5', tts_model_id: 'speech-0', transcription_model_id: 'transcription-0', video_model_id: 'video-0', display_enabled: false, show_tool_calls_in_im: true, persist_full_tool_results: true, acl_default_effect: 'allow', tool_approval_config: { mode: 'auto' } }
export const sessionTitles = ja
  ? ['充実した一週間を計画する', 'リサーチ：パーソナル AI の未来', '読書トラッカーを作る', '今日のちょっとしたインスピレーション', '整理我的项目笔记', '週間リサーチダイジェスト']
  : ['Plan a productive week', 'Research: the future of personal AI', 'Build a reading tracker', 'A little inspiration for today', '整理我的项目笔记', 'Weekly research digest']
export const sessions: RecordData[] = bots.flatMap(bot => sessionTitles.map((title,i) => ({ id: bot.name==='memoh' && i===0 ? 'session-welcome' : `${bot.id}-session-${i}`, bot_id: bot.id, title, type: 'chat', session_mode: 'chat', runtime_type: 'native', bot_agent_id: '', workdir_id: `${bot.id}-${scenario.folders[i % scenario.folders.length]!.key}`, channel_type: 'local', created_by_user_id: user.id, metadata: {}, runtime_metadata: {}, preferred_chat_model_id: 'model-1', preferred_reasoning_effort: 'high', created_at: new Date(Date.parse(now)-i*3600000).toISOString(), updated_at: new Date(Date.parse(now)-i*3600000).toISOString() })))
export const histories: Record<string, RecordData[]> = {}
export function conversation(sid: string): RecordData[] {
  if (histories[sid]) return histories[sid]
  const session=sessions.find(s=>s.id===sid)
  if (!session) return histories[sid]=[]
  const variant=sessionTitles.indexOf(session.title)
  const prompts=ja?[
    '今週は、大事なことに時間を使えるようにしたい。',
    'パーソナル AI アシスタントが長く役立つ条件って何だろう？',
    'シンプルな読書トラッカーの設計を手伝って。',
    '小さなクリエイティブプロジェクトのアイデアがほしい。',
    '帮我整理一下项目笔记，列出下一步。',
    '週間リサーチダイジェストをまとめてくれる？',
  ]:[
    'Help me make space for what matters this week.',
    'What makes a personal AI assistant useful over time?',
    'Help me sketch a simple reading tracker.',
    'Give me an idea for a small creative project.',
    '帮我整理一下项目笔记，列出下一步。',
    'Can you prepare a weekly research digest?',
  ]
  const replies=ja?[
    '',
    '## 少しの文脈が、大きな違いに\n\n役に立つパーソナルアシスタントは、あなたの好み、やりかけのプロジェクト、これまでの決定を土台にできます。\n\n- **メモリ**が大事な文脈を覚えておきます。\n- **ツール**でファイルやサービスを扱えます。\n- **ワークスペース**がプロジェクトごとの置き場になります。\n\n最初のアウトラインを `research-notes.md` に保存しました。一緒に出典を加えながら磨いていきましょう。',
    '## あなたの読書トラッカー\n\nまずは 3 つのフィールドから始めましょう：**タイトル**、**カテゴリー**、**ステータス**。\n\n```typescript\ninterface ReadingItem {\n  title: string\n  category: string\n  status: \'to-read\' | \'reading\' | \'finished\'\n}\n```\n\nサンプルの読書リストを `reading-list.csv` に置きました。**ファイル**を開いてワークスペースを見てみてください。',
    '**7 日間の観察日記**はどうでしょう。毎日、日常のディテールをひとつ——影、会話のひとこと、電車の窓——選んで、3 つの文にしてみます。\n\n今日のお題：*気づかずに通り過ぎそうになったものは？*\n\nここに書きためて、週の終わりに小さな物語へまとめましょう。',
    '## 项目笔记整理\n\n目前有三个值得推进的方向：\n\n1. **阅读清单**：先完成标题、分类和阅读状态。\n2. **研究笔记**：把参考资料与结论放在一起。\n3. **每周回顾**：保留进展、问题和下一步。\n\n建议今天先做一个可以使用的阅读清单原型。相关笔记已经放进工作区，可在左侧「文件」中查看。',
    '## 今週のまとめ\n\n### 残しておきたい気づき\n- 役立つアシスタントは、メモリと行動をつなげている。\n- 小さくて中身の見えるワークフローのほうが信頼しやすい。\n- 共有ワークスペースがあると、リサーチが仕事のすぐそばにある。\n\n### 来週\nアイデアをひとつ選んで小さなプロトタイプを作り、学んだことを書き留める。\n\n**朝のブリーフィング**と**週次のふりかえり**のスケジュールは、Bot 設定 → スケジュールで確認できます。',
  ]:[
    '',
    '## A little context goes a long way\n\nA useful personal assistant can build on your preferences, unfinished projects, and earlier decisions.\n\n- **Memory** keeps the important context.\n- **Tools** let it work with your files and services.\n- **A workspace** gives every project a place to live.\n\nI saved a first outline in `research-notes.md`. We can add sources and refine it together.',
    '## Your reading tracker\n\nLet’s start with three fields: **title**, **category**, and **status**.\n\n```typescript\ninterface ReadingItem {\n  title: string\n  category: string\n  status: \'to-read\' | \'reading\' | \'finished\'\n}\n```\n\nI put a sample reading list in `reading-list.csv`. Open **Files** to explore your workspace.',
    'Try a **seven-day observation journal**. Take one everyday detail—a shadow, a line of conversation, a train window—and turn it into three sentences.\n\nToday’s prompt: *What did you almost walk past without noticing?*\n\nWe can collect the entries here and shape them into a small story at the end of the week.',
    '## 项目笔记整理\n\n目前有三个值得推进的方向：\n\n1. **阅读清单**：先完成标题、分类和阅读状态。\n2. **研究笔记**：把参考资料与结论放在一起。\n3. **每周回顾**：保留进展、问题和下一步。\n\n建议今天先做一个可以使用的阅读清单原型。相关笔记已经放进工作区，可在左侧「文件」中查看。',
    '## This week, at a glance\n\n### Ideas worth keeping\n- Useful assistants connect memory with actions.\n- Small, inspectable workflows are easier to trust.\n- A shared workspace keeps research close to the work.\n\n### Next week\nPick one idea, build a tiny prototype, and write down what you learn.\n\nYour **Morning brief** and **Weekly reflection** schedules are available in Bot Settings → Schedule.',
  ]
  const memorySeed=ja
    ?{query:'今週の優先事項と仕事の好み',memories:['午前中はディープワークのために空けておく','今週中に読書トラッカーを仕上げる','昼食後に散歩の時間をとる']}
    :{query:'weekly priorities and work preferences',memories:['Keep mornings free for deep work','Ship the reading tracker this week','Make time for a walk after lunch']}
  const welcomeReply=ja
    ?'もちろんです。たしか午前中は**ディープワーク**にあてて、不意の出来事のための余白も残しておくのがお好みでしたよね。\n\n今週のゆるやかなプランです：\n\n| フォーカス | 次の一歩 |\n| --- | --- |\n| 🛠️ つくる | 読書トラッカーのプロトタイプを仕上げる |\n| 📚 学ぶ | 良い記事を 3 本読んで保存する |\n| 🌿 休む | 昼食後に少し散歩する |\n\nプランはワークスペースに置いてあるので、あとで一緒に見直せます。どれから始めましょうか？'
    :"Of course. I remember you like to keep mornings for **deep work** and leave a little room for the unexpected.\n\nHere’s a gentle plan for the week:\n\n| Focus | Next step |\n| --- | --- |\n| 🛠️ Build | Finish the reading tracker prototype |\n| 📚 Learn | Read and save three thoughtful articles |\n| 🌿 Recharge | Take a short walk after lunch |\n\nI've kept the plan in your workspace so we can come back to it together. What would you like to start with?"
  const turns = [
    { id: `${sid}-u1`, turn_id: `${sid}-t1`, turn_position: 1, role: 'user', text: prompts[variant] ?? prompts[0], sender_user_id: user.id, sender_display_name: 'Alex', platform: 'local', timestamp: now },
    { id: `${sid}-a1`, turn_id: `${sid}-t1`, turn_position: 1, role: 'assistant', timestamp: now, messages: [
      { id: 1, type: 'tool', name: 'memory_search', tool_call_id: 'memory-demo', input: { query: memorySeed.query }, output: { memories: memorySeed.memories }, running: false },
      { id: 2, type: 'text', content: welcomeReply },
    ] },
  ]
  if (variant>0) turns[1]!.messages![1]!.content=replies[variant]??replies[1]!
  histories[sid]=turns
  return turns
}
export const dependencies = [ ['node','Node.js','runtime','22.18.0'], ['python','Python','runtime','3.13.7'], ['uv','uv','tool','0.8.15'], ['git','Git','tool','2.51.0'], ['codex','Codex','agent','0.20.0'], ['claude-code','Claude Code','agent','1.0.0'] ].map(([id,name,category,version]) => ({ id,name,category,description: ja ? `ワークスペースの ${name}` : `${name} in your workspace`, registry_id:'memoh', definition_revision:'demo-v1', installed_version:version, latest_version:version, status:'installed', source:'managed', install_path:`/data/deps/${id}`, provides:[id], actions:['reinstall','remove','check_update'], platform_supported:true, retired:false, update_available:false, translations:{} }))
export const installedSkills = installedSkillData.skills
export const packages = installedSkills.filter(skill => skill.registry_id === 'memoh').map(skill => ({name:skill.name, description:skill.description, package_id:skill.package_id, registry_id:skill.registry_id, schema_version:'1.0', skill_count:1, categories:[], tags:[], icon:{type:'emoji',value:'🌤️'}}))
export const files: Record<string,string> = ja ? {
  '/data/README.md': '# マイワークスペース\n\nアイデアやリサーチ、覚えておきたいことのための小さな場所。\n',
  '/data/weekly-plan.md': '# ていねいな一週間\n\n- [ ] 読書トラッカーを作る\n- [ ] 良い記事を 3 本読む\n- [x] ディープワークの時間を確保する\n',
  '/data/research-notes.md': '# パーソナル AI\n\n役立つアシスタントは文脈を覚え、あなたのツールと連携し、アイデアを形にする手助けをしてくれます。\n',
  '/data/reading-list.csv': 'title,category,status\nAI とデザイン,デザイン,読書中\n信頼できるエージェントの作り方,エンジニアリング,これから読む\n',
} : {
  '/data/README.md': '# My workspace\n\nA little space for ideas, research, and things worth remembering.\n',
  '/data/weekly-plan.md': '# A thoughtful week\n\n- [ ] Build the reading tracker\n- [ ] Read three great articles\n- [x] Make a little room for deep work\n',
  '/data/research-notes.md': '# Personal AI\n\nUseful assistants remember context, work with your tools, and help you turn ideas into something real.\n',
  '/data/reading-list.csv': 'title,category,status\nDesigning with AI,Design,Reading\nBuilding reliable agents,Engineering,To read\n',
}


Object.assign(files, workspaceTemplate)
export const directories = new Set(['/data/.memoh/media', '/data/.memoh/screenshots', '/data/skills', '/data/memory'])
Object.assign(files, installedSkillData.files)
files['/data/.memoh/skills/index.json'] = JSON.stringify({version:1, updated_at:now, overrides:{}, items:installedSkills.map(({name,source_path,source_kind}) => ({name,source_path,source_kind}))}, null, 2)

// Shared examples drive the sidebar, composer menus and their file trees.
export const demoAgents = scenario.agents.filter(agent => agent.id).map(agent => ({
 id:agent.id, name:agent.name, runtime:agent.runtime, enabled:true, agent_credential_id:'credential-demo',
 metadata:{provider:agent.runtime,auth:agent.runtime==='codex'?'api_key':'workspace'}, created_at:now, updated_at:now,
}))
export const workspaceTargets = scenario.computers
export const workdirsFor = (botId: string) => scenario.folders.map(folder => ({...folder, id:`${botId}-${folder.key}`, bot_id:botId, archived:false, created_at:now, updated_at:now}))
for (const folder of scenario.folders) {
 directories.add(folder.path)
 files[`${folder.path}/README.md`] = ja ? `# ${folder.name}\n\nブラウザーだけで動くサンプルプロジェクトです。\n` : `# ${folder.name}\n\nA browser-only example project.\n`
}
