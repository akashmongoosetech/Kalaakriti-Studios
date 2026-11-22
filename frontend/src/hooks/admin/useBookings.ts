import { useCallback, useEffect, useState } from 'react';
import type {
  BookingRecord,
  BookingStatus,
  CreateBookingInput,
  UpdateBookingInput,
} from '../../types/booking.types';
import { bookingService } from '../../services/admin/booking.service';
import { DATA_CHANGE_EVENT } from '../../services/admin/storage.util';

export function useBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [trashedBookings, setTrashedBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (withSkeleton = false) => {
    if (withSkeleton) {
      setLoading(true);
    }
    setError(null);
    try {
      const [activeItems, trashItems] = await Promise.all([
        bookingService.getAll(),
        bookingService.getTrash(),
      ]);
      setBookings(activeItems);
      setTrashedBookings(trashItems);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load bookings.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh(true);
    const onDataChange = () => {
      void refresh(false);
    };
    window.addEventListener(DATA_CHANGE_EVENT, onDataChange);
    return () => {
      window.removeEventListener(DATA_CHANGE_EVENT, onDataChange);
    };
  }, [refresh]);

  const createBooking = useCallback(async (input: CreateBookingInput) => {
    return bookingService.create(input);
  }, []);

  const updateBooking = useCallback(async (id: string, input: UpdateBookingInput) => {
    return bookingService.update(id, input);
  }, []);

  const updateStatus = useCallback(async (id: string, status: BookingStatus) => {
    return bookingService.updateStatus(id, status);
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    await bookingService.softDelete(id);
  }, []);

  const restoreBooking = useCallback(async (id: string) => {
    await bookingService.restore(id);
  }, []);

  const permanentDeleteBooking = useCallback(async (id: string) => {
    await bookingService.permanentDelete(id);
  }, []);

  const addDemoBooking = useCallback(async () => {
    return bookingService.createSampleBooking();
  }, []);

  return {
    bookings,
    trashedBookings,
    loading,
    error,
    refresh,
    createBooking,
    updateBooking,
    updateStatus,
    deleteBooking,
    restoreBooking,
    permanentDeleteBooking,
    addDemoBooking,
  };
}
