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

    // Check in ticketpools from local json file
    const ticketpools = require('@/data/ticketpools.json');
    const tickets = ticketpools.tickets;
    if (tickets.includes(id)) {
        return false;
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
  paid: boolean,
  note: string = ''
): Promise<void> => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await set(bookingRef, {
      tripId,
      userId,
      createdAt: new Date().toISOString(),
      paid: false,
      note
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};
