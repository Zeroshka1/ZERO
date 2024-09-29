import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.LOGIN_MAIL,
    pass: process.env.PASSWORD_MAIL,
  },
});

export async function POST(request) {
  const { buyerEmail, nftData } = await request.json();

  const isSuccess = Math.random() > 0.5;

  if (isSuccess) {
    const mailOptions = {
      from: process.env.LOGIN_MAIL,
      to: buyerEmail,
      subject: 'NFT Purchase Successful',
      html: `
        <h1>Congratulations on your purchase!</h1>
        <p>You have successfully purchased the following NFT:</p>
        <ul>
          <li><strong>Name:</strong> ${nftData.name}</li>
          <li><strong>Description:</strong> ${nftData.description}</li>
          <li><strong>Price:</strong> ${nftData.price} ${nftData.currency}</li>
          <li><strong>Size:</strong> ${nftData.size} x ${nftData.size}</li>
        </ul>
        <p>Creator: ${nftData.creator_username}</p>
        <p><strong>Your NFT:</strong></p>
        <img src="${nftData.image_url}" alt="NFT Image" style="width: 300px; height: auto;" />
      `,
    };

    // Удаление NFT из базы данных
    try {
      await pool.query('DELETE FROM artworks WHERE id = $1', [nftData.id]); // Замените на соответствующее имя таблицы и поле id
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ status: 'success', message: 'Payment completed successfully and email sent!' });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ status: 'failed', message: 'Payment successful, but NFT removal failed.' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ status: 'failed', message: 'An error occurred during the payment process.' }, { status: 400 });
  }
}
