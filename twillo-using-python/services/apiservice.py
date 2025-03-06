import requests
from settings import BACKEND_URL

def get_assistant_by_number(number):
    # Define the URL with the provided id
    url = f"{BACKEND_URL}/api/configs/find-by-number/{number}"
    
    # Make the GET request
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse and return the response data (assuming it's in JSON format)
        return response.json()
    else:
        # Return the error if the request failed
        return {"error": response.status_code, "message": response.text}



def get_assistant_by_id(id):
    # Define the URL with the provided id
    url = f"{BACKEND_URL}/api/configs/find-assistant-by-id?id={id}"
    
    # Make the GET request
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse and return the response data (assuming it's in JSON format)
        return response.json()
    else:
        # Return the error if the request failed
        return {"error": response.status_code, "message": response.text}