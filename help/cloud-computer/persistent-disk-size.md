# What does the persistent disk size refer to?

Help Center › Cloud computer & workspace · https://memoh.ai/help/cloud-computer/persistent-disk-size

The "persistent disk size" shown on plans and during Bot creation refers to the **capacity of the /data persistent volume**, set while creating the Bot.

It does **not include the rootfs**: space taken by the system and the pre-installed environment doesn't count against this quota, and the rootfs isn't guaranteed to persist — keep long-lived files under /data.
