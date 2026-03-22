import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const pool = await getPool();
    await pool.request()
      .input('user_id', sql.NVarChar, data.userId)
      .input('name', sql.NVarChar, data.name || null)
      .input('email', sql.NVarChar, data.email || null)
      .input('phone', sql.NVarChar, data.phone || data.phoneNumber || null)
      .execute('sp_UpdateUserAdmin');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const pool = await getPool();
    // Raw query since we don't have a specific sp_DeleteUser and it's a rare op
    await pool.request()
        .input('user_id', sql.NVarChar, data.id)
        .query('DELETE FROM Bookings WHERE user_id = @user_id; DELETE FROM Users WHERE user_id = @user_id');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
