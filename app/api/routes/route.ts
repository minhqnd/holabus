import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();
    
    // Load all routes and locations
    const [routesR, locationsR] = await Promise.all([
      pool.request().execute('sp_GetAllRoutes'),
      pool.request().execute('sp_GetAllRouteLocations'),
    ]);

    const routes: Record<string, unknown> = {};
    
    for (const r of routesR.recordset) {
      routes[r.route_id] = {
        name: r.name,
        price: r.price ? r.price.toLocaleString('vi-VN').replace(/,/g, '.') : '0',
        available: r.is_available,
        locations: [],
        iframeMap: r.iframe_map || '',
      };
    }
    
    for (const l of locationsR.recordset) {
      if (routes[l.route_id]) {
        (routes[l.route_id] as { locations: string[] }).locations.push(l.location_name);
      }
    }

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error fetching global routes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
