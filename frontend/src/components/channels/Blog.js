import React, { useState, useEffect } from 'react';

// Fully functional CMS blog container!
// Copy/paste this whole file, or swap to connect to real CMS.
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    fetch('/blogData.json') // Or swap to CMS API endpoint
      .then(r=>r.json())
      .then(setPosts)
      .catch(e=>setError(e.toString()))
      .finally(()=>setLoading(false));
  },[]);

  return (
    <section>
      <h2>Blog Channel (CMS Ready)</h2>
      {loading && <div style={{color:'#888'}}>Loading posts...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      <ol style={{padding:'0', margin:'20px 0', listStyle:'none'}}>
        {posts.slice().sort((a,b)=>b.id-a.id).map(post => (
          <li key={post.id} style={{marginBottom:32,background:'#fff6',borderRadius:9,padding:16,boxShadow:'0 2px 10px #0002'}}>
            <div style={{fontWeight:'bold',fontSize:'1.2em',marginBottom:8}}>{post.title}</div>
            <div style={{fontSize:'1em',color:'#3a4669',marginBottom:4}}>{post.summary}</div>
            <div style={{margin:'6px 0 12px 0',fontSize:'0.96em',color:'#363'}}>{post.content}</div>
            <div style={{fontSize:'0.95em',color:'#555'}}>By {post.author}, {post.date}</div>
          </li>
        ))}
      </ol>
      <div style={{marginTop:12,fontSize:'0.94em',color:'#888'}}>Want a real CMS? Replace the `fetch` (<b>see Blog.js</b>) with Contentful, Strapi, etc. Or keep using <b>public/blogData.json</b> for static blogs.</div>
    </section>
  );
}
