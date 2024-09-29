import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const result = await pool.query(`
            SELECT 
                a.id, 
                a.name, 
                a.description, 
                a.size, 
                a.price, 
                a.currency, 
                a.image_url,
                u.id AS userid,
                u.username AS creator_username,  -- Извлечение имени создателя
                u.profile_image_url AS creator_profile_image_url  -- Извлечение URL изображения профиля
            FROM artworks AS a
            JOIN users AS u ON a.user_id = u.id  
            WHERE a.id = $1
        `, [id]);
        


        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'NFT not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } catch (error) {
        console.error('Ошибка получения NFT:', error);
        return new Response(JSON.stringify({ error: 'Ошибка получения данных' }), { status: 500 });
    }
}
