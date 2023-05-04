import os
import urllib.request
from datetime import date, timedelta

file_location = os.path.dirname(__file__)

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
    "Maribor"
    "Ljubljana"
    "Kranj"
    "Koper"
    "Celje"
    "Novo_Mesto"
    "Ptuj"
    "Murska Sobota"
]

url_atributes = "&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,pressure_msl," \
                "surface_pressure,precipitation,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high," \
                "windspeed_10m,winddirection_10m&timezone=Europe%2FBerlin"


def get_data_for_city():
    date_today_string = date.today().strftime("%b-%d-%Y")
    end_date = date.today() - timedelta(weeks=2)
    start_date = end_date - timedelta(weeks=52)

    end_date_string = end_date.strftime("%Y-%m-%d")
    start_date_string = start_date.strftime("%Y-%m-%d")

    for i in range(len(city_names)):
        url = "https://archive-api.open-meteo.com/v1/archive?latitude=" + str(city_coordinates[i][0]) + "&longitude=" + str(city_coordinates[i][1]) + "&start_date=" + start_date_string + "&end_date=" + end_date_string + url_atributes
        print("     -> Downloading data for url: ", url)

        with urllib.request.urlopen(url) as response:
            raw_data_filename = os.path.join(file_location, "../data/raw/" + city_names[i] + "_" + date_today_string + ".json")
            raw_file = open(raw_data_filename, "wb+")

            print("     -> Done download, saving to file...")

            raw_file.write(response.read())
            raw_file.close()

            print("     -> Done saving to file")


if __name__ == "__main__":
    get_data_for_city()
