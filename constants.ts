import { User, Post } from './types';

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
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    user: MOCK_USERS[0],
    content: 'Just deployed my first AI-powered app! The future of coding is conversational. #AI #Tech',
    likes: 124,
    comments: [],
    timestamp: '2h ago',
    imageUrl: 'https://picsum.photos/id/1/800/400',
  },
  {
    id: 'p2',
    user: MOCK_USERS[1],
    content: 'Hiking through the Alps was an absolute dream. The air is so fresh up here! 🏔️',
    likes: 892,
    comments: [],
    timestamp: '5h ago',
    imageUrl: 'https://picsum.photos/id/1036/800/600',
  },
];