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
  loadingAnswer: { en: 'Loading…', zh: '正在加载…' },
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
- **随时待命** —— 你的电脑关了，它还在云端，任务照样跑。

在此之上，Memoh 提供多渠道接入（桌面端、Telegram、Discord、微信等）、定时任务、主动消息和长期记忆，让 Agent 更像一位一直在线的同事，而不只是一个聊天窗口。`,
          en: `Memoh is a cloud-first multi-agent platform. The simplest way to think about it: **every AI agent gets a real computer in the cloud**.

Each agent has:

- **Its own desktop** — it can open a browser and operate apps; you can watch in real time and take over at any moment.
- **Its own files** — everything it produces stays in its own workspace.
- **Its own network** — it can browse the web and call external services.
- **Always on call** — your laptop sleeps, your agent doesn't: tasks keep running without you around.

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

桌面版提供系统级通知与全局快捷键，Agent 主动找你时第一时间就能收到；还可以把这台电脑共享给 Agent，让它直接在本机帮你干活。

### 其次：网页版

不方便安装应用时，用浏览器打开 [app.memoh.net](https://app.memoh.net) —— 注册、创建 Bot、吩咐任务的流程完全一样，进度与记忆和桌面版实时同步，之后随时可以换到桌面版继续。

无论从哪个入口开始，之后都可以把 Bot 接入 Telegram、Discord 等渠道，在你习惯的地方随时找到它。`,
          en: `### Recommended: the desktop app

1. Head to the [download page](/download) and install Memoh for your system (macOS, Windows or Linux).
2. Open the app and sign in; if access is invite-gated at the moment, [join the waitlist](/waitlist) first.
3. Create your first Bot — the platform provisions a cloud computer for it automatically.
4. Just tell it what you need, e.g. "build me a reading-list web page" or "send me a morning brief at 9 am every day".

The desktop app adds system notifications and global shortcuts, so the moment your agent reaches out, you'll know. You can also share this computer with your agents and let them work directly on your machine.

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

- **It has a computer**: a real desktop, files and network — it opens websites, installs dependencies, runs code and shows you previews instead of just writing text.
- **It's always on**: it runs in the cloud even when your machine is off, and scheduled tasks fire without you triggering anything.
- **It takes initiative**: when something important happens, it messages you first.
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
          en: `- **Desktop (recommended)**: macOS (Apple Silicon & Intel), Windows and Linux — see the [download page](/download).
- **Web**: [app.memoh.net](https://app.memoh.net).

Every entry point talks to the same agent with the same memory — pick up the conversation from anywhere.`,
        },
      },
      {
        id: 'what-can-memoh-do',
        question: { en: 'What can I actually do with Memoh?', zh: 'Memoh 具体能做什么？' },
        answer: {
          zh: `Memoh 的核心是一台随时可用的云端电脑，加上住在里面的 Agent。常见用法包括：

- **日常办公**：整理文件、写文档、处理邮件与日程；
- **开发**：在云端写代码、跑开发服务器、随时预览；
- **长期后台任务**：盯发版、定时简报、批量抓取与整理 —— 你的电脑关了它也在跑；
- **自动化等更多场景**：让 Agent 操作浏览器，替你完成网页上的事。

你可以亲自远程操作这台电脑，也可以把活直接吩咐给 Agent。更多典型场景见[首页](/)的完整介绍，建议先浏览再选择适合自己的套餐。`,
          en: `At its core, Memoh is an always-available cloud computer with an agent living inside. Common uses:

- **Everyday work**: organizing files, writing documents, handling mail and schedules.
- **Development**: write code in the cloud, run dev servers, preview any time.
- **Long-running background tasks**: release watching, scheduled briefings, batch fetching and organizing — it keeps going while your machine is off.
- **Automation and more**: let the agent drive a browser and handle web chores for you.

You can operate the computer remotely yourself, or simply hand work to the agent. See the [home page](/) for a full tour of typical scenarios before picking a plan.`,
        },
      },
      {
        id: 'vs-vps',
        question: { en: 'How is this different from renting a VPS?', zh: '云电脑和自己买的 VPS 有什么区别？' },
        answer: {
          zh: `一台裸 VPS 给你的是空白系统 —— 环境、桌面、运维都要自己来；Memoh 给你的是一台**开箱即用、为 Agent 设计**的云电脑：

- 预装图形桌面与浏览器，依赖在应用市场一键安装；
- 内置 Agent：任务可以直接吩咐，不必事事亲自动手；
- 与消息渠道、定时任务、长期记忆深度整合；
- 免运维：系统维护、监控与弹性调度由平台负责。

如果你只想要一台裸服务器，VPS 依然合适；想要一台"有人住在里面帮你干活"的电脑，选 Memoh。`,
          en: `A bare VPS hands you an empty system — environment, desktop and ops are all on you. Memoh hands you a cloud computer that is **ready out of the box and built for agents**:

- a graphical desktop and browser pre-installed, with one-click packages in the Supermarket.
- a built-in agent: hand over tasks instead of doing everything by hand.
- deep integration with messaging channels, scheduled tasks and long-term memory.
- zero ops: maintenance, monitoring and scheduling are the platform's job.

If all you want is a bare server, a VPS is still the right tool. If you want a computer with someone living in it, working for you — that's Memoh.`,
        },
      },
      {
        id: 'bring-accounts-files',
        question: { en: 'How do I bring my existing accounts and files?', zh: '怎么接入我已有的账号和文件？' },
        answer: {
          zh: `- **第三方账号**：在应用市场中通过 **Connector** 授权（如 GitHub），Agent 即可访问你已有的仓库、Issue 等数据 —— 按服务独立授权，可随时撤销；
- **自带 Agent 订阅**：Claude Code、Codex 等可登录你自己的账号，沿用已有订阅；
- **文件**：在会话中直接上传给 Agent，或让它从网盘、仓库等来源自行拉取，之后保存在它的工作区里；
- **聊天账号**：在 Bot 的**平台**标签页绑定你已有的 Telegram、微信、飞书等账号。`,
          en: `- **Third-party accounts**: authorize **Connectors** in the Supermarket (GitHub and more) so the agent can work with your existing repos and issues — per-service and revocable at any time.
- **Your agent subscriptions**: Claude Code, Codex and other BYO agents sign in with your own accounts.
- **Files**: upload them in a conversation, or have the agent fetch from drives and repos itself — everything lands in its workspace.
- **Chat accounts**: bind your existing Telegram, WeChat or Feishu accounts on the Bot's **Platforms** tab.`,
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
- **可安装的运行时**：Node.js、Python、uv 等，按需在应用市场中一键安装。

CPU 核数与内存等规格由你的订阅计划决定，详见[定价](/#pricing)。`,
          en: `Every Bot runs on an isolated cloud computer with:

- **A graphical desktop**: a browser is pre-installed, and the agent operates apps the way a person would.
- **Its own file system**: code, documents and deliverables live in the workspace.
- **Network access**: fetching pages and calling external services.
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
          zh: `打开**应用市场**（Supermarket），所有东西都托管在云电脑里，随时供 Agent 使用：

- **软件包**：Node.js、Python、uv 等运行时，选择目标 Bot 后一键"安装到 Bot"；
- **Connector**：连接 GitHub 等外部服务，按服务单独授权；
- **Agent Skill**：为 Agent 增加特定领域的技能。

Agent 在执行任务时也可以自己按需安装依赖，安装过程你都能在桌面视图里看到。`,
          en: `Open the **Supermarket**. Everything is hosted on the cloud computer, ready for the agent to use:

- **Packages**: runtimes like Node.js, Python and uv — pick a Bot and click "Install to Bot".
- **Connectors**: hook up external services such as GitHub, each authorized separately.
- **Agent Skills**: add domain-specific abilities to your agent.

Agents can also install dependencies themselves mid-task, and you can watch it happen in the desktop view.`,
        },
      },
      {
        id: 'files-and-storage',
        question: { en: 'Where are my files stored?', zh: '我的文件存储在哪里？' },
        answer: {
          zh: `每个 Bot 的文件都保存在它自己的云端工作区里，与其他 Bot 相互隔离；存储空间随订阅计划提供。

持久化规则需要注意：

- **/data 目录**是持久化卷（volume），放在这里的文件会长期保留；
- **Rootfs**（系统盘的其余部分）**不保证持久化**，可能随系统更新或实例重建被重置。

重要文件请让 Agent 保存到 /data 下。你可以直接上传文件给 Agent，也可以让它整理、打包并把任何文件发给你。删除 Bot 时，它的工作区会一并销毁。`,
          en: `Each Bot's files live in its own cloud workspace, isolated from every other Bot; storage comes with your plan.

One persistence rule to know:

- The **/data directory** is a persistent volume — files placed there are kept long-term.
- The **rootfs** (the rest of the system disk) is **not guaranteed to persist** and may be reset by system updates or instance rebuilds.

Have the agent keep anything important under /data. You can upload files to the agent directly, and ask it to organize, archive and send any file back to you. Deleting a Bot destroys its workspace along with it.`,
        },
      },
      {
        id: 'persistent-disk-size',
        question: { en: 'What does the persistent disk size refer to?', zh: '持久化磁盘大小指的是什么？' },
        answer: {
          zh: `套餐与创建 Bot 时看到的"持久化磁盘大小"，指的是 **/data 持久化卷（volume）的容量**，在创建 Bot 的过程中设置。

它**不包括 Rootfs**：系统本身与预装环境占用的空间不计入这个额度，Rootfs 也不保证持久化 —— 需要长期保留的文件请放在 /data 下。`,
          en: `The "persistent disk size" shown on plans and during Bot creation refers to the **capacity of the /data persistent volume**, set while creating the Bot.

It does **not include the rootfs**: space taken by the system and the pre-installed environment doesn't count against this quota, and the rootfs isn't guaranteed to persist — keep long-lived files under /data.`,
        },
      },
      {
        id: 'scale-up-bot',
        question: { en: "Can I add more resources to a Bot's workspace?", zh: '可以给 Bot 的工作空间增加配置吗？' },
        answer: {
          zh: `**现阶段的扩容方式是升级订阅套餐。**云电脑的 CPU 核数、内存与存储空间由套餐规格决定，暂不支持在套餐之外单独加购某一项资源。

具体来说：

1. 在 **设置 → 订阅** 中升级到更高档位（Go → Pro → Premium）；
2. 升级**立即生效**，按剩余计费周期折算差价；
3. 生效后，Bot 的云电脑会自动应用新的资源规格 —— 文件、依赖、会话与记忆全部原样保留，**无需迁移或重建**；
4. 更高档位同时带来更多的每月 credits 额度。

各档位的具体规格对比见[定价页](/#pricing)。目前暂不支持按单项资源加购，或只为某一个 Bot 单独升配；如果你的负载超出了最高档位的规格，可以联系 [support@memoh.net](mailto:support@memoh.net) 沟通方案。`,
          en: `**Right now, scaling up means upgrading your plan.** The cloud computer's CPU cores, memory and storage follow your plan's specs — buying extra resources à la carte isn't supported yet.

In practice:

1. Upgrade to a higher tier (Go → Pro → Premium) under **Settings → Subscription**.
2. Upgrades take effect **immediately**, prorated for the rest of the billing cycle.
3. Once active, the Bot's cloud computer picks up the new specs automatically — files, dependencies, sessions and memory all stay in place, **no migration or rebuild needed**.
4. Higher tiers also come with a larger monthly credits allowance.

See the [pricing page](/#pricing) for a spec-by-spec comparison. Per-resource add-ons and per-Bot upgrades aren't available yet; if your workload outgrows the top tier, contact [support@memoh.net](mailto:support@memoh.net) to talk options.`,
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
          zh: `对任务而言，它一直可用：定时任务照常触发，长任务持续推进，渠道消息随时可达。

使用额度随套餐规格而定，月付套餐一般没有每日硬性时长限制，但长期满载等极端用法受公平使用政策约束，详见[定价](/#pricing)。`,
          en: `For your work, it's always available: schedules fire on time, long-running tasks keep moving, and channel messages always get through.

Usage allowances follow your plan. Monthly plans generally have no hard daily time cap, but sustained extremes like permanent full load fall under the fair-use policy — see [pricing](/#pricing).`,
        },
      },
      {
        id: 'server-locations',
        question: { en: 'Where are the cloud computers hosted?', zh: '云电脑的服务器在哪里？' },
        answer: {
          zh: `服务器部署在多家主流云服务商的数据中心，主要节点位于**北美和亚太**地区。系统会根据你的网络状况与所在地区，自动分配延迟最优的节点；当前实例所在区域可以在控制面板中查看。

节点分布会随基础设施扩展持续增加。`,
          en: `Servers run in the data centers of several mainstream cloud providers, with primary nodes in **North America and Asia-Pacific**. The system automatically assigns the lowest-latency node based on your region and connection; your instance's current region is shown in the control panel.

Node coverage keeps growing as the infrastructure expands.`,
        },
      },
    ],
  },
  {
    id: 'agents-and-models',
    icon: 'bot',
    title: { en: 'Agents & models', zh: 'Agent、模型' },
    description: {
      en: 'Bring your own agent, switch models, and how they work.',
      zh: '自带 Agent、切换模型，以及如何工作。',
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
- **国内平台**：微信、微信公众号、企业微信、QQ、飞书、钉钉。

一个 Agent 可以同时接入多个渠道，对话与记忆完全同步。`,
          en: `Besides the built-in web and desktop chat, Memoh connects to the following platforms:

- **Social & collaboration**: Telegram, Discord, Slack, LINE.
- **China-based platforms**: WeChat, WeChat Official Account, WeCom, QQ, Feishu, DingTalk.

One agent can be connected to several channels at once, with conversations and memory fully in sync.`,
        },
      },
      {
        id: 'connect-telegram',
        question: { en: 'How do I connect Memoh to Telegram?', zh: '如何把 Memoh 接入 Telegram？' },
        answer: {
          zh: `在 Bot 设置中打开**平台 → Telegram**，按提示完成绑定，然后就可以在 Telegram 里直接和它对话了。

提醒事项、随手安排任务、问答查询都可以在聊天里完成 —— 比如"提醒我 6 点取快递"，到点它会来叫你。`,
          en: `In your Bot's settings, open **Platforms → Telegram** and follow the linking steps. From then on you can talk to it right inside Telegram.

Reminders, quick tasks and questions all work in chat — say "remind me to pick up the package at 6" and it will ping you on time.`,
        },
      },
      {
        id: 'connect-discord',
        question: { en: 'How do I connect Memoh to Discord?', zh: '如何把 Memoh 接入 Discord？' },
        answer: {
          zh: `在**平台 → Discord** 中完成授权，并把 Bot 邀请进你的服务器。

在频道里 **@ 它**即可对话，比如让它总结今天频道里聊了什么；私信也同样可用。`,
          en: `Authorize under **Platforms → Discord** and invite the Bot into your server.

**@mention** it in any channel to talk — for example, ask it to summarize what was discussed today. Direct messages work too.`,
        },
      },
      {
        id: 'connect-wechat',
        question: { en: 'How do I connect Memoh to WeChat?', zh: '如何把 Memoh 接入微信？' },
        answer: {
          zh: `在 Bot 设置中打开**平台 → 微信**，选择扫码登录：页面会生成一个二维码，用微信扫码并确认后即完成绑定，之后直接在微信里和你的 Agent 聊天即可。二维码过期了点击"刷新"重新生成。

微信生态还有两种企业向的接入方式，作为独立渠道分别配置：

- **微信公众号**：填入公众平台的 AppID、AppSecret 与服务器配置 Token；
- **企业微信**：填入智能机器人的 BotID 与 Secret。`,
          en: `In your Bot's settings, open **Platforms → WeChat** and choose QR login: a QR code appears, and scanning plus confirming it in WeChat completes the binding — from then on, just chat with your agent inside WeChat. If the code expires, hit "Refresh" to generate a new one.

The WeChat ecosystem also offers two business-oriented options, configured as separate channels:

- **WeChat Official Account**: fill in the AppID, AppSecret and server-config Token from the Official Account platform.
- **WeCom**: fill in the smart bot's BotID and Secret.`,
        },
      },
      {
        id: 'connect-feishu',
        question: { en: 'How do I connect Memoh to Feishu (Lark)?', zh: '如何把 Memoh 接入飞书？' },
        answer: {
          zh: `1. 在[飞书开放平台](https://open.feishu.cn)创建企业自建应用，开启机器人能力；
2. 把应用的 **App ID** 和 **App Secret** 填入 Memoh 的**平台 → 飞书**；
3. 默认通过**长连接（WebSocket）**接收消息，无需公网回调地址，保存后在飞书里单聊或群里 @ 它即可。

使用国际版 Lark 时把区域切换为 **Lark**；如需改用 Webhook 回调模式，再补充 Encrypt Key 与 Verification Token。`,
          en: `1. Create a custom app on the [Feishu open platform](https://open.feishu.cn) and enable its bot capability.
2. Fill the app's **App ID** and **App Secret** into Memoh under **Platforms → Feishu**.
3. Messages arrive over a **WebSocket long connection** by default — no public callback URL needed. Save, then DM it or @mention it in any Feishu group.

Using international Lark? Switch the region to **Lark**. To use webhook mode instead, also provide the Encrypt Key and Verification Token.`,
        },
      },
      {
        id: 'connect-dingtalk',
        question: { en: 'How do I connect Memoh to DingTalk?', zh: '如何把 Memoh 接入钉钉？' },
        answer: {
          zh: `1. 在[钉钉开放平台](https://open.dingtalk.com)创建企业内部应用，添加机器人能力；
2. 把应用的 **AppKey** 和 **AppSecret** 填入 Memoh 的**平台 → 钉钉**；
3. Memoh 通过钉钉的 **Stream 模式**接收消息，无需配置公网回调地址，保存后在钉钉里单聊或群里 @ 它即可对话。`,
          en: `1. Create an internal app on the [DingTalk open platform](https://open.dingtalk.com) and add the bot capability.
2. Fill the app's **AppKey** and **AppSecret** into Memoh under **Platforms → DingTalk**.
3. Memoh receives messages via DingTalk **Stream mode** — no public callback URL to configure. Save, then chat with it directly or @mention it in a group.`,
        },
      },
      {
        id: 'connect-slack',
        question: { en: 'How do I connect Memoh to Slack?', zh: '如何把 Memoh 接入 Slack？' },
        answer: {
          zh: `1. 在 [api.slack.com/apps](https://api.slack.com/apps) 创建应用，开启 **Socket Mode** 并生成 App-Level Token（\`xapp-\` 开头）；
2. 在 OAuth & Permissions 中把应用安装到工作区，获取 **Bot Token**（\`xoxb-\` 开头）；
3. 把两个 Token 填入 Memoh 的**平台 → Slack**，保存后把 Bot 拉进频道，@ 它即可对话。

Socket Mode 下同样无需公网回调地址。`,
          en: `1. Create an app at [api.slack.com/apps](https://api.slack.com/apps), enable **Socket Mode** and generate an App-Level Token (starts with \`xapp-\`).
2. Install the app to your workspace under OAuth & Permissions and grab the **Bot Token** (starts with \`xoxb-\`).
3. Fill both tokens into Memoh under **Platforms → Slack**, save, invite the Bot to a channel and @mention it.

Socket Mode means no public callback URL here either.`,
        },
      },
      {
        id: 'connect-other-channels',
        question: {
          en: 'How do I connect QQ or LINE?',
          zh: 'QQ、LINE 如何接入？',
        },
        answer: {
          zh: `这些渠道同样在 Bot 的**平台**标签页中添加，填入对应平台的凭据即可：

- **QQ**：QQ 开放平台机器人的 AppID 与 ClientSecret；
- **LINE**：LINE Developers 的 Channel Secret 与 Channel Access Token，并按提示配置 Webhook 地址。

每个渠道都可以独立启用或停用，互不影响。`,
          en: `These channels are added the same way on the Bot's **Platforms** tab — fill in each platform's credentials:

- **QQ**: the AppID and ClientSecret of your QQ open-platform bot.
- **LINE**: the Channel Secret and Channel Access Token from LINE Developers, plus the webhook URL as prompted.

Each channel can be enabled or disabled independently.`,
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

Agent 会创建对应的定时任务。也可以在 Bot 的**定时任务**标签页查看、编辑全部任务。`,
          en: `Just say it in plain language, for example:

- "Send me a morning brief at 9 am every day"
- "Watch this repo for releases on weekdays"
- "Tidy my inbox every night"

The agent sets up the schedule for you. You can also review and edit every task on the Bot's **Schedule** tab.`,
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
        id: 'multitask',
        question: { en: 'Can it run multiple tasks at once?', zh: '可以同时跑多个任务吗？' },
        answer: {
          zh: `可以。任务在云端**异步执行**：吩咐完就可以关掉页面去忙别的，跑完或需要你拍板时，Agent 会通过你选定的渠道来找你。

多个任务可以并行推进；需要更强隔离时，可以为不同职责创建不同的 Bot —— 各自拥有独立的云电脑与工作区。`,
          en: `Yes. Tasks run **asynchronously** in the cloud: hand one over, close the page, and the agent reaches you through your chosen channel when it finishes or needs a decision.

Multiple tasks move in parallel, and for stronger isolation you can create separate Bots for separate jobs — each with its own cloud computer and workspace.`,
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

也可以在**定时任务**标签页手动开关、编辑和删除任意任务。`,
          en: `The fastest way is to just tell the agent:

- "Move the morning brief to 8:30"
- "Pause the repo watcher for now"
- "Delete the inbox-cleanup task"

You can also toggle, edit and delete any task by hand on the Bot's **Schedule** tab.`,
        },
      },
      {
        id: 'proactive-messages',
        question: { en: 'Will the agent message me proactively?', zh: 'Agent 会主动给我发消息吗？' },
        answer: {
          zh: `会 —— 这正是 Memoh 的核心能力之一。你盯的版本发布了、日程即将开始、任务失败需要你拍板时，Agent 会先发消息给你，而不是等你想起来去问。

嫌吵的话，直接告诉它少发点、或只在某个渠道找你即可；背后的定时任务也可以随时暂停。`,
          en: `Yes — it's one of Memoh's core abilities. When a release you're watching ships, a meeting is about to start, or a task fails and needs your call, the agent messages you first instead of waiting to be asked.

If it gets chatty, just tell it to reach out less or stick to one channel — and any schedule behind it can be paused at any time.`,
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

订阅同时包含 **token 额度（credits）**与**云电脑资源**：各档位对应不同的 CPU 核数、内存、存储空间与每月 credits 额度，最新规格与价格见[定价页](/#pricing)。`,
          en: `Memoh comes in three plans:

- **Go**: start with everyday conversations and light tasks.
- **Pro**: built for daily work and always-running agents.
- **Premium**: more compute and space for heavier workloads.

Every subscription bundles **token allowance (credits)** with **cloud-computer resources**: tiers differ in CPU cores, memory, storage and monthly credits — see the [pricing page](/#pricing) for current specs and prices.`,
        },
      },
      {
        id: 'why-affordable',
        question: {
          en: 'Why is it so affordable — and is that sustainable?',
          zh: '为什么价格能做到这么低？可持续吗？',
        },
        answer: {
          zh: `低价来自架构，而不是补贴：

- **资源池化与弹性调度**：在多用户之间错峰复用服务器资源，把空闲浪费降到最低；
- **自有数据中心资源**与自动化运维，压低了边际成本；
- 入门档（如 Go）通过合理的资源调度保持可持续，更高档位则带来健康的利润结构。

所以低价不等于低质量 —— 服务稳定性与数据安全始终是优先事项；入门价位是长期定位，不是短期补贴换量。`,
          en: `The low price comes from architecture, not subsidies:

- **Resource pooling and elastic scheduling** — server capacity is reused across users and off-peak hours, cutting idle waste to a minimum.
- **Our own data centers and automated operations** — marginal costs stay low.
- **A sustainable entry tier** — Go holds up through careful scheduling, while higher tiers carry a healthy margin.

So cheap doesn't mean low quality — stability and data safety remain first priorities, and the entry price is a long-term position, not a short-term subsidy play.`,
        },
      },
      {
        id: 'what-are-credits',
        question: { en: 'What are credits?', zh: '什么是 credits？' },
        answer: {
          zh: `credits 是使用 **Memoh 提供的模型**时消耗的 Token 额度，按订阅计划每月发放、每月刷新。

如果你自带 Agent 订阅（如 Claude Code、Codex），模型调用走你自己的账号，**不消耗 credits**；云电脑的 CPU、内存等算力则始终由计划规格决定。

实际消耗按所用模型的价格折算，可以在账单页查看明细。`,
          en: `Credits are the token allowance consumed when you use **models provided by Memoh**. They're granted monthly with your plan and refresh every cycle.

If you bring your own agent subscription (Claude Code, Codex, …), model calls go through your own account and **don't consume credits**. The cloud computer's CPU and memory always come from your plan's specs.

Actual consumption is converted at each model's pricing — see your billing page for the details.`,
        },
      },
      {
        id: 'out-of-credits',
        question: { en: 'What happens when I run out of credits?', zh: 'credits 用完了怎么办？' },
        answer: {
          zh: `当月 credits 用完后，使用 Memoh 内置模型的新请求会暂停，但你的云电脑、文件、记忆和已配置的定时任务都会完整保留。

你可以：

- 等待下个计费周期额度自动刷新；
- 单独充值 credits 余额；
- 升级到更高档位获得更多额度；
- 切换到自带订阅的 Agent（不消耗 credits）继续使用。`,
          en: `When your monthly credits run out, new requests to Memoh-provided models pause — but your cloud computer, files, memory and configured tasks are all fully preserved.

You can:

- wait for the allowance to refresh next billing cycle.
- top up extra credits.
- upgrade to a higher tier for more credits.
- switch to a bring-your-own agent (which doesn't consume credits) and keep going.`,
        },
      },
      {
        id: 'top-up-credits',
        question: { en: 'How do I top up extra credits?', zh: '如何充值 credits 余额？' },
        answer: {
          zh: `除了每月随套餐发放的额度，你也可以单独充值 credits：

1. 打开 **设置 → 账单**，选择**充值 credits**；
2. 选择充值金额，通过 Stripe 完成支付（与订阅使用同样的支付方式）；
3. 充值即时到账，套餐内额度用完后自动使用充值余额。

余额的有效期与扣减顺序以账单页说明为准。`,
          en: `Besides the monthly allowance that comes with your plan, you can top up credits separately:

1. Open **Settings → Billing** and choose **Top up credits**.
2. Pick an amount and pay through Stripe (the same payment method as your subscription).
3. Credits land instantly and are used automatically once your plan allowance runs out.

Validity and deduction order follow what's shown on the billing page.`,
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

- **Upgrades** take effect immediately, prorated for the rest of the cycle.
- **Downgrades and cancellations** apply at the end of the current billing cycle, with service unaffected until then.

After cancellation, your data is handled per the retention terms in the [privacy policy](/legal/privacy).`,
        },
      },
      {
        id: 'payment-methods',
        question: { en: 'How do payment and renewal work?', zh: '支持哪些支付方式？怎么续费？' },
        answer: {
          zh: `- **支付方式**：订阅通过 **Stripe** 支付，支持主流信用卡与借记卡；暂不支持加密货币支付；
- **续费**：订阅按计费周期**自动扣款**；可随时在 **设置 → 订阅** 中取消，取消于当期结束时生效；
- **年付**：年付方案正在准备中，近期推出，目前先提供月付。`,
          en: `- **Payment**: subscriptions are billed through **Stripe**, covering major credit and debit cards; cryptocurrency payments are not supported yet.
- **Renewal**: plans renew by **automatic charge** each billing cycle; cancel any time under **Settings → Subscription** and it takes effect at the end of the current period.
- **Annual plans**: in the works and coming soon — monthly billing is what's offered today.`,
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

- **macOS**: Apple Silicon or Intel (.dmg).
- **Windows**: x64 installer.
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
- **这台电脑**：把你正在用的这台机器共享给 Agent，让它在你授权的范围内读写本机文件、执行命令 —— Agent 本体仍运行在云端。

轻度使用选网页版即可，重度使用推荐桌面版。`,
          en: `Core features are identical. The desktop app adds:

- system notifications and global shortcuts.
- launch at login, so agent messages reach you instantly.
- **This computer**: share the machine you're on with your agents, so they can read local files and run commands within the access you grant — the agent itself still runs in the cloud.

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

Agent 本体运行在云端，桌面应用本身很轻，对本机配置几乎没有要求；只有开启"这台电脑"共享时，Agent 才会在你授权的范围内使用本机资源。`,
          en: `- **macOS** 12 or later (Apple Silicon & Intel).
- **Windows** 10 or later (x64).
- **Mainstream Linux distros**: .deb for Debian/Ubuntu, .rpm for Fedora, AppImage for everything else.

Agents run in the cloud and the desktop app itself is lightweight, so hardware requirements are minimal; local resources are only used when you enable "This computer" sharing, within the access you grant.`,
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
        id: 'prohibited-uses',
        question: { en: 'What uses are prohibited?', zh: '云电脑有哪些禁止用途？' },
        answer: {
          zh: `云电脑必须在合法合规范围内使用。以下行为被明确禁止：

- 搭建代理 / VPN 等网络穿透服务；
- 长期对外开设公共服务（如对外开 Minecraft 服务器）；
- 发送垃圾信息、挖矿，以及其他违法违规用途。

平台会持续监控异常流量与资源占用；一经发现违规，将视情节限制功能、暂停或终止服务，且不予退款。详见[服务协议](/legal/terms)。`,
          en: `The cloud computer must be used lawfully. The following are explicitly prohibited:

- running proxies / VPNs or other tunneling services.
- hosting long-lived public-facing services (e.g. a public Minecraft server).
- spam, crypto mining, and any other illegal or abusive use.

The platform continuously monitors abnormal traffic and resource usage; violations lead to feature limits, suspension or termination — without refund — depending on severity. See the [Terms of Service](/legal/terms).`,
        },
      },
      {
        id: 'connector-security',
        question: { en: 'Is Connector authorization safe?', zh: 'Connector 授权安全吗？' },
        answer: {
          zh: `Connector 使用各服务的官方授权流程（如 OAuth）：

- 按服务**逐个授权**，绝不打包索权；
- 只申请完成任务所需的最小权限；
- 凭据加密存储，且**可随时在应用市场中撤销**。

撤销后 Agent 立即失去对该服务的访问能力。`,
          en: `Connectors use each service's official authorization flow (e.g. OAuth):

- authorized **per service**, never bundled.
- requesting only the minimum scopes needed for the job.
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
          en: `- **Deleting a Bot** destroys its cloud computer, files and memory together.
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
