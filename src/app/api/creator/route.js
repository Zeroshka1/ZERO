import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export async function GET(request) {
    console.log('GET /api/creator called');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !Number.isInteger(parseInt(userId))) {
        return NextResponse.json({ error: 'Invalid userId format.' }, { status: 400 });
    }

    try {

        const creatorQuery = await pool.query(
            'SELECT username, profile_image_url FROM Users WHERE id = $1',
            [userId]
        );

        if (creatorQuery.rows.length === 0) {
            return NextResponse.json({ error: 'Creator not found.' }, { status: 404 });
        }

        const creator = creatorQuery.rows[0];


        const nftQuery = await pool.query(
            'SELECT id, name, image_url, price, currency FROM artworks WHERE user_id = $1',
            [userId]
        );

        const nfts = nftQuery.rows;


        return NextResponse.json({ ...creator, nfts }, { status: 200 });

    } catch (error) {
        console.error('Error fetching creator data:', error);
        return NextResponse.json({ error: 'An error occurred. Please try again later.' }, { status: 500 });
    }
}
