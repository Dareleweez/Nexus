
import React, { useState, useRef } from 'react';
import { Image, X, Wand2, Loader2, Send, Sparkles, Video, Quote } from 'lucide-react';
import { User, Post } from '../types';
import { generatePostCaption, enhanceText } from '../services/geminiService';

interface CreatePostProps {
  currentUser: User;
  onPostCreate: (content: string, mediaFiles: File[], quotedPost?: Post) => void;
  quotingPost?: Post | null;
  onCancelQuote?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreate, quotingPost, onCancelQuote }) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Fix: Cast the result of Array.from to File[] to avoid 'unknown' type error in URL.createObjectURL on line 27
      const files = Array.from(e.target.files) as File[];
      const newFiles = [...selectedFiles, ...files].slice(0, 4); // Max 4 photos
      setSelectedFiles(newFiles);
      
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls].slice(0, 4));
    }
  };

  const removeMedia = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateCaption = async () => {
    if (selectedFiles.length === 0 || isGenerating) return;
    setIsGenerating(true);
    try {
        const imagesData = await Promise.all(selectedFiles.map(file => {
            return new Promise<{ base64: string; mimeType: string }>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    resolve({
                        base64: (reader.result as string).split(',')[1],
                        mimeType: file.type
                    });
                };
            });
        }));
        
        const caption = await generatePostCaption(imagesData, content);
        setContent(caption);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceText = async () => {
    if (!content.trim()) return;
    setIsGenerating(true);
    try {
        const enhanced = await enhanceText(content);
        setContent(enhanced);
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && selectedFiles.length === 0 && !quotingPost) return;
    onPostCreate(content, selectedFiles, quotingPost || undefined);
    setContent('');
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
  };

  return (
    <div className="border-b border-gray-200 p-4 pt-2 pb-2">
      <div className="flex gap-4">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={quotingPost ? "Add a comment to your quote..." : "What is happening?!"}
            className="w-full bg-transparent text-xl text-black placeholder-gray-500 focus:outline-none resize-none min-h-[48px] py-2"
            rows={content.split('\n').length > 1 ? Math.min(content.split('\n').length, 8) : 1}
          />
          
          {quotingPost && (
            <div className="mt-2 relative rounded-xl border border-gray-200 p-3 bg-gray-50/50 group">
                <div className="flex items-center gap-2 mb-1">
                    <img src={quotingPost.user.avatar} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-sm">{quotingPost.user.name}</span>
                    <span className="text-gray-500 text-sm">{quotingPost.user.handle}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{quotingPost.content}</p>
                {onCancelQuote && (
                    <button 
                        onClick={onCancelQuote}
                        className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>
          )}

          {previewUrls.length > 0 && (
            <div className="mt-3 mb-2 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative shrink-0 w-32 h-32 rounded-xl overflow-hidden border border-gray-200 bg-neutral-900 shadow-sm group">
                  <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button onClick={() => removeMedia(index)} className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all">
                      <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-3">
            <div className="flex gap-2 text-nexus-primary">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-nexus-primary/10 transition-colors flex items-center gap-1"
                title="Add Media (Max 4)"
                disabled={selectedFiles.length >= 4 || !!quotingPost}
              >
                <Image className="w-5 h-5" />
                <span className="text-xs font-bold">{selectedFiles.length > 0 ? `${selectedFiles.length}/4` : ''}</span>
              </button>

               <button 
                 onClick={handleGenerateCaption}
                 disabled={isGenerating || selectedFiles.length === 0}
                 className={`flex items-center gap-2 p-2 px-3 rounded-full transition-all ${
                     selectedFiles.length === 0 ? 'opacity-40 cursor-not-allowed text-gray-400' : 'hover:bg-nexus-primary/10 text-nexus-primary'
                 }`}
                 title="AI Caption"
               >
                 {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                 <span className="text-sm font-medium hidden sm:inline">AI Caption</span>
               </button>

               <button 
                 onClick={handleEnhanceText}
                 disabled={isGenerating || content.trim().length === 0}
                 className={`flex items-center gap-2 p-2 px-3 rounded-full transition-all ${
                     content.trim().length === 0 ? 'opacity-40 cursor-not-allowed text-gray-400' : 'hover:bg-nexus-accent/10 text-nexus-accent'
                 }`}
               >
                 {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                 <span className="text-sm font-medium hidden sm:inline">Enhance</span>
               </button>
              
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleMediaSelect} />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!content.trim() && selectedFiles.length === 0 && !quotingPost}
              className="bg-black text-white px-5 py-1.5 rounded-full font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Post
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
