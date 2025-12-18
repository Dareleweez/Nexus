
import { User, Post, Conversation, Story, Notification } from './types.ts';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@alexr',
  avatar: 'https://picsum.photos/id/64/150/150',
  bio: 'Digital explorer | AI enthusiast | Building the future 🚀',
  followers: 1250,
  following: 432,
};

export const MOCK_USERS: User[] = [
  {
    id: 'u2',
    name: 'Sarah Chen',
    handle: '@sarahc',
    avatar: 'https://picsum.photos/id/65/150/150',
    followers: 8900,
    following: 120,
  },
  {
    id: 'u3',
    name: 'David Miller',
    handle: '@dmiller',
    avatar: 'https://picsum.photos/id/91/150/150',
    followers: 450,
    following: 500,
  },
  {
    id: 'u4',
    name: 'Emily Zhang',
    handle: '@emilyz',
    avatar: 'https://picsum.photos/id/338/150/150',
    followers: 3200,
    following: 150,
  },
  {
    id: 'u5',
    name: 'James Wilson',
    handle: '@jwilson',
    avatar: 'https://picsum.photos/id/334/150/150',
    followers: 1200,
    following: 800,
  },
  {
    id: 'u6',
    name: 'Sofia Rodriguez',
    handle: '@sofiar',
    avatar: 'https://picsum.photos/id/342/150/150',
    followers: 5600,
    following: 430,
  },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    user: MOCK_USERS[0],
    imageUrl: 'https://picsum.photos/id/129/600/1000',
    timestamp: '2h ago',
    isViewed: false,
  },
  {
    id: 's2',
    user: MOCK_USERS[1],
    imageUrl: 'https://picsum.photos/id/111/600/1000',
    timestamp: '5h ago',
    isViewed: false,
  },
  {
    id: 's3',
    user: MOCK_USERS[2],
    imageUrl: 'https://picsum.photos/id/237/600/1000',
    timestamp: '30m ago',
    isViewed: false,
  },
  {
    id: 's4',
    user: MOCK_USERS[3],
    imageUrl: 'https://picsum.photos/id/48/600/1000',
    timestamp: '1h ago',
    isViewed: false,
  },
  {
    id: 's5',
    user: MOCK_USERS[4],
    imageUrl: 'https://picsum.photos/id/56/600/1000',
    timestamp: '3h ago',
    isViewed: true,
  },
  {
    id: 's6',
    user: MOCK_USERS[0],
    imageUrl: 'https://picsum.photos/id/26/600/1000',
    timestamp: '7h ago',
    isViewed: true,
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'v1',
    user: MOCK_USERS[3],
    content: 'The scale of this cinematic world is breathtaking. Loving the progress on this open-source film project! 🎬✨ #Cinematics #OpenSource',
    likes: 2453,
    reposts: 432,
    quotes: 89,
    comments: [],
    timestamp: '15m ago',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: 'v2',
    user: MOCK_USERS[4],
    content: 'Testing out the new motion blur effects. The detail in these renders is getting out of hand! 💻🔥 #DigitalArt #Tech',
    likes: 1890,
    reposts: 211,
    quotes: 45,
    comments: [],
    timestamp: '45m ago',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'p1',
    user: MOCK_USERS[0],
    content: 'Just deployed my first AI-powered app! The future of coding is conversational. #AI #Tech',
    likes: 124,
    reposts: 12,
    quotes: 3,
    comments: [
        {
            id: 'c1',
            user: MOCK_USERS[1],
            text: 'This is incredible! Which model did you use for the backend?',
            timestamp: '1h ago'
        },
        {
            id: 'c2',
            user: CURRENT_USER,
            text: 'Thanks Sarah! I used Gemini 2.5, it is blazingly fast.',
            timestamp: '30m ago'
        }
    ],
    timestamp: '2h ago',
    imageUrls: ['https://picsum.photos/id/1/800/1000'],
  },
  {
    id: 'p2',
    user: MOCK_USERS[1],
    content: 'Hiking through the Alps was an absolute dream. The air is so fresh up here! 🏔️',
    likes: 892,
    reposts: 56,
    quotes: 12,
    comments: [],
    timestamp: '5h ago',
    imageUrls: ['https://picsum.photos/id/1036/800/1200', 'https://picsum.photos/id/1037/800/1200'],
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    user: MOCK_USERS[0],
    lastMessage: 'Did you see the new AI model released yesterday?',
    timestamp: '2m',
    unread: true,
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Hey Alex! Long time no see.', timestamp: '10:00 AM', isOwn: false },
      { id: 'm2', senderId: 'u1', text: 'Hi Sarah! Yeah, been busy with the new project.', timestamp: '10:05 AM', isOwn: true },
      { id: 'm3', senderId: 'u2', text: 'Did you see the new AI model released yesterday?', timestamp: '10:07 AM', isOwn: false }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: MOCK_USERS[0],
    post: INITIAL_POSTS[0],
    timestamp: '2m ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'repost',
    user: MOCK_USERS[3],
    post: INITIAL_POSTS[0],
    timestamp: '1h ago',
    read: false,
  },
  {
    id: 'n6',
    type: 'follow',
    user: MOCK_USERS[2],
    timestamp: '1d ago',
    read: true,
  }
];
