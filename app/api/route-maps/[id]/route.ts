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
      .input('route_id', sql.NVarChar, id.toUpperCase())
      .query('SELECT iframe_map FROM Routes WHERE route_id = @route_id');

    if (result.recordset.length === 0 || !result.recordset[0].iframe_map) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({ iframeMap: result.recordset[0].iframe_map });
  } catch (error) {
    console.error('Error fetching route map:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
