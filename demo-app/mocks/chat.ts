import type { ChatWebSocket, WSClientMessage } from '../apps/web/src/composables/api/useChat.ws'
import type { UIStreamEventHandler, RuntimeCurrentRunView } from '../apps/web/src/composables/api/useChat.types'
import { conversation, now, user } from './data'

export function connectDemoSocket(botId: string, emit: UIStreamEventHandler): ChatWebSocket {
  let connected=true
  let seq=0
  const epoch='browser-demo'
  const timers=new Map<string,ReturnType<typeof setInterval>>()
  const runs=new Map<string,RuntimeCurrentRunView>()
  function snapshot(sid: string) {
    if(!connected)return
    emit({type:'runtime_snapshot',session_id:sid,epoch,seq:++seq,snapshot:{bot_id:botId,session_id:sid,epoch,seq,current_run_view:runs.get(sid),updated_at:now}})
  }
  function finish(sid: string, aborted=false) {
    const timer=timers.get(sid);if(timer)clearInterval(timer);timers.delete(sid)
    const run=runs.get(sid);if(!run)return
    run.status=aborted?'aborted':'completed'
    const history=conversation(sid)
    if(!history.some(t=>t.id===`${run.run_id}-assistant`)) history.push({id:`${run.run_id}-assistant`,turn_id:run.turn_id,turn_position:history.length,role:'assistant',timestamp:run.updated_at,messages:structuredClone(run.messages)})
    snapshot(sid)
  }
  function send(message: WSClientMessage) {
    if(!connected)return
    if(message.type==='runtime_subscribe'){queueMicrotask(()=>snapshot(message.session_id));return}
    if(message.type==='abort'){finish(message.session_id,true);return}
    if(message.type!=='message'&&message.type!=='retry_message'&&message.type!=='edit_message')return
    const sid=message.session_id??'session-welcome'
    if(timers.has(sid))return
    const text='text' in message?message.text??'Tell me more':''
    const history=conversation(sid)
    const time=new Date().toISOString()
    const turnId=crypto.randomUUID(),runId=crypto.randomUUID()
    const userTurn={id:`${runId}-user`,turn_id:turnId,turn_position:history.length+1,role:'user' as const,text,timestamp:time,sender_user_id:user.id,sender_display_name:user.display_name}
    history.push(userTurn)
    const zh=/[\u4e00-\u9fff]/.test(text)
    const answer=zh
      ? '可以，我们一起把这件事拆成几个清晰的步骤。\n\n1. **明确目标**：先选一个最想完成的结果。\n2. **收集上下文**：把相关笔记和资料放进工作区。\n3. **开始行动**：从一个今天就能完成的小任务开始。\n\n我会记住你的偏好，陪你继续推进。你也可以打开 **Settings**，试试模型、记忆、工具和工作区配置。\n\n*这是浏览器中的演示回复，没有调用 AI 服务。*'
      : "Let's make a little progress together.\n\n1. **Choose a clear outcome.** Start with the thing that matters most to you.\n2. **Bring the context together.** Keep your notes, sources, and files in one workspace.\n3. **Take one useful step.** Make it small enough to finish today.\n\nI'll keep your preferences in mind as we go. You can also explore **Settings** to try models, memory, tools, and workspace configuration.\n\n*This is a browser-only demo reply; no AI service is called.*"
    const run:RuntimeCurrentRunView={run_id:runId,turn_id:turnId,invocation_id:message.invocation_id,generation:runId,status:'running',started_at:time,updated_at:time,request_user_turn:userTurn,messages:[{id:1,type:'text',content:''}]}
    runs.set(sid,run)
    emit({type:'run_accepted',session_id:sid,invocation_id:message.invocation_id,run_id:runId,turn_id:turnId})
    snapshot(sid)
    let cursor=0
    const timer=setInterval(()=>{
      cursor+=12
      run.messages=[{id:1,type:'text',content:answer.slice(0,cursor)}]
      run.updated_at=new Date().toISOString()
      if(cursor>=answer.length)finish(sid)
      else snapshot(sid)
    },35)
    timers.set(sid,timer)
  }
  const socket:ChatWebSocket={send,abort:(_runId,sid)=>finish(sid,true),close(){connected=false;for(const timer of timers.values())clearInterval(timer);timers.clear();socket.onClose?.()},get connected(){return connected},onOpen:null,onClose:null}
  queueMicrotask(()=>socket.onOpen?.())
  return socket
}
