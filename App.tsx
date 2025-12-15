import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import PostCard from './components/PostCard';
import RightPanel from './components/RightPanel';
import Profile from './components/Profile';
import { ViewState, Post } from './types';
import { CURRENT_USER, INITIAL_POSTS } from './constants';
import { Sparkles } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handlePostCreate = (content: string, imageFile: File | null) => {
    const newPost: Post = {
      id: Date.now().toString(),
      user: CURRENT_USER,
      content,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
            return {
                ...p,
                likes: (p.isLiked ? p.likes - 1 : p.likes + 1),
                isLiked: !p.isLiked
            };
        }
        return p;
    }));
  };

  const renderMainContent = () => {
    if (currentView === 'profile') {
      const myPosts = posts.filter(p => p.user.id === CURRENT_USER.id);
      return (
        <Profile 
          user={CURRENT_USER} 
          posts={myPosts.length > 0 ? myPosts : INITIAL_POSTS} // Fallback to show initial posts as "yours" for demo
          onBack={() => setCurrentView('home')} 
        />
      );
    }

    if (currentView === 'notifications') {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-zinc-500">
                <Sparkles className="w-12 h-12 mb-4 text-nexus-accent/50" />
                <h3 className="text-xl font-bold text-white">Nothing here yet</h3>
                <p>When you get notifications, they'll show up here.</p>
            </div>
        );
    }

    // Home or Explore
    return (
      <>
        {/* Sticky Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md z-30 px-4 py-3 border-b border-zinc-800">
            <h2 className="font-bold text-xl cursor-pointer">For you</h2>
        </div>

        {/* Create Post */}
        <CreatePost currentUser={CURRENT_USER} onPostCreate={handlePostCreate} />

        {/* Feed */}
        <div className="pb-20 md:pb-0">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-nexus-accent/30 selection:text-nexus-accent-foreground font-sans">
      <div className="container mx-auto xl:max-w-[1265px] flex min-h-screen">
        
        {/* Sidebar (Left) */}
        <header className="flex-none">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        </header>

        {/* Main Feed (Center) */}
        <main className="flex-1 max-w-[600px] border-x border-zinc-800 relative w-full">
          {renderMainContent()}
        </main>

        {/* Widgets (Right) */}
        <aside className="flex-none hidden lg:block ml-4">
          <RightPanel />
        </aside>

      </div>
    </div>
  );
}

export default App;