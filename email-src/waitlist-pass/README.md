# 候补通过邮件的通行证卡片

`card.html` 是 `public/email/waitlist-pass-*.png` 的源文件，`render.mjs` 负责出图。这个目录不在 `public/` 下，不会随站点部署。

- 邮件模板在 Memoh Cloud 后台维护（`iam.waitlist.approved.email`），按 locale 引用 `https://memoh.ai/email/waitlist-pass-<版本>-<locale>.png`，显示尺寸 576×196。
- 改卡片：编辑 `card.html`，在浏览器打开 `card.html?l=zh-CN&stamp=1` 预览；然后把 `render.mjs` 里的 `version` 加一，运行 `node email-src/waitlist-pass/render.mjs`。合并部署后，再到后台把模板改为引用新文件名。
- 已发布的图都带 `stamp=1`（压在撕口上的 APPROVED 章）。不带章的分支是早期对比用的。
- 旧版本的图不要删，已经发出去的邮件还在引用。
