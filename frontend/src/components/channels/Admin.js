import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

// Demo registry: In-memory; rehydrate from backend or user settings if needed
const initialChannels = [
  'Landing',
  'Image Gallery',
  'Live Video',
  'Productivity',
  'Blog (CMS)',
  'Three.js Game',
  'Game (Sample)',
  'Admin'
];

// LLM/Provider admin settings configuration
const LLM_FIELDS = [
  { name: 'LLM_PROVIDER', label: 'Provider', type: 'select',
    options: [
      { value: 'openai', label: 'OpenAI' },
      { value: 'google', label: 'Google Cloud Vision' },
      { value: 'deepseek', label: 'DeepSeek' },
    ] },
  { name: 'OPENAI_API_KEY', label: 'OpenAI API Key', type: 'password' },
  { name: 'OPENAI_API_MODEL', label: 'OpenAI Model (e.g. gpt-4o)', type: 'text' },
  { name: 'GOOGLE_API_KEY', label: 'Google Vision API Key', type: 'password' },
  { name: 'GOOGLE_VISION_REGION', label: 'Google Region', type: 'text' },
  { name: 'DEEPSEEK_API_KEY', label: 'DeepSeek API Key', type: 'password' },
  { name: 'EMBEDDING_ENABLE', label: 'Enable Embeddings/Vector DB', type: 'toggle'},
];

export default function Admin() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('admintk') || '');
  const [user, setUser] = useState(null);
  const [loginErr, setLoginErr] = useState('');
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState(() => {
    const stored = localStorage.getItem('channelsEnabled');
    return stored ? JSON.parse(stored) : initialChannels.map(c => ({ name: c, enabled: true }));
  });

  // LLM/Provider state
  const [llmConfig, setLlmConfig] = useState({});
  const [llmEdit, setLlmEdit] = useState({});
  const [llmEditOpen, setLlmEditOpen] = useState(false);
  const [llmSaveMsg, setLlmSaveMsg] = useState('');

  // Fetch current user info
  const fetchMe = useCallback(async (tk = token) => {
    if (!tk) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch('/api/auth/me', { headers: { Authorization: `Bearer ${tk}` } });
      setUser(me.user);
    } catch (e) {
      setUser(null);
    }
  }, [token]);

  // Fetch all users (admin only)
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }
    try {
      const res = await apiFetch('/api/auth/users/admin', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res);
    } catch {
      setUsers([]);
    }
  }, [token]);

  // Sync user and users on token change
  useEffect(() => {
    if (token) {
      fetchMe();
      fetchUsers();
    } else {
      setUser(null);
      setUsers([]);
    }
  }, [token, fetchMe, fetchUsers]);

  // Auth helpers
  const login = async (username, password) => {
    try {
      const d = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      setToken(d.token);
      localStorage.setItem('admintk', d.token);
      setLoginErr('');
      await fetchMe(d.token);
    } catch (e) {
      setLoginErr(e.message);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('admintk');
  };

  // Set admin status for a user
  const setAdmin = async (username, isAdmin) => {
    try {
      await apiFetch('/api/auth/users/admin', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, setAdmin: isAdmin })
      });
      fetchUsers();
    } catch (e) {
      // Optionally handle error
    }
  };

  // Toggle channel visibility
  const toggleChannel = idx => {
    setChannels(cs => {
      const chs = [...cs];
      chs[idx].enabled = !chs[idx].enabled;
      localStorage.setItem('channelsEnabled', JSON.stringify(chs));
      return chs;
    });
  };

  // Fetch model/api config for admin
  const fetchLLMConfig = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await apiFetch('/api/admin/env', { headers: { Authorization: `Bearer ${token}` } });
      setLlmConfig(resp.env);
      setLlmEdit({});
    } catch (e) {
      // Optionally handle error
    }
  }, [token]);

  // Save LLM config changes
  const saveLLMConfig = async e => {
    e.preventDefault();
    setLlmSaveMsg('');
    const body = {};
    LLM_FIELDS.forEach(f => {
      if (llmEdit[f.name] && llmEdit[f.name].trim() !== '') body[f.name] = llmEdit[f.name].trim();
    });
    if (!Object.keys(body).length) {
      setLlmSaveMsg('No changes.');
      return;
    }
    try {
      await apiFetch('/api/admin/env', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });
      setLlmSaveMsg('Updated successfully. Changes take effect next server restart.');
      setLlmEdit({});
      fetchLLMConfig();
    } catch (e) {
      setLlmSaveMsg('Failed to update config.');
    }
  };

  // Render channel settings UI
  const renderChannelSettings = () => (
    <div style={{ margin: '12px 0', padding: '7px 14px', border: '1px solid #ccc', borderRadius: 8 }}>
      <b>Channel Visibility</b>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
        {channels.map((c, i) => (
          <li key={c.name}>
            <label>
              <input type="checkbox" checked={!!c.enabled} onChange={() => toggleChannel(i)} /> {c.name}
            </label>
          </li>
        ))}
      </ul>
      <div style={{ color: '#888', fontSize: '.98em', marginTop: 9 }}>
        (Extend: persist to backend, or add per-user, group, or date-based visibility!)
      </div>
    </div>
  );

  // Render user admin UI
  const renderUserAdmin = () => (
    <div style={{ margin: '10px 0', padding: '7px 14px', border: '1px solid #ccc', borderRadius: 8 }}>
      <b>User management</b>
      <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0' }}>
        {users.map(u => (
          <li key={u.username} style={{ marginBottom: 6 }}>
            {u.username} {u.isAdmin ? '(admin)' : ''}
            {u.username !== user?.username && (
              <button onClick={() => setAdmin(u.username, !u.isAdmin)}>
                {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
              </button>
            )}
          </li>
        ))}
      </ul>
      <div style={{ color: '#888', fontSize: '.97em', marginTop: 9 }}>
        (Does not allow deleting own admin, add as needed!)
      </div>
    </div>
  );

  // Render LLM config UI
  const renderLLMConfigUi = () => {
    if (!llmConfig) return null;
    return (
      <div style={{ border: '1px solid #444', borderRadius: 8, padding: 14, marginTop: 18, maxWidth: 480 }}>
        <h3 style={{ margin: 0 }}>Language Model & Provider Settings</h3>
        <div style={{ fontSize: '1em', color: '#aaa', marginTop: 2, marginBottom: 13 }}>
          Select your default provider (OpenAI, Google, DeepSeek), add API keys, and (optionally) enable vector retrieval/RAG.
        </div>
        {llmSaveMsg && <div style={{ color: 'green', marginBottom: 9 }}>{llmSaveMsg}</div>}
        <form onSubmit={saveLLMConfig}>
          {LLM_FIELDS.map(field => (
            <div key={field.name} style={{ margin: '8px 0' }}>
              <label style={{ fontWeight: 500, marginRight: 15 }}>{field.label}: </label>
              {field.type === "select" ? (
                <select
                  value={llmEdit[field.name] !== undefined ? llmEdit[field.name] : (llmConfig[field.name] || 'openai')}
                  onChange={e => setLlmEdit(s => ({ ...s, [field.name]: e.target.value }))}
                  style={{ width: 200 }}>
                  {field.options.map(opt => (<option value={opt.value} key={opt.value}>{opt.label}</option>))}
                </select>
              ) : field.type === "toggle" ? (
                <input type="checkbox"
                  checked={!!(llmEdit[field.name] !== undefined ?
                    llmEdit[field.name] === 'true' || llmEdit[field.name] === true
                    : (llmConfig[field.name] === 'true' || llmConfig[field.name] === true))}
                  onChange={e => setLlmEdit(s => ({ ...s, [field.name]: e.target.checked }))} />
              ) : (
                llmEditOpen || typeof llmConfig[field.name] === 'undefined'
                  ? (<input type={field.type}
                    value={llmEdit[field.name] !== undefined ? llmEdit[field.name] : (llmConfig[field.name] || '')}
                    onChange={e => setLlmEdit(s => ({ ...s, [field.name]: e.target.value }))}
                    style={{ width: field.type === 'password' ? 260 : 280 }} />)
                  : (<span style={{ fontFamily: 'monospace', marginLeft: 12 }}>
                    {field.type === 'password'
                      ? (llmConfig[field.name + '_OBFUSCATED'] || '')
                      : ((llmConfig[field.name] || '') + '')}
                  </span>)
              )}
            </div>
          ))}
          <div style={{ margin: '16px 0' }}>
            {llmEditOpen
              ? <button type="submit">Save</button>
              : <button type="button" onClick={() => setLlmEditOpen(true)}>Edit</button>}
          </div>
        </form>
        <div style={{ fontSize: '.98em', color: '#888', marginTop: 6 }}>
          <b>Notes:</b>
          <ul style={{ margin: '5px 20px' }}>
            <li>Switching provider may require a compatible API key.</li>
            <li>Vector DB requires an OpenAI API key (or future: Pinecone/Weaviate setup).</li>
          </ul>
        </div>
      </div>
    );
  };

  // Login form
  if (!token || !user) return (
    <section>
      <h2>Admin Login</h2>
      <form onSubmit={e => { e.preventDefault(); login(e.target.user.value, e.target.pw.value); }}>
        <input placeholder="Username" name="user" defaultValue="admin" />{' '}
        <input type="password" placeholder="Password" name="pw" defaultValue="admin123" />{' '}
        <button type="submit">Login</button>
      </form>
      {loginErr && <div style={{ color: 'red' }}>{loginErr}</div>}
      <div style={{ fontSize: ".98em", color: "#aaa", marginTop: 8 }}>
        (Default: admin / admin123, see backend/api/auth.js to update.)
      </div>
    </section>
  );

  // Admin panel
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Admin Panel</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ color: '#666', marginBottom: 6 }}>
        Signed in as <b>{user.username}</b> {user.isAdmin && '(admin)'}
      </div>
      {renderUserAdmin()}
      {renderChannelSettings()}
      {renderLLMConfigUi()}
      <div style={{ marginTop: 12, padding: '9px 12px', border: '1px solid #ccc', borderRadius: 9 }}>
        <b>Channel Setup and Integration</b>
        <div style={{ fontSize: "1.05em", margin: "5px 0 0 0" }}>
          To enable a new container/channel:<br />
          <ol style={{ marginTop: "6px" }}>
            <li>Copy any channel file, drop in your code, register in ChannelContainer.js</li>
            <li>Toggle visibility here for rapid prototyping</li>
            <li>Extend backend for advanced integrations (API keys, remote config, DB, etc.)</li>
          </ol>
        </div>
      </div>
      <div style={{ marginTop: 14, color: '#aaa' }}>
        For customization, see <b>Admin.js</b> and <b>api/auth.js</b>. Ready for production adaptation!
      </div>
    </section>
  );
}
