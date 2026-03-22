import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        b.booking_id, b.user_id, b.trip_id, b.bus_id,
        b.created_at, b.is_paid, b.is_checked_in, b.checkin_time, b.note,
        u.name as user_name, u.phone as user_phone, u.email as user_email,
        u.destination, u.transfer_point,
        t.name as trip_name, t.trip_date, t.departure_time, t.price as trip_price, t.route_id,
        r.name as route_name
      FROM Bookings b
      LEFT JOIN Users u ON b.user_id = u.user_id
      LEFT JOIN Trips t ON b.trip_id = t.trip_id
      LEFT JOIN Routes r ON t.route_id = r.route_id
      ORDER BY b.created_at DESC
    `);

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

    const updates: string[] = [];
    if (busId !== undefined) {
      req.input('bus_id', sql.NVarChar, busId);
      updates.push('bus_id = @bus_id');
    }
    if (isPaid !== undefined) {
      req.input('is_paid', sql.Bit, isPaid ? 1 : 0);
      updates.push('is_paid = @is_paid');
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    await req.query(`UPDATE Bookings SET ${updates.join(', ')} WHERE booking_id = @booking_id`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
