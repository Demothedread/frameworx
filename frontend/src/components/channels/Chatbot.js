import React, { useState, useRef } from 'react';
import { apiFetch } from '../../utils/api';

const AI_PROVIDERS = [
  { key:'openai', label:'OpenAI (GPT-3/4)' },
  { key:'gemini', label:'Google Gemini' },
  { key:'deepinfra', label:'DeepInfra LLaMA2' }
];
const PROFILE_OPTIONS = [
  { key: 'default', label: 'Default AI', model: 'gpt-3.5' },
  { key: 'legal', label: 'Legal Scholar', desc: 'Access legal precedent and legislation. Writes in a formal legal manner.', model: 'Legal Scholar' },
  { key: 'news', label: 'Newspaper', desc: 'Get today’s news and perform analysis.', model: 'Newspaper' },
  { key: 'fantasy', label: 'Fantasy Freeflow', desc: 'For creative projects, boosts imagination.', model: 'Fantasy Freeflow' }
];

function ChatbotMenu({
  apiKey, setApiKey, model, setModel, profile, setProfile, provider, setProvider,
  useRAG, setUseRAG, vectorStoreType, setVectorStoreType, openaiVectorStoreId, setOpenaiVectorStoreId,
  qdrantCollectionName, setQdrantCollectionName, customInstructions, setCustomInstructions
}) {
  return (
    <div style={{padding:16, background:'#ececf2', borderRadius:8, marginBottom:12}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div>
          <label style={{display:'block', marginBottom:8}}>
            <b>Provider:</b> {' '}
            <select value={provider} onChange={e=>setProvider(e.target.value)} style={{width:'100%'}}>
              {AI_PROVIDERS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </label>
          <label style={{display:'block', marginBottom:8}}>
            <b>Profile:</b>{' '}
            <select value={profile} onChange={e=>setProfile(e.target.value)} style={{width:'100%'}}>
              {PROFILE_OPTIONS.map(p=> <option value={p.key} key={p.key}>{p.label}</option>)}
            </select>
            <div style={{color:'#888',fontSize:'0.9em',marginTop:2}}>{PROFILE_OPTIONS.find(p=>p.key===profile)?.desc}</div>
          </label>
          <label style={{display:'block', marginBottom:8}}>
            <b>Model:</b>{' '}
            <input value={model} placeholder={provider==='openai' ? "gpt-3.5-turbo" : provider==='gemini' ? "gemini-pro" : "meta-llama/Llama-2-70b-chat-hf"} onChange={e=>setModel(e.target.value)} style={{width:'100%'}} />
          </label>
          <label style={{display:'block', marginBottom:8}}>
            <b>API Key:</b>{' '}
            <input type="password" value={apiKey} placeholder={provider==='openai' ? "OpenAI secret key..." : provider==='gemini' ? "Gemini API key..." : "DeepInfra API key..."} onChange={e=>setApiKey(e.target.value)} style={{width:'100%'}} />
          </label>
        </div>
        
        <div>
          <label style={{display:'block', marginBottom:8}}>
            <input type="checkbox" checked={useRAG} onChange={e=>setUseRAG(e.target.checked)} style={{marginRight:8}} />
            <b>Enable RAG (Knowledge Base)</b>
          </label>
          
          {useRAG && (
            <>
              <label style={{display:'block', marginBottom:8}}>
                <b>Vector Store:</b>{' '}
                <select value={vectorStoreType} onChange={e=>setVectorStoreType(e.target.value)} style={{width:'100%'}}>
                  <option value="uploadandsort">UploadAndSort (Local)</option>
                  <option value="local">Neon Database (Local)</option>
                  <option value="openai">OpenAI Vector Store</option>
                  <option value="qdrant">Qdrant Collection</option>
                </select>
              </label>
              
              {vectorStoreType === 'openai' && (
                <label style={{display:'block', marginBottom:8}}>
                  <b>OpenAI Vector Store ID:</b>{' '}
                  <input value={openaiVectorStoreId} onChange={e=>setOpenaiVectorStoreId(e.target.value)} placeholder="vs_xxx..." style={{width:'100%'}} />
                </label>
              )}
              
              {vectorStoreType === 'qdrant' && (
                <label style={{display:'block', marginBottom:8}}>
                  <b>Qdrant Collection:</b>{' '}
                  <input value={qdrantCollectionName} onChange={e=>setQdrantCollectionName(e.target.value)} placeholder="collection_name" style={{width:'100%'}} />
                </label>
              )}
            </>
          )}
          
          <label style={{display:'block', marginBottom:8}}>
            <b>Custom Instructions:</b>{' '}
            <textarea
              value={customInstructions}
              onChange={e=>setCustomInstructions(e.target.value)}
              placeholder="Add specific instructions for the AI..."
              rows={3}
              style={{width:'100%', resize:'vertical'}}
            />
          </label>
        </div>
      </div>
      
      <div style={{color:'#888', fontSize:'0.96em',marginTop:7}}>
        API keys are only used for remote model/cms calls. RAG enhances responses with your knowledge base. <b>Never share secrets unnecessarily!</b>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [prompt, setPrompt] = useState('');
  const [chatlog, setChatlog] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('ai_api_key')||'');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [profile, setProfile] = useState('default');
  const [provider, setProvider] = useState('openai');
  const [loading, setLoading] = useState(false);
  
  // RAG and Custom Instructions state
  const [useRAG, setUseRAG] = useState(false);
  const [vectorStoreType, setVectorStoreType] = useState('uploadandsort');
  const [openaiVectorStoreId, setOpenaiVectorStoreId] = useState(localStorage.getItem('openai_vector_store_id')||'');
  const [qdrantCollectionName, setQdrantCollectionName] = useState(localStorage.getItem('qdrant_collection_name')||'');
  const [customInstructions, setCustomInstructions] = useState(localStorage.getItem('custom_instructions')||'');
  
  const logEnd = useRef();

  function remember() {
    localStorage.setItem('ai_api_key', apiKey || '');
    localStorage.setItem('openai_vector_store_id', openaiVectorStoreId || '');
    localStorage.setItem('qdrant_collection_name', qdrantCollectionName || '');
    localStorage.setItem('custom_instructions', customInstructions || '');
  }

  function send(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    const myPrompt = prompt;
    setPrompt('');
    setChatlog(cl => [...cl, { role: 'user', text: myPrompt, ts: Date.now() }]);
    
    const requestBody = {
      prompt: myPrompt,
      profile,
      apiKey,
      model,
      provider,
      useRAG,
      vectorStoreType,
      openaiVectorStoreId,
      qdrantCollectionName,
      customInstructions
    };
    
    apiFetch('/api/chatbot/ask', {
      method:'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(requestBody)
    })
      .then(data => setChatlog(cl => [...cl, {
        role: 'bot',
        text: data.reply,
        botName: data.bot,
        source: data.source,
        ragResults: data.ragResults,
        usedRAG: data.usedRAG,
        searchResults: data.searchResults,
        ts: Date.now()
      }]))
      .catch(e => setChatlog(cl => [...cl, { role:'bot', text:'⚠️ Error: '+e.message }]))
      .finally(()=>setLoading(false));
    remember();
  }

  React.useEffect(() => {
    if (logEnd.current) logEnd.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatlog]);

  // --- Persona themed UI for chatbot container ---
  const personaCSS = themeCSS(profile);

  return (
    <section style={personaSectionStyle(profile)}>
      <style>{personaCSS}</style>
      <h2 className={"chatbot-persona-head"}>{personaName(profile)}</h2>
      <ChatbotMenu
        apiKey={apiKey} setApiKey={setApiKey}
        model={model} setModel={setModel}
        profile={profile} setProfile={setProfile}
        provider={provider} setProvider={setProvider}
        useRAG={useRAG} setUseRAG={setUseRAG}
        vectorStoreType={vectorStoreType} setVectorStoreType={setVectorStoreType}
        openaiVectorStoreId={openaiVectorStoreId} setOpenaiVectorStoreId={setOpenaiVectorStoreId}
        qdrantCollectionName={qdrantCollectionName} setQdrantCollectionName={setQdrantCollectionName}
        customInstructions={customInstructions} setCustomInstructions={setCustomInstructions}
      />
      <form onSubmit={send} style={{marginBottom:18, textAlign:'center'}}>
        <input className={"chatbot-prompt-inp"} value={prompt} onChange={e=>setPrompt(e.target.value)} 
          placeholder="Type your question or prompt..." autoFocus disabled={loading} />
        <button className={"chatbot-send-btn"} type="submit" disabled={loading}>Send</button>
      </form>
      <div className={"chatbot-log-main"}>
        {chatlog.length === 0 && <div style={{color:'#999'}}>No chat yet. Choose a profile and ask a question!</div>}
        {chatlog.map((msg, i) =>
          <div key={msg.ts || i} style={{margin:'7px 0', textAlign: msg.role==='user' ? 'right':'left'}}>
            {msg.role==='user' ? 
              <span className={"chatbot-user-msg"}>{msg.text}</span>
              :
              <div className={"chatbot-bot-msg chatbot-bot-msg-"+profile}>
                <div>
                  <b style={{color: profileColor(msg.botName || '')}}>{msg.botName||'Bot'}:</b> {' '}
                  {msg.usedRAG && <span style={{backgroundColor:'#e8f5e8', padding:'2px 6px', borderRadius:'3px', fontSize:'0.8em', color:'#2d5a2d'}}>RAG</span>}
                  {msg.searchResults && <span style={{backgroundColor:'#e8f0ff', padding:'2px 6px', borderRadius:'3px', fontSize:'0.8em', color:'#1a5490', marginLeft:'4px'}}>WEB</span>}
                </div>
                <span dangerouslySetInnerHTML={{__html:formatBotReply(msg.text, msg.botName, msg.source)}} />
                
                {/* Display RAG Results */}
                {msg.ragResults && msg.ragResults.length > 0 && (
                  <details style={{marginTop:'8px', fontSize:'0.9em'}}>
                    <summary style={{cursor:'pointer', color:'#666'}}>📚 Knowledge Base Sources ({msg.ragResults.length})</summary>
                    <div style={{marginTop:'4px', paddingLeft:'16px'}}>
                      {msg.ragResults.slice(0, 3).map((result, idx) => (
                        <div key={idx} style={{marginBottom:'6px', padding:'4px', backgroundColor:'#f9f9f9', borderRadius:'4px'}}>
                          <div style={{fontWeight:'bold', fontSize:'0.85em'}}>{result.filename || result.source || `Source ${idx + 1}`}</div>
                          <div style={{fontSize:'0.8em', color:'#666'}}>{(result.content_text || result.summary || result.content || '').slice(0, 150)}...</div>
                          {result.similarity && <div style={{fontSize:'0.75em', color:'#888'}}>Similarity: {(result.similarity * 100).toFixed(1)}%</div>}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                
                {/* Display Web Search Results */}
                {msg.searchResults && msg.searchResults.length > 0 && (
                  <details style={{marginTop:'8px', fontSize:'0.9em'}}>
                    <summary style={{cursor:'pointer', color:'#666'}}>🔍 Web Search Results ({msg.searchResults.length})</summary>
                    <div style={{marginTop:'4px', paddingLeft:'16px'}}>
                      {msg.searchResults.slice(0, 3).map((result, idx) => (
                        <div key={idx} style={{marginBottom:'6px', padding:'4px', backgroundColor:'#f0f8ff', borderRadius:'4px'}}>
                          <div style={{fontWeight:'bold', fontSize:'0.85em'}}>
                            <a href={result.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'#1a5490'}}>
                              {result.title}
                            </a>
                          </div>
                          <div style={{fontSize:'0.8em', color:'#666'}}>{result.snippet}</div>
                          <div style={{fontSize:'0.75em', color:'#888'}}>{result.court} - {result.date}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            }
          </div>
        )}
        <div ref={logEnd}></div>
      </div>
      <div style={{fontSize:'0.94em',marginTop:18,color:'#ccb'}}>Profiles: <b>Legal Scholar</b> queries precedent/legislation, <b>Newspaper</b> fetches headlines, <b>Fantasy Freeflow</b> maximizes creativity. Extend below!</div>
      <div style={{fontSize:'.91em', marginTop:4, color:'#888'}}>Edit <b>Chatbot.js</b> for new profiles or to improve AI/API integration!</div>
    </section>
  );
}

// Theme styling and helpers
function personaName(profile) {
  if(profile==='legal') return "Legal Scholar";
  if(profile==='news') return "Newspaper Analyst";
  if(profile==='fantasy') return "Fantasy Freeflow";
  return "Chatbot";
}
function personaSectionStyle(profile) {
  if(profile==='legal') return { maxWidth:680, margin:'auto', background:'#21170d', borderRadius:16, boxShadow:'0 0 24px #553', padding:12, border:'2px solid #502' };
  if(profile==='news') return { maxWidth:730, margin:'auto', background:'#faf7ee', border:'2px solid #bca', borderRadius: 20, boxShadow:'0 2px 36px #eed', padding:12 };
  if(profile==='fantasy') return { maxWidth:740, margin:'auto', background:'linear-gradient(140deg,#dfc7fd 0 70%, #92e5f4 80% 100%)', borderRadius:22, border:'2px solid #8c54b8', boxShadow:'0 0 32px #cabaff88', padding:16 };
  return { maxWidth: 650, margin:'auto', background:'#f4f4f7', borderRadius:13, padding:11 };
}
function themeCSS(profile) {
  if(profile==='legal') return `
    .chatbot-persona-head{ font-family:serif; font-size:2em; color:#f6dab7; text-shadow:1px 3px 9px #444; letter-spacing:1.3px; margin-bottom:9px; }
    .chatbot-prompt-inp{ border-radius:3px; background:#fff9f2; border:2px solid #aa813e; color:#432b10; font-family:serif;font-size:1.08em;padding:8px 13px; width:70%;max-width:370px;margin-right:9px; }
    .chatbot-log-main{ font-family:serif; background:#dcccb2aa;padding:8px 5px 14px 5px;border-radius:8px;min-height:160px;}
    .chatbot-user-msg{ background:#efd5b2;padding:6px 11px;border-radius:6px; }
    .chatbot-bot-msg-legal{ background:#bbae9b3a;color:#21170d; }
    .chatbot-send-btn{ background:#653c12;color:#fff;border:0;border-radius:6px; font-weight:bold;padding:10px 22px;}
  `;
  if(profile==='news') return `
    .chatbot-persona-head{ font-family:'Times New Roman',serif;font-size:2.2em;text-transform:uppercase;letter-spacing:1.2px;color:#372a22;background:#f3ebdd;border-radius:3px;padding:7px 0;margin-bottom:10px;border-bottom:2px solid #e2c977; }
    .chatbot-prompt-inp{ border-radius:4px; border:2px solid #bdae76; background:#fffff8; color:#2c2c21;font-size:1em;padding:8px 10px;width:76%;max-width:410px;margin-right:10px; }
    .chatbot-log-main{ font-family:'Courier New',monospace;background:#f9f9ea;border-radius:8px;padding:11px 8px;min-height:170px; }
    .chatbot-user-msg{ background:#fff9e0;color:#50503c;padding:5px 12px;border-radius:5px; }
    .chatbot-bot-msg-news{ background:#fff3ba;color:#282825; }
    .chatbot-send-btn{ background:#b7a163;color:#fff;border:0;border-radius:6px;font-weight:bold;padding:10px 26px;}
  `;
  if(profile==='fantasy') return `
    .chatbot-persona-head{ font-family:'Cinzel Decorative','Papyrus',serif;font-size:2em;color:#813dc3;text-shadow:2px 2px 10px #fff;letter-spacing:2px;margin-bottom:10px; }
    .chatbot-prompt-inp{ border-radius:8px; background:#faf7fe; border:2px solid #a887ea; color:#67006d;font-family:Papyrus,fantasy;font-size:1.09em;padding:9px 15px;width:75%;max-width:400px;margin-right:10px; }
    .chatbot-log-main{ font-family:'Papyrus','Comic Sans MS',fantasy;background:#bfa0e855;padding:10px 7px 16px 7px;min-height:175px;border-radius:13px; }
    .chatbot-user-msg{ background:#e9d1fa;color:#4b2463;padding:9px 13px;border-radius:10px; }
    .chatbot-bot-msg-fantasy{ background:#fbf4ff;color:#4b2463;font-style:italic;} 
    .chatbot-send-btn{ background:#883bb4;color:#fff;border:0;border-radius:7px;font-weight:bold;padding:9px 28px;box-shadow:0 2px 12px #ddd;}
  `;
  return `
    .chatbot-persona-head{font-size:2em;font-weight:bold;margin-bottom:8px;}
    .chatbot-prompt-inp{border-radius:4px;padding:8px 12px;width:72%;margin-right:11px;}
    .chatbot-log-main{background:#fff;border-radius:8px;padding:10px 6px;min-height:160px;}
    .chatbot-user-msg{background:#d5eaf4;padding:7px 11px;border-radius:6px;}
    .chatbot-bot-msg{background:#f6f6f6;}
    .chatbot-send-btn{background:#345;color:#fff;border:0;border-radius:6px;font-weight:bold;padding:10px 20px;}
  `;
}

function formatBotReply(text, bot, source) {
  if (bot==='Legal Scholar' && source && source.absolute_url) {
    return text + `<br /><b>Source:</b> <a href="https://www.courtlistener.com${source.absolute_url}" target="_blank" rel="noopener" style="color:#177">Read case <b>${source.caseName||'here'}</b></a>`;
  }
  if (bot==='Newspaper' && source) {
    return text + '<ul>'+source.map(a=>`<li>${a.title}</li>`).join('')+'</ul>';
  }
  return text;
}
function profileColor(bot) {
  if (/legal/i.test(bot)) return '#2727bb';
  if (/news/i.test(bot)) return '#883737';
  if (/fantasy/i.test(bot)) return '#8833bb';
  return '#373';
}
