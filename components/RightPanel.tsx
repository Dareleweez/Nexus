import React, { useEffect, useState } from 'react';
import { Search, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
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
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-nexus-primary" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-zinc-900 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-nexus-primary focus:bg-black transition-all"
          placeholder="Search Nexus"
        />
      </div>

      {/* Trending Box */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-nexus-accent" />
            <h2 className="font-bold text-xl">What's happening</h2>
        </div>
        
        {loading ? (
            <div className="p-8 flex justify-center text-zinc-500">
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
                    className="block px-4 py-3 hover:bg-zinc-800/50 transition-colors"
                >
                    <div className="text-xs text-zinc-500 flex justify-between">
                        <span>{topic.source || 'Trending'}</span>
                        <ExternalLink className="w-3 h-3" />
                    </div>
                    <div className="font-bold text-[15px] mt-0.5 leading-tight">{topic.title}</div>
                    {topic.snippet && (
                        <div className="text-sm text-zinc-400 mt-1 line-clamp-2">
                            {topic.snippet}
                        </div>
                    )}
                </a>
            ))}
            </div>
        )}
        
        <div className="p-4 hover:bg-zinc-800/50 cursor-pointer transition-colors text-nexus-primary text-sm">
            Show more
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-500 px-2">
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