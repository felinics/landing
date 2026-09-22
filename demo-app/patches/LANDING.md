# Landing sandbox adaptations

`UPSTREAM.json` records the merged Memoh revision and its pinned UI revision.
The frontend, SDK, icons, UI and dependency patches are copied from those commits.
Synchronize using a three-way merge against the previous recorded revisions so
these adapters survive updates:

- `index.html`, `demo-entry.ts`, `main.ts`, `App.vue`, `vite.config.ts`, package
  scripts and TypeScript config bootstrap the isolated static app and build it
  under `/memoh-demo/`.
- `router.ts` uses memory history and limits navigation to Chat. Account and Bot
  Settings actions remain disabled; the new account menu retains upstream layout.
- `useChat.ws.ts` and `upload-with-progress.ts` use local mock transports.
- Window controls and the small desktop-shell spacing patches render decorative
  traffic lights on any host OS. The tab prefix follows the top-left dock group.
- `mocks/` owns data, in-memory storage and transport. Workdirs use the current
  `workdirs` response field; App catalog, install previews and installed lists
  share entities and validate revisions. Sidebar installations emit the current
  App SSE sequence without running software or contacting a backend.
- Runtime controls explicitly report unsupported optional capabilities in this
  sandbox. They do not imply a live Codex goal, permission or Plan execution.

The homepage's authored animation fragments remain in `src/components/computer/`.
Their composer follows the upstream two-row input plus separate session controls;
Agent selection lives below the input, and App installation starts in the
Supermarket sidebar. These fragments are illustrative, not a second live backend.

`mocks/scenario.json` shares the three Agent examples, named project folders and
Cloud Computer / Alex's Mac Mini targets with the authored demos. Locale labels
and the native composer trigger use the demo's Memoh name and cloud icon.

Supermarket icon digests resolve to bundled SVGs through the isolated SkillIcon
adapter; installed rows and catalog entries share the same icon metadata.

Folder menus show selectable projects only in drafts. Existing sessions show
their bound folder once; rendering both lists duplicated the checked folder.

Composer submission is disabled at handleSend before drafts, sessions or messages
are mutated. Input, model controls and the normal enabled send appearance remain;
both button clicks and Enter preserve the draft without starting a mock reply.
