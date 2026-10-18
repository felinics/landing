# 如何把 Memoh 接入飞书？

帮助中心 › 消息渠道 · https://memoh.ai/help/channels/connect-feishu

1. 在[飞书开放平台](https://open.feishu.cn)创建企业自建应用，开启机器人能力；
2. 把应用的 **App ID** 和 **App Secret** 填入 Memoh 的**平台 → 飞书**；
3. 默认通过**长连接（WebSocket）**接收消息，无需公网回调地址，保存后在飞书里单聊或群里 @ 它即可。

使用国际版 Lark 时把区域切换为 **Lark**；如需改用 Webhook 回调模式，再补充 Encrypt Key 与 Verification Token。
