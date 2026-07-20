'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    const data = new FormData(event.currentTarget);
    let response: Response;
    try {
      response = await fetch(factorId ? '/api/auth/mfa' : '/api/auth/sign-in', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
          factorId
            ? { factorId, code: data.get('code') }
            : { email: data.get('email'), password: data.get('password') },
        ),
      });
    } catch {
      setPending(false);
      setError('Network connection failed.');
      return;
    }
    const result = (await response.json()) as {
      error?: string;
      mfaRequired?: boolean;
      factorId?: string;
    };
    setPending(false);
    if (!response.ok) {
      setError(result.error ?? 'Sign-in failed.');
      return;
    }
    if (result.mfaRequired && result.factorId) {
      setFactorId(result.factorId);
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  }
  return (
    <form onSubmit={(event) => void submit(event)}>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
      {factorId ? (
        <div className="field">
          <label htmlFor="code">Authenticator code</label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
          />
        </div>
      ) : (
        <>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
        </>
      )}
      <button className="button" style={{ width: '100%', marginTop: 22 }} disabled={pending}>
        {pending ? 'Checking…' : factorId ? 'Verify TOTP' : 'Sign in'}
      </button>
    </form>
  );
}
