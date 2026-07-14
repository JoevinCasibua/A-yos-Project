import { Colors } from '@/constants/theme';
import {
  Briefcase,
  Wrench,
  MapPin,
  Image as ImageIcon,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  Heart,
  Award,
  Shield,
} from 'lucide-react-native';

export interface ReviewData {
  id: string;
  author: string;
  avatarUri: string;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
}

export const workerReviews: ReviewData[] = [
  {
    id: '1',
    author: 'Alex Johnson',
    avatarUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '2 days ago',
    comment: 'Carlos was incredibly professional and fixed our leaking pipe in under an hour. He explained everything clearly and the price was fair. Highly recommend!',
    serviceType: 'Pipe Repair',
  },
  {
    id: '2',
    author: 'Sarah Williams',
    avatarUri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '1 week ago',
    comment: 'Arrived on time, was very courteous, and completed the job efficiently. Will definitely book again for future plumbing needs.',
    serviceType: 'Drain Cleaning',
  },
  {
    id: '3',
    author: 'Michael Brown',
    avatarUri: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    date: '2 weeks ago',
    comment: 'Good service overall. Took a bit longer than expected but the quality of work was excellent. Fair pricing.',
    serviceType: 'Faucet Installation',
  },
  {
    id: '4',
    author: 'Emily Davis',
    avatarUri: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Best plumber I have hired through the app. Very knowledgeable and friendly. The booking process was seamless.',
    serviceType: 'Water Heater Repair',
  },
];

export interface JobOpportunity {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  category: string;
  description: string;
  location: string;
  distance: string;
  offeredPrice: string;
  urgency: 'normal' | 'urgent';
  postedTime: string;
}

export const workerJobs: JobOpportunity[] = [
  {
    id: '1',
    customerName: 'Alex Johnson',
    customerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    category: 'Plumbing',
    description: 'Burst pipe in kitchen causing flooding. Need immediate assistance.',
    location: '123 Oak Street',
    distance: '0.8 mi',
    offeredPrice: '$60',
    urgency: 'urgent',
    postedTime: '5 min ago',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Water Heater Installation',
    category: 'Plumbing',
    description: 'Need a new 40-gallon water heater installed. Old one removed.',
    location: '456 Pine Avenue',
    distance: '1.2 mi',
    offeredPrice: '$450',
    urgency: 'normal',
    postedTime: '1 hour ago',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Replacement',
    category: 'Plumbing',
    description: 'Replace kitchen faucet with new model. Already have the faucet.',
    location: '789 Elm Drive',
    distance: '2.1 mi',
    offeredPrice: '$85',
    urgency: 'normal',
    postedTime: '3 hours ago',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    category: 'Plumbing',
    description: 'Clogged bathroom drain. Water backing up.',
    location: '321 Maple Court',
    distance: '1.5 mi',
    offeredPrice: '$75',
    urgency: 'urgent',
    postedTime: '10 min ago',
  },
];

export interface WorkerBooking {
  id: string;
  customerName: string;
  customerAvatar: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  price: string;
}

export const workerBookings: WorkerBooking[] = [
  {
    id: '1',
    customerName: 'Alex Johnson',
    customerAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Pipe Repair',
    date: 'Today, Jul 14',
    time: '2:00 PM',
    address: '123 Oak Street',
    status: 'upcoming',
    price: '$60',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    date: 'Today, Jul 14',
    time: '4:30 PM',
    address: '456 Pine Avenue',
    status: 'in_progress',
    price: '$75',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Water Heater Install',
    date: 'Tomorrow, Jul 15',
    time: '9:00 AM',
    address: '789 Elm Drive',
    status: 'upcoming',
    price: '$450',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Replacement',
    date: 'Jul 12, 2024',
    time: '11:00 AM',
    address: '321 Maple Court',
    status: 'completed',
    price: '$85',
  },
  {
    id: '5',
    customerName: 'Robert Wilson',
    customerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    date: 'Jul 10, 2024',
    time: '3:00 PM',
    address: '654 Cedar Lane',
    status: 'completed',
    price: '$60',
  },
];

export const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'error' }> = {
  upcoming: { label: 'Upcoming', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'error' },
};

export const verificationConfig: Record<string, { label: string; variant: 'verified' | 'warning' | 'error' }> = {
  verified: { label: 'Verified', variant: 'verified' },
  pending: { label: 'Pending Review', variant: 'warning' },
  rejected: { label: 'Rejected', variant: 'error' },
};

export const workerMenuItems = [
  { id: 'experience', icon: Briefcase, label: 'Work Experience', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'skills', icon: Wrench, label: 'My Skills', color: Colors.info, bg: Colors.infoBg },
  { id: 'areas', icon: MapPin, label: 'Service Areas', color: Colors.warning, bg: Colors.warningBg },
  { id: 'portfolio', icon: ImageIcon, label: 'Portfolio', color: Colors.error, bg: Colors.errorBg },
  { id: 'payouts', icon: CreditCard, label: 'Payout Methods', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'notifications', icon: Bell, label: 'Notifications', color: Colors.warning, bg: Colors.warningBg },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', color: Colors.textSecondary, bg: Colors.surfaceLight },
  { id: 'settings', icon: Settings, label: 'Settings', color: Colors.textSecondary, bg: Colors.surfaceLight },
];

export const userMenuItems = [
  { id: 'payment', icon: CreditCard, label: 'Payment Methods', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'notifications', icon: Bell, label: 'Notifications', color: Colors.warning, bg: Colors.warningBg },
  { id: 'addresses', icon: MapPin, label: 'Saved Addresses', color: Colors.info, bg: Colors.infoBg },
  { id: 'favorites', icon: Heart, label: 'Favorites', color: Colors.error, bg: Colors.errorBg },
  { id: 'rewards', icon: Award, label: 'Rewards & Points', color: Colors.cta, bg: Colors.primarySurface },
  { id: 'privacy', icon: Shield, label: 'Privacy & Security', color: Colors.info, bg: Colors.infoBg },
  { id: 'help', icon: HelpCircle, label: 'Help & Support', color: Colors.textSecondary, bg: Colors.surfaceLight },
  { id: 'settings', icon: Settings, label: 'Settings', color: Colors.textSecondary, bg: Colors.surfaceLight },
];
