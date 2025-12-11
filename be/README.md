# Backend Startup Guide

## 1. Get NEWS API Key
- Go to https://newsapi.org
- Sign up for a free account
- Copy your API key
- Paste it in `be/.env` as `NEWS_API_KEY=your_key_here`

## 2. Start Backend Server
From the `be/` directory, run:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 3. Test Endpoint
In another terminal:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d "{\"company\": \"Apple\"}"
```

## 4. Frontend Connection
Frontend is already configured to connect to `http://localhost:8000` (see `fe/.env`).

When you search for a company in the dashboard, it will:
1. Send request to `POST /predict`
2. Backend fetches stock data, news, and sentiment analysis
3. Return results to frontend
4. Display sentiments, headlines, and recommendations

## 5. Troubleshooting

**Issue**: "Import could not be resolved" in VS Code
- Solution: Select the correct Python interpreter (Ctrl+Shift+P → "Python: Select Interpreter" → pick python3.11.exe)

**Issue**: "Missing NEWS_API_KEY" error
- Solution: Make sure `.env` is in `be/` folder with valid API key

**Issue**: CORS errors
- Solution: Backend has CORS enabled for all origins (`allow_origins=["*"]`)

**Issue**: Frontend still shows mock data
- Solution: Check browser console for fetch errors, verify backend is running on port 8000
