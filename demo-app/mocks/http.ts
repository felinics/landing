import { seedBotRoutes, listRows } from './fixtures'
import contracts from './contracts.json'
import { bots, providers, models, settings, sessions, user, now, conversation, dependencies, packages, installedSkills, files, directories, type RecordData } from './data'

const nativeFetch = globalThis.fetch.bind(globalThis)
const responses = contracts as Record<string, any>
export const requests: { method: string; path: string; handled: boolean }[] = []
const saved = seedBotRoutes()
const clone = <T>(value: T): T => structuredClone(value)
const items = (values: any[]) => ({ items: values, total: values.length })
const providerRows = (names: string[], prefix: string) => names.map((name,i) => ({ id:`${prefix}-${i}`, name, provider:name.toLowerCase(), client_type:name.toLowerCase(), enable:true, is_default:i===0, config:{ api_key:'demo-key' }, created_at:now, updated_at:now }))
const collections: Record<string, any[]> = {
 '/providers': providers, '/models': models, '/users': [user, {...user,id:'user-2',username:'jamie',display_name:'Jamie Park',role:'user'}, {...user,id:'user-3',username:'sam',display_name:'Sam Rivera',role:'user'}],
 '/search-providers': providerRows(['Brave','Tavily','Exa'],'search'),
 '/fetch-providers': providerRows(['Jina','Native'],'fetch'),
 '/memory-providers': [{...providerRows(['Built-in'],'memory')[0],provider:'builtin',config:{embedding_model_id:'model-4'}}],
 '/speech-providers': providerRows(['OpenAI','ElevenLabs'],'speech-provider'),
 '/transcription-providers': providerRows(['OpenAI'],'transcription-provider'),
 '/video-providers': providerRows(['OpenRouter'],'video-provider'),
 '/email-providers': [{...providerRows(['Personal mail'],'email')[0],provider:'generic',config:{smtp_host:'smtp.example.com',smtp_port:587,username:'memoh@example.com',password:'demo-password'}}],
 '/speech-models': [{id:'speech-0',name:'Alloy',model_id:'gpt-4o-mini-tts',provider_id:'speech-provider-0',enable:true,config:{voice:'alloy'}}],
 '/transcription-models': [{id:'transcription-0',name:'Whisper',model_id:'whisper-1',provider_id:'transcription-provider-0',enable:true}],
 '/video-models': [{id:'video-0',name:'Sora',model_id:'sora',provider_id:'video-provider-0',enable:true}],
 '/users/me/runtimes': [{id:'runtime-1',name:'My MacBook',hostname:'alex-macbook',os:'darwin',arch:'arm64',online:true,workspace_base:'/Users/alex/projects',capabilities:['exec','fs'],client_version:'0.19.0',created_at:now}],
}
const routeEntries = Object.entries(responses).map(([key,value]) => {
 const [method, template] = key.split(' ') as [string,string]
 return {method,template,value,pattern:new RegExp(`^${template.replace(/\{[^}]+\}/g,'[^/]+')}$`)}
}).sort((a,b) => (a.template.match(/\{/g)?.length??0)-(b.template.match(/\{/g)?.length??0))
function baseResponse(method: string, path: string) {
 const route=routeEntries.find(r=>r.method===method&&r.pattern.test(path))
 return route ? {known:true,value:clone(route.value)} : {known:false,value:null}
}
function mergeObject(base: any, patch: any) {
 return {...(base && !Array.isArray(base) && typeof base==='object'?base:{}),...patch}
}
function collectionResponse(path: string, rows: any[]) {
 const base=baseResponse('GET',path).value
 return Array.isArray(base)?rows:mergeObject(base,items(rows))
}
function read(path: string, query: URLSearchParams): any {
 if(path.endsWith('/memory/graph')) {
  const memories=saved.get(path.replace('/graph',''))?.results??[]
  return {nodes:memories.map((m:RecordData)=>({id:m.id,label:m.memory.split(' ').slice(0,4).join(' '),memory:m.memory,count:1,memory_ids:[m.id]})),edges:memories.slice(1).map((m:RecordData)=>({source:memories[0].id,target:m.id,rel:'related',weight:1}))}
 }
 if(saved.has(path)) return saved.get(path)
 for(const [prefix,value] of saved) {
  const rows=listRows(value)
  if(rows && path.startsWith(`${prefix}/`)) {
   const id=path.slice(prefix.length+1)
   const item=rows.find(x=>(x.id??x.connection_id)===id)
   if(item)return item
  }
 }
 if(path==='/ping') return {version:'0.19.0',container_backend:'docker',snapshot_supported:true,connectors:true,commit_hash:'browser-demo'}
 if(path==='/users/me') return user
 if(path==='/bots') return items(bots)
 if(path==='/bots/name-availability') return {available:true}
 if(collections[path]) {
  let rows=collections[path]!
  for(const key of ['provider_id','type']) if(query.get(key)) rows=rows.filter(x=>x[key]===query.get(key))
  return collectionResponse(path,rows)
 }
 for(const [prefix,rows] of Object.entries(collections)) {
  if(path===`${prefix}/count`) return {count:rows.length}
  if(path.startsWith(`${prefix}/`) && path.slice(prefix.length+1).indexOf('/')<0) {
   const row=rows.find(x=>x.id===path.slice(prefix.length+1)); if(row) return row
  }
 }
 if(path==='/provider-templates') return providers.map(p=>({...p,id:p.provider_template_id,config_schema:{type:'object',properties:{api_key:{type:'string',title:'API key'}}}}))
 if(path.endsWith('/meta')) {
  const prefix=path.slice(0,-5), rows=collections[prefix]??[]
  return rows.map(p=>({...p,type:p.provider??p.client_type,provider:p.provider??p.client_type,config_schema:{type:'object',properties:{api_key:{type:'string',title:'API key'}}}}))
 }
 if(path==='/supermarket/packages') return {data:packages,page:1,limit:50,total:packages.length}
 if(path==='/supermarket/registries') return {registries:[{id:'memoh',name:'Memoh',description:'A collection of skills for everyday work',url:'',enabled:true}],items:[{id:'memoh',name:'Memoh'}]}
 if(path==='/supermarket/skills') return {data:packages.map(p=>({...p,skill_id:p.package_id,install_id:p.package_id,files:['SKILL.md'],author:{name:'Memoh'},source:{},artifact:{},category:'productivity',category_name:'Productivity'})),page:1,limit:50,total:packages.length}
 if(path==='/workspace-dependencies/catalog') return {items:dependencies}
 if(path==='/connectors/catalog') return ['GitHub','Notion','Slack','Google Drive'].map((name)=>({type:name.toLowerCase().replaceAll(' ','-'),status:'active',mode:'hosted',auth_methods:[{key:'oauth',label:'Connect account',type:'oauth2'}],name,description:`Connect your ${name} workspace`,auth_type:'oauth2',slug:name.toLowerCase().replaceAll(' ','-')}))
 if(path==='/channels') return ['telegram','discord','feishu','slack','email','weixin'].map(type=>({type,name:type,display_name:type,config_schema:{type:'object',properties:{token:{type:'string',title:'Token'}}},capabilities:{}}))
 const match=path.match(/^\/bots\/([^/]+)(.*)$/)
 if(match) {
  const [,bid,tail]=match as [string,string,string]
  const bot=bots.find(b=>b.id===bid||b.name===bid)??bots[0]!
  if(tail==='') return bot
  if(tail==='/settings') return {...settings}
  if(tail==='/agents') return items([{id:'agent-native',bot_id:bid,name:'Memoh',runtime:'native',enabled:true,metadata:{},created_at:now,updated_at:now},{id:'agent-codex',bot_id:bid,name:'Codex',runtime:'codex',enabled:true,metadata:{},created_at:now,updated_at:now},{id:'agent-claude',bot_id:bid,name:'Claude Code',runtime:'claudecode',enabled:true,metadata:{},created_at:now,updated_at:now}])
  if(tail==='/workspace-targets') return {targets:[{target_id:'container',kind:'container',name:'Workspace',online:true,primary:true,status:'running'}]}
  if(tail==='/workdirs') return {items:[{id:`${bid}-workdir`,bot_id:bid,name:'Workspace',path:'/data',target_kind:'container',workspace_target_id:'container',archived:false,created_at:now,updated_at:now}]}
  if(tail==='/sessions') return items(sessions.filter(s=>s.bot_id===bid))
  if(tail==='/sessions/model-preference-seed') return {model_id:'model-1',chat_model_id:'model-1',reasoning_effort:'medium'}
  if(/^\/sessions\/[^/]+$/.test(tail)) return sessions.find(s=>s.id===tail.split('/')[2])??{}
  if(tail==='/messages') return items(query.has('before')||query.has('before_message_id')?[]:conversation(query.get('session_id')??'session-welcome'))
  if(tail.endsWith('/status') && tail.startsWith('/sessions/')) return {message_count:12,skills:['research','writing'],context_usage:{used_tokens:8420,max_tokens:200000,context_window:200000},cache_stats:{}}
  if(tail==='/container') return {container_id:`demo-${bid}`,image:'memoh/workspace:latest',status:'running',task_running:true,container_path:'/data',runtime_backend:'docker',workspace_backend:'container',created_at:now,updated_at:now}
  if(tail.match(/^\/dependencies\/[^/]+\/script$/)) return {script:'# Browser-only demonstration\necho "Ready to install"',definition_revision:'demo-v1',dependency_id:tail.split('/')[2],version:'latest'}
  if(tail==='/container/terminal') return {available:true,shell:'/bin/bash'}
  if(tail==='/container/fs/list') {
   const path = (query.get('path') || '/data').replace(/\/+$/, '') || '/'
   const prefix = path === '/' ? '/' : `${path}/`
   const children = new Map<string, RecordData>()
   for (const entryPath of [...Object.keys(files), ...directories]) {
    if (!entryPath.startsWith(prefix)) continue
    const relative = entryPath.slice(prefix.length)
    if (!relative) continue
    const name = relative.split('/')[0]
    const childPath = `${prefix}${name}`
    const is_dir = relative.includes('/') || directories.has(childPath)
    children.set(name, {name, path:childPath, isDir:is_dir, size:is_dir ? 0 : new TextEncoder().encode(files[childPath] ?? '').length, mode:is_dir ? 493 : 420, mod_time:now})
   }
   return {path, entries:[...children.values()]}
  }
  if(tail==='/container/fs/read') return {path:query.get('path'),content:files[query.get('path')??'']??'# A new idea\n',encoding:'utf-8'}
  if(tail==='/dependencies') return {items:dependencies,workspace_state:'running',platform:{os:'linux',arch:'amd64'},catalog_stale:false,catalog_fetched_at:now}
  if(tail==='/container/skills'||tail==='/skills/catalog') return {skills:installedSkills}
  if(tail==='/connectors') return items([{id:'connection-github',connection_id:'connection-github',connector_id:'github',name:'GitHub',status:'connected',created_at:now},{id:'connection-notion',connection_id:'connection-notion',connector_id:'notion',name:'Notion',status:'connected',created_at:now}])
 }
 return baseResponse('GET',path).value
}
function eventStream(request: Request, data?: RecordData[]) {
 let end: (()=>void)|undefined
 const stream=new ReadableStream<Uint8Array>({start(controller){
  const encoder=new TextEncoder()
  controller.enqueue(encoder.encode(': browser demo\n\n'))
  if(data) {for(const event of data) controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));controller.close();return}
  end=()=>{try{controller.close()}catch{}}
  request.signal.addEventListener('abort',end,{once:true})
 },cancel(){if(end) request.signal.removeEventListener('abort',end)}})
 return new Response(stream,{headers:{'Content-Type':'text/event-stream'}})
}
export async function demoFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
 const request=new Request(input instanceof Request?input:new URL(String(input),globalThis.location?.origin??'http://demo.local'),init)
 const url=new URL(request.url)
 // Only static demo assets may leave the in-memory transport.
 if(url.origin===(globalThis.location?.origin??'http://demo.local')&&url.pathname.startsWith('/memoh-demo/')&&!url.pathname.includes('/api/')) return nativeFetch(request)
 const path=url.pathname.replace(/^\/api(?=\/)/,'')
 const method=request.method
 const contract=baseResponse(method,path)
 const known=contract.known
 requests.push({method,path,handled:known})
 if(!known) return Response.json({message:`Demo endpoint not implemented: ${method} ${path}`},{status:501})
 if(request.signal.aborted) throw new DOMException('Aborted','AbortError')
 if(path.endsWith('/events')) return eventStream(request)
 if(method==='GET') return Response.json(read(path,url.searchParams)??{})
 let body:RecordData={}
 try{body=await request.json()}catch{}
 if(path.endsWith('/container')&&method==='POST') {
  const container={...read(path,url.searchParams),status:'running',task_running:true}
  saved.set(path,container)
  return eventStream(request,[{type:'pull_skipped',image:'memoh/workspace:demo',message:'Browser demo'},{type:'creating'},{type:'complete',container}])
 }
 if(/\/container\/(start|stop)$/.test(path)) {
  const key=path.replace(/\/(start|stop)$/,'');const running=path.endsWith('/start')
  const container={...read(key,url.searchParams),status:running?'running':'stopped',task_running:running};saved.set(key,container);return Response.json(container)
 }
 if(path.endsWith('/memory/search')) {
  const source=saved.get(path.replace('/search',''))
  return Response.json({...source,results:source?.results.filter((m:RecordData)=>m.memory.toLowerCase().includes(String(body.query??'').toLowerCase()))??[]})
 }
 if(path.endsWith('/memory')&&body.message) body={...body,memory:body.message}
 if(path.endsWith('/hooks/test')) return Response.json({results:[],matched:0,success:true})
 if(path.endsWith('/check')||path.endsWith('/test')) return Response.json({...contract.value,success:true,ok:true,status:'ok',message:'Demo connection successful'})

 if(/\/dependencies\/[^/]+\/(install|reinstall|update|rollback)$/.test(path)||(/\/dependencies\/[^/]+$/.test(path)&&method==='DELETE')) {
  const dep=(saved.get(path.split('/dependencies/')[0]+'/dependencies')?.items??dependencies).find((d:RecordData)=>path.includes(`/${d.id}`))
  if(dep) {dep.status=method==='DELETE'?'missing':'installed';dep.actions=method==='DELETE'?['install']:['reinstall','remove','check_update']}
  return eventStream(request,[{type:'started',dependency_id:dep?.id??'',definition_revision:'demo-v1'},{type:'log',stream:'stdout',data:'Preparing local demonstration…\nDone.\n'},{type:'done',version:dep?.installed_version,definition_revision:'demo-v1'}])
 }
 if(path.endsWith('/container/fs/write')) {files[body.path]=body.content;return Response.json({path:body.path,revision:crypto.randomUUID()})}
 if(path.endsWith('/dependencies/check-updates')) return Response.json(saved.get(path.replace('/check-updates','')))
 if(path.endsWith('/connectors/oauth')||path.endsWith('/connectors/api-key')) {
  const row={connection_id:crypto.randomUUID(),connector_type:body.connector_type,alias:body.alias??body.connector_type,auth_method:body.auth_method??'oauth',enabled:true,status:'active'}
  saved.get(path.replace(/\/(oauth|api-key)$/,''))?.items.push(row)
  return Response.json({...row,authorization_url:'about:blank'})
 }
 for(const [prefix,value] of saved) {
  const rows=listRows(value);if(!rows)continue
  if(path===prefix&&method==='POST') {
   const row={...body,id:crypto.randomUUID(),created_at:now,updated_at:now};rows.push(row);return Response.json(row)
  }
  if(path.startsWith(`${prefix}/`)) {
   const id=path.slice(prefix.length+1)
   const index=rows.findIndex(x=>(x.id??x.connection_id)===id)
   if(index>=0){const row=rows[index];if(method==='DELETE')rows.splice(index,1);else Object.assign(row!,body);return Response.json(row??{})}
  }
 }
 let response:any
 const rows=collections[path]??(path==='/bots'?bots:path.match(/^\/bots\/[^/]+\/sessions$/)?sessions:null)
 if(method==='POST'&&rows) {
  response={...body,id:crypto.randomUUID(),created_at:now,updated_at:now}
  if(path.endsWith('/sessions')) Object.assign(response,{bot_id:path.split('/')[2],runtime_type:'native',type:'chat',session_mode:'chat',bot_agent_id:'agent-native',metadata:{},runtime_metadata:{}})
  if(path==='/bots') Object.assign(response,{status:'ready',is_active:true,current_user_permissions:['chat','manage','workspace_read','workspace_write']})
  rows.push(response)
 } else {
  let matched=false
  for(const [prefix,list] of [...Object.entries(collections),['/bots',bots] as const]) {
   const id=path.startsWith(`${prefix}/`)?path.slice(prefix.length+1):''
   const index=list.findIndex((x:any)=>x.id===id)
   if(index>=0) {matched=true;if(method==='DELETE'){list.splice(index,1);response={}}else{Object.assign(list[index],body);response=list[index]}break}
  }
  if(!matched) {
   const sid=path.match(/^\/bots\/[^/]+\/sessions\/([^/]+)$/)?.[1]
   const index=sessions.findIndex(s=>s.id===sid)
   if(index>=0){if(method==='DELETE')sessions.splice(index,1);else Object.assign(sessions[index]!,body);response=sessions[index]??{}}
   else {response=mergeObject(read(path,url.searchParams),body);saved.set(path,response)}
  }
 }
 return Response.json(mergeObject(contract.value,response))
}
