---
title: 用户访谈｜Yayoi：散步时的灵感，也能继续往前走
author: Team Memoh
date: 2026-10-29
cover: /blogs/user-interview-yayoi/cover.jpg
---

# 用户访谈｜Yayoi：散步时的灵感，也能继续往前走

![用户访谈封面：与 Yayoi 聊聊他的 Memoh 日常。散步时的灵感，也能继续往前走。一台全天候开发机，接住随时出现的新想法。右侧是 Yayoi 的头像和 @Yayoi_no_yume](/blogs/user-interview-yayoi/cover.jpg)

有些灵感，总是在离开电脑后才出现。Yayoi 常在散步时冒出新想法。想到一个新设计，他就在 Telegram 里给 Memoh 发条消息，路上先看一眼网页的大致效果，回家再接着改。

这次，我们和首批用户 Yayoi [@Yayoi_no_yume](https://x.com/Yayoi_no_yume) 聊了聊，他如何用每月 5 美元的 Go 套餐，把 Memoh 用成了一台 24 小时在线的开发机。

> 「Memoh 已经能够满足我的需求，我也不想再去看其他的产品了。」—— Yayoi

## 从支持朋友开始，到找到自己的用法

**Memoh：先介绍一下自己吧。**

Yayoi：我是 Yayoi，一个爱把自己喜欢的东西拆开看看、再想办法装回去的人。

**Memoh：你最早是怎么知道 Memoh 的？**

Yayoi：最早是在 X 上看到身边的朋友加入了 Memoh。

从那一刻起，Memoh 对我来说就是一个有朋友参与的产品。抱着支持朋友的心情，我想试一试。

**Memoh：真正用起来之后，哪些地方吸引了你？**

Yayoi：首先是性价比。我用的是 Go 套餐，每月 5 美元，有 8 核、16GB 内存、40GB 存储，每月还有 2500 credits 的模型额度。

实际上手后，我发现 Memoh 的开发环境和工具比较完备，可以直接在上面搭建自己的 Bot 团队，也支持与各种通讯平台连接，比如我用的最多的 Telegram。

我也看过其他人分享一些 Bot 产品的体验，但我还是喜欢 Memoh。

它也是一个很棒的开源项目：[https://github.com/felinics/Memoh](https://github.com/felinics/Memoh)。

我可以自己去找产品相关的问题，去给项目提 Pull Request，或者把问题反馈给官方的开发者，把喜欢的工具打造成趁手的样子。

## 手机上派活，电脑前用 SSH

出门在外，Yayoi 在 Telegram 里给 Memoh 派活；回到电脑前，他就用 SSH 登进这台机器敲命令。SSH 是他自己开的，弄好之后让 AI 按任务记录整理成教程，自己审过一遍，发在了 X 和自己的博客上。

![Yayoi 在 X 上分享的截图：通过 SSH 登录 Memoh 云电脑并运行 fastfetch，显示 Debian 13、8 核 CPU 和约 16 GiB 内存](/blogs/user-interview-yayoi/ssh-fastfetch.jpg)

_「给 @memoh_ai 上的机器开启SSH，这下执行命令行更加方便了。教程见评论区文章链接，由AI根据任务记录整理并由我个人审核。」——Yayoi，[10 月 21 日发布于 X](https://x.com/Yayoi_no_yume/status/2112753070388208124)_

[https://blog.yayoi.love/post/memoh-ssh](https://blog.yayoi.love/post/memoh-ssh)

**Memoh：现在，Memoh 主要帮你做什么？**

Yayoi：主要是作为一台 24 小时在线的开发机为我工作。得益于配置比较好，我可以在上面进行一些负载较大的开发和编译工作，解放了我本地的电脑。

**Memoh：有没有一个特别能代表你使用习惯的场景？**

Yayoi：我在外面散步的时候，总是会产生一些新设计和新想法。这时候，只需要在 Telegram 里给 Memoh 发消息就可以了。

Memoh 自带的浏览器环境，可以让我方便地预览网页界面的大致效果，回到家稍微改造一下就能用了。

## 定时任务替他盯论坛、管资料库

Yayoi 使用 Memoh 的定时任务功能，有的用来收集信息，有的用来照看机器。照看机器的那个每小时跑一次：检查机器上常驻的守护进程，掉线就自动重启。

![Memoh 的编辑任务界面：名为 keep alive 的定时任务每小时运行一次，指令是检查 lody daemon 的运行状态，掉线就执行 lody daemon restart](/blogs/user-interview-yayoi/keep-alive-task.png)

_「尝试了那么多memoh保活方法，这是唯一有效的一个」——Yayoi，[10 月 9 日发布于 X](https://x.com/Yayoi_no_yume/status/2108461185406489007)_

**Memoh：除了开发，你还会用 Memoh 做哪些事？**

Yayoi：我会用定时任务收集需要的信息。比如，关注 Windows 论坛上针对某个系统问题的最新通告和解决方案。

我很重视文档的采集和管理，Memoh 的定时任务和浏览器功能，可以让我更方便地获取和更新文档资料库，而且可以直接存在云电脑的存储里面。

## “前一天有人反馈，第二天就修好了”

今年 10 月 12 日，Yayoi 在 Memoh 的 Telegram 群里看到有人也在反映僵尸进程的问题。第二天傍晚，开发者回他："修好了，今晚会更新一次，明天应该就能用了。"当晚他在 X 上写：[「没想到今晚就搞定了！……一直以来辛苦了！」](https://x.com/Yayoi_no_yume/status/2110030123982577805)

![Telegram 对话截图，10 月 13 日：开发者回复「修好了，今晚会更新一次，明天应该就能用了」，Yayoi 回复「太好了！」「谢谢你！」](/blogs/user-interview-yayoi/zombie-process-fix.jpg)

_「memoh僵尸进程的问题解决了！我昨天看到tg群里有人也在反应僵尸进程相关的问题，没想到今晚就搞定了！☺️ 一直以来辛苦了！」——Yayoi，[10 月 13 日发布于 X](https://x.com/Yayoi_no_yume/status/2110030123982577805)_

**Memoh：使用过程中，有哪些体验让你印象比较深？**

Yayoi：跟团队沟通挺方便的。在 Telegram 群里，有佩奇（群里的答疑 Bot）帮忙解答问题，偶尔也有 Memoh 的开发者来帮忙，还可以直接私信反馈。

近期的体验很稳定，我没有遇到什么大问题。能感受到它的优化，相比最初认识的它，已经有很大不同。

我其实也很喜欢 Memoh 的内置 Agent，感觉它对机器的熟悉和适配程度很高。

**Memoh：是什么让你愿意继续使用 Memoh？**

Yayoi：Memoh 已经能够满足我的需求，我也不想再去看其他的产品了。它响应反馈很及时。

看着自己常用的产品在慢慢变好，一时间也难以割舍吧？我肯定是乐意继续订阅下去的。

## 如果向更多人推荐，他会怎么说

**Memoh：最后，如果向身边人推荐 Memoh，你会怎么介绍？**

Yayoi：真拿你没办法，坐好咯。（笑）

如果你需要一台 24 小时在线、开发工具齐全的机器，可以看看 Memoh。你可以在上面搭自己的个人助理或者编码环境，直接在 Telegram、飞书这些通讯软件里跟它交流。

谢谢 Yayoi 的分享，也谢谢他从最早的尝试，一直用到今天。

也许当你下次散步时冒出一个想法，也可以尝试使用 Memoh，给 Memoh 发消息试试。

想照着做，你也可以从这几篇开始：

- [在云电脑上开发并预览应用](/help/cloud-computer#develop-and-preview)
- [创建定时任务](/help/tasks-and-proactive#create-scheduled-task)

有任何使用问题，也可以像他一样第一时间在 Telegram 群聊或 support 邮箱联系我们：

- **Telegram**：[https://t.me/memohai](https://t.me/memohai)
- **支持邮箱**：[support@memoh.net](mailto:support@memoh.net)

欢迎关注我们这次的访谈嘉宾 [@Yayoi_no_yume](https://x.com/Yayoi_no_yume)，认识这位喜欢折腾工具类产品的朋友。

也欢迎关注我们 [@memoh_ai](https://x.com/memoh_ai)，了解 Memoh 的更多用户故事。

*本文根据 Yayoi 提供的访谈原稿整理，回答经过节选与文字润色。文中套餐价格、配置及额度为受访时描述，当前方案请以 Memoh [定价页](/#pricing)为准。
