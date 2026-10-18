# Slack と連携するには？

ヘルプセンター › メッセージチャンネル · https://memoh.ai/help/channels/connect-slack

1. [api.slack.com/apps](https://api.slack.com/apps) でアプリを作成し、**Socket Mode** を有効にして App-Level Token（`xapp-` で始まる）を発行します。
2. OAuth & Permissions からワークスペースにインストールし、**Bot Token**（`xoxb-` で始まる）を取得します。
3. 2 つの Token を Memoh の**プラットフォーム → Slack** に入力して保存し、Bot をチャンネルに招待して @メンションすれば会話できます。

Socket Mode なので、ここでも公開コールバック URL は不要です。
