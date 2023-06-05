from typing import List

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from src.predict_weather import get_precipitation_for_city, get_temperature_for_city
from utils.mognodb_connector import get_database

app = FastAPI()


class TemperatureData(BaseModel):
    time: str
    relativehumidity_2m: int
    dewpoint_2m: float
    apparent_temperature: float
    pressure_msl: float
    surface_pressure: float
    precipitation: float
    weathercode: int
    cloudcover: int
    cloudcover_low: int
    cloudcover_mid: int
    cloudcover_high: int
    windspeed_10m: float
    winddirection_10m: int


class PrecipitationData(BaseModel):
    time: str
    temperature_2m: float
    relativehumidity_2m: int
    dewpoint_2m: float
    apparent_temperature: float
    pressure_msl: float
    surface_pressure: float
    weathercode: int
    cloudcover: int
    cloudcover_low: int
    cloudcover_mid: int
    cloudcover_high: int
    windspeed_10m: float
    winddirection_10m: int


city_names = [
    "Maribor",
    "Ljubljana",
    "Kranj",
    "Koper",
    "Celje",
    "Novo_Mesto",
    "Ptuj",
    "Murska_Sobota"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "response": "This is the SWFIS API. You can check the weather for: Maribor, Ljubljana, Kranj, Koper, Celje, "
                    "Novo_Mesto, Ptuj, Murska_Sobota"
    }


@app.get("/ping")
def ping_check():
    return {"response": "pong"}


@app.get("/city-list")
async def get_city_list():
    return city_names


@app.get("/api/training/metrics")
async def get_training_metrics():
    return {"metrics": list(get_database()["train_metrics"].find({}, {'_id': 0}))}


@app.post("/api/predict/temperature/{city}")
async def predict_temperature(city: str, data: List[TemperatureData]):
    if city not in city_names:
        return {"error": "Invalid city"}

    pred = np.asarray(np.array(get_temperature_for_city(city, data)), dtype='float')
    return {"prediction": pred.tolist()}


@app.post("/api/predict/precipitation/{city}")
async def predict_participation(city: str, data: List[PrecipitationData]):
    if city not in city_names:
        return {"error": "Invalid city"}

    pred = np.asarray(np.array(get_precipitation_for_city(city, data)), dtype='float')
    return {"prediction": pred.tolist()}
