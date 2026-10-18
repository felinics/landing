# Can I use the rootfs as persistent storage?

Help Center › Cloud computer & workspace · https://memoh.ai/help/cloud-computer/rootfs-persistence

No — please don't treat the rootfs as persistent storage.

The platform treats the rootfs as **disposable**: image updates and workspace rebuilds replace that layer wholesale. Anything written to system paths like /usr or /opt should be considered temporary — the longer you run, the more likely it is to be reset.

What actually persists is the **data volume (mounted at /data by default)**:

- Contents of /data are **always preserved**, across image updates and rebuilds.
- The platform itself deliberately keeps dependency caches and the configs of CLIs like Codex / Claude Code in /data — when the rootfs is replaced, those CLIs are reinstalled automatically from the copies kept there.
- Put anything you want to keep under /data. If you maintain a custom environment, keep its setup script in /data so the agent can restore everything after a rebuild.
