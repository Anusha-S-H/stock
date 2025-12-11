from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from realtime_predict import get_stock_sentiment


app = FastAPI(title="StockSense Predictor", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    company: str


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/predict")
def predict_stock(payload: PredictRequest) -> dict:
    result = get_stock_sentiment(payload.company)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
