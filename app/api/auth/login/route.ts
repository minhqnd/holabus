import { NextRequest, NextResponse } from 'next/server';
import { getPool, sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Admins WHERE email = @email AND password_hash = @password');

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      email: result.recordset[0].email 
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
