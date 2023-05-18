import os
from datetime import date

import pandas as pd

from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

from evidently.test_suite import TestSuite
from evidently.tests import *

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


def quality_check():
    print("--- Started check on data quality ---")

    date_today_string = date.today().strftime("%b-%d-%Y")

    for i in range(len(city_names)):
        print("     -> Started checking on data quality for", city_names[i])

        df_current = pd.read_csv(os.path.join(file_location, "../data/processed/city/current/processed_" + city_names[
            i] + "_" + date_today_string + ".csv"))
        df_ref = pd.read_csv(os.path.join(file_location, "../data/processed/city/reference/processed_" + city_names[
            i] + ".csv"))

        reference = df_current.sample(n=2000, replace=False)
        current = df_ref.sample(n=2000, replace=False)

        report = Report(metrics=[
            DataDriftPreset(),
        ])

        report.run(reference_data=reference, current_data=current)
        report.save_html(os.path.join(file_location, "../reports/data_reports/" + city_names[i] + "_index.html"))

        tests = TestSuite(tests=[
            TestNumberOfColumnsWithMissingValues(),
            TestNumberOfRowsWithMissingValues(),
            TestNumberOfConstantColumns(),
            TestNumberOfDuplicatedRows(),
            TestNumberOfDuplicatedColumns(),
            TestColumnsType(),
            TestNumberOfDriftedColumns(),
        ])

        tests.run(reference_data=reference, current_data=current)
        tests.save_html(os.path.join(file_location, "../reports/data_stability/" + city_names[i] + "_index.html"))

        print("     -> Done checking on data quality for", city_names[i])

    print("     -> Done checking on data quality")


if __name__ == "__main__":
    quality_check()
