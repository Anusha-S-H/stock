# StockSense Pro - AI-Powered Stock Analysis & Trading Platform

A full-stack web application for real-time stock sentiment analysis, AI-driven predictions, and simulated trading. Built with React + TypeScript frontend and Python FastAPI backend.

## Features

✨ **AI Stock Analysis**
- Real-time sentiment analysis using FinBERT
- Latest market news headlines
- Stock price predictions with trend extrapolation
- 30-day historical price charts

💼 **Trading Dashboard**
- Buy/sell stocks with real-time price updates
- Track positions, average costs, and P&L
- Persistent order history across sessions
- Live wallet balance and equity tracking

🌓 **User Experience**
- Light/dark theme toggle
- Responsive design (mobile-friendly)
- Real-time data refresh every 30 seconds
- LocalStorage persistence for trades and positions

🔐 **Authentication**
- Supabase-powered login/signup
- Protected dashboard routes
- User profile management

---

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Vite** (build tool)
- **TanStack React Query** (data fetching)
- **Recharts** (data visualization)
- **Supabase JS** (auth)

### Backend
- **Python 3.11+**
- **FastAPI** (REST API)
- **Uvicorn** (ASGI server)
- **Transformers** (FinBERT sentiment model)
- **yfinance** (stock data)
- **News API** (market news)
- **python-dotenv** (environment config)

---

## Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.11+ (for backend)
- **npm** or **bun** (package manager)
- **News API Key** (free from https://newsapi.org)

---

## Setup & Installation

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd be
```

Install Python dependencies:
```bash
python -m pip install fastapi uvicorn[standard] transformers yfinance requests python-dotenv
```

Create a `.env` file with your News API key:
```env
NEWS_API_KEY=your_api_key_here
```

Run the backend server:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd fe
```

Install dependencies:
```bash
npm install
# or
bun install
```

Ensure `.env` has the API URL:
```env
VITE_SUPABASE_PROJECT_ID=your_supabase_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_URL=your_supabase_url
VITE_API_URL=http://localhost:8000
```

Run the dev server:
```bash
npm run dev
# or
bun run dev
```

**Expected output:**
```
Local:   http://localhost:5173/
```

Open your browser and navigate to `http://localhost:5173`

---

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Stock Sentiment Analysis
```
POST /predict
Content-Type: application/json

Request:
{
  "company": "Apple"
}

Response:
{
  "company": "Apple",
  "symbol": "AAPL",
  "price": 234.50,
  "recommendation": "BUY",
  "headlines": ["...news titles..."],
  "sentiments": [["positive", 0.95], ["neutral", 0.80]],
  "history": [{"date": "Dec 1", "price": 230.0}, ...],
  "prediction": [{"date": "Jan", "price": 240.0}, ...]
}
```

---

## Usage

### 1. Authentication
- Sign up or log in with email/password (Supabase)
- Dashboard becomes available once authenticated

### 2. Stock Analysis
- Enter a company name (e.g., "Apple", "Tesla") in the search bar
- Click "Analyze"
- View sentiment breakdown, latest news, price charts, and AI predictions

### 3. Trading
- Set a quantity and click **Buy** or **Sell**
- Orders are executed at the current market price
- Position, P&L, and wallet balance update in real-time
- Order history persists across page refreshes

### 4. Theme Toggle
- Click the sun/moon icon in the top-right header
- Switch between light and dark mode (preference saved)

---

## Project Structure

```
├── be/                          # Backend (Python/FastAPI)
│   ├── server.py               # FastAPI app with /predict endpoint
│   ├── realtime_predict.py     # Stock analysis logic
│   ├── .env                    # Environment variables (API keys)
│   └── README.md               # Backend docs
│
├── fe/                          # Frontend (React/TypeScript)
│   ├── src/
│   │   ├── pages/              # Page components (Dashboard, Login, etc.)
│   │   ├── components/         # Reusable UI components
│   │   ├── contexts/           # Auth context
│   │   ├── integrations/       # Supabase config
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   ├── .env                    # Frontend env (Supabase, API URL)
│   ├── package.json            # Dependencies
│   └── vite.config.ts          # Vite config
│
└── README.md                    # This file
```

---

## Key Features Explained

### Real-Time Stock Analysis
- Fetches latest news using News API
- Analyzes sentiment with FinBERT (financial BERT model)
- Calculates recommendation: **BUY** (positive), **SELL** (negative), **HOLD** (neutral)
- Displays sentiment distribution and latest headlines

### Trading System
- Buy/Sell orders update position immediately
- Tracks average cost per share
- Computes unrealized P&L: `(Current Price - Avg Cost) × Quantity`
- Cash balance decrements on buys, increments on sells
- Prevents over-leveraging (blocks buys if insufficient cash)

### Data Persistence
- Order history, position, cash stored in browser's localStorage
- Survives page refresh, browser restart
- Wallet balance updates in real-time

### Live Updates
- Price/sentiment updates every 30 seconds for selected company
- Charts refresh with latest data

---

## Environment Variables

### Backend (`be/.env`)
```env
NEWS_API_KEY=your_api_key_from_newsapi.org
```

### Frontend (`fe/.env`)
```env
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_URL=your_supabase_url
VITE_API_URL=http://localhost:8000
```

---

## Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'yfinance'"**
```bash
python -m pip install yfinance transformers requests python-dotenv
```

**"Missing NEWS_API_KEY in .env"**
- Get a free key from https://newsapi.org
- Add it to `be/.env`

**Port 8000 already in use**
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```
Then update `VITE_API_URL` in frontend `.env` to `http://localhost:8001`

### Frontend Issues

**"Failed to load resource: net::ERR_CONNECTION_REFUSED"**
- Backend server not running; ensure `uvicorn` is active
- Check `VITE_API_URL` in `fe/.env` matches backend address

**Theme not switching**
- Clear browser cache / localStorage
- Reload page

**Orders disappear after refresh**
- Check if localStorage is enabled in browser
- Verify no "private/incognito" mode blocking storage

---

## Future Enhancements

- [ ] Backend persistence (database for orders/portfolio)
- [ ] Paper trading portfolio metrics
- [ ] Advanced charting (candlestick, indicators)
- [ ] Portfolio backtesting
- [ ] Email notifications on sentiment changes
- [ ] Export trade history as CSV/PDF

---

## Development Notes

### Adding New Features

1. **Backend**: Add endpoints in `server.py`, logic in `realtime_predict.py`
2. **Frontend**: Add components in `src/components/`, pages in `src/pages/`
3. **Styling**: Use Tailwind CSS classes; custom styles in `src/index.css`
4. **State**: Use React hooks (useState, useEffect); persist to localStorage if needed

### Build for Production

**Frontend:**
```bash
cd fe
npm run build
npm run preview  # Test the build locally
```

**Backend:**
Deploy with `gunicorn` or Docker:
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app
```

---

## License

MIT License - feel free to use and modify for your projects.

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `.env` configuration
3. Ensure backend is running (`http://localhost:8000/health`)
4. Check browser console for JavaScript errors
5. Check terminal for backend/frontend logs

---

**Happy trading! 🚀📈**
