
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import CreatePost from './components/CreatePost.tsx';
import PostCard from './components/PostCard.tsx';
import RightPanel from './components/RightPanel.tsx';
import Profile from './components/Profile.tsx';
import Explore from './components/Explore.tsx';
import Settings from './components/Settings.tsx';
import Messages from './components/Messages.tsx';
import Stories from './components/Stories.tsx';
import Notifications from './components/Notifications.tsx';
import PostDetail from './components/PostDetail.tsx';
import MobileMenu from './components/MobileMenu.tsx';
import Bookmarks from './components/Bookmarks.tsx';
import { ViewState, Post, User, Comment, Notification } from './types.ts';
import { CURRENT_USER, INITIAL_POSTS, MOCK_USERS, MOCK_NOTIFICATIONS } from './constants.ts';
import { Sparkles, ArrowUp, Compass, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quotingPost, setQuotingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (currentUser && !viewingUser) {
        setViewingUser(currentUser);
    }
  }, [currentUser, viewingUser]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          likes: isLiked ? post.likes + 1 : post.likes - 1,
          isLiked
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
        if (post.id === postId) {
            return {
                ...post,
                isBookmarked: !post.isBookmarked
            };
        }
        return post;
    }));
  };

  const handleRepost = (postId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost || !currentUser) return;

    const newPost: Post = {
        id: `rp-${Date.now()}`,
        user: currentUser,
        content: '', 
        likes: 0,
        reposts: 0,
        quotes: 0,
        comments: [],
        timestamp: 'Just now',
        isReposted: true,
        repostedFrom: originalPost
    };

    setPosts([newPost, ...posts]);
    setNotifications(prev => [{
        id: `n-${Date.now()}`,
        type: 'repost',
        user: currentUser,
        post: originalPost,
        timestamp: 'Just now',
        read: false
    }, ...prev]);
  };

  const handleQuote = (post: Post) => {
    setQuotingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleCreatePost = (content: string, mediaFiles: File[], quotedPost?: Post) => {
    if (!currentUser) return;
    
    const imageUrls: string[] = [];
    let videoUrl: string | undefined;

    mediaFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('video/')) {
        videoUrl = url;
      } else {
        imageUrls.push(url);
      }
    });

    const newPost: Post = {
      id: `p-${Date.now()}`,
      user: currentUser,
      content,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      videoUrl,
      likes: 0,
      reposts: 0,
      quotes: 0,
      comments: [],
      timestamp: 'Just now',
      quotedPost: quotedPost
    };

    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    setQuotingPost(null);
    setCurrentView('home');
    scrollToTop();
  };

  const handleUpdatePost = (postId: string, newContent: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, content: newContent } : p));
  };

  const handleComment = (postId: string, comment: Comment, parentId?: string) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
            if (parentId) {
                const addReplyRecursive = (comments: Comment[]): Comment[] => {
                    return comments.map(c => {
                        if (c.id === parentId) {
                            return { ...c, replies: [...(c.replies || []), comment] };
                        }
                        if (c.replies && c.replies.length > 0) {
                            return { ...c, replies: addReplyRecursive(c.replies) };
                        }
                        return c;
                    });
                };
                return { ...p, comments: addReplyRecursive(p.comments) };
            } else {
                return { ...p, comments: [...p.comments, comment] };
            }
        }
        return p;
    }));
  };

  const handleCommentUpdate = (postId: string, commentId: string, newText: string) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const updateRecursive = (comments: Comment[]): Comment[] => {
                return comments.map(c => {
                    if (c.id === commentId) return { ...c, text: newText };
                    if (c.replies) return { ...c, replies: updateRecursive(c.replies) };
                    return c;
                });
            };
            return { ...p, comments: updateRecursive(p.comments) };
        }
        return p;
    }));
  };

  const handleCommentDelete = (postId: string, commentId: string) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
             const deleteRecursive = (comments: Comment[]): Comment[] => {
                return comments.filter(c => {
                    if (c.id === commentId) return false;
                    if (c.replies) c.replies = deleteRecursive(c.replies);
                    return true;
                });
            };
            return { ...p, comments: deleteRecursive(p.comments) };
        }
        return p;
    }));
  };

  const handleUserClick = (user: User) => {
    setViewingUser(user);
    setCurrentView('profile');
    scrollToTop();
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    if (view === 'profile' && currentUser) {
        setViewingUser(currentUser);
    }
    scrollToTop();
  };

  const handleNotificationClick = (notification: Notification) => {
      if (notification.post) {
          setViewingPost(notification.post);
          setCurrentView('post');
      } else if (notification.type === 'follow') {
          handleUserClick(notification.user);
      }
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="flex flex-col md:gap-4 pb-20 md:pb-0">
             {/* Unified Header Layer for Mobile - Minimized */}
             <div className="md:hidden sticky top-0 bg-white/90 backdrop-blur-md z-30 border-b border-gray-200">
                <div className="px-4 py-1.5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-nexus-primary to-nexus-accent">NEXUS</h1>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={() => handleViewChange('explore')}>
                             <Compass className="w-6 h-6 text-gray-900" />
                         </button>
                         <img 
                            src={currentUser?.avatar} 
                            alt="Profile" 
                            onClick={() => handleUserClick(currentUser!)}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                         />
                    </div>
                </div>
                {/* Connected Stories - Minimized */}
                {currentUser && <Stories currentUser={currentUser} connected={true} />}
             </div>
            
            {/* Standard Feed Stories for Desktop */}
            <div className="hidden md:block">
                {currentUser && <Stories currentUser={currentUser} />}
            </div>
            
            <div className="hidden md:block">
                 {currentUser && (
                    <CreatePost 
                        currentUser={currentUser} 
                        onPostCreate={handleCreatePost}
                        quotingPost={quotingPost}
                        onCancelQuote={() => setQuotingPost(null)}
                    />
                 )}
            </div>

            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onRepost={handleRepost}
                onQuote={handleQuote}
                onBookmark={handleBookmark}
                onUserClick={handleUserClick}
                onUpdate={handleUpdatePost}
                onComment={handleComment}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
                onViewPost={(p) => { setViewingPost(p); setCurrentView('post'); }}
                currentUser={currentUser || undefined}
              />
            ))}
          </div>
        );
      case 'explore':
        return <Explore />;
      case 'notifications':
        return <Notifications notifications={notifications} onNotificationClick={handleNotificationClick} />;
      case 'messages':
        return <Messages />;
      case 'bookmarks':
        return (
            <Bookmarks 
                bookmarkedPosts={posts.filter(p => p.isBookmarked)}
                onLike={handleLike}
                onRepost={handleRepost}
                onQuote={handleQuote}
                onBookmark={handleBookmark}
                onUserClick={handleUserClick}
                onUpdate={handleUpdatePost}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
                currentUser={currentUser || undefined}
            />
        );
      case 'profile':
        return viewingUser ? (
            <Profile 
                user={viewingUser} 
                posts={posts.filter(p => p.user.id === viewingUser.id)}
                likedPosts={posts.filter(p => p.likes > 50)}
                onBack={() => handleViewChange('home')}
                onUserClick={handleUserClick}
                onLike={handleLike}
                onRepost={handleRepost}
                onQuote={handleQuote}
                onBookmark={handleBookmark}
                onUpdate={handleUpdatePost}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
            />
        ) : null;
      case 'settings':
        return <Settings onLogout={() => window.location.reload()} />;
      case 'post':
        return viewingPost ? (
            <PostDetail 
                post={posts.find(p => p.id === viewingPost.id) || viewingPost}
                onBack={() => handleViewChange('home')}
                onLike={handleLike}
                onRepost={handleRepost}
                onQuote={handleQuote}
                onBookmark={handleBookmark}
                onUserClick={handleUserClick}
                onUpdate={handleUpdatePost}
                onComment={handleComment}
                onCommentUpdate={handleCommentUpdate}
                onCommentDelete={handleCommentDelete}
                currentUser={currentUser || undefined}
            />
        ) : null;
      case 'menu':
        return currentUser ? (
          <MobileMenu 
            currentUser={currentUser} 
            onViewChange={handleViewChange} 
            onClose={() => handleViewChange('home')}
            onLogout={() => window.location.reload()}
            onUserClick={handleUserClick}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex justify-center">
        {currentUser && (
            <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
                <Sidebar 
                    currentView={currentView} 
                    onViewChange={handleViewChange} 
                    onCreatePost={() => { setQuotingPost(null); setIsCreateModalOpen(true); }}
                    currentUser={currentUser}
                />
            </div>
        )}

        <div className="md:hidden">
             <Sidebar 
                currentView={currentView} 
                onViewChange={handleViewChange} 
                onCreatePost={() => { setQuotingPost(null); setIsCreateModalOpen(true); }}
                currentUser={currentUser!}
            />
        </div>

        <main className="w-full max-w-[600px] border-x border-gray-100 min-h-screen pb-20 md:pb-0">
          {renderContent()}
        </main>

        <RightPanel />
      </div>

      <button 
        onClick={scrollToTop}
        className={`fixed bottom-24 md:bottom-8 right-8 bg-black text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:bg-black/50 md:backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 p-0 md:p-4">
           <div className="w-full h-full md:h-auto md:max-w-lg md:rounded-2xl bg-white overflow-hidden shadow-2xl flex flex-col">
               <div className="flex items-center justify-between p-4 border-b border-gray-100">
                   <button onClick={() => { setIsCreateModalOpen(false); setQuotingPost(null); }}>
                       <X className="w-6 h-6 text-gray-900" />
                   </button>
                   <span className="font-bold text-lg">{quotingPost ? 'Quote Post' : 'New Post'}</span>
                   <div className="w-6"></div>
               </div>
               {currentUser && (
                    <CreatePost 
                        currentUser={currentUser} 
                        onPostCreate={handleCreatePost}
                        quotingPost={quotingPost}
                        onCancelQuote={() => setQuotingPost(null)}
                    />
                )}
           </div>
        </div>
      )}
    </div>
  );
}
