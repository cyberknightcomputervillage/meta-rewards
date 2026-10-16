import React from 'react';
import { Plus } from 'lucide-react';

export const Footer: React.FC = () => {
  const languages = [
    { label: 'English (UK)', active: true },
    { label: 'বাংলা', active: false },
    { label: 'অসমীয়া', active: false },
    { label: 'हिन्दी', active: false },
    { label: 'नेपाली', active: false },
    { label: 'Bahasa Indonesia', active: false },
    { label: 'العربية', active: false },
  ];

  const directoryLinks = [
    'Sign up',
    'Log in',
    'Messenger',
    'Facebook Lite',
    'Video',
    'Meta Pay',
    'Meta Store',
    'Meta Quest',
    'Ray-Ban Meta',
    'Meta AI',
    'Muse',
    'Instagram',
    'Threads',
    'Privacy Policy',
    'Privacy Centre',
    'About',
    'Create ad',
    'Create Page',
    'Developers',
    'Careers',
    'Cookies',
    'AdChoices',
    'Terms',
    'Help',
    'Contact uploading and non-users',
  ];

  return (
    <footer className="w-full bg-white text-[#737373] text-[12px] pt-6 pb-8 px-4 sm:px-8 border-t border-gray-100 sm:border-transparent">
      <div className="max-w-[980px] mx-auto">
        {/* Languages Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pb-2">
          {languages.map((lang) => (
            <button
              key={lang.label}
              type="button"
              className={`hover:underline cursor-pointer transition-colors ${
                lang.active ? 'text-[#737373] font-normal cursor-default' : 'text-[#8a8d91] hover:text-[#1877f2]'
              }`}
            >
              {lang.label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex items-center justify-center w-6 h-5 bg-[#f5f6f7] hover:bg-[#ebedf0] border border-[#ccd0d5] rounded-xs text-[#4b4f56] text-[11px] font-bold cursor-pointer transition-colors"
            title="Show more languages"
            aria-label="Show more languages"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Separator Line */}
        <div className="w-full border-t border-[#dddfe2] my-2" />

        {/* Directory Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 leading-relaxed text-[#8a8d91]">
          {directoryLinks.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:underline hover:text-[#1877f2] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Meta Copyright */}
        <div className="mt-5 text-[#737373] text-[11px]">
          Meta © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
