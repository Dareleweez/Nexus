
import React, { useState, useEffect, useRef } from 'react';
import { User, Post, ViewState } from '../types';
import PostCard from './PostCard';
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, Image as ImageIcon, Heart, X, Camera } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface ProfileProps {
  user: User;
  posts: Post[];
  likedPosts: Post[];
  onBack: () => void;
  onUserClick: (user: User) => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onQuote: (post: Post) => void;
  onBookmark: (postId: string) => void;
  onUpdate?: (postId: string, newContent: string) => void;
  onUpdateProfile?: (data: { name: string; handle: string; bio: string; avatar: string; coverPhoto?: string }) => void;
  onCommentUpdate?: (postId: string, commentId: string, newText: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
  onViewChange?: (view: ViewState) => void;
}

type Tab = 'posts' | 'replies' | 'media' | 'likes';

const Profile: React.FC<ProfileProps> = ({ 
    user, 
    posts, 
    likedPosts, 
    onBack, 
    onUserClick, 
    onLike, 
    onRepost,
    onQuote,
    onBookmark,
    onUpdate, 
    onUpdateProfile,
    onCommentUpdate,
    onCommentDelete,
    onViewChange
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: user.name, 
    handle: user.handle, 
    bio: user.bio || '', 
    avatar: user.avatar, 
    coverPhoto: user.coverPhoto || '' 
  });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const isCurrentUser = user.id === CURRENT_USER.id;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'posts', label: 'Posts' },
    { id: 'replies', label: 'Replies' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' },
  ];

  const getDisplayPosts = () => {
    switch (activeTab) {
      case 'posts':
        return posts;
      case 'media':
        return posts.filter(p => (p.imageUrls && p.imageUrls.length > 0) || p.videoUrl);
      case 'likes':
        return likedPosts;
      case 'replies':
        return []; 
      default:
        return posts;
    }
  };

  const displayPosts = getDisplayPosts();

  const handleEditClick = () => {
    setEditForm({
        name: user.name,
        handle: user.handle,
        bio: user.bio || '',
        avatar: user.avatar,
        coverPhoto: user.coverPhoto || ''
    });
    setIsEditingProfile(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setEditForm(prev => ({ ...prev, [field]: event.target?.result as string }));
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
        onUpdateProfile(editForm);
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="bg-white dark:bg-nexus-900 min-h-screen">
      {/* Header */}
      <div className={`sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-nexus-800 transition-colors">
            <ArrowLeft className="w-7 h-7 text-gray-900 dark:text-gray-100" />
        </button>
        <div>
            <h2 className="font-bold text-xl leading-tight text-gray-900 dark:text-gray-100">{user.name}</h2>
            <p className="text-xs text-gray-500">{posts.length} posts</p>
        </div>
      </div>

      {/* Hero Image */}
      <div 
        className="h-48 bg-gradient-to-r from-nexus-primary/20 to-nexus-accent/20 dark:from-nexus-800 dark:to-nexus-700 bg-cover bg-center"
        style={{ backgroundImage: user.coverPhoto ? `url(${user.coverPhoto})` : undefined }}
      ></div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="absolute -top-16 left-4 border-4 border-white dark:border-nexus-900 rounded-full bg-white dark:bg-nexus-900">
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover bg-gray-200 dark:bg-nexus-800" />
        </div>
        <div className="flex justify-end pt-3">
            {isCurrentUser ? (
                <button 
                  onClick={handleEditClick}
                  className="border border-gray-300 dark:border-gray-700 font-bold px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-nexus-800 transition-colors text-black dark:text-white"
                >
                    Edit profile
                </button>
            ) : (
                <button className="bg-black dark:bg-white text-white dark:text-black font-bold px-6 py-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
                    Follow
                </button>
            )}
        </div>
        
        <div className="mt-4">
            <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.handle}</p>
        </div>

        <p className="mt-3 text-[15px] text-gray-900 dark:text-gray-100">{user.bio}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-nexus-primary hover:underline">nexus.social</a>
            </div>
            <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined May 2025</span>
            </div>
        </div>

        <div className="flex gap-4 mt-3 text-sm">
            <div className="hover:underline cursor-pointer">
                <span className="font-bold text-black dark:text-white">{user.following}</span> <span className="text-gray-500 dark:text-gray-400">Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
                <span className="font-bold text-black dark:text-white">{user.followers}</span> <span className="text-gray-500 dark:text-gray-400">Followers</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mt-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 hover:bg-gray-50 dark:hover:bg-nexus-800 cursor-pointer transition-colors text-center py-4 relative ${
              activeTab === tab.id ? 'font-bold text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full flex justify-center">
                    <div className="w-16 h-1 bg-nexus-primary rounded-full"></div>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Posts Feed */}
      <div>
        {displayPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                {activeTab === 'media' && <ImageIcon className="w-10 h-10 mb-2 opacity-20" />}
                {activeTab === 'likes' && <Heart className="w-10 h-10 mb-2 opacity-20" />}
                <p>Nothing to see here yet.</p>
            </div>
        ) : (
            displayPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={onLike}
                  onRepost={onRepost}
                  onQuote={onQuote}
                  onBookmark={onBookmark}
                  onUserClick={onUserClick}
                  onUpdate={onUpdate}
                  onCommentUpdate={onCommentUpdate}
                  onCommentDelete={onCommentDelete}
                  onViewChange={onViewChange}
                />
            ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-nexus-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border dark:border-gray-800 flex flex-col max-h-[90vh]">
                <form onSubmit={handleSaveProfile} className="flex flex-col h-full">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-nexus-800 transition-colors text-gray-900 dark:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Profile</h3>
                        </div>
                        <button 
                            type="submit"
                            className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 py-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
                        >
                            Save
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                        {/* Photo Editing Area */}
                        <div className="relative mb-12">
                            {/* Cover Photo Edit */}
                            <div 
                                className="h-32 bg-gray-200 dark:bg-nexus-800 bg-cover bg-center relative group cursor-pointer"
                                style={{ backgroundImage: editForm.coverPhoto ? `url(${editForm.coverPhoto})` : undefined }}
                                onClick={() => coverInputRef.current?.click()}
                            >
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                                <input 
                                    type="file" 
                                    ref={coverInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handlePhotoUpload(e, 'coverPhoto')} 
                                />
                            </div>

                            {/* Avatar Edit */}
                            <div className="absolute -bottom-10 left-4 p-1 bg-white dark:bg-nexus-900 rounded-full group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                <div className="relative rounded-full overflow-hidden">
                                    <img src={editForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    ref={avatarInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handlePhotoUpload(e, 'avatar')} 
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium"
                                    maxLength={50}
                                    required
                                />
                            </div>

                             <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Handle</label>
                                <input 
                                    type="text" 
                                    value={editForm.handle}
                                    onChange={(e) => setEditForm({...editForm, handle: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium"
                                    maxLength={30}
                                    required
                                />
                            </div>

                            <div className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Bio</label>
                                <textarea 
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white resize-none min-h-[80px]"
                                    maxLength={160}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
