# Memoh landing 的实现索引

下列路径相对仓库根目录，核对于 2026-09-11。使用前确认当前入口与代码；不要把这份索引当成永久架构约束。

## 两种演示同时存在

| 场景 | 当前入口 | 主要修改位置 |
| --- | --- | --- |
| Computer 四宫格自动动画 | `src/pages/HomePage.vue` → `src/components/computer/ComputerSection.vue` | `src/components/computer/` |
| Hero 内嵌真实前端 | `src/components/HeroShowcase.vue` → `/memoh-demo/index.html` | `demo-app/` 源码与适配器 |

不要直接修生成目录 `public/memoh-demo/assets/`。先查 `package.json` 中的 build/dev 脚本，再重建并验证宿主页面。

## 四宫格动画：可复用机制与边界

- `DemoPlayer.vue`：逻辑画布、统一缩放、动画时钟、起播延迟、循环停顿、暂停、离屏、页面隐藏和 reduced-motion。
- `DemoCursor.vue`：测量目标、文字 Range、坐标换算、弧线动画、取消旧移动、暂停和到位事件。
- `useDemoCheckpoints.ts`：等待必要的到位事件；重播时清理已到位状态。
- `DesktopDemo.vue` / `BuildDemo.vue`：聚焦、输入、发送、工具结果和预览的场景顺序。
- `MemohComposer.vue`：演示焦点、插入符、发送/执行中状态。
- `MemohWindow.vue` / `MacTrafficLights.vue`：桌面窗口与标签栏的裁剪展示。
- `ToolCallDemo.vue`：按真实消息组件结构简化的过程展示，仍然是模拟组件，不等于完整产品渲染器。
- `computer.css`、`src/locales/en.json`、`src/locales/zh.json`：布局、动效与文案。

已有尺寸和时序只是这组场景的配置。修改场景后重新量目标，不能把旧坐标和秒数直接挪过去。

## 真实前端沙盒

先读 `demo-app/README.md`、`demo-app/UPSTREAM.json` 和相关 `AGENTS.md`。UPSTREAM 记录复制来源及版本，具体值以当前文件为准。

- `apps/web/src/demo-entry.ts` → `mocks/bootstrap.ts` → 原应用入口。
- `mocks/bootstrap.ts`：本次访问的内存存储、初始状态与传输替换；宿主凭证不应进入模拟应用。
- `mocks/data.ts`、`fixtures.ts`、`contracts.json`：状态与模拟 API 数据。
- `mocks/http.ts`、`chat.ts`、`terminal.ts`：HTTP、消息流及终端适配。
- `mocks/workspace-template.json`、`installed-skills.json`：工作区与技能文件数据；目录索引和文件读取应使用同一来源。
- `mocks/mock.test.ts`：模拟传输/状态回归测试。
- `patches/README.md`：局部上游补丁及移除条件。

当前 README 描述的是无 API 后端、远程桌面服务或真实终端的沙盒，设置导航也有边界。引用能力前检查当前代码，不把视觉入口当作真实服务承诺。

## 应追踪的产品源码

优先查当前 vendor 或实际运行 checkout，而不是固定依赖开发者机器上的绝对路径。

| 关注点 | 源码入口（相对 Memoh 前端 `apps/web/src/`） |
| --- | --- |
| 用户气泡、助手正文、过程分段 | `pages/home/components/message-item.vue` |
| 连续 tool/reasoning 聚合、阶段统计、当前步骤 | `pages/home/components/tool-call-group.vue` |
| 单条调用标题、目标、diff、详情展开 | `pages/home/components/tool-call-inline.vue`、`tool-call-registry.ts` |
| 标题间距、箭头、过程详情容器 | `pages/home/components/tool-detail/` |
| localhost 链接的内部预览行为 | `components/markdown/md-link.vue`、`store/workspace-tabs.ts` |
| 标签形状、字号、间距、分栏 | `styles/dockview-theme.css`、`pages/home/components/dockview/workspace-tab.vue`、`prefix-header-actions.vue` |
| Composer 中 Agent 与模型选择 | `pages/home/components/chat-pane.vue` |
| 商店列表、包详情与安装弹窗 | `pages/supermarket/` 及其引用组件 |
| 已安装包、依赖、Connector 授权 | `pages/bots/components/bot-packages.vue`、`package-detail-panel.vue` |

Mac 红绿灯还需查看桌面端窗口配置或 demo 的窗口控件适配。原生 Mac 控件与应用 tabs 不属于同一个源码层。

实际观察过的关键语义：

- 连续工具/思考片段可聚合；单条工具不会凭空多一层组标题。
- 聚合过程默认收起；执行中显示当前步骤，完成后正文独立出现。展开状态按产品逻辑维持，不能为了展示细节随意自动展开。
- `write` 等工具可能隐藏通用动作名，以文件名和 diff 表示；具体标题由 registry 决定。
- 商店列表和安装/授权/管理是不同层级，不能给每个包卡片随意加安装成功或已授权标记。

这些是观察索引，不是要求其他产品复制 Memoh 的交互。

## 参考站点的经验

本次研究了 `https://x.ai/bot` 的功能卡片、公开发布 JS、CSS 和运行 DOM。其演示使用基准尺寸、ResizeObserver 与统一 scale，外层控制留白与裁切。借鉴的是机制和节奏，不是把 Grok 的品牌、卡片配色或模拟应用组件照搬到 Memoh。

历史临时下载文件不随 skill 分发；如需进一步研究，应从当前页面加载的资源重新定位，并区分发布代码与原始源码。

## 验证命令的当前入口

- `npm run test:demo`：沙盒传输和状态回归。
- `npm run build`：当前会构建 pricing、demo、landing，并执行产物检查。
- `pnpm --dir demo-app dev`：单独开发内嵌应用。

先读当前 scripts 再执行。Skill 文档变更无需重建整个应用。历史 vendor 类型错误与本次改动引入的问题应分别说明，不为通过模拟演示检查而批量修复无关上游代码。
