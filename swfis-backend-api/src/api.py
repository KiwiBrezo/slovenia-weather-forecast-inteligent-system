from typing import Union, List

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from src.predict_weather import get_participation_for_city, get_temperature_for_city

app = FastAPI()


class WeatherData(BaseModel):
    datum_do: str
    temperature: float
    relativehumidity: float
    dewpoint: float
    surface_pressure: float
    cloudcover: float
    windspeed: float
    winddirection: float
    pm25: int


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
        "response": "This is the SWFIS API. You can check the weather for: Maribor, Celje, Ljubljana, Kranj, Novo Mesto, ..."
    }


@app.get("/ping")
def ping_check():
    return {"response": "pong"}


@app.post("/api/predict/temperature/{city}")
async def predict_temperature(city: str, data: List[WeatherData]):
    pred = np.asarray(np.array(get_temperature_for_city(city, data)), dtype='int')
    return {"prediction": pred.tolist()}

    return {"prediction": data}


@app.post("/api/predict/participation/{city}")
async def predict_participation(city: str, data: List[WeatherData]):
    pred = np.asarray(np.array(get_participation_for_city(city, data)), dtype='int')
    return {"prediction": pred.tolist()}

    return {"prediction": data}
