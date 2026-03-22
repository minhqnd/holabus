import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPool();

    const routeResult = await pool.request()
      .input('route_id', sql.NVarChar, id)
      .execute('sp_GetRouteMap');

    if (routeResult.recordset.length === 0 || !routeResult.recordset[0].iframe_map) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({ iframeMap: routeResult.recordset[0].iframe_map });
  } catch (error) {
    console.error('Error fetching route map:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
