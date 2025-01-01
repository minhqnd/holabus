
export const BASE_URL = 'https://holabus-fpt-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Lấy thông tin booking theo bookingId.
 * @param {string} bookingId 
 * @returns {Promise<Object>} Thông tin booking.
 */
export async function getBookingById(bookingId: string) {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}.json`);
    if (!res.ok) {
        throw new Error('Failed to fetch booking data');
    }
    return await res.json();
}
