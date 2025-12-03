import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { generateMergedPhoto } from '../services/geminiService';
import { AppStatus } from '../types';

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 9.75v10.5m0 0l-3-3m3 3l3-3m-7.5-6L9 5.25 11.25 3 13.5 5.25 15.75 3" />
  </svg>
);

export const TimeTravelMode: React.FC = () => {
  const [childPhoto, setChildPhoto] = useState<{ base64: string, mime: string } | null>(null);
  const [adultPhoto, setAdultPhoto] = useState<{ base64: string, mime: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!childPhoto || !adultPhoto) return;

    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);
    setResultImage(null);

    try {
      const generatedImage = await generateMergedPhoto(
        childPhoto.base64,
        childPhoto.mime,
        adultPhoto.base64,
        adultPhoto.mime
      );

      if (generatedImage) {
        setResultImage(generatedImage);
        setStatus(AppStatus.SUCCESS);
      } else {
        throw new Error("No image was returned from the model.");
      }
    } catch (e: any) {
      console.error(e);
      setStatus(AppStatus.ERROR);
      setErrorMsg(e.message || "Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setChildPhoto(null);
    setAdultPhoto(null);
    setResultImage(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'aiedit-time-travel.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Time Travel <span className="text-indigo-600">Merge</span>
        </h2>
        <p className="text-lg text-slate-600">
          Upload a childhood photo and a recent photo. Our AI will merge them into a touching moment where you hold hands across time.
        </p>
      </div>

      {status === AppStatus.SUCCESS ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl border border-slate-100 mb-8">
            <div className="relative aspect-[1/1] sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 mb-6 group">
              <img 
                src={resultImage!} 
                alt="Generated Time Travel" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                  onClick={handleReset}
                  className="text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Create Another
                </button>
                <button 
                onClick={handleDownload}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  <DownloadIcon />
                  <span className="ml-2">Download Memory</span>
                </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-4xl mx-auto mb-12">
            <div className="space-y-4">
              <ImageUploader 
                label="1. Childhood Photo" 
                image={childPhoto?.base64 || null}
                onImageSelect={(file, base64) => setChildPhoto({ base64, mime: file.type || 'image/jpeg' })}
                disabled={status === AppStatus.GENERATING}
              />
              <p className="text-xs text-slate-500 text-center">
                The younger, the better. Full body or upper body works best.
              </p>
            </div>

            <div className="space-y-4">
              <ImageUploader 
                label="2. Adult Photo" 
                image={adultPhoto?.base64 || null}
                onImageSelect={(file, base64) => setAdultPhoto({ base64, mime: file.type || 'image/jpeg' })}
                disabled={status === AppStatus.GENERATING}
              />
                <p className="text-xs text-slate-500 text-center">
                A recent photo of yourself. Good lighting helps the AI.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 max-w-md text-center text-sm">
                {errorMsg}
              </div>
            )}

            {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
              <button
                onClick={handleGenerate}
                disabled={!childPhoto || !adultPhoto}
                className={`
                  group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 
                  bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                `}
              >
                <span>Generate Time-Travel Photo</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ) : null}

            {status === AppStatus.GENERATING && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium animate-pulse">Designing your memory...</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
