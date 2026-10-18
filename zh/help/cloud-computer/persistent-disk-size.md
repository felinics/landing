# 持久化磁盘大小指的是什么？

帮助中心 › 云电脑与工作区 · https://memoh.ai/help/cloud-computer/persistent-disk-size

套餐与创建 Bot 时看到的"持久化磁盘大小"，指的是 **/data 持久化卷（volume）的容量**，在创建 Bot 的过程中设置。

它**不包括 Rootfs**：系统本身与预装环境占用的空间不计入这个额度，Rootfs 也不保证持久化 —— 需要长期保留的文件请放在 /data 下。
