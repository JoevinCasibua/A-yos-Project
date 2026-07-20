import * as SecureStore from 'expo-secure-store';
import type { SessionPersistenceController } from './auth-storage.types';

const volatile = new Map<string, string>();
let persistSession = true;

async function readSecurely(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function writeSecurely(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // The in-memory copy keeps the active session usable if device storage is unavailable.
  }
}

async function removeSecurely(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Removal from the in-memory store still signs out the active process.
  }
}

export const sessionPersistence: SessionPersistenceController = {
  storage: {
    async getItem(key) {
      return volatile.get(key) ?? (persistSession ? readSecurely(key) : null);
    },
    async setItem(key, value) {
      volatile.set(key, value);
      if (persistSession) await writeSecurely(key, value);
    },
    async removeItem(key) {
      volatile.delete(key);
      await removeSecurely(key);
    },
  },
  async setPersistence(enabled, authStorageKey) {
    persistSession = enabled;
    if (!enabled) await removeSecurely(authStorageKey);
  },
};
