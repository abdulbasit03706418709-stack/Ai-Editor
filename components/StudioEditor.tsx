import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { generateEditedImage } from '../services/geminiService';
import { AppStatus, EditorTool, EditorToolCategory } from '../types';

// Icons
const EnhanceIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const MagicIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const StyleIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const CropIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TypeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

const TOOLS: EditorTool[] = [
  // Smart Fixes (Enhance)
  { id: 'one-tap', label: 'One-Tap Enhancer', category: 'ENHANCE', icon: <EnhanceIcon />, prompt: 'Enhance this image: adjust brightness, contrast, sharpness, and color balance for a professional look.' },
  { id: 'retouch', label: 'Face Retouch', category: 'ENHANCE', icon: <EnhanceIcon />, prompt: 'Retouch faces gently: smooth skin, reduce blemishes, improve lighting on faces, keeping it natural.' },
  { id: 'colorize', label: 'AI Colorizer', category: 'ENHANCE', icon: <EnhanceIcon />, prompt: 'Colorize this black and white photo with realistic, historically accurate colors.' },
  { id: 'restore', label: 'Restoration', category: 'ENHANCE', icon: <EnhanceIcon />, prompt: 'Restore this old photo: remove scratches, dust, reduce noise, and sharpen details.' },
  { id: 'blur', label: 'Portrait Blur', category: 'ENHANCE', icon: <EnhanceIcon />, prompt: 'Apply a DSLR-style depth-of-field effect, blurring the background while keeping the subject sharp.' },

  // Remix (Background & Sky)
  { id: 'bg-studio', label: 'Studio BG', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Replace the background with a professional, clean, soft-lit studio background.' },
  { id: 'bg-nature', label: 'Nature BG', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Replace the background with a beautiful, scenic nature background (forest, beach, or park).' },
  { id: 'bg-color', label: 'Solid Color', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Replace the background with a solid, vibrant pastel color that matches the subject.' },
  { id: 'sky-sunset', label: 'Sunset Sky', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Replace the sky with a dramatic, colorful sunset.' },
  { id: 'sky-blue', label: 'Blue Sky', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Replace the sky with a clear, bright blue sky with fluffy clouds.' },
  { id: 'magic-eraser', label: 'Magic Eraser', category: 'BACKGROUND', icon: <MagicIcon />, prompt: 'Remove the object described from the image and fill the space naturally.', requiresInput: true, inputLabel: 'What should be removed?' },

  // Styles
  { id: 'style-watercolor', label: 'Watercolor', category: 'STYLE', icon: <StyleIcon />, prompt: 'Convert this image into a beautiful watercolor painting.' },
  { id: 'style-sketch', label: 'Pencil Sketch', category: 'STYLE', icon: <StyleIcon />, prompt: 'Convert this image into a detailed pencil sketch.' },
  { id: 'style-cartoon', label: 'Cartoon 3D', category: 'STYLE', icon: <StyleIcon />, prompt: 'Transform this image into a 3D animated movie character style (Pixar style).' },
  { id: 'style-neon', label: 'Neon Cyber', category: 'STYLE', icon: <StyleIcon />, prompt: 'Apply a cyberpunk neon aesthetic with glowing lights and cool tones.' },
  { id: 'style-oil', label: 'Oil Painting', category: 'STYLE', icon: <StyleIcon />, prompt: 'Convert this image into a classic oil painting with visible brushstrokes.' },

  // Custom
  { id: 'look-builder', label: 'Look Builder', category: 'CUSTOM', icon: <TypeIcon />, prompt: 'Apply the following specific edit to the image:', requiresInput: true, inputLabel: 'Describe the edit (e.g., "Make it moody and cinematic")' },
  { id: 'crop-portrait', label: 'Smart Crop (Portrait)', category: 'CUSTOM', icon: <CropIcon />, prompt: 'Crop and recompose this image into a vertical portrait format (9:16), focusing on the main subject.' },
  { id: 'social-preset', label: 'Instagram Preset', category: 'CUSTOM', icon: <StyleIcon />, prompt: 'Apply a trendy "Instagram Influencer" aesthetic: warm tones, low contrast, slightly faded blacks.' },
];

export const StudioEditor: React.FC = () => {
  const [photo, setPhoto] = useState<{ base64: string, mime: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedCategory, setSelectedCategory] = useState<EditorToolCategory>('ENHANCE');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyTool = async (tool: EditorTool) => {
    if (!photo) return;
    if (tool.requiresInput && !customInput) {
       setActiveTool(tool.id); // Just expand input
       return;
    }

    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);
    // Note: We don't clear resultImage so user can compare, or we could clear it to show loading.
    // Let's clear it to show specific progress for this new action.
    setResultImage(null); 

    try {
      const generated = await generateEditedImage(
        photo.base64,
        photo.mime,
        tool.prompt,
        tool.requiresInput ? customInput : undefined
      );

      if (generated) {
        setResultImage(generated);
        setStatus(AppStatus.SUCCESS);
        setCustomInput(''); // Reset input
        setActiveTool(null);
      } else {
        throw new Error("No image returned.");
      }
    } catch (e: any) {
      console.error(e);
      setStatus(AppStatus.ERROR);
      setErrorMsg(e.message || "Failed to edit image.");
    }
  };

  const categories: {id: EditorToolCategory, label: string}[] = [
    { id: 'ENHANCE', label: 'Smart Fix' },
    { id: 'BACKGROUND', label: 'Remix' },
    { id: 'STYLE', label: 'Filters' },
    { id: 'CUSTOM', label: 'Pro Tools' },
  ];

  const filteredTools = TOOLS.filter(t => t.category === selectedCategory);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">AI Studio</h2>
        <p className="text-slate-500">Enhance, remix, and transform your photos with 15+ AI tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {!photo ? (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 bg-slate-50 text-center">
               <ImageUploader 
                 label="Upload Photo to Edit" 
                 image={null} 
                 onImageSelect={(file, base64) => setPhoto({ base64, mime: file.type || 'image/jpeg' })} 
               />
               <p className="mt-4 text-slate-400">Supports JPG, PNG</p>
            </div>
          ) : (
             <div className="flex flex-col space-y-4">
               {/* Main Display */}
               <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-2xl group">
                 {status === AppStatus.GENERATING && (
                   <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p>Applying Magic...</p>
                   </div>
                 )}
                 
                 <img 
                   src={resultImage || photo.base64} 
                   alt="Work in progress" 
                   className="w-full h-full object-contain"
                 />
                 
                 {/* Quick Toggle Original (Only if result exists) */}
                 {resultImage && status !== AppStatus.GENERATING && (
                    <div 
                      className="absolute top-4 left-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black/70 select-none"
                      onMouseDown={(e) => {
                         const img = e.currentTarget.parentElement?.querySelector('img');
                         if(img) img.src = photo.base64;
                      }}
                      onMouseUp={(e) => {
                        const img = e.currentTarget.parentElement?.querySelector('img');
                        if(img) img.src = resultImage;
                      }}
                      onTouchStart={(e) => {
                        const img = e.currentTarget.parentElement?.querySelector('img');
                        if(img) img.src = photo.base64;
                      }}
                      onTouchEnd={(e) => {
                        const img = e.currentTarget.parentElement?.querySelector('img');
                        if(img) img.src = resultImage;
                      }}
                    >
                      Hold to see Original
                    </div>
                 )}
               </div>

               {/* Actions */}
               <div className="flex justify-between items-center">
                  <button 
                    onClick={() => { setPhoto(null); setResultImage(null); }}
                    className="text-slate-500 hover:text-red-500 text-sm font-medium"
                  >
                    Remove Photo
                  </button>
                  {resultImage && (
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = 'edited-photo.png';
                        link.click();
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium"
                    >
                      Download Result
                    </button>
                  )}
               </div>

               {errorMsg && (
                 <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                   {errorMsg}
                 </div>
               )}
             </div>
          )}
        </div>

        {/* Right: Tools */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit sticky top-24">
           {/* Category Tabs */}
           <div className="flex space-x-1 mb-6 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
             {categories.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.id)}
                 className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                   selectedCategory === cat.id 
                     ? 'bg-indigo-50 text-indigo-600' 
                     : 'text-slate-500 hover:bg-slate-50'
                 }`}
               >
                 {cat.label}
               </button>
             ))}
           </div>

           {/* Tool Grid */}
           <div className="grid grid-cols-1 gap-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredTools.map(tool => (
                <div key={tool.id} className="w-full">
                  <button
                    disabled={!photo || status === AppStatus.GENERATING}
                    onClick={() => {
                      if (tool.requiresInput) {
                        setActiveTool(activeTool === tool.id ? null : tool.id);
                      } else {
                        handleApplyTool(tool);
                      }
                    }}
                    className={`
                      w-full flex items-center p-3 rounded-xl border transition-all text-left group
                      ${activeTool === tool.id ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                      ${(!photo || status === AppStatus.GENERATING) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${activeTool === tool.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50'}`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{tool.label}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{tool.prompt.split(':')[0]}</p>
                    </div>
                  </button>

                  {/* Inline Input for tools like Magic Eraser */}
                  {tool.requiresInput && activeTool === tool.id && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                       <label className="text-xs font-semibold text-slate-700 block mb-1">
                         {tool.inputLabel}
                       </label>
                       <div className="flex gap-2">
                         <input 
                           type="text" 
                           value={customInput}
                           onChange={(e) => setCustomInput(e.target.value)}
                           className="flex-1 text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                           placeholder="Type here..."
                         />
                         <button 
                           onClick={() => handleApplyTool(tool)}
                           className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                         >
                           Go
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
