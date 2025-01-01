import { get, ref, set } from 'firebase/database';
import { database } from '@/firebase';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateBookingId = (): string => {
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return id;
};

export const isBookingIdUnique = async (id: string): Promise<boolean> => {
    // Check in firebase bookings
    const bookingRef = ref(database, `bookings/${id}`);
    const bookingSnapshot = await get(bookingRef);

    if (bookingSnapshot.exists()) {
        return false;
    }

    // Check in ticketpools
    const ticketpoolsRef = ref(database, 'ticketpools/tickets');
    const ticketpoolsSnapshot = await get(ticketpoolsRef);

    if (ticketpoolsSnapshot.exists()) {
        const tickets = ticketpoolsSnapshot.val();
        return !tickets.includes(id);
    }

    return true;
};

export const generateUniqueBookingId = async (): Promise<string> => {
    let id = generateBookingId();
    while (!(await isBookingIdUnique(id))) {
        id = generateBookingId();
    }
    return id;
};

export const saveBookingData = async (
  bookingId: string,
  tripId: string,
  userId: string,
  paid: boolean
): Promise<void> => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    console.log('Saving booking data:', { bookingId, tripId, userId });
    await set(bookingRef, {
      tripId,
      userId,
      createdAt: new Date().toISOString(), // Add timestamp
      paid: false 
    });
    console.log('Booking saved successfully');
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};
