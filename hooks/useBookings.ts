import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserBookings,
  createBooking,
  updateBookingStatus,
} from '@/services/booking.service';
import type { CreateBookingPayload } from '@/services/booking.service';
import type { BookingStatus } from '@/types';

export function useBookings(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBookingPayload) => createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
  });

  return {
    ...query,
    createBooking: createMutation,
    updateBookingStatus: updateStatusMutation,
  };
}
