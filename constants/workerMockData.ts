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
    offeredPrice: '₱600',
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
    offeredPrice: '₱4,500',
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
    offeredPrice: '₱850',
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
    offeredPrice: '₱750',
    urgency: 'urgent',
    postedTime: '10 min ago',
    imageUrl: 'https://images.pexels.com/photos/5691634/pexels-photo-5691634.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 2,
  },
  {
    id: '5',
    customerName: 'Robert Wilson',
    customerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    category: 'Plumbing',
    description: 'Burst pipe in utility room causing water damage. Need immediate repair.',
    location: '654 Cedar Lane',
    distance: '2.8 mi',
    offeredPrice: '₱600',
    urgency: 'urgent',
    postedTime: '1 day ago',
    imageUrl: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 1,
  },
  {
    id: '6',
    customerName: 'Maria Santos',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Pipe Repair',
    category: 'Plumbing',
    description: 'Leaking pipe under kitchen sink. Dripping constantly.',
    location: '456 Oak Avenue',
    distance: '1.0 mi',
    offeredPrice: '₱800',
    urgency: 'normal',
    postedTime: '30 min ago',
    imageUrl: 'https://images.pexels.com/photos/5691621/pexels-photo-5691621.jpeg?auto=compress&cs=tinysrgb&w=800',
    commentCount: 0,
  },
  {
    id: 'cancelled-1',
    customerName: 'Linda Garcia',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    category: 'Plumbing',
    description: 'Kitchen drain clogged, water pooling in sink.',
    location: '789 Pine Road',
    distance: '3.2 mi',
    offeredPrice: '₱800',
    urgency: 'normal',
    postedTime: '2 days ago',
    commentCount: 0,
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
    offerMin: '₱500',
    offerMax: '₱700',
    postedTime: '2 min ago',
  },
  {
    id: 'c2',
    jobId: '1',
    author: 'Mark Santos',
    avatarUri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Burst pipes are my specialty. I can be there in 15 minutes.',
    offerMin: '₱550',
    offerMax: '₱650',
    postedTime: '1 hr ago',
  },
  {
    id: 'c3',
    jobId: '1',
    author: 'Carlos Reyes',
    avatarUri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I have done many emergency pipe repairs. Can start immediately.',
    offerMin: '₱450',
    offerMax: '₱600',
    postedTime: '3 hrs ago',
  },
  {
    id: 'c4',
    jobId: '2',
    author: 'Juan Dela Cruz',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I can install the water heater. I am certified for gas and electric units.',
    offerMin: '₱4,000',
    offerMax: '₱4,300',
    postedTime: '30 min ago',
  },
  {
    id: 'c5',
    jobId: '2',
    author: 'Robert Wilson',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Water heater installation is one of my core services. Same-day available.',
    offerMin: '₱3,800',
    offerMax: '₱4,200',
    postedTime: '45 min ago',
  },
  {
    id: 'c6',
    jobId: '3',
    author: 'Mark Santos',
    avatarUri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Faucet replacement is straightforward. I can do it today.',
    offerMin: '₱700',
    offerMax: '₱850',
    postedTime: '2 hrs ago',
  },
  {
    id: 'c7',
    jobId: '4',
    author: 'Carlos Reyes',
    avatarUri: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Drain cleaning with professional equipment. Can clear it same day.',
    offerMin: '₱600',
    offerMax: '₱750',
    postedTime: '5 min ago',
  },
  {
    id: 'c8',
    jobId: '4',
    author: 'Juan Dela Cruz',
    avatarUri: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'I specialize in drain cleaning. Available now.',
    offerMin: '₱550',
    offerMax: '₱700',
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
  lat: number;
  lng: number;
  status: 'hired' | 'accepted' | 'en_route' | 'arrived' | 'in_progress' | 'pending_review' | 'completed' | 'cancelled';
  price: string;
  hourlyRate: number;
  hasParts?: boolean;
  partsDescription?: string;
  duration?: string;
  cancelledReason?: string;
  cancelledBy?: 'customer' | 'worker';
  serviceType?: string;
  voiceTranscript?: string;
  urgency?: string;
  possibleCause?: string;
  safetyAdvice?: string;
  paymentMethod?: 'cash' | 'online';
  pricingType?: 'hourly' | 'fixed';
  isReported?: boolean;
  reportedReason?: string;
  notes?: string;
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
    lat: 14.5995,
    lng: 120.9842,
    status: 'hired',
    price: '₱600',
    hourlyRate: 45,
    hasParts: true,
    partsDescription: 'PVC pipe and fittings',
    serviceType: 'Plumbing Repair',
    voiceTranscript: 'Customer reported a persistent leak under the kitchen sink. Water dripping from the P-trap connection. Damage to cabinet base observed.',
    urgency: 'High - Immediate attention recommended',
    possibleCause: 'Deteriorated seal or cracked pipe at the P-trap connection.',
    safetyAdvice: 'Turn off the water supply under the sink before the repair. Place a bucket to catch residual water.',
    paymentMethod: 'online',
    pricingType: 'fixed',
    notes: 'Please bring your own tools. Access through the back door.',
  },
  {
    id: '2',
    customerName: 'Sarah Williams',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    date: 'Today, Jul 14',
    time: '4:30 PM',
    address: '456 Pine Avenue',
    lat: 14.5547,
    lng: 121.0244,
    status: 'in_progress',
    price: '₱750',
    hourlyRate: 50,
    hasParts: false,
    duration: '45m',
    serviceType: 'Drain Cleaning',
    voiceTranscript: 'Slow drainage in bathroom floor drain. Foul odor noticed for the past week. Customer attempted chemical drain cleaner with no improvement.',
    urgency: 'Medium - Functional impairment',
    possibleCause: 'Accumulated organic buildup and debris clogging the drain line.',
    safetyAdvice: 'Ventilate the bathroom before starting. Avoid mixing chemical drain cleaners with other products.',
    paymentMethod: 'cash',
    pricingType: 'hourly',
    notes: 'Small bathroom, limited workspace. Please park on the street.',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerAvatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Water Heater Install',
    date: 'Tomorrow, Jul 15',
    time: '9:00 AM',
    address: '789 Elm Drive',
    lat: 14.5719,
    lng: 121.0516,
    status: 'en_route',
    price: '₱4,500',
    hourlyRate: 65,
    serviceType: 'Water Heater Installation',
    voiceTranscript: 'Customer needs a new 50-gallon water heater installed. Old unit has been disconnected. Gas line and venting are already in place.',
    urgency: 'Low - Scheduled installation',
    possibleCause: 'Old unit decommissioned. Gas line and venting already in place for new installation.',
    safetyAdvice: 'Ensure the gas valve is fully off before connecting the new unit. Check for gas leaks with soapy water after installation.',
    paymentMethod: 'online',
    pricingType: 'fixed',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Replacement',
    date: 'Jul 12, 2024',
    time: '11:00 AM',
    address: '321 Maple Court',
    lat: 14.5621,
    lng: 121.0013,
    status: 'completed',
    price: '₱850',
    hourlyRate: 40,
    duration: '1h 15m',
    serviceType: 'Faucet Replacement',
    voiceTranscript: 'Kitchen faucet dripping from the spout. Handle is loose and difficult to turn. Customer wants a new single-lever faucet installed.',
    urgency: 'Low - Aesthetic or minor functional issue',
    possibleCause: 'Worn-out faucet cartridge causing drip and stiff handle operation.',
    safetyAdvice: 'Turn off water supply valves under the sink before removal. Have towels ready for residual water in the lines.',
    paymentMethod: 'cash',
    pricingType: 'fixed',
  },
  {
    id: '5',
    customerName: 'Robert Wilson',
    customerAvatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Emergency Pipe Repair',
    date: 'Jul 10, 2024',
    time: '3:00 PM',
    address: '654 Cedar Lane',
    lat: 14.5387,
    lng: 121.0627,
    status: 'pending_review',
    price: '₱600',
    hourlyRate: 45,
    duration: '2h 30m',
    serviceType: 'Emergency Plumbing',
    voiceTranscript: 'Burst pipe in the bathroom wall. Water leaking into the adjacent room. Customer shut off the main valve. Urgent repair needed.',
    urgency: 'Critical - Emergency repair needed',
    possibleCause: 'Burst copper pipe due to corrosion or freezing. Water damage to adjacent room.',
    safetyAdvice: 'Main water valve is already shut off. Turn off electricity to the affected area if water is near outlets.',
    paymentMethod: 'online',
    pricingType: 'hourly',
  },
  {
    id: '6',
    customerName: 'Maria Santos',
    customerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Pipe Repair',
    date: 'Today, Jul 14',
    time: '5:00 PM',
    address: '456 Oak Avenue',
    lat: 14.5826,
    lng: 120.9787,
    status: 'accepted',
    price: '₱800',
    hourlyRate: 40,
    serviceType: 'Plumbing Repair',
    voiceTranscript: 'Low water pressure in the bathroom shower. Customer noticed gradual decrease over the past month. Other fixtures seem fine.',
    urgency: 'Low - Aesthetic or minor functional issue',
    possibleCause: 'Mineral buildup in shower head and partially clogged supply line reducing water pressure.',
    safetyAdvice: 'No immediate safety concerns. Ensure the area is dry before working to prevent slips.',
    paymentMethod: 'cash',
    pricingType: 'hourly',
  },
  {
    id: 'cancelled-1',
    customerName: 'Linda Garcia',
    customerAvatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Drain Cleaning',
    date: 'Jul 8, 2024',
    time: '10:00 AM',
    address: '789 Pine Road',
    lat: 14.6107,
    lng: 121.0359,
    status: 'cancelled',
    price: '₱800',
    hourlyRate: 45,
    cancelledReason: 'Customer no longer available',
    cancelledBy: 'customer',
    paymentMethod: 'online',
    pricingType: 'fixed',
  },
  {
    id: 'cancelled-2',
    customerName: 'Mark Santos',
    customerAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Faucet Installation',
    date: 'Jul 10, 2024',
    time: '3:00 PM',
    address: '456 Oak Lane',
    lat: 14.5800,
    lng: 121.0100,
    status: 'cancelled',
    price: '₱650',
    hourlyRate: 50,
    cancelledReason: 'Vehicle breakdown',
    cancelledBy: 'worker',
    paymentMethod: 'cash',
    pricingType: 'hourly',
  },
  {
    id: 'reported-1',
    customerName: 'Ana Santos',
    customerAvatar: 'https://images.pexels.com/photos/1234577/pexels-photo-1234577.jpeg?auto=compress&cs=tinysrgb&w=100',
    service: 'Plumbing Repair',
    date: 'Jul 12, 2024',
    time: '10:30 AM',
    address: '88 Rizal Avenue, Makati',
    lat: 14.5547,
    lng: 121.0500,
    status: 'completed',
    price: '₱1,200',
    hourlyRate: 50,
    duration: '1h 30m',
    paymentMethod: 'cash',
    pricingType: 'fixed',
    isReported: true,
    reportedReason: 'Customer did not pay',
  },
];

export const statusConfig: Record<string, { label: string; variant: 'info' | 'warning' | 'success' | 'error' | 'neutral' }> = {
  hired: { label: 'Hired', variant: 'info' },
  accepted: { label: 'Chatting', variant: 'info' },
  en_route: { label: 'En Route', variant: 'warning' },
  arrived: { label: 'Arrived', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'warning' },
  pending_review: { label: 'Pending Review', variant: 'neutral' },
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

export interface CancellationReason {
  id: string;
  label: string;
  category: 'customer' | 'worker' | 'job' | 'policy' | 'other';
  jobStages: ('before_traveling' | 'after_arriving' | 'after_inspecting')[];
  requiresInput?: boolean;
}

export const cancellationReasons: CancellationReason[] = [
  // Customer-related
  { id: 'cr1', label: 'Customer requested cancellation', category: 'customer', jobStages: ['before_traveling', 'after_arriving', 'after_inspecting'] },
  { id: 'cr2', label: 'Customer not responding', category: 'customer', jobStages: ['after_arriving'] },
  { id: 'cr3', label: 'Customer unavailable / not at home', category: 'customer', jobStages: ['after_arriving'] },
  { id: 'cr4', label: 'Customer provided incorrect address', category: 'customer', jobStages: ['after_arriving'] },
  { id: 'cr5', label: 'Customer rescheduled', category: 'customer', jobStages: ['before_traveling'] },
  { id: 'cr6', label: 'Customer refused service upon arrival', category: 'customer', jobStages: ['after_arriving'] },
  { id: 'cr7', label: 'Customer booked by mistake', category: 'customer', jobStages: ['before_traveling'] },
  
  // Worker-related
  { id: 'wr1', label: 'Personal emergency', category: 'worker', jobStages: ['before_traveling', 'after_arriving', 'after_inspecting'] },
  { id: 'wr2', label: 'Vehicle breakdown', category: 'worker', jobStages: ['before_traveling'] },
  { id: 'wr3', label: 'Running significantly late', category: 'worker', jobStages: ['before_traveling'] },
  { id: 'wr4', label: 'Lacking required tools or materials', category: 'worker', jobStages: ['after_inspecting'] },
  { id: 'wr5', label: 'Job outside my expertise', category: 'worker', jobStages: ['after_inspecting'] },
  { id: 'wr6', label: 'Accepted by mistake', category: 'worker', jobStages: ['before_traveling'] },
  { id: 'wr7', label: 'Scheduling conflict', category: 'worker', jobStages: ['before_traveling'] },
  { id: 'wr8', label: 'Unable to reach the location', category: 'worker', jobStages: ['before_traveling'] },
  
  // Job-related
  { id: 'jr1', label: 'Job description inaccurate', category: 'job', jobStages: ['after_arriving', 'after_inspecting'] },
  { id: 'jr2', label: 'Scope of work is different than advertised', category: 'job', jobStages: ['after_inspecting'] },
  { id: 'jr3', label: 'Safety hazard at the property', category: 'job', jobStages: ['after_arriving', 'after_inspecting'] },
  { id: 'jr4', label: 'Property inaccessible', category: 'job', jobStages: ['after_arriving'] },
  { id: 'jr5', label: 'Required parts unavailable', category: 'job', jobStages: ['after_inspecting'] },
  { id: 'jr6', label: 'Service no longer needed', category: 'job', jobStages: ['after_arriving', 'after_inspecting'] },
  { id: 'jr7', label: 'Weather conditions (for outdoor work)', category: 'job', jobStages: ['before_traveling'] },
  
  // Policy & Safety
  { id: 'ps1', label: 'Unsafe environment', category: 'policy', jobStages: ['after_arriving'] },
  { id: 'ps2', label: 'Harassment or abusive behavior', category: 'policy', jobStages: ['after_arriving'] },
  { id: 'ps3', label: 'Illegal or prohibited request', category: 'policy', jobStages: ['after_arriving'] },
  { id: 'ps4', label: 'Fraud or suspicious booking', category: 'policy', jobStages: ['after_arriving'] },
  { id: 'ps5', label: 'Payment issue', category: 'policy', jobStages: ['before_traveling', 'after_arriving'] },
  
  // Other
  { id: 'ot1', label: 'Other (requires explanation)', category: 'other', jobStages: ['before_traveling', 'after_arriving', 'after_inspecting'], requiresInput: true },
];

export const jobStages = [
  { label: 'Before Traveling', value: 'before_traveling' as const },
  { label: 'After Arriving', value: 'after_arriving' as const },
  { label: 'After Inspecting', value: 'after_inspecting' as const },
];

export interface ReportReason {
  id: string;
  label: string;
  category: 'safety' | 'service' | 'fraud';
}

export const reportReasons: ReportReason[] = [
  { id: 'sr1', label: 'Unsafe environment', category: 'safety' },
  { id: 'sr2', label: 'Harassment or abusive behavior', category: 'safety' },
  { id: 'sr3', label: 'Illegal or prohibited request', category: 'safety' },
  { id: 'sr4', label: 'Wrong location / address', category: 'service' },
  { id: 'sr5', label: 'Communication issues', category: 'service' },
  { id: 'sr6', label: 'Customer not qualified for service', category: 'service' },
  { id: 'sr7', label: 'Fraud or suspicious activity', category: 'fraud' },
  { id: 'sr8', label: 'Fake booking or identity', category: 'fraud' },
  { id: 'sr9', label: 'Payment dispute', category: 'fraud' },
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

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransaction {
  id: string;
  date: string;
  label: string;
  sub: string;
  credit: boolean;
  amount: string;
  status: TransactionStatus;
  type: 'earning' | 'commission' | 'payout' | 'topup';
  reference?: string;
}

export interface BarDatum {
  day: string;
  val: number;
}

export interface PayoutMethod {
  id: string;
  label: string;
  color: string;
  account: string;
}

export interface WorkerPerformance {
  completionRate: number;
  onTimeArrival: number;
  repeatClients: number;
}

export const walletTransactions: WalletTransaction[] = [
  { id: 'tx1', date: 'Oct 14', label: 'Plumbing Repair', sub: 'Mario Rossi', credit: true, amount: '₱1,250', status: 'completed', type: 'earning', reference: 'TXN-2026-0001' },
  { id: 'tx2', date: 'Oct 14', label: 'Commission Deduction', sub: 'Admin', credit: false, amount: '-₱125', status: 'completed', type: 'commission', reference: 'TXN-2026-0002' },
  { id: 'tx3', date: 'Oct 13', label: 'Electrical Inspection', sub: 'Luigi Verdi', credit: true, amount: '₱800', status: 'completed', type: 'earning', reference: 'TXN-2026-0003' },
  { id: 'tx4', date: 'Oct 13', label: 'Commission Deduction', sub: 'Admin', credit: false, amount: '-₱80', status: 'completed', type: 'commission', reference: 'TXN-2026-0004' },
  { id: 'tx5', date: 'Oct 12', label: 'AC Cleaning', sub: 'Pedro', credit: true, amount: '₱1,500', status: 'completed', type: 'earning', reference: 'TXN-2026-0005' },
  { id: 'tx6', date: 'Oct 12', label: 'Commission Deduction', sub: 'Admin', credit: false, amount: '-₱150', status: 'completed', type: 'commission', reference: 'TXN-2026-0006' },
  { id: 'tx7', date: 'Oct 11', label: 'Payout — GCash', sub: 'GCash', credit: false, amount: '-₱5,000', status: 'completed', type: 'payout', reference: 'TXN-2026-0007' },
  { id: 'tx8', date: 'Oct 10', label: 'Painting Service', sub: 'Sofia', credit: true, amount: '₱2,000', status: 'completed', type: 'earning', reference: 'TXN-2026-0008' },
  { id: 'tx9', date: 'Oct 10', label: 'Carpentry', sub: 'Miguel', credit: true, amount: '₱950', status: 'pending', type: 'earning', reference: 'TXN-2026-0009' },
  { id: 'tx10', date: 'Oct 09', label: 'Payout — BPI', sub: 'BPI', credit: false, amount: '-₱8,000', status: 'completed', type: 'payout', reference: 'TXN-2026-0010' },
  { id: 'tx11', date: 'Oct 08', label: 'Top-Up — GCash', sub: 'GCash', credit: true, amount: '₱5,000', status: 'completed', type: 'topup', reference: 'TXN-2026-0011' },
  { id: 'tx12', date: 'Oct 07', label: 'Top-Up — BPI', sub: 'BPI', credit: true, amount: '₱3,000', status: 'completed', type: 'topup', reference: 'TXN-2026-0012' },
];

export const walletBarData: BarDatum[] = [
  { day: 'Mon', val: 750 },
  { day: 'Tue', val: 1200 },
  { day: 'Wed', val: 890 },
  { day: 'Thu', val: 2160 },
  { day: 'Fri', val: 1450 },
  { day: 'Sat', val: 1800 },
  { day: 'Sun', val: 675 },
];

export const walletPayoutMethods: PayoutMethod[] = [
  { id: 'gcash', label: 'GCash', color: '#0052cc', account: '0917******' },
  { id: 'bank', label: 'BPI Savings', color: '#ed1c24', account: '****0012' },
  { id: 'paypal', label: 'PayPal', color: '#003087', account: 'juan@email.com' },
];

export const walletPerformance: WorkerPerformance = {
  completionRate: 98,
  onTimeArrival: 95,
  repeatClients: 72,
};
