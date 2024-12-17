import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors()); // Allow all origins
app.use(express.json());

const API_KEY = 'e03da45e-48c5-4fce-a4db-88fb42365f37';
const API_URL = 'https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=20&symbol=TENSORIANS';

// Proxy endpoint
app.get('/api/collections', async (req, res) => {
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
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
