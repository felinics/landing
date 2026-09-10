<template>
  <!-- Electron's hidden titlebar places native traffic lights at (14, 13).
       DesktopShellKey makes the copied sidebar and collapsed tab strip reserve
       this space. The browser replica is decoration, not fake window actions. -->
  <div class="demo-window-controls" aria-hidden="true">
    <span data-light="close" />
    <span data-light="minimize" />
    <span data-light="maximize" />
  </div>
</template>
