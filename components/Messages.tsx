
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message, User } from '../types';
import { MOCK_CONVERSATIONS, CURRENT_USER, MOCK_USERS } from '../constants';
import { Search, Settings, ArrowLeft, MoreHorizontal, Image as ImageIcon, Smile, Plus, X } from 'lucide-react';

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (selectedConversationId) {
        scrollToBottom();
    }
  }, [selectedConversationId, conversations]);

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
    if (!selectedConversationId) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, selectedConversationId]);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    const existingConv = conversations.find(c => c.user.id === user.id);
    
    if (existingConv) {
      setSelectedConversationId(existingConv.id);
    } else {
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
    // Chat View - Immersive view that covers the bottom nav on mobile
    return (
      <div className="fixed inset-0 md:relative md:inset-auto z-[60] md:z-auto bg-white flex flex-col h-full w-full max-w-[750px] mx-auto animate-in slide-in-from-right duration-200">
        {/* Chat Header - Matched to Screenshot */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setSelectedConversationId(null)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors mr-1"
          >
            <ArrowLeft className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <img 
              src={selectedConversation.user.avatar} 
              alt={selectedConversation.user.name} 
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex flex-col min-w-0">
              <h2 className="font-bold text-[19px] text-gray-900 leading-tight truncate">{selectedConversation.user.name}</h2>
              <p className="text-[13px] text-gray-400 font-medium tracking-tight truncate">{selectedConversation.user.handle}</p>
            </div>
          </div>
          <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="w-7 h-7" strokeWidth={1.2} />
          </button>
        </div>

        {/* Messages List - Matched to Screenshot */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white no-scrollbar pb-32">
          {selectedConversation.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[85%] px-5 py-3 rounded-[24px] text-[16px] leading-snug ${
                  msg.isOwn 
                    ? 'bg-nexus-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-900 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <div className="text-[11px] mt-1.5 px-2 font-medium text-gray-400 tracking-wide">
                {msg.timestamp}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input - Pill shape, absolute bottom, replaces nav */}
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-[750px] mx-auto bg-white/95 backdrop-blur-md px-4 py-6 border-t border-gray-100 shrink-0 z-50">
          <div className="bg-gray-100 rounded-full flex items-center px-4 py-1 border border-gray-200/50 shadow-inner">
            <button type="button" className="text-nexus-primary p-2 hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" strokeWidth={1.8} />
            </button>
            <input 
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Start a message"
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-[17px] py-3.5 px-2"
            />
            <button type="button" className="text-nexus-primary p-2 hover:scale-110 transition-transform">
              <Smile className="w-6 h-6" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversation List View
  return (
    <div className="pb-20 relative bg-white min-h-screen">
      <div className={`sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-4 border-b border-gray-100 flex justify-between items-center transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <h2 className="font-bold text-2xl text-gray-900">Messages</h2>
        <div className="flex gap-1">
            <button 
                onClick={() => setShowNewMessageModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-900"
                title="New Message"
            >
                <Plus className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Settings className="w-7 h-7 text-gray-600" strokeWidth={1.5} />
            </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-50">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border-transparent rounded-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-nexus-primary/20 transition-all text-base shadow-sm"
            placeholder="Search Direct Messages"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => setSelectedConversationId(conv.id)}
            className={`px-4 py-5 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 ${conv.unread ? 'bg-nexus-primary/[0.03]' : ''}`}
          >
            <div className="relative">
                <img 
                  src={conv.user.avatar} 
                  alt={conv.user.name} 
                  className="w-[56px] h-[56px] rounded-full object-cover shrink-0 shadow-sm border border-gray-100"
                />
                {conv.unread && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-nexus-primary rounded-full border-2 border-white shadow-sm"></div>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-baseline mb-0.5">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className={`font-bold text-[16px] text-gray-900 truncate ${conv.unread ? 'text-black' : ''}`}>
                    {conv.user.name}
                  </span>
                  <span className="text-gray-400 text-[14px] truncate">
                    {conv.user.handle}
                  </span>
                </div>
                <span className="text-[12px] text-gray-400 shrink-0">{conv.timestamp}</span>
              </div>
              <div className={`text-[14px] truncate mt-0.5 ${conv.unread ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                {conv.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-xl text-gray-900">New Message</h3>
                    <button 
                        onClick={() => setShowNewMessageModal(false)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                    >
                        <X className="w-6 h-6" strokeWidth={1.5} />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                    <div className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Suggested</div>
                    {MOCK_USERS.map(user => (
                        <button
                            key={user.id}
                            onClick={() => startNewConversation(user)}
                            className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                        >
                            <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover shadow-sm" />
                            <div>
                                <div className="font-bold text-gray-900 text-[15px]">{user.name}</div>
                                <div className="text-gray-500 text-[13px]">{user.handle}</div>
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
