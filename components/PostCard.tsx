import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike(post.id);
  };

  return (
    <div className="border-b border-zinc-800 p-4 hover:bg-zinc-900/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <img 
          src={post.user.avatar} 
          alt={post.user.name} 
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-bold truncate">{post.user.name}</span>
              <span className="text-zinc-500 truncate">{post.user.handle}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-500 text-sm hover:underline cursor-pointer">{post.timestamp}</span>
            </div>
            <button className="text-zinc-500 hover:text-nexus-primary p-1 rounded-full hover:bg-nexus-primary/10 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed">
            {post.content}
          </div>

          {/* Image */}
          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
              <img 
                src={post.imageUrl} 
                alt="Post attachment" 
                className="w-full h-auto max-h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-3 text-zinc-500 max-w-md">
            <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors p-1">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.comments.length || ''}</span>
            </button>
            
            <button 
                onClick={handleLike}
                className={`flex items-center gap-2 group transition-colors p-1 ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-600/10">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likeCount || ''}</span>
            </button>

            <button className="flex items-center gap-2 group hover:text-green-500 transition-colors p-1">
              <div className="p-2 rounded-full group-hover:bg-green-500/10">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;