import type {
  WorkerProfile,
  WorkerSearchProfile,
  WorkerReview,
  WorkerBooking,
} from '@/types';
import { workerProfile } from '@/constants/workerData';
import { workerReviews, workerBookings } from '@/constants/workerMockData';

export interface WorkerSearchFilters {
  category?: string;
  minRating?: number;
  maxDistance?: number;
  availability?: string;
}

const workerSearchResults: WorkerSearchProfile[] = [
  {
    id: 'w1',
    name: 'Carlos Méndez',
    category: 'Plumbing',
    skill: 'Pipe Repair',
    rating: 4.9,
    reviewsCount: 127,
    distance: '1.2 mi',
    price: '₱45/hr',
    experienceYears: 12,
    avatar: workerProfile.avatarUri,
    coverImage: workerProfile.portfolioImages[0],
    availability: 'Available Today',
    isFeatured: true,
    isRecommended: true,
    skills: workerProfile.skills,
    portfolioImages: workerProfile.portfolioImages,
    reviews: workerReviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.date,
      comment: r.comment,
    })),
  },
  {
    id: 'w2',
    name: 'Sofía Ramírez',
    category: 'Electrical',
    skill: 'Wiring Installation',
    rating: 4.8,
    reviewsCount: 89,
    distance: '0.8 mi',
    price: '₱55/hr',
    experienceYears: 8,
    avatar: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=200',
    coverImage: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg?auto=compress&cs=tinysrgb&w=800',
    availability: 'Available Tomorrow',
    isFeatured: false,
    isRecommended: true,
    skills: ['Wiring Installation', 'Circuit Breaker Repair', 'Lighting Setup'],
    portfolioImages: [],
    reviews: [],
  },
];

export async function searchWorkers(
  query: string,
  filters?: WorkerSearchFilters,
): Promise<WorkerSearchProfile[]> {
  // TODO: GET /workers/search?q=...&category=...&minRating=...
  let results = workerSearchResults;
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.skill.toLowerCase().includes(q),
    );
  }
  if (filters?.category) {
    results = results.filter((w) => w.category.toLowerCase() === filters.category!.toLowerCase());
  }
  if (filters?.minRating) {
    results = results.filter((w) => w.rating >= filters.minRating!);
  }
  return results;
}

export async function getWorkerProfile(workerId: string): Promise<WorkerProfile> {
  // TODO: GET /workers/:id
  if (workerId !== workerProfile.id) {
    throw new Error(`Worker ${workerId} not found`);
  }
  return workerProfile;
}

export async function updateWorkerProfile(
  workerId: string,
  data: Partial<WorkerProfile>,
): Promise<WorkerProfile> {
  // TODO: PATCH /workers/:id
  console.log('[worker] updateWorkerProfile placeholder', workerId, data);
  return { ...workerProfile, ...data };
}

export async function getWorkerBookings(workerId: string): Promise<WorkerBooking[]> {
  // TODO: GET /workers/:id/bookings
  console.log('[worker] getWorkerBookings placeholder for', workerId);
  return workerBookings;
}

export async function getWorkerReviews(workerId: string): Promise<WorkerReview[]> {
  // TODO: GET /workers/:id/reviews
  console.log('[worker] getWorkerReviews placeholder for', workerId);
  return workerReviews;
}
