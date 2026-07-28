import { ProviderData } from '@/components/ProviderCard';

export const providers: ProviderData[] = [
  {
    id: '1',
    name: 'Carlos Méndez',
    category: 'Master Plumber · 12 yrs exp',
    avatarUri: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.9,
    reviewCount: 127,
    distance: '1.2 mi away',
    eta: '~25 min',
    verified: true,
    price: '₱45/hr',
  },
  {
    id: '2',
    name: 'Sofía Ramírez',
    category: 'Certified Electrician · 8 yrs exp',
    avatarUri: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.8,
    reviewCount: 89,
    distance: '0.8 mi away',
    eta: '~15 min',
    verified: true,
    price: '₱55/hr',
  },
  {
    id: '3',
    name: 'Diego Torres',
    category: 'HVAC Specialist · 15 yrs exp',
    avatarUri: 'https://images.pexels.com/photos/8961087/pexels-photo-8961087.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5.0,
    reviewCount: 203,
    distance: '2.5 mi away',
    eta: '~40 min',
    verified: true,
    price: '₱65/hr',
  },
  {
    id: '4',
    name: 'María Castillo',
    category: 'General Contractor · 10 yrs exp',
    avatarUri: 'https://images.pexels.com/photos/8961091/pexels-photo-8961091.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.7,
    reviewCount: 156,
    distance: '1.5 mi away',
    eta: '~30 min',
    verified: true,
    price: '₱50/hr',
  },
  {
    id: '5',
    name: 'Juan Herrera',
    category: 'Plumber · 6 yrs exp',
    avatarUri: 'https://images.pexels.com/photos/8961070/pexels-photo-8961070.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.6,
    reviewCount: 72,
    distance: '3.1 mi away',
    eta: '~45 min',
    verified: false,
    price: '₱40/hr',
  },
];

export const serviceCategories = [
  { id: 'plumbing', label: 'Plumbing', icon: 'Wrench' as const, color: '#1B5E20' },
  { id: 'electrical', label: 'Electrical', icon: 'Zap' as const, color: '#F9A825' },
  { id: 'hvac', label: 'HVAC', icon: 'Wind' as const, color: '#1565C0' },
  { id: 'cleaning', label: 'Cleaning', icon: 'Sparkles' as const, color: '#7B1FA2' },
  { id: 'repair', label: 'Repair', icon: 'Hammer' as const, color: '#E65100' },
  { id: 'painting', label: 'Painting', icon: 'Paintbrush' as const, color: '#C2185B' },
  { id: 'carpentry', label: 'Carpentry', icon: 'TreePine' as const, color: '#33691E' },
  { id: 'more', label: 'More', icon: 'Grid2x2' as const, color: '#616161' },
];

export const reviews = [
  {
    id: '1',
    author: 'Laura M.',
    avatarUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '2 days ago',
    comment: 'Carlos was incredibly professional and fixed our leaking pipe in under an hour. He explained everything clearly and the price was fair. Highly recommend!',
    serviceType: 'Pipe Repair',
  },
  {
    id: '2',
    author: 'Roberto G.',
    avatarUri: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '1 week ago',
    comment: 'Arrived on time, was very courteous, and completed the job efficiently. Will definitely book again for future plumbing needs.',
    serviceType: 'Drain Cleaning',
  },
  {
    id: '3',
    author: 'Patricia V.',
    avatarUri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Good service overall. Took a bit longer than expected but the quality of work was excellent. Fair pricing.',
    serviceType: 'Faucet Installation',
  },
  {
    id: '4',
    author: 'Eduardo L.',
    avatarUri: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Best plumber I have hired through the app. Very knowledgeable and friendly. The booking process was seamless.',
    serviceType: 'Water Heater Repair',
  },
];

export const bookings = [
  {
    id: 'b1',
    providerId: '1',
    providerName: 'Carlos Méndez',
    category: 'Plumbing',
    avatarUri: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: 'Today, Jul 14',
    time: '2:00 PM',
    status: 'upcoming' as const,
    address: '123 Oak Street, Apt 4B',
    price: '₱45/hr',
    rating: 4.9,
  },
  {
    id: 'b2',
    providerId: '2',
    providerName: 'Sofía Ramírez',
    category: 'Electrical',
    avatarUri: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: 'Tomorrow, Jul 15',
    time: '10:00 AM',
    status: 'upcoming' as const,
    address: '123 Oak Street, Apt 4B',
    price: '₱55/hr',
    rating: 4.8,
  },
  {
    id: 'b3',
    providerId: '3',
    providerName: 'Diego Torres',
    category: 'HVAC',
    avatarUri: 'https://images.pexels.com/photos/8961087/pexels-photo-8961087.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: 'Jul 10, 2024',
    time: '3:30 PM',
    status: 'completed' as const,
    address: '123 Oak Street, Apt 4B',
    price: '₱130',
    rating: 5.0,
    reviewed: true,
  },
  {
    id: 'b4',
    providerId: '4',
    providerName: 'María Castillo',
    category: 'General Repair',
    avatarUri: 'https://images.pexels.com/photos/8961091/pexels-photo-8961091.jpeg?auto=compress&cs=tinysrgb&w=200',
    date: 'Jul 8, 2024',
    time: '11:00 AM',
    status: 'completed' as const,
    address: '123 Oak Street, Apt 4B',
    price: '₱100',
    rating: 4.7,
    reviewed: false,
  },
];

export const timeSlots = [
  { id: '1', label: '9:00 AM', available: true },
  { id: '2', label: '10:00 AM', available: true },
  { id: '3', label: '11:00 AM', available: false },
  { id: '4', label: '12:00 PM', available: true },
  { id: '5', label: '1:00 PM', available: true },
  { id: '6', label: '2:00 PM', available: false },
  { id: '7', label: '3:00 PM', available: true },
  { id: '8', label: '4:00 PM', available: true },
  { id: '9', label: '5:00 PM', available: true },
  { id: '10', label: '6:00 PM', available: false },
];

export const weekDays = [
  { id: '1', day: 'S', date: 13 },
  { id: '2', day: 'M', date: 14, today: true },
  { id: '3', day: 'T', date: 15 },
  { id: '4', day: 'W', date: 16 },
  { id: '5', day: 'T', date: 17 },
  { id: '6', day: 'F', date: 18 },
  { id: '7', day: 'S', date: 19 },
];

export const paymentMethods = [
  { id: 'visa', label: 'Visa ending in 4242', icon: 'credit-card' as const, last4: '4242', type: 'Visa' },
  { id: 'mastercard', label: 'Mastercard ending in 5555', icon: 'credit-card' as const, last4: '5555', type: 'Mastercard' },
  { id: 'applepay', label: 'Apple Pay', icon: 'wallet' as const, last4: '', type: 'Apple Pay' },
];

export const providerReviews = reviews;

export const homeCategories = [
  { id: '1', name: 'Plumbing', color: '#0ea5e9', bg: '#e0f2fe' },
  { id: '2', name: 'Electrical', color: '#f59e0b', bg: '#fef3c7' },
  { id: '3', name: 'Carpentry', color: '#10b981', bg: '#d1fae5' },
  { id: '4', name: 'Cleaning', color: '#06b6d4', bg: '#cffafe' },
  { id: '5', name: 'Appliance', color: '#6366f1', bg: '#e0e7ff' },
  { id: '6', name: 'AC Repair', color: '#3b82f6', bg: '#dbeafe' },
  { id: '7', name: 'Painting', color: '#8b5cf6', bg: '#ede9fe' },
  { id: '8', name: 'Gardening', color: '#22c55e', bg: '#dcfce7' },
];

export const homePromotions = [
  { id: '1', title: 'Up to 20% OFF', subtitle: 'On plumbing repairs', bg: '#fef08a', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop' },
  { id: '2', title: 'Free Inspection', subtitle: 'For electrical works', bg: '#bae6fd', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=600&auto=format&fit=crop' },
];

export const homeRecommendedWorkers = [
  { id: '1', name: 'Mario Rossi - Makati', skill: 'Plumber', rating: 4.8, distance: '1.2km', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', cover: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop', promo: '₱50.00 off' },
  { id: '2', name: 'Luigi Verdi - BGC', skill: 'Electrician', rating: 4.9, distance: '2.5km', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', cover: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop', promo: '15% off total bill' },
  { id: '3', name: 'Pedro Penduko - Pasay', skill: 'Master Plumber', rating: 4.7, distance: '3.1km', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', cover: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=400&auto=format&fit=crop', promo: '₱100.00 off' },
];
