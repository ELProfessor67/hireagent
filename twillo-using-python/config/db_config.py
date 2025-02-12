from pymongo import MongoClient
from settings import DB_URL

class Database:
    _instance = None

    @staticmethod
    def get_instance():
        if Database._instance is None:
            Database()
        return Database._instance

    def __init__(self):
        """ Virtually private constructor. """
        if Database._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            print(DB_URL)
            client = MongoClient(DB_URL)  # Replace with your URI
            self.db = client["aidbuat"]
            Database._instance = self
