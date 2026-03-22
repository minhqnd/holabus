import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

// PATCH: Check-in a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();

    const timestamp = new Date();

    await pool.request()
      .input('booking_id', sql.NVarChar, id)
      .input('checkin_time', sql.DateTime, new Date())
      .execute('sp_CheckInBooking');

    return NextResponse.json({ success: true, checkinTime: timestamp.toISOString() });
  } catch (error) {
    console.error('Error checking in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
