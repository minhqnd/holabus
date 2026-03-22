const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateBookingId = (): string => {
    let id = '';
    for (let i = 0; i < 5; i++) {
        id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return id;
};

export const isBookingIdUnique = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/bookings?checkId=${id}`);
    const data = await res.json();
    
    if (data.exists) {
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
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, tripId, userId, paid, note }),
    });
    if (!res.ok) {
      throw new Error('Failed to save booking');
    }
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};
