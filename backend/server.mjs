import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.get('/proxy/launchpad-collections', async (req, res) => {
    const apiUrl = 'https://api-mainnet.magiceden.dev/v2/launchpad/collections';
    const apiKey = 'e03da45e-48c5-4fce-a4db-88fb42365f37';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            return res.status(response.status).send('Error fetching data from Magic Eden API.');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
