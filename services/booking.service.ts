import type { WorkerBooking, BookingStatus } from '@/types';
import { workerBookings } from '@/constants/workerMockData';

export interface CreateBookingPayload {
  workerId: string;
  service: string;
  date: string;
  time: string;
  address: string;
  lat: number;
  lng: number;
  description?: string;
  urgency?: string;
  hasParts?: boolean;
  partsDescription?: string;
}

export async function createBooking(
  data: CreateBookingPayload,
): Promise<WorkerBooking> {
  // TODO: POST /bookings
  console.log('[booking] createBooking placeholder', data);
  return {
    id: `booking-${Date.now()}`,
    customerName: 'Demo Customer',
    customerAvatar: '',
    service: data.service,
    date: data.date,
    time: data.time,
    address: data.address,
    lat: data.lat,
    lng: data.lng,
    status: 'hired',
    price: '₱0',
    hourlyRate: 0,
    hasParts: data.hasParts,
    partsDescription: data.partsDescription,
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<WorkerBooking> {
  // TODO: PATCH /bookings/:id/status
  console.log('[booking] updateBookingStatus placeholder', bookingId, status);
  const booking = workerBookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error(`Booking ${bookingId} not found`);
  return { ...booking, status };
}

export async function getBooking(bookingId: string): Promise<WorkerBooking> {
  // TODO: GET /bookings/:id
  const booking = workerBookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error(`Booking ${bookingId} not found`);
  return booking;
}

export async function getUserBookings(userId: string): Promise<WorkerBooking[]> {
  // TODO: GET /users/:id/bookings
  console.log('[booking] getUserBookings placeholder for', userId);
  return workerBookings;
}
