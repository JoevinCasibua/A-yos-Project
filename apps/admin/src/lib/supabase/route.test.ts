import { NextRequest, NextResponse } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { createServerClient } = vi.hoisted(() => ({ createServerClient: vi.fn() }));

vi.mock('@supabase/ssr', () => ({ createServerClient }));

import { createSupabaseRouteClient } from './route';

describe('createSupabaseRouteClient', () => {
  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  it('reads request cookies and attaches pending session cookies to the response', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key';
    const client = { auth: {} };
    createServerClient.mockReturnValue(client);
    const request = new NextRequest('http://localhost/api/auth/sign-in', {
      headers: { cookie: 'existing-session=present' },
    });

    const result = createSupabaseRouteClient(request);
    const call = createServerClient.mock.calls[0];
    expect(call).toBeDefined();
    const options = call![2] as {
      cookies: {
        getAll(): { name: string; value: string }[];
        setAll(values: { name: string; value: string; options: { httpOnly?: boolean } }[]): void;
      };
    };

    expect(result.supabase).toBe(client);
    expect(options.cookies.getAll()).toContainEqual({
      name: 'existing-session',
      value: 'present',
    });

    options.cookies.setAll([
      {
        name: 'sb-project-auth-token',
        value: 'session-value',
        options: { httpOnly: true },
      },
    ]);
    const response = result.applyCookies(NextResponse.json({ authenticated: true }));

    expect(response.cookies.get('sb-project-auth-token')).toMatchObject({
      name: 'sb-project-auth-token',
      value: 'session-value',
      httpOnly: true,
    });
  });
});
