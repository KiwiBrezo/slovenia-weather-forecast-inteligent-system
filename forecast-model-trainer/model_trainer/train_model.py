import math
import os
from pprint import pprint

import mlflow
import numpy as np
import pandas as pd
from mlflow import MlflowClient
from sklearn import metrics
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline

file_location = os.path.dirname(__file__)

atributes = "temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,pressure_msl," \
            "surface_pressure,precipitation,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high," \
            "windspeed_10m,winddirection_10m"

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

best_params = None


def prepare_data(city, y_atribute):
    print("--- Starting preparing data ---")

    train_csv_filename = os.path.join(file_location, "../data/processed/city/final/" + city + "/train_data.csv")
    test_csv_filename = os.path.join(file_location, "../data/processed/city/final/" + city + "/test_data.csv")
    df_train = pd.read_csv(train_csv_filename)
    df_test = pd.read_csv(test_csv_filename)

    print("     -> Number of rows in train dataset: ", len(df_train.index))
    print("     -> Number of rows in test dataset: ", len(df_test.index))

    print("     -> Number of rows after dropping Nan rows in train dataset: ", len(df_train.index))
    print("     -> Number of rows after dropping Nan rows in test dataset: ", len(df_test.index))

    df_train_x = df_train[atributes.split(",")]
    df_train_x = df_train_x.drop(y_atribute, axis=1)

    df_train_y = df_train[y_atribute]

    df_test_x = df_test[atributes.split(",")]
    df_test_x = df_test_x.drop(y_atribute, axis=1)

    df_test_y = df_test[y_atribute]

    print("     -> Done preparing data")

    return df_train_x, df_test_x, df_train_y, df_test_y


def train_model(city, y_atribute, x_train, x_test, y_train, y_test):
    global best_params
    print("--- Starting training model ---")

    x_train = np.array(x_train)
    x_test = np.array(x_test)
    y_train = np.array(y_train)
    y_test = np.array(y_test)

    if best_params is None:
        print("     -> There are no best params, started grid searching for them...")
        best_params = get_best_params(x_train, y_train)

    print("     -> Loaded best params for model training")

    train_pipe = Pipeline([
        ('imputer', SimpleImputer()),
        ('regressor', RandomForestRegressor())
    ])

    print("     -> Start training model for", city, "(", y_atribute, ")")

    with mlflow.start_run(run_name="Train model pipeline") as run:
        train_pipe.set_params(**best_params)

        train_pipe.fit(x_train, y_train)

        predictions = train_pipe.predict(x_test)

        mae = metrics.mean_absolute_error(y_test, predictions)
        mse = metrics.mean_squared_error(y_test, predictions)
        rmse = np.sqrt(metrics.mean_squared_error(y_test, predictions))

        print('(', city, ')Mean Absolute Error (MAE):', mae)
        print('(', city, ')Mean Squared Error (MSE):', mse)
        print('(', city, ')Root Mean Squared Error (RMSE):', rmse)

        mape = np.mean(np.abs((y_test - predictions) / np.abs(predictions)))
        acc = -1

        if math.isnan(mape) is False:
            acc = round(100 * (1 - mape), 2)
            print('(', city, ')Mean Absolute Percentage Error (MAPE):', round(mape * 100, 2))
            print('(', city, ')Accuracy:', acc)
        else:
            mape = -1

        mlflow.log_params(best_params)
        mlflow.log_metrics({"mae": mae, "mse": mse, "rmse": rmse, "mape": mape, "acc": acc})
        mlflow.sklearn.log_model(train_pipe, artifact_path="sklearn-model",
                                 registered_model_name="weather_forecast_model_" + city + "_" + y_atribute)

    print("     -> Done training model for ", city, "(", y_atribute, ")")


def get_best_params(x_train, y_train):
    print("--- Getting best params with GridSearch ---")

    pipe = Pipeline([
        ('imputer', SimpleImputer()),
        ('regressor', RandomForestRegressor())
    ])

    param_grid = {
        'regressor__n_estimators': [10, 20, 50, 100, 200],
        'regressor__max_features': ['sqrt', 'log2'],
        'regressor__max_depth': [3, 5, 10, 20, 40],
        'regressor__min_samples_split': [2, 5, 10, 20],
        'regressor__min_samples_leaf': [1, 2, 4, 8, 16],
    }

    grid_search = GridSearchCV(pipe, param_grid=param_grid, cv=5)
    grid_search.fit(x_train, y_train)

    print("     -> Done searching for params")

    return grid_search.best_params_


def compare_latest_model_with_production(city, y_atribute):
    print("--- Checking if latest model is better than production model ---")

    model_name = "weather_forecast_model_" + city + "_" + y_atribute
    client = MlflowClient()
    latest_metrics = {}
    production_metrics = {}
    production_version = -1
    latest_version = -1

    for model in client.search_model_versions("name='" + model_name + "'"):
        pprint(dict(model), indent=4)
        if int(model.version) > latest_version and model.current_stage == "None":
            latest_version = int(model.version)
            latest_metrics = client.get_metric_history(model.run_id, "mse")
        if int(model.version) > production_version and model.current_stage == "Production":
            production_version = int(model.version)
            production_metrics = client.get_metric_history(model.run_id, "mse")

    if production_version == -1 or latest_version == -1:
        return

    print("     -> Latest model accuracy:", latest_metrics[0].value)
    print("     -> Production model accuracy:", production_metrics[0].value)

    if latest_metrics[0].value < production_metrics[0].value:
        client.transition_model_version_stage(
            name=model_name,
            version=latest_version,
            stage="Production"
        )

        client.transition_model_version_stage(
            name=model_name,
            version=production_version,
            stage="Archived"
        )

    print("     -> Done checking results")


def main():
    for i in range(len(city_names)):
        (x_train, x_test, y_train, y_test) = prepare_data(city_names[i], "temperature_2m")
        train_model(city_names[i], "temperature_2m", x_train, x_test, y_train, y_test)

        (x_train, x_test, y_train, y_test) = prepare_data(city_names[i], "precipitation")
        train_model(city_names[i], "precipitation", x_train, x_test, y_train, y_test)

        compare_latest_model_with_production(city_names[i], "temperature_2m")
        compare_latest_model_with_production(city_names[i], "precipitation")


if __name__ == "__main__":
    mlflow.set_tracking_uri("https://dagshub.com/KiwiBrezo/slovenia-weather-forecast-inteligent-system.mlflow")
    mlflow.set_experiment(experiment_name="Train city models")
    main()
