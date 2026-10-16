import React from 'react';

export const MetaLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1.5 select-none ${className}`}>
      {/* Official Meta Ribbon Loop SVG */}
      <svg
        width="24"
        height="18"
        viewBox="0 0 48 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block"
        aria-hidden="true"
      >
        <path
          d="M47.2 18.2C47.2 12.3 43.5 7.6 37.8 7.6C34.3 7.6 31.4 9.4 29.3 12.4C26.5 8.4 22.8 6 18.6 6C10.2 6 4 13.6 4 22.6C4 28.5 7.7 33.2 13.4 33.2C16.9 33.2 19.8 31.4 21.9 28.4C24.7 32.4 28.4 34.8 32.6 34.8C41 34.8 47.2 27.2 47.2 18.2ZM32.6 30C29.4 30 26.6 28 24.3 23.9C27.5 18.4 31.1 12.4 37.2 12.4C40.6 12.4 42.4 15.3 42.4 18.7C42.4 24.4 38.3 30 32.6 30ZM18.6 10.8C21.8 10.8 24.6 12.8 26.9 16.9C23.7 22.4 20.1 28.4 14 28.4C10.6 28.4 8.8 25.5 8.8 22.1C8.8 16.4 12.9 10.8 18.6 10.8Z"
          fill="url(#meta-grad)"
        />
        <defs>
          <linearGradient id="meta-grad" x1="4" y1="6" x2="47" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0064e0" />
            <stop offset="0.5" stopColor="#0080fb" />
            <stop offset="1" stopColor="#0064e0" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-semibold text-[15px] tracking-tight text-gray-800">
        Meta
      </span>
    </div>
  );
};
