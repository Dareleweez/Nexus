
import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, BarChart3, Sparkles, Loader2, Zap, Coins, Globe, Target } from 'lucide-react';
import { User } from '../types';

interface MonetizationProps {
  currentUser: User;
}

const Monetization: React.FC<MonetizationProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const stats = {
    balance: currentUser.balance || 0,
    monthlyRevenue: 1250.45,
    cpm: 14.20,
    impressions: '1.2M',
    growth: 18.4
  };

  const generateAIAdvice = () => {
    setLoading(true);
    setTimeout(() => {
        setAdvice("Your short-form videos are performing 40% better than text posts. Focus on 15-30s tutorials during peak hours (6PM-9PM) to maximize your Ad Revenue Share.");
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 pb-20">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-black text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-nexus-primary" />
            Ad Revenue Share
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Earnings Card */}
        <div className="bg-gradient-to-br from-nexus-primary to-nexus-accent rounded-[2.5rem] p-8 text-white shadow-2xl shadow-nexus-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                <DollarSign className="w-32 h-32" />
            </div>
            <div className="relative z-10">
                <span className="text-nexus-primary-foreground/70 font-bold uppercase tracking-[0.2em] text-xs">Available for Payout</span>
                <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-5xl font-black">${stats.balance.toFixed(2)}</h3>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-white text-nexus-primary px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition-transform shadow-lg">
                        Withdraw Earnings
                    </button>
                    <button className="bg-white/10 border border-white/20 backdrop-blur-sm px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all">
                        Statement
                    </button>
                </div>
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                        <BarChart3 className="w-6 h-6 text-green-500" />
                    </div>
                    <span className="text-green-500 text-xs font-bold flex items-center bg-green-500/5 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +{stats.growth}%
                    </span>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Ad Impressions</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">{stats.impressions}</p>
            </div>

            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Target className="w-6 h-6 text-blue-500" />
                    </div>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Avg. CPM</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">${stats.cpm.toFixed(2)}</p>
            </div>
        </div>

        {/* AI Performance Strategist */}
        <div className="bg-white dark:bg-nexus-900 rounded-[2.5rem] border-2 border-dashed border-nexus-primary/30 p-8 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-nexus-primary/10 rounded-xl">
                        <Sparkles className="w-6 h-6 text-nexus-primary" />
                    </div>
                    <h4 className="font-black text-xl text-gray-900 dark:text-white">AI Strategy Advisor</h4>
                </div>
                <button 
                  onClick={generateAIAdvice}
                  disabled={loading}
                  className="bg-nexus-primary text-white font-bold text-xs py-2.5 px-6 rounded-full hover:bg-nexus-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-nexus-primary/20"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Optimize
                </button>
            </div>

            {advice ? (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-nexus-primary/5 rounded-2xl border border-nexus-primary/10">
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                            "{advice}"
                        </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="bg-gray-100 dark:bg-nexus-800 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-tight">Est. Revenue Lift: +22%</span>
                        <span className="bg-gray-100 dark:bg-nexus-800 px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-tight">Priority: High</span>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-sm italic">Nexus AI analyzes your post performance to help you optimize for maximum ad revenue share. Click Optimize to run analysis.</p>
            )}
        </div>

        {/* Program Status */}
        <div className="p-8 bg-gray-50 dark:bg-nexus-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
            <h4 className="font-black text-xl mb-4 text-gray-900 dark:text-white">Revenue Share Settings</h4>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-nexus-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">Program Status: Active</span>
                    </div>
                    <span className="text-xs font-black text-nexus-primary uppercase">Tier 1 Creator</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-nexus-900 rounded-2xl border border-gray-100 dark:border-gray-700 opacity-50">
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-gray-400">Global Ad Inventory Access</span>
                    </div>
                    <button className="text-xs font-black text-gray-400 uppercase cursor-not-allowed">Unlocked</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Monetization;
