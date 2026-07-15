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
  imageUrl?: string;
  commentCount: number;
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
    imageUrl: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 3,
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
    imageUrl: 'https://images.pexels.com/photos/5691608/pexels-photo-5691608.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 2,
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
    imageUrl: 'https://images.pexels.com/photos/5691621/pexels-photo-5691621.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 1,
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
    imageUrl: 'https://images.pexels.com/photos/5691634/pexels-photo-5691634.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 2,
  },
];

export interface JobComment {
  id: string;
  jobId: string;
  author: string;
  avatarUri: string;
  text: string;
  offerMin?: string;
  offerMax?: string;
  postedTime: string;
}

export const jobComments: JobComment[] = [
  {
    id: 'c1',
    jobId: '1',
    author: 'Juan Dela Cruz',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I can handle this repair. Licensed plumber with 8 years experience. Available right now.',
    offerMin: '$50',
    offerMax: '$70',
    postedTime: '2 min ago',
  },
  {
    id: 'c2',
    jobId: '1',
    author: 'Mark Santos',
    avatarUri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Burst pipes are my specialty. I can be there in 15 minutes.',
    offerMin: '$55',
    offerMax: '$65',
    postedTime: '1 hr ago',
  },
  {
    id: 'c3',
    jobId: '1',
    author: 'Carlos Reyes',
    avatarUri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I have done many emergency pipe repairs. Can start immediately.',
    offerMin: '$45',
    offerMax: '$60',
    postedTime: '3 hrs ago',
  },
  {
    id: 'c4',
    jobId: '2',
    author: 'Juan Dela Cruz',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I can install the water heater. I am certified for gas and electric units.',
    offerMin: '$400',
    offerMax: '$430',
    postedTime: '30 min ago',
  },
  {
    id: 'c5',
    jobId: '2',
    author: 'Robert Wilson',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Water heater installation is one of my core services. Same-day available.',
    offerMin: '$380',
    offerMax: '$420',
    postedTime: '45 min ago',
  },
  {
    id: 'c6',
    jobId: '3',
    author: 'Mark Santos',
    avatarUri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Faucet replacement is straightforward. I can do it today.',
    offerMin: '$70',
    offerMax: '$85',
    postedTime: '2 hrs ago',
  },
  {
    id: 'c7',
    jobId: '4',
    author: 'Carlos Reyes',
    avatarUri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Drain cleaning with professional equipment. Can clear it same day.',
    offerMin: '$60',
    offerMax: '$75',
    postedTime: '5 min ago',
  },
  {
    id: 'c8',
    jobId: '4',
    author: 'Juan Dela Cruz',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I specialize in drain cleaning. Available now.',
    offerMin: '$55',
    offerMax: '$70',
    postedTime: '8 min ago',
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
  hasParts?: boolean;
  partsDescription?: string;
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
    hasParts: true,
    partsDescription: 'PVC pipe and fittings',
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
    hasParts: false,
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

export const INDUSTRIES = [
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Carpentry', value: 'carpentry' },
  { label: 'HVAC', value: 'hvac' },
  { label: 'Painting', value: 'painting' },
  { label: 'Cleaning', value: 'cleaning' },
  { label: 'Landscaping', value: 'landscaping' },
  { label: 'Appliance Repair', value: 'appliance_repair' },
  { label: 'General Maintenance', value: 'general_maintenance' },
  { label: 'Construction', value: 'construction' },
];

export const SKILLS_BY_INDUSTRY: Record<string, { label: string; value: string }[]> = {
  plumbing: [
    { label: 'Pipe Repair', value: 'pipe_repair' },
    { label: 'Drain Cleaning', value: 'drain_cleaning' },
    { label: 'Water Heater Install', value: 'water_heater_install' },
    { label: 'Faucet Installation', value: 'faucet_installation' },
    { label: 'Leak Detection', value: 'leak_detection' },
    { label: 'Sewer Line Repair', value: 'sewer_line_repair' },
  ],
  electrical: [
    { label: 'Wiring Installation', value: 'wiring_installation' },
    { label: 'Circuit Breaker Repair', value: 'circuit_breaker_repair' },
    { label: 'Lighting Installation', value: 'lighting_installation' },
    { label: 'Outlet/Switch Install', value: 'outlet_switch_install' },
    { label: 'Generator Setup', value: 'generator_setup' },
  ],
  carpentry: [
    { label: 'Furniture Assembly', value: 'furniture_assembly' },
    { label: 'Cabinet Installation', value: 'cabinet_installation' },
    { label: 'Door/Window Repair', value: 'door_window_repair' },
    { label: 'Deck Building', value: 'deck_building' },
    { label: 'Custom Woodwork', value: 'custom_woodwork' },
  ],
  hvac: [
    { label: 'AC Installation', value: 'ac_installation' },
    { label: 'AC Repair', value: 'ac_repair' },
    { label: 'Duct Cleaning', value: 'duct_cleaning' },
    { label: 'Thermostat Install', value: 'thermostat_install' },
    { label: 'Ventilation Service', value: 'ventilation_service' },
  ],
  painting: [
    { label: 'Interior Painting', value: 'interior_painting' },
    { label: 'Exterior Painting', value: 'exterior_painting' },
    { label: 'Wallpaper Installation', value: 'wallpaper_installation' },
    { label: 'Surface Preparation', value: 'surface_preparation' },
    { label: 'Decorative Finishes', value: 'decorative_finishes' },
  ],
  cleaning: [
    { label: 'Deep Cleaning', value: 'deep_cleaning' },
    { label: 'Move-in/Move-out', value: 'move_in_out' },
    { label: 'Post-Construction', value: 'post_construction' },
    { label: 'Window Cleaning', value: 'window_cleaning' },
    { label: 'Pressure Washing', value: 'pressure_washing' },
  ],
  landscaping: [
    { label: 'Lawn Mowing', value: 'lawn_mowing' },
    { label: 'Garden Maintenance', value: 'garden_maintenance' },
    { label: 'Tree Trimming', value: 'tree_trimming' },
    { label: 'Irrigation Install', value: 'irrigation_install' },
    { label: 'Landscape Design', value: 'landscape_design' },
  ],
  appliance_repair: [
    { label: 'Refrigerator Repair', value: 'refrigerator_repair' },
    { label: 'Washing Machine Repair', value: 'washing_machine_repair' },
    { label: 'Aircon Servicing', value: 'aircon_servicing' },
    { label: 'Oven/Range Repair', value: 'oven_range_repair' },
    { label: 'TV/Monitor Repair', value: 'tv_monitor_repair' },
  ],
  general_maintenance: [
    { label: 'Home Inspection', value: 'home_inspection' },
    { label: 'Drywall Repair', value: 'drywall_repair' },
    { label: 'Tile Grouting', value: 'tile_grouting' },
    { label: 'Lock Replacement', value: 'lock_replacement' },
    { label: 'Gutter Cleaning', value: 'gutter_cleaning' },
  ],
  construction: [
    { label: 'Room Addition', value: 'room_addition' },
    { label: 'Flooring Installation', value: 'flooring_installation' },
    { label: 'Roofing Repair', value: 'roofing_repair' },
    { label: 'Concrete Work', value: 'concrete_work' },
    { label: 'Demolition', value: 'demolition' },
  ],
};
