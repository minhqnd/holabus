import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('sp_GetAllBookingsDetails');

    // Format the flat SQL rows back into nested objects if needed, 
    // or just return as is (frontend might expect a flat array now) 
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Update booking (payment, bus assignment)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, busId, isPaid } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const pool = await getPool();
    const req = pool.request().input('booking_id', sql.NVarChar, bookingId);

    let hasUpdates = false;
    if (busId !== undefined) {
      req.input('bus_id', sql.NVarChar, busId);
      hasUpdates = true;
    }
    if (isPaid !== undefined) {
      req.input('is_paid', sql.Bit, isPaid ? 1 : 0);
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    await req.execute('sp_UpdateBookingAdmin');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
