export interface AuthStorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface SessionPersistenceController {
  storage: AuthStorageAdapter;
  setPersistence: (enabled: boolean, authStorageKey: string) => Promise<void>;
}
