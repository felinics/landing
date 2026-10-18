# 如何把 Memoh 接入 Slack？

帮助中心 › 消息渠道 · https://memoh.ai/help/channels/connect-slack

1. 在 [api.slack.com/apps](https://api.slack.com/apps) 创建应用，开启 **Socket Mode** 并生成 App-Level Token（`xapp-` 开头）；
2. 在 OAuth & Permissions 中把应用安装到工作区，获取 **Bot Token**（`xoxb-` 开头）；
3. 把两个 Token 填入 Memoh 的**平台 → Slack**，保存后把 Bot 拉进频道，@ 它即可对话。

Socket Mode 下同样无需公网回调地址。
