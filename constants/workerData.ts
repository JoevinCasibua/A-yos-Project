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
}

export const workerProfile: WorkerProfile = {
  id: 'w1',
  name: 'Carlos Méndez',
  email: 'carlos.mendez@email.com',
  avatarUri: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=200',
  category: 'Master Plumber',
  verificationStatus: 'verified',
  yearsExperience: 12,
  rating: 4.9,
  reviewCount: 127,
  completedJobs: 47,
  earnings: '$2,340',
  hourlyRate: '$45/hr',
  skills: ['Pipe Repair', 'Drain Cleaning', 'Water Heater Installation', 'Fixture Installation', 'Emergency Repair', 'Sewer Line Maintenance'],
  serviceAreas: ['Downtown', 'Midtown', 'Westside', 'North Hills'],
  portfolioImages: [
    'https://images.pexels.com/photos/5691603/pexels-photo-5691603.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5691620/pexels-photo-5691620.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  bio: 'Professional plumber with 12 years of experience in residential and commercial services. Specializing in emergency repairs, installations, and maintenance. Available for same-day service.',
};
