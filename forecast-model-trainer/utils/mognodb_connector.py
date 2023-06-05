import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

database_instance = None


def get_database():
    global database_instance

    if database_instance is None:
        print("--- There is no instance of the database connector... try to connect to the database ---")
        connection_string = os.getenv("MONGODB_URL")
        database_instance = MongoClient(connection_string)

        print("     -> Connected successfully")

    return database_instance["swfis-predictions"]