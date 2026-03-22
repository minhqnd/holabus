import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();

    // Get route info
    const routeResult = await pool.request()
      .input('route_id', sql.NVarChar, id.toUpperCase())
      .query('SELECT * FROM Routes WHERE route_id = @route_id');

    if (routeResult.recordset.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const route = routeResult.recordset[0];

    // Get locations
    const locResult = await pool.request()
      .input('route_id', sql.NVarChar, id.toUpperCase())
      .query('SELECT location_name FROM RouteLocations WHERE route_id = @route_id ORDER BY stop_order');

    const locations = locResult.recordset.map((r: { location_name: string }) => r.location_name);

    return NextResponse.json({
      name: route.name,
      price: route.price.toLocaleString('vi-VN').replace(/,/g, '.'),
      available: route.is_available,
      locations,
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
