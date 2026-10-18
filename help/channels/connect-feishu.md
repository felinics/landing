# How do I connect Memoh to Feishu (Lark)?

Help Center › Messaging channels · https://memoh.ai/help/channels/connect-feishu

1. Create a custom app on the [Feishu open platform](https://open.feishu.cn) and enable its bot capability.
2. Fill the app's **App ID** and **App Secret** into Memoh under **Platforms → Feishu**.
3. Messages arrive over a **WebSocket long connection** by default — no public callback URL needed. Save, then DM it or @mention it in any Feishu group.

Using international Lark? Switch the region to **Lark**. To use webhook mode instead, also provide the Encrypt Key and Verification Token.
