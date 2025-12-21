
import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Eye, ChevronRight, Shield, Smartphone, Moon, Sun, Database, Trash2, Info, Activity, ShieldAlert, Heart, MessageSquare, Cloud, Terminal, Copy, ExternalLink, Rocket, X } from 'lucide-react';

interface SettingsProps {
  onClearData: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearData, isDarkMode, toggleDarkMode }) => {
  const [storageUsed, setStorageUsed] = useState<string>('0 KB');
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  useEffect(() => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    setStorageUsed((total / 1024).toFixed(2) + ' KB');
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Command copied!');
  };

  const sections = [
    {
      title: 'Cloud & Deployment',
      items: [
        { 
          icon: Rocket, 
          label: 'Deployment Assistant', 
          desc: 'Manage your cloud presence.', 
          onClick: () => setIsDeployGuideOpen(true) 
        },
        { 
          icon: Cloud, 
          label: 'Google Cloud Console', 
          desc: 'Manage live infrastructure.', 
          onClick: () => window.open('https://console.cloud.google.com', '_blank') 
        }
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Account Information', desc: 'Manage your profile and handle.' }
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { icon: Database, label: 'Browser Storage', desc: `Nexus is using ${storageUsed} of local space.` },
        { icon: Trash2, label: 'Reset Nexus Environment', desc: 'Clear all local session data.', danger: true, onClick: onClearData },
      ]
    }
  ];

  return (
    <div className="pb-20 bg-white dark:bg-nexus-900 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Settings</h2>
      </div>

      <div className="p-4">
        <div className="bg-black text-green-400 p-6 rounded-[2rem] font-mono text-sm border border-green-900/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Activity className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full animate-pulse ${healthStatus === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="font-bold uppercase tracking-widest text-[10px]">Nexus Environment: Production</span>
            </div>
            <div className="space-y-1">
                <p>> CLOUD_PROVIDER: GOOGLE_CLOUD</p>
                <p>> REGION: GLOBAL_EDGE</p>
                <p>> STORAGE_LOAD: {storageUsed}</p>
                <p>> BUILD_STATUS: STABLE</p>
            </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        <div className="py-2">
          <h3 className="px-4 py-2 font-bold text-lg text-gray-900 dark:text-gray-100">Display</h3>
          <button onClick={toggleDarkMode} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-nexus-800 text-gray-600 dark:text-gray-300">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</div>
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
            {section.items.map((item, itemIdx) => (
              <button key={itemIdx} onClick={item.onClick} className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-nexus-800 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${item.danger ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-100 dark:bg-nexus-800 text-gray-600 dark:text-gray-300'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>{item.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        ))}
      </div>

      {isDeployGuideOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white dark:bg-nexus-900 w-full max-w-2xl h-[80vh] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-nexus-primary" />
                            Mobile Deploy Assistant
                        </h4>
                        <p className="text-xs text-gray-500">Nexus Infrastructure Tools</p>
                    </div>
                    <button onClick={() => setIsDeployGuideOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-nexus-800 rounded-full">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar text-gray-900 dark:text-white">
                    <p>Deployment tools and cloud shell configurations are accessible via your Google Cloud console.</p>
                </div>
              </div>
          </div>
      )}

      <div className="p-6 mt-4 mx-4 bg-nexus-primary/5 rounded-2xl border border-nexus-primary/10 flex gap-4">
        <Info className="w-6 h-6 text-nexus-primary shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Nexus uses edge delivery via Google Cloud Infrastructure. Session state is stored locally for immediate performance.
        </p>
      </div>
    </div>
  );
};

export default Settings;
