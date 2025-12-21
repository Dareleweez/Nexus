
import { User, Post, Conversation, Story, Notification } from './types.ts';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@alexr',
  avatar: 'https://picsum.photos/id/64/150/150',
  coverPhoto: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  bio: 'Digital explorer | AI enthusiast | Building the future 🚀',
  followers: 1250,
  following: 432,
  isPremium: true,
  isMonetized: true,
  balance: 1450.75,
  subscriptionPrice: 4.99,
  isSubscribedTo: ['u2']
};

export const MOCK_USERS: User[] = [
  {
    id: 'u2',
    name: 'Sarah Chen',
    handle: '@sarahc',
    avatar: 'https://picsum.photos/id/65/150/150',
    coverPhoto: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200',
    followers: 8900,
    following: 120,
    isMonetized: true,
    subscriptionPrice: 9.99
  },
  {
    id: 'u4',
    name: 'Emily Zhang',
    handle: '@emilyz',
    avatar: 'https://picsum.photos/id/338/150/150',
    coverPhoto: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    followers: 3200,
    following: 150,
    isMonetized: true,
    subscriptionPrice: 5.00
  },
  {
    id: 'u5',
    name: 'James Wilson',
    handle: '@jwilson',
    avatar: 'https://picsum.photos/id/334/150/150',
    coverPhoto: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=1200',
    followers: 1200,
    following: 800
  }
];

export const MOCK_ADS: Post[] = [
  {
    id: 'ad-nexus-1',
    user: {
      id: 'brand-nexus',
      name: 'Nexus Pro',
      handle: '@nexus_official',
      avatar: 'https://picsum.photos/id/101/150/150',
      followers: 1000000,
      following: 0
    },
    content: 'Creators are earning more on Nexus. Join the Ad Revenue Share program and turn your passion into a profession. ✨',
    likes: 12400,
    reposts: 890,
    shares: 4500,
    quotes: 120,
    comments: [],
    timestamp: 'Sponsored',
    isSponsored: true,
    imageUrls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'],
    ctaLabel: 'Learn More'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'ex-1',
    user: MOCK_USERS[0], // Sarah Chen
    content: 'EXCLUSIVE: My full 2025 AI production workflow. Only for my inner circle! 💎',
    likes: 156,
    reposts: 12,
    shares: 4,
    quotes: 2,
    comments: [],
    timestamp: '1h ago',
    isExclusive: true,
    isLocked: false, // User is subscribed by default in this mock
    imageUrls: ['https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'locked-1',
    user: MOCK_USERS[1], // Emily Zhang
    content: 'Behind the scenes of the new project... Subscribe to see the full set! 📸',
    likes: 340,
    reposts: 22,
    shares: 10,
    quotes: 5,
    comments: [],
    timestamp: '3h ago',
    isExclusive: true,
    isLocked: true, // User is NOT subscribed to Emily
    imageUrls: ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'v1',
    user: MOCK_USERS[0],
    content: 'The scale of this cinematic world is breathtaking. 🎬✨ #Cinematics #OpenSource',
    likes: 2453,
    reposts: 432,
    shares: 4014,
    quotes: 89,
    comments: [],
    timestamp: '15m ago',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    adRevenue: 12.45
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'tip',
    user: MOCK_USERS[2],
    timestamp: '5m ago',
    read: false,
    text: 'sent you 50 Nexus Gold!',
    amount: 50
  },
  {
    id: 'n2',
    type: 'subscription',
    user: MOCK_USERS[0],
    timestamp: '20m ago',
    read: false,
    text: 'just joined your Fan Club! 🎉'
  }
];

// Added MOCK_STORIES to resolve error in Stories.tsx
export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    user: MOCK_USERS[0],
    imageUrl: 'https://picsum.photos/id/10/800/1200',
    timestamp: '2h ago',
    isViewed: false
  },
  {
    id: 's2',
    user: MOCK_USERS[1],
    imageUrl: 'https://picsum.photos/id/20/800/1200',
    timestamp: '5h ago',
    isViewed: false
  },
  {
    id: 's-ad',
    user: MOCK_ADS[0].user,
    imageUrl: 'https://picsum.photos/id/30/800/1200',
    timestamp: 'Sponsored',
    isSponsored: true
  }
];

// Added MOCK_CONVERSATIONS to resolve error in Messages.tsx
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    user: MOCK_USERS[0],
    lastMessage: 'The new AI tools are incredible!',
    timestamp: '2m',
    unread: true,
    messages: [
      {
        id: 'm1',
        senderId: MOCK_USERS[0].id,
        text: 'Hey Alex, did you see the new update?',
        timestamp: '10:00 AM',
        isOwn: false
      },
      {
        id: 'm2',
        senderId: 'u1',
        text: 'Not yet, what happened?',
        timestamp: '10:05 AM',
        isOwn: true
      },
      {
        id: 'm3',
        senderId: MOCK_USERS[0].id,
        text: 'The new AI tools are incredible!',
        timestamp: '10:10 AM',
        isOwn: false
      }
    ]
  },
  {
    id: 'c2',
    user: MOCK_USERS[1],
    lastMessage: 'See you there!',
    timestamp: '1h',
    unread: false,
    messages: []
  }
];
