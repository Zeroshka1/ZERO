import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  console.log('GET /api/profile called');

  try {

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);


    if (!token || token.split('.').length !== 3) {
      console.log('Invalid token format');
      return NextResponse.json({ error: 'Invalid token format.' }, { status: 401 });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
    }

    const userId = decoded.userId;
    console.log('Decoded userId:', userId);


    if (!Number.isInteger(userId)) {
      console.log('Invalid userId:', userId);
      return NextResponse.json({ error: 'Invalid userId format.' }, { status: 400 });
    }


    const userQuery = await pool.query('SELECT username, email, profile_image_url FROM Users WHERE id = $1', [userId]);


    if (userQuery.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const user = userQuery.rows[0];


    const nftQuery = await pool.query(`
      SELECT id, name, description, size, price, currency, image_url 
      FROM artworks
      WHERE user_id = $1
    `, [userId]);

    const nfts = nftQuery.rows;


    return NextResponse.json({ ...user, nfts }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
  }
}


