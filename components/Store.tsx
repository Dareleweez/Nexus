
import React from 'react';
import { ShoppingBag, Coins, BadgeCheck, Sparkles, Zap, Check, ArrowRight } from 'lucide-react';

const Store: React.FC = () => {
  const packs = [
    { amount: 500, price: 4.99, bonus: 0 },
    { amount: 1200, price: 9.99, bonus: 200 },
    { amount: 3000, price: 24.99, bonus: 750 },
    { amount: 7500, price: 49.99, bonus: 2500 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-nexus-900 pb-20">
      <div className="sticky top-0 bg-white/80 dark:bg-nexus-900/80 backdrop-blur-md z-30 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="font-black text-2xl text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-nexus-primary" />
            Nexus Store
        </h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Premium Upgrade Card */}
        <div className="relative rounded-[2.5rem] p-8 overflow-hidden bg-black text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-primary rounded-full blur-[100px] opacity-40 -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-nexus-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Upgrade</span>
                        <span className="text-nexus-accent text-xs font-black uppercase">Most Popular</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4">Nexus Premium</h3>
                    <ul className="space-y-3 mb-8">
                        {['Exclusive Gold Badge', 'Advanced Post Analytics', 'Zero Sponsored Posts', 'Early Access Features'].map(item => (
                            <li key={item} className="flex items-center gap-3 text-gray-300 font-medium">
                                <div className="p-1 bg-white/10 rounded-full">
                                    <Check className="w-3 h-3 text-nexus-accent" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full md:w-auto bg-white text-black font-black px-12 py-4 rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
                        Get Premium - $9.99/mo
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
                <div className="shrink-0 scale-125 md:scale-150 py-10">
                    <BadgeCheck className="w-24 h-24 text-nexus-primary animate-pulse" strokeWidth={1} />
                </div>
            </div>
        </div>

        {/* Nexus Gold Packs */}
        <div>
            <div className="flex items-center justify-between mb-6 px-2">
                <h4 className="font-black text-xl flex items-center gap-3">
                    <Coins className="w-6 h-6 text-nexus-accent" />
                    Nexus Gold
                </h4>
                <p className="text-sm text-gray-500 font-medium">Use for tipping creators</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {packs.map(pack => (
                    <button key={pack.amount} className="p-6 bg-gray-50 dark:bg-nexus-800 rounded-[2rem] border-2 border-transparent hover:border-nexus-accent transition-all text-center group relative overflow-hidden">
                        {pack.bonus > 0 && (
                            <div className="absolute top-2 right-2 bg-nexus-accent text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                +{pack.bonus} Bonus
                            </div>
                        )}
                        <div className="p-4 bg-nexus-accent/5 rounded-3xl mx-auto w-fit mb-4 group-hover:scale-110 transition-transform">
                            <Coins className="w-10 h-10 text-nexus-accent" />
                        </div>
                        <h5 className="font-black text-2xl text-gray-900 dark:text-gray-100">{pack.amount.toLocaleString()}</h5>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-tighter mb-4">Gold Coins</p>
                        <div className="bg-white dark:bg-nexus-900 py-2 rounded-full font-black text-nexus-accent text-sm shadow-sm group-hover:bg-nexus-accent group-hover:text-white transition-colors">
                            ${pack.price}
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-r from-nexus-accent/10 to-transparent p-8 rounded-[2rem] border border-nexus-accent/20 flex flex-col md:flex-row items-center gap-6">
            <div className="p-5 bg-nexus-accent/10 rounded-3xl">
                <Sparkles className="w-10 h-10 text-nexus-accent" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h5 className="font-black text-xl mb-1">Nexus Pro Creator</h5>
                <p className="text-gray-500 text-sm font-medium">Unlock full monetization tools, higher tipping splits, and unlimited exclusive posts.</p>
            </div>
            <button className="bg-nexus-accent text-white font-black px-8 py-3 rounded-full hover:opacity-90 transition-all text-sm whitespace-nowrap">
                Join Pro - $19.99/mo
            </button>
        </div>
      </div>
    </div>
  );
};

export default Store;
