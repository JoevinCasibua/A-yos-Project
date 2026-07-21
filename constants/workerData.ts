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
  workExperience: [
    {
      id: 'exp1',
      company: 'ABC Plumbing Co.',
      role: 'Senior Plumber',
      startDate: '2019-03',
      endDate: '2024-06',
      isCurrent: false,
      description: 'Led a team of 5 plumbers handling residential and commercial projects across the city.',
    },
    {
      id: 'exp2',
      company: 'FixIt All Services',
      role: 'Plumber',
      startDate: '2015-01',
      endDate: '2019-02',
      isCurrent: false,
      description: 'Performed installations, repairs, and maintenance for residential clients.',
    },
    {
      id: 'exp3',
      company: 'Méndez Plumbing',
      role: 'Apprentice',
      startDate: '2012-06',
      isCurrent: true,
      description: 'Started as an apprentice learning plumbing trade fundamentals.',
    },
  ],
  availability: {
    mon: { available: true, startTime: '08:00', endTime: '18:00' },
    tue: { available: true, startTime: '08:00', endTime: '18:00' },
    wed: { available: true, startTime: '08:00', endTime: '18:00' },
    thu: { available: true, startTime: '08:00', endTime: '18:00' },
    fri: { available: true, startTime: '08:00', endTime: '17:00' },
    sat: { available: true, startTime: '09:00', endTime: '14:00' },
    sun: { available: false, startTime: '09:00', endTime: '13:00' },
  },
};
