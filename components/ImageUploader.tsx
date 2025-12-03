import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageSelect: (file: File, base64: string) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageSelect, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageSelect(file, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Reset the input value so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">{label}</label>
      <div 
        onClick={handleClick}
        className={`
          relative w-full aspect-[4/5] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center group
          ${image ? 'border-indigo-500 bg-white' : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          type="file" 
          ref={inputRef}
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
          disabled={disabled}
        />
        
        {image ? (
          <div className="relative w-full h-full">
            <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Change Photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6 text-slate-400 group-hover:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-medium">Click to Upload</span>
            <span className="text-xs mt-1 opacity-70">JPEG or PNG</span>
          </div>
        )}
      </div>
    </div>
  );
};