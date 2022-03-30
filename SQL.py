
import sqlite3
from sqlite3 import Error
import random
from random import randint

def create_connection(path):
    connection = None
    try:
        connection = sqlite3.connect(path,check_same_thread=False)
        
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

def execute_read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"The error '{e}' occurred")
def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"The error '{e}' occurred")

import os
import requests
import urllib.parse

from flask import redirect, render_template, request, session
from functools import wraps


def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

def lookup(game):
    """Look up quote for symbol."""
    game = str(game)
    # Contact API
    try:
        api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        url = f"https://api.rawg.io/api/games/{game}?key={api_key}"  

        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        uniquedata = response.json()
        platformlist = []
        for i in range (len(uniquedata["platforms"])):
            platformlist.append(uniquedata["platforms"][i]["platform"]["name"])
        
        metacriticrating = uniquedata["metacritic"]
        print(metacriticrating)
        return {
            "slug": uniquedata["slug"],
            "name": uniquedata["name"],
            "metacriticrating": uniquedata["metacritic"],
            "platform": platformlist,
            "website": uniquedata["website"],
            "backgroundimage" : uniquedata["background_image"],
            "releasedate" : uniquedata["released"],
            
        }
    except (KeyError, TypeError, ValueError):
        return None
def lookuplist(gamesearch):
    """Look up quote for symbol."""

    # Contact API
    try:
        pagenumber=randint(1,40)
        api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        url2 = f"https://api.rawg.io/api/games?key={api_key}&page={pagenumber}&page_size=10&search={gamesearch}" 

        response2 = requests.get(url2)
        response2.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        namelistdata = response2.json()
        gamelist = []
        metacriticlist= []
        backgroundimage = []
        for i in range (len(namelistdata["results"])):  
            gamelist.append(namelistdata["results"][i]["name"])   
            metacriticlist.append(namelistdata["results"][i]["metacritic"])
            backgroundimage.append(namelistdata["results"][i]["background_image"])
        return {
            "gamelist": gamelist,
            "metacritic":metacriticlist,
            "backgroundimage":backgroundimage
            
        }
    except (KeyError, TypeError, ValueError):
        return None

def sluglookuplist(gamesearch):
    """Look up quote for symbol."""

    # Contact API
    try:
        pagenumber=randint(1,40)
        api_key = "bbd0f6e116b145bd81a72ee35824f71f"
        url2 = f"https://api.rawg.io/api/games?key={api_key}&page_size=10&search={gamesearch}" 

        response2 = requests.get(url2)
        response2.raise_for_status()
    except requests.RequestException:
        return None

    # Parse response
    try:
        namelistdata = response2.json()
        namelist = []
        sluglist =[]
        metacriticlist= []
        backgroundimage = []
        for i in range (len(namelistdata["results"])):  
            namelist.append(namelistdata["results"][i]["name"])   
            sluglist.append(namelistdata["results"][i]["slug"])
            metacriticlist.append(namelistdata["results"][i]["metacritic"])
            backgroundimage.append(namelistdata["results"][i]["background_image"])
        return {
            "gamelist": namelist,
            "sluglist": sluglist,
            "metacriticlist": metacriticlist,
            "backgroundimage":backgroundimage            
        }
    except (KeyError, TypeError, ValueError):
        return None