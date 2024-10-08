import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT users.id, users.username, users.profile_image_url, json_agg(artworks.*) as collections
            FROM users
            JOIN artworks ON artworks.user_id = users.id
            GROUP BY users.id, users.profile_image_url
            HAVING COUNT(artworks.*) > 0;
        `);
        
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error(' Error receiving collections:', error);
        return NextResponse.json({ error: 'Error receiving collections' }, { status: 500 });
    }
}
