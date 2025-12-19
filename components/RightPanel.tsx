
import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, ExternalLink, Loader2, Sparkles, Zap } from 'lucide-react';
import { getTrendingTopics } from '../services/geminiService';
import { TrendingTopic } from '../types';

const RightPanel: React.FC = () => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTrends = async () => {
      setLoading(true);
      const data = await getTrendingTopics();
      if (mounted) {
        setTrends(data);
        setLoading(false);
      }
    };
    fetchTrends();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="hidden lg:block w-[350px] pl-8 py-4 sticky top-0 h-screen overflow-y-auto no-scrollbar">
      {/* Search Bar */}
      <div className="relative group mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-nexus-primary" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-3 py-2.5 border border-gray-200/50 rounded-full leading-5 bg-white/50 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nexus-primary focus:bg-white/80 transition-all shadow-sm"
          placeholder="Search Nexus"
        />
      </div>

      {/* Sidebar Ad Unit */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-nexus-primary to-nexus-accent text-white shadow-lg relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
              <Zap className="w-32 h-32" />
          </div>
          <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                  <Sparkles className="w-3 h-3" />
                  Sponsored
              </div>
              <h3 className="font-black text-lg leading-tight mb-2">Build your dreams with Nexus Pro</h3>
              <p className="text-xs font-medium text-white/80 mb-4">Get exclusive access to the latest Gemini 3 models and advanced creation tools.</p>
              <button className="w-full bg-white text-nexus-primary font-black py-2 rounded-xl text-xs hover:scale-105 transition-transform shadow-md">
                  Upgrade Now
              </button>
          </div>
      </div>

      {/* Trending Box */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-4 border-b border-gray-200/50 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-nexus-accent" />
            <h2 className="font-bold text-xl text-gray-900">What's happening</h2>
        </div>
        
        {loading ? (
            <div className="p-8 flex justify-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        ) : (
            <div>
            {trends.map((topic, index) => (
                <a 
                    key={index} 
                    href={topic.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-3 hover:bg-white/40 transition-colors border-b border-gray-100/50 last:border-0"
                >
                    <div className="text-xs text-gray-500 flex justify-between">
                        <span>{topic.source || 'Trending'}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="font-bold text-[15px] mt-0.5 leading-tight text-gray-900">{topic.title}</div>
                    {topic.snippet && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {topic.snippet}
                        </div>
                    )}
                </a>
            ))}
            </div>
        )}
        
        <div className="p-4 hover:bg-white/40 cursor-pointer transition-colors text-nexus-primary text-sm font-medium">
            Show more
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 px-2">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <span>© 2025 Nexus Inc.</span>
      </div>
    </div>
  );
};

export default RightPanel;
