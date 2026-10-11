const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Cache for standings (refresh every 5 minutes)
let standingsCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch standings from NHL Bracket Challenge website
 */
async function fetchStandings(leagueId) {
    // Return cached data if fresh
    if (standingsCache && (Date.now() - cacheTime) < CACHE_DURATION) {
        return standingsCache;
    }

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Navigate to the league page
        await page.goto(`https://bracketchallenge.nhl.com/en/leagues/${leagueId}`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the table to load
        await page.waitForSelector('table', { timeout: 10000 });

        // Extract standings data
        const standings = await page.evaluate(() => {
            const rows = document.querySelectorAll('table tbody tr');
            const data = [];

            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 5) {
                    const rank = cells[0].textContent.trim();
                    const name = cells[1].textContent.trim();
                    const points = cells[4].textContent.trim();

                    data.push({
                        rank: parseInt(rank) || index + 1,
                        name: name,
                        points: parseInt(points) || 0
                    });
                }
            });

            return data;
        });

        await browser.close();

        // Sort by points descending
        standings.sort((a, b) => b.points - a.points);

        // Update ranks based on sorted order
        standings.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // Cache the results
        standingsCache = standings;
        cacheTime = Date.now();

        return standings;
    } catch (error) {
        console.error('Error fetching standings:', error);
        throw error;
    }
}

/**
 * API endpoint to get league standings
 */
app.get('/api/league/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate league ID
        if (!id || !/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'Invalid league ID' });
        }

        console.log(`Fetching standings for league ${id}...`);
        const standings = await fetchStandings(id);

        res.json({
            leagueId: id,
            standings: standings,
            timestamp: new Date().toISOString(),
            count: standings.length
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            error: 'Failed to fetch standings',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
    console.log(`\n🏒 NHL Bracket Challenge API Server`);
    console.log(`================================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  GET /api/league/:id  - Get league standings`);
    console.log(`  GET /health          - Health check`);
    console.log(`\nExample:`);
    console.log(`  curl http://localhost:${PORT}/api/league/73643\n`);
});
