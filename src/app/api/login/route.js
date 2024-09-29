import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export async function POST(request) {
  try {
    const body = await request.formData();
    const username = body.get('username');
    const password = body.get('password');

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const user = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });


    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}
