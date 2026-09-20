// Help center content for /help.
//
// Deliberately self-contained: UI strings AND articles live here (keyed by
// locale) instead of src/locales/*.json, so the help center can later be
// extracted to help.memoh.ai as a unit, and so this module never conflicts
// with in-flight locale-file work. Article bodies are the same lightweight
// Markdown dialect the blog uses (rendered by src/lib/markdown.ts).
//
// NOTE: all Q&A copy below is placeholder demo content drafted for the help
// center prototype — review before treating any claim as product truth.

export const helpLocales = ['en', 'zh'] as const
export type HelpLocale = (typeof helpLocales)[number]

type Localized = Record<HelpLocale, string>

export type HelpIconName =
  | 'rocket'
  | 'monitor'
  | 'bot'
  | 'send'
  | 'clock'
  | 'creditCard'
  | 'laptop'
  | 'shield'

type HelpArticleSource = {
  id: string
  question: Localized
  answer: Localized
}

type HelpCollectionSource = {
  id: string
  icon: HelpIconName
  title: Localized
  description: Localized
  articles: HelpArticleSource[]
}

export type HelpArticleSummary = {
  id: string
  collectionId: string
  question: string
}

export type HelpArticle = HelpArticleSummary & {
  answer: string
  collectionTitle: string
}

export type HelpCollectionSummary = {
  id: string
  icon: HelpIconName
  title: string
  description: string
  articleCount: number
}

export type HelpCollection = HelpCollectionSummary & {
  articles: HelpArticleSummary[]
}

export type HelpSearchResult = HelpArticleSummary & {
  collectionTitle: string
  snippet: string
}

export const resolveHelpLocale = (locale: string): HelpLocale =>
  locale === 'zh' ? 'zh' : 'en'

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------

const ui = {
  badge: { en: 'Help Center', zh: '帮助中心' },
  title: { en: 'How can we help?', zh: '有什么可以帮忙的？' },
  subtitle: {
    en: 'Guides and answers from the Memoh team.',
    zh: '来自 Memoh 团队的使用指南与常见问题解答。',
  },
  searchPlaceholder: { en: 'Search for articles…', zh: '搜索帮助文章…' },
  searchResults: { en: '{n} results for “{q}”', zh: '“{q}” 的 {n} 条结果' },
  searchEmptyTitle: { en: 'No articles found', zh: '没有找到相关文章' },
  searchEmptyDesc: {
    en: 'Try a different keyword, or reach out to us directly.',
    zh: '换个关键词试试，或直接联系我们。',
  },
  clearSearch: { en: 'Clear search', zh: '清除搜索' },
  articleCount: { en: '{n} articles', zh: '{n} 篇文章' },
  breadcrumbRoot: { en: 'Help Center', zh: '帮助中心' },
  collectionsTitle: { en: 'Browse by topic', zh: '按主题浏览' },
  relatedTitle: { en: 'Related articles', zh: '相关文章' },
  moreCollections: { en: 'Browse other topics', zh: '浏览其他主题' },
  contactTitle: { en: 'Can’t find what you need?', zh: '没有找到答案？' },
  contactDesc: {
    en: 'Reach the Memoh team — we usually reply within one business day.',
    zh: '联系 Memoh 团队，我们通常会在一个工作日内回复。',
  },
  contactEmail: { en: 'Email support', zh: '邮件联系' },
  contactTelegram: { en: 'Telegram community', zh: 'Telegram 社群' },
  notFoundTitle: { en: 'Article not found', zh: '文章不存在' },
  notFoundDesc: {
    en: 'The help article you opened is not on this site.',
    zh: '你打开的帮助文章不在这个站点里。',
  },
  backToHelp: { en: 'Back to Help Center', zh: '返回帮助中心' },
  seoTitle: { en: 'Memoh Help Center', zh: 'Memoh 帮助中心' },
  seoDescription: {
    en: 'Answers about Memoh: cloud computers for agents, channels, scheduled tasks, plans and billing, desktop apps, privacy and security.',
    zh: '关于 Memoh 的常见问题：Agent 云电脑、消息渠道、定时任务、订阅计费、桌面版、隐私与安全。',
  },
} satisfies Record<string, Localized>

export type HelpUiKey = keyof typeof ui

export const getHelpUi = (locale: string) => {
  const resolved = resolveHelpLocale(locale)
  return (key: HelpUiKey, params?: Record<string, string | number>) => {
    let value = ui[key][resolved]
    if (params) {
      for (const [name, raw] of Object.entries(params)) {
        value = value.replaceAll(`{${name}}`, String(raw))
      }
    }
    return value
  }
}

// ---------------------------------------------------------------------------
// Collections & articles
// ---------------------------------------------------------------------------

const collections: HelpCollectionSource[] = [
  {
    id: 'getting-started',
    icon: 'rocket',
    title: { en: 'Getting started', zh: '开始使用' },
    description: {
      en: 'What Memoh is, how to create your first Bot, and where to use it.',
      zh: '了解 Memoh 的基本概念，创建你的第一个 Bot。',
    },
    articles: [
      {
        id: 'what-is-memoh',
        question: { en: 'What is Memoh?', zh: 'Memoh 是什么？' },
        answer: {
          zh: `Memoh 是一个云优先的多 Agent 平台。你可以把它理解为：**给每个 AI Agent 配一台真正的云电脑**。

每个 Agent 都拥有：

- **独立桌面** —— 可以打开浏览器、操作应用；你能实时旁观，也能随时接管；
- **独立文件** —— 工作产出、代码和资料都留在它自己的工作区里；
- **独立网络** —— 可以访问网页、调用外部服务；
- **24 × 7 持续运行** —— 你的电脑关了，它还在云端继续工作。

在此之上，Memoh 提供多渠道接入（桌面端、Telegram、Discord、微信等）、定时任务、主动消息和长期记忆，让 Agent 更像一位一直在线的同事，而不只是一个聊天窗口。`,
          en: `Memoh is a cloud-first multi-agent platform. The simplest way to think about it: **every AI agent gets a real computer in the cloud**.

Each agent has:

- **Its own desktop** — it can open a browser and operate apps; you can watch in real time and take over at any moment;
- **Its own files** — everything it produces stays in its own workspace;
- **Its own network** — it can browse the web and call external services;
- **24 × 7 uptime** — your laptop sleeps, your agent doesn't.

On top of that, Memoh adds multi-channel access (desktop, Telegram, Discord, WeChat and more), scheduled tasks, proactive messages and long-term memory — so an agent feels like an always-on teammate, not a chat window.`,
        },
      },
      {
        id: 'how-to-get-started',
        question: { en: 'How do I get started with Memoh?', zh: '如何开始使用 Memoh？' },
        answer: {
          zh: `### 首选：桌面版

1. 前往[下载页](/download)，安装适合你系统的 Memoh 桌面版（支持 macOS、Windows 与 Linux）；
2. 打开应用，注册并登录；如果当前处于受邀阶段，可以先[加入等待列表](/waitlist)；
3. 创建你的第一个 Bot，平台会自动为它分配一台云电脑；
4. 在对话框里直接吩咐任务，比如"帮我做一个阅读清单网页"，或"每天早上 9 点给我发晨间简报"。

桌面版提供系统级通知、全局快捷键与本地运行模式，Agent 主动找你时第一时间就能收到。

### 其次：网页版

不方便安装应用时，用浏览器打开 [app.memoh.net](https://app.memoh.net) —— 注册、创建 Bot、吩咐任务的流程完全一样，进度与记忆和桌面版实时同步，之后随时可以换到桌面版继续。

无论从哪个入口开始，之后都可以把 Bot 接入 Telegram、Discord 等渠道，在你习惯的地方随时找到它。`,
          en: `### Recommended: the desktop app

1. Head to the [download page](/download) and install Memoh for your system (macOS, Windows or Linux);
2. Open the app and sign in; if access is invite-gated at the moment, [join the waitlist](/waitlist) first;
3. Create your first Bot — the platform provisions a cloud computer for it automatically;
4. Just tell it what you need, e.g. "build me a reading-list web page" or "send me a morning brief at 9 am every day".

The desktop app adds system notifications, global shortcuts and local mode, so the moment your agent reaches out, you'll know.

### Alternative: the web app

Can't install anything right now? Open [app.memoh.net](https://app.memoh.net) in a browser — signing up, creating Bots and giving tasks all work exactly the same, fully in sync with the desktop app, and you can switch to desktop at any time.

Whichever way you start, you can then connect the Bot to Telegram, Discord and other channels so it's reachable wherever you already chat.`,
        },
      },
      {
        id: 'how-is-memoh-different',
        question: {
          en: 'How is Memoh different from a regular AI chat assistant?',
          zh: 'Memoh 和普通 AI 聊天助手有什么区别？',
        },
        answer: {
          zh: `传统聊天助手只在你打开窗口时"存在"；Memoh 的 Agent 拥有一台持续运行的云电脑，因此：

- **有电脑**：它有真实的桌面、文件和网络，能实际打开网站、安装依赖、运行代码、给你预览，而不只是输出文字；
- **一直在**：跑在云端，你的电脑关了它也在；定时任务和周期自检不需要你去触发；
- **会主动**：有重要的事，它会先发消息给你；
- **记得住**：会话不清零，记忆跨渠道共享，随时接着上次聊的继续。`,
          en: `A regular chat assistant only "exists" while the window is open. A Memoh agent owns an always-running cloud computer, which changes what it can do:

- **It has a computer**: a real desktop, files and network — it opens websites, installs dependencies, runs code and shows you previews instead of just writing text;
- **It's always on**: it runs in the cloud even when your machine is off, and scheduled tasks fire without you triggering anything;
- **It takes initiative**: when something important happens, it messages you first;
- **It remembers**: sessions never reset, and memory is shared across every channel.`,
        },
      },
      {
        id: 'what-is-a-bot',
        question: { en: 'What is a Bot? How many can I create?', zh: '什么是 Bot？我可以创建几个？' },
        answer: {
          zh: `在 Memoh 里，一个 **Bot** 就是一个拥有独立云电脑的 Agent 实例：独立的桌面、文件、依赖和记忆。

你可以为不同用途创建不同的 Bot —— 比如一个管日程和提醒，一个专门做开发。Bot 之间完全隔离，互不干扰。

可创建的 Bot 数量与每个 Bot 的算力规格取决于你的订阅计划，详见[定价](/#pricing)。`,
          en: `In Memoh, a **Bot** is an agent instance with its own cloud computer: its own desktop, files, dependencies and memory.

Create different Bots for different jobs — say, one for scheduling and reminders, one dedicated to development. Bots are fully isolated from each other.

How many Bots you can create, and the compute each one gets, depends on your plan — see [pricing](/#pricing).`,
        },
      },
      {
        id: 'which-platforms',
        question: { en: 'Where can I use Memoh?', zh: '可以在哪些平台使用 Memoh？' },
        answer: {
          zh: `- **桌面版（推荐）**：macOS（Apple Silicon 与 Intel）、Windows、Linux，见[下载页](/download)；
- **网页**：[app.memoh.net](https://app.memoh.net)。

所有入口背后是同一个 Agent、同一份记忆 —— 在哪里开口都能接上。`,
          en: `- **Desktop (recommended)**: macOS (Apple Silicon & Intel), Windows and Linux — see the [download page](/download);
- **Web**: [app.memoh.net](https://app.memoh.net).

Every entry point talks to the same agent with the same memory — pick up the conversation from anywhere.`,
        },
      },
    ],
  },
  {
    id: 'cloud-computer',
    icon: 'monitor',
    title: { en: 'Cloud computer & workspace', zh: '云电脑与工作区' },
    description: {
      en: 'Desktop, files, packages, and developing in the cloud.',
      zh: '桌面、文件、依赖安装与云上开发。',
    },
    articles: [
      {
        id: 'whats-inside',
        question: { en: "What's inside an agent's cloud computer?", zh: '每个 Agent 的云电脑里有什么？' },
        answer: {
          zh: `每个 Bot 都运行在一台隔离的云电脑上，包含：

- **图形桌面**：预装浏览器，Agent 可以像人一样打开网站、操作应用；
- **独立文件系统**：工作区里的代码、文档与产出物；
- **网络访问**：抓取网页、调用外部服务；
- **可安装的运行时**：Node.js、Python、uv 等，按需在 Supermarket 中一键安装。

CPU 核数与内存等规格由你的订阅计划决定，详见[定价](/#pricing)。`,
          en: `Every Bot runs on an isolated cloud computer with:

- **A graphical desktop**: a browser is pre-installed, and the agent operates apps the way a person would;
- **Its own file system**: code, documents and deliverables live in the workspace;
- **Network access**: fetching pages and calling external services;
- **Installable runtimes**: Node.js, Python, uv and more, one click away in the Supermarket.

CPU cores and memory depend on your plan — see [pricing](/#pricing).`,
        },
      },
      {
        id: 'watch-and-take-over',
        question: { en: "How do I watch or take over the agent's desktop?", zh: '如何查看或接管 Agent 的桌面？' },
        answer: {
          zh: `在会话中打开**桌面视图**，就能实时观看 Agent 的每一步操作 —— 它打开了哪个网站、点了什么、在终端里跑了什么命令。

需要人工介入时（比如登录验证、复核关键操作），点击**接管**即可直接用你的鼠标和键盘操作这台云桌面；交还控制后，Agent 会从当前状态继续工作。`,
          en: `Open the **desktop view** in any session to watch the agent work in real time — which site it opened, what it clicked, what it ran in the terminal.

When a human touch is needed (a login challenge, double-checking a critical step), hit **Take over** to drive the cloud desktop with your own mouse and keyboard. Hand control back, and the agent continues from exactly where things stand.`,
        },
      },
      {
        id: 'install-packages',
        question: { en: 'How do I install packages and apps for my agent?', zh: '如何为 Agent 安装依赖和应用？' },
        answer: {
          zh: `打开 **Supermarket**（应用超市），所有东西都托管在云电脑里，随时供 Agent 使用：

- **软件包**：Node.js、Python、uv 等运行时，选择目标 Bot 后一键"安装到 Bot"；
- **Connector**：连接 GitHub 等外部服务，按服务单独授权；
- **Agent Skill**：为 Agent 增加特定领域的技能。

Agent 在执行任务时也可以自己按需安装依赖，安装过程你都能在桌面视图里看到。`,
          en: `Open the **Supermarket**. Everything is hosted on the cloud computer, ready for the agent to use:

- **Packages**: runtimes like Node.js, Python and uv — pick a Bot and click "Install to Bot";
- **Connectors**: hook up external services such as GitHub, each authorized separately;
- **Agent Skills**: add domain-specific abilities to your agent.

Agents can also install dependencies themselves mid-task, and you can watch it happen in the desktop view.`,
        },
      },
      {
        id: 'files-and-storage',
        question: { en: 'Where are my files stored?', zh: '我的文件存储在哪里？' },
        answer: {
          zh: `每个 Bot 的文件都保存在它自己的云端工作区里，与其他 Bot 相互隔离；存储空间随订阅计划提供。

你可以直接上传文件给 Agent，也可以让它整理、打包并把任何文件发给你。删除 Bot 时，它的工作区会一并销毁。`,
          en: `Each Bot's files live in its own cloud workspace, isolated from every other Bot; storage comes with your plan.

You can upload files to the agent directly, and ask it to organize, archive and send any file back to you. Deleting a Bot destroys its workspace along with it.`,
        },
      },
      {
        id: 'develop-and-preview',
        question: { en: 'Can I develop and preview apps on the cloud computer?', zh: '可以在云电脑上开发并预览应用吗？' },
        answer: {
          zh: `可以。从编写代码、安装依赖到启动开发服务器，都在云电脑上完成，不需要在你的本机配置任何环境。

Agent 启动开发服务器后会给你一个 localhost 链接，点击即可在 Memoh 的新标签页中打开预览，随开发实时更新 —— 边改边看。`,
          en: `Yes. Writing code, installing dependencies and running dev servers all happen on the cloud computer — nothing to set up on your own machine.

When the agent starts a dev server, it hands you a localhost link; click it to open a live preview in a new Memoh tab that updates as the code changes.`,
        },
      },
      {
        id: 'always-on',
        question: { en: 'Is the cloud computer always on?', zh: '云电脑会一直开着吗？' },
        answer: {
          zh: `是。Bot 的云电脑保持 24 × 7 在线：定时任务照常触发，长任务持续推进，渠道消息随时可达。

空闲时平台会自动降低资源占用以节省算力，但会话、文件与记忆始终保留 —— 下次开口，一切都在原地。`,
          en: `Yes. A Bot's cloud computer stays online 24 × 7: scheduled tasks fire on time, long-running work keeps moving, and channel messages always get through.

When idle, the platform scales resource usage down to save compute — but sessions, files and memory are always preserved. Next time you speak up, everything is right where you left it.`,
        },
      },
    ],
  },
  {
    id: 'agents-and-models',
    icon: 'bot',
    title: { en: 'Agents, models & memory', zh: 'Agent、模型与记忆' },
    description: {
      en: 'Bring your own agent, switch models, and how memory works.',
      zh: '自带 Agent、切换模型，以及记忆如何工作。',
    },
    articles: [
      {
        id: 'bring-your-own-agent',
        question: { en: 'Can I bring my own agent?', zh: '可以带自己的 Agent 吗？' },
        answer: {
          zh: `可以。Memoh 支持把 **Claude Code**、**Codex** 或其他兼容 **ACP**（Agent Client Protocol）的 Agent 部署到你的云电脑上，沿用你自己的订阅与配置。

不想自带也没问题 —— 直接使用 Memoh 内置 Agent 和平台提供的模型即可，用量按 credits 计费。两种方式可以随时切换。`,
          en: `Yes. Memoh can run **Claude Code**, **Codex**, or any agent compatible with the **ACP** (Agent Client Protocol) on your cloud computer, using your own subscription and configuration.

Prefer not to bring one? Use Memoh's built-in agent with platform-provided models, billed in credits. You can switch between the two at any time.`,
        },
      },
      {
        id: 'switch-agents',
        question: { en: 'How do I switch agents in a session?', zh: '如何在会话中切换 Agent？' },
        answer: {
          zh: `新建会话时，点开输入框下方的 **Agent 菜单**，即可在 Memoh、Claude Code、Codex 等 Agent 之间切换。

不同 Agent 共用同一台云电脑和同一份工作区文件，所以换了 Agent，上下文和产出物都还在。`,
          en: `In a new session, open the **agent menu** under the composer to switch between Memoh, Claude Code, Codex and any other installed agent.

All agents share the same cloud computer and the same workspace files — switching agents never loses your context or artifacts.`,
        },
      },
      {
        id: 'skills-and-connectors',
        question: { en: 'What are Agent Skills and Connectors?', zh: '什么是 Agent Skill 和 Connector？' },
        answer: {
          zh: `两者都在 Supermarket 中管理，但分工不同：

- **Connector** 负责"连接外部服务"。比如 GitHub Connector 让 Agent 能访问你的仓库、Issue 和 Pull Request。每个 Connector 需要单独授权，可随时撤销；
- **Agent Skill** 负责"教会 Agent 做事的方法"，为它增加特定的工作流程和领域技能。

安装后都托管在云电脑里，Agent 需要时直接调用。`,
          en: `Both live in the Supermarket, with different jobs:

- A **Connector** links an external service. The GitHub Connector, for instance, lets the agent work with your repos, issues and pull requests. Each Connector is authorized individually and can be revoked at any time;
- An **Agent Skill** teaches the agent how to do something — packaged workflows and domain know-how.

Once installed, both are hosted on the cloud computer for the agent to use whenever needed.`,
        },
      },
      {
        id: 'how-memory-works',
        question: { en: "How does the agent's memory work?", zh: 'Agent 的记忆是如何工作的？' },
        answer: {
          zh: `Memoh 的会话不会清零 —— 下次开口可以直接从上次聊到的地方继续。

在此之上，Agent 会把重要的结论和约定写进**长期记忆**，需要时自动检索。比如你问"上次那个 PR 后来怎么样了"，它会先搜索记忆，再给你答案。

记忆归属于 Bot 并跨渠道共享：在 Telegram 里说过的事，回到桌面端它也记得。`,
          en: `Sessions in Memoh never reset — the next conversation picks up exactly where the last one ended.

Beyond that, the agent writes important conclusions and agreements into **long-term memory** and recalls them automatically. Ask "whatever happened to that PR from last week?" and it searches memory before answering.

Memory belongs to the Bot and is shared across channels: something you said on Telegram is still known on desktop.`,
        },
      },
    ],
  },
  {
    id: 'channels',
    icon: 'send',
    title: { en: 'Messaging channels', zh: '消息渠道' },
    description: {
      en: 'Reach your agent from Telegram, Slack, WeChat, Feishu and more.',
      zh: '在 Telegram、Slack、微信、飞书等常用工具里找到你的 Agent。',
    },
    articles: [
      {
        id: 'supported-channels',
        question: { en: 'Which chat channels does Memoh support?', zh: 'Memoh 支持哪些聊天渠道？' },
        answer: {
          zh: `Memoh 内置网页与桌面端对话入口，并支持接入以下聊天平台：

- **社交与协作**：Telegram、Discord、Slack、LINE；
- **国内平台**：微信、微信服务号、企业微信、QQ、飞书、钉钉；
- **开放协议与社区**：Matrix、Misskey。

一个 Agent 可以同时接入多个渠道，对话与记忆完全同步。`,
          en: `Besides the built-in web and desktop chat, Memoh connects to the following platforms:

- **Social & collaboration**: Telegram, Discord, Slack, LINE;
- **China-based platforms**: WeChat, WeChat Official Account, WeCom, QQ, Feishu, DingTalk;
- **Open protocols & communities**: Matrix, Misskey.

One agent can be connected to several channels at once, with conversations and memory fully in sync.`,
        },
      },
      {
        id: 'connect-telegram',
        question: { en: 'How do I connect Memoh to Telegram?', zh: '如何把 Memoh 接入 Telegram？' },
        answer: {
          zh: `在 Bot 设置中打开**渠道 → Telegram**，按提示完成绑定，然后就可以在 Telegram 里直接和它对话了。

提醒事项、随手安排任务、问答查询都可以在聊天里完成 —— 比如"提醒我 6 点取快递"，到点它会来叫你。`,
          en: `In your Bot's settings, open **Channels → Telegram** and follow the linking steps. From then on you can talk to it right inside Telegram.

Reminders, quick tasks and questions all work in chat — say "remind me to pick up the package at 6" and it will ping you on time.`,
        },
      },
      {
        id: 'connect-discord',
        question: { en: 'How do I connect Memoh to Discord?', zh: '如何把 Memoh 接入 Discord？' },
        answer: {
          zh: `在**渠道 → Discord** 中完成授权，并把机器人邀请进你的服务器。

在频道里 **@ 它**即可对话，比如让它总结今天频道里聊了什么；私信也同样可用。`,
          en: `Authorize under **Channels → Discord** and invite the bot into your server.

**@mention** it in any channel to talk — for example, ask it to summarize what was discussed today. Direct messages work too.`,
        },
      },
      {
        id: 'cross-channel-sync',
        question: { en: 'Do conversations sync across channels?', zh: '多个渠道的对话会同步吗？' },
        answer: {
          zh: `会。渠道只是"入口"，背后是同一个 Agent、同一台云电脑、同一份记忆。

你在 Telegram 里吩咐的事，回到桌面端可以直接查看进度、继续讨论；反过来也一样。不需要在渠道之间复述任何上下文。`,
          en: `Yes. Channels are just doors — behind them is the same agent, the same cloud computer and the same memory.

Ask for something on Telegram, then open the desktop app to check progress and keep the discussion going — and vice versa. No context ever needs repeating between channels.`,
        },
      },
    ],
  },
  {
    id: 'tasks-and-proactive',
    icon: 'clock',
    title: { en: 'Scheduled tasks & proactive messages', zh: '定时任务与主动消息' },
    description: {
      en: 'Let your agent run on its own and reach out when it matters.',
      zh: '让 Agent 自己跑起来，有事主动来找你。',
    },
    articles: [
      {
        id: 'create-scheduled-task',
        question: { en: 'How do I create a scheduled task?', zh: '如何创建定时任务？' },
        answer: {
          zh: `用自然语言直接吩咐即可，例如：

- "每天早上 9 点给我发晨间简报"
- "工作日盯着这个仓库的发版"
- "每天睡前帮我整理收件箱"

Agent 会创建对应的定时任务。你也可以在任务面板中查看、编辑全部任务。`,
          en: `Just say it in plain language, for example:

- "Send me a morning brief at 9 am every day"
- "Watch this repo for releases on weekdays"
- "Tidy my inbox every night"

The agent sets up the schedule for you. You can also review and edit every task in the tasks panel.`,
        },
      },
      {
        id: 'run-while-offline',
        question: { en: "Do tasks run while I'm offline?", zh: '我不在线时任务也会运行吗？' },
        answer: {
          zh: `会。任务在 Agent 的云电脑上执行，与你的设备无关 —— 你的电脑关了，它没关。

运行结果会通过你选定的渠道（桌面通知、Telegram 等）发给你，回来时也可以在会话里翻看每次运行的记录。`,
          en: `Yes. Tasks execute on the agent's cloud computer, independent of your devices — your laptop being off doesn't stop anything.

Results are delivered through the channel you choose (desktop notifications, Telegram, …), and every run's record is there in the session when you come back.`,
        },
      },
      {
        id: 'manage-tasks',
        question: { en: 'How do I pause, edit or delete a scheduled task?', zh: '如何暂停、修改或删除定时任务？' },
        answer: {
          zh: `最直接的方式是告诉 Agent：

- "把晨间简报改到 8 点半"
- "先停掉盯仓库那个任务"
- "把整理收件箱的任务删了"

也可以在任务面板中手动开关、编辑和删除任意任务。`,
          en: `The fastest way is to just tell the agent:

- "Move the morning brief to 8:30"
- "Pause the repo watcher for now"
- "Delete the inbox-cleanup task"

You can also toggle, edit and delete any task by hand in the tasks panel.`,
        },
      },
      {
        id: 'proactive-messages',
        question: { en: 'Will the agent message me proactively?', zh: 'Agent 会主动给我发消息吗？' },
        answer: {
          zh: `会 —— 这正是 Memoh 的核心能力之一。你盯的版本发布了、日程即将开始、任务失败需要你拍板时，Agent 会先发消息给你，而不是等你想起来去问。

主动消息的频率与送达渠道都可以在通知设置里调整，嫌吵可以随时收紧。`,
          en: `Yes — it's one of Memoh's core abilities. When a release you're watching ships, a meeting is about to start, or a task fails and needs your call, the agent messages you first instead of waiting to be asked.

How often it reaches out, and through which channel, is up to you in notification settings.`,
        },
      },
    ],
  },
  {
    id: 'billing',
    icon: 'creditCard',
    title: { en: 'Plans, credits & billing', zh: '订阅与计费' },
    description: {
      en: 'Plans, what credits are, and managing your subscription.',
      zh: '订阅计划、credits 与账单管理。',
    },
    articles: [
      {
        id: 'plans-overview',
        question: { en: 'What plans does Memoh offer?', zh: 'Memoh 有哪些订阅计划？' },
        answer: {
          zh: `Memoh 提供三档订阅：

- **Go**：从日常对话和轻量任务开始；
- **Pro**：为日常工作和持续运行的 Agent 准备；
- **Premium**：为更复杂的任务提供更多算力和空间。

各档位对应不同的 CPU 核数、内存与每月 credits 额度，最新规格与价格见[定价页](/#pricing)。`,
          en: `Memoh comes in three plans:

- **Go**: start with everyday conversations and light tasks;
- **Pro**: built for daily work and always-running agents;
- **Premium**: more compute and space for heavier workloads.

Each tier maps to different CPU cores, memory and monthly credits — see the [pricing page](/#pricing) for current specs and prices.`,
        },
      },
      {
        id: 'what-are-credits',
        question: { en: 'What are credits and how are they used?', zh: '什么是 credits？如何计算？' },
        answer: {
          zh: `credits 是使用 **Memoh 提供的模型**时消耗的 Token 额度，按订阅计划每月发放、每月刷新。

如果你自带 Agent 订阅（如 Claude Code、Codex），模型调用走你自己的账号，**不消耗 credits**；云电脑的 CPU、内存等算力则始终由计划规格决定。`,
          en: `Credits are the token allowance consumed when you use **models provided by Memoh**. They're granted monthly with your plan and refresh every cycle.

If you bring your own agent subscription (Claude Code, Codex, …), model calls go through your own account and **don't consume credits**. The cloud computer's CPU and memory always come from your plan's specs.`,
        },
      },
      {
        id: 'out-of-credits',
        question: { en: 'What happens when I run out of credits?', zh: 'credits 用完了怎么办？' },
        answer: {
          zh: `当月 credits 用完后，使用 Memoh 内置模型的新请求会暂停，但你的云电脑、文件、记忆和已配置的定时任务都会完整保留。

你可以：

- 等待下个计费周期额度自动刷新；
- 升级到更高档位获得更多额度；
- 切换到自带订阅的 Agent（不消耗 credits）继续使用。`,
          en: `When your monthly credits run out, new requests to Memoh-provided models pause — but your cloud computer, files, memory and configured tasks are all fully preserved.

You can:

- wait for the allowance to refresh next billing cycle;
- upgrade to a higher tier for more credits;
- switch to a bring-your-own agent (which doesn't consume credits) and keep going.`,
        },
      },
      {
        id: 'change-plan',
        question: { en: 'How do I upgrade, downgrade or cancel?', zh: '如何升级、降级或取消订阅？' },
        answer: {
          zh: `在 **设置 → 订阅** 中随时更换或取消计划：

- **升级**立即生效，按剩余周期折算差价；
- **降级与取消**在当前计费周期结束时生效，期间服务不受影响。

取消后你的数据会按[隐私政策](/legal/privacy)中的保留策略处理。`,
          en: `Change or cancel your plan any time under **Settings → Subscription**:

- **Upgrades** take effect immediately, prorated for the rest of the cycle;
- **Downgrades and cancellations** apply at the end of the current billing cycle, with service unaffected until then.

After cancellation, your data is handled per the retention terms in the [privacy policy](/legal/privacy).`,
        },
      },
      {
        id: 'invoices',
        question: { en: 'How do I get invoices or receipts?', zh: '如何获取发票或收据？' },
        answer: {
          zh: `在 **设置 → 账单** 中可以查看和下载每期收据。

如需企业发票、合并结算或其他商务合作，请联系 [support@memoh.net](mailto:support@memoh.net)。`,
          en: `View and download receipts for every billing period under **Settings → Billing**.

For corporate invoicing, consolidated billing or other business needs, contact [support@memoh.net](mailto:support@memoh.net).`,
        },
      },
    ],
  },
  {
    id: 'desktop-app',
    icon: 'laptop',
    title: { en: 'Desktop app', zh: '桌面版' },
    description: {
      en: 'Download, updates and system requirements.',
      zh: '下载安装、更新与系统要求。',
    },
    articles: [
      {
        id: 'download-install',
        question: { en: 'How do I download and install the desktop app?', zh: '如何下载安装桌面版？' },
        answer: {
          zh: `前往[下载页](/download)，选择适合你系统的安装包：

- **macOS**：Apple Silicon 或 Intel（.dmg）；
- **Windows**：x64 安装程序；
- **Linux**：.deb、AppImage 或 .rpm。

页面会自动检测你的设备并推荐合适的版本。`,
          en: `Head to the [download page](/download) and pick the build for your system:

- **macOS**: Apple Silicon or Intel (.dmg);
- **Windows**: x64 installer;
- **Linux**: .deb, AppImage or .rpm.

The page detects your device and recommends the right build automatically.`,
        },
      },
      {
        id: 'desktop-vs-web',
        question: { en: "What's the difference between desktop and web?", zh: '桌面版和网页版有什么区别？' },
        answer: {
          zh: `核心功能一致，桌面版额外提供：

- 系统级通知与全局快捷键；
- 开机自启，Agent 消息第一时间可达；
- **本地运行模式**：让智能体工作区完全在你的电脑上本地运行，本地文件与服务留在本机。

轻度使用选网页版即可，重度使用推荐桌面版。`,
          en: `Core features are identical. The desktop app adds:

- system notifications and global shortcuts;
- launch at login, so agent messages reach you instantly;
- **local mode**: run the agent workspace entirely on your own machine, keeping local files and services on-device.

The web app is fine for light use; for daily work we recommend the desktop app.`,
        },
      },
      {
        id: 'auto-update',
        question: { en: 'How does the desktop app update?', zh: '桌面版如何更新？' },
        answer: {
          zh: `桌面版会自动检查并在后台下载更新，重启应用即完成升级；也可以随时在[下载页](/download)手动获取最新版本。

当前版本号可以在应用的"关于 Memoh"中查看。`,
          en: `The desktop app checks for updates and downloads them in the background; restart the app to finish upgrading. You can also grab the latest build manually from the [download page](/download) any time.

Your current version is shown under "About Memoh" in the app.`,
        },
      },
      {
        id: 'system-requirements',
        question: { en: 'What are the system requirements?', zh: '桌面版的系统要求是什么？' },
        answer: {
          zh: `- **macOS** 12 及以上（Apple Silicon 与 Intel）；
- **Windows** 10 及以上（x64）；
- **主流 Linux 发行版**：Debian/Ubuntu 用 .deb，Fedora 用 .rpm，其他发行版可用 AppImage。

Agent 本体运行在云端，桌面应用只负责界面与通知，对本机配置几乎没有要求。`,
          en: `- **macOS** 12 or later (Apple Silicon & Intel);
- **Windows** 10 or later (x64);
- **Mainstream Linux distros**: .deb for Debian/Ubuntu, .rpm for Fedora, AppImage for everything else.

Agents run in the cloud — the desktop app only handles UI and notifications, so hardware requirements are minimal.`,
        },
      },
    ],
  },
  {
    id: 'privacy-security',
    icon: 'shield',
    title: { en: 'Privacy & security', zh: '隐私与安全' },
    description: {
      en: 'Data storage, isolation, authorization and deletion.',
      zh: '数据存储、隔离、授权与删除。',
    },
    articles: [
      {
        id: 'where-is-data',
        question: { en: 'Where is my data stored?', zh: '我的数据存储在哪里？' },
        answer: {
          zh: `你的会话、记忆与工作区文件存储在 Memoh 的云端基础设施中，按 Bot 隔离。

详细的数据处理方式请阅读[隐私政策](/legal/privacy)与[数据跨境传输条款](/legal/cross-border)。`,
          en: `Your sessions, memory and workspace files are stored on Memoh's cloud infrastructure, isolated per Bot.

For the details of how data is handled, read the [privacy policy](/legal/privacy) and the [cross-border data transfer terms](/legal/cross-border).`,
        },
      },
      {
        id: 'isolation',
        question: { en: "Are agents' cloud computers isolated?", zh: 'Agent 的云电脑是隔离的吗？' },
        answer: {
          zh: `是。每个 Bot 运行在独立的隔离环境中，文件系统与网络彼此不可见 —— 你的 Bot 之间也互相隔离。

Agent 只能操作属于它自己的那台云电脑，接触不到平台上其他用户或其他 Bot 的任何数据。`,
          en: `Yes. Every Bot runs in its own isolated environment — file systems and networks are invisible to each other, including between your own Bots.

An agent can only operate its own cloud computer; it has no access to any other user's or Bot's data on the platform.`,
        },
      },
      {
        id: 'connector-security',
        question: { en: 'Is Connector authorization safe?', zh: 'Connector 授权安全吗？' },
        answer: {
          zh: `Connector 使用各服务的官方授权流程（如 OAuth）：

- 按服务**逐个授权**，绝不打包索权；
- 只申请完成任务所需的最小权限；
- 凭据加密存储，且**可随时在 Supermarket 中撤销**。

撤销后 Agent 立即失去对该服务的访问能力。`,
          en: `Connectors use each service's official authorization flow (e.g. OAuth):

- authorized **per service**, never bundled;
- requesting only the minimum scopes needed for the job;
- credentials stored encrypted, and **revocable in the Supermarket at any time**.

Once revoked, the agent immediately loses access to that service.`,
        },
      },
      {
        id: 'delete-data',
        question: { en: 'How do I delete my data or account?', zh: '如何删除我的数据或账户？' },
        answer: {
          zh: `- **删除某个 Bot**：会同时销毁它的云电脑、文件与记忆；
- **删除账户**：在 **设置 → 账户** 中发起，或联系 [support@memoh.net](mailto:support@memoh.net)。

数据保留与删除的具体时限见[隐私政策](/legal/privacy)。`,
          en: `- **Deleting a Bot** destroys its cloud computer, files and memory together;
- **Deleting your account** can be initiated under **Settings → Account**, or by contacting [support@memoh.net](mailto:support@memoh.net).

Exact retention and deletion timelines are described in the [privacy policy](/legal/privacy).`,
        },
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------

const toArticleSummary = (
  article: HelpArticleSource,
  collectionId: string,
  locale: HelpLocale,
): HelpArticleSummary => ({
  id: article.id,
  collectionId,
  question: article.question[locale],
})

export const getHelpCollections = (locale: string): HelpCollectionSummary[] => {
  const resolved = resolveHelpLocale(locale)
  return collections.map((collection) => ({
    id: collection.id,
    icon: collection.icon,
    title: collection.title[resolved],
    description: collection.description[resolved],
    articleCount: collection.articles.length,
  }))
}

export const getHelpCollection = (id: string, locale: string): HelpCollection | undefined => {
  const resolved = resolveHelpLocale(locale)
  const collection = collections.find((candidate) => candidate.id === id)
  if (!collection) return undefined

  return {
    id: collection.id,
    icon: collection.icon,
    title: collection.title[resolved],
    description: collection.description[resolved],
    articleCount: collection.articles.length,
    articles: collection.articles.map((article) => toArticleSummary(article, collection.id, resolved)),
  }
}

export const getHelpArticle = (
  collectionId: string,
  articleId: string,
  locale: string,
): HelpArticle | undefined => {
  const resolved = resolveHelpLocale(locale)
  const collection = collections.find((candidate) => candidate.id === collectionId)
  const article = collection?.articles.find((candidate) => candidate.id === articleId)
  if (!collection || !article) return undefined

  return {
    id: article.id,
    collectionId: collection.id,
    question: article.question[resolved],
    answer: article.answer[resolved],
    collectionTitle: collection.title[resolved],
  }
}

const stripMarkdown = (value: string) =>
  value
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[`*_>#|]/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

export const searchHelpArticles = (query: string, locale: string): HelpSearchResult[] => {
  const resolved = resolveHelpLocale(locale)
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  const matches: Array<HelpSearchResult & { inQuestion: boolean }> = []
  for (const collection of collections) {
    for (const article of collection.articles) {
      const question = article.question[resolved]
      const answerText = stripMarkdown(article.answer[resolved])
      const inQuestion = question.toLowerCase().includes(needle)
      const answerIndex = answerText.toLowerCase().indexOf(needle)
      if (!inQuestion && answerIndex === -1) continue

      let snippet: string
      if (answerIndex !== -1) {
        const start = Math.max(0, answerIndex - 40)
        const end = start + 120
        snippet = `${start > 0 ? '…' : ''}${answerText.slice(start, end)}${end < answerText.length ? '…' : ''}`
      } else {
        snippet = answerText.length > 120 ? `${answerText.slice(0, 120)}…` : answerText
      }

      matches.push({
        ...toArticleSummary(article, collection.id, resolved),
        collectionTitle: collection.title[resolved],
        snippet,
        inQuestion,
      })
    }
  }

  // Question hits rank above answer-only hits; otherwise keep source order.
  return matches
    .sort((a, b) => Number(b.inQuestion) - Number(a.inQuestion))
    .map(({ inQuestion: _inQuestion, ...result }) => result)
}
