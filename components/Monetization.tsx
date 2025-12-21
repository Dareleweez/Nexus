
import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, BarChart3, Sparkles, Loader2, Zap, Coins, Globe, Target, UserPlus, PieChart, ArrowDownRight, History, CreditCard, Gift, Settings2, Check, ShieldCheck, Info, Heart } from 'lucide-react';
import { User } from '../types';
import { analyzeSentiment } from '../services/geminiService';

interface MonetizationProps {
  currentUser: User;
}

const Monetization: React.FC<MonetizationProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'analytics' | 'manage'>('analytics');
  const [advice, setAdvice] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<{ score: number; summary: string } | null>(null);
  
  const [features, setFeatures] = useState({
    adShare: true,
    tips: true,
    subscriptions: currentUser.isMonetized || false,
    exclusiveContent: true
  });
  const [subPrice, setSubPrice] = useState(currentUser.subscriptionPrice || 4.99);

  const stats = {
    balance: currentUser.balance || 1450.75,
    breakdown: [
        { name: 'Ad Revenue Share', amount: 420.50, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50', pct: 29 },
        { name: 'Tips & Gifts', amount: 850.25, icon: Coins, color: 'text-nexus-accent', bg: 'bg-purple-50', pct: 58 },
        { name: 'Fan Subscriptions', amount: 180.00, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', pct: 13 }
    ],
    recentTransactions: [
        { id: 't1', type: 'tip', user: '@sarahc', amount: 50.00, date: '2h ago', status: 'Completed' },
        { id: 't2', type: 'subscription', user: '@emilyz', amount: 9.99, date: '5h ago', status: 'Completed' },
        { id: 't3', type: 'ad_share', user: 'Nexus Ads', amount: 12.45, date: 'Yesterday', status: 'Completed' },
        { id: 't4', type: 'tip', user: '@jwilson', amount: 25.00, date: 'Yesterday', status: 'Completed' },
    ],
    subscribers: 245,
    growth: 18.4
  };

  const generateAIAdvice = async () => {
    setLoading(true);
    // Simulate fetching latest comments for analysis
    const mockComments = [
        { id: '1', user: currentUser, text: "Love your AI content! More please.", timestamp: "1h" },
        { id: '2', user: currentUser, text: "Subscribed! Worth every penny.", timestamp: "2h" },
        { id: '3', user: currentUser, text: "Can you do a tutorial on these AI tools?", timestamp: "3h" }
    ];

    const result = await analyzeSentiment(mockComments);
    setSentiment(result);
    setAdvice(`Based on our analysis, your fan sentiment is ${result.score > 70 ? 'exceptional' : 'stable'}. ${result.summary} Recommendation: Release a tutorial post to capitalize on high curiosity!`);
    setLoading(false);
  };

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 pb-20">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
            <h2 className="font-black text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Wallet className="w-7 h-7 text-nexus-primary" />
                Creator Hub
            </h2>
            <div className="flex p-1 bg-gray-100 dark:bg-nexus-800 rounded-full">
                <button 
                    onClick={() => setActiveView('analytics')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeView === 'analytics' ? 'bg-white dark:bg-nexus-700 text-nexus-primary shadow-sm' : 'text-gray-500'}`}
                >
                    Analytics
                </button>
                <button 
                    onClick={() => setActiveView('manage')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeView === 'manage' ? 'bg-white dark:bg-nexus-700 text-nexus-primary shadow-sm' : 'text-gray-500'}`}
                >
                    Manage
                </button>
            </div>
        </div>
      </div>

      <div className="p-6 space-y-6 animate-in fade-in duration-300">
        {activeView === 'analytics' ? (
            <>
                {/* Main Earnings Card */}
                <div className="bg-gradient-to-br from-nexus-primary to-nexus-accent rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-110 transition-transform">
                        <PieChart className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-white/70 font-bold uppercase tracking-[0.2em] text-[10px]">Current Balance</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h3 className="text-5xl font-black tracking-tight">${stats.balance.toFixed(2)}</h3>
                                    <div className="flex items-center text-xs font-bold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {stats.growth}%
                                    </div>
                                </div>
                            </div>
                            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full font-black text-xs transition-all uppercase tracking-widest border border-white/10">
                                Cash Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Sentiment Gauge */}
                {sentiment && (
                    <div className="bg-white dark:bg-nexus-800 p-6 rounded-[2rem] border border-nexus-primary/20 shadow-lg animate-in slide-in-from-right-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs">AI Sentiment Engine</h4>
                            <span className="text-nexus-primary font-black text-2xl">{sentiment.score}/100</span>
                        </div>
                        <div className="h-4 bg-gray-100 dark:bg-nexus-900 rounded-full overflow-hidden mb-3">
                            <div 
                                className="h-full bg-gradient-to-r from-nexus-accent to-nexus-primary transition-all duration-1000"
                                style={{ width: `${sentiment.score}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed italic">"{sentiment.summary}"</p>
                    </div>
                )}

                {/* Performance Strategist */}
                <div className="bg-white dark:bg-nexus-900 rounded-[2.5rem] border-2 border-dashed border-nexus-primary/30 p-8 relative">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-nexus-primary/10 rounded-xl">
                                <Sparkles className="w-6 h-6 text-nexus-primary" />
                            </div>
                            <h4 className="font-black text-xl text-gray-900 dark:text-white">Earnings Advisor</h4>
                        </div>
                        <button 
                        onClick={generateAIAdvice}
                        disabled={loading}
                        className="bg-nexus-primary text-white font-bold text-xs py-2.5 px-6 rounded-full hover:bg-nexus-primary/90 transition-all flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            Audit Performance
                        </button>
                    </div>

                    {advice && (
                        <div className="animate-in fade-in slide-in-from-top-2 p-5 bg-nexus-primary/5 rounded-[1.5rem] border border-nexus-primary/10">
                            <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">"{advice}"</p>
                        </div>
                    )}
                </div>

                {/* Detailed Breakdown Card */}
                <div className="bg-gray-50 dark:bg-nexus-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-nexus-primary" />
                            Revenue Breakdown
                        </h4>
                    </div>
                    <div className="space-y-6">
                        {stats.breakdown.map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${item.bg} dark:bg-nexus-900/50`}>
                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                                    </div>
                                    <div className="font-black text-gray-900 dark:text-white">${item.amount.toFixed(2)}</div>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-nexus-700 rounded-full overflow-hidden">
                                    <div className={`h-full bg-nexus-primary transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="space-y-6">
                <div className="p-6 bg-nexus-primary/5 dark:bg-nexus-900/50 rounded-[2.5rem] border border-nexus-primary/20">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                        <Settings2 className="w-6 h-6 text-nexus-primary" />
                        Monetization Suite
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Configure how you earn on Nexus. Enable the tools that best fit your content strategy.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Monetization;
