
import React, { useState } from 'react';
import { Heart, MessageCircle, UserPlus, AtSign, Settings, Check, Bell } from 'lucide-react';
import { Notification, NotificationType, User } from '../types';

interface NotificationsProps {
    notifications: Notification[];
    onNotificationClick?: (notification: Notification) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onNotificationClick }) => {
    const [filter, setFilter] = useState<'all' | NotificationType>('all');

    const filteredNotifications = notifications.filter(n => 
        filter === 'all' ? true : n.type === filter
    );

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'like':
                return <Heart className="w-5 h-5 text-pink-500 fill-current" />;
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-nexus-primary fill-current" />;
            case 'follow':
                return <UserPlus className="w-5 h-5 text-nexus-accent fill-current" />;
            case 'mention':
                return <AtSign className="w-5 h-5 text-green-500" />;
        }
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'like', icon: Heart, label: 'Likes' },
        { id: 'comment', icon: MessageCircle, label: 'Replies' },
        { id: 'mention', icon: AtSign, label: 'Mentions' },
        { id: 'follow', icon: UserPlus, label: 'Followers' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-gray-200">
                <div className="px-4 py-3 flex justify-between items-center">
                    <h2 className="font-bold text-xl text-gray-900">Notifications</h2>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex px-2 overflow-x-auto no-scrollbar gap-2 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                filter === tab.id 
                                    ? 'bg-black text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tab.icon && <tab.icon className={`w-4 h-4 ${filter === tab.id ? 'text-white' : 'text-gray-500'}`} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="pb-20">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Bell className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No notifications yet</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div 
                            key={notification.id}
                            onClick={() => onNotificationClick && onNotificationClick(notification)}
                            className={`flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                                !notification.read ? 'bg-nexus-primary/5' : ''
                            }`}
                        >
                            {/* Icon Column */}
                            <div className="pt-1">
                                {getIcon(notification.type)}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 min-w-0">
                                <div className="flex gap-2 mb-1">
                                    <img 
                                        src={notification.user.avatar} 
                                        alt={notification.user.name} 
                                        className="w-8 h-8 rounded-full object-cover" 
                                    />
                                    <div className="flex flex-col">
                                        <div className="text-sm">
                                            <span className="font-bold text-gray-900 mr-1">{notification.user.name}</span>
                                            <span className="text-gray-600">
                                                {notification.type === 'like' && 'liked your post'}
                                                {notification.type === 'comment' && 'commented on your post'}
                                                {notification.type === 'follow' && 'started following you'}
                                                {notification.type === 'mention' && 'mentioned you in a post'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">{notification.timestamp}</span>
                                    </div>
                                </div>

                                {/* Context (Text/Snippet) */}
                                {notification.text && (
                                    <div className="mt-1 text-[15px] text-gray-800">
                                        {notification.type === 'mention' && (
                                            <span className="text-nexus-primary">@alexr </span>
                                        )}
                                        {notification.text.replace('@alexr', '')}
                                    </div>
                                )}
                                
                                {notification.type === 'comment' && !notification.text && notification.post && (
                                     <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                                        "{notification.post.content}"
                                     </div>
                                )}
                            </div>

                            {/* Right Side (Post Thumbnail or Follow Button) */}
                            <div className="pl-2">
                                {notification.type === 'follow' ? (
                                    <button className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
                                        Follow back
                                    </button>
                                ) : notification.post && notification.post.imageUrl ? (
                                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                        <img src={notification.post.imageUrl} className="w-full h-full object-cover" alt="Post" />
                                    </div>
                                ) : notification.post && (
                                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center p-1">
                                        <span className="text-[8px] text-gray-400 leading-tight line-clamp-3">
                                            {notification.post.content}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
