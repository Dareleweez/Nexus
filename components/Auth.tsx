
import React, { useState, useRef } from 'react';
import { User, Sparkles, ChevronRight, UserCircle, AtSign, Fingerprint, Rocket, RefreshCw, LogIn, Camera, Image as ImageIcon } from 'lucide-react';

interface AuthProps {
  onAuthComplete: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    bio: '',
    avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRandomizeAvatar = () => {
    setFormData({
      ...formData,
      avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 500)}/200/200`
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            avatar: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: `u-${Date.now()}`,
      name: formData.name,
      handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`,
      avatar: formData.avatar,
      bio: formData.bio,
      followers: 0,
      following: 0,
      balance: 0,
      isPremium: false,
      isMonetized: false,
      isSubscribedTo: []
    };
    onAuthComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-nexus-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-nexus-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-nexus-accent/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-nexus-primary to-nexus-accent mb-2">
            NEXUS
          </h1>
          <p className="text-gray-400 font-medium tracking-wide">The future of social is yours to create.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex mb-8 bg-black/20 p-1 rounded-2xl">
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-nexus-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Join Nexus
            </button>
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-nexus-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Sign In
            </button>
          </div>

          {!isLogin ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <div className="relative inline-block group">
                      <div className="relative">
                        <img 
                          src={formData.avatar} 
                          className="w-32 h-32 rounded-full border-4 border-nexus-primary/30 p-1 object-cover shadow-2xl group-hover:scale-105 transition-transform" 
                          alt="Avatar Preview" 
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <button 
                          type="button"
                          onClick={handleRandomizeAvatar}
                          className="bg-nexus-accent text-white p-2.5 rounded-full shadow-lg hover:rotate-180 transition-transform duration-500"
                          title="Randomize Avatar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-nexus-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                          title="Upload Avatar"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-5 font-bold uppercase tracking-widest">Identify Yourself</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserCircle className="w-5 h-5 text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-nexus-primary/50 transition-all outline-none"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AtSign className="w-5 h-5 text-gray-500" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Unique Handle"
                        value={formData.handle}
                        onChange={(e) => setFormData({...formData, handle: e.target.value})}
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-nexus-primary/50 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => formData.name && formData.handle && setStep(2)}
                    className="w-full bg-nexus-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-nexus-primary/90 transition-all shadow-xl shadow-nexus-primary/20"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="relative">
                      <textarea 
                        placeholder="Tell the world about yourself (Bio)"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={4}
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 px-4 text-white focus:ring-2 focus:ring-nexus-primary/50 transition-all outline-none resize-none"
                      />
                    </div>
                    <div className="p-4 bg-nexus-primary/10 border border-nexus-primary/20 rounded-2xl">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-nexus-primary shrink-0" />
                        <p className="text-xs text-gray-400 leading-relaxed">
                          By joining, you unlock the <span className="text-white font-bold">Nexus Network</span>, AI-powered tools, and the Creator Economy dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-white/10 text-gray-400 font-bold py-4 rounded-2xl hover:bg-white/5 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] bg-gradient-to-r from-nexus-primary to-nexus-accent text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-nexus-primary/20"
                      >
                        Launch Nexus
                        <Rocket className="w-5 h-5" />
                      </button>
                    </div>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Fingerprint className="w-5 h-5 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter handle to sign in"
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-nexus-primary/50 transition-all outline-none"
                  />
                </div>
                <button 
                  onClick={() => onAuthComplete(null)} // Mocking sign in for demo
                  className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-xl shadow-white/10"
                >
                  Sign In
                  <LogIn className="w-5 h-5" />
                </button>
                <p className="text-center text-gray-500 text-xs font-medium italic">
                  Demo note: In this version, any handle works or simply create a new one.
                </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            Safe • Encrypted • Community Focused
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
