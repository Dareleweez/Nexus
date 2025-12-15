import React from 'react';
import { Home, Compass, Bell, User, Settings, Sparkles } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 w-full md:w-64 md:h-screen md:sticky md:top-0 bg-black/95 md:bg-transparent backdrop-blur-lg border-t md:border-t-0 md:border-r border-zinc-800 z-50 flex md:flex-col justify-between p-4">
      <div className="flex md:flex-col w-full md:w-auto justify-around md:justify-start gap-1 md:gap-4">
        <div className="hidden md:flex items-center gap-2 mb-8 px-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-nexus-primary to-nexus-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Nexus</h1>
        </div>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`flex items-center gap-4 p-3 rounded-full transition-all duration-200 group ${
                isActive 
                  ? 'md:bg-zinc-800/50 text-white font-medium' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="hidden md:block text-lg">{item.label}</span>
            </button>
          );
        })}
        
        <button className="hidden md:flex mt-4 items-center gap-4 p-3 rounded-full text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">
             <Settings className="w-6 h-6" />
             <span className="text-lg">Settings</span>
        </button>

        <button className="hidden md:block mt-8 bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10">
            Post
        </button>
      </div>
    </div>
  );
};

export default Sidebar;