import { useQuery } from '@tanstack/react-query';
import type { ProviderData } from '@/types/provider';
import { providers as mockProviders } from '@/constants/mockData';

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      // TODO: Replace with real API call
      // const { data } = await apiFetch<ProviderData[]>('/providers');
      // return data;
      return mockProviders;
    },
    staleTime: 30 * 60 * 1000,
  });
}
