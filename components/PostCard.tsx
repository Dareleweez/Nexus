
import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment } from '../types.ts';
import { Heart, MessageCircle, Share2, MoreHorizontal, Pencil, Send, Trash2, X, Eye, ChevronDown, ChevronUp, Repeat2, Quote, Bookmark } from 'lucide-react';
import { CURRENT_USER } from '../constants.ts';

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  currentUser: User;
  editingCommentId: string | null;
  editCommentText: string;
  setEditCommentText: (text: string) => void;
  handleSaveComment: (commentId: string) => void;
  handleCancelCommentEdit: () => void;
  handleEditComment: (comment: Comment) => void;
  handleDeleteComment: (commentId: string) => void;
  setReplyingTo: (comment: Comment | null) => void;
  onUserClick: (user: User) => void;
  viewedCommentIds: Set<string>;
  newCommentId: string | null;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  depth = 0,
  currentUser,
  editingCommentId,
  editCommentText,
  setEditCommentText,
  handleSaveComment,
  handleCancelCommentEdit,
  handleEditComment,
  handleDeleteComment,
  setReplyingTo,
  onUserClick,
  viewedCommentIds,
  newCommentId
}) => {
    const [showActions, setShowActions] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);

    const isCommentOwner = currentUser.id === comment.user.id;
    const isEditingThis = editingCommentId === comment.id;
    const isUnread = comment.unread && !viewedCommentIds.has(comment.id);
    const isJustAdded = comment.id === newCommentId;
    const showHighlight = isUnread || isJustAdded;
    
    const hasReplies = comment.replies && comment.replies.length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 group/comment ${depth > 0 ? 'mt-3' : 'mt-4'}`}>
          <div className="flex gap-3 items-start relative">
              <img 
                  src={comment.user.avatar} 
                  alt={comment.user.name} 
                  className={`${depth > 0 ? 'w-7 h-7' : 'w-8 h-8'} rounded-full object-cover cursor-pointer hover:opacity-90 shrink-0 border border-gray-100 dark:border-gray-800`}
                  onClick={(e) => { e.stopPropagation(); onUserClick(comment.user); }}
              />
              
              <div className="flex-1 min-w-0">
                  <div 
                      className={`rounded-2xl rounded-tl-none px-4 py-2.5 transition-all duration-700 relative ${
                          showHighlight 
                              ? 'bg-nexus-primary/10 border-nexus-primary/20 text-gray-900 dark:text-gray-100 shadow-sm' 
                              : 'bg-gray-50 dark:bg-nexus-800 text-gray-800 dark:text-gray-200 border border-transparent dark:border-gray-700/50'
                      }`}
                  >
                      <div className="flex justify-between items-baseline mb-0.5">
                          <span 
                              className="font-bold text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                              onClick={(e) => { e.stopPropagation(); onUserClick(comment.user); }}
                          >
                              {comment.user.name}
                          </span>
                          <div className="flex items-center gap-2">
                              {showHighlight && (
                                  <span className="text-[10px] font-bold text-nexus-primary bg-white/50 dark:bg-nexus-900/50 px-1.5 rounded-full animate-pulse">New</span>
                              )}
                              <span className="text-xs text-gray-400 dark:text-gray-500">{comment.timestamp}</span>
                          </div>
                      </div>
                      
                      {isEditingThis ? (
                          <div className="mt-1 animate-in fade-in duration-200">
                              <textarea 
                                  value={editCommentText}
                                  onChange={(e) => setEditCommentText(e.target.value)}
                                  className="w-full bg-white dark:bg-nexus-900 border border-nexus-primary/30 rounded-xl p-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-nexus-primary/10 resize-none shadow-inner text-gray-900 dark:text-gray-100"
                                  rows={2}
                                  autoFocus
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                  <button onClick={handleCancelCommentEdit} className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-nexus-700 px-3 py-1.5 rounded-full transition-colors">
                                      Cancel
                                  </button>
                                  <button onClick={() => handleSaveComment(comment.id)} className="text-xs font-bold bg-nexus-primary text-white px-3 py-1.5 rounded-full hover:bg-nexus-primary/90 transition-colors shadow-sm">
                                      Save
                                  </button>
                              </div>
                          </div>
                      ) : (
                          <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">{comment.text}</p>
                      )}

                      {!isEditingThis && isCommentOwner && (
                          <div className="absolute top-2 right-2 md:opacity-0 group-hover/comment:opacity-100 transition-opacity" ref={menuRef}>
                              <button 
                                  onClick={() => setShowActions(!showActions)}
                                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-nexus-primary hover:bg-nexus-primary/10 rounded-full transition-colors"
                              >
                                  <MoreHorizontal className="w-4 h-4" />
                              </button>
                              {showActions && (
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-nexus-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-30 animate-in fade-in zoom-in duration-150">
                                      <button 
                                          onClick={() => { handleEditComment(comment); setShowActions(false); }}
                                          className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-nexus-700 flex items-center gap-2 transition-colors"
                                      >
                                          <Pencil className="w-3 h-3" /> Edit
                                      </button>
                                      <button 
                                          onClick={() => { handleDeleteComment(comment.id); setShowActions(false); }}
                                          className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                                      >
                                          <Trash2 className="w-3 h-3" /> Delete
                                      </button>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  
                  {!isEditingThis && (
                      <div className="flex items-center gap-4 mt-1 ml-2">
                          <button 
                            onClick={() => setReplyingTo(comment)} 
                            className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-nexus-primary transition-colors flex items-center gap-1"
                          >
                              Reply
                          </button>
                          {hasReplies && (
                            <button 
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                            >
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {isExpanded ? 'Hide replies' : `Show ${comment.replies?.length} replies`}
                            </button>
                          )}
                      </div>
                  )}
              </div>
          </div>

          {hasReplies && isExpanded && (
              <div className="pl-6 border-l-2 border-gray-200/50 dark:border-gray-700/50 ml-4 mt-2">
                  {comment.replies?.map(reply => (
                      <CommentItem 
                          key={reply.id} 
                          comment={reply} 
                          depth={depth + 1}
                          currentUser={currentUser}
                          editingCommentId={editingCommentId}
                          editCommentText={editCommentText}
                          setEditCommentText={setEditCommentText}
                          handleSaveComment={handleSaveComment}
                          handleCancelCommentEdit={handleCancelCommentEdit}
                          handleEditComment={handleEditComment}
                          handleDeleteComment={handleDeleteComment}
                          setReplyingTo={setReplyingTo}
                          onUserClick={onUserClick}
                          viewedCommentIds={viewedCommentIds}
                          newCommentId={newCommentId}
                      />
                  ))}
              </div>
          )}
      </div>
    );
};

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onQuote: (post: Post) => void;
  onBookmark: (postId: string) => void;
  onUserClick: (user: User) => void;
  onUpdate?: (postId: string, newContent: string) => void;
  onComment?: (postId: string, comment: Comment, parentId?: string) => void;
  onCommentUpdate?: (postId: string, commentId: string, newText: string) => void;
  onCommentDelete?: (postId: string, commentId: string) => void;
  onViewPost?: (post: Post) => void;
  isDetailView?: boolean;
  currentUser?: User;
  isNested?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onRepost,
  onQuote,
  onBookmark,
  onUserClick, 
  onUpdate, 
  onComment,
  onCommentUpdate,
  onCommentDelete,
  onViewPost,
  isDetailView = false,
  currentUser = CURRENT_USER,
  isNested = false
}) => {
  const [reaction, setReaction] = useState<string | null>(post.isLiked ? '❤️' : null);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [showMenu, setShowMenu] = useState(false);
  const [showRepostMenu, setShowRepostMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  
  const [showComments, setShowComments] = useState(isDetailView);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const [viewedCommentIds, setViewedCommentIds] = useState<Set<string>>(new Set());
  
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [showLikePulse, setShowLikePulse] = useState(false);
  const [showBookmarkPulse, setShowBookmarkPulse] = useState(false);
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const repostMenuRef = useRef<HTMLDivElement>(null);

  const isOwner = post.user.id === currentUser.id;

  useEffect(() => { setLikeCount(post.likes); }, [post.likes]);
  useEffect(() => { setRepostCount(post.reposts); }, [post.reposts]);
  useEffect(() => { setComments(post.comments || []); }, [post.comments]);
  useEffect(() => { setReaction(post.isLiked ? '❤️' : null); }, [post.isLiked]);
  useEffect(() => { setIsBookmarked(post.isBookmarked); }, [post.isBookmarked]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (repostMenuRef.current && !repostMenuRef.current.contains(event.target as Node)) {
            setShowRepostMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRepostAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRepost(post.id);
    setRepostCount(prev => prev + 1);
    setShowRepostMenu(false);
  };

  const handleQuoteAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuote(post);
    setShowRepostMenu(false);
  };

  const handleDefaultLike = (e: React.MouseEvent) => {
     e.stopPropagation();
     if (reaction) {
         setReaction(null);
         setLikeCount(prev => Math.max(0, prev - 1));
         onLike(post.id);
     } else {
         setReaction('❤️');
         setLikeCount(prev => prev + 1);
         onLike(post.id);
         setShowLikePulse(true);
         setTimeout(() => setShowLikePulse(false), 500);
     }
  };

  const handleBookmarkAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    setShowBookmarkPulse(true);
    setTimeout(() => setShowBookmarkPulse(false), 500);
    onBookmark(post.id);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUserClick(post.user);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const commentId = Date.now().toString();
    const newComment: Comment = {
      id: commentId,
      user: currentUser,
      text: newCommentText,
      timestamp: 'Just now',
      unread: false,
      replies: []
    };
    
    if (replyingTo) {
        setComments(prev => prev.map(c => c.id === replyingTo.id ? { ...c, replies: [...(c.replies || []), newComment] } : c));
    } else {
        setComments(prev => [...prev, newComment]);
    }
    
    setNewCommentText('');
    setNewCommentId(commentId);
    if (onComment) onComment(post.id, newComment, replyingTo?.id);
    setReplyingTo(null);
    setTimeout(() => setNewCommentId(null), 2000);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleCancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSaveComment = (commentId: string) => {
    if (!editCommentText.trim()) return;
    
    setComments(prev => {
        const updateRecursive = (items: Comment[]): Comment[] => {
            return items.map(c => {
              if (c.id === commentId) return { ...c, text: editCommentText };
              if (c.replies && c.replies.length > 0) return { ...c, replies: updateRecursive(c.replies) };
              return c;
            });
        };
        return updateRecursive(prev);
    });
    if (onCommentUpdate) onCommentUpdate(post.id, commentId, editCommentText);
    handleCancelCommentEdit();
  };

  const handleDeleteComment = (commentId: string) => {
    const deleteRecursive = (items: Comment[]): Comment[] => {
      return items.filter(c => c.id !== commentId).map(c => {
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: deleteRecursive(c.replies) };
        }
        return c;
      });
    };
    setComments(prev => deleteRecursive(prev));
    if (onCommentDelete) onCommentDelete(post.id, commentId);
  };

  const displayPost = post.repostedFrom || post;
  const isActuallyARepost = !!post.repostedFrom;

  const renderMedia = () => {
    if (displayPost.videoUrl) {
      return (
        <div className={`mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-neutral-900 shadow-sm flex justify-center items-center group/media relative h-[500px] w-full mx-auto`}>
          <video src={displayPost.videoUrl} className="w-full h-full object-cover" controls playsInline />
        </div>
      );
    }

    if (!displayPost.imageUrls || displayPost.imageUrls.length === 0) return null;

    const images = displayPost.imageUrls;
    const count = images.length;

    if (count === 1) {
      return (
        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-nexus-800 shadow-sm">
          <img src={images[0]} alt="Post image" className="w-full h-auto max-h-[800px] object-cover hover:scale-[1.01] transition-transform duration-700" loading="lazy" />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-64 sm:h-96">
          {images.map((img, i) => (
            <img key={i} src={img} alt={`Post image ${i+1}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-64 sm:h-96">
          <img src={images[0]} alt="Post image 1" className="w-full h-full object-cover" />
          <div className="grid grid-rows-2 gap-1 h-full">
            <img src={images[1]} alt="Post image 2" className="w-full h-full object-cover" />
            <img src={images[2]} alt="Post image 3" className="w-full h-full object-cover" />
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 h-64 sm:h-96">
        {images.slice(0, 4).map((img, i) => (
          <img key={i} src={img} alt={`Post image ${i+1}`} className="w-full h-full object-cover" />
        ))}
      </div>
    );
  };

  return (
    <div className={`border-b border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 ${!isDetailView && !isNested ? 'hover:bg-gray-50/50 dark:hover:bg-nexus-800/20' : ''} ${isNested ? 'border border-gray-200 dark:border-gray-700 rounded-xl mt-3 p-3 bg-white dark:bg-nexus-800 hover:bg-gray-50/50 dark:hover:bg-nexus-700/50' : ''}`}>
      {isActuallyARepost && !isNested && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">
            <Repeat2 className="w-3 h-3 text-green-600" />
            <span>{post.user.name} reposted</span>
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                {!isNested && (
                    <div onClick={handleUserClick} className="cursor-pointer shrink-0">
                        <img src={displayPost.user.avatar} alt={displayPost.user.name} className="w-10 h-10 rounded-full object-cover shrink-0 hover:opacity-90 transition-opacity border border-gray-100 dark:border-gray-800" />
                    </div>
                )}
                <div className={`flex flex-col ${isNested ? 'ml-1' : ''}`}>
                    <div className="flex items-center gap-2">
                        {isNested && (
                            <img src={displayPost.user.avatar} alt={displayPost.user.name} className="w-5 h-5 rounded-full object-cover mr-1" />
                        )}
                        <span onClick={handleUserClick} className="font-bold truncate text-gray-900 dark:text-gray-100 cursor-pointer hover:underline text-sm md:text-base leading-none">{displayPost.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span onClick={handleUserClick} className="text-gray-500 dark:text-gray-400 truncate cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 text-xs">{displayPost.user.handle}</span>
                        <span className="text-gray-400 dark:text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs hover:underline cursor-pointer">{displayPost.timestamp}</span>
                    </div>
                </div>
            </div>

            {!isNested && (
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 dark:text-gray-500 hover:text-nexus-primary p-1.5 rounded-full hover:bg-nexus-primary/10 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-nexus-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-1.5 z-40 animate-in fade-in slide-in-from-top-2">
                             <button onClick={() => { if(onViewPost) onViewPost(post); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-nexus-700 flex items-center gap-2 transition-colors">
                                <Eye className="w-4 h-4" /> View Post
                            </button>
                            {isOwner && (
                                <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-nexus-700 flex items-center gap-2 transition-colors">
                                    <Pencil className="w-4 h-4" /> Edit Post
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
             <div className="mt-2 animate-in fade-in duration-300">
                 <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-3 text-[15px] border border-nexus-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-nexus-primary/20 bg-white dark:bg-nexus-900 text-gray-900 dark:text-gray-100 shadow-inner" rows={3} autoFocus />
                 <div className="flex gap-2 mt-2 justify-end">
                     <button onClick={() => setIsEditing(false)} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-4 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-nexus-700 transition-colors">Cancel</button>
                     <button onClick={() => { if(onUpdate) onUpdate(post.id, editContent); setIsEditing(false); }} className="text-sm font-bold bg-black dark:bg-white text-white dark:text-black px-5 py-1.5 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">Save</button>
                 </div>
             </div>
          ) : (
            <div className={`mt-1 whitespace-pre-wrap ${isNested ? 'text-sm' : 'text-[16px]'} leading-relaxed text-gray-900 dark:text-gray-100`}>
                {post.content}
            </div>
          )}

          {!isEditing && renderMedia()}

          {post.quotedPost && !isNested && (
            <PostCard 
                post={post.quotedPost} 
                isNested={true} 
                onLike={() => {}} 
                onRepost={() => {}} 
                onQuote={() => {}} 
                onBookmark={() => {}}
                onUserClick={onUserClick} 
            />
          )}

          {!isEditing && !isNested && (
              <div className="flex justify-between mt-4 text-gray-500 dark:text-gray-400 max-w-lg items-center px-1">
                <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 group transition-all duration-200 p-1 ${showComments ? 'text-nexus-primary' : 'hover:text-nexus-primary'}`}>
                    <div className={`relative p-2 rounded-full ${showComments ? 'bg-nexus-primary/10' : 'group-hover:bg-nexus-primary/10'}`}>
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{comments.length || ''}</span>
                </button>
                
                <div className="relative" ref={repostMenuRef}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowRepostMenu(!showRepostMenu); }}
                        className={`flex items-center gap-2 group transition-all duration-200 p-1 ${post.isReposted ? 'text-green-600' : 'hover:text-green-600'}`}
                    >
                        <div className={`p-2 rounded-full ${post.isReposted ? 'bg-green-600/10' : 'group-hover:bg-green-600/10'}`}>
                            <Repeat2 className={`w-5 h-5 ${post.isReposted ? 'scale-110' : ''}`} />
                        </div>
                        <span className="text-sm font-medium">{repostCount || ''}</span>
                    </button>
                    {showRepostMenu && (
                        <div className="absolute left-0 bottom-full mb-2 w-40 bg-white dark:bg-nexus-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-1.5 z-40 animate-in fade-in zoom-in duration-150">
                            <button onClick={handleRepostAction} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-nexus-700 flex items-center gap-2 transition-colors">
                                <Repeat2 className="w-4 h-4" /> Repost
                            </button>
                            <button onClick={handleQuoteAction} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-nexus-700 flex items-center gap-2 transition-colors">
                                <Quote className="w-4 h-4" /> Quote Post
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleDefaultLike} 
                    className={`flex items-center gap-2 group transition-all duration-300 p-1 ${reaction ? 'text-pink-600 scale-105' : 'hover:text-pink-600'}`}
                >
                    <div className={`p-2 rounded-full transition-all duration-300 ${reaction ? 'bg-pink-600/5' : 'group-hover:bg-pink-600/10'} flex items-center justify-center`}>
                        {reaction ? (
                            <span className={`text-lg transform transition-transform duration-300 ${showLikePulse ? 'scale-150 rotate-12' : 'scale-100'}`}>{reaction}</span>
                        ) : (
                            <Heart className={`w-5 h-5 ${showLikePulse ? 'fill-current scale-150' : ''}`} />
                        )}
                    </div>
                    <span className={`text-sm font-bold transition-all duration-300 ${showLikePulse ? 'scale-110 text-pink-600' : ''}`}>{likeCount || ''}</span>
                </button>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleBookmarkAction} 
                        className={`p-2 rounded-full transition-all duration-300 ${isBookmarked ? 'text-nexus-primary bg-nexus-primary/10' : 'hover:text-nexus-primary hover:bg-nexus-primary/10'}`}
                    >
                        <Bookmark className={`w-5 h-5 transition-transform duration-300 ${showBookmarkPulse ? 'scale-125' : 'scale-100'} ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 group hover:text-nexus-primary transition-colors p-1">
                        <div className="p-2 rounded-full group-hover:bg-nexus-primary/10"><Share2 className="w-5 h-5" /></div>
                    </button>
                </div>
            </div>
          )}

          {!isEditing && showComments && !isNested && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                    <CommentItem 
                      key={comment.id} 
                      comment={comment} 
                      currentUser={currentUser} 
                      editingCommentId={editingCommentId} 
                      editCommentText={editCommentText} 
                      setEditCommentText={setEditCommentText} 
                      handleSaveComment={handleSaveComment} 
                      handleCancelCommentEdit={handleCancelCommentEdit} 
                      handleEditComment={handleEditComment} 
                      handleDeleteComment={handleDeleteComment} 
                      setReplyingTo={setReplyingTo} 
                      onUserClick={onUserClick} 
                      viewedCommentIds={viewedCommentIds} 
                      newCommentId={newCommentId} 
                    />
                ))}
              </div>
              <div className="flex gap-3 items-start pt-2">
                <img src={currentUser.avatar} alt="You" className="w-8 h-8 rounded-full object-cover border border-gray-100 dark:border-gray-800" />
                <div className="flex-1 relative">
                    <textarea 
                      ref={commentInputRef}
                      value={newCommentText} 
                      onChange={(e) => setNewCommentText(e.target.value)} 
                      placeholder="Add a comment..." 
                      className="w-full bg-gray-50 dark:bg-nexus-800 border-gray-100 dark:border-gray-700 focus:bg-white dark:focus:bg-nexus-700 focus:border-nexus-primary focus:ring-4 focus:ring-nexus-primary/5 px-4 py-3 pr-10 text-[14px] transition-all outline-none resize-none overflow-hidden rounded-2xl text-gray-900 dark:text-gray-100" 
                      rows={1} 
                      onInput={(e) => { 
                        e.currentTarget.style.height = 'auto'; 
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; 
                      }} 
                    />
                    <button 
                      onClick={handleAddComment} 
                      disabled={!newCommentText.trim()} 
                      className="absolute right-2.5 bottom-2.5 p-1.5 text-nexus-primary hover:bg-nexus-primary/10 rounded-full disabled:opacity-30 transition-all hover:scale-110"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;