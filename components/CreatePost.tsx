import React, { useState, useRef } from 'react';
import { Image, X, Wand2, Loader2, Send } from 'lucide-react';
import { User } from '../types';
import { generatePostCaption, enhanceText } from '../services/geminiService';

interface CreatePostProps {
  currentUser: User;
  onPostCreate: (content: string, imageFile: File | null) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onPostCreate }) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAiMagic = async () => {
    setIsGenerating(true);
    try {
      if (selectedImage && previewUrl) {
        // Convert blob URL to base64 for Gemini
        // Note: In a real app we'd read the File directly. 
        // For simplicity here, we assume we can fetch the blob or read the file.
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = async () => {
            const base64data = reader.result as string;
            const base64Content = base64data.split(',')[1];
            const caption = await generatePostCaption(base64Content, selectedImage.type, content);
            setContent(caption);
            setIsGenerating(false);
        };
      } else if (content.trim()) {
        const enhanced = await enhanceText(content);
        setContent(enhanced);
        setIsGenerating(false);
      } else {
        setIsGenerating(false);
        // Maybe show a toast: "Add text or image for AI magic!"
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !selectedImage) return;
    onPostCreate(content, selectedImage);
    setContent('');
    removeImage();
  };

  return (
    <div className="border-b border-zinc-800 p-4 pt-2 pb-2">
      <div className="flex gap-4">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is happening?!"
            className="w-full bg-transparent text-xl placeholder-zinc-500 focus:outline-none resize-none min-h-[48px] py-2"
            rows={content.split('\n').length > 1 ? Math.min(content.split('\n').length, 8) : 1}
          />
          
          {previewUrl && (
            <div className="relative mt-2 mb-2">
              <img src={previewUrl} alt="Preview" className="rounded-2xl max-h-[300px] object-cover border border-zinc-800" />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full hover:bg-black/90 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-2 border-t border-zinc-800/50 pt-3">
            <div className="flex gap-2 text-nexus-primary">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-nexus-primary/10 transition-colors"
                title="Add Image"
              >
                <Image className="w-5 h-5" />
              </button>
              
              <button 
                onClick={handleAiMagic}
                disabled={isGenerating || (!content && !selectedImage)}
                className={`flex items-center gap-2 p-2 px-3 rounded-full transition-all ${
                    isGenerating ? 'bg-nexus-accent/20 text-nexus-accent' : 'hover:bg-nexus-accent/10 text-nexus-accent'
                }`}
                title="AI Magic: Enhance text or generate caption"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                <span className="text-sm font-medium hidden sm:inline">AI Magic</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!content.trim() && !selectedImage}
              className="bg-white text-black px-5 py-1.5 rounded-full font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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