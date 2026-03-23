import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, sex, destination, transferPoint } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate userId
    const userId = 'USER' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const pool = await getPool();

    await pool.request()
      .input('user_id', sql.NVarChar, userId)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('phone', sql.NVarChar, phone)
      .input('sex', sql.NVarChar, sex || null)
      .input('destination', sql.NVarChar, destination || null)
      .input('transfer_point', sql.NVarChar, transferPoint || null)
      .execute('sp_CreateUser');

    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
