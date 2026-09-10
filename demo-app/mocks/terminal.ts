import { files } from './data'

// Implements the terminal's byte protocol entirely inside the iframe.
export class DemoTerminalSocket {
  static OPEN=1
  static CLOSED=3
  readyState=1
  binaryType='arraybuffer'
  onopen: ((event: Event)=>void)|null=null
  onmessage: ((event: MessageEvent)=>void)|null=null
  onclose: ((event: CloseEvent)=>void)|null=null
  onerror: ((event: Event)=>void)|null=null
  private line=''
  constructor(url: string | URL) {
    if(!String(url).includes('/container/terminal/ws')) throw new Error('No remote runtime in this browser demo')
    queueMicrotask(()=>{this.onopen?.(new Event('open'));this.output('Memoh browser workspace\r\nTry: ls, pwd, cat README.md, node --version, python --version\r\n\r\n$ ')})
  }
  private output(text:string) {if(this.readyState===1)this.onmessage?.(new MessageEvent('message',{data:text}))}
  send(data: string|ArrayBuffer|ArrayBufferView) {
    if(typeof data==='string')return
    for(const char of new TextDecoder().decode(data)) {
      if(char==='\r'||char==='\n') {
        const command=this.line.trim();this.line=''
        const result=command==='pwd'?'/data':command==='ls'?Object.keys(files).map(p=>p.replace('/data/','')).join('  '):command.startsWith('cat ')?files[`/data/${command.slice(4)}`]??'File not found':command==='node --version'?'v22.18.0':command==='python --version'?'Python 3.13.7':command.startsWith('echo ')?command.slice(5):command===''?'':'Demo terminal: try ls, pwd, cat README.md, or echo hello.'
        this.output(`\r\n${result.replaceAll('\n','\r\n')}\r\n$ `)
      } else if(char==='\x7f'){if(this.line){this.line=this.line.slice(0,-1);this.output('\b \b')}}
      else {this.line+=char;this.output(char)}
    }
  }
  close(){this.readyState=3}
}
