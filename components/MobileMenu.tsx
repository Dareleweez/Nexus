
import React from 'react';
import { User, Settings, User as UserIcon, Compass, LogOut, X, ChevronRight, Bookmark, Moon, Sun, Wallet, ShoppingBag } from 'lucide-react';
import { ViewState, User as UserType } from '../types';

interface MobileMenuProps {
  currentUser: UserType;
  onViewChange: (view: ViewState) => void;
  onClose: () => void;
  onLogout: () => void;
  onUserClick: (user: UserType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ currentUser, onViewChange, onClose, onLogout, onUserClick, isDarkMode, toggleDarkMode }) => {
  const menuItems = [
    { 
      icon: UserIcon, 
      label: 'Profile', 
      onClick: () => { 
        onUserClick(currentUser);
      } 
    },
    { 
      icon: Compass, 
      label: 'Explore', 
      onClick: () => onViewChange('explore') 
    },
    { 
      icon: Bookmark, 
      label: 'Bookmarks', 
      onClick: () => onViewChange('bookmarks')
    },
    { 
      icon: Wallet, 
      label: 'Monetization', 
      onClick: () => onViewChange('monetization') 
    },
    { 
      icon: ShoppingBag, 
      label: 'Store', 
      onClick: () => onViewChange('store') 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onClick: () => onViewChange('settings') 
    },
  ];

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-200 bg-white dark:bg-nexus-900">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Menu</h2>
        <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-nexus-800 transition-colors"
        >
            <X className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-4 m-4 bg-gray-50 dark:bg-nexus-800 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-nexus-700 transition-colors" onClick={() => onUserClick(currentUser)}>
        <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-nexus-900 shadow-sm"
        />
        <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{currentUser.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">{currentUser.handle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        {menuItems.map((item, index) => (
            <button
                key={index}
                onClick={() => {
                    item.onClick();
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors text-left group"
            >
                <div className="p-2 bg-gray-100 dark:bg-nexus-800 rounded-full group-hover:bg-white dark:group-hover:bg-nexus-700 group-hover:shadow-sm transition-all text-gray-700 dark:text-gray-300">
                    <item.icon className="w-6 h-6" />
                </div>
                <span className="flex-1 font-semibold text-gray-700 dark:text-gray-200 text-lg">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-300 dark:text-gray-600" />
            </button>
        ))}

        <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors text-left group"
        >
            <div className="p-2 bg-gray-100 dark:bg-nexus-800 rounded-full group-hover:bg-white dark:group-hover:bg-nexus-700 group-hover:shadow-sm transition-all text-gray-700 dark:text-gray-300">
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </div>
            <span className="flex-1 font-semibold text-gray-700 dark:text-gray-200 text-lg">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-nexus-primary' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
        </button>

        <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>

        <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left group"
        >
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-all text-red-500">
                <LogOut className="w-6 h-6" />
            </div>
            <span className="flex-1 font-semibold text-red-500 text-lg">Log out</span>
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>Nexus Social v1.0.0</p>
      </div>
    </div>
  );
};

export default MobileMenu;
