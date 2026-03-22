import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.tripId) return NextResponse.json({ error: 'Missing tripId' }, { status: 400 });

    const pool = await getPool();
    await pool.request()
      .input('trip_id', sql.NVarChar, data.tripId)
      .input('route_id', sql.NVarChar, data.routeId || '')
      .input('name', sql.NVarChar, data.name || '')
      .input('available_slots', sql.Int, data.slot || 0)
      .input('trip_date', sql.NVarChar, data.date || '')
      .input('departure_time', sql.NVarChar, data.time || '')
      .input('price', sql.Int, typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, ''))||0 : data.price)
      .execute('sp_CreateTrip');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.tripId) return NextResponse.json({ error: 'Missing tripId' }, { status: 400 });

    const pool = await getPool();
    await pool.request()
      .input('trip_id', sql.NVarChar, data.tripId)
      .input('route_id', sql.NVarChar, data.routeId || null)
      .input('trip_date', sql.NVarChar, data.date || null)
      .input('time', sql.NVarChar, data.time || null)
      .input('price', sql.Int, data.price ? (typeof data.price === 'string' ? parseInt(data.price.replace(/[^\d]/g, '')) : data.price) : null)
      .input('slot', sql.Int, data.slot || null)
      .input('name', sql.NVarChar, data.name || null)
      .execute('sp_UpdateTripAdmin');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const pool = await getPool();
    await pool.request()
      .input('trip_id', sql.NVarChar, data.id)
      .execute('sp_DeleteTrip');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
