
import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft, Image as ImageIcon, Heart, X } from 'lucide-react';
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
  onUpdateProfile?: (data: { name: string; handle: string; bio: string }) => void;
  onCommentUpdate?: (postId: string, commentId: string, newText: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
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
    onCommentDelete 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', handle: '', bio: '' });
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const currentY = window.scrollY;
        if (currentY < 50) {
            setShowHeader(true);
        } else if (currentY > lastScrollY) {
            setShowHeader(false);
        } else {
            setShowHeader(true);
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
        // Fix: Use 'imageUrls' and 'videoUrl' to filter media posts correctly
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

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'posts': return "This user hasn't posted anything yet.";
      case 'media': return "This user has not shared any media yet.";
      case 'likes': return "No liked posts yet.";
      case 'replies': return "No replies yet.";
      default: return "Nothing to see here.";
    }
  };

  const handleEditClick = () => {
    setEditForm({
        name: user.name,
        handle: user.handle,
        bio: user.bio || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
        onUpdateProfile(editForm);
    }
    setIsEditingProfile(false);
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-4 border-b border-gray-200 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-7 h-7 text-gray-900" />
        </button>
        <div>
            <h2 className="font-bold text-xl leading-tight text-gray-900">{user.name}</h2>
            <p className="text-xs text-gray-500">{posts.length} posts</p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover bg-gray-200" />
        </div>
        <div className="flex justify-end pt-3">
            {isCurrentUser ? (
                <button 
                  onClick={handleEditClick}
                  className="border border-gray-300 font-bold px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-black"
                >
                    Edit profile
                </button>
            ) : (
                <button className="bg-black text-white font-bold px-6 py-1.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm">
                    Follow
                </button>
            )}
        </div>
        
        <div className="mt-4">
            <h1 className="font-bold text-xl text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.handle}</p>
        </div>

        <p className="mt-3 text-[15px] text-gray-900">{user.bio}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-gray-500 text-sm">
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
                <span className="font-bold text-black">{user.following}</span> <span className="text-gray-500">Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
                <span className="font-bold text-black">{user.followers}</span> <span className="text-gray-500">Followers</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-2">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 hover:bg-gray-50 cursor-pointer transition-colors text-center py-4 relative ${
              activeTab === tab.id ? 'font-bold text-black' : 'text-gray-500 hover:text-gray-800'
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
                <p>{getEmptyStateMessage()}</p>
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
                />
            ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <form onSubmit={handleSaveProfile}>
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                type="button"
                                onClick={() => setIsEditingProfile(false)}
                                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="font-bold text-lg text-gray-900">Edit Profile</h3>
                        </div>
                        <button 
                            type="submit"
                            className="bg-black text-white font-bold px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors text-sm"
                        >
                            Save
                        </button>
                    </div>
                    
                    <div className="p-4 space-y-6">
                        <div className="relative h-32 bg-gray-200 mb-12">
                            <div className="absolute -bottom-10 left-4 p-1 bg-white rounded-full">
                                <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover opacity-75" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black/30 p-2 rounded-full text-white cursor-pointer hover:bg-black/40 backdrop-blur-sm">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900"
                                    maxLength={50}
                                />
                            </div>

                             <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Handle</label>
                                <input 
                                    type="text" 
                                    value={editForm.handle}
                                    onChange={(e) => setEditForm({...editForm, handle: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900"
                                    maxLength={30}
                                />
                            </div>

                            <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-nexus-primary focus-within:border-transparent">
                                <label className="block text-xs text-gray-500 mb-1">Bio</label>
                                <textarea 
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    className="w-full bg-transparent outline-none text-gray-900 resize-none min-h-[80px]"
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
