// Blog.js: Event-driven gamification integration and correct component structure
import React, { useEffect, useRef, useState, useContext } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';

// Mock data for development - replace with real API calls
const MOCK_POSTS = [
  {
    id: 1,
    title: "Glorious Blog of the People",
    slug: "welcome-enhanced-blog",
    content: "# Welcome, Comrade!\n\nThis is new blog platform, built by underpaid workers for collective enlightenment. Markdown is supported, but not required by Party. \n\n## Features\n\n- Text editing, sometimes works\n- Categories: struggle, potato, revolution\n- Comments system (may be censored)\n- Social sharing (mention \"Twitter\" but nobody knows what it is)\n\n```javascript\nconsole.log('Hello, Worker!');\n```\n\nExplore features, but do not expect utopia.",
    summary: "Blog for proletariat. Editing is permitted, but only in spirit of revolution.",
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
    title: "How to Write for the Collective",
    slug: "getting-started-markdown",
    content: "## Markdown Guide for Workers\n\nMarkdown is language for formatting, but true worker uses plain text. Syntax is simple, like potato soup. \n\n**Bold text** for Party slogans, *italic text* for secret messages.\n\n- Bullet points for grievances\n- Another point for shortages\n\n1. Numbered lists for rationing\n2. Also for counting comrades\n\n> Blockquotes for official decrees\n\n[Links work too](https://example.com), but beware capitalist propaganda.",
    summary: "Learn basics of worker formatting. Markdown is optional, struggle is mandatory.",
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
  { id: 'announcements', name: 'Party Announcements', color: '#4a90e2' },
  { id: 'tutorials', name: 'How to Wait in Line', color: '#7b68ee' },
  { id: 'technology', name: 'Tractor Technology', color: '#4ecdc4' },
  { id: 'news', name: 'State News', color: '#45b7d1' },
  { id: 'reviews', name: 'Potato Reviews', color: '#96ceb4' }
];

export default function Blog() {
  const sharedState = useContext(SharedStateContext);
  const eventBus = sharedState?.eventBus;

  useEffect(() => {
    eventBus?.emit('user-action', { type: 'visit-channel', value: 'blog' });
  }, [eventBus]);

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

  return (
    <div>
      {/* Blog UI goes here */}
    </div>
  );
}
