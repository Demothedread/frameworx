import React, { useState } from 'react';

export default function Productivity() {
  // Simple instructive to-do placeholder
  const [tasks, setTasks] = useState([]);
  const [inp, setInp] = useState('');

  return (
    <section>
      <h2>Productivity App</h2>
      <div style={{border: '1px solid #bbb', padding: 16, maxWidth: 360}}>
        <p style={{color:'#555'}}>
          <b>Productivity tools:</b> To-do, notes, or Kanban.<br />
          Start here or integrate an external SaaS productivity tool.
        </p>
        <form onSubmit={e => {e.preventDefault(); if (inp) setTasks([...tasks, inp]); setInp('');}}>
          <input placeholder="Add task..." value={inp} onChange={e => setInp(e.target.value)} />
          <button type="submit">Add</button>
        </form>
        <ul>
          {tasks.map((t,i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
      <div style={{marginTop:12, color:'#999',fontSize:'small'}}>
        (Commented extension in <b>Productivity.js</b>)
      </div>
    </section>
  );
}
