
import React, { useState, useEffect } from 'react';
import { Conversation, Message, User } from '../types';
import { MOCK_CONVERSATIONS, CURRENT_USER, MOCK_USERS } from '../constants';
import { Search, Settings, ArrowLeft, Send, MoreHorizontal, Image as ImageIcon, Smile, Plus, X } from 'lucide-react';

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
        const currentY = window.scrollY;
        if (currentY < 50) {
            setShowHeader(true);
        } else if (currentY > lastScrollY) {
            setShowHeader(false);
        } else {
            setShowHeader(true);
        }
        setLastScrollY(currentY);
    };
    if (!selectedConversationId) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, selectedConversationId]);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text: messageInput,
      timestamp: 'Just now',
      isOwn: true,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          lastMessage: messageInput,
          timestamp: 'Just now',
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    setMessageInput('');
  };

  const startNewConversation = (user: User) => {
    // Check if conversation already exists with this user
    const existingConv = conversations.find(c => c.user.id === user.id);
    
    if (existingConv) {
      setSelectedConversationId(existingConv.id);
    } else {
      // Create a new conversation
      const newConv: Conversation = {
        id: `new-${Date.now()}`,
        user: user,
        lastMessage: '',
        timestamp: 'New',
        unread: false,
        messages: []
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversationId(newConv.id);
    }
    setShowNewMessageModal(false);
  };

  if (selectedConversation) {
    // Chat View
    return (
      <div className="flex flex-col h-screen md:h-[calc(100vh-0px)] pb-16 md:pb-0">
        {/* Chat Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 flex items-center gap-4">
          <button 
            onClick={() => setSelectedConversationId(null)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-7 h-7 text-gray-900" />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <img 
              src={selectedConversation.user.avatar} 
              alt={selectedConversation.user.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-tight">{selectedConversation.user.name}</h2>
              <p className="text-xs text-gray-500">{selectedConversation.user.handle}</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-nexus-primary rounded-full transition-colors">
            <MoreHorizontal className="w-7 h-7" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {selectedConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Start a conversation with {selectedConversation.user.name}</p>
            </div>
          ) : (
            selectedConversation.messages.map((msg) => (
                <div 
                key={msg.id} 
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                <div 
                    className={`max-w-[70%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
                    msg.isOwn 
                        ? 'bg-nexus-primary text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                >
                    {msg.text}
                    <div className={`text-[10px] mt-1 ${msg.isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {msg.timestamp}
                    </div>
                </div>
                </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-gray-100 rounded-3xl px-4 py-2"
          >
            <button type="button" className="text-nexus-primary hover:bg-gray-200 p-2 rounded-full transition-colors">
              <ImageIcon className="w-6 h-6" />
            </button>
            <input 
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Start a message"
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500"
            />
            <button type="button" className="text-nexus-primary hover:bg-gray-200 p-2 rounded-full transition-colors">
              <Smile className="w-6 h-6" />
            </button>
            <button 
              type="submit" 
              disabled={!messageInput.trim()}
              className="text-nexus-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Conversation List View
  return (
    <div className="pb-20 relative">
      {/* Header */}
      <div className={`sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 flex justify-between items-center transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <h2 className="font-bold text-2xl text-gray-900">Messages</h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowNewMessageModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
                title="New Message"
            >
                <Plus className="w-7 h-7" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Settings className="w-7 h-7 text-gray-600" />
            </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-2.5 border border-transparent rounded-full leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-nexus-primary focus:border-nexus-primary transition-all text-base"
            placeholder="Search Direct Messages"
          />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => setSelectedConversationId(conv.id)}
            className={`px-4 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${conv.unread ? 'bg-nexus-primary/5' : ''}`}
          >
            <img 
              src={conv.user.avatar} 
              alt={conv.user.name} 
              className="w-14 h-14 rounded-full object-cover shrink-0 shadow-sm border border-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-gray-900 ${conv.unread ? 'text-black' : ''}`}>
                    {conv.user.name}
                  </span>
                  <span className="text-gray-500 text-sm truncate">
                    {conv.user.handle}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{conv.timestamp}</span>
              </div>
              <div className={`text-sm truncate ${conv.unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {conv.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-900">New Message</h3>
                    <button 
                        onClick={() => setShowNewMessageModal(false)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Suggested</div>
                    {MOCK_USERS.map(user => (
                        <button
                            key={user.id}
                            onClick={() => startNewConversation(user)}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                        >
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.handle}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
