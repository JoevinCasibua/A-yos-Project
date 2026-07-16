import { Alert } from 'react-native';

export type LockedFeature = 'open_bidding' | 'negotiation' | 'chat' | 'gcash_payment' | 'card_payment';

const labels: Record<LockedFeature, string> = {
  open_bidding: 'Open Bidding',
  negotiation: 'Negotiation',
  chat: 'Chat',
  gcash_payment: 'GCash payment',
  card_payment: 'Card payment',
};

export function showFeatureLocked(feature: LockedFeature) {
  Alert.alert(
    'Feature not available in the MVP',
    `${labels[feature]} is preserved as a preview, but it does not submit or store any data.`,
  );
  return { data: null, error: { code: 'FEATURE_LOCKED', message: `${labels[feature]} is not available in the MVP.` } } as const;
}

