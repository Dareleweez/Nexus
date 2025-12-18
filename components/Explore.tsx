import React, { useEffect, useState } from 'react';
import { Search, Loader2, MoreHorizontal, Settings } from 'lucide-react';
import { getTrendingTopics } from '../services/geminiService';
import { TrendingTopic } from '../types';

const Explore: React.FC = () => {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const data = await getTrendingTopics();
        if (mounted) {
          setTrends(data);
        }
      } catch (error) {
        console.error("Failed to fetch trends", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTrends();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/* Sticky Search Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-2 border-b border-gray-200">
        <div className="relative group flex items-center gap-4">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search Nexus" 
                    className="block w-full pl-10 pr-3 py-2 bg-gray-100 border-transparent text-gray-900 placeholder-gray-500 focus:bg-white focus:border-nexus-primary focus:ring-1 focus:ring-nexus-primary rounded-full sm:text-sm transition-all outline-none"
                />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20 md:pb-0">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="font-bold text-xl text-gray-900">Trends for you</h2>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-nexus-primary mb-2" />
                <p className="text-gray-500 text-sm">Finding what's happening...</p>
            </div>
        ) : (
            <div>
                {trends.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No trending topics found at the moment.
                    </div>
                ) : (
                    trends.map((topic, index) => (
                        <a 
                            key={index} 
                            href={topic.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-8">
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <span>{topic.source || 'Trending'}</span>
                                        <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
                                        <span>Live</span>
                                    </div>
                                    <div className="font-bold text-gray-900 text-[15px] mb-1">
                                        {topic.title}
                                    </div>
                                    {topic.snippet && (
                                        <div className="text-sm text-gray-500 leading-snug line-clamp-2">
                                            {topic.snippet}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle menu option
                                        }}
                                        className="p-2 text-gray-400 hover:text-nexus-primary hover:bg-nexus-primary/10 rounded-full transition-colors"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Explore;