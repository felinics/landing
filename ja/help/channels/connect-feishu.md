# Lark（飛書）と連携するには？

ヘルプセンター › メッセージチャンネル · https://memoh.ai/help/channels/connect-feishu

1. [飛書オープンプラットフォーム](https://open.feishu.cn)でカスタムアプリを作成し、ボット機能を有効にします。
2. アプリの **App ID** と **App Secret** を Memoh の**プラットフォーム → 飛書**に入力します。
3. メッセージはデフォルトで **WebSocket 長時間接続**で受信され、公開コールバック URL は不要です。保存すれば、DM やグループの @メンションで会話できます。

国際版 Lark を使う場合はリージョンを **Lark** に切り替えてください。Webhook モードにする場合は Encrypt Key と Verification Token も設定します。
