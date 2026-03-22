import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

// POST / PATCH to Upsert a Route
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    const routeId = data.routeId;
    if (!routeId) return NextResponse.json({ error: 'Missing routeId' }, { status: 400 });

    const pool = await getPool();

    // Check if route exists
    const existsCheck = await pool.request()
        .input('route_id', sql.NVarChar, routeId)
        .query('SELECT 1 FROM Routes WHERE route_id = @route_id');

    const priceNum = typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, '')) || 0 : data.price;

    if (existsCheck.recordset.length > 0) {
      // route exists -> UPDATE
      await pool.request()
        .input('route_id', sql.NVarChar, routeId)
        .input('name', sql.NVarChar, data.name)
        .input('price', sql.Int, priceNum)
        .input('is_available', sql.Bit, data.available ? 1 : 0)
        .input('iframe_map', sql.NVarChar, data.iframeMap || data.iframe_map || '')
        .execute('sp_UpdateRoute');
    } else {
      // route does not exist -> CREATE
      await pool.request()
        .input('route_id', sql.NVarChar, routeId)
        .input('name', sql.NVarChar, data.name)
        .input('price', sql.Int, priceNum)
        .input('is_available', sql.Bit, data.available ? 1 : 0)
        .input('iframe_map', sql.NVarChar, data.iframeMap || data.iframe_map || '')
        .execute('sp_CreateRoute');
    }

    // Handle locations (clear all and re-insert)
    await pool.request()
      .input('route_id', sql.NVarChar, routeId)
      .query('DELETE FROM RouteLocations WHERE route_id = @route_id');

    if (data.locations && Array.isArray(data.locations)) {
      for (let i = 0; i < data.locations.length; i++) {
        const locName = data.locations[i].trim();
        if (!locName) continue;
        await pool.request()
          .input('route_id', sql.NVarChar, routeId)
          .input('stop_order', sql.Int, i)
          .input('location_name', sql.NVarChar, locName)
          .query('INSERT INTO RouteLocations (route_id, stop_order, location_name) VALUES (@route_id, @stop_order, @location_name)');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in UPSERT route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a Route
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'Missing route id' }, { status: 400 });

    const pool = await getPool();
    await pool.request()
      .input('route_id', sql.NVarChar, data.id)
      .execute('sp_DeleteRoute');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
