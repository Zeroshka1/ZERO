import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import cloudinary from 'cloudinary';
import { Readable } from 'stream'; 
import jwt from 'jsonwebtoken'; 

const SALT_ROUNDS = 10;


const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export async function POST(request) {
  const formData = await request.formData();
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const profileImage = formData.get('profileImage'); 

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM Users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ 
        error: 'A user with that name or email already exists.' 
      }, { status: 400 });
    }


    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let profileImageUrl = '';
    if (profileImage && typeof profileImage === 'object') {

      const arrayBuffer = await profileImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);


      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: 'user_profiles' }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream); 
      });

      profileImageUrl = uploadResult.secure_url;
    }


    const result = await pool.query(
      'INSERT INTO Users (username, email, password_hash, profile_image_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, hashedPassword, profileImageUrl]
    );

    const userId = result.rows[0].id;


    const token = generateToken(userId);

    return NextResponse.json({ message: 'The user has been successfully registered.', token }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

