import { useState } from 'react';
import { ForumPost, ForumComment } from '../types';
import { MessageSquare, ThumbsUp, Filter, Plus } from 'lucide-react';

const forumCategories = [
  'Sustainable Practices',
  'Crop Management',
  'Organic Farming',
  'Pest Control',
  'Soil Health',
  'Market Insights',
  'Equipment',
  'General Discussion'
];

// Mock data - Replace with actual API calls
const mockPosts: ForumPost[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'John Smith',
    title: 'Best practices for organic pest control',
    content: 'I\'ve been struggling with aphids in my organic garden. What are some effective natural solutions you\'ve tried?',
    category: 'Pest Control',
    tags: ['organic', 'pests', 'natural solutions'],
    createdAt: new Date(),
    likes: 5,
    comments: [
      {
        id: 'c1',
        userId: 'u2',
        userName: 'Sarah Johnson',
        content: 'I\'ve had great success with neem oil spray!',
        createdAt: new Date(),
        likes: 2
      }
    ]
  }
];

export default function Forum() {
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const post: ForumPost = {
      id: Date.now().toString(),
      userId: 'current-user', // Replace with actual user ID
      userName: 'Current User', // Replace with actual user name
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      createdAt: new Date(),
      likes: 0,
      comments: []
    };
    setPosts([post, ...posts]);
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', category: '', tags: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        <div className="flex items-center space-x-4">
          <select
            className="border rounded-lg px-4 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {forumCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" size={20} />
            New Post
          </button>
        </div>
      </div>

      {showNewPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full border rounded-lg px-4 py-2"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  required
                />
                <select
                  className="w-full border rounded-lg px-4 py-2"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {forumCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Content"
                  className="w-full border rounded-lg px-4 py-2 h-32"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  className="w-full border rounded-lg px-4 py-2"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{post.userName}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-500">
                  <ThumbsUp size={18} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare size={18} />
                  <span>{post.comments.length}</span>
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{post.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {post.comments.length > 0 && (
              <div className="border-t pt-4 mt-4 space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                    <button className="flex items-center space-x-1 text-gray-500">
                      <ThumbsUp size={16} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 