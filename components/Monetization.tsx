
import React, { useState } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, BarChart3, Sparkles, Loader2, Zap, Coins, Globe, Target, UserPlus, PieChart, ArrowDownRight, History, CreditCard, Gift, Settings2, Check, ShieldCheck, Info } from 'lucide-react';
import { User } from '../types';

interface MonetizationProps {
  currentUser: User;
}

const Monetization: React.FC<MonetizationProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'analytics' | 'manage'>('analytics');
  const [advice, setAdvice] = useState<string | null>(null);
  
  // Feature states
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
        { name: 'Fan Subscriptions', amount: 180.00, icon: HeartIcon, color: 'text-pink-500', bg: 'bg-pink-50', pct: 13 }
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

  const generateAIAdvice = () => {
    setLoading(true);
    setTimeout(() => {
        setAdvice("Your 'Tips' revenue is outperforming Subscriptions by 300%. Consider offering 'Tip-to-Unlock' polls to engage your highest-paying fans and stabilize monthly recurring revenue.");
        setLoading(false);
    }, 1500);
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
                        
                        <div className="mt-8 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {['Last 7 Days', 'Last 30 Days', 'All Time'].map((tab, i) => (
                                <button key={tab} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${i === 0 ? 'bg-white text-nexus-primary border-white' : 'border-white/20 hover:bg-white/10'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown Card */}
                <div className="bg-gray-50 dark:bg-nexus-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-nexus-primary" />
                            Revenue Breakdown
                        </h4>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">By Source</span>
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
                                    <div className="text-right">
                                        <div className="font-black text-gray-900 dark:text-white">${item.amount.toFixed(2)}</div>
                                        <div className="text-[10px] font-black text-gray-400">{item.pct}% of total</div>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-nexus-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-nexus-primary transition-all duration-1000 ease-out rounded-full`}
                                        style={{ width: `${item.pct}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Performance Strategist */}
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
                            Analyze Insights
                        </button>
                    </div>

                    {advice ? (
                        <div className="animate-in fade-in slide-in-from-top-2 p-5 bg-nexus-primary/5 rounded-[1.5rem] border border-nexus-primary/10">
                            <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium italic">"{advice}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-4 border border-gray-100 dark:border-gray-800 rounded-2xl border-dotted">
                            <p className="text-gray-400 text-sm font-medium">Click analyze to get AI-powered monetization tips</p>
                        </div>
                    )}
                </div>

                {/* Recent Transactions List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h4 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                            <History className="w-6 h-6 text-gray-400" />
                            Recent Activity
                        </h4>
                        <button className="text-xs font-bold text-nexus-primary hover:underline">View All</button>
                    </div>
                    
                    <div className="bg-white dark:bg-nexus-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 divide-y dark:divide-gray-800 overflow-hidden shadow-sm">
                        {stats.recentTransactions.map((tx) => (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-nexus-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-full ${
                                        tx.type === 'tip' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                        tx.type === 'subscription' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' :
                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                    }`}>
                                        {tx.type === 'tip' ? <Coins className="w-5 h-5" /> : 
                                        tx.type === 'subscription' ? <CreditCard className="w-5 h-5" /> : 
                                        <BarChart3 className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                                            {tx.type === 'tip' ? `Tip from ${tx.user}` :
                                            tx.type === 'subscription' ? `Sub from ${tx.user}` :
                                            `Ad Share: ${tx.user}`}
                                        </div>
                                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{tx.date} • {tx.status}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-gray-900 dark:text-white">
                                        +${tx.amount.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="space-y-6">
                {/* Feature Controls Header */}
                <div className="p-6 bg-nexus-primary/5 dark:bg-nexus-900/50 rounded-[2.5rem] border border-nexus-primary/20">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                        <Settings2 className="w-6 h-6 text-nexus-primary" />
                        Monetization Suite
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Configure how you earn on Nexus. Enable the tools that best fit your content strategy.</p>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                    <div className="p-6 bg-white dark:bg-nexus-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-gray-900 dark:text-white">Ad Revenue Share</h4>
                                    <p className="text-xs text-gray-500">Earn from Nexus ads displayed on your posts.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFeature('adShare')}
                                className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 ${features.adShare ? 'bg-nexus-primary' : 'bg-gray-200 dark:bg-nexus-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${features.adShare ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        {features.adShare && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-nexus-900/50 rounded-xl flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active • Daily Payouts Enabled</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white dark:bg-nexus-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-nexus-accent/10 dark:bg-nexus-accent/20 rounded-2xl text-nexus-accent">
                                    <Coins className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-gray-900 dark:text-white">Tips & Gifts</h4>
                                    <p className="text-xs text-gray-500">Let followers support you with Nexus Gold.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFeature('tips')}
                                className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 ${features.tips ? 'bg-nexus-primary' : 'bg-gray-200 dark:bg-nexus-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${features.tips ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-nexus-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl text-pink-600">
                                    <HeartIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg text-gray-900 dark:text-white">Fan Subscriptions</h4>
                                    <p className="text-xs text-gray-500">Offer exclusive content for a monthly fee.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleFeature('subscriptions')}
                                className={`w-14 h-7 rounded-full transition-colors relative flex items-center px-1 ${features.subscriptions ? 'bg-nexus-primary' : 'bg-gray-200 dark:bg-nexus-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${features.subscriptions ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {features.subscriptions && (
                            <div className="space-y-4 animate-in slide-in-from-top-2">
                                <div className="p-5 bg-gray-50 dark:bg-nexus-900 rounded-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Monthly Price</span>
                                        <span className="font-black text-nexus-primary text-xl">${subPrice.toFixed(2)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.99" 
                                        max="99.99" 
                                        step="1.00"
                                        value={subPrice}
                                        onChange={(e) => setSubPrice(parseFloat(e.target.value))}
                                        className="w-full accent-nexus-primary h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                                        <span>MIN $0.99</span>
                                        <span>MAX $99.99</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                                    <div className="text-[11px] text-gray-600 dark:text-gray-300">
                                        <span className="font-bold">Estimated Take-home:</span> After Nexus fees and platform costs, you'll earn approx <span className="font-bold text-nexus-primary">${(subPrice * 0.8).toFixed(2)}</span> per subscriber.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Banner */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg bg-gray-900 dark:bg-white p-4 rounded-3xl shadow-2xl flex items-center justify-between z-40 animate-in slide-in-from-bottom-8">
                    <span className="text-white dark:text-black font-bold text-sm ml-2">Unsaved changes...</span>
                    <button className="bg-nexus-primary text-white font-black px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform">
                        Save Config
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// Simple Heart component for the breakdown
const HeartIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export default Monetization;
