import React, { useState } from 'react';
import { Clock, Home, Bookmark } from 'lucide-react';

interface DefaultHeroGraphicProps {
  customPageImageUrl?: string;
  className?: string;
}

export const DefaultHeroGraphic: React.FC<DefaultHeroGraphicProps> = ({
  customPageImageUrl,
  className = ''
}) => {
  const [customImgFailed, setCustomImgFailed] = useState(false);

  // If admin provided a custom page image URL and it loads fine
  if (customPageImageUrl && !customImgFailed) {
    return (
      <div className={`relative w-full max-w-[540px] flex items-center justify-center ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 max-h-[500px]">
          <img
            src={customPageImageUrl}
            alt="Page hero visual"
            onError={() => setCustomImgFailed(true)}
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>
      </div>
    );
  }

  // Exact Facebook montage recreation matching the screenshot
  return (
    <div className={`relative w-full max-w-[560px] h-[480px] select-none ${className}`}>
      {/* 3D Floating Laugh Reaction (top-left) */}
      <div className="absolute top-8 left-14 z-20 transition-transform duration-300 hover:scale-110 drop-shadow-lg">
        <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#FFDA44] to-[#FDB022] flex items-center justify-center shadow-md rotate-[-8deg] border-2 border-white/60">
          <span className="text-2xl leading-none" role="img" aria-label="laughing emoji">
            😆
          </span>
        </div>
      </div>

      {/* Card 1: Top-left Cooler/Outdoors story card */}
      <div className="absolute top-16 left-8 w-44 h-48 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white z-0 rotate-[-2deg] transition-transform duration-300 hover:rotate-0">
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
            alt="Outdoor cooler"
            className="w-full h-full object-cover filter brightness-95"
          />
          {/* Top pill icon */}
          <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur-xs text-white p-1.5 rounded-lg">
            <Home className="w-3.5 h-3.5 fill-white stroke-none" />
          </div>
        </div>
      </div>

      {/* Card 2: Center Main Story Card (Two friends hugging in colorful sweater) */}
      <div className="absolute top-6 left-32 w-64 h-84 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 z-10">
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
            alt="Friends smiling together"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Top story progress line */}
          <div className="absolute top-3 inset-x-3 h-1 bg-white/40 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-white rounded-full" />
          </div>

          {/* Top-right time pill */}
          <div className="absolute top-6 right-3 bg-[#4F46E5]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-xs">
            <Clock className="w-3 h-3" />
            <span>16:45</span>
          </div>

          {/* Bottom story indicators */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
            <div className="flex-1 h-1 bg-white/40 rounded-full mr-3" />
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white bg-white/30" />
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white bg-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Bottom-left DJ Performance card */}
      <div className="absolute bottom-6 left-16 w-44 h-52 rounded-2xl overflow-hidden shadow-xl border-3 border-white bg-white z-20 transition-transform duration-300 hover:scale-105">
        <div className="relative w-full h-34 overflow-hidden bg-purple-900">
          <img
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80"
            alt="DJ in vibrant lighting"
            className="w-full h-full object-cover"
          />
          {/* Bookmark icon pill */}
          <div className="absolute top-2 left-2 bg-blue-600/90 text-white p-1 rounded-md shadow-xs">
            <Bookmark className="w-3 h-3 fill-white stroke-none" />
          </div>
        </div>
        {/* Skeleton content lines below photo */}
        <div className="p-2.5 bg-gray-50 flex flex-col gap-1.5">
          <div className="w-16 h-2 bg-gray-200 rounded-full" />
          <div className="w-24 h-2 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Card 4: Circular Avatar of guy smiling in cap */}
      <div className="absolute bottom-2 left-44 w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden z-30 transition-transform duration-300 hover:scale-105">
        <div className="relative w-full h-full rounded-full border-2 border-[#0866FF] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="Smiling user profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3D Floating Heart Reaction (right side of center card) */}
      <div className="absolute top-44 right-10 z-20 transition-transform duration-300 hover:scale-110 drop-shadow-xl animate-pulse">
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#FF0055] via-[#FF1464] to-[#FF4585] flex items-center justify-center shadow-lg border-2 border-white">
          <svg width="22" height="20" viewBox="0 0 24 22" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
