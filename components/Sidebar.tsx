
import React from 'react';
import { Home, Compass, Bell, User as UserIcon, Settings, Sparkles, Mail, Plus, Menu, Bookmark } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onCreatePost?: () => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onCreatePost, currentUser }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore', desktopOnly: true },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'create', icon: Plus, label: 'Post', mobileOnly: true, isAction: true },
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks', desktopOnly: true },
    { id: 'profile', icon: UserIcon, label: 'Profile', desktopOnly: true },
    { id: 'menu', icon: Menu, label: 'Menu', mobileOnly: true },
  ];

  return (
    <div className="fixed bottom-0 w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white/80 md:bg-white/60 backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-200/60 z-50 flex md:flex-col justify-between p-4 transition-all duration-300">
      <div className="flex md:flex-col w-full md:w-auto justify-around md:justify-start gap-1 md:gap-4">
        <div className="hidden md:flex items-center mb-10 px-4">
            <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-nexus-primary to-nexus-accent">NEXUS</h1>
        </div>

        {items.map((item) => {
          if (item.isAction) {
              return (
                <button
                    key={item.id}
                    onClick={onCreatePost}
                    className="md:hidden flex items-center justify-center p-3 rounded-full bg-nexus-primary text-white shadow-lg hover:bg-nexus-primary/90 transition-all"
                >
                    <item.icon className="w-6 h-6" />
                </button>
              );
          }

          const isActive = currentView === item.id;
          let displayClass = 'flex';
          if (item.desktopOnly) displayClass = 'hidden md:flex';
          if (item.mobileOnly) displayClass = 'flex md:hidden';
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`${displayClass} items-center gap-4 p-3 rounded-full transition-all duration-200 group ${
                isActive 
                  ? 'bg-white/50 shadow-sm text-black font-medium backdrop-blur-sm' 
                  : 'text-gray-600 hover:bg-white/40 hover:text-black hover:backdrop-blur-sm'
              }`}
            >
              {item.id === 'profile' ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile"
                    className={`w-8 h-8 rounded-full object-cover ${isActive ? 'ring-2 ring-black' : ''}`}
                  />
              ) : (
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              )}
              <span className="hidden md:block text-lg">{item.label}</span>
            </button>
          );
        })}
        
        <button 
          onClick={() => onViewChange('settings')}
          className={`hidden md:flex mt-4 items-center gap-4 p-3 rounded-full transition-all ${
             currentView === 'settings'
               ? 'bg-white/50 shadow-sm text-black font-medium backdrop-blur-sm'
               : 'text-gray-600 hover:bg-white/40 hover:text-black hover:backdrop-blur-sm'
          }`}
        >
             <Settings className="w-6 h-6" />
             <span className="text-lg">Settings</span>
        </button>

        <button 
            onClick={onCreatePost}
            className="hidden md:block mt-8 bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
        >
            Post
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
