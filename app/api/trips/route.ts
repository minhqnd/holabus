import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const routeId = searchParams.get('routeId');
    const pool = await getPool();

    let query = 'SELECT * FROM Trips';
    const req = pool.request();

    if (routeId) {
      query += ' WHERE route_id = @route_id';
      req.input('route_id', sql.NVarChar, routeId.toUpperCase());
    }

    const result = await req.query(query);

    // Format as array with id field (matching Firebase format)
    const trips = result.recordset.map((t: Record<string, unknown>) => ({
      id: t.trip_id,
      name: t.name,
      date: t.trip_date,
      time: t.departure_time,
      price: typeof t.price === 'number' ? t.price.toLocaleString('vi-VN').replace(/,/g, '.') : t.price,
      routeId: t.route_id,
      slot: t.available_slots,
    }));

    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
