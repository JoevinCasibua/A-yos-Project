import type { User } from '@/types';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterWorkerPayload {
  name: string;
  phone: string;
  email: string;
  category: string;
  skills: string[];
  yearsExperience: number;
}

export async function sendOtp(phone: string): Promise<{ success: boolean }> {
  // TODO: POST /auth/otp/send
  console.log('[auth] sendOtp placeholder for', phone);
  return { success: true };
}

export async function verifyOtp(
  phone: string,
  code: string,
): Promise<{ user: User; tokens: AuthTokens }> {
  // TODO: POST /auth/otp/verify
  return {
    user: {
      id: 'user-1',
      name: 'Demo User',
      phone,
      email: 'demo@example.com',
      role: 'customer',
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  };
}

export async function logout(): Promise<{ success: boolean }> {
  // TODO: POST /auth/logout
  console.log('[auth] logout placeholder');
  return { success: true };
}

export async function registerWorker(
  data: RegisterWorkerPayload,
): Promise<{ user: User; tokens: AuthTokens }> {
  // TODO: POST /auth/register-worker
  console.log('[auth] registerWorker placeholder', data);
  return {
    user: {
      id: 'worker-1',
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: 'worker',
    },
    tokens: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
  };
}
