
export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  isPremium?: boolean;
  isPro?: boolean;
  isMonetized?: boolean;
  subscriptionPrice?: number;
  balance?: number; // In Nexus Gold
  isSubscribedTo?: boolean; // Current user status relative to this user
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  unread?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  imageUrls?: string[];
  videoUrl?: string;
  likes: number;
  reposts: number;
  shares: number;
  quotes: number;
  comments: Comment[];
  timestamp: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReposted?: boolean;
  repostedFrom?: Post;
  quotedPost?: Post;
  isSponsored?: boolean;
  isExclusive?: boolean;
  isLocked?: boolean;
}

export interface Story {
  id: string;
  user: User;
  imageUrl: string;
  timestamp: string;
  isViewed?: boolean;
  isSponsored?: boolean;
}

export interface TrendingTopic {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  isPromoted?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export type ViewState = 'home' | 'explore' | 'notifications' | 'profile' | 'settings' | 'messages' | 'post' | 'menu' | 'bookmarks' | 'monetization' | 'store';

export interface GroundingMetadata {
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'quote' | 'tip' | 'subscription';

export interface Notification {
  id: string;
  type: NotificationType;
  user: User;
  post?: Post;
  text?: string;
  timestamp: string;
  read: boolean;
  amount?: number; // For tips
}
