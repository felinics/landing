import assert from 'node:assert/strict'
import { test, mock } from 'node:test'
import { demoFetch, requests } from './http'
import { connectDemoSocket } from './chat'
import { DemoTerminalSocket } from './terminal'
import { conversation } from './data'
import contracts from './contracts.json'

const get = async(path:string) => (await demoFetch(`http://demo.local/api${path}`)).json()
const write = async(path:string,method:string,body?:unknown) => demoFetch(`http://demo.local/api${path}`,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)})

test('settings edits survive rereads and do not modify another bot',async()=>{
 const before=await get('/bots/bot-research/settings')
 assert.equal((await write('/bots/bot-memoh/settings','PUT',{chat_model_id:'model-0'})).status,200)
 assert.equal((await get('/bots/bot-memoh/settings')).chat_model_id,'model-0')
 assert.deepEqual(await get('/bots/bot-research/settings'),before)
})
test('create, edit and delete preserve list/detail consistency',async()=>{
 const response=await write('/providers','POST',{name:'Test Provider',client_type:'openai'})
 const created=await response.json()
 await write(`/providers/${created.id}`,'PUT',{name:'Renamed'})
 assert.equal((await get('/providers')).find((p:any)=>p.id===created.id).name,'Renamed')
 await write(`/providers/${created.id}`,'DELETE')
 assert.equal((await get('/providers')).some((p:any)=>p.id===created.id),false)
})
test('memory creation and updates are reflected in the memory collection',async()=>{
 const created=await(await write('/bots/bot-memoh/memory','POST',{message:'A useful new preference'})).json()
 await write(`/bots/bot-memoh/memory/${created.id}`,'PUT',{memory:'An updated preference'})
 assert.equal((await get('/bots/bot-memoh/memory')).results.find((m:any)=>m.id===created.id).memory,'An updated preference')
})
test('all copied GET contracts resolve locally, unknown endpoints fail closed',async()=>{
 for(const key of Object.keys(contracts)) {
  if(!key.startsWith('GET ')||key.endsWith('/events'))continue
  const path=key.slice(4).replace(/\{bot_id\}/g,'bot-memoh').replace(/\{[^}]+\}/g,'demo')
  const response=await demoFetch(`http://demo.local/api${path}`)
  assert.equal(response.status,200,key)
 }
 assert.equal((await demoFetch('https://example.invalid/private-api')).status,501)
 assert.equal((await demoFetch('http://demo.local/api/unmapped')).status,501)
 assert.equal(requests.at(-1)?.handled,false)
})
test('dependency operations emit the original SSE contract and update only their bot',async()=>{
 const response=await write('/bots/bot-memoh/dependencies/node','DELETE')
 const stream=await response.text()
 assert.match(stream,/"type":"started"/)
 assert.match(stream,/"type":"done"/)
 assert.equal((await get('/bots/bot-memoh/dependencies')).items.find((d:any)=>d.id==='node').status,'missing')
 assert.equal((await get('/bots/bot-research/dependencies')).items.find((d:any)=>d.id==='node').status,'installed')
})
test('chat streams, completes and persists its reply with no socket server',async()=>{
 mock.timers.enable({apis:['setInterval']})
 const events:any[]=[]
 const socket=connectDemoSocket('bot-memoh',event=>events.push(structuredClone(event)))
 socket.send({type:'message',invocation_id:'test-send',session_id:'test-chat',text:'Hello'})
 assert.equal(events[0].type,'run_accepted')
 mock.timers.tick(5000)
 assert.equal(events.at(-1).snapshot.current_run_view.status,'completed')
 assert.match(conversation('test-chat').at(-1)?.messages[0].content,/browser-only demo/)
 socket.close();mock.timers.reset()
})
test('terminal commands are interpreted locally',async()=>{
 const socket=new DemoTerminalSocket('ws://demo.local/api/bots/bot-memoh/container/terminal/ws')
 const output:string[]=[];socket.onmessage=e=>output.push(e.data)
 await Promise.resolve()
 socket.send(new TextEncoder().encode('pwd\r'))
 assert.match(output.join(''),/\/data/)
 socket.close()
})

test('file listing preserves nested directories and reads copied workspace templates', async () => {
 const list = (path:string) => get(`/bots/bot-memoh/container/fs/list?path=${encodeURIComponent(path)}`)
 const root = await list('/data')
 assert.equal(root.entries.find((e:any) => e.name === '.memoh').isDir, true)
 assert.equal(root.entries.some((e:any) => e.name === 'hooks.json'), false)
 const metadata = await list('/data/.memoh/')
 assert.equal(metadata.entries.find((e:any) => e.name === 'hooks.json').path, '/data/.memoh/hooks.json')
 const skills = await list('/data/.memoh/skills')
 const skill = skills.entries.find((e:any) => e.isDir)
 const children = await list(skill.path)
 const document = children.entries.find((e:any) => e.name === 'SKILL.md')
 const read = await get(`/bots/bot-memoh/container/fs/read?path=${encodeURIComponent(document.path)}`)
 assert.match(read.content, /name:/)
 assert.deepEqual((await list('/data/.memoh/media')).entries, [])
 assert.deepEqual((await list('/data/.memo')).entries, [])
})

test('installed skill catalog uses the same complete documents as the file browser and index', async () => {
 const {skills} = await get('/bots/bot-memoh/container/skills')
 const root = await get('/bots/bot-memoh/container/fs/list?path=/data/skills')
 assert.deepEqual(root.entries.filter((entry:any) => entry.isDir).map((entry:any) => entry.name).sort(), skills.map((skill:any) => skill.name).sort())
 const read = (path:string) => get(`/bots/bot-memoh/container/fs/read?path=${encodeURIComponent(path)}`)
 const index = JSON.parse((await read('/data/.memoh/skills/index.json')).content)
 for (const skill of skills) {
  assert.equal((await read(skill.source_path)).content, skill.raw)
  assert.ok(index.items.some((entry:any) => entry.name === skill.name && entry.source_path === skill.source_path))
  const parent = await get(`/bots/bot-memoh/container/fs/list?path=${encodeURIComponent(skill.source_path.replace('/SKILL.md',''))}`)
  assert.ok(parent.entries.some((entry:any) => entry.name === 'SKILL.md' && !entry.isDir))
 }
})
