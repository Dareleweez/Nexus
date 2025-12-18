
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
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setProgress(0);
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
    <div className={`${connected ? 'bg-transparent' : 'bg-white border-b border-gray-200'} pt-6 pb-8 overflow-x-auto no-scrollbar`}>
      <div className="flex gap-8 px-6 min-w-max items-start">
        {/* Add Story Button - EXTRA BIG SIZE */}
        <div className="flex flex-col items-center gap-4 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
          <div className="relative w-32 h-32 sm:w-44 sm:h-44">
            <div className="w-full h-full rounded-full p-[8px] border-[4px] border-gray-300 border-dashed group-hover:border-nexus-primary transition-all duration-300 transform group-hover:scale-105">
                 <img 
                    src={currentUser.avatar} 
                    alt="Add Story" 
                    className="w-full h-full rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity shadow-inner" 
                 />
            </div>
            <div className="absolute bottom-2 right-2 bg-nexus-primary text-white rounded-full p-3.5 border-[6px] border-white shadow-2xl group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <span className="text-sm font-black text-gray-500 group-hover:text-nexus-primary transition-colors uppercase tracking-wider">Your Story</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Stories List - EXTRA BIG SIZE */}
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-4 cursor-pointer group"
            onClick={() => openViewer(index)}
          >
            <div className={`w-32 h-32 sm:w-44 sm:h-44 rounded-full p-[8px] bg-gradient-to-tr ${story.isViewed ? 'from-gray-300 to-gray-200 shadow-sm' : 'from-nexus-primary via-nexus-accent to-pink-500 shadow-2xl shadow-nexus-primary/40'} group-hover:scale-105 transition-all duration-500`}>
              <div className="w-full h-full rounded-full bg-white p-[5px]">
                <img 
                    src={story.user.avatar} 
                    alt={story.user.name} 
                    className="w-full h-full rounded-full object-cover shadow-inner" 
                />
              </div>
            </div>
            <span className="text-sm font-black text-gray-900 max-w-[120px] truncate text-center tracking-tight">{story.user.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {viewerOpen && stories[currentStoryIndex] && (
        <div className="fixed inset-0 z-[70] bg-black flex items-center justify-center animate-in fade-in duration-200">
           <div 
             className="absolute inset-0 opacity-50 bg-cover bg-center blur-[100px]"
             style={{ backgroundImage: `url(${stories[currentStoryIndex].imageUrl})` }}
           ></div>

           <div className="relative w-full h-full md:w-[520px] md:h-[94vh] md:rounded-[50px] bg-black overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10">
              <div className="absolute top-0 left-0 w-full z-20 flex gap-2.5 p-5">
                 {stories.map((_, idx) => (
                    <div key={idx} className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
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

              <div className="absolute top-10 left-0 w-full z-20 px-6 pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <img 
                        src={stories[currentStoryIndex].user.avatar} 
                        alt={stories[currentStoryIndex].user.name}
                        className="w-14 h-14 rounded-full border-2 border-white/50 shadow-2xl" 
                      />
                      <div>
                          <div className="text-white text-lg font-black shadow-black drop-shadow-xl tracking-tight">
                              {stories[currentStoryIndex].user.name}
                          </div>
                          <div className="text-white/80 text-sm font-medium shadow-black drop-shadow-lg">
                              {stories[currentStoryIndex].timestamp}
                          </div>
                      </div>
                  </div>
                  <button 
                    onClick={closeViewer}
                    className="text-white/80 hover:text-white p-3 rounded-full hover:bg-white/20 transition-all backdrop-blur-2xl border border-white/20 shadow-xl"
                  >
                      <X className="w-8 h-8" />
                  </button>
              </div>

              <div className="flex-1 relative bg-black flex items-center justify-center">
                  <img 
                    src={stories[currentStoryIndex].imageUrl} 
                    alt="Story" 
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute inset-0 flex">
                      <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev}></div>
                      <div className="w-2/3 h-full cursor-pointer" onClick={handleNext}></div>
                  </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                  <div className="flex gap-4 items-center">
                      <input 
                        type="text" 
                        placeholder="Reply to story..." 
                        className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/20 backdrop-blur-3xl transition-all text-lg shadow-2xl"
                      />
                      <button className="text-white p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-3xl border border-white/20 shadow-2xl">
                         <ImageIcon className="w-7 h-7" />
                      </button>
                  </div>
              </div>
           </div>

           <button 
                onClick={handlePrev}
                className={`hidden md:flex absolute left-12 lg:left-40 text-white/40 hover:text-white p-6 rounded-full hover:bg-white/10 transition-all z-50 ${currentStoryIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                disabled={currentStoryIndex === 0}
           >
               <ChevronLeft className="w-20 h-20" />
           </button>
           <button 
                onClick={handleNext}
                className="hidden md:flex absolute right-12 lg:right-40 text-white/40 hover:text-white p-6 rounded-full hover:bg-white/10 transition-all z-50"
           >
               <ChevronRight className="w-20 h-20" />
           </button>
        </div>
      )}
    </div>
  );
};

export default Stories;
