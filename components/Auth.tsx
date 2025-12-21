
import React, { useState } from 'react';
import { 
  Rocket, 
  RefreshCw, 
  ChevronRight, 
  Fingerprint, 
  Github, 
  Chrome, 
  Apple, 
  Lock, 
  Mail 
} from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface AuthProps {
  onAuthComplete: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = (user: any) => {
    setLoading(true);
    // Simulate API delay for professional feel
    setTimeout(() => {
      onAuthComplete(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
      <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-blue-500/5 rounded-full blur-[80px]"></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Branding */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <Rocket className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-white mb-3">
            NEXUS<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto leading-relaxed">
            Welcome back to the future of social connectivity.
          </p>
        </div>

        {/* Auth Container - Now Login Only */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="p-8 md:p-12">
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="text-center">
                <h2 className="text-3xl font-black text-white">Sign In</h2>
                <p className="text-slate-500 text-sm mt-1">Access your Nexus dashboard and creator tools.</p>
              </div>

              <div className="space-y-6">
                {/* Account Selection for Demo */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Choose an Account</p>
                  <div className="grid grid-cols-1 gap-2">
                    {MOCK_USERS.slice(0, 3).map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleQuickLogin(user)}
                        disabled={loading}
                        className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.06] transition-all group disabled:opacity-50"
                      >
                        <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt={user.name} />
                        <div className="flex-1 text-left">
                          <div className="font-bold text-white text-base">{user.name}</div>
                          <div className="text-slate-500 text-xs">{user.handle}</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">Or login with</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Manual Login */}
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Email or Username"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none text-base"
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleQuickLogin(null)}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Continue to Dashboard'}
                  </button>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all text-slate-400 hover:text-white">
                    <Chrome className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all text-slate-400 hover:text-white">
                    <Apple className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all text-slate-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <Lock className="w-3 h-3" />
              Secure AES-256
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <Mail className="w-3 h-3" />
              Nexus Identity
            </div>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-12 text-center text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
          Authorized Access Only • © 2025 Nexus Inc.
        </div>
      </div>
    </div>
  );
};

export default Auth;
