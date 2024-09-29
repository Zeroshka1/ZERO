import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import cloudinary from 'cloudinary';
import crypto from 'crypto';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export async function POST(req) {
    try {
        const { name, description, size, price, currency, image } = await req.json();

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header missing.' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        if (!name || !description || !size || !price || !currency || !image || !userId) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }


        const query = 'SELECT * FROM artworks WHERE name = $1 OR image_url = $2';
        const existingArt = await pool.query(query, [name, image]);

        if (existingArt.rows.length > 0) {
            return NextResponse.json({ error: 'The name is already taken.' }, { status: 400 });
        }

        const uploadResponse = await cloudinary.v2.uploader.upload(image, {
            folder: 'artworks',
        });

        const imageUrl = uploadResponse.secure_url;

        await pool.query(
            'INSERT INTO artworks (name, description, size, price, currency, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [name, description, size, price, currency, imageUrl, userId]
        );

        return NextResponse.json({ message: 'The data has been successfully added!', imageUrl });
    } catch (error) {
        console.error('Insertion error in the database:', error);
        return NextResponse.json({ error: 'Insertion error in the database' }, { status: 500 });
    }
}

