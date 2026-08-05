import{C as e,D as t,Dt as n,E as r,O as i,Q as a,S as o,U as s,V as c,X as l,_ as u,b as d,it as f,lt as p,m,w as h,x as g}from"./vue.DKb5ZKVl-CCT-LZYt.js";import{t as ee}from"./arrow-left-BqU27wWE.js";import{t as _}from"./arrow-right-eRDGDSfA.js";import{n as te}from"./vue.BHyNcdic-BetYJRXi.js";import{c as ne,n as v,o as y,s as re,t as ie}from"./index-Bs8Ja5HW.js";var b=m(`calendar-days`,[[`path`,{d:`M8 2v4`,key:`1cmpym`}],[`path`,{d:`M16 2v4`,key:`4m81vk`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`,key:`1hopcy`}],[`path`,{d:`M3 10h18`,key:`8toen8`}],[`path`,{d:`M8 14h.01`,key:`6423bh`}],[`path`,{d:`M12 14h.01`,key:`1etili`}],[`path`,{d:`M16 14h.01`,key:`1gbofw`}],[`path`,{d:`M8 18h.01`,key:`lrp35t`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}],[`path`,{d:`M16 18h.01`,key:`kzsmim`}]]),x=m(`clock-3`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6h4`,key:`135r8i`}]]),S=m(`file-text`,[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]),C=m(`user-round`,[[`circle`,{cx:`12`,cy:`8`,r:`5`,key:`1hypcn`}],[`path`,{d:`M20 21a8 8 0 0 0-16 0`,key:`rfgkzh`}]]),w=Object.assign({"../content/blogs/2026-02-16.md":`---
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

Furthermore, we will continue to operate and permanently open-source Memoh, making it a product with long impact.`,"../content/blogs/2026-05-02.md":`---
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
`,"../content/blogs/2026-05-15.md":`---
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
`}),T=e=>{let t=/^---\n([\s\S]*?)\n---\n?/.exec(e);return t?{meta:Object.fromEntries(t[1].split(`
`).map(e=>{let t=e.indexOf(`:`);if(t!==-1)return[e.slice(0,t).trim(),e.slice(t+1).trim().replace(/^["']|["']$/g,``)]}).filter(e=>!!e)),body:e.slice(t[0].length)}:{meta:{},body:e}},E=e=>e.replace(/!\[[^\]]*]\([^)]+\)/g,``).replace(/\[([^\]]+)]\([^)]+\)/g,`$1`).replace(/[`*_>#|:-]/g,``).replace(/\s+/g,` `).trim(),D=e=>{let t=E(e.split(`
`).find(e=>{let t=e.trim();return t&&!t.startsWith(`#`)&&!t.startsWith(`:::`)&&!t.startsWith(`![`)&&!t.startsWith(`- `)&&!t.startsWith(`|`)&&!t.startsWith("```")})??``);return t.length>180?`${t.slice(0,177)}...`:t},O=e=>{let t=E(e.replace(/```[\s\S]*?```/g,``)).match(/[\u4e00-\u9fff]|[A-Za-z0-9]+/g)?.length??0;return Math.max(2,Math.round(t/320))},k=e=>new Intl.DateTimeFormat(`en`,{month:`short`,day:`numeric`,year:`numeric`}).format(new Date(`${e}T00:00:00Z`)),A=(e,t)=>{let n=e.split(`/`).pop()?.replace(/\.md$/,``);if(!n||n===`index`)return;let{meta:r,body:i}=T(t),a=i.replace(/^#\s+.+\n+/,``);return{slug:n,title:r.title||n,author:r.author||`Team Memoh`,date:k(n),excerpt:D(a),readingMinutes:O(a),body:a}},j=Object.entries(w).map(([e,t])=>A(e,t)).filter(e=>!!e).sort((e,t)=>t.slug.localeCompare(e.slug)),M=e=>j.find(t=>t.slug===e),N={class:`w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10`},P={key:0,class:`flex flex-col gap-12`},F={class:`max-w-[760px] flex flex-col gap-5`},I={class:`inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground`},L={class:`p-6 md:p-8 flex flex-col gap-6`},R={class:`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground`},z={class:`inline-flex items-center gap-1.5`},B={class:`inline-flex items-center gap-1.5`},V={class:`inline-flex items-center gap-1.5`},H={class:`flex flex-col gap-3`},U={class:`text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-tight`},W={class:`text-sm md:text-base text-muted-foreground leading-relaxed`},G={class:`inline-flex items-center gap-2 text-sm font-medium text-foreground`},K={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},q={class:`flex flex-col gap-4`},J={class:`flex items-center justify-between gap-3 text-xs text-muted-foreground`},Y={class:`flex flex-col gap-3`},ae={class:`text-lg font-semibold tracking-tight text-foreground leading-snug`},oe={class:`text-sm text-muted-foreground leading-relaxed`},se={class:`mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground`},ce={key:1,class:`mx-auto max-w-[820px]`},le={class:`mb-10 flex flex-col gap-5 border-b border-border pb-8`},ue={class:`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground`},de={class:`inline-flex items-center gap-1.5`},fe={class:`inline-flex items-center gap-1.5`},pe={class:`inline-flex items-center gap-1.5`},me={class:`text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight`},he={class:`text-base md:text-lg text-muted-foreground leading-relaxed`},ge={key:0,class:`rounded-xl border border-border bg-background p-6 text-sm text-muted-foreground`},X=[`innerHTML`],_e={key:2,class:`mt-14 border-t border-border pt-8`},ve={class:`grid grid-cols-1 md:grid-cols-3 gap-4`},ye={class:`mb-2 text-xs text-muted-foreground`},be={class:`text-sm font-medium leading-snug text-foreground`},xe={key:2,class:`mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center`},Se={class:`rounded-xl border border-border bg-muted p-3 text-muted-foreground`},Z=v(i({__name:`BlogsPage`,setup(i){let m=re(),v=ne(),w=d(()=>{let e=m.params.slug;return typeof e==`string`?e:``}),T=d(()=>w.value.length>0),E=d(()=>w.value?M(decodeURIComponent(w.value)):void 0),D=d(()=>j[0]),O=d(()=>j.filter(e=>e.slug!==E.value?.slug).slice(0,3)),k=f(``),A=f(!1),Z=0,Q=d(()=>E.value?`${E.value.title} | Memoh Blog`:T.value?`Post not found | Memoh Blog`:`Memoh Blog`),$=d(()=>E.value?.excerpt||`Field notes, architecture writeups, and product updates from the Memoh team.`);return te({title:()=>Q.value,description:()=>$.value,ogTitle:()=>Q.value,ogDescription:()=>$.value,ogType:`article`,ogUrl:()=>`https://memoh.ai${m.path}`,twitterCard:`summary_large_image`,twitterTitle:()=>Q.value,twitterDescription:()=>$.value}),l(E,async e=>{let t=++Z;if(k.value=``,!e){A.value=!1;return}A.value=!0;let{renderMarkdown:n}=await ie(async()=>{let{renderMarkdown:e}=await import(`./markdown-Bh0IShU5.js`);return{renderMarkdown:e}},[]),r=await n(e.body);t===Z&&(k.value=r,A.value=!1)},{immediate:!0}),(i,l)=>(c(),h(`main`,N,[T.value?E.value?(c(),h(`article`,ce,[t(p(y),{to:`/blogs`,class:`mb-8 inline-flex items-center gap-2 rounded-md px-0 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:a(()=>[t(p(ee),{class:`w-4 h-4`}),l[7]||=r(` Back to blogs `,-1)]),_:1}),g(`header`,le,[g(`div`,ue,[g(`span`,de,[t(p(b),{class:`w-3.5 h-3.5`}),r(` `+n(E.value.date),1)]),g(`span`,fe,[t(p(C),{class:`w-3.5 h-3.5`}),r(` `+n(E.value.author),1)]),g(`span`,pe,[t(p(x),{class:`w-3.5 h-3.5`}),r(` `+n(E.value.readingMinutes)+` min read `,1)])]),g(`h1`,me,n(E.value.title),1),g(`p`,he,n(E.value.excerpt),1)]),A.value?(c(),h(`div`,ge,` Rendering code blocks... `)):(c(),h(`div`,{key:1,class:`blog-body`,innerHTML:k.value},null,8,X)),O.value.length?(c(),h(`section`,_e,[l[8]||=g(`h2`,{class:`mb-4 text-lg font-semibold tracking-tight text-foreground`},`More from Memoh`,-1),g(`div`,ve,[(c(!0),h(u,null,s(O.value,e=>(c(),o(p(y),{key:e.slug,to:`/blogs/${e.slug}`,class:`group rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:a(()=>[g(`p`,ye,n(e.date),1),g(`h3`,be,n(e.title),1)]),_:2},1032,[`to`]))),128))])])):e(``,!0)])):(c(),h(`section`,xe,[g(`div`,Se,[t(p(S),{class:`w-6 h-6`})]),l[9]||=g(`h1`,{class:`text-3xl font-semibold tracking-tight text-foreground`},`Post not found`,-1),l[10]||=g(`p`,{class:`text-muted-foreground`},`The blog post you opened does not exist in this landing site.`,-1),g(`button`,{type:`button`,class:`inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,onClick:l[0]||=e=>p(v).push(`/blogs`)},` Back to blogs `)])):(c(),h(`section`,P,[g(`header`,F,[g(`div`,I,[t(p(S),{class:`w-3.5 h-3.5`}),l[1]||=r(` Memoh Blog `,-1)]),l[2]||=g(`div`,{class:`flex flex-col gap-4`},[g(`h1`,{class:`text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]`},` Notes from the agent platform. `),g(`p`,{class:`text-base md:text-lg text-muted-foreground leading-relaxed max-w-[680px]`},` Product updates, architecture deep dives, and implementation notes from the Memoh team. `)],-1)]),D.value?(c(),o(p(y),{key:0,to:`/blogs/${D.value.slug}`,class:`group grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:a(()=>[g(`div`,L,[g(`div`,R,[g(`span`,z,[t(p(b),{class:`w-3.5 h-3.5`}),r(` `+n(D.value.date),1)]),g(`span`,B,[t(p(C),{class:`w-3.5 h-3.5`}),r(` `+n(D.value.author),1)]),g(`span`,V,[t(p(x),{class:`w-3.5 h-3.5`}),r(` `+n(D.value.readingMinutes)+` min read `,1)])]),g(`div`,H,[l[3]||=g(`span`,{class:`text-xs font-medium uppercase tracking-[0.16em] text-primary`},`Latest`,-1),g(`h2`,U,n(D.value.title),1),g(`p`,W,n(D.value.excerpt),1)]),g(`span`,G,[l[4]||=r(` Read article `,-1),t(p(_),{class:`w-4 h-4 transition-transform group-hover:translate-x-0.5`})])]),l[5]||=g(`div`,{class:`border-t md:border-t-0 md:border-l border-border bg-muted/35 p-6 md:p-8 flex items-end`},[g(`div`,{class:`w-full font-mono text-xs text-muted-foreground leading-relaxed`},[g(`div`,{class:`mb-4 flex items-center gap-1.5`},[g(`span`,{class:`h-2.5 w-2.5 rounded-full bg-red-400/80`}),g(`span`,{class:`h-2.5 w-2.5 rounded-full bg-yellow-400/80`}),g(`span`,{class:`h-2.5 w-2.5 rounded-full bg-green-400/80`})]),g(`p`,null,`agent.workspace.boot()`),g(`p`,{class:`text-foreground`},`container.isolated = true`),g(`p`,null,`memory.local_first = true`),g(`p`,null,`status = "always-on"`)])],-1)]),_:1},8,[`to`])):e(``,!0),g(`section`,K,[(c(!0),h(u,null,s(p(j).slice(1),e=>(c(),o(p(y),{key:e.slug,to:`/blogs/${e.slug}`,class:`group flex min-h-[260px] flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`},{default:a(()=>[g(`div`,q,[g(`div`,J,[g(`span`,null,n(e.date),1),g(`span`,null,n(e.readingMinutes)+` min`,1)]),g(`div`,Y,[g(`h2`,ae,n(e.title),1),g(`p`,oe,n(e.excerpt),1)])]),g(`span`,se,[l[6]||=r(` Read article `,-1),t(p(_),{class:`w-4 h-4 transition-transform group-hover:translate-x-0.5`})])]),_:2},1032,[`to`]))),128))])]))]))}}),[[`__scopeId`,`data-v-ed316864`]]);export{Z as default};