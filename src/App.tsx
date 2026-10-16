/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db, fetchSiteSettings, subscribeToSiteSettings, DEFAULT_SETTINGS } from './firebase';
import { SiteSettings } from './types';
import { FacebookLogin } from './components/FacebookLogin';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/admin') || hash.includes('admin')) {
      return '/admin';
    }
    return '/';
  });

  // Test connection to Firestore on boot per skill mandate
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'settings', 'branding'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('Firebase client appears offline, using cached settings.');
        }
      }
    }
    testConnection();
  }, []);

  // Listen to path changes and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash.includes('admin')) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Initial load and real-time subscription for settings
  useEffect(() => {
    fetchSiteSettings().then((data) => {
      if (data) setSettings(data);
    });

    const unsubscribe = subscribeToSiteSettings((updated) => {
      setSettings(updated);
    });

    return () => unsubscribe();
  }, []);

  const navigateTo = (path: string) => {
    if (path === '/admin') {
      window.history.pushState({}, '', '/admin');
      setCurrentPath('/admin');
    } else {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
  };

  if (currentPath === '/admin') {
    return (
      <AdminPanel
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <FacebookLogin
      settings={settings}
      onNavigateToAdmin={() => navigateTo('/admin')}
    />
  );
}
