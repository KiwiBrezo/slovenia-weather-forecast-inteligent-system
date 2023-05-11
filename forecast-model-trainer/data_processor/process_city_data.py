import json
import os
from datetime import date

import pandas as pd

file_location = os.path.dirname(__file__)

attributes_string = "temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,pressure_msl," \
                    "surface_pressure,precipitation,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high," \
                    "windspeed_10m,winddirection_10m"

city_coordinates = [
    (46.55, 15.65),  # Maribor
    (46.05, 14.51),  # Ljubljana
    (46.24, 14.36),  # Kranj
    (45.55, 13.73),  # Koper
    (46.23, 15.26),  # Celje
    (45.80, 15.17),  # Novo Mesto
    (46.42, 15.87),  # Ptuj
    (46.66, 16.17),  # Murska Sobota
]

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


def convert_city_data_to_csv():
    date_today_string = date.today().strftime("%b-%d-%Y")
    attributes = attributes_string.split(",")

    for i in range(len(city_names)):
        raw_data_filename = os.path.join(file_location, "../data/raw/city/" + city_names[i] + "/" + city_names[
            i] + "_" + date_today_string + ".json")
        csv_filename = os.path.join(file_location, "../data/processed/city/current/processed_" + city_names[
            i] + "_" + date_today_string + ".csv")

        raw_file = open(raw_data_filename, "r+")
        data = json.load(raw_file)

        df = pd.DataFrame(columns=attributes)

        for j in range(len(attributes)):
            df[attributes[j]] = data["hourly"][attributes[j]]

        df.to_csv(csv_filename, index=False, header=True)

        print("     -> Done processing for ", city_names[i])


if __name__ == "__main__":
    convert_city_data_to_csv()
