import React, { useState, useEffect } from 'react';
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

export default function Admin() {
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('admintk')||'');
  const [user, setUser] = useState(null);
  const [loginErr, setLoginErr] = useState('');
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState(() => {
      // Demo: could persist to backend as needed
      return JSON.parse(localStorage.getItem('channelsEnabled') || 'null') || initialChannels.map(c => ({name:c, enabled:true}));
  });

  // Auth helpers
  async function login(username, password) {
    try {
      const d = await apiFetch('/api/auth/login', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username,password}) });
      setToken(d.token); localStorage.setItem('admintk',d.token); setLoginErr('');
      await fetchMe(d.token);
    } catch(e) { setLoginErr(e.message); }
  }
  async function logout() {
    setToken(''); setUser(null); localStorage.removeItem('admintk');
  }
  async function fetchMe(tk = token) {
    if (!tk) return;
    try {
      const me = await apiFetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tk } });
      setUser(me.user);
    } catch (e) { setUser(null); }
  }

  // User admin
  async function fetchUsers() {
    try {
      const res = await apiFetch('/api/auth/users/admin', { headers: { Authorization: 'Bearer ' + token } });
      setUsers(res);
    } catch { setUsers([]); }
  }
  async function setAdmin(username, isAdmin) {
    await apiFetch('/api/auth/users/admin', {
      method:'POST',
      headers: {'Authorization':'Bearer ' + token, 'Content-Type':'application/json'},
      body: JSON.stringify({ username, setAdmin: isAdmin })
    });
    fetchUsers();
  }
  // Channels (show/hide)
  function toggleChannel(idx) {
    setChannels(cs => {
      const chs = cs.slice();
      chs[idx].enabled = !chs[idx].enabled;
      localStorage.setItem('channelsEnabled', JSON.stringify(chs));
      return chs;
    });
  }

  useEffect(() => { if (token) { fetchMe(); fetchUsers(); } }, [token]);

  // Container/Integration panel: drop container config code here
  function renderChannelSettings() {
    return (
      <div style={{margin:'12px 0',padding:'7px 14px', border:'1px solid #ccc',borderRadius:8}}>
        <b>Channel Visibility</b>
        <ul style={{listStyle:'none',padding:0,margin:'8px 0 0 0'}}>
        {channels.map((c,i) => (
          <li key={c.name}>
            <label>
              <input type="checkbox" checked={!!c.enabled} onChange={()=>toggleChannel(i)} /> {' '}{c.name}
            </label>
          </li>
        ))}
        </ul>
        <div style={{color:'#888',fontSize:'.98em',marginTop:9}}>
          (Extend: persist to backend, or add per-user, group, or date-based visibility!)
        </div>
      </div>
    );
  }
  function renderUserAdmin() {
    return (
      <div style={{margin:'10px 0',padding:'7px 14px', border:'1px solid #ccc',borderRadius:8}}>
        <b>User management</b>
        <ul style={{listStyle:'none',padding:0,margin:'8px 0 0 0'}}>
        {users.map(u => (
          <li key={u.username} style={{marginBottom:6}}>
            {u.username} {u.isAdmin ? '(admin)' : ''}{' '}
            {u.username !== user?.username && (
              <button onClick={()=>setAdmin(u.username, !u.isAdmin)}>
                {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
              </button>)}
          </li>
        ))}
        </ul>
        <div style={{color:'#888',fontSize:'.97em',marginTop:9}}>
          (Does not allow deleting own admin, add as needed!)
        </div>
      </div>
    );
  }

  // Login form
  if (!token || !user) return (
    <section>
      <h2>Admin Login</h2>
      <form onSubmit={e=>{e.preventDefault();login(e.target.user.value,e.target.pw.value);}}>
        <input placeholder="Username" name="user" defaultValue="admin" />{' '}
        <input type="password" placeholder="Password" name="pw" defaultValue="admin123" />{' '}
        <button type="submit">Login</button>
      </form>
      {loginErr && <div style={{color:'red'}}>{loginErr}</div>}
      <div style={{fontSize:".98em",color:"#aaa",marginTop:8}}>
        (Default: admin / admin123, see backend/api/auth.js to update.)
      </div>
    </section>
  );

  // Admin panel
  return (
    <section>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0}}>Admin Panel</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{color:'#666',marginBottom:6}}>
        Signed in as <b>{user.username}</b> {user.isAdmin && '(admin)'}
      </div>

      {renderUserAdmin()}
      {renderChannelSettings()}
      <div style={{marginTop:12,padding:'9px 12px',border:'1px solid #ccc',borderRadius:9}}>
        <b>Channel Setup and Integration</b>
        <div style={{fontSize:"1.05em",margin:"5px 0 0 0"}}>
        To enable a new container/channel:<br />
        <ol style={{marginTop:"6px"}}>
        <li>Copy any channel file, drop in your code, register in ChannelContainer.js</li>
        <li>Toggle visibility here for rapid prototyping</li>
        <li>Extend backend for advanced integrations (API keys, remote config, DB, etc.)</li>
        </ol>
        </div>
      </div>
      <div style={{marginTop:14, color:'#aaa'}}>For customization, see <b>Admin.js</b> and <b>api/auth.js</b>. Ready for production adaptation!</div>
    </section>
  );
}
