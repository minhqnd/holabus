import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

// POST: Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mail, phone, sex, destination, transferPoint, confirmEmail } = body;

    if (!name || !mail || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate userId
    const userId = 'USER' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const pool = await getPool();

    await pool.request()
      .input('user_id', sql.NVarChar, userId)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, mail)
      .input('confirm_email', sql.NVarChar, confirmEmail || mail)
      .input('phone', sql.NVarChar, phone)
      .input('sex', sql.NVarChar, sex || null)
      .input('destination', sql.NVarChar, destination || null)
      .input('transfer_point', sql.NVarChar, transferPoint || null)
      .query(`INSERT INTO Users (user_id, name, email, confirm_email, phone, sex, destination, transfer_point) 
              VALUES (@user_id, @name, @email, @confirm_email, @phone, @sex, @destination, @transfer_point)`);

    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
