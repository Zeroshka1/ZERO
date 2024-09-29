import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

export async function GET(req) {
    const url = new URL(req.url);
    const query = url.searchParams.get('query'); 

    try {
        let baseQuery = `
            SELECT 
                id, 
                name, 
                description, 
                size, 
                price, 
                currency, 
                image_url 
            FROM artworks
        `;

        const params = [];
        
        if (query) {

            baseQuery += `
                WHERE (name ILIKE $1)
            `;
            params.push(`%${query}%`);
        }

        const result = await pool.query(baseQuery, params);

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        console.error('Ошибка поиска NFT:', error);
        return new Response(JSON.stringify({ error: 'Ошибка получения данных' }), { status: 500 });
    }
}
