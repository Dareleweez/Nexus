import React from 'react';
import { User, Bell, Lock, Eye, ChevronRight, Shield, Smartphone, LogOut } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout }) => {
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
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-900">Settings</h2>
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-100">
        {/* Search Settings (Placeholder) */}
        <div className="p-4">
           <input 
             type="text" 
             placeholder="Search Settings" 
             className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary rounded-full px-4 py-2 transition-all outline-none"
           />
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="py-2">
            <h3 className="px-4 py-2 font-bold text-lg text-gray-900">{section.title}</h3>
            <div>
              {section.items.map((item, itemIdx) => (
                <button 
                  key={itemIdx} 
                  onClick={item.onClick}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.danger ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
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