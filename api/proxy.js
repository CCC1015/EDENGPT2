import fetch from 'node-fetch';

const API_KEY = 'e03da45e-48c5-4fce-a4db-88fb42365f37';
const API_URL = 'https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=20&symbol=TENSORIANS';

export default async function handler(req, res) {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch from Magic Eden API' });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
