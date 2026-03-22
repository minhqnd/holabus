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
      .input('trip_id', sql.NVarChar, id)
      .query('SELECT * FROM Trips WHERE trip_id = @trip_id');

    if (result.recordset.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const t = result.recordset[0];
    return NextResponse.json({
      id: t.trip_id,
      name: t.name,
      date: t.trip_date,
      time: t.departure_time,
      price: typeof t.price === 'number' ? t.price.toLocaleString('vi-VN').replace(/,/g, '.') : t.price,
      routeId: t.route_id,
      slot: t.available_slots,
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
