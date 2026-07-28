const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://api-placeholder.example.com';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // TODO: Replace with real fetch when backend is available
  // const response = await fetch(`${API_BASE}${path}`, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...options?.headers,
  //   },
  //   ...options,
  // });
  // if (!response.ok) throw new Error(`API error: ${response.status}`);
  // return response.json();
  throw new Error(`API not connected: ${path}`);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
