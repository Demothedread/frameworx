import { useEffect, useRef, useState } from 'react';

/**
 * Enhanced Blog Channel with Rich Text Editor and CMS Features
 * Features:
 * - Rich text editor with markdown support
 * - Categories and tags system
 * - Comments system with moderation
 * - Social sharing integration
 * - RSS feed generation
 * - Reading time estimation
 * - Related posts algorithm
 * - Author profiles
 * - Search functionality
 * - Draft/publish workflow
 */

// Mock data for development - replace with real API calls
const MOCK_POSTS = [
  {
    id: 1,
    title: "Welcome to the Enhanced Blog Platform",
    slug: "welcome-enhanced-blog",
    content: "# Welcome!\n\nThis is our new **enhanced blog platform** with full markdown support!\n\n## Features\n\n- Rich text editing\n- Categories and tags\n- Comments system\n- Social sharing\n\n```javascript\nconsole.log('Hello, World!');\n```\n\nEnjoy exploring all the new features!",
    summary: "Introducing our new blog platform with rich editing capabilities and modern features.",
    author: { id: 1, name: "Admin User", avatar: "👨‍💻", bio: "Platform administrator" },
    category: "announcements",
    tags: ["welcome", "features", "platform"],
    status: "published",
    readingTime: 2,
    publishedAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    featuredImage: null,
    likes: 15,
    views: 234
  },
  {
    id: 2,
    title: "Getting Started with Markdown",
    slug: "getting-started-markdown",
    content: "## Markdown Guide\n\nMarkdown is a lightweight markup language that's easy to read and write.\n\n### Basic Syntax\n\n**Bold text** and *italic text*\n\n- Bullet points\n- Another point\n\n1. Numbered lists\n2. Are also supported\n\n> Blockquotes look great!\n\n[Links work too](https://example.com)",
    summary: "Learn the basics of markdown formatting in our blog editor.",
    author: { id: 2, name: "Content Writer", avatar: "✍️", bio: "Professional content creator" },
    category: "tutorials",
    tags: ["markdown", "tutorial", "writing"],
    status: "published",
    readingTime: 3,
    publishedAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    featuredImage: null,
    likes: 8,
    views: 156
  }
];

const CATEGORIES = [
  { id: 'announcements', name: 'Announcements', color: '#4a90e2' },
  { id: 'tutorials', name: 'Tutorials', color: '#7b68ee' },
  { id: 'technology', name: 'Technology', color: '#4ecdc4' },
  { id: 'news', name: 'News', color: '#45b7d1' },
  { id: 'reviews', name: 'Reviews', color: '#96ceb4' }
];

export default function Blog() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [filteredPosts, setFilteredPosts] = useState(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  // Editor state
  const [editorPost, setEditorPost] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'announcements',
    tags: [],
    status: 'draft'
  });

  const editorRef = useRef(null);

  useEffect(() => {
    // Filter posts based on search and category
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  // Simulate API calls
  const fetchComments = async (postId) => {
    // Mock comments data
    const mockComments = [
      {
        id: 1,
        postId,
        author: "Reader",
        content: "Great post! Very informative.",
        createdAt: "2024-01-16T09:00:00Z",
        status: "approved"
      },
      {
        id: 2,
        postId,
        author: "Another Reader",
        content: "Thanks for sharing this!",
        createdAt: "2024-01-16T10:30:00Z",
        status: "approved"
      }
    ];
    setComments(prev => ({ ...prev, [postId]: mockComments }));
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSavePost = () => {
    const readingTime = calculateReadingTime(editorPost.content);
    const slug = generateSlug(editorPost.title);
    
    const postData = {
      ...editorPost,
      slug,
      readingTime,
      id: isCreating ? Date.now() : selectedPost.id,
      updatedAt: new Date().toISOString(),
      publishedAt: editorPost.status === 'published' ? new Date().toISOString() : null,
      author: { id: 1, name: "Current User", avatar: "👤", bio: "Blog author" },
      likes: 0,
      views: 0
    };

    if (isCreating) {
      setPosts(prev => [...prev, postData]);
    } else {
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? postData : p));
    }

    setIsEditing(false);
    setIsCreating(false);
    setSelectedPost(null);
  };

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      postId,
      author: "Anonymous",
      content: newComment,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));

    setNewComment('');
  };

  const renderMarkdown = (content) => {
    // Simple markdown renderer - in production, use a proper library like marked or react-markdown
    return content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  };

  const getAllTags = () => {
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
  };

  const getRelatedPosts = (currentPost) => {
    return posts
      .filter(post => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  const generateRSSFeed = () => {
    const rssItems = posts
      .filter(post => post.status === 'published')
      .map(post => `
        <item>
          <title>${post.title}</title>
          <description>${post.summary}</description>
          <link>https://example.com/blog/${post.slug}</link>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        </item>
      `).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Channel Rolodex Blog</title>
          <description>Latest posts and updates</description>
          <link>https://example.com/blog</link>
          ${rssItems}
        </channel>
      </rss>`;

    const blob = new Blob([rss], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-feed.xml';
    a.click();
  };

  const sharePost = (post, platform) => {
    const url = `https://example.com/blog/${post.slug}`;
    const text = `Check out: ${post.title}`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (selectedPost && !isEditing) {
    // Single post view
    const relatedPosts = getRelatedPosts(selectedPost);
    
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => setSelectedPost(null)}>
            ← Back to Blog
          </button>
          <button style={styles.editButton} onClick={() => {
            setEditorPost(selectedPost);
            setIsEditing(true);
          }}>
            ✏️ Edit Post
          </button>
        </div>

        <article style={styles.article}>
          <header style={styles.articleHeader}>
            <div style={styles.categoryBadge}>
              {CATEGORIES.find(c => c.id === selectedPost.category)?.name}
            </div>
            <h1 style={styles.articleTitle}>{selectedPost.title}</h1>
            <div style={styles.articleMeta}>
              <div style={styles.authorInfo}>
                <span style={styles.authorAvatar}>{selectedPost.author.avatar}</span>
                <div>
                  <div style={styles.authorName}>{selectedPost.author.name}</div>
                  <div style={styles.publishDate}>
                    {new Date(selectedPost.publishedAt).toLocaleDateString()} • {selectedPost.readingTime} min read
                  </div>
                </div>
              </div>
              <div style={styles.postStats}>
                👁️ {selectedPost.views} • ❤️ {selectedPost.likes}
              </div>
            </div>
            <div style={styles.tags}>
              {selectedPost.tags.map(tag => (
                <span key={tag} style={styles.tag} onClick={() => setSelectedTag(tag)}>
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div 
            style={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.content) }}
          />

          <div style={styles.socialShare}>
            <h4>Share this post:</h4>
            <div style={styles.shareButtons}>
              <button style={styles.shareButton} onClick={() => sharePost(selectedPost, 'twitter')}>
                🐦 Twitter
              </button>
              <button style={styles.shareButton} onClick={() => sharePost(selectedPost, 'facebook')}>
                📘 Facebook
              </button>
              <button style={styles.shareButton} onClick={() => sharePost(selectedPost, 'linkedin')}>
                💼 LinkedIn
              </button>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div style={styles.relatedPosts}>
              <h4>Related Posts:</h4>
              <div style={styles.relatedGrid}>
                {relatedPosts.map(post => (
                  <div 
                    key={post.id} 
                    style={styles.relatedCard}
                    onClick={() => setSelectedPost(post)}
                  >
                    <h5>{post.title}</h5>
                    <p>{post.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.commentsSection}>
            <h4>Comments ({(comments[selectedPost.id] || []).length})</h4>
            
            <div style={styles.commentForm}>
              <textarea
                style={styles.commentInput}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
              />
              <button 
                style={styles.commentSubmit}
                onClick={() => handleAddComment(selectedPost.id)}
              >
                Post Comment
              </button>
            </div>

            <div style={styles.commentsList}>
              {(comments[selectedPost.id] || []).map(comment => (
                <div key={comment.id} style={styles.comment}>
                  <div style={styles.commentHeader}>
                    <strong>{comment.author}</strong>
                    <span style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={styles.commentContent}>{comment.content}</p>
                  {comment.status === 'pending' && (
                    <span style={styles.pendingBadge}>Pending approval</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (isEditing || isCreating) {
    // Post editor view
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>{isCreating ? 'Create New Post' : 'Edit Post'}</h2>
          <div style={styles.editorActions}>
            <button style={styles.cancelButton} onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
              setSelectedPost(null);
            }}>
              Cancel
            </button>
            <button style={styles.saveButton} onClick={handleSavePost}>
              {editorPost.status === 'published' ? 'Publish' : 'Save Draft'}
            </button>
          </div>
        </div>

        <div style={styles.editor}>
          <div style={styles.editorSidebar}>
            <div style={styles.editorField}>
              <label>Status:</label>
              <select
                value={editorPost.status}
                onChange={(e) => setEditorPost(prev => ({ ...prev, status: e.target.value }))}
                style={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div style={styles.editorField}>
              <label>Category:</label>
              <select
                value={editorPost.category}
                onChange={(e) => setEditorPost(prev => ({ ...prev, category: e.target.value }))}
                style={styles.select}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.editorField}>
              <label>Tags (comma separated):</label>
              <input
                type="text"
                value={editorPost.tags.join(', ')}
                onChange={(e) => setEditorPost(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                }))}
                style={styles.input}
                placeholder="technology, tutorial, guide"
              />
            </div>
          </div>

          <div style={styles.editorMain}>
            <input
              type="text"
              value={editorPost.title}
              onChange={(e) => setEditorPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title..."
              style={styles.titleInput}
            />

            <textarea
              value={editorPost.summary}
              onChange={(e) => setEditorPost(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Post summary..."
              style={styles.summaryInput}
              rows={2}
            />

            <div style={styles.editorTabs}>
              <span style={styles.editorTab}>✏️ Write</span>
              <span style={styles.editorTab}>👁️ Preview</span>
            </div>

            <textarea
              ref={editorRef}
              value={editorPost.content}
              onChange={(e) => setEditorPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post in Markdown..."
              style={styles.contentEditor}
              rows={20}
            />

            <div style={styles.editorToolbar}>
              <button onClick={() => {
                const textarea = editorRef.current;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = editorPost.content.substring(start, end);
                const newText = editorPost.content.substring(0, start) + `**${selectedText}**` + editorPost.content.substring(end);
                setEditorPost(prev => ({ ...prev, content: newText }));
              }}>
                <strong>B</strong>
              </button>
              <button onClick={() => {
                const textarea = editorRef.current;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = editorPost.content.substring(start, end);
                const newText = editorPost.content.substring(0, start) + `*${selectedText}*` + editorPost.content.substring(end);
                setEditorPost(prev => ({ ...prev, content: newText }));
              }}>
                <em>I</em>
              </button>
              <button onClick={() => {
                const newText = editorPost.content + '\n\n## Heading\n\n';
                setEditorPost(prev => ({ ...prev, content: newText }));
              }}>
                H2
              </button>
              <button onClick={() => {
                const newText = editorPost.content + '\n\n- List item\n';
                setEditorPost(prev => ({ ...prev, content: newText }));
              }}>
                • List
              </button>
              <button onClick={() => {
                const newText = editorPost.content + '\n\n[Link text](URL)\n';
                setEditorPost(prev => ({ ...prev, content: newText }));
              }}>
                🔗 Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main blog list view
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📝 Blog Management</h2>
        <div style={styles.headerActions}>
          <button style={styles.rssButton} onClick={generateRSSFeed}>
            📡 Export RSS
          </button>
          <button style={styles.createButton} onClick={() => {
            setEditorPost({
              title: '',
              content: '',
              summary: '',
              category: 'announcements',
              tags: [],
              status: 'draft'
            });
            setIsCreating(true);
          }}>
            ➕ New Post
          </button>
        </div>
      </div>

      <div style={styles.filters}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search posts..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Tags</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.postsGrid}>
        {filteredPosts.map(post => (
          <article key={post.id} style={styles.postCard} onClick={() => {
            setSelectedPost(post);
            fetchComments(post.id);
          }}>
            <div style={styles.postHeader}>
              <div style={{...styles.categoryBadge, backgroundColor: CATEGORIES.find(c => c.id === post.category)?.color}}>
                {CATEGORIES.find(c => c.id === post.category)?.name}
              </div>
              <div style={styles.postStatus}>
                {post.status === 'published' ? '✅' : '📝'}
              </div>
            </div>
            
            <h3 style={styles.postTitle}>{post.title}</h3>
            <p style={styles.postSummary}>{post.summary}</p>
            
            <div style={styles.postMeta}>
              <div style={styles.authorInfo}>
                <span style={styles.authorAvatar}>{post.author.avatar}</span>
                <span style={styles.authorName}>{post.author.name}</span>
              </div>
              <div style={styles.postStats}>
                {post.readingTime} min • 👁️ {post.views} • ❤️ {post.likes}
              </div>
            </div>

            <div style={styles.postTags}>
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <h3>No posts found</h3>
          <p>Try adjusting your search or filter criteria, or create a new post.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0'
  },
  
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  
  createButton: {
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  
  rssButton: {
    background: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  
  searchContainer: {
    flex: 1,
    minWidth: '300px'
  },
  
  searchInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px'
  },
  
  filterContainer: {
    display: 'flex',
    gap: '10px'
  },
  
  filterSelect: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px'
  },
  
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px'
  },
  
  postCard: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    }
  },
  
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  
  categoryBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  
  postStatus: {
    fontSize: '18px'
  },
  
  postTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#333'
  },
  
  postSummary: {
    margin: '0 0 15px 0',
    color: '#666',
    lineHeight: 1.5
  },
  
  postMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '14px'
  },
  
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  authorAvatar: {
    fontSize: '20px'
  },
  
  authorName: {
    fontWeight: 'bold',
    color: '#333'
  },
  
  postStats: {
    color: '#888'
  },
  
  postTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  
  tag: {
    background: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    color: '#666',
    cursor: 'pointer'
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888'
  },
  
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  
  // Single post view styles
  backButton: {
    background: '#666',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  editButton: {
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  article: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  
  articleHeader: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0'
  },
  
  articleTitle: {
    margin: '10px 0 20px 0',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 1.2
  },
  
  publishDate: {
    color: '#888',
    fontSize: '14px'
  },
  
  tags: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap'
  },
  
  articleContent: {
    fontSize: '1.1rem',
    lineHeight: 1.7,
    color: '#333',
    marginBottom: '40px'
  },
  
  socialShare: {
    marginBottom: '40px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  
  shareButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  
  shareButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  
  relatedPosts: {
    marginBottom: '40px'
  },
  
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px'
  },
  
  relatedCard: {
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  
  commentsSection: {
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '2px solid #e0e0e0'
  },
  
  commentForm: {
    marginBottom: '30px'
  },
  
  commentInput: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '10px',
    resize: 'vertical'
  },
  
  commentSubmit: {
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  comment: {
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  
  commentDate: {
    color: '#888',
    fontSize: '12px'
  },
  
  commentContent: {
    margin: '0',
    lineHeight: 1.5
  },
  
  pendingBadge: {
    background: '#ffc107',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  
  // Editor styles
  editor: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '30px',
    marginTop: '20px'
  },
  
  editorSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  editorField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  
  select: {
    padding: '8px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px'
  },
  
  input: {
    padding: '8px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px'
  },
  
  editorMain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  titleInput: {
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  
  summaryInput: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'vertical'
  },
  
  editorTabs: {
    display: 'flex',
    gap: '10px'
  },
  
  editorTab: {
    padding: '8px 16px',
    background: '#f0f0f0',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  
  contentEditor: {
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'Monaco, Consolas, monospace',
    resize: 'vertical'
  },
  
  editorToolbar: {
    display: 'flex',
    gap: '10px',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '6px'
  },
  
  editorActions: {
    display: 'flex',
    gap: '10px'
  },
  
  cancelButton: {
    background: '#666',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  saveButton: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
