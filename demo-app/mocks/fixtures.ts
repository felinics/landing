import { codexModels, claudeCodeModels } from './agent-models'
import { bots, now, installedSkills, dependencies, type RecordData } from './data'

export function seedBotRoutes(): Map<string, any> {
  const routes=new Map<string,any>()
  for(const bot of bots) {
    const base=`/bots/${bot.id}`
    const put=(path:string,value:any)=>routes.set(base+path,value)
    const memories=['Alex prefers quiet mornings for deep work.','The reading tracker is this week’s main project.','Use short paragraphs and explain tradeoffs clearly.','Save research sources alongside the notes.','Take a walk after lunch.','Keep Friday afternoons open for reflection.']
      .map((memory,i)=>({id:`memory-${i}`,memory,bot_id:bot.id,score:0.95,created_at:now,updated_at:now,metadata:{category:i<3?'preferences':'notes'}}))
    put('/memory',{results:memories,relations:[],retrieval_mode:'graph'})
    put('/memory/graph',{nodes:memories.map(m=>({id:m.id,label:m.memory.split(' ').slice(0,4).join(' '),memory:m.memory,count:1,memory_ids:[m.id]})),edges:memories.slice(1).map(m=>({source:'memory-0',target:m.id,rel:'related',weight:1}))})
    put('/memory/status',{indexed_count:36,source_count:12,markdown_file_count:6,edge_count:18,provider_type:'builtin',memory_mode:'hybrid',can_manual_sync:true,encoder:{ok:true},pgvector:{ok:true},compact:{archive:true,rebuild_index:true,semantic:true}})
    put('/memory/usage',{count:memories.length,total_text_bytes:4608,avg_text_bytes:768,estimated_storage_bytes:16384})
    const days=Array.from({length:30},(_,i)=>({day:new Date(Date.now()-(29-i)*86400000).toISOString().slice(0,10),input_tokens:12000+i*413,output_tokens:3400+i*117,cache_read_tokens:8200+i*200,reasoning_tokens:420+i*40}))
    put('/token-usage',{chat:days,discuss:days.map(d=>({...d,input_tokens:2400,output_tokens:680,cache_read_tokens:1200,reasoning_tokens:100})),schedule:days.map(d=>({...d,input_tokens:1800,output_tokens:540,cache_read_tokens:800,reasoning_tokens:80})),acp_agent:[],by_model:[{model_id:'model-1',model_name:'DeepSeek V4.1 Flash',model_slug:'deepseek-v4.1-flash',provider_name:'DeepSeek',input_tokens:325000,output_tokens:89000,cache_read_tokens:183000,reasoning_tokens:13000}]})
    put('/token-usage/records',{items:days.slice(-12).reverse().map((d,i)=>({...d,id:`usage-${i}`,created_at:`${d.day}T08:00:00Z`,session_type:'chat',session_id:'session-welcome',model_id:'model-1',model_name:'DeepSeek V4.1 Flash',provider_name:'DeepSeek'})),total:12})
    put('/mcp',{items:[{id:'mcp-files',bot_id:bot.id,name:'Filesystem',type:'stdio',config:{command:'npx',args:['-y','@modelcontextprotocol/server-filesystem','/data']},is_active:true,status:'connected',auth_type:'none',tools_cache:[{name:'read_file',description:'Read a workspace file',inputSchema:{type:'object',properties:{}}}],created_at:now,updated_at:now}]})
    put('/schedule',{items:[{id:'schedule-1',bot_id:bot.id,name:'Morning brief',description:'A little clarity to start the day',pattern:'0 9 * * 1-5',command:'Summarize my priorities and recent notes.',enabled:true,runtime_type:'native',run_target:'new_session',model_id:'model-1',current_calls:14,max_calls:0,created_at:now,updated_at:now},{id:'schedule-2',bot_id:bot.id,name:'Weekly reflection',description:'Look back and make space for next week',pattern:'0 16 * * 5',command:'Prepare a weekly summary.',enabled:true,runtime_type:'native',run_target:'new_session',model_id:'model-0',current_calls:3,max_calls:0,created_at:now,updated_at:now}]})
    put('/connectors',{items:[{alias:'GitHub',connection_id:'connection-github',connector_type:'github',enabled:true,auth_method:'oauth',status:'active'},{alias:'Notion',connection_id:'connection-notion',connector_type:'notion',enabled:true,auth_method:'oauth',status:'active'}]})
    put('/agents/agent-codex/models', codexModels)
    put('/agents/agent-claude/models', claudeCodeModels)
    put('/agents',{items:[{id:'agent-codex',bot_id:bot.id,name:'Codex',runtime:'codex',enabled:true,agent_credential_id:'credential-demo',metadata:{provider:'codex',auth:'api_key'},created_at:now,updated_at:now},{id:'agent-claude',bot_id:bot.id,name:'Claude Code',runtime:'claude-code',enabled:true,metadata:{provider:'claude-code',auth:'workspace'},created_at:now,updated_at:now}]})
    put('/container/skills',{skills:installedSkills})
    const cap={hard_limit_supported:true,soft_limit_supported:true}
    put('/container/metrics',{backend:'docker',supported:true,sampled_at:now,status:{exists:true,task_running:true},metrics:{cpu:{usage_percent:12.4,usage_nanocores:124000000},memory:{usage_bytes:384*1024*1024,limit_bytes:2048*1024*1024,usage_percent:18.75},storage:{used_bytes:128*1024*1024,path:'/data'}},resource_limits:{desired:{cpu_millicores:2000,memory_bytes:2147483648,storage_bytes:10737418240},applied:{cpu_millicores:2000,memory_bytes:2147483648,storage_bytes:10737418240},capabilities:{cpu:cap,memory:cap,storage:cap},observed:{cpu_usage_percent:12.4,memory_usage_bytes:402653184,memory_limit_bytes:2147483648,storage_used_bytes:134217728},status:'applied',backend:'docker',runtime_backend:'docker',workspace_backend:'container'}})
    put('/email-bindings',[{id:'binding-1',bot_id:bot.id,provider_id:'email-0',email_address:'memoh@example.com',can_read:true,can_write:true,enabled:true,created_at:now}])
    put('/email-outbox',{items:[{id:'mail-1',to:['alex@example.com'],subject:'Your weekly research digest',status:'sent',sent_at:now,created_at:now}]})
    put('/compaction/logs',{items:[{id:'compact-1',created_at:now,status:'completed',tokens_before:82000,tokens_after:24000,summary:'Preserved project goals, preferences, and recent decisions.'}],total_count:1})
    put('/dependencies',{items:structuredClone(dependencies),workspace_state:'running',platform:{os:'linux',arch:'amd64'},catalog_stale:false,catalog_fetched_at:now})
  }
  return routes
}
export function listRows(value: any): RecordData[] | undefined {
  if(Array.isArray(value))return value
  return value?.items??value?.results??value?.skills
}
