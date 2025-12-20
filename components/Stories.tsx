
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, ChevronLeft, ChevronRight, Heart, Send, Sparkles } from 'lucide-react';
import { User, Story } from '../types';
import { MOCK_STORIES } from '../constants';

interface StoriesProps {
  currentUser: User;
  connected?: boolean; 
}

const Stories: React.FC<StoriesProps> = ({ currentUser, connected = false }) => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayedStories = stories;

  const handleNext = useCallback(() => {
    if (currentStoryIndex < displayedStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      closeViewer();
    }
  }, [currentStoryIndex, displayedStories.length]);

  const handlePrev = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentStoryIndex]);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
    setProgress(0);
    setIsPaused(false);
    document.body.style.overflow = 'auto';
    if (progressInterval.current) clearInterval(progressInterval.current);
  }, []);

  // Auto-advance logic
  useEffect(() => {
    if (viewerOpen && !isPaused) {
      const duration = 5000; 
      const intervalTime = 30; 
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
    } else if (isPaused && progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, [viewerOpen, currentStoryIndex, isPaused, handleNext]);

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
    document.body.style.overflow = 'hidden';
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);

  // Esc key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
    };
    if (viewerOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerOpen, closeViewer]);

  const renderViewer = () => {
    const story = displayedStories[currentStoryIndex];
    if (!viewerOpen || !story) return null;

    return createPortal(
      <div 
        className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center transition-opacity duration-300"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
         {/* Cinematic Background Blur */}
         <div 
           className="absolute inset-0 opacity-60 scale-125 bg-cover bg-center blur-[80px] pointer-events-none"
           style={{ backgroundImage: `url(${story.imageUrl})` }}
         ></div>

         {/* Progress Bars Container */}
         <div className="absolute top-0 inset-x-0 z-[10010] px-3 pt-4 flex gap-1.5">
              {displayedStories.map((_, idx) => (
                  <div key={idx} className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                          className={`h-full bg-white transition-all ease-linear ${
                              idx < currentStoryIndex ? 'w-full' : 
                              idx === currentStoryIndex ? '' : 'w-0'
                          }`}
                          style={{ 
                              width: idx === currentStoryIndex ? `${progress}%` : undefined,
                              transitionDuration: isPaused ? '0ms' : '30ms'
                          }}
                      ></div>
                  </div>
              ))}
         </div>

         {/* Top Info Bar */}
         <div className="absolute top-8 inset-x-0 z-[10010] px-4 flex items-center justify-between max-w-lg mx-auto w-full">
              <div className="flex items-center gap-3">
                  <img 
                      src={story.user.avatar} 
                      className="w-9 h-9 rounded-full border border-white/40 shadow-xl object-cover" 
                      alt=""
                  />
                  <div className="flex flex-col">
                      <span className="text-white text-sm font-bold shadow-black drop-shadow-md flex items-center gap-1.5">
                          {story.user.name}
                          {story.isSponsored && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-tighter">Ad</span>}
                      </span>
                      <span className="text-white/70 text-[11px] font-medium">
                          {story.timestamp}
                      </span>
                  </div>
              </div>
              <button 
                  onClick={(e) => { e.stopPropagation(); closeViewer(); }}
                  className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md transition-all"
              >
                  <X className="w-6 h-6" />
              </button>
         </div>

         {/* Main Content Area */}
         <div className="relative w-full h-full flex items-center justify-center">
              {/* Navigation Tap Zones */}
              <div className="absolute inset-0 flex z-[10005]">
                  <div 
                      className="w-1/3 h-full cursor-pointer group" 
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  >
                      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ChevronLeft className="text-white/50 w-8 h-8" />
                      </div>
                  </div>
                  <div 
                      className="w-2/3 h-full cursor-pointer group" 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  >
                      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ChevronRight className="text-white/50 w-8 h-8" />
                      </div>
                  </div>
              </div>

              {/* Story Media */}
              <div className="relative z-[10006] flex items-center justify-center w-full h-full p-2">
                <img 
                    src={story.imageUrl} 
                    alt="Story Content" 
                    className="max-h-[85vh] max-w-full md:max-w-[450px] object-contain rounded-xl shadow-2xl transition-transform duration-500 scale-100 border border-white/10"
                />
              </div>
         </div>

         {/* Bottom Action Bar */}
         <div className="absolute bottom-0 inset-x-0 z-[10010] p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="max-w-md mx-auto flex items-center gap-4">
                  {story.isSponsored ? (
                      <button className="w-full bg-white text-black font-black py-4 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
                          Learn More
                          <ChevronRight className="w-5 h-5" />
                      </button>
                  ) : (
                    <>
                        <div className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3.5 backdrop-blur-2xl transition-all hover:bg-white/15">
                            <input 
                                type="text" 
                                placeholder={`Reply to ${story.user.name.split(' ')[0]}...`} 
                                className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm font-medium"
                                onClick={(e) => { e.stopPropagation(); setIsPaused(true); }}
                                onBlur={() => setIsPaused(false)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="text-white hover:text-pink-400 transition-colors p-1">
                                <Heart className="w-7 h-7" />
                            </button>
                            <button className="text-white hover:text-nexus-primary transition-colors p-1">
                                <Send className="w-7 h-7" />
                            </button>
                        </div>
                    </>
                  )}
              </div>
         </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={`${connected ? 'bg-transparent' : 'bg-white dark:bg-nexus-900 border-b border-gray-100 dark:border-gray-800'} pt-2 pb-4 overflow-x-auto no-scrollbar`}>
      <div className="flex gap-4 px-4 min-w-max items-center">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
          <div className="relative">
            <div className="w-[72px] h-[72px] rounded-full p-[3px] border-2 border-dashed border-gray-300 dark:border-gray-700 group-hover:border-nexus-primary transition-all duration-300">
                 <img 
                    src={currentUser.avatar} 
                    alt="Add Story" 
                    className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80" 
                 />
            </div>
            <div className="absolute bottom-0 right-0 bg-nexus-primary text-white rounded-full p-1.5 border-2 border-white dark:border-nexus-900 shadow-md">
              <Plus className="w-3 h-3" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Your Story</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Stories List */}
        {displayedStories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
            onClick={() => openViewer(index)}
          >
            <div 
              className={`w-[72px] h-[72px] rounded-full p-[3px] transition-all duration-300 transform group-hover:scale-105 ${
                story.isSponsored
                  ? 'bg-nexus-primary shadow-lg shadow-nexus-primary/20'
                  : story.isViewed 
                    ? 'bg-gray-200 dark:bg-gray-800' 
                    : 'bg-gradient-to-tr from-nexus-primary via-nexus-accent to-pink-500'
              }`}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-nexus-900 p-[2px]">
                <img 
                    src={story.user.avatar} 
                    alt={story.user.name} 
                    className="w-full h-full rounded-full object-cover border border-gray-100 dark:border-gray-800" 
                />
              </div>
              {story.isSponsored && (
                  <div className="absolute -top-1 -right-1 bg-nexus-primary text-white p-1 rounded-full border border-white dark:border-nexus-900 shadow-sm animate-pulse">
                    <Sparkles className="w-3 h-3" />
                  </div>
              )}
            </div>
            <span className={`text-[11px] font-semibold max-w-[72px] truncate ${story.isSponsored ? 'text-nexus-primary font-black' : 'text-gray-900 dark:text-gray-200'}`}>
              {story.isSponsored ? 'Ad' : story.user.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {renderViewer()}
    </div>
  );
};

export default Stories;
