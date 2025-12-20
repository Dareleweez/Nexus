
import React, { useState, useEffect } from 'react';
import { Post, User, Comment, ViewState } from '../types';
import PostCard from './PostCard';
import { ArrowLeft } from 'lucide-react';

interface PostDetailProps {
    post: Post;
    onBack: () => void;
    onLike: (postId: string) => void;
    onRepost: (postId: string) => void;
    onQuote: (post: Post) => void;
    onBookmark: (postId: string) => void;
    onUserClick: (user: User) => void;
    onUpdate?: (postId: string, newContent: string) => void;
    onComment?: (postId: string, comment: Comment, parentId?: string) => void;
    onCommentUpdate?: (postId: string, commentId: string, newText: string) => void;
    onCommentDelete?: (postId: string, commentId: string) => void;
    currentUser?: User;
    onViewChange?: (view: ViewState) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, ...postCardProps }) => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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

    return (
        <div className="animate-in fade-in duration-300">
            <div className={`sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 flex items-center gap-4 border-b border-gray-200 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-7 h-7 text-gray-900" />
                </button>
                <h2 className="font-bold text-xl leading-tight text-gray-900">Post</h2>
            </div>
            <PostCard
                post={post}
                isDetailView={true}
                {...postCardProps}
            />
        </div>
    );
};
export default PostDetail;
