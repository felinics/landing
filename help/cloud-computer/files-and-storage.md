# Where are my files stored?

Help Center › Cloud computer & workspace · https://memoh.ai/help/cloud-computer/files-and-storage

Each Bot's files live in its own cloud workspace, isolated from every other Bot; storage comes with your plan.

One persistence rule to know:

- The **/data directory** is a persistent volume — files placed there are kept long-term.
- The **rootfs** (the rest of the system disk) is **not guaranteed to persist** and may be reset by system updates or instance rebuilds.

Have the agent keep anything important under /data. You can upload files to the agent directly, and ask it to organize, archive and send any file back to you. Deleting a Bot destroys its workspace along with it.
