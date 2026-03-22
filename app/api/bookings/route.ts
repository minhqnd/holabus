import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

// POST: Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, tripId, userId, paid, note } = body;

    if (!bookingId || !tripId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pool = await getPool();

    try {
      await pool.request()
        .input('booking_id', sql.NVarChar, bookingId)
        .input('user_id', sql.NVarChar, userId)
        .input('trip_id', sql.NVarChar, tripId)
        .input('is_paid', sql.Bit, paid ? 1 : 0)
        .input('note', sql.NVarChar, note || '')
        .execute('sp_CreateBooking');

      return NextResponse.json({ success: true, bookingId });
    } catch (dbError: any) {
      if (dbError.number === 50001) {
        return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
      }
      if (dbError.number === 50002) {
        return NextResponse.json({ error: 'Trip is fully booked (Hết vé)' }, { status: 400 });
      }
      throw dbError; // rethrow other errors
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Check if a booking ID exists (for uniqueness check)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkId = searchParams.get('checkId');

    if (!checkId) {
      return NextResponse.json({ error: 'Missing checkId param' }, { status: 400 });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('booking_id', sql.NVarChar, checkId)
      .query('SELECT 1 FROM Bookings WHERE booking_id = @booking_id');

    return NextResponse.json({ exists: result.recordset.length > 0 });
  } catch (error) {
    console.error('Error checking booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
