export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface DayAvailability {
  available: boolean;
  startTime: string;
  endTime: string;
}

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const DAY_LABELS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  avatarUri: string;
  category: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  earnings: string;
  hourlyRate: string;
  skills: string[];
  serviceAreas: string[];
  portfolioImages: string[];
  bio: string;
  workExperience: WorkExperience[];
  availability: Record<string, DayAvailability>;
}

export interface WorkerReview {
  id: string;
  author: string;
  avatarUri: string;
  rating: number;
  date: string;
  comment: string;
  serviceType: string;
}

export interface WorkerSearchProfile {
  id: string;
  name: string;
  category: string;
  skill: string;
  rating: number;
  reviewsCount: number;
  distance: string;
  price: string;
  experienceYears: number;
  avatar: string;
  coverImage: string;
  availability: string;
  isFeatured: boolean;
  isRecommended: boolean;
  skills: string[];
  portfolioImages: string[];
  reviews: WorkerSearchReview[];
}

export interface WorkerSearchReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

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
    { label: 'Outlet Installation', value: 'outlet_installation' },
    { label: 'Lighting Setup', value: 'lighting_setup' },
    { label: 'Generator Maintenance', value: 'generator_maintenance' },
  ],
  carpentry: [
    { label: 'Furniture Building', value: 'furniture_building' },
    { label: 'Cabinet Installation', value: 'cabinet_installation' },
    { label: 'Door Repair', value: 'door_repair' },
    { label: 'Deck Building', value: 'deck_building' },
    { label: 'Wood Finishing', value: 'wood_finishing' },
  ],
  hvac: [
    { label: 'AC Installation', value: 'ac_installation' },
    { label: 'AC Cleaning', value: 'ac_cleaning' },
    { label: 'Heating Repair', value: 'heating_repair' },
    { label: 'Duct Cleaning', value: 'duct_cleaning' },
    { label: 'Thermostat Setup', value: 'thermostat_setup' },
  ],
  painting: [
    { label: 'Interior Painting', value: 'interior_painting' },
    { label: 'Exterior Painting', value: 'exterior_painting' },
    { label: 'Wallpaper Installation', value: 'wallpaper_installation' },
    { label: 'Surface Preparation', value: 'surface_preparation' },
    { label: 'Color Consulting', value: 'color_consulting' },
  ],
  cleaning: [
    { label: 'Deep Cleaning', value: 'deep_cleaning' },
    { label: 'Regular Maintenance', value: 'regular_maintenance' },
    { label: 'Move-in/out Cleaning', value: 'move_cleaning' },
    { label: 'Window Cleaning', value: 'window_cleaning' },
    { label: 'Carpet Cleaning', value: 'carpet_cleaning' },
  ],
  landscaping: [
    { label: 'Lawn Maintenance', value: 'lawn_maintenance' },
    { label: 'Garden Design', value: 'garden_design' },
    { label: 'Tree Trimming', value: 'tree_trimming' },
    { label: 'Irrigation Setup', value: 'irrigation_setup' },
    { label: 'Pest Control', value: 'pest_control' },
  ],
  appliance_repair: [
    { label: 'Refrigerator Repair', value: 'refrigerator_repair' },
    { label: 'Washing Machine Repair', value: 'washing_machine_repair' },
    { label: 'Oven Repair', value: 'oven_repair' },
    { label: 'Air Conditioner Repair', value: 'ac_repair' },
    { label: 'Dishwasher Repair', value: 'dishwasher_repair' },
  ],
  general_maintenance: [
    { label: 'Plumbing Basics', value: 'plumbing_basics' },
    { label: 'Electrical Basics', value: 'electrical_basics' },
    { label: 'Painting Touch-ups', value: 'painting_touchups' },
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
