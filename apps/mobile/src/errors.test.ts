import { registerSchema } from '@ayos/contracts';
import { describe, expect, it } from 'vitest';
import { errorMessage } from './errors';

describe('errorMessage', () => {
  it('renders schema issues as readable validation messages', () => {
    const result = registerSchema.safeParse({
      role: 'USER',
      name: 'Juan Dela Cruz',
      mobile: '09171234567',
      email: 'juan@example.com',
      password: 'lowercase123',
      confirmPassword: 'lowercase123',
      acceptedTerms: true,
    });

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(errorMessage(result.error, 'Registration failed.')).toBe(
      'Enter a mobile number with country code, for example +639171234567.\nPassword must include an uppercase letter.',
    );
  });

  it('preserves service errors and uses a fallback for unknown values', () => {
    expect(errorMessage(new Error('Account already exists.'), 'Registration failed.')).toBe(
      'Account already exists.',
    );
    expect(errorMessage(null, 'Registration failed.')).toBe('Registration failed.');
  });
});
