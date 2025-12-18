
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { User, Story } from '../types';
import { MOCK_STORIES } from '../constants';

interface StoriesProps {
  currentUser: User;
  connected?: boolean; // Prop to indicate it's part of the header layer
}

const Stories: React.FC<StoriesProps> = ({ currentUser, connected = false }) => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance logic
  useEffect(() => {
    if (viewerOpen) {
      setProgress(0);
      const duration = 5000; // 5 seconds per story
      const intervalTime = 50; // Update every 50ms
      const step = 100 / (duration / intervalTime);

      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + step;
        });
      }, intervalTime);

      return () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
      };
    }
  }, [viewerOpen, currentStoryIndex]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newStory: Story = {
        id: `s-${Date.now()}`,
        user: currentUser,
        imageUrl,
        timestamp: 'Just now',
        isViewed: false,
      };
      setStories([newStory, ...stories]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openViewer = (index: number) => {
    setCurrentStoryIndex(index);
    setViewerOpen(true);
    // Hide body scroll when viewer is open
    document.body.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setProgress(0);
    document.body.style.overflow = 'auto';
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      closeViewer();
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div className={`${connected ? 'bg-transparent' : 'bg-white border-b border-gray-200'} pt-1 pb-3 overflow-x-auto no-scrollbar`}>
      <div className="flex gap-5 px-4 min-w-max items-start">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
          <div className="relative" style={{ width: '4.5rem', height: '4.5rem' }}>
            <div className="w-full h-full rounded-full p-[4px] border-[2px] border-gray-300 border-dashed group-hover:border-nexus-primary group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300 transform">
                 <img 
                    src={currentUser.avatar} 
                    alt="Add Story" 
                    className="w-full h-full rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                 />
            </div>
            <div className="absolute bottom-0 right-0 bg-nexus-primary text-white rounded-full p-1.5 border-[3px] border-white shadow-lg group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-500 group-hover:text-nexus-primary transition-colors uppercase tracking-tight">Your Story</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Stories List */}
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => openViewer(index)}
          >
            <div 
              className={`rounded-full p-[4px] bg-gradient-to-tr ${story.isViewed ? 'from-gray-300 to-gray-200' : 'from-nexus-primary via-nexus-accent to-pink-500 shadow-lg shadow-nexus-primary/20'} group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-500 transform`} 
              style={{ width: '4.5rem', height: '4.5rem' }}
            >
              <div className="w-full h-full rounded-full bg-white p-[3px] transition-transform duration-500 group-hover:scale-95">
                <img 
                    src={story.user.avatar} 
                    alt={story.user.name} 
                    className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-900 max-w-[80px] truncate text-center tracking-tight transition-colors group-hover:text-nexus-primary">{story.user.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal - FULL PAGE */}
      {viewerOpen && stories[currentStoryIndex] && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-300">
           {/* Cinematic Blur Background */}
           <div 
             className="absolute inset-0 opacity-40 scale-110 bg-cover bg-center blur-[120px]"
             style={{ backgroundImage: `url(${stories[currentStoryIndex].imageUrl})` }}
           ></div>

           <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] overflow-hidden flex flex-col bg-transparent">
              {/* Top Navigation & Progress */}
              <div className="absolute top-0 left-0 w-full z-[110] px-4 pt-3 pb-8 bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex gap-1.5 mb-4">
                    {stories.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-white transition-all duration-100 ease-linear ${
                                    idx < currentStoryIndex ? 'w-full' : 
                                    idx === currentStoryIndex ? '' : 'w-0'
                                }`}
                                style={{ width: idx === currentStoryIndex ? `${progress}%` : undefined }}
                            ></div>
                        </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <img 
                            src={stories[currentStoryIndex].user.avatar} 
                            alt={stories[currentStoryIndex].user.name}
                            className="w-11 h-11 rounded-full border-2 border-white/20 shadow-lg" 
                          />
                          <div>
                              <div className="text-white text-[16px] font-bold drop-shadow-md tracking-tight leading-none mb-0.5">
                                  {stories[currentStoryIndex].user.name}
                              </div>
                              <div className="text-white/70 text-[12px] font-medium drop-shadow-sm">
                                  {stories[currentStoryIndex].timestamp}
                              </div>
                          </div>
                      </div>
                      <button 
                        onClick={closeViewer}
                        className="text-white p-2.5 rounded-full hover:bg-white/10 transition-all backdrop-blur-md"
                      >
                          <X className="w-7 h-7" />
                      </button>
                  </div>
              </div>

              {/* Main Content (The Image) */}
              <div className="flex-1 relative flex items-center justify-center p-0 md:p-12">
                  <img 
                    src={stories[currentStoryIndex].imageUrl} 
                    alt="Story Content" 
                    className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                  />
                  {/* Tap Navigation Zones */}
                  <div className="absolute inset-0 flex z-[105]">
                      <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev}></div>
                      <div className="w-2/3 h-full cursor-pointer" onClick={handleNext}></div>
                  </div>
              </div>
              
              {/* Bottom Reply Bar */}
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[110]">
                  <div className="flex gap-4 items-center max-w-3xl mx-auto">
                      <div className="flex-1 relative group">
                        <input 
                            type="text" 
                            placeholder={`Reply to ${stories[currentStoryIndex].user.name.split(' ')[0]}...`} 
                            className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 backdrop-blur-2xl transition-all text-base shadow-lg"
                        />
                      </div>
                      <button className="text-white p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-2xl border border-white/20 shadow-lg">
                         <ImageIcon className="w-6 h-6" />
                      </button>
                  </div>
              </div>
           </div>

           {/* Desktop Sidebar Arrows */}
           <button 
                onClick={handlePrev}
                className={`hidden md:flex absolute left-8 lg:left-12 text-white/30 hover:text-white hover:scale-110 transition-all z-[120] ${currentStoryIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                disabled={currentStoryIndex === 0}
           >
               <div className="bg-black/20 hover:bg-black/40 p-4 rounded-full backdrop-blur-md">
                 <ChevronLeft className="w-10 h-10" />
               </div>
           </button>
           <button 
                onClick={handleNext}
                className="hidden md:flex absolute right-8 lg:right-12 text-white/30 hover:text-white hover:scale-110 transition-all z-[120]"
           >
               <div className="bg-black/20 hover:bg-black/40 p-4 rounded-full backdrop-blur-md">
                 <ChevronRight className="w-10 h-10" />
               </div>
           </button>
        </div>
      )}
    </div>
  );
};

export default Stories;
