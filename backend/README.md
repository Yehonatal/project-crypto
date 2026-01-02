# Backend Setup

## Environment Variables

Create a `.env` file in this directory with the following variables:

```env
# CoinGecko API Configuration
VITE_API_KEY=your_coingecko_api_key_here

# Server Configuration
PORT=4000
NODE_ENV=development
```

## Getting a CoinGecko API Key

1. Visit [CoinGecko API Pricing](https://www.coingecko.com/en/api/pricing)
2. Sign up for a free account
3. Get your API key from the dashboard

### Free Tier Limits:
- 30 calls/minute
- 10,000 calls/month  
- Access to all public endpoints

## Development

The backend runs with nodemon for hot reloading during development.

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start production server
pnpm start
```
