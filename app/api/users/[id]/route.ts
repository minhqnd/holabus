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
      .input('user_id', sql.NVarChar, id)
      .query('SELECT * FROM Users WHERE user_id = @user_id');

    if (result.recordset.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const u = result.recordset[0];
    return NextResponse.json({
      name: u.name,
      mail: u.email,
      confirmEmail: u.confirm_email,
      phone: u.phone,
      sex: u.sex,
      destination: u.destination,
      transferPoint: u.transfer_point,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
