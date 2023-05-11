import os
from datetime import date

import pandas as pd

file_location = os.path.dirname(__file__)

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


def copy_current_data_to_reference():
    date_today_string = date.today().strftime("%b-%d-%Y")

    for i in range(len(city_names)):
        csv_filename = os.path.join(file_location, "../data/processed/city/current/processed_" + city_names[
            i] + "_" + date_today_string + ".csv")

        df = pd.read_csv(csv_filename)

        csv_filename_output = os.path.join(file_location, "../data/processed/city/reference/processed_" + city_names[
            i] + ".csv")

        df.to_csv(csv_filename_output, index=False, header=True)

        print("     -> Done coping data for", city_names[i])


def split_data_to_train_test():
    for i in range(len(city_names)):
        csv_filename = os.path.join(file_location, "../data/processed/city/reference/processed_" + city_names[
            i] + ".csv")

        csv_filename_output_train = os.path.join(file_location,
                                                 "../data/processed/city/final/" + city_names[i] + "/train_data.csv")
        csv_filename_output_test = os.path.join(file_location,
                                                "../data/processed/city/final/" + city_names[i] + "/test_data.csv")

        df = pd.read_csv(csv_filename)

        n = int(len(df) * 0.3)

        df_test = df.tail(n)
        df_train = df.iloc[:-n]

        print("     -> Thera are", len(df_train), "in train dataset and", len(df_test), "in the test dataset for:",
              city_names[i])

        df_train.to_csv(csv_filename_output_train, index=False, header=True)
        df_test.to_csv(csv_filename_output_test, index=False, header=True)

        print("     -> Done splitting data for", city_names[i])


if __name__ == "__main__":
    copy_current_data_to_reference()
    split_data_to_train_test()
