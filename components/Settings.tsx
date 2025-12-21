
import React, { useState, useEffect } from 'react';
// Added missing 'X' icon import to resolve the error on line 148
import { User, Bell, Lock, Eye, ChevronRight, Shield, Smartphone, LogOut, Moon, Sun, Database, Trash2, Info, Activity, ShieldAlert, Heart, MessageSquare, Cloud, Terminal, Copy, ExternalLink, Rocket, X } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onClearData: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogout, onClearData, isDarkMode, toggleDarkMode }) => {
  const [storageUsed, setStorageUsed] = useState<string>('0 KB');
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('bug');

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
    alert('Command copied! Paste this into your Cloud Shell.');
  };

  const sections = [
    {
      title: 'Cloud & Deployment',
      items: [
        { 
          icon: Rocket, 
          label: 'Deployment Assistant', 
          desc: 'Deploy this site to Google Cloud from your phone.', 
          onClick: () => setIsDeployGuideOpen(true) 
        },
        { 
          icon: Cloud, 
          label: 'Google Cloud Console', 
          desc: 'Manage your live infrastructure.', 
          onClick: () => window.open('https://console.cloud.google.com', '_blank') 
        }
      ]
    },
    {
      title: 'Your Account',
      items: [
        { icon: User, label: 'Account Information', desc: 'See your account information like your handle and email.' },
        { icon: LogOut, label: 'Log out', desc: 'Sign out of your account on this device.', danger: true, onClick: onLogout },
      ]
    },
    {
      title: 'Data & Privacy',
      items: [
        { icon: Database, label: 'Browser Storage', desc: `Nexus is using ${storageUsed} of local space.` },
        { icon: Trash2, label: 'Clear All Local Data', desc: 'Reset all posts and settings.', danger: true, onClick: () => {
          if (confirm('Are you sure you want to clear all data?')) {
            onClearData();
          }
        }},
      ]
    }
  ];

  return (
    <div className="pb-20 bg-white dark:bg-nexus-900 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-bold text-xl text-gray-900 dark:text-gray-100">Settings</h2>
      </div>

      {/* Status Hero */}
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

      {/* Deployment Assistant Modal */}
      {isDeployGuideOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white dark:bg-nexus-900 w-full max-w-2xl h-[80vh] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-nexus-primary" />
                            Mobile Deploy Assistant
                        </h4>
                        <p className="text-xs text-gray-500">Deploying from Android Phone via Cloud Shell</p>
                    </div>
                    <button onClick={() => setIsDeployGuideOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-nexus-800 rounded-full">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    <div className="space-y-4">
                        <h5 className="font-bold text-nexus-primary flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-nexus-primary text-white flex items-center justify-center text-xs">1</span>
                            Open Cloud Shell
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Open Chrome and go to <span className="font-mono text-nexus-accent">shell.cloud.google.com</span>. Enable "Desktop Site" in your browser settings.</p>
                        <button 
                            onClick={() => window.open('https://shell.cloud.google.com', '_blank')}
                            className="text-xs font-bold text-nexus-primary flex items-center gap-1 hover:underline"
                        >
                            Open Shell <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h5 className="font-bold text-nexus-primary flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-nexus-primary text-white flex items-center justify-center text-xs">2</span>
                            Initialize Project
                        </h5>
                        <div className="bg-nexus-950 p-4 rounded-xl font-mono text-xs text-amber-400 flex justify-between items-center border border-amber-900/20">
                            <code>gcloud init</code>
                            <button onClick={() => copyToClipboard('gcloud init')} className="text-white opacity-50 hover:opacity-100"><Copy className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="font-bold text-nexus-primary flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-nexus-primary text-white flex items-center justify-center text-xs">3</span>
                            Deploy to Cloud Run
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Run this command to build your container and host it globally.</p>
                        <div className="bg-nexus-950 p-4 rounded-xl font-mono text-xs text-amber-400 flex justify-between items-center border border-amber-900/20">
                            <code className="break-all">gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/nexus-social</code>
                            <button onClick={() => copyToClipboard('gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/nexus-social')} className="text-white opacity-50 hover:opacity-100 shrink-0 ml-2"><Copy className="w-4 h-4" /></button>
                        </div>
                        <div className="bg-nexus-950 p-4 rounded-xl font-mono text-xs text-amber-400 flex justify-between items-center border border-amber-900/20">
                            <code className="break-all">gcloud run deploy nexus-social --image gcr.io/$GOOGLE_CLOUD_PROJECT/nexus-social --platform managed --allow-unauthenticated</code>
                            <button onClick={() => copyToClipboard('gcloud run deploy nexus-social --image gcr.io/$GOOGLE_CLOUD_PROJECT/nexus-social --platform managed --allow-unauthenticated')} className="text-white opacity-50 hover:opacity-100 shrink-0 ml-2"><Copy className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
              </div>
          </div>
      )}

      <div className="p-6 mt-4 mx-4 bg-nexus-primary/5 rounded-2xl border border-nexus-primary/10 flex gap-4">
        <Info className="w-6 h-6 text-nexus-primary shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Nexus uses edge delivery via Google Cloud Artifact Registry. Ensure your Android device is on a stable connection during image uploads.
        </p>
      </div>
    </div>
  );
};

export default Settings;
