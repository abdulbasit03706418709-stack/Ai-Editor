import React, { useState } from 'react';
import { TimeTravelMode } from './components/TimeTravelMode';
import { StudioEditor } from './components/StudioEditor';

type Mode = 'TIME_TRAVEL' | 'STUDIO';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('TIME_TRAVEL');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-800 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setMode('TIME_TRAVEL')}>
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <SparklesIcon />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AiEdit</h1>
          </div>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('TIME_TRAVEL')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === 'TIME_TRAVEL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Time Travel
            </button>
            <button
              onClick={() => setMode('STUDIO')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === 'STUDIO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Studio Editor
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {mode === 'TIME_TRAVEL' ? <TimeTravelMode /> : <StudioEditor />}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
           © {new Date().getFullYear()} AiEdit. Powered by Google Gemini 2.5 Flash Image.
         </div>
      </footer>
    </div>
  );
};

export default App;
