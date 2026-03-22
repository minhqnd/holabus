import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();

    const result = await pool.request()
      .input('booking_id', sql.NVarChar, id)
      .execute('sp_GetBookingById');

    if (result.recordset.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const b = result.recordset[0];
    return NextResponse.json({
      tripId: b.trip_id,
      userId: b.user_id,
      busId: b.bus_id,
      createdAt: b.created_at,
      paid: b.is_paid,
      checkin: b.is_checked_in ? (b.checkin_time || true) : false,
      note: b.note,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
