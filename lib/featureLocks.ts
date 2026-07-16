import { Alert, Platform } from 'react-native';

export type LockedFeature = 'open_bidding' | 'negotiation' | 'chat' | 'gcash_payment' | 'card_payment';

const labels: Record<LockedFeature, string> = {
  open_bidding: 'Open Bidding',
  negotiation: 'Negotiation',
  chat: 'Chat',
  gcash_payment: 'GCash payment',
  card_payment: 'Card payment',
};

export function showFeatureLocked(feature: LockedFeature) {
  const message=`${labels[feature]} is preserved as a preview, but it does not submit or store any data.`;
  if(Platform.OS==='web')globalThis.alert(`Feature not available in the MVP\n\n${message}`);
  else Alert.alert('Feature not available in the MVP',message);
  return { data: null, error: { code: 'FEATURE_LOCKED', message: `${labels[feature]} is not available in the MVP.` } } as const;
}
