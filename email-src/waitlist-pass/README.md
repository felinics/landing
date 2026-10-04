# 候补通过邮件的通行证卡片

`card.html` 是 `public/email/waitlist-pass-*.png` 的源文件，`render.mjs` 负责出图。这个目录不在 `public/` 下，不会随站点部署。

- 邮件模板在 Memoh Cloud 后台维护（`iam.waitlist.approved.email`），按 locale 引用 `https://memoh.ai/email/waitlist-pass-<locale>.png`，显示尺寸 576×196。
- 改卡片：编辑 `card.html`，在浏览器打开 `card.html?l=zh-CN&stamp=1` 预览；然后运行 `node email-src/waitlist-pass/render.mjs`，原地覆盖 `public/email/` 下的图。文件名不变，模板不用改，已发出的邮件再打开也会显示新图；memoh.ai 对图片的缓存是 `max-age=14400`（4 小时），邮件客户端的图片代理可能更久。
- 已发布的图都带 `stamp=1`（压在撕口上的 APPROVED 章）。不带章的分支是早期对比用的。
- 不要改文件名或删除这些图：模板和已经发出的邮件都按这个地址引用。
