from datetime import date

import mlflow
import numpy as np
import pandas as pd
from fastapi.encoders import jsonable_encoder
from mlflow import MlflowClient

from utils.mognodb_connector import get_database

models_temperature = {
    "Maribor": None,
    "Ljubljana": None,
    "Kranj": None,
    "Koper": None,
    "Celje": None,
    "Novo_Mesto": None,
    "Ptuj": None,
    "Murska_Sobota": None
}

models_precipitation = {
    "Maribor": None,
    "Ljubljana": None,
    "Kranj": None,
    "Koper": None,
    "Celje": None,
    "Novo_Mesto": None,
    "Ptuj": None,
    "Murska_Sobota": None
}


def load_model_production(city, attribute):
    mlflow.set_tracking_uri("https://dagshub.com/KiwiBrezo/slovenia-weather-forecast-inteligent-system.mlflow")

    model_name = "weather_forecast_model_" + city + "_" + attribute
    print("     -> Started loading model:", model_name)

    client = MlflowClient()
    run_id = client.get_latest_versions(model_name, stages=['production'])[0].run_id
    loaded_model = mlflow.pyfunc.load_model(f'runs:/{run_id}/sklearn-model')

    print("     -> Done loading model:", model_name)

    return loaded_model


def get_precipitation_for_city(city, data):
    global models_precipitation

    if models_precipitation[city] is None:
        print("     -> No model is loaded, need to load model...")
        models_precipitation[city] = load_model_production(city, "precipitation")

    df = pd.DataFrame(jsonable_encoder(data))

    df_database = pd.DataFrame()
    df_database["time"] = df["time"]
    df_database["city"] = city

    df = df.drop("time", axis=1)

    print("-> Predicting precipitation for:", city)
    predictions = models_precipitation[city].predict(np.array(df))

    df_database["precipitation"] = predictions.tolist()
    json = df_database.to_dict(orient='records')

    get_database()["precipitation_predictions"].insert_many(json)

    return predictions


def get_temperature_for_city(city, data):
    global models_temperature

    if models_temperature[city] is None:
        print("     -> No model is loaded, need to load model...")
        models_temperature[city] = load_model_production(city, "temperature_2m")

    df = pd.DataFrame(jsonable_encoder(data))

    df_database = pd.DataFrame()
    df_database["time"] = df["time"]
    df_database["city"] = city

    df = df.drop("time", axis=1)

    print("-> Predicting temperature for:", city)
    predictions = models_temperature[city].predict(np.array(df))

    df_database["temperature_2m"] = predictions.tolist()
    json = df_database.to_dict(orient='records')

    get_database()["temperature_predictions"].insert_many(json)

    return predictions
