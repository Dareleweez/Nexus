import React from 'react';
import { User, Post } from '../types';
import PostCard from './PostCard';
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  user: User;
  posts: Post[];
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, posts, onBack }) => {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-30 px-4 py-2 flex items-center gap-4 border-b border-zinc-800">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
            <h2 className="font-bold text-lg leading-tight">{user.name}</h2>
            <p className="text-xs text-zinc-500">{posts.length} posts</p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-48 bg-gradient-to-r from-zinc-800 to-nexus-900">
        {/* You could add a banner image here */}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="absolute -top-16 left-4 border-4 border-black rounded-full">
            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover bg-zinc-900" />
        </div>
        <div className="flex justify-end pt-3">
            <button className="border border-zinc-600 font-bold px-4 py-1.5 rounded-full hover:bg-zinc-900 transition-colors">
                Edit profile
            </button>
        </div>
        
        <div className="mt-4">
            <h1 className="font-bold text-xl">{user.name}</h1>
            <p className="text-zinc-500 text-sm">{user.handle}</p>
        </div>

        <p className="mt-3 text-[15px]">{user.bio}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-zinc-500 text-sm">
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
                <span className="font-bold text-white">{user.following}</span> <span className="text-zinc-500">Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
                <span className="font-bold text-white">{user.followers}</span> <span className="text-zinc-500">Followers</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mt-2">
        <div className="flex-1 hover:bg-zinc-900/50 cursor-pointer transition-colors text-center py-4 relative">
            <span className="font-bold">Posts</span>
            <div className="absolute bottom-0 left-0 w-full flex justify-center">
                <div className="w-16 h-1 bg-nexus-primary rounded-full"></div>
            </div>
        </div>
        <div className="flex-1 hover:bg-zinc-900/50 cursor-pointer transition-colors text-center py-4 text-zinc-500">
            Replies
        </div>
        <div className="flex-1 hover:bg-zinc-900/50 cursor-pointer transition-colors text-center py-4 text-zinc-500">
            Media
        </div>
        <div className="flex-1 hover:bg-zinc-900/50 cursor-pointer transition-colors text-center py-4 text-zinc-500">
            Likes
        </div>
      </div>

      {/* Posts */}
      <div>
        {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default Profile;