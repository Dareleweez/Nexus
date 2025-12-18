
import React from 'react';
import { User, Bell, Lock, Eye, ChevronRight, Shield, Smartphone, LogOut, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, isDarkMode, toggleDarkMode }) => {
  const sections = [
    {
      title: 'Your Account',
      items: [
        { icon: User, label: 'Account Information', desc: 'See your account information like your phone number and email address.' },
        { icon: Lock, label: 'Change your password', desc: 'Change your password at any time.' },
        { icon: LogOut, label: 'Log out', desc: 'Sign out of your account.', danger: true, onClick: onLogout },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Push Notifications', desc: 'Manage your mobile notifications.' },
        { icon: Smartphone, label: 'SMS Notifications', desc: 'Manage your text message notifications.' },
      ]
    },
    {
      title: 'Privacy and Safety',
      items: [
        { icon: Shield, label: 'Audience and Tagging', desc: 'Manage what information you allow other people to see.' },
        { icon: Eye, label: 'Content you see', desc: 'Decide what you see on Nexus based on your preferences.' },
      ]
    }
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Settings</h2>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {/* Search Settings */}
        <div className="p-4">
           <input 
             type="text" 
             placeholder="Search Settings" 
             className="w-full bg-gray-100 dark:bg-nexus-800 border-transparent text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-nexus-700 focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary rounded-full px-4 py-2 transition-all outline-none"
           />
        </div>

        {/* Appearance Toggle */}
        <div className="py-2">
          <h3 className="px-4 py-2 font-bold text-lg text-gray-900 dark:text-gray-100">Display</h3>
          <button 
            onClick={toggleDarkMode}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-nexus-800 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-nexus-700">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Reduce glare and improve battery life.</div>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-nexus-primary' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </button>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="py-2">
            <h3 className="px-4 py-2 font-bold text-lg text-gray-900 dark:text-gray-100">{section.title}</h3>
            <div>
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx} 
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.danger ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-100 dark:bg-nexus-800 text-gray-600 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-nexus-700'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;