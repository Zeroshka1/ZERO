import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
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
