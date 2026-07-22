import type { Href } from 'expo-router';

const BACK_ROUTES: Record<string, Href> = {
  dashboard: '/(worker)',
  profile: '/(worker)/profile',
  settings: '/(worker)/settings',
  'universal-search': '/(worker)/universal-search',
  bookings: '/(worker)/bookings',
  wallet: '/(worker)/wallet',
  transactions: '/(worker)/transactions-history',
};

export function getBackRoute(from?: string): Href | '' {
  if (!from) return '';
  if (from in BACK_ROUTES) return BACK_ROUTES[from];
  if (from.startsWith('booking-request/')) return from as Href;
  return '';
}
