# How do I connect Memoh to Slack?

Help Center › Messaging channels · https://memoh.ai/help/channels/connect-slack

1. Create an app at [api.slack.com/apps](https://api.slack.com/apps), enable **Socket Mode** and generate an App-Level Token (starts with `xapp-`).
2. Install the app to your workspace under OAuth & Permissions and grab the **Bot Token** (starts with `xoxb-`).
3. Fill both tokens into Memoh under **Platforms → Slack**, save, invite the Bot to a channel and @mention it.

Socket Mode means no public callback URL here either.
