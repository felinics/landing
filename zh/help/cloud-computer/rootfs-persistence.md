# rootfs 可以当持久空间用吗？

帮助中心 › 云电脑与工作区 · https://memoh.ai/help/cloud-computer/rootfs-persistence

不能，请不要把 rootfs 当作持久存储。

平台将 rootfs 视为**一次性**的：镜像更新或工作区重建时，这一层会被整体替换。写入 /usr、/opt 等系统路径的内容都应视为临时的 —— 使用越久，被重置的概率越高。

真正持久的是**数据卷（默认挂载在 /data）**：

- /data 中的内容**始终保留**，跨镜像更新与重建不受影响；
- 平台自身也刻意把依赖缓存、Codex / Claude Code 等 CLI 的配置放在 /data 里 —— rootfs 被替换后，这些 CLI 会依靠 /data 中的副本自动装回；
- 需要长期保留的文件与配置请写入 /data；如果你维护了自定义环境，把安装脚本放进 /data，重建后让 Agent 一键恢复即可。
