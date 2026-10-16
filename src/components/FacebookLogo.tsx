import React, { useState } from 'react';

interface FacebookLogoProps {
  customLogoUrl?: string;
  size?: number;
  className?: string;
}

export const FacebookLogo: React.FC<FacebookLogoProps> = ({
  customLogoUrl,
  size = 40,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  if (customLogoUrl && !imgError) {
    return (
      <img
        src={customLogoUrl}
        alt="Custom Logo"
        onError={() => setImgError(true)}
        style={{ width: size, height: size }}
        className={`object-contain rounded-full ${className}`}
      />
    );
  }

  // Official Facebook Blue Circular Logo SVG
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Facebook"
    >
      <circle cx="20" cy="20" r="20" fill="#0866FF" />
      <path
        d="M26.4 20.8H21.6V29H18V20.8H15V17.6H18V15.5C18 12.8 19.6 11.2 22.2 11.2C23.4 11.2 24.5 11.4 24.8 11.4V14.3H23C21.8 14.3 21.6 14.9 21.6 15.8V17.6H26.1L26.4 20.8Z"
        fill="white"
      />
    </svg>
  );
};
