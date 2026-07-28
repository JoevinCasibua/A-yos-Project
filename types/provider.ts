export interface ProviderData {
  id: string;
  name: string;
  category: string;
  avatarUri: string;
  rating: number;
  reviewCount: number;
  distance: string;
  eta: string;
  verified: boolean;
  price?: string;
  estimatedPrice?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatarUri?: string;
  serviceType?: string;
}
