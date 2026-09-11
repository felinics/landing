import{At as e,B as t,E as n,F as r,W as i,_ as a,b as o,g as s,rt as c,yt as l}from"./vue.runtime.esm-bundler-W0gd1xqI.js";import{t as u}from"./settings-B7X8ZIL1.js";var d=[`srcdoc`],f=n({__name:`index`,props:{content:{},class:{default:void 0}},setup(n){let f=n,p=u(),m=l(``);function h(){if(typeof document>`u`)return;let e=getComputedStyle(document.documentElement),t=e.getPropertyValue(`--color-foreground`).trim(),n=e.getPropertyValue(`--color-surface-editor`).trim(),r=e.getPropertyValue(`--color-muted-foreground`).trim(),i=e.getPropertyValue(`--color-border`).trim(),a=e.getPropertyValue(`--color-accent`).trim(),o=p.resolvedColorMode===`dark`,s=p.uiFontStack,c=p.uiFontSizePx===16?`14px`:`${p.uiFontSizePx}px`,l=p.codeFontFamily?`\n  font-family: ${p.codeFontStack};`:``,u=p.codeFontSizePx===13?``:`\npre { font-size: ${p.codeFontSizePx}px; }`;m.value=`<style>
:root { color-scheme: ${o?`dark`:`light`}; }
html, body {
  color: ${t||`inherit`};
  background-color: ${n||`transparent`};
  font-family: ${s};
  font-size: ${c};
  line-height: 1.6;
}
body { margin: 16px; }
a { color: ${t||`inherit`}; }
hr { border-color: ${i||`currentColor`}; }
code, pre {
  background-color: ${a||`transparent`};
  color: ${t||`inherit`};${l}
}${u}
blockquote { color: ${r||`inherit`}; border-left: 3px solid ${i||`currentColor`}; padding-left: 12px; margin-left: 0; }
::selection { background-color: ${a||`rgba(127,127,127,0.3)`}; }
</style>`}t(()=>h()),c([()=>p.theme,()=>p.resolvedColorMode,()=>p.uiFontStack,()=>p.uiFontSizePx,()=>p.codeFontStack,()=>p.codeFontSizePx],async()=>{await r(),h()});let g=s(()=>m.value+(f.content??``));return(t,n)=>(i(),o(`div`,{class:e([`flex h-full w-full min-h-0 bg-surface-editor`,f.class])},[a(`iframe`,{srcdoc:g.value,sandbox:`allow-same-origin`,class:`h-full w-full border-0`,title:`HTML preview`,referrerpolicy:`no-referrer`},null,8,d)],2))}});export{f as default};