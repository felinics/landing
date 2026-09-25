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

export const helpLocales = ['en', 'zh', 'ja'] as const
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
  locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en'

// ---------------------------------------------------------------------------
// UI strings
// ---------------------------------------------------------------------------

const ui = {
  title: { en: 'Help Center', zh: '帮助中心', ja: 'ヘルプセンター' },
  subtitle: { en: 'How can we help?', zh: '有什么可以帮忙的？', ja: '何かお困りですか？' },
  searchPlaceholder: { en: 'Search for articles…', zh: '搜索帮助文章…', ja: '記事を検索…' },
  searchResults: { en: '{n} results for “{q}”', zh: '“{q}” 的 {n} 条结果', ja: '「{q}」の検索結果 {n} 件' },
  searchEmptyTitle: { en: 'No articles found', zh: '没有找到相关文章', ja: '記事が見つかりません' },
  searchEmptyDesc: {
    en: 'Try a different keyword, or reach out to us directly.',
    zh: '换个关键词试试，或直接联系我们。',
    ja: '別のキーワードでお試しいただくか、直接お問い合わせください。',
  },
  clearSearch: { en: 'Clear search', zh: '清除搜索', ja: '検索をクリア' },
  articleCount: { en: '{n} articles', zh: '{n} 篇文章', ja: '記事 {n} 件' },
  breadcrumbRoot: { en: 'Help Center', zh: '帮助中心', ja: 'ヘルプセンター' },
  collectionsTitle: { en: 'Browse by topic', zh: '按主题浏览', ja: 'トピックから探す' },
  relatedTitle: { en: 'Related articles', zh: '相关文章', ja: '関連記事' },
  loadingAnswer: { en: 'Loading…', zh: '正在加载…', ja: '読み込み中…' },
  moreCollections: { en: 'Browse other topics', zh: '浏览其他主题', ja: 'ほかのトピック' },
  contactTitle: { en: 'Can’t find what you need?', zh: '没有找到答案？', ja: '解決しませんでしたか？' },
  contactDesc: {
    en: 'Reach the Memoh team — we usually reply within one business day.',
    zh: '联系 Memoh 团队，我们通常会在一个工作日内回复。',
    ja: 'Memoh チームまでご連絡ください。通常 1 営業日以内にご返信します。',
  },
  contactEmail: { en: 'Email support', zh: '邮件联系', ja: 'メールで問い合わせ' },
  contactTelegram: { en: 'Telegram community', zh: 'Telegram 社群', ja: 'Telegram コミュニティ' },
  notFoundTitle: { en: 'Article not found', zh: '文章不存在', ja: '記事が存在しません' },
  notFoundDesc: {
    en: 'The help article you opened is not on this site.',
    zh: '你打开的帮助文章不在这个站点里。',
    ja: 'お探しのヘルプ記事はこのサイトにありません。',
  },
  backToHelp: { en: 'Back to Help Center', zh: '返回帮助中心', ja: 'ヘルプセンターへ戻る' },
  seoTitle: { en: 'Memoh Help Center', zh: 'Memoh 帮助中心', ja: 'Memoh ヘルプセンター' },
  seoDescription: {
    en: 'Answers about Memoh: cloud computers for agents, channels, scheduled tasks, plans and billing, desktop apps, privacy and security.',
    zh: '关于 Memoh 的常见问题：Agent 云电脑、消息渠道、定时任务、订阅计费、桌面版、隐私与安全。',
    ja: 'Memoh に関するよくある質問：エージェントのクラウドコンピューター、チャンネル、スケジュールタスク、料金、デスクトップアプリ、プライバシーとセキュリティ。',
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
    title: { en: 'Getting started', zh: '开始使用', ja: 'スタートガイド' },
    description: {
      en: 'What Memoh is, how to create your first Bot, and where to use it.',
      zh: '了解 Memoh 的基本概念，创建你的第一个 Bot。',
      ja: 'Memoh の概要と、最初の Bot の作り方。',
    },
    articles: [
      {
        id: 'what-is-memoh',
        question: { en: 'What is Memoh?', zh: 'Memoh 是什么？', ja: 'Memoh とは？' },
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
          ja: `Memoh はクラウドファーストのマルチエージェントプラットフォームです。ひとことで言えば、**すべての AI エージェントに本物のクラウドコンピューターを 1 台ずつ**用意するサービスです。

各エージェントは次のものを持ちます：

- **専用デスクトップ** — ブラウザを開いてアプリを操作。リアルタイムで見守ることも、いつでも操作を引き継ぐこともできます。
- **専用ファイル** — 成果物やコード、資料はすべて自分のワークスペースに残ります。
- **専用ネットワーク** — Web へのアクセスや外部サービスの呼び出しができます。
- **常時スタンバイ** — あなたの PC を閉じても、エージェントはクラウドで動き続けます。

さらにマルチチャンネル対応（デスクトップ、Telegram、Discord、WeChat など）、スケジュールタスク、プロアクティブ通知、長期記憶を備え、エージェントは「チャットウィンドウ」ではなく、常にオンラインの同僚のような存在になります。`,
        },
      },
      {
        id: 'how-to-get-started',
        question: { en: 'How do I get started with Memoh?', zh: '如何开始使用 Memoh？', ja: 'Memoh を使い始めるには？' },
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
          ja: `### おすすめ：デスクトップアプリ

1. [ダウンロードページ](/download)から、お使いの OS（macOS / Windows / Linux）向けの Memoh をインストールします。
2. アプリを開いてサインインします。招待制の期間中は、先に[ウェイトリストに登録](/waitlist)してください。
3. 最初の Bot を作成すると、クラウドコンピューターが自動的に割り当てられます。
4. あとはチャットで頼むだけ。「読書リストの Web ページを作って」「毎朝 9 時にブリーフィングを送って」など。

デスクトップアプリはシステム通知とグローバルショートカットに対応し、エージェントからの連絡をすぐ受け取れます。今使っているこのコンピューターをエージェントに共有して、ローカルで作業させることもできます。

### もうひとつの方法：Web アプリ

インストールできない環境では、ブラウザで [app.memoh.net](https://app.memoh.net) を開いてください。登録・Bot 作成・タスク依頼の流れはまったく同じで、デスクトップ版と常に同期します。いつでもデスクトップ版に乗り換えられます。

どちらから始めても、あとから Bot を Telegram や Discord などのチャンネルにつなぎ、いつもの場所からアクセスできます。`,
        },
      },
      {
        id: 'how-is-memoh-different',
        question: {
          en: 'How is Memoh different from a regular AI chat assistant?',
          zh: 'Memoh 和普通 AI 聊天助手有什么区别？',
          ja: 'Memoh と普通の AI チャットアシスタントの違いは？',
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
          ja: `従来のチャットアシスタントは、ウィンドウを開いている間だけ「存在」します。Memoh のエージェントは稼働し続けるクラウドコンピューターを持っているため、できることが変わります：

- **コンピューターがある**：本物のデスクトップ・ファイル・ネットワークを持ち、テキストを返すだけでなく、実際にサイトを開き、依存をインストールし、コードを実行し、プレビューを見せてくれます。
- **ずっと動いている**：あなたの PC がオフでもクラウドで稼働し、スケジュールタスクは自動で実行されます。
- **自分から動く**：大事なことが起きたら、先にメッセージを送ってくれます。
- **覚えている**：セッションはリセットされず、記憶はすべてのチャンネルで共有されます。`,
        },
      },
      {
        id: 'what-is-a-bot',
        question: { en: 'What is a Bot? How many can I create?', zh: '什么是 Bot？我可以创建几个？', ja: 'Bot とは？いくつ作れますか？' },
        answer: {
          zh: `在 Memoh 里，一个 **Bot** 就是一个拥有独立云电脑的 Agent 实例：独立的桌面、文件、依赖和记忆。

你可以为不同用途创建不同的 Bot —— 比如一个管日程和提醒，一个专门做开发。Bot 之间完全隔离，互不干扰。

可创建的 Bot 数量与每个 Bot 的算力规格取决于你的订阅计划，详见[定价](/#pricing)。`,
          en: `In Memoh, a **Bot** is an agent instance with its own cloud computer: its own desktop, files, dependencies and memory.

Create different Bots for different jobs — say, one for scheduling and reminders, one dedicated to development. Bots are fully isolated from each other.

How many Bots you can create, and the compute each one gets, depends on your plan — see [pricing](/#pricing).`,
          ja: `Memoh における **Bot** とは、専用のクラウドコンピューターを持つエージェントのインスタンスです。デスクトップ、ファイル、依存関係、記憶をそれぞれ独立して持ちます。

用途ごとに Bot を分けられます。たとえばスケジュール管理用と開発専用など。Bot 同士は完全に分離されています。

作成できる Bot の数や各 Bot のスペックはプランによって異なります。詳しくは[料金](/#pricing)をご覧ください。`,
        },
      },
      {
        id: 'which-platforms',
        question: { en: 'Where can I use Memoh?', zh: '可以在哪些平台使用 Memoh？', ja: 'Memoh はどこで使えますか？' },
        answer: {
          zh: `- **桌面版（推荐）**：macOS（Apple Silicon 与 Intel）、Windows、Linux，见[下载页](/download)；
- **网页**：[app.memoh.net](https://app.memoh.net)。

所有入口背后是同一个 Agent、同一份记忆 —— 在哪里开口都能接上。`,
          en: `- **Desktop (recommended)**: macOS (Apple Silicon & Intel), Windows and Linux — see the [download page](/download).
- **Web**: [app.memoh.net](https://app.memoh.net).

Every entry point talks to the same agent with the same memory — pick up the conversation from anywhere.`,
          ja: `- **デスクトップアプリ（推奨）**：macOS（Apple Silicon / Intel）、Windows、Linux。[ダウンロードページ](/download)へ。
- **Web**：[app.memoh.net](https://app.memoh.net)。

どの入口の先にいるのも、同じエージェント・同じ記憶です。どこからでも会話の続きを始められます。`,
        },
      },
      {
        id: 'what-can-memoh-do',
        question: { en: 'What can I actually do with Memoh?', zh: 'Memoh 具体能做什么？', ja: 'Memoh で具体的に何ができますか？' },
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
          ja: `Memoh の中心は、いつでも使えるクラウドコンピューターと、その中に住むエージェントです。よくある使い方：

- **日常業務**：ファイル整理、ドキュメント作成、メールやスケジュールの処理。
- **開発**：クラウドでコードを書き、開発サーバーを動かし、いつでもプレビュー。
- **長時間のバックグラウンドタスク**：リリース監視、定期ブリーフィング、一括収集と整理 — PC を閉じても動き続けます。
- **自動化など**：エージェントにブラウザを操作させ、Web 上の作業を代行。

自分でリモート操作することも、エージェントに任せることもできます。代表的なシナリオは[ホームページ](/)をご覧のうえ、プランをお選びください。`,
        },
      },
      {
        id: 'vs-vps',
        question: { en: 'How is this different from renting a VPS?', zh: '云电脑和自己买的 VPS 有什么区别？', ja: 'クラウドコンピューターと VPS の違いは？' },
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
          ja: `素の VPS が渡してくれるのは空のシステムで、環境構築もデスクトップも運用もすべて自分でやることになります。Memoh が渡すのは、**すぐに使える、エージェントのために設計された**クラウドコンピューターです：

- GUI デスクトップとブラウザをプリインストール。パッケージはマーケットプレイスからワンクリック。
- エージェント内蔵：作業は依頼するだけで、すべて手作業でやる必要はありません。
- メッセージチャンネル、スケジュールタスク、長期記憶と深く統合。
- 運用いらず：メンテナンス、監視、スケジューリングはプラットフォーム側の仕事です。

素のサーバーが欲しいだけなら VPS が適しています。「誰かが住み込みで働いてくれるコンピューター」が欲しいなら、Memoh です。`,
        },
      },
      {
        id: 'bring-accounts-files',
        question: { en: 'How do I bring my existing accounts and files?', zh: '怎么接入我已有的账号和文件？', ja: '既存のアカウントやファイルを持ち込むには？' },
        answer: {
          zh: `- **第三方账号**：在应用市场中通过 **Connector** 授权（如 GitHub），Agent 即可访问你已有的仓库、Issue 等数据 —— 按服务独立授权，可随时撤销；
- **自带 Agent 订阅**：Claude Code、Codex 等可登录你自己的账号，沿用已有订阅；
- **文件**：在会话中直接上传给 Agent，或让它从网盘、仓库等来源自行拉取，之后保存在它的工作区里；
- **聊天账号**：在 Bot 的**平台**标签页绑定你已有的 Telegram、微信、飞书等账号。`,
          en: `- **Third-party accounts**: authorize **Connectors** in the Supermarket (GitHub and more) so the agent can work with your existing repos and issues — per-service and revocable at any time.
- **Your agent subscriptions**: Claude Code, Codex and other BYO agents sign in with your own accounts.
- **Files**: upload them in a conversation, or have the agent fetch from drives and repos itself — everything lands in its workspace.
- **Chat accounts**: bind your existing Telegram, WeChat or Feishu accounts on the Bot's **Platforms** tab.`,
          ja: `- **外部サービスのアカウント**：マーケットプレイスで **Connector** を認可（GitHub など）すると、既存のリポジトリや Issue をエージェントが扱えます。サービスごとに認可し、いつでも取り消せます。
- **エージェントのサブスクリプション**：Claude Code、Codex などは自分のアカウントでサインインし、既存の契約をそのまま使えます。
- **ファイル**：会話で直接アップロードするか、ドライブやリポジトリからエージェントに取得させれば、ワークスペースに保存されます。
- **チャットアカウント**：Bot の**プラットフォーム**タブで、お使いの Telegram・WeChat・Lark などを連携できます。`,
        },
      },
    ],
  },
  {
    id: 'cloud-computer',
    icon: 'monitor',
    title: { en: 'Cloud computer & workspace', zh: '云电脑与工作区', ja: 'クラウドコンピューターとワークスペース' },
    description: {
      en: 'Desktop, files, packages, and developing in the cloud.',
      zh: '桌面、文件、依赖安装与云上开发。',
      ja: 'デスクトップ、ファイル、パッケージ、クラウド上での開発。',
    },
    articles: [
      {
        id: 'whats-inside',
        question: { en: "What's inside an agent's cloud computer?", zh: '每个 Agent 的云电脑里有什么？', ja: 'エージェントのクラウドコンピューターには何が入っていますか？' },
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
          ja: `各 Bot は分離されたクラウドコンピューター上で動き、次を備えています：

- **GUI デスクトップ**：ブラウザをプリインストール。エージェントは人と同じようにサイトやアプリを操作します。
- **専用ファイルシステム**：コード、ドキュメント、成果物はワークスペースに。
- **ネットワークアクセス**：ページの取得や外部サービスの呼び出し。
- **インストール可能なランタイム**：Node.js、Python、uv など。マーケットプレイスからワンクリックで導入。

CPU コア数やメモリはプランによって決まります。[料金](/#pricing)をご覧ください。`,
        },
      },
      {
        id: 'watch-and-take-over',
        question: { en: "How do I watch or take over the agent's desktop?", zh: '如何查看或接管 Agent 的桌面？', ja: 'エージェントのデスクトップを見る・操作を引き継ぐには？' },
        answer: {
          zh: `在会话中打开**桌面视图**，就能实时观看 Agent 的每一步操作 —— 它打开了哪个网站、点了什么、在终端里跑了什么命令。

需要人工介入时（比如登录验证、复核关键操作），点击**接管**即可直接用你的鼠标和键盘操作这台云桌面；交还控制后，Agent 会从当前状态继续工作。`,
          en: `Open the **desktop view** in any session to watch the agent work in real time — which site it opened, what it clicked, what it ran in the terminal.

When a human touch is needed (a login challenge, double-checking a critical step), hit **Take over** to drive the cloud desktop with your own mouse and keyboard. Hand control back, and the agent continues from exactly where things stand.`,
          ja: `セッションで**デスクトップビュー**を開くと、エージェントの操作をリアルタイムで確認できます — どのサイトを開き、どこをクリックし、ターミナルで何を実行したか。

人の手が必要な場面（ログイン認証や重要操作の確認など）では、**引き継ぐ**を押せば自分のマウスとキーボードでクラウドデスクトップをそのまま操作できます。操作を返すと、エージェントはその状態から作業を続けます。`,
        },
      },
      {
        id: 'install-packages',
        question: { en: 'How do I install packages and apps for my agent?', zh: '如何为 Agent 安装依赖和应用？', ja: 'エージェントにパッケージやアプリを入れるには？' },
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
          ja: `**マーケットプレイス**（Supermarket）を開いてください。すべてクラウドコンピューター上にホストされ、エージェントがいつでも使えます：

- **パッケージ**：Node.js、Python、uv などのランタイム。Bot を選んで「Bot にインストール」。
- **Connector**：GitHub などの外部サービスと接続。サービスごとに認可します。
- **Agent Skill**：エージェントに専門分野のスキルを追加。

エージェント自身がタスクの途中で必要な依存をインストールすることもあり、その様子はデスクトップビューで確認できます。`,
        },
      },
      {
        id: 'files-and-storage',
        question: { en: 'Where are my files stored?', zh: '我的文件存储在哪里？', ja: 'ファイルはどこに保存されますか？' },
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
          ja: `各 Bot のファイルは自分のクラウドワークスペースに保存され、他の Bot からは分離されています。ストレージ容量はプランに含まれます。

永続化のルールに注意してください：

- **/data ディレクトリ**は永続ボリューム（volume）で、ここに置いたファイルは長期保存されます。
- **rootfs**（システムディスクのその他の部分）は**永続化が保証されず**、システム更新やインスタンス再構築でリセットされることがあります。

大事なファイルはエージェントに /data 配下へ保存させてください。ファイルは直接アップロードでき、整理・圧縮して送り返してもらうこともできます。Bot を削除すると、そのワークスペースも一緒に破棄されます。`,
        },
      },
      {
        id: 'persistent-disk-size',
        question: { en: 'What does the persistent disk size refer to?', zh: '持久化磁盘大小指的是什么？', ja: '永続ディスク容量とは何を指しますか？' },
        answer: {
          zh: `套餐与创建 Bot 时看到的"持久化磁盘大小"，指的是 **/data 持久化卷（volume）的容量**，在创建 Bot 的过程中设置。

它**不包括 Rootfs**：系统本身与预装环境占用的空间不计入这个额度，Rootfs 也不保证持久化 —— 需要长期保留的文件请放在 /data 下。`,
          en: `The "persistent disk size" shown on plans and during Bot creation refers to the **capacity of the /data persistent volume**, set while creating the Bot.

It does **not include the rootfs**: space taken by the system and the pre-installed environment doesn't count against this quota, and the rootfs isn't guaranteed to persist — keep long-lived files under /data.`,
          ja: `プランや Bot 作成時に表示される「永続ディスク容量」は、**/data 永続ボリューム（volume）の容量**を指し、Bot の作成時に設定します。

**rootfs は含まれません**。システムやプリインストール環境が使う領域はこの容量にカウントされず、rootfs は永続化も保証されません。長期保存したいファイルは /data 配下に置いてください。`,
        },
      },
      {
        id: 'rootfs-persistence',
        question: {
          en: 'Can I use the rootfs as persistent storage?',
          zh: 'rootfs 可以当持久空间用吗？',
          ja: 'rootfs を永続ストレージとして使えますか？',
        },
        answer: {
          zh: `不能，请不要把 rootfs 当作持久存储。

平台将 rootfs 视为**一次性**的：镜像更新或工作区重建时，这一层会被整体替换。写入 /usr、/opt 等系统路径的内容都应视为临时的 —— 使用越久，被重置的概率越高。

真正持久的是**数据卷（默认挂载在 /data）**：

- /data 中的内容**始终保留**，跨镜像更新与重建不受影响；
- 平台自身也刻意把依赖缓存、Codex / Claude Code 等 CLI 的配置放在 /data 里 —— rootfs 被替换后，这些 CLI 会依靠 /data 中的副本自动装回；
- 需要长期保留的文件与配置请写入 /data；如果你维护了自定义环境，把安装脚本放进 /data，重建后让 Agent 一键恢复即可。`,
          en: `No — please don't treat the rootfs as persistent storage.

The platform treats the rootfs as **disposable**: image updates and workspace rebuilds replace that layer wholesale. Anything written to system paths like /usr or /opt should be considered temporary — the longer you run, the more likely it is to be reset.

What actually persists is the **data volume (mounted at /data by default)**:

- Contents of /data are **always preserved**, across image updates and rebuilds.
- The platform itself deliberately keeps dependency caches and the configs of CLIs like Codex / Claude Code in /data — when the rootfs is replaced, those CLIs are reinstalled automatically from the copies kept there.
- Put anything you want to keep under /data. If you maintain a custom environment, keep its setup script in /data so the agent can restore everything after a rebuild.`,
          ja: `いいえ。rootfs を永続ストレージとして使わないでください。

プラットフォームは rootfs を**使い捨て**として扱います。イメージ更新やワークスペースの再構築で、このレイヤーは丸ごと置き換えられます。/usr や /opt などのシステムパスへ書き込んだ内容は一時的なものと考えてください。使い込むほど、リセットされる可能性は高くなります。

本当に永続するのは**データボリューム（デフォルトで /data にマウント）**です：

- /data の内容はイメージ更新や再構築をまたいで**常に保持**されます。
- プラットフォーム自身も、依存キャッシュや Codex / Claude Code などの CLI 設定を意図的に /data に置いています。rootfs が置き換えられても、CLI は /data のコピーから自動的に再インストールされます。
- 残したいファイルや設定は /data 配下へ。独自環境がある場合は、セットアップスクリプトを /data に置いておけば、再構築後にエージェントがすぐ復元できます。`,
        },
      },
      {
        id: 'scale-up-bot',
        question: { en: "Can I add more resources to a Bot's workspace?", zh: '可以给 Bot 的工作空间增加配置吗？', ja: 'Bot のワークスペースのスペックを上げられますか？' },
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
          ja: `**現時点では、プランのアップグレードがスペック拡張の方法です。**クラウドコンピューターの CPU コア数・メモリ・ストレージはプランの仕様で決まり、リソース単品の追加購入には対応していません。

具体的には：

1. **設定 → サブスクリプション**で上位プラン（Go → Pro → Premium）へアップグレードします。
2. アップグレードは**即時反映**され、残り期間分は日割りで差額精算されます。
3. 反映後、Bot のクラウドコンピューターに新しいスペックが自動適用されます。ファイル・依存関係・セッション・記憶はそのまま保持され、**移行や再構築は不要**です。
4. 上位プランでは毎月のクレジットも増えます。

各プランのスペック比較は[料金ページ](/#pricing)へ。Bot 単位のアップグレードは未対応です。最上位プランでも足りない場合は [support@memoh.net](mailto:support@memoh.net) までご相談ください。`,
        },
      },
      {
        id: 'develop-and-preview',
        question: { en: 'Can I develop and preview apps on the cloud computer?', zh: '可以在云电脑上开发并预览应用吗？', ja: 'クラウドコンピューター上で開発とプレビューはできますか？' },
        answer: {
          zh: `可以。从编写代码、安装依赖到启动开发服务器，都在云电脑上完成，不需要在你的本机配置任何环境。

Agent 启动开发服务器后会给你一个 localhost 链接，点击即可在 Memoh 的新标签页中打开预览，随开发实时更新 —— 边改边看。`,
          en: `Yes. Writing code, installing dependencies and running dev servers all happen on the cloud computer — nothing to set up on your own machine.

When the agent starts a dev server, it hands you a localhost link; click it to open a live preview in a new Memoh tab that updates as the code changes.`,
          ja: `できます。コードを書く、依存をインストールする、開発サーバーを動かす — すべてクラウドコンピューター上で完結し、手元のマシンには何も構築しません。

エージェントが開発サーバーを起動すると localhost のリンクを渡してくれます。クリックすると Memoh の新しいタブでライブプレビューが開き、コードの変更に合わせて更新されます。`,
        },
      },
      {
        id: 'always-on',
        question: { en: 'Is the cloud computer always on?', zh: '云电脑会一直开着吗？', ja: 'クラウドコンピューターは常に稼働していますか？' },
        answer: {
          zh: `对任务而言，它一直可用：定时任务照常触发，长任务持续推进，渠道消息随时可达。

使用额度随套餐规格而定，月付套餐一般没有每日硬性时长限制，但长期满载等极端用法受公平使用政策约束，详见[定价](/#pricing)。`,
          en: `For your work, it's always available: schedules fire on time, long-running tasks keep moving, and channel messages always get through.

Usage allowances follow your plan. Monthly plans generally have no hard daily time cap, but sustained extremes like permanent full load fall under the fair-use policy — see [pricing](/#pricing).`,
          ja: `作業の面では、常に利用できます。スケジュールは時間どおりに発火し、長時間のタスクは進み続け、チャンネルのメッセージはいつでも届きます。

利用量の上限はプランに従います。月額プランには通常、1 日あたりの固定的な時間制限はありませんが、恒常的なフルロードのような極端な使い方はフェアユースポリシーの対象になります。詳しくは[料金](/#pricing)へ。`,
        },
      },
      {
        id: 'server-locations',
        question: { en: 'Where are the cloud computers hosted?', zh: '云电脑的服务器在哪里？', ja: 'サーバーはどこにありますか？' },
        answer: {
          zh: `服务器部署在多家主流云服务商的数据中心，主要节点位于**北美和亚太**地区。系统会根据你的网络状况与所在地区，自动分配延迟最优的节点；当前实例所在区域可以在控制面板中查看。

节点分布会随基础设施扩展持续增加。`,
          en: `Servers run in the data centers of several mainstream cloud providers, with primary nodes in **North America and Asia-Pacific**. The system automatically assigns the lowest-latency node based on your region and connection; your instance's current region is shown in the control panel.

Node coverage keeps growing as the infrastructure expands.`,
          ja: `サーバーは複数の主要クラウド事業者のデータセンターに展開しており、主なノードは**北米とアジア太平洋**にあります。地域と回線状況に応じて、レイテンシが最小のノードが自動的に割り当てられます。現在のインスタンスのリージョンはコントロールパネルで確認できます。

ノードの拠点は、インフラの拡張とともに増え続けます。`,
        },
      },
    ],
  },
  {
    id: 'agents-and-models',
    icon: 'bot',
    title: { en: 'Agents & models', zh: 'Agent、模型', ja: 'エージェントとモデル' },
    description: {
      en: 'Bring your own agent, switch models, and how they work.',
      zh: '自带 Agent、切换模型，以及如何工作。',
      ja: 'エージェントの持ち込みとモデルの切り替え、その仕組み。',
    },
    articles: [
      {
        id: 'bring-your-own-agent',
        question: { en: 'Can I bring my own agent?', zh: '可以带自己的 Agent 吗？', ja: '自分のエージェントを持ち込めますか？' },
        answer: {
          zh: `可以。Memoh 支持把 **Claude Code**、**Codex** 或其他兼容 **ACP**（Agent Client Protocol）的 Agent 部署到你的云电脑上，沿用你自己的订阅与配置。

不想自带也没问题 —— 直接使用 Memoh 内置 Agent 和平台提供的模型即可，用量按 credits 计费。两种方式可以随时切换。`,
          en: `Yes. Memoh can run **Claude Code**, **Codex**, or any agent compatible with the **ACP** (Agent Client Protocol) on your cloud computer, using your own subscription and configuration.

Prefer not to bring one? Use Memoh's built-in agent with platform-provided models, billed in credits. You can switch between the two at any time.`,
          ja: `はい。Memoh では **Claude Code**、**Codex**、あるいは **ACP**（Agent Client Protocol）互換のエージェントをあなたのクラウドコンピューター上で動かせます。契約や設定は自分のものをそのまま使えます。

持ち込まなくても大丈夫です。Memoh 内蔵のエージェントとプラットフォーム提供のモデルをそのまま使えます（利用量はクレジットで計算）。両者はいつでも切り替えられます。`,
        },
      },
      {
        id: 'switch-agents',
        question: { en: 'How do I switch agents in a session?', zh: '如何在会话中切换 Agent？', ja: 'セッションでエージェントを切り替えるには？' },
        answer: {
          zh: `新建会话时，点开输入框下方的 **Agent 菜单**，即可在 Memoh、Claude Code、Codex 等 Agent 之间切换。

不同 Agent 共用同一台云电脑和同一份工作区文件，所以换了 Agent，上下文和产出物都还在。`,
          en: `In a new session, open the **agent menu** under the composer to switch between Memoh, Claude Code, Codex and any other installed agent.

All agents share the same cloud computer and the same workspace files — switching agents never loses your context or artifacts.`,
          ja: `新しいセッションで、入力欄の下にある**エージェントメニュー**を開くと、Memoh、Claude Code、Codex などインストール済みのエージェントを切り替えられます。

どのエージェントも同じクラウドコンピューターと同じワークスペースのファイルを共有しているので、切り替えてもコンテキストや成果物は失われません。`,
        },
      },
    ],
  },
  {
    id: 'channels',
    icon: 'send',
    title: { en: 'Messaging channels', zh: '消息渠道', ja: 'メッセージチャンネル' },
    description: {
      en: 'Reach your agent from Telegram, Slack, WeChat, Feishu and more.',
      zh: '在 Telegram、Slack、微信、飞书等常用工具里找到你的 Agent。',
      ja: 'Telegram、Slack、WeChat、Lark など、いつものアプリからエージェントへ。',
    },
    articles: [
      {
        id: 'supported-channels',
        question: { en: 'Which chat channels does Memoh support?', zh: 'Memoh 支持哪些聊天渠道？', ja: 'どのチャットチャンネルに対応していますか？' },
        answer: {
          zh: `Memoh 内置网页与桌面端对话入口，并支持接入以下聊天平台：

- **社交与协作**：Telegram、Discord、Slack、LINE；
- **国内平台**：微信、微信公众号、企业微信、QQ、飞书、钉钉。

一个 Agent 可以同时接入多个渠道，对话与记忆完全同步。`,
          en: `Besides the built-in web and desktop chat, Memoh connects to the following platforms:

- **Social & collaboration**: Telegram, Discord, Slack, LINE.
- **China-based platforms**: WeChat, WeChat Official Account, WeCom, QQ, Feishu, DingTalk.

One agent can be connected to several channels at once, with conversations and memory fully in sync.`,
          ja: `Memoh には Web とデスクトップのチャットが組み込まれており、さらに次のプラットフォームと連携できます：

- **ソーシャル / コラボレーション**：Telegram、Discord、Slack、LINE。
- **中国系プラットフォーム**：WeChat、WeChat 公式アカウント、WeCom、QQ、Lark（飛書）、DingTalk。

1 つのエージェントを複数チャンネルに同時接続でき、会話と記憶は完全に同期します。`,
        },
      },
      {
        id: 'connect-telegram',
        question: { en: 'How do I connect Memoh to Telegram?', zh: '如何把 Memoh 接入 Telegram？', ja: 'Telegram と連携するには？' },
        answer: {
          zh: `在 Bot 设置中打开**平台 → Telegram**，按提示完成绑定，然后就可以在 Telegram 里直接和它对话了。

提醒事项、随手安排任务、问答查询都可以在聊天里完成 —— 比如"提醒我 6 点取快递"，到点它会来叫你。`,
          en: `In your Bot's settings, open **Platforms → Telegram** and follow the linking steps. From then on you can talk to it right inside Telegram.

Reminders, quick tasks and questions all work in chat — say "remind me to pick up the package at 6" and it will ping you on time.`,
          ja: `Bot の設定で**プラットフォーム → Telegram** を開き、案内に従って連携すれば、そのまま Telegram でエージェントと話せます。

リマインダー、ちょっとした依頼、質問 — すべてチャットで完結します。「18 時に荷物の受け取りをリマインドして」と言えば、時間どおりに知らせてくれます。`,
        },
      },
      {
        id: 'connect-discord',
        question: { en: 'How do I connect Memoh to Discord?', zh: '如何把 Memoh 接入 Discord？', ja: 'Discord と連携するには？' },
        answer: {
          zh: `在**平台 → Discord** 中完成授权，并把 Bot 邀请进你的服务器。

在频道里 **@ 它**即可对话，比如让它总结今天频道里聊了什么；私信也同样可用。`,
          en: `Authorize under **Platforms → Discord** and invite the Bot into your server.

**@mention** it in any channel to talk — for example, ask it to summarize what was discussed today. Direct messages work too.`,
          ja: `**プラットフォーム → Discord** で認可し、Bot をサーバーに招待してください。

チャンネルで **@メンション**すれば会話できます。「今日の議論を要約して」といった使い方も。DM にも対応しています。`,
        },
      },
      {
        id: 'connect-wechat',
        question: { en: 'How do I connect Memoh to WeChat?', zh: '如何把 Memoh 接入微信？', ja: 'WeChat と連携するには？' },
        answer: {
          zh: `在 Bot 设置中打开**平台 → 微信**，选择扫码登录：页面会生成一个二维码，用微信扫码并确认后即完成绑定，之后直接在微信里和你的 Agent 聊天即可。二维码过期了点击"刷新"重新生成。

微信生态还有两种企业向的接入方式，作为独立渠道分别配置：

- **微信公众号**：填入公众平台的 AppID、AppSecret 与服务器配置 Token；
- **企业微信**：填入智能机器人的 BotID 与 Secret。`,
          en: `In your Bot's settings, open **Platforms → WeChat** and choose QR login: a QR code appears, and scanning plus confirming it in WeChat completes the binding — from then on, just chat with your agent inside WeChat. If the code expires, hit "Refresh" to generate a new one.

The WeChat ecosystem also offers two business-oriented options, configured as separate channels:

- **WeChat Official Account**: fill in the AppID, AppSecret and server-config Token from the Official Account platform.
- **WeCom**: fill in the smart bot's BotID and Secret.`,
          ja: `Bot の設定で**プラットフォーム → WeChat** を開き、QR コードログインを選びます。表示された QR コードを WeChat でスキャンして確認すれば連携完了。あとは WeChat の中でエージェントと話すだけです。コードの期限が切れたら「更新」で再生成できます。

WeChat エコシステムには、ビジネス向けの連携方法も 2 つあり、別チャンネルとして設定します：

- **WeChat 公式アカウント**：公式アカウントプラットフォームの AppID・AppSecret・サーバー設定 Token を入力。
- **WeCom**：スマートボットの BotID と Secret を入力。`,
        },
      },
      {
        id: 'connect-feishu',
        question: { en: 'How do I connect Memoh to Feishu (Lark)?', zh: '如何把 Memoh 接入飞书？', ja: 'Lark（飛書）と連携するには？' },
        answer: {
          zh: `1. 在[飞书开放平台](https://open.feishu.cn)创建企业自建应用，开启机器人能力；
2. 把应用的 **App ID** 和 **App Secret** 填入 Memoh 的**平台 → 飞书**；
3. 默认通过**长连接（WebSocket）**接收消息，无需公网回调地址，保存后在飞书里单聊或群里 @ 它即可。

使用国际版 Lark 时把区域切换为 **Lark**；如需改用 Webhook 回调模式，再补充 Encrypt Key 与 Verification Token。`,
          en: `1. Create a custom app on the [Feishu open platform](https://open.feishu.cn) and enable its bot capability.
2. Fill the app's **App ID** and **App Secret** into Memoh under **Platforms → Feishu**.
3. Messages arrive over a **WebSocket long connection** by default — no public callback URL needed. Save, then DM it or @mention it in any Feishu group.

Using international Lark? Switch the region to **Lark**. To use webhook mode instead, also provide the Encrypt Key and Verification Token.`,
          ja: `1. [飛書オープンプラットフォーム](https://open.feishu.cn)でカスタムアプリを作成し、ボット機能を有効にします。
2. アプリの **App ID** と **App Secret** を Memoh の**プラットフォーム → 飛書**に入力します。
3. メッセージはデフォルトで **WebSocket 長時間接続**で受信され、公開コールバック URL は不要です。保存すれば、DM やグループの @メンションで会話できます。

国際版 Lark を使う場合はリージョンを **Lark** に切り替えてください。Webhook モードにする場合は Encrypt Key と Verification Token も設定します。`,
        },
      },
      {
        id: 'connect-dingtalk',
        question: { en: 'How do I connect Memoh to DingTalk?', zh: '如何把 Memoh 接入钉钉？', ja: 'DingTalk と連携するには？' },
        answer: {
          zh: `1. 在[钉钉开放平台](https://open.dingtalk.com)创建企业内部应用，添加机器人能力；
2. 把应用的 **AppKey** 和 **AppSecret** 填入 Memoh 的**平台 → 钉钉**；
3. Memoh 通过钉钉的 **Stream 模式**接收消息，无需配置公网回调地址，保存后在钉钉里单聊或群里 @ 它即可对话。`,
          en: `1. Create an internal app on the [DingTalk open platform](https://open.dingtalk.com) and add the bot capability.
2. Fill the app's **AppKey** and **AppSecret** into Memoh under **Platforms → DingTalk**.
3. Memoh receives messages via DingTalk **Stream mode** — no public callback URL to configure. Save, then chat with it directly or @mention it in a group.`,
          ja: `1. [DingTalk オープンプラットフォーム](https://open.dingtalk.com)で社内アプリを作成し、ボット機能を追加します。
2. アプリの **AppKey** と **AppSecret** を Memoh の**プラットフォーム → DingTalk** に入力します。
3. Memoh は DingTalk の **Stream モード**でメッセージを受信するため、公開コールバック URL の設定は不要です。保存すれば、1 対 1 でもグループの @メンションでも会話できます。`,
        },
      },
      {
        id: 'connect-slack',
        question: { en: 'How do I connect Memoh to Slack?', zh: '如何把 Memoh 接入 Slack？', ja: 'Slack と連携するには？' },
        answer: {
          zh: `1. 在 [api.slack.com/apps](https://api.slack.com/apps) 创建应用，开启 **Socket Mode** 并生成 App-Level Token（\`xapp-\` 开头）；
2. 在 OAuth & Permissions 中把应用安装到工作区，获取 **Bot Token**（\`xoxb-\` 开头）；
3. 把两个 Token 填入 Memoh 的**平台 → Slack**，保存后把 Bot 拉进频道，@ 它即可对话。

Socket Mode 下同样无需公网回调地址。`,
          en: `1. Create an app at [api.slack.com/apps](https://api.slack.com/apps), enable **Socket Mode** and generate an App-Level Token (starts with \`xapp-\`).
2. Install the app to your workspace under OAuth & Permissions and grab the **Bot Token** (starts with \`xoxb-\`).
3. Fill both tokens into Memoh under **Platforms → Slack**, save, invite the Bot to a channel and @mention it.

Socket Mode means no public callback URL here either.`,
          ja: `1. [api.slack.com/apps](https://api.slack.com/apps) でアプリを作成し、**Socket Mode** を有効にして App-Level Token（\`xapp-\` で始まる）を発行します。
2. OAuth & Permissions からワークスペースにインストールし、**Bot Token**（\`xoxb-\` で始まる）を取得します。
3. 2 つの Token を Memoh の**プラットフォーム → Slack** に入力して保存し、Bot をチャンネルに招待して @メンションすれば会話できます。

Socket Mode なので、ここでも公開コールバック URL は不要です。`,
        },
      },
      {
        id: 'connect-other-channels',
        question: {
          en: 'How do I connect QQ or LINE?',
          zh: 'QQ、LINE 如何接入？',
          ja: 'QQ や LINE と連携するには？',
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
          ja: `これらのチャンネルも Bot の**プラットフォーム**タブから追加し、各プラットフォームの資格情報を入力するだけです：

- **QQ**：QQ オープンプラットフォームのボットの AppID と ClientSecret。
- **LINE**：LINE Developers の Channel Secret と Channel Access Token。案内に従って Webhook URL も設定します。

各チャンネルは個別に有効化・無効化でき、互いに影響しません。`,
        },
      },
      {
        id: 'cross-channel-sync',
        question: { en: 'Do conversations sync across channels?', zh: '多个渠道的对话会同步吗？', ja: '会話はチャンネル間で同期されますか？' },
        answer: {
          zh: `会。渠道只是"入口"，背后是同一个 Agent、同一台云电脑、同一份记忆。

你在 Telegram 里吩咐的事，回到桌面端可以直接查看进度、继续讨论；反过来也一样。不需要在渠道之间复述任何上下文。`,
          en: `Yes. Channels are just doors — behind them is the same agent, the same cloud computer and the same memory.

Ask for something on Telegram, then open the desktop app to check progress and keep the discussion going — and vice versa. No context ever needs repeating between channels.`,
          ja: `はい。チャンネルは「入口」にすぎず、その先にいるのは同じエージェント、同じクラウドコンピューター、同じ記憶です。

Telegram で頼んだことは、デスクトップアプリを開けばそのまま進捗を確認して続きを話せます。逆も同じです。チャンネルをまたいで文脈を説明し直す必要はありません。`,
        },
      },
    ],
  },
  {
    id: 'tasks-and-proactive',
    icon: 'clock',
    title: { en: 'Scheduled tasks & proactive messages', zh: '定时任务与主动消息', ja: 'スケジュールタスクとプロアクティブ通知' },
    description: {
      en: 'Let your agent run on its own and reach out when it matters.',
      zh: '让 Agent 自己跑起来，有事主动来找你。',
      ja: 'エージェントが自律的に動き、必要なときに連絡してくれます。',
    },
    articles: [
      {
        id: 'create-scheduled-task',
        question: { en: 'How do I create a scheduled task?', zh: '如何创建定时任务？', ja: 'スケジュールタスクを作るには？' },
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
          ja: `普通の言葉で頼むだけです。たとえば：

- 「毎朝 9 時にブリーフィングを送って」
- 「平日はこのリポジトリのリリースを見張って」
- 「毎晩、受信トレイを整理して」

エージェントがスケジュールを設定してくれます。Bot の**スケジュールタスク**タブで、すべてのタスクの確認と編集もできます。`,
        },
      },
      {
        id: 'run-while-offline',
        question: { en: "Do tasks run while I'm offline?", zh: '我不在线时任务也会运行吗？', ja: 'オフラインでもタスクは動きますか？' },
        answer: {
          zh: `会。任务在 Agent 的云电脑上执行，与你的设备无关 —— 你的电脑关了，它没关。

运行结果会通过你选定的渠道（桌面通知、Telegram 等）发给你，回来时也可以在会话里翻看每次运行的记录。`,
          en: `Yes. Tasks execute on the agent's cloud computer, independent of your devices — your laptop being off doesn't stop anything.

Results are delivered through the channel you choose (desktop notifications, Telegram, …), and every run's record is there in the session when you come back.`,
          ja: `はい。タスクはエージェントのクラウドコンピューター上で実行され、あなたのデバイスとは無関係です。PC を閉じても止まりません。

結果は選んだチャンネル（デスクトップ通知、Telegram など）に届き、戻ってきたときにはセッションで各実行の記録を確認できます。`,
        },
      },
      {
        id: 'multitask',
        question: { en: 'Can it run multiple tasks at once?', zh: '可以同时跑多个任务吗？', ja: '複数のタスクを同時に実行できますか？' },
        answer: {
          zh: `可以。任务在云端**异步执行**：吩咐完就可以关掉页面去忙别的，跑完或需要你拍板时，Agent 会通过你选定的渠道来找你。

多个任务可以并行推进；需要更强隔离时，可以为不同职责创建不同的 Bot —— 各自拥有独立的云电脑与工作区。`,
          en: `Yes. Tasks run **asynchronously** in the cloud: hand one over, close the page, and the agent reaches you through your chosen channel when it finishes or needs a decision.

Multiple tasks move in parallel, and for stronger isolation you can create separate Bots for separate jobs — each with its own cloud computer and workspace.`,
          ja: `できます。タスクはクラウドで**非同期に**実行されます。頼んだらページを閉じて構いません。完了したときや判断が必要なときに、エージェントが選んだチャンネルで連絡してくれます。

複数のタスクは並行して進みます。より強い分離が必要なら、役割ごとに Bot を分けてください。それぞれが専用のクラウドコンピューターとワークスペースを持ちます。`,
        },
      },
      {
        id: 'manage-tasks',
        question: { en: 'How do I pause, edit or delete a scheduled task?', zh: '如何暂停、修改或删除定时任务？', ja: 'スケジュールタスクの一時停止・編集・削除は？' },
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
          ja: `いちばん早いのは、エージェントに直接伝えることです：

- 「朝のブリーフィングを 8 時半にして」
- 「リポジトリ監視はいったん止めて」
- 「受信トレイ整理のタスクを消して」

Bot の**スケジュールタスク**タブから手動でオン・オフ、編集、削除もできます。`,
        },
      },
      {
        id: 'proactive-messages',
        question: { en: 'Will the agent message me proactively?', zh: 'Agent 会主动给我发消息吗？', ja: 'エージェントから連絡してくれますか？' },
        answer: {
          zh: `会 —— 这正是 Memoh 的核心能力之一。你盯的版本发布了、日程即将开始、任务失败需要你拍板时，Agent 会先发消息给你，而不是等你想起来去问。

嫌吵的话，直接告诉它少发点、或只在某个渠道找你即可；背后的定时任务也可以随时暂停。`,
          en: `Yes — it's one of Memoh's core abilities. When a release you're watching ships, a meeting is about to start, or a task fails and needs your call, the agent messages you first instead of waiting to be asked.

If it gets chatty, just tell it to reach out less or stick to one channel — and any schedule behind it can be paused at any time.`,
          ja: `はい。これこそ Memoh の中核機能のひとつです。ウォッチ中のリリースが出た、予定が始まる、タスクが失敗して判断が要る — そんなとき、こちらから聞く前にエージェントがメッセージをくれます。

頻度が多いと感じたら、控えめにするよう伝えるか、特定のチャンネルだけに絞ってください。背後のスケジュールもいつでも一時停止できます。`,
        },
      },
    ],
  },
  {
    id: 'billing',
    icon: 'creditCard',
    title: { en: 'Plans, credits & billing', zh: '订阅与计费', ja: 'プラン・クレジット・支払い' },
    description: {
      en: 'Plans, what credits are, and managing your subscription.',
      zh: '订阅计划、credits 与账单管理。',
      ja: 'プランとクレジットの仕組み、サブスクリプションの管理。',
    },
    articles: [
      {
        id: 'plans-overview',
        question: { en: 'What plans does Memoh offer?', zh: 'Memoh 有哪些订阅计划？', ja: 'どんなプランがありますか？' },
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
          ja: `Memoh には 3 つのプランがあります：

- **Go**：日常の会話や軽いタスクから。
- **Pro**：毎日の仕事と、動かし続けるエージェントのために。
- **Premium**：重いワークロード向けに、より多くの計算資源と容量を。

どのサブスクリプションにも**トークン枠（クレジット）**と**クラウドコンピューターのリソース**が含まれます。プランごとに CPU コア数・メモリ・ストレージ・毎月のクレジットが異なります。最新の仕様と価格は[料金ページ](/#pricing)へ。`,
        },
      },
      {
        id: 'why-affordable',
        question: {
          en: 'Why is it so affordable — and is that sustainable?',
          zh: '为什么价格能做到这么低？可持续吗？',
          ja: 'なぜこんなに安いのですか？持続可能ですか？',
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
          ja: `低価格は補助金ではなく、アーキテクチャによるものです：

- **リソースプールと弾力的なスケジューリング** — サーバー容量をユーザー間・時間帯間で使い回し、遊休の無駄を最小化します。
- **自社データセンターと自動化された運用** — 限界コストを低く保ちます。
- **持続可能なエントリープラン** — Go は綿密なスケジューリングで成立し、上位プランが健全な利益構造を支えます。

安い＝低品質ではありません。安定性とデータの安全は常に最優先で、エントリー価格は長期的なポジションです。短期的な補助金プレイではありません。`,
        },
      },
      {
        id: 'what-are-credits',
        question: { en: 'What are credits?', zh: '什么是 credits？', ja: 'クレジットとは？' },
        answer: {
          zh: `credits 是使用 **Memoh 提供的模型**时消耗的 Token 额度，按订阅计划每月发放、每月刷新。

如果你自带 Agent 订阅（如 Claude Code、Codex），模型调用走你自己的账号，**不消耗 credits**；云电脑的 CPU、内存等算力则始终由计划规格决定。

实际消耗按所用模型的价格折算，可以在账单页查看明细。`,
          en: `Credits are the token allowance consumed when you use **models provided by Memoh**. They're granted monthly with your plan and refresh every cycle.

If you bring your own agent subscription (Claude Code, Codex, …), model calls go through your own account and **don't consume credits**. The cloud computer's CPU and memory always come from your plan's specs.

Actual consumption is converted at each model's pricing — see your billing page for the details.`,
          ja: `クレジットは **Memoh が提供するモデル**を使うときに消費されるトークン枠で、プランに応じて毎月付与・更新されます。

Claude Code や Codex など自分のエージェント契約を持ち込む場合、モデル呼び出しは自分のアカウント経由となり、**クレジットは消費されません**。クラウドコンピューターの CPU・メモリは常にプランの仕様に従います。

実際の消費は各モデルの価格に応じて換算され、明細は請求ページで確認できます。`,
        },
      },
      {
        id: 'out-of-credits',
        question: { en: 'What happens when I run out of credits?', zh: 'credits 用完了怎么办？', ja: 'クレジットを使い切ったら？' },
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
          ja: `月のクレジットを使い切ると、Memoh 提供モデルへの新しいリクエストは一時停止します。ただし、クラウドコンピューター・ファイル・記憶・設定済みタスクはすべてそのまま残ります。

選択肢は：

- 次の請求サイクルの自動更新を待つ。
- クレジットを追加チャージする。
- 上位プランにアップグレードする。
- 持ち込みエージェント（クレジット消費なし）に切り替えて使い続ける。`,
        },
      },
      {
        id: 'top-up-credits',
        question: { en: 'How do I top up extra credits?', zh: '如何充值 credits 余额？', ja: 'クレジットを追加チャージするには？' },
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
          ja: `プラン付与の月間枠とは別に、クレジットを単体でチャージできます：

1. **設定 → 請求**を開き、**クレジットをチャージ**を選びます。
2. 金額を選び、Stripe で支払います（サブスクリプションと同じ支払い方法）。
3. チャージは即時反映され、プランの枠を使い切ると自動的に消費されます。

有効期限と消費順序は請求ページの表示に従います。`,
        },
      },
      {
        id: 'change-plan',
        question: { en: 'How do I upgrade, downgrade or cancel?', zh: '如何升级、降级或取消订阅？', ja: 'アップグレード・ダウングレード・解約するには？' },
        answer: {
          zh: `在 **设置 → 订阅** 中随时更换或取消计划：

- **升级**立即生效，按剩余周期折算差价；
- **降级与取消**在当前计费周期结束时生效，期间服务不受影响。

取消后你的数据会按[隐私政策](/legal/privacy)中的保留策略处理。`,
          en: `Change or cancel your plan any time under **Settings → Subscription**:

- **Upgrades** take effect immediately, prorated for the rest of the cycle.
- **Downgrades and cancellations** apply at the end of the current billing cycle, with service unaffected until then.

After cancellation, your data is handled per the retention terms in the [privacy policy](/legal/privacy).`,
          ja: `**設定 → サブスクリプション**からいつでも変更・解約できます：

- **アップグレード**は即時反映され、残り期間は日割りで差額精算されます。
- **ダウングレードと解約**は現在の請求サイクル終了時に適用され、それまでサービスは変わりません。

解約後のデータは[プライバシーポリシー](/legal/privacy)の保持条件に従って扱われます。`,
        },
      },
      {
        id: 'payment-methods',
        question: { en: 'How do payment and renewal work?', zh: '支持哪些支付方式？怎么续费？', ja: '支払い方法と更新は？' },
        answer: {
          zh: `- **支付方式**：订阅通过 **Stripe** 支付，支持主流信用卡与借记卡，包括但不限于万事达（Mastercard）、Visa、银联（UnionPay），具体支持范围以 Stripe 为准；暂不支持加密货币支付；
- **续费**：订阅按计费周期**自动扣款**；可随时在 **设置 → 订阅** 中取消，取消于当期结束时生效；
- **年付**：年付方案正在准备中，近期推出，目前先提供月付。`,
          en: `- **Payment**: subscriptions are billed through **Stripe**, covering major credit and debit cards — including but not limited to Mastercard, Visa and UnionPay, with the exact list determined by Stripe; cryptocurrency payments are not supported yet.
- **Renewal**: plans renew by **automatic charge** each billing cycle; cancel any time under **Settings → Subscription** and it takes effect at the end of the current period.
- **Annual plans**: in the works and coming soon — monthly billing is what's offered today.`,
          ja: `- **支払い**：サブスクリプションは **Stripe** で決済され、Mastercard・Visa・銀聯（UnionPay）をはじめとする主要なクレジットカード・デビットカードに対応します。対応カードの詳細は Stripe に準じます。暗号資産による支払いは未対応です。
- **更新**：請求サイクルごとに**自動課金**されます。**設定 → サブスクリプション**からいつでも解約でき、現在の期間終了時に反映されます。
- **年額プラン**：準備中です。現在は月額のみ提供しています。`,
        },
      },
      {
        id: 'invoices',
        question: { en: 'How do I get invoices or receipts?', zh: '如何获取发票或收据？', ja: '請求書や領収書はどこで入手できますか？' },
        answer: {
          zh: `在 **设置 → 账单** 中可以查看和下载每期收据。

如需企业发票、合并结算或其他商务合作，请联系 [support@memoh.net](mailto:support@memoh.net)。`,
          en: `View and download receipts for every billing period under **Settings → Billing**.

For corporate invoicing, consolidated billing or other business needs, contact [support@memoh.net](mailto:support@memoh.net).`,
          ja: `**設定 → 請求**で各請求期間の領収書を確認・ダウンロードできます。

法人請求書やまとめ払いなどビジネス上のご要望は [support@memoh.net](mailto:support@memoh.net) までご連絡ください。`,
        },
      },
    ],
  },
  {
    id: 'desktop-app',
    icon: 'laptop',
    title: { en: 'Desktop app', zh: '桌面版', ja: 'デスクトップアプリ' },
    description: {
      en: 'Download, updates and system requirements.',
      zh: '下载安装、更新与系统要求。',
      ja: 'ダウンロード、アップデート、システム要件。',
    },
    articles: [
      {
        id: 'download-install',
        question: { en: 'How do I download and install the desktop app?', zh: '如何下载安装桌面版？', ja: 'デスクトップアプリのダウンロードとインストールは？' },
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
          ja: `[ダウンロードページ](/download)で、お使いのシステムに合ったビルドを選んでください：

- **macOS**：Apple Silicon または Intel（.dmg）。
- **Windows**：x64 インストーラー。
- **Linux**：.deb、AppImage、.rpm。

ページがデバイスを自動判別し、適切なビルドをおすすめします。`,
        },
      },
      {
        id: 'desktop-vs-web',
        question: { en: "What's the difference between desktop and web?", zh: '桌面版和网页版有什么区别？', ja: 'デスクトップ版と Web 版の違いは？' },
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
          ja: `主要機能は同じです。デスクトップアプリには次が加わります：

- システム通知とグローバルショートカット。
- ログイン時の自動起動。エージェントからの連絡をすぐ受け取れます。
- **このコンピューター**：いま使っているマシンをエージェントに共有し、許可した範囲でローカルのファイル操作やコマンド実行を任せられます。エージェント本体はクラウドで動き続けます。

ライトな利用なら Web 版で十分。毎日使うならデスクトップ版がおすすめです。`,
        },
      },
      {
        id: 'auto-update',
        question: { en: 'How does the desktop app update?', zh: '桌面版如何更新？', ja: 'デスクトップアプリはどう更新されますか？' },
        answer: {
          zh: `桌面版会自动检查并在后台下载更新，重启应用即完成升级；也可以随时在[下载页](/download)手动获取最新版本。

当前版本号可以在应用的"关于 Memoh"中查看。`,
          en: `The desktop app checks for updates and downloads them in the background; restart the app to finish upgrading. You can also grab the latest build manually from the [download page](/download) any time.

Your current version is shown under "About Memoh" in the app.`,
          ja: `デスクトップアプリは更新を自動チェックしてバックグラウンドでダウンロードし、アプリを再起動すれば適用されます。[ダウンロードページ](/download)から手動で最新版を取得することもできます。

現在のバージョンはアプリの「Memoh について」で確認できます。`,
        },
      },
      {
        id: 'system-requirements',
        question: { en: 'What are the system requirements?', zh: '桌面版的系统要求是什么？', ja: 'システム要件は？' },
        answer: {
          zh: `- **macOS** 12 及以上（Apple Silicon 与 Intel）；
- **Windows** 10 及以上（x64）；
- **主流 Linux 发行版**：Debian/Ubuntu 用 .deb，Fedora 用 .rpm，其他发行版可用 AppImage。

Agent 本体运行在云端，桌面应用本身很轻，对本机配置几乎没有要求；只有开启"这台电脑"共享时，Agent 才会在你授权的范围内使用本机资源。`,
          en: `- **macOS** 12 or later (Apple Silicon & Intel).
- **Windows** 10 or later (x64).
- **Mainstream Linux distros**: .deb for Debian/Ubuntu, .rpm for Fedora, AppImage for everything else.

Agents run in the cloud and the desktop app itself is lightweight, so hardware requirements are minimal; local resources are only used when you enable "This computer" sharing, within the access you grant.`,
          ja: `- **macOS** 12 以降（Apple Silicon / Intel）。
- **Windows** 10 以降（x64）。
- **主要な Linux ディストリビューション**：Debian/Ubuntu は .deb、Fedora は .rpm、その他は AppImage。

エージェントはクラウドで動くため、デスクトップアプリ自体は軽量で、ハードウェア要件はごくわずかです。ローカルのリソースを使うのは「このコンピューター」共有を有効にしたときだけで、それも許可した範囲に限られます。`,
        },
      },
    ],
  },
  {
    id: 'privacy-security',
    icon: 'shield',
    title: { en: 'Privacy & security', zh: '隐私与安全', ja: 'プライバシーとセキュリティ' },
    description: {
      en: 'Data storage, isolation, authorization and deletion.',
      zh: '数据存储、隔离、授权与删除。',
      ja: 'データの保管、分離、認可、削除。',
    },
    articles: [
      {
        id: 'where-is-data',
        question: { en: 'Where is my data stored?', zh: '我的数据存储在哪里？', ja: 'データはどこに保存されますか？' },
        answer: {
          zh: `你的会话、记忆与工作区文件存储在 Memoh 的云端基础设施中，按 Bot 隔离。

详细的数据处理方式请阅读[隐私政策](/legal/privacy)与[数据跨境传输条款](/legal/cross-border)。`,
          en: `Your sessions, memory and workspace files are stored on Memoh's cloud infrastructure, isolated per Bot.

For the details of how data is handled, read the [privacy policy](/legal/privacy) and the [cross-border data transfer terms](/legal/cross-border).`,
          ja: `セッション、記憶、ワークスペースのファイルは Memoh のクラウドインフラに保存され、Bot ごとに分離されています。

データの取り扱いの詳細は[プライバシーポリシー](/legal/privacy)と[国外データ移転条項](/legal/cross-border)をご覧ください。`,
        },
      },
      {
        id: 'isolation',
        question: { en: "Are agents' cloud computers isolated?", zh: 'Agent 的云电脑是隔离的吗？', ja: 'クラウドコンピューターは分離されていますか？' },
        answer: {
          zh: `是。每个 Bot 运行在独立的隔离环境中，文件系统与网络彼此不可见 —— 你的 Bot 之间也互相隔离。

Agent 只能操作属于它自己的那台云电脑，接触不到平台上其他用户或其他 Bot 的任何数据。`,
          en: `Yes. Every Bot runs in its own isolated environment — file systems and networks are invisible to each other, including between your own Bots.

An agent can only operate its own cloud computer; it has no access to any other user's or Bot's data on the platform.`,
          ja: `はい。各 Bot は独立した隔離環境で動作し、ファイルシステムもネットワークも互いに見えません。自分の Bot 同士でも分離されています。

エージェントが操作できるのは自分のクラウドコンピューターだけで、プラットフォーム上の他のユーザーや他の Bot のデータには一切アクセスできません。`,
        },
      },
      {
        id: 'prohibited-uses',
        question: { en: 'What uses are prohibited?', zh: '云电脑有哪些禁止用途？', ja: '禁止されている用途は？' },
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
          ja: `クラウドコンピューターは法令を守って利用してください。次の行為は明確に禁止されています：

- プロキシ / VPN などのトンネリングサービスの運用。
- 長期的な公開サービスのホスティング（例：公開 Minecraft サーバー）。
- スパム、暗号資産のマイニング、その他の違法・不正な利用。

プラットフォームは異常なトラフィックとリソース使用を常時監視しています。違反が確認された場合、程度に応じて機能制限・停止・解約となり、返金は行われません。詳しくは[利用規約](/legal/terms)へ。`,
        },
      },
      {
        id: 'connector-security',
        question: { en: 'Is Connector authorization safe?', zh: 'Connector 授权安全吗？', ja: 'Connector の認可は安全ですか？' },
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
          ja: `Connector は各サービスの公式な認可フロー（OAuth など）を使います：

- **サービスごとに個別に**認可し、まとめて権限を要求することはありません。
- 作業に必要な最小限のスコープのみを要求します。
- 資格情報は暗号化して保存され、**マーケットプレイスからいつでも取り消せます**。

取り消すと、エージェントは即座にそのサービスへアクセスできなくなります。`,
        },
      },
      {
        id: 'delete-data',
        question: { en: 'How do I delete my data or account?', zh: '如何删除我的数据或账户？', ja: 'データやアカウントを削除するには？' },
        answer: {
          zh: `- **删除某个 Bot**：会同时销毁它的云电脑、文件与记忆；
- **删除账户**：在 **设置 → 账户** 中发起，或联系 [support@memoh.net](mailto:support@memoh.net)。

数据保留与删除的具体时限见[隐私政策](/legal/privacy)。`,
          en: `- **Deleting a Bot** destroys its cloud computer, files and memory together.
- **Deleting your account** can be initiated under **Settings → Account**, or by contacting [support@memoh.net](mailto:support@memoh.net).

Exact retention and deletion timelines are described in the [privacy policy](/legal/privacy).`,
          ja: `- **Bot の削除**：そのクラウドコンピューター・ファイル・記憶が一緒に破棄されます。
- **アカウントの削除**：**設定 → アカウント**から手続きするか、[support@memoh.net](mailto:support@memoh.net) までご連絡ください。

保持と削除の具体的な期限は[プライバシーポリシー](/legal/privacy)に記載しています。`,
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
