import { describe, expect, it } from 'vitest';
import { createWebSessionPersistence } from './auth-storage.web';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

describe('web auth storage', () => {
  it('uses local storage for persistent sessions', async () => {
    const local = memoryStorage();
    const controller = createWebSessionPersistence(local, memoryStorage());
    await controller.storage.setItem('auth', 'persistent');
    expect(local.getItem('auth')).toBe('persistent');
    expect(await controller.storage.getItem('auth')).toBe('persistent');
  });

  it('uses session storage and removes an older persistent session', async () => {
    const local = memoryStorage();
    const session = memoryStorage();
    local.setItem('auth', 'old');
    const controller = createWebSessionPersistence(local, session);
    await controller.setPersistence(false, 'auth');
    await controller.storage.setItem('auth', 'session');
    expect(local.getItem('auth')).toBeNull();
    expect(session.getItem('auth')).toBe('session');
  });

  it('removes the session from every storage scope', async () => {
    const local = memoryStorage();
    const session = memoryStorage();
    local.setItem('auth', 'persistent');
    session.setItem('auth', 'session');
    const controller = createWebSessionPersistence(local, session);
    await controller.storage.removeItem('auth');
    expect(local.getItem('auth')).toBeNull();
    expect(session.getItem('auth')).toBeNull();
  });

  it('falls back to memory when browser storage is unavailable', async () => {
    const controller = createWebSessionPersistence(undefined, undefined);
    await controller.storage.setItem('auth', 'memory');
    expect(await controller.storage.getItem('auth')).toBe('memory');
    await controller.storage.removeItem('auth');
    expect(await controller.storage.getItem('auth')).toBeNull();
  });
});
