# NHL Bracket Challenge Leaderboard

A simple web app to display live standings from your NHL Bracket Challenge league.

## Features

- 🏒 Real-time leaderboard display
- 🎯 Automatic refresh every 60 seconds
- 🏅 Medal emojis for top 3 positions
- 📱 Responsive design
- 🎨 Modern dark theme with gradient UI

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

```bash
cd "NHL Bracket Project"
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Handle cross-origin requests
- `puppeteer` - Browser automation for scraping standings

### Usage

1. **Start the backend server:**

```bash
npm start
```

You should see:
```
🏒 NHL Bracket Challenge API Server
================================
Server running on http://localhost:3000
```

2. **Open the web app:**

Open `index.html` in your web browser, or navigate to:
```
file:///C:/Users/ldael/OneDrive/Desktop/NHL%20Bracket%20Project/index.html
```

3. **View your league standings:**

The app will automatically fetch and display standings from your league (ID: 73643). The leaderboard refreshes every 60 seconds.

## Updating the League ID

To track a different league, edit `index.html` and change:

```javascript
const LEAGUE_ID = '73643';
```

Replace `73643` with your league ID from the URL.

## API Endpoints

The backend server provides the following endpoints:

### Get League Standings

```
GET /api/league/:id
```

Example:
```bash
curl http://localhost:3000/api/league/73643
```

Response:
```json
{
  "leagueId": "73643",
  "standings": [
    {
      "rank": 1,
      "name": "Realta's bracket 1",
      "points": 114
    },
    ...
  ],
  "timestamp": "2026-05-15T16:53:00.000Z",
  "count": 11
}
```

### Health Check

```
GET /health
```

## Development

For development with auto-reload:

```bash
npm run dev
```

This requires `nodemon` (installed as a dev dependency).

## How It Works

1. **Frontend** (`index.html`): 
   - Clean, responsive UI built with HTML/CSS
   - Fetches standings from the backend API
   - Auto-refreshes every 60 seconds
   - Displays rankings, names, and points

2. **Backend** (`server.js`):
   - Express server running on port 3000
   - Uses Puppeteer to scrape the NHL Bracket Challenge website
   - Caches results for 5 minutes to avoid hammering the NHL servers
   - Returns standings as JSON via REST API

## Troubleshooting

### "Failed to fetch standings" error

Make sure:
- Backend server is running (`npm start`)
- Port 3000 is not blocked by firewall
- Internet connection is stable
- League ID is correct

### Slow loading

- First load may take 10-15 seconds as Puppeteer launches a browser
- Subsequent loads use cached data (updated every 5 minutes)
- Adjust `CACHE_DURATION` in `server.js` to change cache time

### Port 3000 already in use

If port 3000 is in use, modify `server.js`:

```javascript
const PORT = 3001; // Change to another port
```

Then update `index.html`:

```javascript
const API_URL = `http://localhost:3001/api/league/${LEAGUE_ID}`;
```

## Customization

### Change auto-refresh interval

Edit `index.html` and change:

```javascript
setInterval(fetchLeaderboard, 60000); // 60 seconds
```

### Change cache duration

Edit `server.js` and change:

```javascript
const CACHE_DURATION = 5 * 60 * 1000; // Change to different time in milliseconds
```

### Styling

The app uses CSS Grid and Flexbox. Edit the `<style>` section in `index.html` to customize colors, fonts, or layout.

## License

MIT

## Support

For issues or questions, check that:
1. Backend server is running
2. League ID is correct
3. Internet connection is working
4. Port 3000 is available
