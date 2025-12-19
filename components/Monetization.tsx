
import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Users, DollarSign, Award, ArrowUpRight, Coins, Zap, BarChart3, Info, Sparkles, Loader2 } from 'lucide-react';
import { User } from '../types';

interface MonetizationProps {
  currentUser: User;
}

const Monetization: React.FC<MonetizationProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const earnings = {
    balance: currentUser.balance || 0,
    monthly: 450.25,
    tips: 120,
    subscriptions: 32,
    growth: 12.5
  };

  const generateAIAdvice = async () => {
    setLoading(true);
    // Simulate Gemini API call for strategy advice
    setTimeout(() => {
        setAdvice("Creators who post video content at 6:00 PM PST see 45% higher tipping engagement. Consider creating an 'Exclusive' series for your Pro subscribers to increase MRR by 15%.");
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 pb-20">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-black text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-nexus-primary" />
            Earnings Dashboard
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-nexus-primary to-nexus-accent rounded-[2.5rem] p-8 text-white shadow-2xl shadow-nexus-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                <Coins className="w-32 h-32" />
            </div>
            <div className="relative z-10">
                <span className="text-nexus-primary-foreground/70 font-bold uppercase tracking-[0.2em] text-xs">Total Balance</span>
                <div className="flex items-center gap-3 mt-1">
                    <h3 className="text-5xl font-black">{earnings.balance.toLocaleString()}</h3>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Nexus Gold</span>
                </div>
                <div className="flex gap-4 mt-8">
                    <button className="bg-white text-nexus-primary px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition-transform shadow-lg">
                        Withdraw
                    </button>
                    <button className="bg-white/10 border border-white/20 backdrop-blur-sm px-8 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-all">
                        History
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                        <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                    <span className="text-green-500 text-xs font-bold flex items-center bg-green-500/5 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +{earnings.growth}%
                    </span>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Monthly Revenue</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">${earnings.monthly}</p>
            </div>

            <div className="bg-gray-50 dark:bg-nexus-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-nexus-accent/10 rounded-2xl">
                        <Users className="w-6 h-6 text-nexus-accent" />
                    </div>
                </div>
                <h4 className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider">Active Subscribers</h4>
                <p className="text-3xl font-black text-gray-900 dark:text-gray-100 mt-1">{earnings.subscriptions}</p>
            </div>
        </div>

        {/* AI Strategy Advisor */}
        <div className="bg-white dark:bg-nexus-900 rounded-[2rem] border-2 border-dashed border-nexus-primary/30 p-8 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-nexus-primary/10 rounded-xl">
                        <Sparkles className="w-6 h-6 text-nexus-primary" />
                    </div>
                    <h4 className="font-black text-xl">AI Growth Strategy</h4>
                </div>
                <button 
                  onClick={generateAIAdvice}
                  disabled={loading}
                  className="bg-nexus-primary text-white font-bold text-xs py-2 px-6 rounded-full hover:bg-nexus-primary/90 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    Analyze Profile
                </button>
            </div>

            {advice ? (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                        "{advice}"
                    </p>
                    <div className="mt-4 flex gap-2">
                        <span className="bg-gray-100 dark:bg-nexus-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase">Suggested Content: Video</span>
                        <span className="bg-gray-100 dark:bg-nexus-800 px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase">Est. Lift: +15%</span>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400 text-sm">Nexus AI analyzes your engagement patterns and tipping trends to suggest the best path for monetization. Click Analyze to begin.</p>
            )}
        </div>

        {/* Tiers List */}
        <div>
            <h4 className="font-black text-lg mb-4 ml-2">Subscription Tiers</h4>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-nexus-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-nexus-primary rounded-2xl">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-gray-100">Standard Subscriber</p>
                            <p className="text-xs text-gray-500">Access to locked posts</p>
                        </div>
                    </div>
                    <span className="font-black text-nexus-primary">$4.99/mo</span>
                </div>
                <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[1.5rem] text-gray-400 font-bold hover:bg-gray-50 transition-all text-sm">
                    + Add New Tier
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Monetization;
