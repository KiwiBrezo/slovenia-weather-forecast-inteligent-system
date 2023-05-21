import mlflow
import numpy as np
import pandas as pd
from fastapi.encoders import jsonable_encoder
from mlflow import MlflowClient

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

    # x = np.array(df[["temperature", "relativehumidity", "dewpoint", "surface_pressure", "cloudcover", "windspeed",
    #                 "winddirection", "pm25"]])

    print("-> Predicting precipitation for:", city)
    predictions = models_precipitation[city].predict(np.array(df))

    # df["temperature_2m"] = predictions.tolist()
    # json = df.to_dict(orient='records')

    return predictions


def get_temperature_for_city(city, data):
    global models_temperature

    if models_temperature[city] is None:
        print("     -> No model is loaded, need to load model...")
        models_temperature[city] = load_model_production(city, "temperature_2m")

    df = pd.DataFrame(jsonable_encoder(data))

    #x = np.array(df[["temperature", "relativehumidity", "dewpoint", "surface_pressure", "cloudcover", "windspeed",
    #                 "winddirection", "pm25"]])

    print("-> Predicting temperature for:", city)
    predictions = models_temperature[city].predict(np.array(df))

    #df["temperature_2m"] = predictions.tolist()
    #json = df.to_dict(orient='records')

    return predictions
