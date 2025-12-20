
import React from 'react';
import { Home, Compass, Bell, User as UserIcon, Settings, Mail, Plus, Menu, Wallet, ShoppingBag } from 'lucide-react';
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
    { id: 'messages', icon: Mail, label: 'Messages' },
    { id: 'monetization', icon: Wallet, label: 'Monetization', desktopOnly: true },
    { id: 'store', icon: ShoppingBag, label: 'Store', desktopOnly: true },
    { id: 'create', icon: Plus, label: 'Post', mobileOnly: true, isAction: true },
    { id: 'profile', icon: UserIcon, label: 'Profile', desktopOnly: true },
    { id: 'menu', icon: Menu, label: 'Menu', mobileOnly: true },
  ];

  return (
    <div className="fixed bottom-0 w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white/80 dark:bg-nexus-900/80 md:bg-white/60 dark:md:bg-nexus-900/60 backdrop-blur-xl border-t md:border-t-0 md:border-r border-gray-200/60 dark:border-gray-800 z-50 flex md:flex-col justify-between p-4 transition-all duration-300">
      <div className="flex md:flex-col w-full md:w-auto justify-around md:justify-start gap-1 md:gap-4 overflow-y-auto no-scrollbar">
        <div className="hidden md:flex items-center mb-8 px-4">
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
                  ? 'bg-nexus-primary/10 text-nexus-primary font-bold shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-nexus-800/40 hover:text-black dark:hover:text-white hover:backdrop-blur-sm'
              }`}
            >
              {item.id === 'profile' ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile"
                    className={`w-8 h-8 rounded-full object-cover ${isActive ? 'ring-2 ring-nexus-primary' : ''}`}
                  />
              ) : (
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              )}
              <span className="hidden md:block text-lg">{item.label}</span>
            </button>
          );
        })}
        
        <button 
            onClick={onCreatePost}
            className="hidden md:block mt-6 bg-gradient-to-r from-nexus-primary to-nexus-accent text-white font-bold py-3.5 px-8 rounded-full hover:opacity-90 transition-all shadow-lg shadow-nexus-primary/20"
        >
            Post
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
