import os
from typing import Dict, List, Optional, Tuple

import requests
import yfinance as yf
from dotenv import load_dotenv
from transformers import pipeline

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

if not NEWS_API_KEY:
    raise ValueError("Missing NEWS_API_KEY in .env")

# Load once so repeated requests do not reload the model.
print("Loading FinBERT model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")

def get_company_symbol(company_name: str) -> Optional[str]:
    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={company_name}"
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        data = response.json()
        if "quotes" in data and len(data["quotes"]) > 0:
            return data["quotes"][0]["symbol"]
        return None
    except Exception as e:
        print(f"Error fetching symbol: {e}")
        return None

def get_latest_headlines(company: str) -> List[str]:
    try:
        url = f"https://newsapi.org/v2/everything?q={company}&sortBy=publishedAt&language=en&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        if "articles" in data and len(data["articles"]) > 0:
            return [a["title"] for a in data["articles"][:5]]
        return []
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def analyze_sentiment(headlines: List[str]) -> List[Tuple[str, float]]:
    sentiments: List[Tuple[str, float]] = []
    for text in headlines:
        result = sentiment_pipeline(text)[0]
        label = result["label"].lower()
        score = result["score"]
        sentiments.append((label, score))
    return sentiments

def get_stock_price(symbol: str) -> Optional[float]:
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period="1d")
        if not data.empty:
            return round(data["Close"].iloc[-1], 2)
        return None
    except Exception as e:
        print(f"Error fetching price: {e}")
        return None

def get_recommendation(sentiments: List[Tuple[str, float]]) -> str:
    if not sentiments:
        return "HOLD"
    weighted_score = 0
    total_weight = 0
    for label, score in sentiments:
        if label == "positive":
            weighted_score += score
        elif label == "negative":
            weighted_score -= score
        total_weight += score
    avg_score = weighted_score / (total_weight if total_weight else 1)
    if avg_score > 0.1:
        return "BUY"
    elif avg_score < -0.1:
        return "SELL"
    return "HOLD"

def get_stock_history(symbol: str) -> List[Dict[str, object]]:
    """Fetch 30-day historical stock data."""
    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period="30d")
        if data.empty:
            return []
        return [
            {"date": str(date.strftime("%b %d")), "price": round(float(price), 2)}
            for date, price in zip(data.index, data["Close"])
        ]
    except Exception as e:
        print(f"Error fetching history: {e}")
        return []

def get_stock_prediction(symbol: str) -> List[Dict[str, object]]:
    """Generate AI price prediction with realistic fluctuations using recent volatility."""
    try:
        import math
        import random

        stock = yf.Ticker(symbol)
        data = stock.history(period="30d")
        if data.empty:
            return []

        last_price = float(data["Close"].iloc[-1])
        prices = data["Close"].astype(float).tolist()
        # Compute daily returns and volatility
        returns = [(prices[i] - prices[i-1]) / prices[i-1] for i in range(1, len(prices))]
        avg_return = sum(returns) / len(returns) if returns else 0.001
        vol = (sum((r - avg_return) ** 2 for r in returns) / len(returns)) ** 0.5 if returns else 0.01

        # Future points (6 months)
        future_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        pred = []
        price = last_price
        for m in future_labels:
            # random shock scaled by volatility - increased multiplier for more variation
            shock = random.gauss(0, vol * 1.5)
            drift = avg_return * 0.5
            price = price * (1 + drift + shock)
            # prevent negative or unrealistic price
            price = max(0.01, price)
            pred.append({"date": m, "price": round(price, 2)})

        return pred
    except Exception as e:
        print(f"Error generating prediction: {e}")
        return []

def get_stock_sentiment(company_name: str) -> Dict[str, object]:
    symbol = get_company_symbol(company_name)
    if not symbol:
        return {"error": f"Could not find stock for '{company_name}'."}
    headlines = get_latest_headlines(company_name)
    if not headlines:
        return {"error": f"No recent news found for {company_name}."}
    sentiments = analyze_sentiment(headlines)
    latest_price = get_stock_price(symbol)
    recommendation = get_recommendation(sentiments)
    history = get_stock_history(symbol)
    prediction = get_stock_prediction(symbol)
    
    return {
        "company": company_name,
        "symbol": symbol,
        "headlines": headlines,
        "sentiments": sentiments,
        "price": latest_price,
        "recommendation": recommendation,
        "history": history,
        "prediction": prediction,
    }

if __name__ == "__main__":
    company = input("Enter any company name: ").strip()
    result = get_stock_sentiment(company)
    print(result)