
/**
 * Lấy thông tin booking theo bookingId.
 * @param {string} bookingId 
 * @returns {Promise<Object>} Thông tin booking.
 */
export async function getBookingById(bookingId: string) {
    const res = await fetch(`/api/bookings/${bookingId}`);
    if (!res.ok) {
        throw new Error('Failed to fetch booking data');
    }
    return await res.json();
}
