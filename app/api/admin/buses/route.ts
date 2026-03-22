import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().execute('sp_GetAllBuses');

    const buses: Record<string, unknown> = {};
    for (const b of result.recordset) {
      buses[b.bus_id] = {
        id: b.bus_id,
        name: b.name,
        plateNumber: b.plate_number || '',
        active: b.is_active,
      };
    }

    return NextResponse.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
