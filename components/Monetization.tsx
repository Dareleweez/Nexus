
import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, BarChart3, Sparkles, Loader2, Zap, Coins, Globe, Target, UserPlus, PieChart } from 'lucide-react';
import { User } from '../types';

interface MonetizationProps {
  currentUser: User;
}

const Monetization: React.FC<MonetizationProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const stats = {
    balance: currentUser.balance || 0,
    breakdown: {
        ads: 420.50,
        tips: 850.25,
        subscriptions: 180.00
    },
    subscribers: 245,
    cpm: 14.20,
    impressions: '1.2M',
    growth: 18.4
  };

  const generateAIAdvice = () => {
    setLoading(true);
    setTimeout(() => {
        setAdvice("Your locked posts are converting at 12%. Adding a 'Teaser Video' before the paywall could increase your subscription conversion by up to 25%. Try uploading a 15s clip today.");
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 pb-20">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-black text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-nexus-primary" />
            Creator Hub
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-nexus-primary to-nexus-accent rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                <PieChart className="w-32 h-32" />
            </div>
            <div className="relative z-10">
                <span className="text-nexus-primary-foreground/70 font-bold uppercase tracking-[0.2em] text-xs">Total creator balance</span>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-5xl font-black">${stats.balance.toFixed(2)}</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Ads</p>
                        <p className="font-bold">${stats.breakdown.ads}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Tips</p>
                        <p className="font-bold">${stats.breakdown.tips}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60">Subs</p>
                        <p className="font-bold">${stats.breakdown.subscriptions}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-nexus-primary/10 rounded-2xl">
                        <UserPlus className="w-6 h-6 text-nexus-primary" />
                    </div>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Active Fans</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">{stats.subscribers}</p>
            </div>

            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-nexus-accent/10 rounded-2xl">
                        <Coins className="w-6 h-6 text-nexus-accent" />
                    </div>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Nexus Gold Tipped</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">4.2K</p>
            </div>
        </div>

        {/* AI Performance Strategist */}
        <div className="bg-white dark:bg-nexus-900 rounded-[2.5rem] border-2 border-dashed border-nexus-primary/30 p-8 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-nexus-primary/10 rounded-xl">
                        <Sparkles className="w-6 h-6 text-nexus-primary" />
                    </div>
                    <h4 className="font-black text-xl text-gray-900 dark:text-white">Monetization AI Advisor</h4>
                </div>
                <button 
                  onClick={generateAIAdvice}
                  disabled={loading}
                  className="bg-nexus-primary text-white font-bold text-xs py-2.5 px-6 rounded-full hover:bg-nexus-primary/90 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Analyze
                </button>
            </div>

            {advice && (
                <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-nexus-primary/5 rounded-2xl border border-nexus-primary/10">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">"{advice}"</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Monetization;
