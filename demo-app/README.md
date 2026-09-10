# Memoh landing demo

This workspace vendors the Memoh frontend, UI, icons, SDK, and Dockview patch. See
`UPSTREAM.json` for the exact source revisions and `LICENSE` for licensing.
The copied Chat components remain the basis of the demo.

The landing page embeds the static build at `/memoh-demo/index.html`. There is no
API server, remote desktop service, or running terminal behind the iframe.

- Entry: `apps/web/src/demo-entry.ts` → `mocks/bootstrap.ts` → original app.
- State: fresh in-memory storage per page load; no host credentials or settings.
- Workspace files: `workspace-template.json` copies `Memoh/templates/workspace` verbatim
  (excluding `.gitkeep`); runtime folders are simulated separately.
- Installed skills: `installed-skills.json` copies weather from the local Supermarket
  repository and humanizer / humanizer-zh from Memoh, with full documents, support
  files and licenses. Source revisions and destination paths are recorded in that
  fixture. Weather uses the registry namespace; the writing skills simulate user
  imports under `skills/user/personal`. Catalog, index, and file reads share this data.
- Data: `mocks/data.ts`, `fixtures.ts`, and generated API defaults in `contracts.json`.
- Transport: local fetch, chat stream, upload, and terminal adapters. Unknown API
  routes and external fetches fail locally instead of reaching a backend.
- Initial scene: original Chat with a seeded welcome conversation and sidebar.
- Navigation: Settings and Bot Settings are decorative. The memory router only
  admits Chat routes; settings source files remain vendored for provenance.
- Appearance: dark mode, Electron-style traffic lights inside the iframe.

From the landing workspace, `npm run dev` and `npm run build` build this static
app first. `npm run test:demo` runs local transport/state regression checks.
For standalone development: `pnpm --dir demo-app dev`.

The copied frontend has existing upstream typecheck errors. Production builds
and mock regression tests are checked separately; the vendor copy does not
attempt to repair unrelated upstream component typing.
