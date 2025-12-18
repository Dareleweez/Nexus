
import React from 'react';
import { Post, User, Comment } from '../types';
import PostCard from './PostCard';
import { Bookmark, Inbox } from 'lucide-react';

interface BookmarksProps {
    bookmarkedPosts: Post[];
    onLike: (postId: string) => void;
    onRepost: (postId: string) => void;
    onQuote: (post: Post) => void;
    onBookmark: (postId: string) => void;
    onUserClick: (user: User) => void;
    onUpdate?: (postId: string, newContent: string) => void;
    onCommentUpdate?: (postId: string, commentId: string, newText: string) => void;
    onCommentDelete?: (postId: string, commentId: string) => void;
    currentUser?: User;
}

const Bookmarks: React.FC<BookmarksProps> = ({ 
    bookmarkedPosts, 
    onLike, 
    onRepost, 
    onQuote, 
    onBookmark, 
    onUserClick, 
    onUpdate,
    onCommentUpdate,
    onCommentDelete,
    currentUser 
}) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Bookmark className="w-6 h-6 text-nexus-primary" />
                    <h2 className="font-bold text-xl text-gray-900">Bookmarks</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">{currentUser?.handle}</p>
            </div>

            {/* List */}
            <div className="pb-20">
                {bookmarkedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Bookmark className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Save posts for later</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Don’t let the good ones get away! Bookmark posts to easily find them again in the future.
                        </p>
                    </div>
                ) : (
                    bookmarkedPosts.map((post) => (
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
                            currentUser={currentUser}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
