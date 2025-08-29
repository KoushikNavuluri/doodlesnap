"use client";

import { useState, useEffect } from 'react';
import { SketchAnimation } from './SketchAnimation';

export default function DoodleLoadingAnimation() {
  const [currentText, setCurrentText] = useState(0);
  
  const loadingTexts = [
    "Doodlefying...",
    "Transforming your image",
    "Adding artistic touches",
    "Creating your doodle"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Sketch Doodle Animation */}
      <div className="relative">
        <SketchAnimation 
          className="w-24 h-24 text-slate-600 float-up"
        />
        
        {/* Subtle floating dots around the sketch */}
        <div className="absolute -top-1 -right-2 w-1 h-1 bg-slate-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
        <div className="absolute -bottom-1 -left-2 w-1 h-1 bg-slate-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 -right-3 w-0.5 h-0.5 bg-slate-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Animated text */}
      <div className="text-center space-y-3">
        <h3 className="text-lg font-medium text-slate-700 transition-all duration-500 ease-in-out">
          {loadingTexts[currentText]}
        </h3>
        
        {/* Progress dots */}
        <div className="flex space-x-1.5 justify-center">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"
              style={{ 
                animationDelay: `${dot * 0.3}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Subtle progress bar */}
      <div className="relative w-full h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent wave-flow"></div>
      </div>
    </div>
  );
}
