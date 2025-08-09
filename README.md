# Project Crypto (Inspired by CoinGecko) 
 (InProgress)

A modern, responsive cryptocurrency tracking application built with React, TypeScript, and Vite. Features real-time cryptocurrency data, interactive charts, and a sleek user interface inspired by popular crypto tracking platforms.


![current home page](/frontend/public/homepage.png)
![Coin details page](/frontend/public/coindetail.png)
![Coin education page](/frontend/public/edupage.png)

## Features

### Frontend Features
- **Real-time Crypto Data**: Live cryptocurrency prices, market caps, and 24h changes
- **Interactive Cards**: Expandable crypto cards with detailed information and charts
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Price Charts**: 7-day price history charts using Recharts
- **Market Statistics**: Top bar with global crypto market stats
- **Search Functionality**: Search bar for finding specific cryptocurrencies
- **Loading States**: Smooth loading animations and error handling

### Backend Features
- **Secure API Proxy**: Express.js backend that proxies CoinGecko API requests
- **Rate Limiting**: 100 requests per 15 minutes to prevent abuse
- **Response Caching**: 15-minute cache to improve performance and reduce API calls
- **Request Validation**: Input validation for API parameters
- **Security Headers**: Helmet.js for security best practices
- **Compression**: Gzip compression for better performance
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Recharts** - Responsive chart library
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Axios** - HTTP client for external API calls
- **Express Rate Limit** - Rate limiting middleware
- **Memory Cache** - In-memory caching solution
- **Express Validator** - Request validation
- **Helmet** - Security middleware
- **Compression** - Response compression
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Project Structure

```
project-crypto/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── CoinCard.tsx         # Individual crypto card component
│   │   ├── CryptoChart.tsx      # Chart component for top 5 coins
│   │   ├── Header.tsx           # Main header component
│   │   └── TopBar.tsx           # Top statistics bar
│   ├── types/                   # TypeScript type definitions
│   │   └── types.ts             # Crypto data interfaces
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Global styles
│   └── vite-env.d.ts           # Vite type definitions
├── backend/                     # Backend source code
│   ├── index.js                 # Express server and API routes
│   ├── package.json             # Backend dependencies
│   └── pnpm-lock.yaml          # Backend lock file
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- CoinGecko API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-crypto
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pnpm install
   # or
   npm install
   cd ..
   ```

4. **Environment Setup**

   Create a `.env` file in the `backend` directory:
   ```env
   VITE_API_KEY=your_coingecko_api_key_here
   PORT=4000
   ```

   Optionally, create a `.env` file in the root directory for frontend:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   pnpm dev
   # or
   npm run dev
   ```
   The backend will run on `http://localhost:4000`

2. **Start the frontend development server**
   ```bash
   # In the root directory
   pnpm dev
   # or
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Building for Production

1. **Build the frontend**
   ```bash
   pnpm build
   # or
   npm run build
   ```

2. **Start the backend in production**
   ```bash
   cd backend
   pnpm start
   # or
   npm start
   ```

## Configuration

### Frontend Configuration
- **Vite Config**: `vite.config.ts` - Build tool configuration
- **Tailwind Config**: `tailwind.config.js` - Custom animations and styles
- **TypeScript Config**: `tsconfig.json` - TypeScript compiler options
- **ESLint Config**: `eslint.config.js` - Code linting rules

### Backend Configuration
- **Environment Variables**: Configure API keys and ports in `.env`
- **Rate Limiting**: Modify limits in `backend/index.js`
- **Cache Duration**: Adjust cache time in the cacheMiddleware function
- **CORS Settings**: Configure allowed origins in the CORS middleware

## API Endpoints

The backend provides a proxy to the CoinGecko API:

- **GET** `/api/coingecko/*` - Proxy any CoinGecko API endpoint
  - Example: `/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`
  - Example: `/api/coingecko/coins/{id}/market_chart?vs_currency=usd&days=7`




## Security Features

- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Validates all API parameters
- **Security Headers**: Helmet.js adds security headers
- **CORS Protection**: Configurable cross-origin policies
- **Error Handling**: Secure error messages without sensitive data exposure

## Performance Optimizations

- **Response Caching**: 15-minute cache for API responses
- **Compression**: Gzip compression for all responses
- **Code Splitting**: Vite's automatic code splitting
- **Optimized Images**: Efficient image loading and caching
- **Lazy Loading**: Components load as needed

## Development

### Available Scripts

**Frontend:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

**Backend:**
- `pnpm dev` - Start with nodemon (auto-restart)
- `pnpm start` - Start production server

### Code Quality
- **TypeScript**: Full type safety across the application
- **ESLint**: Configured with React and TypeScript rules
- **Prettier**: Code formatting (configure as needed)
- **Git Hooks**: Consider adding pre-commit hooks for quality checks

## Future Enhancements

- [ ] User authentication and portfolios
- [ ] Cryptocurrency news integration
- [ ] Toast notifications
- [ ] Advanced charting with multiple timeframes
- [ ] Dark/light theme toggle
- [ ] Cryptocurrency comparison tools
- [ ] Advanced filtering and sorting options
- [ ] Favorites and watch list functionality

