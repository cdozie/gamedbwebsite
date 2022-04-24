
import sqlite3
from sqlite3 import Error
import random
from random import randint
import os 
import json
import app 
def create_connection(path):
    connection = None
    try:
        connection = sqlite3.connect(path,check_same_thread=False)
        
        print("Connection to SQLite DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection
cur_path = os.path.dirname(os.path.abspath(__file__))

#names db2 since always call it after a database change 
# db2 = create_connection(cur_path + "\\gamestorage.db")
# db = db2.cursor()
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
        # print(metacriticrating)
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
        pagenumber=randint(1,100)
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
        sluglist = []
        metacriticlist= []
        backgroundimage = []
        for i in range (len(namelistdata["results"])):  
            gamelist.append(namelistdata["results"][i]["name"])   
            sluglist.append(namelistdata["results"][i]["slug"])   
            metacriticlist.append(namelistdata["results"][i]["metacritic"])
            backgroundimage.append(namelistdata["results"][i]["background_image"])
        return {
            "gamelist": gamelist,
            "metacritic":metacriticlist,
            "backgroundimage":backgroundimage,
            "slugs":sluglist
            
        }
    except (KeyError, TypeError, ValueError):
        return None

def sluglookuplist(gamesearch):
    """Look up quote for symbol."""

    # Contact API
    try:
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

def ratingfilter(rating):
    for i in range (len(rating)):
        if rating[i] == None or rating[i] == "":
            rating[i] ="_"
    return (None)
def getusersjson(json_str = False):
        app.db2.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
        usergamelist = app.db.execute ("SELECT * FROM gamelist where userid = ?;", [session["user_id"]])
        
        app.db2.commit()
        app.db2.close()
        semigamelist = [dict(i) for i in usergamelist.fetchall()]
        if json_str:
            return json.dumps(semigamelist)

        return usergamelist



def gd_dict_creation(usergamelist):
    semigamelist = [list(i) for i in usergamelist.fetchall()]
    realgamelist, personalgameratinglist, onlinegameratinglist, websitelist, backgroundimagelist, statuslist, hoursplayedlist, releasedatelist, sluglist,dayaddedlist = ([] for i in range(10))
    for i in range (len(semigamelist)):
        realgamelist.append(semigamelist[i][0])
        personalgameratinglist.append(semigamelist[i][1])
        onlinegameratinglist.append(semigamelist[i][2])
        statuslist.append(semigamelist[i][4])
        hoursplayedlist.append(semigamelist[i][5])
        releasedatelist.append(semigamelist[i][7])
        websitelist.append(semigamelist[i][8])
        backgroundimagelist.append(semigamelist[i][10])
        dayaddedlist.append(semigamelist[i][11])
        sluglist.append(semigamelist[i][12])

        
    gamedatadict = {'name': realgamelist, 'personalrating' : personalgameratinglist, 'onlinerating': onlinegameratinglist, 
    'website' : websitelist, 'backgroundimages' :backgroundimagelist , 'status' : statuslist , 'hoursplayed' : hoursplayedlist, 'releasedate' :releasedatelist,'dayadded':dayaddedlist, 'slug' :sluglist}
    personalratings = gamedatadict['personalrating']
    metacriticratings = gamedatadict['onlinerating']
    hoursplayed = gamedatadict['hoursplayed']
    ratingfilter(personalratings)
    ratingfilter(metacriticratings)
    ratingfilter(hoursplayed)
    return (gamedatadict)

def getgamelistdata(*args):
    usergamelist = app.db.execute ("SELECT * FROM gamelist where userid = ?;", [session["user_id"]])
    # print(json.dumps(semigamelist)[0])
    gamedatadict = gd_dict_creation(usergamelist)
    return (gamedatadict)
def getgamelistdata2():
    usergamelist = app.db.execute ("SELECT * FROM gamelist")
    gamedatadict = gd_dict_creation(usergamelist)

    return (gamedatadict)
def getgamelistdatasort(ordertype, column):
    #Get rid of the repeat present right here.
    usergamelist = app.db.execute (f"SELECT * FROM gamelist where userid = ? ORDER BY {column} {ordertype};", [session["user_id"]])
    gamedatadict = gd_dict_creation(usergamelist)

    
    return (gamedatadict)
def isint(value):
    try:
        value = int(value)

        return True
    except :
         return False

def getgamelistdatafilter (mcrmin,mcrmax,permin,permax):
    if not isint(mcrmin):
        mcrmin = 0
    if not isint(mcrmax):
        mcrmax = 100
    if not isint(permin):
        permin = 0
    if not isint(permax):
        permax = 100
    mcrmin = int(mcrmin)
    mcrmax = int(mcrmax)
    if mcrmin > mcrmax:
        mcrmin = 0
    if permin > permax:
        permin = 0

    usergamelist = app.db.execute (f"SELECT * FROM gamelist where userid = ? AND onlinerating BETWEEN {mcrmin} AND {mcrmax} AND personalrating BETWEEN {permin} AND {permax};", [session["user_id"]])
    gamedatadict = gd_dict_creation(usergamelist)

    return (gamedatadict)

def getgamedatabasedata():
    usergamelist = (app.db.execute ("SELECT * FROM gamedatabase"))
    semigamelist = [list(i) for i in usergamelist.fetchall()]
    realgamelist, gameidlist, slugnamelist, onlinegameratinglist, backgroundimagelist, websitelist, releasedatelist,platformlist = ([] for i in range(8))
    for i in range (len(semigamelist)):
        realgamelist.append(semigamelist[i][0])
        gameidlist.append(semigamelist[i][1])
        slugnamelist.append(semigamelist[i][2])
        onlinegameratinglist.append(semigamelist[i][3])
        backgroundimagelist.append(semigamelist[i][4])
        releasedatelist.append(semigamelist[i][5])
        websitelist.append(semigamelist[i][6])
        platformlist.append(semigamelist[i][7])
    gamedbdict = {'name': realgamelist, 'gameid' : gameidlist, 'slugname': slugnamelist, 
    'onlinerating' : onlinegameratinglist, 'backgroundimages' :backgroundimagelist , 'releasedate' : releasedatelist , 'website' :websitelist, 'platforms' : platformlist}
    metacriticratings = gamedbdict['onlinerating']
    ratingfilter(metacriticratings)
    return (gamedbdict)

def listToString(s): 
    
    # initialize an empty string
    str1 = "" 
    
    # traverse in the string  
    for ele in s: 
        str1 += ele + ","+ " "  
    str1 = str1[:-2]
    # return string  
    return str1 

def isBetween(x,low,high):
    return (x>= low and x<=high)





def gen_sing_gdict(name,slug,rd,hp,gs,bg,mcr,pr,DA,DR,RS,plt, wb):
    mcr_eval_list = [("Perfection",100,100), ("Universally Acclaimed", 90, 99 ), ("Amazing", 80,89), ("Decent", 60, 79), ("Poor",0,59)]
    if mcr:
        if isint(mcr):
            for i in mcr_eval_list:
                eval = i[0]
                low = i[1]
                high =i[2]

                if isBetween(mcr,low,high):
                    mcrword = eval
        else:
            mcrword = "Not Reviewed"
        if mcr == "" or mcr == " ":
            mcr = "_"
        



    if not isint(hp) or hp == 0:
        hp = "Never Played"
    if not pr: 
        if not isint(pr):
            pr = "_"
    singlegamedict = {"Name": name, "Slug" : slug, "RD": rd, "HP" : hp, "ST": gs, "BGimg" : bg, "MCR" : mcr,
"MCRWORD":mcrword ,"PR" : pr ,"DisplayAdd" : DA, "DisplayRemove": DR, "ReceivedSlug" : RS, "PLT" : plt, "GWB" : wb}
    return (singlegamedict)

def gm_db_conv(gd):
    lsdict = []

    name = gd["name"]
    id = gd["gameid"]
    slug = gd['slugname']
    mcr = gd['onlinerating']
    bgimg = gd['backgroundimages']
    rd = gd['releasedate']
    wb = gd['website']
    plt = gd['platforms']

    for i in range (len(name)):
        lsdict.append({"ID": id[i], "Name" : name[i], "Slug": slug[i], "BGimg" : bgimg[i],
        "GOR" : mcr[i], "GRD": rd[i], "GWB" : wb[i], "GPL" : plt[i]})
    return(lsdict)
def gm_data_dict_conv(gd):
        gdlsdict =[] 
        name = gd["name"]
        bgimgs = gd["backgroundimages"]
        ghp= gd["hoursplayed"]
        gor= gd["onlinerating"]
        gpr=gd["personalrating"]
        grd= gd["releasedate"]
        gst = gd["status"]
        gwb = gd["website"]
        gsl = gd ["slug"]
        gda = gd["dayadded"]
        for i in range (len(name)):
            gdlsdict.append({"Number": [i],"Name": name[i], "BGimg": bgimgs[i], 
            "GHP": ghp[i], "GOR": gor[i], "GPR": gpr[i], "GRD": grd[i],
            "GST": gst[i], "GWB": gwb[i], "Slug":gsl[i], "GDA" : gda[i]})
        return (gdlsdict)