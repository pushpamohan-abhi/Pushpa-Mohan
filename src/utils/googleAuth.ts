import { initializeApp, getApps, getApp } from '@firebase/app';
import { getAuth, onAuthStateChanged, signOut, User } from '@firebase/auth';

// Read config directly
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const OAUTH_CLIENT_ID = (firebaseConfig as any).oAuthClientId || '451003026922-ittemi1jq8h7f5gtqgbfk47dvhoa8he4.apps.googleusercontent.com';
const REQUIRED_SCOPES = 'https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/drive.file';

let cachedAccessToken: string | null = null;
let gisTokenClient: any = null;
let activePromiseResolvers: { resolve: (token: string) => void; reject: (err: any) => void } | null = null;

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Pre-initializes the Google Identity Services (GIS) OAuth Token Client.
 * Pre-loading guarantees popup requests are issued directly on click without async script loading delays.
 */
export const initGoogleOAuth = (): void => {
  if (typeof window === 'undefined') return;

  const setupClient = () => {
    if (window.google?.accounts?.oauth2 && !gisTokenClient) {
      try {
        gisTokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: OAUTH_CLIENT_ID,
          scope: REQUIRED_SCOPES,
          callback: (response: any) => {
            if (response.error) {
              const msg = response.error_description || response.error;
              if (activePromiseResolvers) {
                activePromiseResolvers.reject(new Error(`OAuth Error: ${msg}`));
                activePromiseResolvers = null;
              }
            } else if (response.access_token) {
              cachedAccessToken = response.access_token;
              if (activePromiseResolvers) {
                activePromiseResolvers.resolve(response.access_token);
                activePromiseResolvers = null;
              }
            } else {
              if (activePromiseResolvers) {
                activePromiseResolvers.reject(new Error('No access token returned from Google sign-in.'));
                activePromiseResolvers = null;
              }
            }
          },
          error_callback: (err: any) => {
            const msg = err?.message || 'Google Auth popup was closed or blocked by browser.';
            if (activePromiseResolvers) {
              activePromiseResolvers.reject(new Error(msg));
              activePromiseResolvers = null;
            }
          },
        });
      } catch (e) {
        console.warn('GIS init error:', e);
      }
    }
  };

  if (!window.google?.accounts?.oauth2) {
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => setupClient();
      document.head.appendChild(script);
    }
  } else {
    setupClient();
  }
};

// Pre-initialize on module load
initGoogleOAuth();

/**
 * Direct Google Access Token request using Google Identity Services (GIS).
 * MUST be invoked directly in a synchronous user click event handler to avoid popup blockers.
 */
export const requestGoogleAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (cachedAccessToken) {
      return resolve(cachedAccessToken);
    }

    activePromiseResolvers = { resolve, reject };

    if (!gisTokenClient && window.google?.accounts?.oauth2) {
      initGoogleOAuth();
    }

    if (gisTokenClient) {
      try {
        // Trigger prompt directly in current call stack
        gisTokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err: any) {
        activePromiseResolvers = null;
        reject(err);
      }
    } else {
      // Fallback if client script was delayed
      initGoogleOAuth();
      setTimeout(() => {
        if (gisTokenClient) {
          try {
            gisTokenClient.requestAccessToken({ prompt: 'consent' });
          } catch (e: any) {
            activePromiseResolvers = null;
            reject(e);
          }
        } else {
          activePromiseResolvers = null;
          reject(new Error('Google Auth SDK is loading. Please click "Assign via Google Forms" again.'));
        }
      }, 100);
    }
  });
};

export const initAuthListener = (
  onSuccess?: (user: User | null, token: string) => void,
  onFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && cachedAccessToken) {
      if (onSuccess) onSuccess(user, cachedAccessToken);
    } else {
      if (onFailure) onFailure();
    }
  });
};

export const getCachedAccessToken = (): string | null => cachedAccessToken;

export const signOutGoogle = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Signout error:', e);
  }
  cachedAccessToken = null;
};


