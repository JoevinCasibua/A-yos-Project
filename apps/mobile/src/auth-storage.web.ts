import type { AuthStorageAdapter, SessionPersistenceController } from './auth-storage.types';

type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function safelyGet(storage: BrowserStorage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safelySet(storage: BrowserStorage | undefined, key: string, value: string): boolean {
  try {
    storage?.setItem(key, value);
    return storage !== undefined;
  } catch {
    return false;
  }
}

function safelyRemove(storage: BrowserStorage | undefined, key: string): void {
  try {
    storage?.removeItem(key);
  } catch {
    // The memory fallback is still cleared below.
  }
}

export function createWebSessionPersistence(
  local: BrowserStorage | undefined,
  session: BrowserStorage | undefined,
): SessionPersistenceController {
  const memory = new Map<string, string>();
  let persistSession = true;

  const storage: AuthStorageAdapter = {
    getItem(key) {
      const stored = safelyGet(persistSession ? local : session, key);
      return Promise.resolve(stored ?? memory.get(key) ?? null);
    },
    setItem(key, value) {
      memory.set(key, value);
      safelySet(persistSession ? local : session, key, value);
      return Promise.resolve();
    },
    removeItem(key) {
      memory.delete(key);
      safelyRemove(local, key);
      safelyRemove(session, key);
      return Promise.resolve();
    },
  };

  return {
    storage,
    setPersistence(enabled, authStorageKey) {
      persistSession = enabled;
      if (enabled) safelyRemove(session, authStorageKey);
      else safelyRemove(local, authStorageKey);
      memory.delete(authStorageKey);
      return Promise.resolve();
    },
  };
}

function browserStorage(name: 'localStorage' | 'sessionStorage'): BrowserStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window[name];
  } catch {
    return undefined;
  }
}

export const sessionPersistence = createWebSessionPersistence(
  browserStorage('localStorage'),
  browserStorage('sessionStorage'),
);
