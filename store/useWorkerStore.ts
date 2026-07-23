import { create } from 'zustand';

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface WorkerProfile {
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
  reviews: Review[];
}

const MOCK_WORKERS: WorkerProfile[] = [
  {
    "id": "w1",
    "name": "Mario Rossi 0",
    "category": "Plumbing",
    "skill": "Plumbing Specialist",
    "rating": 4.1,
    "reviewsCount": 113,
    "distance": "1.3km",
    "price": "₱670 - ₱1015 / hr",
    "experienceYears": 3,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Plumbing",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r2",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w2",
    "name": "Elena Gomez 1",
    "category": "Plumbing",
    "skill": "Plumbing Specialist",
    "rating": 4.9,
    "reviewsCount": 25,
    "distance": "5.2km",
    "price": "₱684 - ₱1315 / hr",
    "experienceYears": 16,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Plumbing",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r3",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w3",
    "name": "Elena Gomez 2",
    "category": "Plumbing",
    "skill": "Plumbing Specialist",
    "rating": 4.2,
    "reviewsCount": 209,
    "distance": "2.2km",
    "price": "₱940 - ₱1211 / hr",
    "experienceYears": 5,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Plumbing",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r4",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w4",
    "name": "Elena Gomez 3",
    "category": "Plumbing",
    "skill": "Plumbing Specialist",
    "rating": 4.3,
    "reviewsCount": 142,
    "distance": "4.4km",
    "price": "₱981 - ₱1204 / hr",
    "experienceYears": 15,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Plumbing",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r5",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w5",
    "name": "John Doe 4",
    "category": "Plumbing",
    "skill": "Plumbing Specialist",
    "rating": 4.1,
    "reviewsCount": 184,
    "distance": "1.5km",
    "price": "₱819 - ₱1480 / hr",
    "experienceYears": 14,
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Plumbing",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r6",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w6",
    "name": "Pedro Penduko 0",
    "category": "Electrical",
    "skill": "Electrical Specialist",
    "rating": 4.4,
    "reviewsCount": 139,
    "distance": "5.7km",
    "price": "₱618 - ₱1290 / hr",
    "experienceYears": 15,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Electrical",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r7",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w7",
    "name": "David Lim 1",
    "category": "Electrical",
    "skill": "Electrical Specialist",
    "rating": 4.5,
    "reviewsCount": 77,
    "distance": "6.0km",
    "price": "₱585 - ₱1334 / hr",
    "experienceYears": 11,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Electrical",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r8",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w8",
    "name": "David Lim 2",
    "category": "Electrical",
    "skill": "Electrical Specialist",
    "rating": 4.8,
    "reviewsCount": 188,
    "distance": "3.6km",
    "price": "₱505 - ₱1060 / hr",
    "experienceYears": 8,
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Electrical",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r9",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w9",
    "name": "David Lim 3",
    "category": "Electrical",
    "skill": "Electrical Specialist",
    "rating": 4.9,
    "reviewsCount": 75,
    "distance": "4.6km",
    "price": "₱513 - ₱1081 / hr",
    "experienceYears": 13,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Electrical",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r10",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w10",
    "name": "Anna Silva 4",
    "category": "Electrical",
    "skill": "Electrical Specialist",
    "rating": 4.7,
    "reviewsCount": 121,
    "distance": "5.7km",
    "price": "₱747 - ₱1401 / hr",
    "experienceYears": 6,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Electrical",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r11",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w11",
    "name": "Maria Tan 0",
    "category": "Carpentry",
    "skill": "Carpentry Specialist",
    "rating": 4.1,
    "reviewsCount": 66,
    "distance": "1.6km",
    "price": "₱562 - ₱1306 / hr",
    "experienceYears": 3,
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Carpentry",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r12",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w12",
    "name": "John Doe 1",
    "category": "Carpentry",
    "skill": "Carpentry Specialist",
    "rating": 4.4,
    "reviewsCount": 29,
    "distance": "2.7km",
    "price": "₱932 - ₱1459 / hr",
    "experienceYears": 12,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Carpentry",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r13",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w13",
    "name": "Alex Santos 2",
    "category": "Carpentry",
    "skill": "Carpentry Specialist",
    "rating": 4.1,
    "reviewsCount": 43,
    "distance": "4.0km",
    "price": "₱589 - ₱1492 / hr",
    "experienceYears": 12,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Carpentry",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r14",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w14",
    "name": "Sofia Reyes 3",
    "category": "Carpentry",
    "skill": "Carpentry Specialist",
    "rating": 4.3,
    "reviewsCount": 178,
    "distance": "3.4km",
    "price": "₱724 - ₱1017 / hr",
    "experienceYears": 2,
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Carpentry",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r15",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w15",
    "name": "Luigi Verdi 4",
    "category": "Carpentry",
    "skill": "Carpentry Specialist",
    "rating": 4.4,
    "reviewsCount": 117,
    "distance": "5.3km",
    "price": "₱642 - ₱1169 / hr",
    "experienceYears": 4,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Carpentry",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r16",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w16",
    "name": "Anna Silva 0",
    "category": "Cleaning",
    "skill": "Cleaning Specialist",
    "rating": 4.2,
    "reviewsCount": 77,
    "distance": "3.3km",
    "price": "₱556 - ₱1259 / hr",
    "experienceYears": 10,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Cleaning",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r17",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w17",
    "name": "Alex Santos 1",
    "category": "Cleaning",
    "skill": "Cleaning Specialist",
    "rating": 4.1,
    "reviewsCount": 48,
    "distance": "4.4km",
    "price": "₱721 - ₱1220 / hr",
    "experienceYears": 2,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Cleaning",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r18",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w18",
    "name": "Elena Gomez 2",
    "category": "Cleaning",
    "skill": "Cleaning Specialist",
    "rating": 4.9,
    "reviewsCount": 23,
    "distance": "2.0km",
    "price": "₱787 - ₱1393 / hr",
    "experienceYears": 13,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Cleaning",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r19",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w19",
    "name": "Luigi Verdi 3",
    "category": "Cleaning",
    "skill": "Cleaning Specialist",
    "rating": 4.5,
    "reviewsCount": 209,
    "distance": "4.4km",
    "price": "₱542 - ₱1304 / hr",
    "experienceYears": 16,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Cleaning",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r20",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w20",
    "name": "John Doe 4",
    "category": "Cleaning",
    "skill": "Cleaning Specialist",
    "rating": 4.9,
    "reviewsCount": 41,
    "distance": "3.5km",
    "price": "₱678 - ₱1258 / hr",
    "experienceYears": 16,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Cleaning",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r21",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w21",
    "name": "Juan Dela Cruz 0",
    "category": "Appliance",
    "skill": "Appliance Specialist",
    "rating": 4.6,
    "reviewsCount": 182,
    "distance": "2.5km",
    "price": "₱940 - ₱1458 / hr",
    "experienceYears": 10,
    "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Appliance",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r22",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w22",
    "name": "Maria Tan 1",
    "category": "Appliance",
    "skill": "Appliance Specialist",
    "rating": 4.3,
    "reviewsCount": 136,
    "distance": "1.5km",
    "price": "₱639 - ₱1001 / hr",
    "experienceYears": 11,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Appliance",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r23",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w23",
    "name": "Luigi Verdi 2",
    "category": "Appliance",
    "skill": "Appliance Specialist",
    "rating": 4.4,
    "reviewsCount": 88,
    "distance": "5.4km",
    "price": "₱985 - ₱1350 / hr",
    "experienceYears": 14,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Appliance",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r24",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w24",
    "name": "Maria Tan 3",
    "category": "Appliance",
    "skill": "Appliance Specialist",
    "rating": 4.7,
    "reviewsCount": 79,
    "distance": "2.8km",
    "price": "₱660 - ₱1336 / hr",
    "experienceYears": 16,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Appliance",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r25",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w25",
    "name": "Elena Gomez 4",
    "category": "Appliance",
    "skill": "Appliance Specialist",
    "rating": 4.1,
    "reviewsCount": 205,
    "distance": "1.3km",
    "price": "₱748 - ₱1151 / hr",
    "experienceYears": 5,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Appliance",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r26",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w26",
    "name": "Sofia Reyes 0",
    "category": "AC Repair",
    "skill": "AC Repair Specialist",
    "rating": 4.3,
    "reviewsCount": 188,
    "distance": "5.7km",
    "price": "₱683 - ₱1473 / hr",
    "experienceYears": 12,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General AC Repair",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r27",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w27",
    "name": "Juan Dela Cruz 1",
    "category": "AC Repair",
    "skill": "AC Repair Specialist",
    "rating": 4.8,
    "reviewsCount": 134,
    "distance": "3.7km",
    "price": "₱987 - ₱1491 / hr",
    "experienceYears": 7,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General AC Repair",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r28",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w28",
    "name": "Alex Santos 2",
    "category": "AC Repair",
    "skill": "AC Repair Specialist",
    "rating": 4.8,
    "reviewsCount": 98,
    "distance": "1.1km",
    "price": "₱747 - ₱1064 / hr",
    "experienceYears": 11,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General AC Repair",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r29",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w29",
    "name": "David Lim 3",
    "category": "AC Repair",
    "skill": "AC Repair Specialist",
    "rating": 4.7,
    "reviewsCount": 84,
    "distance": "5.7km",
    "price": "₱836 - ₱1449 / hr",
    "experienceYears": 8,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General AC Repair",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r30",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w30",
    "name": "Benito Suarez 4",
    "category": "AC Repair",
    "skill": "AC Repair Specialist",
    "rating": 4.2,
    "reviewsCount": 130,
    "distance": "1.5km",
    "price": "₱516 - ₱1086 / hr",
    "experienceYears": 9,
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General AC Repair",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r31",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w31",
    "name": "Juan Dela Cruz 0",
    "category": "Painting",
    "skill": "Painting Specialist",
    "rating": 4.8,
    "reviewsCount": 202,
    "distance": "5.2km",
    "price": "₱999 - ₱1048 / hr",
    "experienceYears": 3,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Painting",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r32",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w32",
    "name": "David Lim 1",
    "category": "Painting",
    "skill": "Painting Specialist",
    "rating": 4.9,
    "reviewsCount": 74,
    "distance": "4.7km",
    "price": "₱738 - ₱1238 / hr",
    "experienceYears": 4,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Painting",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r33",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w33",
    "name": "Miguel Torre 2",
    "category": "Painting",
    "skill": "Painting Specialist",
    "rating": 4.3,
    "reviewsCount": 103,
    "distance": "5.6km",
    "price": "₱980 - ₱1487 / hr",
    "experienceYears": 7,
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Painting",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r34",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w34",
    "name": "Miguel Torre 3",
    "category": "Painting",
    "skill": "Painting Specialist",
    "rating": 4.9,
    "reviewsCount": 65,
    "distance": "1.5km",
    "price": "₱901 - ₱1146 / hr",
    "experienceYears": 2,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Painting",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r35",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w35",
    "name": "John Doe 4",
    "category": "Painting",
    "skill": "Painting Specialist",
    "rating": 4.9,
    "reviewsCount": 138,
    "distance": "2.5km",
    "price": "₱835 - ₱1465 / hr",
    "experienceYears": 8,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Painting",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r36",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w36",
    "name": "Alex Santos 0",
    "category": "Gardening",
    "skill": "Gardening Specialist",
    "rating": 5,
    "reviewsCount": 98,
    "distance": "4.7km",
    "price": "₱726 - ₱1026 / hr",
    "experienceYears": 7,
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": true,
    "isRecommended": true,
    "skills": [
      "General Gardening",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r37",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w37",
    "name": "Sofia Reyes 1",
    "category": "Gardening",
    "skill": "Gardening Specialist",
    "rating": 4.3,
    "reviewsCount": 186,
    "distance": "4.9km",
    "price": "₱594 - ₱1047 / hr",
    "experienceYears": 4,
    "avatar": "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": true,
    "skills": [
      "General Gardening",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r38",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w38",
    "name": "Miguel Torre 2",
    "category": "Gardening",
    "skill": "Gardening Specialist",
    "rating": 4.2,
    "reviewsCount": 96,
    "distance": "3.5km",
    "price": "₱750 - ₱1146 / hr",
    "experienceYears": 14,
    "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Gardening",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r39",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w39",
    "name": "Juan Dela Cruz 3",
    "category": "Gardening",
    "skill": "Gardening Specialist",
    "rating": 4.2,
    "reviewsCount": 16,
    "distance": "4.9km",
    "price": "₱629 - ₱1406 / hr",
    "experienceYears": 4,
    "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Next week",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Gardening",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r40",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  },
  {
    "id": "w40",
    "name": "Benito Suarez 4",
    "category": "Gardening",
    "skill": "Gardening Specialist",
    "rating": 4.7,
    "reviewsCount": 166,
    "distance": "2.2km",
    "price": "₱918 - ₱1102 / hr",
    "experienceYears": 4,
    "avatar": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    "availability": "Available today",
    "isFeatured": false,
    "isRecommended": false,
    "skills": [
      "General Gardening",
      "Maintenance",
      "Inspection"
    ],
    "portfolioImages": [],
    "reviews": [
      {
        "id": "r41",
        "author": "User",
        "rating": 5,
        "date": "Oct 20, 2026",
        "comment": "Great job!"
      }
    ]
  }
];

interface WorkerStore {
  workers: WorkerProfile[];
  compareList: string[]; // array of worker IDs
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  getWorkerById: (id: string) => WorkerProfile | undefined;
}

export const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: MOCK_WORKERS,
  compareList: [],

  addToCompare: (id) => set((state) => {
    if (state.compareList.includes(id)) return state;
    if (state.compareList.length >= 3) {
      // Typically we'd use a toast or UI alert, but state level protection is good
      return state;
    }
    return { compareList: [...state.compareList, id] };
  }),

  removeFromCompare: (id) => set((state) => ({
    compareList: state.compareList.filter(workerId => workerId !== id)
  })),

  clearCompare: () => set({ compareList: [] }),

  getWorkerById: (id) => {
    return get().workers.find(w => w.id === id);
  }
}));
