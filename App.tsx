
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
import { Sparkles, Search, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('nexus_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quotingPost, setQuotingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nexus_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (currentUser && !viewingUser) {
        setViewingUser(currentUser);
    }
  }, [currentUser, viewingUser]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      if (currentY <= 10) {
        setShowHeader(true);
      } else if (currentY > lastScrollY) {
        setShowHeader(false);
      }
      
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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
             <div className={`md:hidden sticky top-0 bg-white/90 dark:bg-nexus-900/90 backdrop-blur-md z-30 border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="px-4 py-1.5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-nexus-primary to-nexus-accent">NEXUS</h1>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={() => handleViewChange('explore')} className="p-1">
                             <Search className="w-7 h-7 text-nexus-primary" />
                         </button>
                         <img 
                            src={currentUser?.avatar} 
                            alt="Profile" 
                            onClick={() => handleUserClick(currentUser!)}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                         />
                    </div>
                </div>
                {currentUser && <Stories currentUser={currentUser} connected={true} />}
             </div>
            
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
        return <Settings onLogout={() => window.location.reload()} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
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
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        ) : null;
      default:
        return null;
    }
  };

  const handleMobileCreatePost = () => {
    setQuotingPost(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-center">
        {currentUser && (
            <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
                <Sidebar 
                    currentView={currentView} 
                    onViewChange={handleViewChange} 
                    onCreatePost={handleMobileCreatePost}
                    currentUser={currentUser}
                />
            </div>
        )}

        <div className="md:hidden">
             {currentUser && (
                 <Sidebar 
                    currentView={currentView} 
                    onViewChange={handleViewChange} 
                    onCreatePost={handleMobileCreatePost}
                    currentUser={currentUser}
                />
             )}
        </div>

        <main className="w-full max-w-[750px] border-x border-gray-100 dark:border-gray-800 min-h-screen pb-20 md:pb-0">
          {renderContent()}
        </main>

        <RightPanel />
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] bg-white md:bg-black/50 dark:md:bg-black/70 md:backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200 p-0 md:p-4">
           <div className="w-full h-full md:h-auto md:max-w-lg md:rounded-2xl bg-white dark:bg-nexus-900 overflow-hidden shadow-2xl flex flex-col border dark:border-gray-800">
               <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                   <button onClick={() => { setIsCreateModalOpen(false); setQuotingPost(null); }}>
                       <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                   </button>
                   <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{quotingPost ? 'Quote Post' : 'New Post'}</span>
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
