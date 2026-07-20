'use client';
import Image from 'next/image';
import { useState } from 'react';

export function MfaSettings({ enabled }: { enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [enrollment, setEnrollment] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  }>();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(enabled ? 'TOTP is enabled.' : 'TOTP is not enabled.');
  async function enroll() {
    const response = await fetch('/api/auth/mfa/enroll', { method: 'POST' });
    const result = (await response.json()) as {
      error?: string;
      factorId?: string;
      qrCode?: string;
      secret?: string;
    };
    if (!response.ok || !result.factorId || !result.qrCode || !result.secret) {
      setMessage(result.error ?? 'Enrollment failed.');
      return;
    }
    setEnrollment({ factorId: result.factorId, qrCode: result.qrCode, secret: result.secret });
    setMessage('Scan the code and enter the current six-digit value.');
  }
  async function verify() {
    if (!enrollment) return;
    const response = await fetch('/api/auth/mfa/enroll/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ factorId: enrollment.factorId, code }),
    });
    const result = (await response.json()) as { error?: string };
    setMessage(response.ok ? 'TOTP is enabled.' : (result.error ?? 'Verification failed.'));
    if (response.ok) {
      setEnrollment(undefined);
      setIsEnabled(true);
    }
  }
  return (
    <section className="card">
      <span className="eyebrow">Administrator security</span>
      <h3>Authenticator-app MFA</h3>
      <p className="lede">{message}</p>
      {!isEnabled && !enrollment ? (
        <button className="button" type="button" onClick={() => void enroll()}>
          Enroll TOTP
        </button>
      ) : null}
      {enrollment ? (
        <div className="field">
          <Image
            src={enrollment.qrCode}
            alt="Authenticator enrollment QR code"
            width={200}
            height={200}
            unoptimized
          />
          <label htmlFor="totp">Authenticator code</label>
          <input
            id="totp"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            maxLength={6}
          />
          <button className="button" type="button" onClick={() => void verify()}>
            Verify and enable
          </button>
        </div>
      ) : null}
    </section>
  );
}
