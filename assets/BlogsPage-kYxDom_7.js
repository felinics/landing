import{$ as e,A as t,C as n,Dt as r,O as i,S as a,T as o,U as s,V as c,Z as l,f as u,k as d,lt as f,m as p,n as m,rt as h,t as ee,v as g,w as _,x as v}from"./vue.D51lypTh-DtYUoyHW.js";import{t as y}from"./arrow-left-NfPOfKeN.js";import{t as b}from"./arrow-right-Byb6ZyNj.js";import{t as x}from"./calendar-days-Cv8yJbXR.js";import{c as te,i as S,l as ne,s as C,t as w}from"./index-lzxpZHN3.js";var T=u(`clock-3`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6h4`,key:`135r8i`}]]),E=u(`file-text`,[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]),D=u(`user-round`,[[`circle`,{cx:`12`,cy:`8`,r:`5`,key:`1hypcn`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`,key:`rfgkzh`}]]),O=Object.assign({"../content/blogs/en/2026-02-16.md":`---
title: Introduction to Memoh - The Case for an Always-On, Containerized Home Agent
author: Team Memoh
---

# Introduction to Memoh - The Case for an Always-On, Containerized Home Agent

## Overview

We enter 2026 with a familiar tension: models get smarter every quarter, but the “agent experience” still breaks on context, latency, privacy, and real-world workflows. Over the past year, we kept circling three questions:
- Where does the capability boundary of agents actually sit?
- What’s the real value of long context?
- What hardware form factor makes “always-on, personal AI” feel natural?

Memoh is our attempt to turn those questions into something buildable—not a manifesto, but a system that can survive contact with reality.

## Story Time

Time travels fast. Somewhere between “I’ll remember this” and “wait, why did we decide that?”, a year disappears.

That’s the annoying part of building: most progress doesn’t feel like progress while it’s happening. It’s just a stream of small choices, half-finished threads, late-night fixes, and the occasional moment that actually clicks. The kind of moment where you sit back and think: okay—this is real.

Around the same time, I noticed something else: the internet started to feel smoother—and worse.

Text got cleaner, longer, more polite, more… empty. You could smell when something was generated: low information density, too many metaphors, too much agreement, not enough stakes.

I caught myself doing it too.

So I started forcing a constraint: say it plainly. Keep the density. Don’t inflate. Don’t hide behind style. If something mattered, anchor it to a real moment, a real trade-off, a real cost paid.

Because the thing LLMs can’t give you is not “intelligence.” It’s weight. The feeling that a human actually stood somewhere in time and wrote from that position.

That’s when I realized what I wanted wasn’t “an AI that can talk.” I wanted an AI that can live with you—quietly, continuously, accumulating context without turning your life into content sludge.

Phones were our first instinct—it's personal, powerful, always there. But mobile OS is closed: without OEM privileges you can build an app, not ambient infrastructure.

So we looked for the always-on node every home already has: the router (conceptually). Then the economics clash—router-class hardware can’t carry memory, RAG, tools, and multi-user agents. The device evolves: more RAM/storage, a screen, mic/speaker, tiny battery for take out, portable form.

Eventually it stops being a router. It becomes a new category: a home agent base layer.

## What

Memoh is a containerized home/studio AI base layer: cloud-grade model capability paired with local-first memory (knowledge base, RAG/search, conversation history) that stays under your control.

## Why

Long-context models raise the ceiling for agents—but they also make “fully local” expensive and “fully cloud” uncomfortable. People don’t want to re-brief AI every day, and they don’t want their durable context trapped in someone else’s feed. Containerization makes Memoh portable, reproducible, and safe to run as always-on infrastructure—so continuity becomes cheap, private, and dependable.

## How

We run Memoh as a containerized stack: isolated services for storage (files/DB/vector index), retrieval, tool/runtime execution, and the control plane. Inference calls cloud APIs when you need frontier capability; durable memory and indexing stay local. The device acts as an always-on node (router-like, not a router) serving multiple users with strict boundaries: sharing is explicit, private context remains private, and everything is deployable/upgradable as versioned containers.

## Features

- **Multi-bot Management**: Create multiple bots; humans and bots, or bots with each other, can chat privately, in groups, or collaborate.

  ![Multi-bot Management](/blogs/2026-02-16/01-multi-bots.png)

- **Containerized**: Each bot runs in its own isolated container. Bots can freely execute commands, edit files, and access the network within their containers—like having their own computer.

  ![Containerized](/blogs/2026-02-16/02-containerized.png)

- **Memory Engineering**: Every chat is stored in the database, with the last 24 hours of context loaded by default. Each conversation turn is stored as memory and can be retrieved by bots through semantic search.

  ![Memory Engineering](/blogs/2026-02-16/03-memory-engineering.png)

- **Various Platforms**: Supports Telegram, Lark (Feishu), and more.
- **Simple and Easy to Use**: Configure bots and settings for Provider, Model, Memory, Channel, MCP, and Skills through a graphical interface—no coding required to set up your own AI bot.
- **Scheduled Tasks**: Schedule tasks with cron expressions to run commands at specified times.
- More...

## Compare to OpenClaw

We share a core belief: both Memoh and OpenClaw treat the agent as more than a chatbox—we give the LLM a playground: a real environment where it can remember, use tools, and iterate.

Where Memoh differs:

- Lighter and Faster: built as home/studio infrastructure, can be held in the edge device
- **Containerized by default**: each bot gets an isolated container (files/commands/network/jobs)
- **Hybrid split**: cloud inference, local-first memory + indexing
- **Multi-user first**: explicit sharing and privacy boundaries, support a2a (Agent2Agent)
- **Sustainable**: have an experienced team and confidence to push forward and build it

## Conclusion

Memoh is built for one thing: always-on continuity—an AI that stays online, and a memory that stays yours.

We keep frontier inference in the cloud, keep durable context local, and run everything as a containerized, always-on stack. If you want an agent that feels less like an app and more like home infrastructure, that’s the bet Memoh is making.

Furthermore, we will continue to operate and permanently open-source Memoh, making it a product with long impact.`,"../content/blogs/en/2026-09-15.md":`---
title: Introducing Memoh: A Cloud Computer for Every Agent
author: Team Memoh
---

# Introducing Memoh: A Cloud Computer for Every Agent

Introducing Memoh — a cloud computer for your agent. Every agent gets its own desktop, files, browser, network, and long-term memory, running 24/7. Your laptop closes. It doesn't.

Models are already smart enough. What they lack is a place to work.

An agent in a chat window can think, then it stops. Close the tab and the context is gone. Close the laptop and the bot goes to sleep with it. If you wanted it on duty, to remember last week's files, to open a real page and click through it, the usual path was renting a server, configuring an OS, managing keys, and writing scripts. That work stayed locked behind people who already knew how to run infrastructure.

Memoh gives the computer to the agent. It is open source. You can self-host it, or use the hosted service.

## Why an agent needs a cloud computer

A cloud computer gives you two things a laptop can't.

**It never turns off.** Laptops sleep, drop Wi-Fi, and shut their lids. A cloud computer doesn't. While you're on a plane, asleep, or away for the weekend, the bot on Telegram, Lark, or Discord keeps answering. Scheduled jobs still run. When something needs a decision, it reaches out first.

**Files, tools, and memory stay put.** Ordinary chat starts from a blank slate every time. It can't see what you did yesterday. A Memoh workspace behaves more like your own machine: files you wrote are still there, runtimes you installed stay installed, and long-term memory carries across sessions and channels. What you set up on Monday is still there on Friday.

Together, those two things change the kind of work you can give an agent. You stop running one-off tasks and start keeping an always-on coworker.

It also differs from a throwaway sandbox: the workspace has a graphical desktop, so you can watch the agent work and take over when it stalls; and you can put ACP agents you already use — Claude Code, Codex, Hermes — on the same cloud computer.

![Each bot has an isolated container workspace: filesystem, processes, network, and resources live on its own computer](/blogs/2026-09-15/02-computer.png)

_The workspace is the agent's computer. Files, commands, desktop, and network all follow that bot._

## When to use this computer

Memoh is not a single shape. Desktop, self-hosting, and Memoh Cloud all do the same thing: give the agent a real computer. The difference is where that computer runs.

| Scenario | The right fit |
| --- | --- |
| Trying it out, keeping data on your own machine | [Memoh Desktop](https://memoh.ai/download) |
| Stay online with the laptop closed, share with a team, keep channels on 24/7 | Self-hosted server, or [Memoh Cloud](https://app.memoh.net) |
| One-off Q&A, no environment needed | Regular chat is enough |
| Run Claude Code / Codex, write code, preview the app | The agent's cloud computer |
| Morning briefings, release watches, on-duty bots | The agent's cloud computer |
| Open a real page, sign into an admin console, take over if needed | Workspace desktop |

Desktop is not replaced by Cloud. Use Desktop when the work lives in your local files and apps. Use self-hosting or Memoh Cloud when the work needs a machine that never closes.

:::tip
If you don't want to operate infrastructure, open [app.memoh.net](https://app.memoh.net) and sign in with GitHub or Google. If you want the runtime fully on your side, [download Desktop](https://memoh.ai/download) or follow the [self-hosted docs](https://docs.memoh.ai/self-hosted/).
:::

## What you can run on it

Once the setup wall is gone, the question is which job you want it to own for a long time. A few that actually work today:

### 1. Host a bot that stays on 24/7

A bot is useful when it doesn't drop. Support, on-call, lead triage, community ops — the hard part has always been a machine that never sleeps, reliable channel connections, and sessions that don't vanish when you close your laptop.

Memoh attaches Telegram, Discord, Lark, WeChat, Slack, and email to the same agent. In a group it does not have to answer every line — [Discuss mode](/blogs/2026-05-02) already lets it decide whether to speak. What you briefed in the web UI is still there in Telegram.

Sample prompt:

> Connect Telegram and make this our on-call assistant. Every morning at 8, summarize unread messages and repo activity into the group. Keep it online after I close my laptop.

### 2. Bring your own coding agent

You don't have to throw away tools you already like. Through ACP, put Claude Code, Codex, or Hermes inside the bot's container workspace, using your own subscription or API key — or models provided by Memoh.

Coding, installing dependencies, running commands, and landing changes all happen on this cloud computer. You dispatch the work from the web UI, Desktop, or any connected channel.

Sample prompt:

> Put my Claude Code on this bot's cloud computer and sign in with my own subscription. After that I should be able to ask it to change code from the web UI and Telegram, and the workspace files should still be there.

### 3. When the work is on a screen, open the workspace desktop

Login pages, admin consoles, OAuth, file pickers — that work is not in an API. A Memoh workspace can light up a screen: the agent clicks on it, you can watch, and if it stalls you take over.

How that desktop reaches a headed browser, when to use Browser Use, and when to fall back to pixel-level GUI control is in [the May workspace-desktop post](/blogs/2026-05-15). After this launch, that is not an add-on. It ships with the cloud computer. Close the laptop; the screen stays in the cloud.

Sample prompt:

> Open our admin console and walk through this feature. If the login page asks for verification, stop and wait for me to take over the desktop. I'll finish that, then you continue.

### 4. Keep files and knowledge on the same disk

Chat is no longer a disposable sandbox. Reports, scripts, screenshots, spreadsheets, last week's drafts — they stay under \`/data\`. The agent can search them, read them, and keep editing. Long-term memory follows the workspace too: searchable across sessions and channels by default, with Mem0 or OpenViking if you want them.

![Workspace files persist: spreadsheets, screenshots, scripts, and memory files live on the same computer](/blogs/2026-09-15/04-files.png)

_Files written today are still there next week. The agent does not start from zero every time._

Sample prompt:

> Create a competitor pricing sheet in the workspace. Check it every morning at 4, write the changes into the sheet, and message me first if anything drops. Don't wait for me to ask.

### 5. Run on a schedule, and build things in the cloud

Scheduled tasks fire on cron. They don't need you to be in the chat. Morning briefs, release watches, inbox cleanup — they belong on a computer that stays on. When something matters, it finds you first.

Dependencies, connectors, and skills live on that same computer. Install Node.js, Python, or a GitHub connector from Supermarket, and the agent uses them next time. Write code, run a dev server, and open a preview in the cloud.

![Scheduled tasks live on the bot and fire on time, without anyone clicking](/blogs/2026-09-15/05-schedule.png)

_The job hangs on the agent's computer, not on your laptop._

Sample prompt:

> Every weekday at 9am, summarize GitHub releases and issues from the last 24 hours and send them to the Lark group. Also build a reading-list web page on the cloud computer, run it, and give me the preview link.

## How to start

Pick the path that matches what you need right now. All three run the same Memoh, not three different products.

**1. Use Memoh Cloud**

Open [app.memoh.net](https://app.memoh.net), sign in with GitHub or Google, and give your agent a hosted cloud computer.

**2. Download Desktop**

Get the macOS, Windows, or Linux installer at [memoh.ai/download](https://memoh.ai/download). Desktop starts Memoh on your machine. It's the fastest way to try it while keeping files local.

**3. Deploy to your own server**

Use this when you need always-on uptime, multiple users, or channels that stay connected after your laptop goes offline:

\`\`\`bash
curl -fsSL https://memoh.sh | sh
\`\`\`

Source is at [github.com/felinics/Memoh](https://github.com/felinics/Memoh), licensed AGPLv3. Docs are at [docs.memoh.ai](https://docs.memoh.ai).

## Frequently asked questions

**How is Memoh's cloud computer different from regular chat?**

Regular chat is one session. When the session ends, the environment often goes with it. Memoh gives each agent a persistent workspace: files, desktop, browser, network, memory, and scheduled jobs stay there. That's how it can take a shift, instead of answering a single message.

**How should I choose Desktop, self-hosting, or Memoh Cloud?**

If the work is in your local files and apps, use Desktop. If you need 24/7 uptime, multiple users, or channels that don't drop, use self-hosting or Memoh Cloud. Cloud hosts the computer for you. Self-hosting runs the same software on your own infrastructure.

**Is my local data safe?**

On Cloud and self-hosted deploys, the agent's workspace runs in an isolated container. It does not get your laptop desktop by default. Desktop and "connect your own computer" are different: you are explicitly giving a bot files and a shell on that machine, and writes/executes ask for approval by default. Don't treat an unisolated local runtime as a normal cloud workspace.

**Can I put Claude Code or Codex on it?**

Yes. Enable an ACP agent on the bot's Agents page and finish setup with an API key or OAuth. They run inside that bot's container workspace and share the computer with Memoh's own agent. Codex, Claude Code, and Hermes ship as built-in setup paths.

**Can I run more than one agent?**

Yes. Run one for yourself, give each teammate one, or spin up a fleet on the same deployment. Each bot has its own workspace, tools, channels, and permission boundary.

**What OS does it run?**

The agent's cloud computer is an isolated Linux workspace. The official Docker deploy uses a container runtime. Desktop runs Memoh on your macOS, Windows, or Linux machine.

## After you close the laptop

What an agent lacks is not a longer next reply. It lacks a computer that stays on: files still there, jobs still running, and a screen you can sit down in front of when you need to.

Memoh turns that into a product. Open source, self-hosted, or Cloud. Give it a computer. Then close your laptop.

[Start with Memoh Cloud](https://app.memoh.net) · [Download Desktop](https://memoh.ai/download) · [Read the docs](https://docs.memoh.ai) · [GitHub](https://github.com/felinics/Memoh)
`,"../content/blogs/zh/2026-05-02.md":`---
title: 介绍Memoh的Discuss模式 - 我们如何实现一个更主动的群聊机器人
author: Acbox
---

# 介绍Memoh的Discuss模式 - 我们如何实现一个更主动的群聊机器人

在传统的 chatbot 工作流中，我们输入文字，bot完成任务后返回结果；这样的工作流，不管是在各种 Agent App 还是 绑定了 Channel 的 Agent 中，都是最常见的模式。

于是我们把这套思维搬到了channel的群聊中，通过 @机器人 的方式来输入，并等待他返回。

不过，这样的模式，对于群聊来说，还是太 passive 了，我们希望机器人能够更主动地参与到群聊中，而不是等待用户来触发，所以我们开发了 Discuss 模式。

:::tip
Memoh 的 Discuss 模式的技术方案来自于 [Menci](https://github.com/Menci) 的试验性项目 [Cahciua](https://github.com/Menci/Cahciua)，感谢 Menci 在 Memoh 做出的开源贡献
:::

那么，怎么让 bot 从「被 @ 才说话」变成「自己决定说不说」？这件事拆开来看，需要解决两个问题：第一，bot 怎么「看到」群聊里发生的一切；第二，看到之后怎么决定要不要开口。

## DCP：确定性上下文管线

要让 bot 理解群聊，首先得解决一个基础问题：怎么把群聊的消息流转换成 LLM 能理解的上下文？

传统的做法是把历史消息直接拼成一个 messages 数组丢给 LLM。但群聊场景有很多 chat 模式不需要处理的细节：消息编辑、消息撤回、用户改名、有人加入或离开、消息引用、转发……这些都会影响 bot 对对话的理解。

为此，我们引入了 **DCP（Deterministic Context Pipeline）** 架构，把上下文的构建拆成三个纯函数层：

**Adaptation（适配层）**：把不同平台（Telegram、Discord、飞书……）的原始消息事件标准化为统一的 \`CanonicalEvent\`。这是一个反腐层——不管上游平台的 API 长什么样，管线里看到的永远是同一套数据结构。

**Projection（投影层）**：\`IC' = Reduce(IC, Event)\`。一个纯函数状态机，接收事件，输出新的中间上下文（Intermediate Context, IC）。消息进来就追加节点，编辑就原地修改，撤回就标记删除，用户改名就插入一条系统事件。没有 I/O，没有副作用，完全可测试。

**Rendering（渲染层）**：\`RC = Render(IC, RenderParams)\`。把 IC 序列化成 LLM 能读的 XML 格式。每条消息变成一个 \`<message>\` 标签，身份信息（谁发的、什么时间、哪个频道）全部放在 XML 属性里，不放在正文中——这样用户没法通过消息内容伪造身份。

bot 最终看到的上下文长这样：

\`\`\`xml
<message id="42" sender="Alice (@alice)" t="2026-05-02T14:30:00+08:00"
         channel="telegram" conversation="Dev Group" type="group">
大家觉得新版的 prompt 效果怎么样？
</message>
<message id="43" sender="Bob (@bob)" t="2026-05-02T14:30:15+08:00"
         channel="telegram" conversation="Dev Group" type="group">
<in-reply-to id="42" sender="Alice (@alice)">大家觉得新版的 prompt 效果怎么样？</in-reply-to>
比之前好多了，不过偶尔还是会多嘴
</message>
<message id="44" sender="Alice (@alice)" t="2026-05-02T14:31:00+08:00"
         channel="telegram" conversation="Dev Group" type="group">
<mention uid="bot123">@Memoh</mention> 你觉得呢？
</message>
\`\`\`

消息引用用 \`<in-reply-to>\` 嵌套，@ 用 \`<mention>\` 标签，附件用 \`<attachment>\`，编辑过的消息会多一个 \`edited\` 属性，撤回的消息变成自闭合的 \`<message ... />\`。所有用户输入的文本内容都经过 XML escape，和标签本身严格隔离——这是反注入的关键：bot 通过 XML 属性判断「谁说的」，而不是通过正文里的文字。

三层都是纯函数，输入确定则输出确定。这让整个上下文构建过程可预测、可重放、可测试。

## Driver：bot 自己决定说不说

DCP 的三层管线解决了「怎么看」的问题。但「看到之后要不要说话」，这个决策不在管线里——它在 Driver 层。

Discuss 模式的 Driver 设计和 Chat 模式完全不同。Chat 模式下，每条消息到达后同步触发 LLM 调用，bot 必须回复。Discuss 模式下，消息到达后只是把最新的渲染上下文（RC）推进一个 channel，然后立即返回——不阻塞，不等待。

后台有一个 per-session 的 goroutine 在异步消费这些 RC。它会做几件事：

1. **合并更新**：如果短时间内来了好几条消息，不会每条都触发一次 LLM 调用，而是 drain 掉所有 pending 的更新，只用最新的 RC。
2. **判断触发条件**：只有在上次处理之后有新的「外部消息」（不是 bot 自己说的）时才触发 LLM。
3. **上下文合成**：把 RC（用户消息流）和 TR（Turn Responses，bot 之前的 LLM 交互记录）按时间戳归并成一个完整的上下文。
4. **调用 LLM**：带上系统 prompt、工具定义、合成后的上下文，调用 \`Agent.Stream()\`。
5. **推进游标**：LLM 调用结束后，把 \`lastProcessedMs\` 推进到本轮消耗的最新 RC 时间戳。如果 LLM 生成期间又有新消息进来，它们的时间戳会大于这个游标，自然会触发下一轮。

如果 10 分钟没有新消息，goroutine 自动退出。下次有消息时再重建。

## 内心独白：text 是思考，send 才是说话

这是 Discuss 模式最关键的设计。

在 Chat 模式里，LLM 输出的文字就是给用户看的回复。但在 Discuss 模式里，我们把文字输出重新定义为**内心独白**——只有 bot 自己能看到，群里的人看不到。

bot 要说话，必须调用 \`send\` 工具。不调用 \`send\`，就是选择沉默。

这个设计解决了一个核心问题：**怎么让 LLM 「闭嘴」**。在 Chat 模式里，LLM 总会生成回复——这是它的训练目标。但在群聊里，大多数消息不需要 bot 回复。如果 bot 什么都要插一嘴，很快就会被踢出群。

通过把「说话」从文字输出变成工具调用，我们把「是否回复」变成了一个 LLM 可以通过推理来决定的 action。系统 prompt 里会明确告诉它：

> 被提到或被直接问问题时，用 \`send\` 回复。
> 有真正有用的信息可以补充时，用 \`send\` 回复。
> 别人在聊天、话题不涉及你、你的输入没有价值时，保持沉默。

每次 LLM 调用时，我们还会注入一条 late binding prompt，再次强调：「你的文字输出是不可见的内心独白，必须用 \`send\` 工具才能说话。」如果 bot 刚刚被 @ 或被回复，这条 prompt 会额外提示：「你被提到了，你应该用 \`send\` 回复。」

## RC 和 TR：两条正交的时间流

理解 Discuss 模式的上下文合成，关键是理解 RC 和 TR 的关系。

**RC（Rendered Context）** 来自 DCP 管线，包含所有群聊消息（包括 bot 自己发出的消息被群成员看到后再被管线捕获的）。每个 segment 带一个 \`receivedAtMs\` 时间戳。

**TR（Turn Response）** 是 bot 之前的 LLM 调用记录——包括 assistant 的输出和工具调用的结果。每个 TR 带一个 \`requestedAtMs\` 时间戳。

上下文合成就是把这两条流按时间戳归并排序。时间戳相同时，RC 排在 TR 前面——因为 Anthropic 的 Messages API 要求 user/assistant 严格交替，RC 是 user 角色，TR 是 assistant 角色。

这个设计保证了因果关系的正确性：bot 看到消息（RC）→ 做出反应（TR）→ 新消息到达（RC）→ 再次反应（TR）……时间线永远是对的。

## 和 Chat 模式的对比

| | Chat 模式 | Discuss 模式 |
|---|---|---|
| 触发方式 | 每条消息同步触发 | 异步 goroutine，自然批处理 |
| 是否回复 | 必须回复 | bot 自主决定（\`send\` 工具） |
| 文字输出含义 | 就是回复内容 | 内心独白，不可见 |
| 上下文来源 | 数据库历史 + 当前消息 | DCP 管线（RC）+ 历史 TR |
| 消息编辑/撤回 | 不感知 | IC 中原地修改/标记删除 |
| 群事件 | 不感知 | 用户改名、成员变动等作为系统事件进入 IC |
| 适用场景 | 1 对 1 对话、被 @ 触发 | 群聊观察、自主参与 |

## 未来计划

Discuss 模式目前已经在生产环境运行，但还有几个方向在迭代：

- **Probe Gate**：在正式调用大模型之前，先用一个小模型快速判断「这轮要不要回复」。如果小模型判断不需要，就跳过大模型调用，节省成本。数据库里已经预留了 \`discuss_probe_model_id\` 字段，但还没接线。
- **跨会话感知**：让 bot 能感知到它在不同群、不同频道中的状态，实现更丰富的上下文关联。

Discuss 模式的核心理念很简单：不要把 bot 当工具，把它当群成员。让它听得到所有对话，让它自己决定什么时候说话。剩下的，交给 LLM 的推理能力。
`,"../content/blogs/zh/2026-05-15.md":`---
title: 提供桌面，我们可以做到更多 - 介绍Memoh的桌面电脑功能
author: Ran Chen
---

# 提供桌面，我们可以做到更多 - 介绍Memoh的桌面电脑功能

很多 Agent 在文字和命令行里表现不错，遇到真实网页和图形界面时就容易卡住。

比如登录后台时弹出新窗口；上传文件时需要处理文件选择器；有些按钮只有页面渲染出来以后才知道在哪里；同一个页面在 headless browser 里正常，在真实 Chrome 里会被样式、权限或弹窗卡住。用户问“你帮我看看这个页面现在是什么状态”时，只读 HTML 经常不够。

所以我们给 Memoh 的 bot workspace 加了桌面功能。

每个支持 Display 的 workspace container 都可以启动一个可见的图形桌面。里面有窗口管理器、终端、headed Chrome/Chromium 浏览器。用户可以在 Web UI 里看到它，bot 也可以通过工具操作它。

:::tip
本文里的“桌面电脑功能”指 bot workspace 里的可见桌面。Memoh 的 Electron 桌面客户端负责本地应用体验、托管本地 server、启动嵌入式 Qdrant 和 CLI，属于另一层。
:::

## 为什么 Agent 需要桌面

命令行适合确定性的工作：读写文件、跑测试、执行脚本、调用 API。Headless browser 也很强，适合自动化、爬取、页面测试。

很多真实任务还需要看到渲染后的界面。

真实网页里有登录态、弹窗、拖拽、canvas、复杂组件、权限提示、文件选择器，还有很多只能从画面上判断的状态。用户也经常需要看 bot 正在做什么，必要时自己接手点一下。

桌面功能解决两个具体问题：bot 可以操作一个真实可见的浏览器；用户可以看到同一个画面。

## Workspace Display：跑在容器里的桌面

Memoh 的 workspace 桌面运行在 bot 的 container 里，不直接控制用户的 Mac、Windows 或 Linux 主机桌面。它的文件、命令、网络和工具权限都跟着这个 workspace 走。

当 bot 启用 Workspace Display 后，bridge 会在容器里启动一套图形运行时：

- \`Xvnc\` 提供 X11 显示服务和 RFB 输入输出通道
- \`xfce4\` / \`xfwm4\` / \`twm\` 等组件提供桌面或窗口管理能力
- \`xterm\` 打开一个默认终端，工作目录指向 workspace
- Chrome/Chromium 以 headed 模式启动，并暴露本地 CDP 端口

对用户来说，这个桌面会出现在 Web UI 的 Display pane 里。前端通过 WebRTC 连接后端 display service，看到的是 bot workspace 的实时画面；键盘和鼠标输入也会被转发回容器。

对 bot 来说，这是一个可以操作的运行环境。

![在 Memoh 里打开 workspace display 的 demo](/blogs/2026-05-15/desktop-settings.gif)

_Display pane 里展示的是 bot workspace 的图形桌面，浏览器就在这个桌面里运行。_

\`\`\`text
Bot workspace container
├── files and commands
├── bridge process
├── Xvnc display (:99)
├── terminal
└── headed Chrome / Chromium
    └── CDP on 127.0.0.1:9222
\`\`\`

用户打开 Display pane 看到浏览器停在哪个页面，bot 通过 Browser Use 操作的也是这个浏览器。

## Browser Use：操作同一个可见浏览器

如果目标在网页里，Memoh 会优先让 bot 使用 Browser Use。

Browser Use 通过 Chrome DevTools Protocol（CDP）连接 workspace 里的 Chrome/Chromium。这个浏览器以 headed 模式运行，会显示在 Display pane 里。

Memoh 给 agent 暴露了几个工具：

![在 Display pane 里操作有头浏览器的 demo](/blogs/2026-05-15/display-browser.gif)

_Display pane 里打开的是 workspace 里的 Chrome。用户看到的页面和 bot 操作的是同一个浏览器状态。_

**\`browser_observe\`**：观察当前浏览器状态。它可以读取可交互元素快照、正文内容、标题、URL、HTML，也可以截图或做带标注的截图。

**\`browser_action\`**：执行浏览器动作，比如打开 URL、点击、填写输入框、按键、滚动、上传文件、切换标签页。

**\`browser_remote_session\`**：给需要写 Playwright 或 CDP 脚本的场景用。脚本可以连接同一个 workspace Chrome，不需要重新开一个浏览器。

用户看到的页面、bot 读取的页面、工具操作的页面，都来自同一个浏览器状态。bot 做到一半卡住时，用户可以看见；用户手动处理完登录或权限提示后，bot 可以继续。

## Computer Use：当网页语义不够用

Browser Use 适合网页里的 DOM、表单、按钮和导航。但有些界面不在 CDP 能理解的范围里。

比如系统文件选择器、浏览器原生权限弹窗、崩掉的页面、非浏览器 GUI 应用，或者只能通过坐标和像素处理的状态。这时候就需要 Computer Use。

Computer Use 的流程更直接：先截图，再移动鼠标、点击、拖拽、滚动、输入文字、按快捷键。它走显示层输入输出，不依赖浏览器 DOM。

很多自动化会卡在这些小动作上：看一眼屏幕，点按钮，按 Esc，重新聚焦窗口。Computer Use 就是用来处理这些情况的。

Memoh 的策略是：能用 Browser Use 就用 Browser Use，因为它更稳定、语义更清楚；CDP 到不了的时候，再退到 Computer Use。

## Display Pane：让用户也在场

桌面功能也应该给用户看。

在 Memoh 的 Web UI 里，workspace 区域可以打开 chat、draft、file、terminal，也可以打开 display tab。Display pane 会检查桌面运行时是否准备好；如果缺少依赖，它会通过后端的 prepare 流程安装或配置需要的桌面、VNC、浏览器和字体组件。

连接成功后，用户能看到当前 workspace 的主显示器。

![在 workspace display 里打开终端的 demo](/blogs/2026-05-15/display-terminal.gif)

_同一个 Display session 里可以看到浏览器、终端和其它图形界面。_

这让很多工作流变得更顺手：

- bot 帮你调试 Web UI，你可以直接看它点到了哪里
- bot 打开后台页面，你可以手动处理一次登录，然后让它继续
- bot 复现一个视觉 bug，你可以确认它看到的状态和你看到的一样
- bot 操作不确定的界面时，你可以随时接管鼠标键盘

这样做的好处很简单：bot 不需要把所有状态都描述出来，用户可以直接看。

## 为什么不只用 Headless Playwright

Headless Playwright 当然有用。我们也不打算用桌面替代它。

它们的分工大概是这样：

| 能力 | 适合做什么 | 局限 |
|---|---|---|
| 命令行工具 | 文件、代码、测试、构建、脚本任务 | 看不到图形状态 |
| Headless browser | 快速网页自动化、批量测试、确定性脚本 | 用户看不到运行过程，遇到真实登录/弹窗/视觉状态时容易断层 |
| Browser Use | 操作可见 Chrome、处理网页、表单、导航、截图 | 主要覆盖浏览器内的页面状态 |
| Computer Use | 原生弹窗、非浏览器 GUI、坐标级恢复 | 语义少，动作需要更谨慎 |
| Display Pane | 用户观察、接管、协作确认 | 需要 workspace 支持图形运行时 |

Headless browser 适合跑脚本和批量任务。Workspace Display 适合处理需要用户看到画面的任务。

## 权限和隔离

这个桌面不会接管用户电脑。

Memoh 的桌面跑在 workspace container 里。它的文件系统、进程、网络和工具权限仍然跟着 bot 的 workspace 走。Web UI 负责显示这个容器桌面，并把用户输入转发进去。

它只操作 workspace 桌面，用户的系统桌面不在这个通道里。

对于 trusted local workspace，Memoh 会更谨慎：这类 workspace 本来就运行在宿主机权限下，Display pane 默认不作为普通容器桌面暴露。桌面能力优先服务的是可隔离、可销毁、可重建的 container workspace。

## 可以做到更多

有了桌面以后，很多过去不好处理的任务会简单一些。

bot 可以打开本地 Web 服务，看页面、点按钮、截图、定位问题；可以进入 SaaS 控制台，按用户确认过的步骤配置项目；可以在可见浏览器里处理 OAuth 流程，少一些对重定向和页面状态的猜测；也可以在遇到不稳定 UI 时，把当前画面发出来，让用户判断下一步。

用户也不用猜 bot 在后台做了什么。打开 Display pane 就能看到。

## 未来计划

桌面电脑功能现在已经能用，但离“顺手”还有不少细节。接下来我们会重点处理这些地方：

- **第一次打开要少折腾**：有些 workspace 镜像缺字体，有些缺浏览器，有些包管理器源很慢。Display prepare 已经能处理一部分情况，但失败时还应该给出更明确的原因和修复方式。
- **bot 做过什么要能看懂**：一次点击、一次输入、一次截图，应该和对应的工具调用放在一起看。用户不需要翻日志猜它刚才点了哪里。
- **用户接管以后，bot 要会继续**：登录、两步验证、权限确认这类步骤经常需要人处理。我们希望 bot 能明确停在这里，等用户处理完，再从当前页面状态接着做。
- **会话权限要更细**：谁能看桌面、谁能接管键鼠、截图能不能发到当前对话、远程 CDP 连接多久过期，这些都应该能配置。
- **复杂界面要更稳**：canvas、拖拽、富文本编辑器、文件上传、多窗口切换，这些场景会继续补测试和工具能力。

我们做 Memoh 的一个基本判断是：聊天框适合沟通，命令行适合执行，记忆系统适合长期上下文，桌面适合需要看画面和操作界面的任务。

给 bot 一个 workspace 桌面以后，它可以打开页面、看状态、点按钮、试流程，再把结果告诉用户。
`,"../content/blogs/zh/2026-09-15.md":`---
title: 介绍 Memoh：给每个 Agent 一台云电脑
author: Team Memoh
---

# 介绍 Memoh：给每个 Agent 一台云电脑

介绍 Memoh — 一台给 Agent 用的云端电脑。每个 Agent 都有自己的桌面、文件、浏览器、网络和长期记忆，24/7 在线。你的笔记本合上了，它还在工作。

模型已经足够聪明。真正卡住的，是它没有地方干活。

聊天窗口里的 Agent 会思考，但思考完就停了。关掉标签页，上下文没了。合上笔记本，Bot 也一起睡了。想让它值班、记住上周的文件、自己打开网页点按钮，传统做法是去租服务器、配系统、管密钥、写脚本。这件事长期被锁在「会运维的人」手里。

Memoh 把这台电脑直接交给 Agent。开源，可自托管，也可以直接使用托管服务。

## 为什么 Agent 需要一台云电脑

云电脑给了你两件笔记本给不了的东西。

**它不关机。** 笔记本会休眠、断网、合盖。云电脑不会。你在飞机上、睡觉、过周末，挂在 Telegram、飞书或 Discord 上的 Bot 仍在回复；定时任务仍会跑；需要你拍板时，它会先来找你。

**文件、工具和记忆留在原处。** 普通聊天每次都从空白开始，昨天做过的事它看不见。Memoh 的工作区更像你自己的电脑：写过的文件还在，装过的运行时还在，跨会话、跨渠道的长期记忆也还在。周一建的东西，周五还能接着用。

这两点加在一起，改变的是工作方式。你不再做一次性任务，而是养一个持续在线的同事。

它和常见的一次性沙盒也不一样：工作区里有图形桌面，你可以看着 Agent 操作，卡住时自己接手；你也可以把 Claude Code、Codex、Hermes 这类已经在用的 ACP Agent，放到同一台云电脑里。

![每个 Bot 都有独立的容器工作区：文件系统、进程、网络和资源都在自己的电脑里](/blogs/2026-09-15/02-computer.png)

_工作区就是 Agent 的电脑。文件、命令、桌面和网络都跟这个 Bot 走。_

## 什么时候用这台电脑

Memoh 不是只有一种形态。Desktop、自托管和 Memoh Cloud 解决的是同一件事：给 Agent 一台真正的电脑。差别在于这台电脑跑在哪。

| 场景 | 合适的方式 |
| --- | --- |
| 先试用、数据留在自己电脑上 | [Memoh Desktop](https://memoh.ai/download) |
| 笔记本合上也要在线、团队共用、渠道 24/7 值班 | 自托管 Server，或 [Memoh Cloud](https://app.memoh.net) |
| 一次性问答、不需要环境 | 普通聊天就够了 |
| 跑 Claude Code / Codex，写代码并预览 | Agent 的云电脑 |
| 定时简报、盯发版、值班 Bot | Agent 的云电脑 |
| 打开真实网页、登录后台、必要时自己接手 | 工作区桌面 |

Desktop 不会被 Cloud 取代。任务发生在你自己的文件和应用上时，用 Desktop；任务需要一台不合盖的电脑时，用自托管或 Memoh Cloud。

:::tip
不想自己运维，打开 [app.memoh.net](https://app.memoh.net)，用 GitHub 或 Google 登录即可。想把运行环境完全留在自己这边，下载[桌面版](https://memoh.ai/download)，或按[文档](https://docs.memoh.ai/zh/self-hosted/)自托管。
:::

## 你可以让它做什么

技术门槛拿掉之后，剩下的是你想让它长期负责哪件事。几个真实能跑起来的方向：

### 1. 托管一个 24/7 在线的 Bot

Bot 的价值不在演示，而在它不掉线。客服、值班、线索筛选、社区管理，真正难的是一台不合盖的机器、可靠的渠道连接，以及不会在你关电脑时一起消失的会话。

Memoh 把 Telegram、Discord、飞书、微信、Slack、邮件接到同一个 Agent 上。群聊里它不必每句都回——[Discuss 模式](/blogs/2026-05-02)已经让它自己判断要不要开口。你在 Web 里交代过的事，换到 Telegram 仍然还在。

示例：

> 帮我接上 Telegram，做成团队值班助手。每天早上 8 点整理未读消息和仓库动态，发到群里。我关电脑之后它也要继续在线。

### 2. 带上你自己的编码 Agent

不必把已经用顺手的工具丢掉。通过 ACP，把 Claude Code、Codex、Hermes 放进 Bot 的容器工作区，用你自己的订阅或 API Key，也可以用 Memoh 提供的模型。

编码、装依赖、跑命令、提交改动，都发生在这台云电脑上。你从 Web、桌面端或任意渠道把活派出去。

示例：

> 把我的 Claude Code 放到这个 Bot 的云电脑里，用我自己的订阅登录。之后我从 Web 和 Telegram 都能让它改代码，工作区里的文件不要丢。

### 3. 需要看见画面时，打开工作区桌面

登录页、后台、OAuth、文件选择器——这些活不在 API 里。Memoh 的工作区可以亮起一块屏幕：Agent 在上面点，你也能看，卡住了就自己接手。

桌面怎么接到有头浏览器、网页操作和图形界面怎么分工，我们在[5 月的工作区桌面一文](/blogs/2026-05-15)里写过。发布之后，它不再是一个可选项，而是这台云电脑默认带着的能力。笔记本合上了，这块屏幕还在云上。

示例：

> 打开我们的后台，按这个功能走一遍。登录页如果弹出验证，停下来等我接管桌面，我处理完你再继续。

### 4. 让文件和知识留在同一块硬盘上

每次聊天不再是一次性沙盒。报告、脚本、截图、数据表、上周写的草稿，都还在 \`/data\` 里。Agent 可以搜索、读取、接着改。长期记忆也跟工作区走，跨会话、跨渠道默认可检索，也可以接入 Mem0 或 OpenViking。

![工作区文件会留下来：表格、截图、脚本和记忆文件都在同一台电脑上](/blogs/2026-09-15/04-files.png)

_今天写入的文件，下周还在。Agent 不是每次从零开始。_

示例：

> 在工作区建一个竞品价格表。每天早上 4 点检查一次，把变化写进表格；有降价就先发消息给我，不要等我来问。

### 5. 定时运行，并在云上把东西做出来

计划任务用 cron 触发，不依赖你正在聊天。晨间简报、盯发版、整理收件箱，都可以交给这台一直开着的电脑。有重要的事，它会先找你。

依赖、Connector 和 Skill 也在同一台电脑上。从 Supermarket 装好 Node.js、Python 或 GitHub Connector，Agent 下次直接用。写代码、跑开发服务器、打开预览，都可以在云上完成。

![计划任务写在 Bot 上，到点就跑，不需要人去点](/blogs/2026-09-15/05-schedule.png)

_任务挂在 Agent 的电脑上，而不是你的笔记本上。_

示例：

> 每天工作日早上 9 点，总结过去 24 小时的 GitHub 发版和 Issue，发到飞书群。另外帮我在云电脑上做一个阅读清单网页，跑起来后把预览链接给我。

## 怎么开始

按你现在的需求选一条路。三条路用的是同一套 Memoh，不是三套产品。

**1. 使用 Memoh Cloud**

打开 [app.memoh.net](https://app.memoh.net)，用 GitHub 或 Google 登录，给 Agent 一台托管的云电脑。

**2. 下载桌面版**

在 [memoh.ai/download](https://memoh.ai/download) 获取 macOS、Windows 或 Linux 安装包。桌面版会在本机拉起 Memoh，适合先跑起来、文件留在自己电脑上的人。

**3. 部署到自己的服务器**

适合要长期在线、多人共用、或笔记本离线后渠道仍要接通的情况：

\`\`\`bash
curl -fsSL https://memoh.sh | sh
\`\`\`

源码在 [github.com/felinics/Memoh](https://github.com/felinics/Memoh)，协议是 AGPLv3。文档在 [docs.memoh.ai](https://docs.memoh.ai)。

## 常见问题

**Memoh 的云电脑和普通聊天有什么区别？**

普通聊天是一次会话。会话结束，环境往往也就没了。Memoh 给每个 Agent 一台持久的工作区：文件、桌面、浏览器、网络、记忆和计划任务都还在，所以它能值班，而不是只回答这一句。

**Desktop、自托管和 Memoh Cloud 怎么选？**

任务发生在你自己的文件和应用上，用 Desktop。需要 24/7 在线、多人共用或渠道不掉线，用自托管或 Memoh Cloud。Cloud 负责托管这台电脑；自托管把同一套软件跑在你自己的基础设施上。

**我的本地数据安全吗？**

Cloud 和自托管里的 Agent 工作区跑在隔离容器中，默认进不去你的笔记本桌面。Desktop 和「接入自己的电脑」是另一回事：那是你主动把本机文件和命令交给指定 Bot，写和执行默认需要审批。不要把未隔离的本机权限当成普通云工作区。

**可以把 Claude Code 或 Codex 放进去吗？**

可以。在 Bot 的 Agents 页启用 ACP Agent，用 API Key 或 OAuth 完成配置。它们跑在该 Bot 的容器工作区里，和 Memoh 自己的 Agent 共用这台电脑。目前内置 Codex、Claude Code 和 Hermes。

**可以同时跑多个 Agent 吗？**

可以。给自己跑一个，给团队成员各分配一个，或在同一套部署里拉起一组。每个 Bot 有自己的工作区、工具、渠道和权限边界。

**它跑在什么系统上？**

Agent 的云电脑是隔离的 Linux 工作区，官方 Docker 部署默认使用容器运行时。Desktop 则把 Memoh 跑在你的 macOS、Windows 或 Linux 上。

## 合上笔记本之后

Agent 缺的不是下一句更长的回复。它缺一台不合盖的电脑：文件还在，任务还会跑，必要时你能坐过来看一眼屏幕。

Memoh 把这件事做成产品。开源，可自托管，也可以直接用 Cloud。给它一台电脑，然后合上你的笔记本。

[开始使用 Memoh Cloud](https://app.memoh.net) · [下载桌面版](https://memoh.ai/download) · [阅读文档](https://docs.memoh.ai) · [GitHub](https://github.com/felinics/Memoh)
`}),k={"2026-09-11":`2026-09-15`,"2026-09-11-en":`2026-09-15`},A=e=>{let t=/^---\n([\s\S]*?)\n---\n?/.exec(e);return t?{meta:Object.fromEntries(t[1].split(`
`).map(e=>{let t=e.indexOf(`:`);if(t!==-1)return[e.slice(0,t).trim(),e.slice(t+1).trim().replace(/^["']|["']$/g,``)]}).filter(e=>!!e)),body:e.slice(t[0].length)}:{meta:{},body:e}},j=e=>e.replace(/!\[[^\]]*]\([^)]+\)/g,``).replace(/\[([^\]]+)]\([^)]+\)/g,`$1`).replace(/[`*_>#|:-]/g,``).replace(/\s+/g,` `).trim(),M=e=>{let t=j(e.split(`
`).find(e=>{let t=e.trim();return t&&!t.startsWith(`#`)&&!t.startsWith(`:::`)&&!t.startsWith(`![`)&&!t.startsWith(`- `)&&!t.startsWith(`|`)&&!t.startsWith("```")})??``);return t.length>180?`${t.slice(0,177)}...`:t},N=e=>{let t=j(e.replace(/```[\s\S]*?```/g,``)).match(/[\u4e00-\u9fff]|[A-Za-z0-9]+/g)?.length??0;return Math.max(2,Math.round(t/320))},P=e=>{let t=e.replace(/\\/g,`/`).split(`/`),n=t.pop()?.replace(/\.md$/,``),r=t.pop();if(!(!n||n===`index`)&&!(r!==`en`&&r!==`zh`))return{slug:n,locale:r}},F=(e,t)=>{let n=P(e);if(!n)return;let{meta:r,body:i}=A(t),a=i.replace(/^#\s+.+\n+/,``),o=/^(\d{4}-\d{2}-\d{2})/.exec(n.slug);return{slug:n.slug,locale:n.locale,title:r.title||n.slug,author:r.author||`Team Memoh`,dateKey:o?.[1]??n.slug,excerpt:M(a),readingMinutes:N(a),body:a}},I=new Map;for(let[e,t]of Object.entries(O)){let n=F(e,t);if(!n)continue;let r=I.get(n.slug)??{};r[n.locale]=n,I.set(n.slug,r)}var L=e=>e===`zh`?`zh`:`en`,R=(e,t)=>{let n=I.get(e);if(n)return n[t]??n.en??n.zh},z=e=>k[e]??e,B=(e,t)=>{let n=/^(\d{4}-\d{2}-\d{2})$/.exec(e);return n?new Intl.DateTimeFormat(L(t)===`zh`?`zh-CN`:`en`,{month:`short`,day:`numeric`,year:`numeric`}).format(new Date(`${n[1]}T00:00:00Z`)):e},V=e=>{let t=L(e);return[...I.keys()].sort((e,t)=>t.localeCompare(e)).map(e=>R(e,t)).filter(e=>!!e)},H=(e,t)=>R(z(decodeURIComponent(e)),L(t)),U={class:`w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10`},W={key:0,class:`flex flex-col gap-12`},G={class:`max-w-[760px] flex flex-col gap-5`},K={class:`inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground`},q={class:`flex flex-col gap-4`},J={class:`text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]`},Y={class:`text-base md:text-lg text-muted-foreground leading-relaxed max-w-[680px]`},X={class:`p-6 md:p-8 flex flex-col gap-6`},Z={class:`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground`},re={class:`inline-flex items-center gap-1.5`},ie={class:`inline-flex items-center gap-1.5`},ae={class:`inline-flex items-center gap-1.5`},oe={class:`flex flex-col gap-3`},se={class:`text-xs font-medium uppercase tracking-[0.16em] text-primary`},ce={class:`text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-tight`},le={class:`text-sm md:text-base text-muted-foreground leading-relaxed`},ue={class:`inline-flex items-center gap-2 text-sm font-medium text-foreground`},de={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},fe={class:`flex flex-col gap-4`},pe={class:`flex items-center justify-between gap-3 text-xs text-muted-foreground`},me={class:`flex flex-col gap-3`},he={class:`text-lg font-semibold tracking-tight text-foreground leading-snug`},ge={class:`text-sm text-muted-foreground leading-relaxed`},_e={class:`mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground`},ve={key:1,class:`mx-auto max-w-[820px]`},ye={class:`mb-10 flex flex-col gap-5 border-b border-border pb-8`},be={class:`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground`},xe={class:`inline-flex items-center gap-1.5`},Se={class:`inline-flex items-center gap-1.5`},Ce={class:`inline-flex items-center gap-1.5`},we={class:`text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight`},Te={class:`text-base md:text-lg text-muted-foreground leading-relaxed`},Ee={key:0,class:`rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground`},De=[`innerHTML`],Oe={key:2,class:`mt-14 border-t border-border pt-8`},Q={class:`mb-4 text-lg font-semibold tracking-tight text-foreground`},ke={class:`grid grid-cols-1 md:grid-cols-3 gap-4`},Ae={class:`mb-2 text-xs text-muted-foreground`},je={class:`text-sm font-medium leading-snug text-foreground`},Me={key:2,class:`mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center`},Ne={class:`rounded-xl border border-border bg-muted p-3 text-muted-foreground`},Pe={class:`text-3xl font-semibold tracking-tight text-foreground`},Fe={class:`text-muted-foreground`},$=S(t({__name:`BlogsPage`,setup(t){let u=te(),S=ne(),{t:O,locale:k}=p(),A=v(()=>{let e=u.params.slug;return typeof e==`string`?e:``}),j=v(()=>A.value.length>0),M=v(()=>V(k.value)),N=v(()=>A.value?H(A.value,k.value):void 0),P=v(()=>M.value[0]),F=v(()=>M.value.filter(e=>e.slug!==N.value?.slug).slice(0,3)),I=h(``),L=h(!1),R=0,z=v(()=>N.value?O(`blog.seoPostTitle`,{title:N.value.title}):j.value?O(`blog.seoNotFoundTitle`):O(`blog.seoTitle`)),$=v(()=>N.value?.excerpt||O(`blog.seoDescription`));return ee({htmlAttrs:{lang:v(()=>k.value)}}),m({title:()=>z.value,description:()=>$.value,ogTitle:()=>z.value,ogDescription:()=>$.value,ogType:`article`,ogUrl:()=>`https://memoh.ai${u.path}`,twitterCard:`summary_large_image`,twitterTitle:()=>z.value,twitterDescription:()=>$.value}),l(N,async e=>{let t=++R;if(I.value=``,!e){L.value=!1;return}L.value=!0;let{renderMarkdown:n}=await w(async()=>{let{renderMarkdown:e}=await import(`./markdown-B4Y81dHq.js`);return{renderMarkdown:e}},[]),r=await n(e.body);t===R&&(I.value=r,L.value=!1)},{immediate:!0}),(t,l)=>(c(),o(`main`,U,[j.value?N.value?(c(),o(`article`,ve,[d(f(C),{to:`/blogs`,class:`mb-8 inline-flex items-center gap-2 rounded-md px-0 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:e(()=>[d(f(y),{class:`w-4 h-4`}),i(` `+r(t.$t(`blog.back`)),1)]),_:1}),a(`header`,ye,[a(`div`,be,[a(`span`,xe,[d(f(x),{class:`w-3.5 h-3.5`}),i(` `+r(f(B)(N.value.dateKey,f(k))),1)]),a(`span`,Se,[d(f(D),{class:`w-3.5 h-3.5`}),i(` `+r(N.value.author),1)]),a(`span`,Ce,[d(f(T),{class:`w-3.5 h-3.5`}),i(` `+r(t.$t(`blog.minRead`,{n:N.value.readingMinutes})),1)])]),a(`h1`,we,r(N.value.title),1),a(`p`,Te,r(N.value.excerpt),1)]),L.value?(c(),o(`div`,Ee,r(t.$t(`blog.rendering`)),1)):(c(),o(`div`,{key:1,class:`blog-body`,innerHTML:I.value},null,8,De)),F.value.length?(c(),o(`section`,Oe,[a(`h2`,Q,r(t.$t(`blog.more`)),1),a(`div`,ke,[(c(!0),o(g,null,s(F.value,t=>(c(),n(f(C),{key:t.slug,to:`/blogs/${t.slug}`,class:`group rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:e(()=>[a(`p`,Ae,r(f(B)(t.dateKey,f(k))),1),a(`h3`,je,r(t.title),1)]),_:2},1032,[`to`]))),128))])])):_(``,!0)])):(c(),o(`section`,Me,[a(`div`,Ne,[d(f(E),{class:`w-6 h-6`})]),a(`h1`,Pe,r(t.$t(`blog.notFoundTitle`)),1),a(`p`,Fe,r(t.$t(`blog.notFoundDescription`)),1),a(`button`,{type:`button`,class:`inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,onClick:l[0]||=e=>f(S).push(`/blogs`)},r(t.$t(`blog.back`)),1)])):(c(),o(`section`,W,[a(`header`,G,[a(`div`,K,[d(f(E),{class:`w-3.5 h-3.5`}),i(` `+r(t.$t(`blog.badge`)),1)]),a(`div`,q,[a(`h1`,J,r(t.$t(`blog.indexTitle`)),1),a(`p`,Y,r(t.$t(`blog.indexDescription`)),1)])]),P.value?(c(),n(f(C),{key:0,to:`/blogs/${P.value.slug}`,class:`group grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:e(()=>[a(`div`,X,[a(`div`,Z,[a(`span`,re,[d(f(x),{class:`w-3.5 h-3.5`}),i(` `+r(f(B)(P.value.dateKey,f(k))),1)]),a(`span`,ie,[d(f(D),{class:`w-3.5 h-3.5`}),i(` `+r(P.value.author),1)]),a(`span`,ae,[d(f(T),{class:`w-3.5 h-3.5`}),i(` `+r(t.$t(`blog.minRead`,{n:P.value.readingMinutes})),1)])]),a(`div`,oe,[a(`span`,se,r(t.$t(`blog.latest`)),1),a(`h2`,ce,r(P.value.title),1),a(`p`,le,r(P.value.excerpt),1)]),a(`span`,ue,[i(r(t.$t(`blog.readArticle`))+` `,1),d(f(b),{class:`w-4 h-4 transition-transform group-hover:translate-x-0.5`})])]),l[1]||=a(`div`,{class:`border-t md:border-t-0 md:border-l border-border bg-muted/35 p-6 md:p-8 flex items-end`},[a(`div`,{class:`w-full font-mono text-xs text-muted-foreground leading-relaxed`},[a(`div`,{class:`mb-4 flex items-center gap-1.5`},[a(`span`,{class:`h-2.5 w-2.5 rounded-full bg-red-400/80`}),a(`span`,{class:`h-2.5 w-2.5 rounded-full bg-yellow-400/80`}),a(`span`,{class:`h-2.5 w-2.5 rounded-full bg-green-400/80`})]),a(`p`,null,`agent.workspace.boot()`),a(`p`,{class:`text-foreground`},`container.isolated = true`),a(`p`,null,`memory.local_first = true`),a(`p`,null,`status = "always-on"`)])],-1)]),_:1},8,[`to`])):_(``,!0),a(`section`,de,[(c(!0),o(g,null,s(M.value.slice(1),o=>(c(),n(f(C),{key:o.slug,to:`/blogs/${o.slug}`,class:`group flex min-h-[260px] flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:e(()=>[a(`div`,fe,[a(`div`,pe,[a(`span`,null,r(f(B)(o.dateKey,f(k))),1),a(`span`,null,r(t.$t(`blog.min`,{n:o.readingMinutes})),1)]),a(`div`,me,[a(`h2`,he,r(o.title),1),a(`p`,ge,r(o.excerpt),1)])]),a(`span`,_e,[i(r(t.$t(`blog.readArticle`))+` `,1),d(f(b),{class:`w-4 h-4 transition-transform group-hover:translate-x-0.5`})])]),_:2},1032,[`to`]))),128))])]))]))}}),[[`__scopeId`,`data-v-d10353af`]]);export{$ as default};