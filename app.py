from asyncio.windows_events import NULL
from cmath import sin
from flask import Flask, flash, redirect, render_template, request, session, url_for, g, jsonify
from flask_session import Session
from urllib.request import Request, urlopen
import json

from flask_sqlalchemy import SQLAlchemy
from celery import Celery

# from sqlalchemy.ext.automap import automap_base

# from sqlalchemy import create_engine, MetaData, Column, String, Table, Integer,Sequence
# from sqlalchemy.ext.declarative import declarative_base
# import sqlalchemy.orm
# from sqlalchemy.orm import scoped_session, sessionmaker, Query
from slugify import slugify
import requests
from sqlite3 import Error, SQLITE_PRAGMA
from sqlalchemy import true

from zmq import PROTOCOL_ERROR_ZMTP_UNEXPECTED_COMMAND
from SQL import *
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from flask_mail import *
from random import *
import pyotp
from itsdangerous import URLSafeTimedSerializer
import unidecode
import random as rand
import schedule
import sqlite3
from statistics import mean
from collections import Counter


# import os

# from .util import ts, send_email


import os


import re
# def make_celery(app):
#     celery = Celery(
#         app.import_name,
#         backend=app.config['CELERY_RESULT_BACKEND'],
#         broker=app.config['CELERY_BROKER_URL']
#     )
#     celery.conf.update(app.config)

#     class ContextTask(celery.Task):
#         def __call__(self, *args, **kwargs):
#             with app.app_context():
#                 return self.run(*args, **kwargs)

#     celery.Task = ContextTask
#     return celery

pattern = re.compile(r'[^-a-zA-Z0-9.]+')

os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

app = Flask(__name__,template_folder='templates',static_folder='static')
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.static_folder = 'static'
def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    # celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'cdozcodeprojects@gmail.com'
app.config['MAIL_PASSWORD'] = 'chimchid8912'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
from celery.utils.log import get_task_logger

# logger = get_task_logger(__name__)

session1 = Session(app)


cur_path = os.path.dirname(os.path.abspath(__file__))

#names db2 since always call it after a database change 
db2 = create_connection(cur_path + "\\gamestorage.db")
db = db2.cursor()

# from SQL import getgamelistdata, getgamelistdata2, getgamelistdatasort,getgamedatabasedata, listToString, ratingfilter


# individualpagelinks = getgamelistdata()

# for i in individualpagelinks["name"]:
#     print (i)
app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)

# def getusersjson():
#         db2.row_factory = sqlite3.Row # This enables column access by name: row['column_name'] 
#         usergamelist2 = db.execute ("SELECT * FROM users") 
#         # where id = ?;", [session["user_id"]]).fetchall()
#         # db2.commit()
#         print("go")
#         # semigamelist = [dict(i) for i in usergamelist2]
#         yes = json.dumps(usergamelist2)
#         return (yes)
prepreviousgameinfo = db.execute("SELECT * from gamedatabase where slugname = ?;", ["persona-5"]).fetchall()
# print(previousgameinfo)
prepreviousgameinfols = [list(j) for j in prepreviousgameinfo]

previousgameinfo = prepreviousgameinfols[0]
# print(previousgameinfo)



# previousgameinfo = list.sort(previousgameinfo)
# print(previousgameinfo)
@celery.task()
def updatedatabase():
    gamedbdata=getgamedatabasedata()
    gamelistdata=getgamelistdata2()
    slugsdb = gamedbdata["slugname"]
    dbnames = gamedbdata["name"]
    gamenamelist = gamelistdata["name"]
    names = gamedbdata["slugname"]
    # metacriticlist = [] 
    for i in slugsdb:
        gamedata=lookup(i)
        print("doing")
        prepreviousgameinfo = db.execute("SELECT gamename,slugname,metacriticrating,backgroundimage,releasedate,websites,platforms from gamedatabase where slugname = ?;", [i]).fetchall()
        prepreviousgameinfols = [list(j) for j in prepreviousgameinfo]
        previousgameinfo = prepreviousgameinfols[0]
        for a in range (len(previousgameinfo)):
            previousgameinfo[a] = str(previousgameinfo[a])
        previousgameinfo = Counter(previousgameinfo)

        platforms = listToString(gamedata["platform"])

        newlist = [gamedata["name"], gamedata["slug"],gamedata["metacriticrating"],gamedata["backgroundimage"] , gamedata["releasedate"] , gamedata["website"],platforms]
        for j in range(len(newlist)):
            element = str(newlist[j])
            newlist[j] = element.strip()
        
        newdata = newlist
        # print(previousgameinfo)
        
        newdata = Counter(newdata)
        # print(newdata)
        # print(previousgameinfo != newdata)
        if previousgameinfo != newdata:
            db.execute("UPDATE gamedatabase set gamename = ?, slugname = ?, metacriticrating = ?, backgroundimage = ?, releasedate = ?, websites = ?, platforms = ? WHERE slugname = ? ",
            (gamedata["name"], gamedata["slug"],gamedata["metacriticrating"],gamedata["backgroundimage"] , gamedata["releasedate"] , gamedata["website"], platforms, i))
            db2.commit()
    for i in gamenamelist:
        if i in dbnames:
            i = str(i)
            ppgminfo = db.execute("SELECT gamename,slugname,metacriticrating,backgroundimage,releasedate,websites,platforms from gamedatabase where gamename = ?;", [i.strip()]).fetchall()
            ppgmlsinfo =  prepreviousgameinfols = [list(j) for j in ppgminfo]
            pgmlsinfo = ppgmlsinfo[0]
            pgmlsinfo = Counter(pgmlsinfo)

            index = dbnames.index(i)
            gameslug = slugsdb[index]
            gamedata2 = lookup(gameslug)
            newlist2 = [gamedata2["name"], gamedata2["slug"],gamedata2["metacriticrating"],gamedata2["backgroundimage"] , gamedata2["releasedate"]]
            for j in range(len(newlist2)):
                element2 = str(newlist2[j])
                newlist2[j] = element2.strip()
            
            newdata2 = Counter(newlist2)
            if pgmlsinfo != newdata2:
                db.execute("UPDATE gamelist set game = ?, slugs = ?, onlinerating = ?, backgroundimage = ? , releasedate = ? WHERE game = ?",
                (gamedata2["name"], gamedata2["slug"],gamedata2["metacriticrating"],gamedata2["backgroundimage"] , gamedata2["releasedate"], i))
                db2.commit()
@app.route("/")
@login_required
def game_data():
    global gamedatadict2
    global gamedatadict2filter
    gamedatadict2 = getgamelistdata()
    global sorteddict 
    sorteddict = None
    gamedatadict2filter = None
    global singlegamedict
    singlegamedict = {}


    global userdata,userid,username,userhash, gamedatadict,acabrev
 
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    db2.commit()
    #Updates the database with new data if changed but with the API Limits of the free plan
    # updatedatabase.delay()
    # schedule.every().monday.do(updatedatabase.delay)

    rawuserdata=users.fetchall()

    userdata = [list(i) for i in rawuserdata]
    userid = session["user_id"]
    username = userdata[0][0]
    userhash = userdata[0][2]
    usercharacters = list(username)
    firstchar = usercharacters[0]
    lastchar = usercharacters[len(usercharacters)-1]
    acabrev=firstchar+lastchar
    randlist=[]


    gamedatadict=getgamelistdata()
    return render_template('index.html')
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
        for i in range (len(name)):
            gdlsdict.append({"Number": [i],"Name": name[i], "BGimg": bgimgs[i], 
            "GHP": ghp[i], "GOR": gor[i], "GPR": gpr[i], "GRD": grd[i],
            "GST": gst[i], "GWB": gwb[i], "Slug":gsl[i]})
        return (gdlsdict)


@app.route('/gmlistfeeder', methods = ["GET", "POST"])
@login_required
def homepagefeeder():

    randlist=[]
    gamedatadict=getgamelistdata()
    gdlsdict = gm_data_dict_conv(gamedatadict)
    randgdlsdict = []
    gamedatadictname = gamedatadict["name"]
    gamedatalen = len(gamedatadictname)
    if gamedatalen < 10 :
        while len(randlist) <= gamedatalen:
            #print(len(randlist))
            randnumb=rand.randint(0,len(gamedatadictname)-1)
            if randnumb not in randlist: 
                randlist.append(randnumb)
    else:
        #print(len(randlist))
        while len(randlist) <= 10:
            # print(len(randlist))
            randnumb=rand.randint(0,len(gamedatadictname)-1)
            if randnumb not in randlist: 
                randlist.append(randnumb)


    for i in randlist:
        randgdlsdict.append(gdlsdict[i])

    return(jsonify(randgdlsdict))
    # randomlist = None

@app.route('/rndgamefeeder', methods=["GET", "POST"])
@login_required
def newrandgamesfeeder():
    randomlist = lookuplist("")
    ranklist = []
    frontpagelisttotal= 11
    if randomlist: 
        for i in range(1,frontpagelisttotal):
            ranklist.append(i)
            if randomlist["metacritic"][i-1]==None:  
                randomlist["metacritic"][i-1]==0
        randgmdict = []
        randomlistmcr = randomlist["metacritic"]
        for i in range(len(randomlistmcr)):
            # print (i)
            if randomlistmcr[i] == None:
                randomlistmcr[i] = "_"
        for i in range(0, frontpagelisttotal-1):
            ranklist = list(range(1,11))
            # print(ranklist)
            # print(i)
            randgmdict.append ({'Name': randomlist["gamelist"][i], 'Rank' : ranklist[i],  'GOR' : randomlist["metacritic"][i], 
        'BGimg' : randomlist["backgroundimage"][i], 'Slug' :randomlist["slugs"][i]})

    else:
        gdlist = getgamedatabasedata()
        gdlist = gm_db_conv(gdlist)
        randgmdict = []
        N = 10
        ranklist = list(range(1,frontpagelisttotal))
        for i in range(len(ranklist)):
            randgmdict.append(gdlist[i])

    return jsonify(randgmdict)
    

@app.route('/game/<variable>', methods=["GET", "POST"])
@login_required
def displaypage (variable):
    global singlegamedict
    if request.method == "POST":
        #Allows for displaying in HTML
        variable = variable.strip()
        variable3 =unidecode.unidecode(variable)

        slug = request.form.get("slug")
        vargamedata=getgamelistdata()
        varslugs = vargamedata["slug"]
        if variable in varslugs:

            vargamedata=getgamelistdata()
            vargamedatadb = getgamedatabasedata()
            varslugs = vargamedata["slug"]
            varslug = variable
            gamedataindex=varslugs.index(variable)
            varonlinerating = vargamedata["onlinerating"][gamedataindex]
            varpersonalrating = vargamedata["personalrating"][gamedataindex]
            print (varpersonalrating)
            if varpersonalrating == None:
                varpersonalrating = "_"
            varbackgroundimage = vargamedata["backgroundimages"][gamedataindex]
            varstatus = vargamedata["status"][gamedataindex]
            varwebsite = vargamedata["website"][gamedataindex]
            varreleasedate = vargamedata["releasedate"][gamedataindex]
            varhoursplayed = vargamedata["hoursplayed"][gamedataindex]
            displayadd = "No"
            displayremove = "Yes"
            
            databasenames = vargamedatadb["slugname"]
            #for determining if the editing features provided via javascript should be active
            liststatus = "yes"
            if variable in databasenames:

                dbgameindex = databasenames.index(variable)
                varplatform = vargamedatadb["platforms"][dbgameindex]
                
                varnames = vargamedatadb["name"][dbgameindex]
                varonlinerating = vargamedatadb["onlinerating"][dbgameindex]
                varbackgroundimage = vargamedatadb["backgroundimages"][dbgameindex]
                varwebsite = vargamedatadb["website"][dbgameindex]  
                varreleasedate = vargamedatadb["releasedate"][dbgameindex]


                if varplatform == None:
                    varplatform = "Not Yet Stored"

            else:
                varnames = variable
                varplatform = "Not Yet Stored"

            print (varhoursplayed)
        
        else:
            vargamedata = getgamedatabasedata()
            varslugs = vargamedata["slugname"]
            varslug = variable
            gamedataindex=varslugs.index(variable)
            varonlinerating = vargamedata["onlinerating"][gamedataindex]
            varpersonalrating = "_"
            varbackgroundimage = vargamedata["backgroundimages"][gamedataindex]
            varstatus = "Not in List"
            varwebsite = vargamedata["website"][gamedataindex]
            varreleasedate = vargamedata["releasedate"][gamedataindex]
            varplatform = vargamedata["platforms"][gamedataindex]
            # for storing game slug id to use for when search for game from redirect as will use the id in the search
            varnames = vargamedata["name"][gamedataindex]
            if varplatform == None:
                varplatform = "Not Yet Stored"

            # varplatform = varplatform[:-2]
            varhoursplayed = "Not in List"
            displayadd = "Yes"
            displayremove = "No"
            
            liststatus = "not"

        singlegamedict = gen_sing_gdict(varnames,varslug,varreleasedate,varhoursplayed,varstatus,varbackgroundimage,
        varonlinerating,varpersonalrating,displayadd,displayremove,variable,varplatform,varwebsite)

        return (jsonify(singlegamedict))
    else:
        return(render_template("index.html"))




@app.route('/gamegetter', methods=["GET", "POST"])
@login_required
def gamegetter ():
    global singlegamedict
    return(jsonify(singlegamedict))


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    #global userdata
    # Forget the user id
    session.clear()
    allusers =db.execute("SELECT * FROM users").fetchall()
    jsondata = json.dumps(allusers)
    print(jsondata)
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        
        # Checks the database for the username
        username = request.form.get("username")
        users = db.execute("SELECT * FROM users WHERE username = ?", [username]).fetchall()
        password = request.form.get("password")
        rawuserdata=users

        userdata = [list(i) for i in users]
  
        if not username:
            return render_template("login.html", warning = "No Username")
        elif not password:
            return render_template("login.html", warning = "No Password")
            
        # Makes sure that the username exists in the database and that the provided password 
        # for the username is correct
        if len(list(userdata)) != 1 :
            return render_template("login.html", warning = "Invalid Username")
        elif not check_password_hash(userdata[0][2], password):
            return render_template("login.html", warning = "Invalid Password")

        # Remembers the logged in user

        session["user_id"] = userdata[0][3]

        gamedatadict = getgamelistdata()
        # Redirect user to index page
        return redirect("/")

    # Takes to login page if used anything but POST to get to page
    else:
        return render_template("login.html", warning = "" , jsondata=jsondata)
def renderregister(warning):
    return render_template("register.html", warning= warning)

regex2 = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

@app.route("/register", methods=["GET", "POST"])
def register ():
    global username, password, email, secret
    if request.method == "POST":

        
        # defining username and password
        username = request.form.get("username")
        email = request.form.get ("email")
        
       # db2.commit()
       # db2.commit()

        password = request.form.get("password")
        confirmingpassword = request.form.get("confirmation")
        # Makes sure the user submits a username
        if not username:
            return renderregister("Provide Username")
        elif not email:
            return renderregister("Provide An Email")
        elif re.fullmatch(regex2, email) == None:
            return renderregister("Not a Valid Email")

        # Makes sure the password was submitted or gives error
        elif not password:
            return renderregister("Provide Password")
        
        # Makes sure that the username is not already used by seeing if there is more than one row
        # for that username

        userrows = db.execute( "SELECT * FROM users WHERE username = ?", [username])
        if len(list(userrows)) != 0:
            return renderregister("Username is Already Taken")
        emailrows = db.execute( "SELECT * FROM users WHERE email = ?", [email])
        if len(list(emailrows)) != 0:
            return renderregister("Another Account is Already Using That Email? Is It You?")

        # Have to retype the password for confirmation if do not
        elif not confirmingpassword:
            return renderregister( "Must Retype Password")

        # Have to match to proceed
        elif password != confirmingpassword:
            return renderregister( "Passwords Do Not Match")

        # Only Runs if no errors pop up
        else:
            secret = pyotp.random_base32()
            return redirect("/verify")
            # Generating the hash for the password to store
            # Inserting the new user since everything is valid
            db.execute("INSERT INTO users (username, hash, email) VALUES (?, ?, ?) ", (username, generate_password_hash(password), email))
            db2.commit()
            

            # subject = "Confirm your email"

            # token = ts.dumps(email, salt='email-confirm-key')
            # Going back to the main page
            return redirect("/account")

    # Takes to main page if used anything but POST to get to page
    # For Loading The Page
    
    return render_template("register.html", warning = "")
def mailsend(email,secret):
        msg = Message(
                'UG Database Registration',
                sender ='cdozcodeprojects@gmail.com',
                recipients = [f'{email}']
               )
        msg.body = f'We Have Received Your Registration. Here is Your OTP: {secret}'
        mail.send(msg)
        return(None)


def mailsendforgotpassword(forgotemail,forgotsecret):
        msg = Message(
                'UG Database Forgot Password',
                sender ='cdozcodeprojects@gmail.com',
                recipients = [f'{forgotemail}']
               )
        msg.body = f'Here is Your OTP to Change Your Password: {forgotsecret}'
        mail.send(msg)
        return(None)
@app.route("/verify", methods=["GET", "POST"])
def verify():

    if request.method == "POST":
        
        onetimeinput=request.form.get("OTP")
        # print s

        if secret == onetimeinput:
            db.execute("INSERT INTO users (username, hash, email) VALUES (?, ?, ?) ", (username, generate_password_hash(password), email))
            db2.commit()
            flash("Email Confirmed Successfully! You Can Now Login!")

            return redirect("/login")
        else:
            flash("Code Was Incorrect! Please Reregister")
            return redirect("/register")
    else: 
        mailsend(email,secret)

        return render_template("verify.html")

@app.route("/verify2", methods=["GET", "POST"])
def verify2():
    if request.method == "POST":
        return redirect("/verify")
        #send mail with same code

@app.route("/forgotresend", methods=["GET", "POST"])
def forgotresend():
    if request.method == "POST":
        return redirect("/forgotpassword")
        #send mail with same code
def renderpasswordemail(message):
    return render_template("forgotpasswordemail.html", message= message)
@app.route("/forgotpasswordemail", methods=["GET", "POST"])
def forgotpasswordemail():
    global forgotpasswordsecret, useremail
    if request.method == "POST":
        useremail = request.form.get("email")
        emailrows = db.execute( "SELECT * FROM users WHERE email = ?", [useremail])
        if re.fullmatch(regex2, useremail) == None:
            return renderpasswordemail("Not a Valid Email")

        elif len(list(emailrows)) == 0:
            return renderpasswordemail("This Email Does Not Appear To Be Associated With An Account. Please Try Again")
        else: 
            forgotpasswordsecret = pyotp.random_base32()
            return redirect("/forgotpassword")
    else:
        return renderpasswordemail("")

@app.route("/forgotpassword", methods=["GET", "POST"])
def forgotpassword():
    global forgotpasswordsecret
    if request.method == "POST":
        emailotp = request.form.get("emailOTP")
        password = request.form.get("password")
        confirmationpassword = request.form.get("confirmation")
        if emailotp == forgotpasswordsecret and password:
            pwdhash = generate_password_hash(password)
            db.execute("UPDATE users SET hash = ? WHERE email = ?", (pwdhash, useremail))
            db2.commit()
            flash("Your Password Has Been Changed")
            return redirect("/")
        elif emailotp == forgotpasswordsecret: 
            flash("Incorrect OTP. A New OTP has been sent")
            return redirect("/forgotpassword")     
        elif password != confirmationpassword:
            flash("Passwords do Not Match. A New OTP has been sent")
            return redirect("/forgotpassword")
        else:
            flash("Ensure your OTP is Correct and All Forms Are Filled Out. A New OTP has been sent")
            return redirect("/forgotpassword")
    else:
        forgotpasswordsecret = pyotp.random_base32()
        mailsendforgotpassword(useremail,forgotpasswordsecret)
        return render_template("forgotpassword.html")


@app.route("/mylist", methods=["GET", "POST"])
@login_required
def mylist():
    global sorteddict
    global gamedatadict2
    sorteddict = None 
    changedrating = request.form.get("rating")
    tabledata = db.execute('PRAGMA table_info(gamelist)')
    tabledata=tabledata.fetchall()
    gamedatadict=getgamelistdata()
    gamedatadict2 = getgamelistdata()
    # mylistfeed(gamedatadict)

    return (render_template("mylist.html", gamedata = gamedatadict))


def sort_list (type, stat, neg = False):
    val = type[stat]
    if isint(val):
        if neg:
            return -val
        else:
            return val

def sort_mc_asc (type):
    if isint(type["GOR"]):
        return type["GOR"]
    else:
        return 0 
def sort_mc_desc (type):
    if isint(type["GOR"]):
        return -type["GOR"]
    else:
        return 0 
def sort_pr_asc (type):
    if isint(type["GPR"]):
        return type["GPR"]
    else:
        return 0 
def sort_pr_desc (type):
    if isint(type["GPR"]):
        return -type["GPR"]
    else:
        return 0
def sort_hp_asc (type):
    if isint(type["GHP"]):
        return type["GHP"]
    else:
        return 0
def sort_hp_desc (type):
    if isint(type["GHP"]):
        return -type["GHP"]
    else:
        return 0
@app.route("/databasefeeder", methods = ["GET", "POST"])
@login_required
def databasefeeder():

    gamedatabase= getgamedatabasedata()
    names = gamedatabase["name"]
    nameslength = len(names)

    randimages = []
    bgimgs = gamedatabase["backgroundimages"]
    counter = 1
    while counter <= 4:
        randnumb=rand.randint(0,nameslength-1)

        if bgimgs[randnumb]: 
            if (bgimgs[randnumb] not in randimages):
                randimages.append(bgimgs[randnumb])

        counter= counter + 1
    print(randimages)
    return(jsonify(randimages))
@app.route("/account/detailsfeeder", methods = ["GET", "POST"]) 
@login_required
def account_details_feeder():
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    rawuserdata=users.fetchall()
    userdata = [list(i) for i in rawuserdata]

    username = userdata[0][0]
    email = userdata[0][4]
    if (not email):
        email = "None"
         

    gametotalquery= db.execute("SELECT * FROM gamelist where userid = ?", [session["user_id"]]).fetchall()
    usergames = [list(i) for i in gametotalquery]
    gametotal = len(usergames)
    # print(gametotal)
    personalratings, high90,high80,unrated,metacriticratings,metacritichigh90,avgmcrlist,avgperlist = ([] for i in range(8))

    for i in range(gametotal):
        personalratings.append(usergames[i][1])
        metacriticratings.append(usergames[i][2])

    
    for i in personalratings:
        if isint(i) :
            if i >= 90:
                high90.append(i)
            if i >= 80:
                high80.append(i)
            
            avgperlist.append(i)
        elif  i or i == "":
            unrated.append(i)
    
    for i in metacriticratings:
        if isint(i) :
            if i >= 90:
                metacritichigh90.append(i)
            avgmcrlist.append(i)
    
    avg_per_rating = round (mean(avgperlist),2)
    avg_mcr_rating = round (mean(avgmcrlist),2)
    total90 = len(high90)
    total80 = len(high80)
    totalunrated = len(unrated)
    totalmc90  = len(metacritichigh90)
    stat_name_list =["Name:", "Email:", "Total Games:", "Games Rated Over 90:", "Games Rated Over 80:", "Unrated Games:", "Metacritic Ratings Over 90:"
    ,"Average Metacritic Rating:", "Average Personal Rating:"]
    totals = [username, email, gametotal, total90, total80 ,totalunrated, totalmc90, avg_mcr_rating, avg_per_rating]
    front_end_details =[]
    if len(stat_name_list) <= len(totals) :
        for i in range( len(stat_name_list)):
            front_end_details.append({"Number" : i+1, "Name" : stat_name_list[i], "Value": totals[i]})
    else:
        for i in range( len(totals)):
            front_end_details.append({"Number" : i+1, "Name" : stat_name_list[i], "Value": totals[i]})


    return jsonify(front_end_details)




@app.route("/mylistfeeder", methods=["GET", "POST"])
@login_required
def mylistfeeder():
    global gamedatadict2
    global sorteddict
    global gamedatadict2filter
    global singlegamedict

    if request.method == "POST":
        mcrmin = request.form.get("fmetamin")
        mcrmax = request.form.get("fmetamax")
        permin=request.form.get("fpermin")
        permax = request.form.get("fpermax")
        sorttype = request.form.get("sorttype")
    
        status = request.form.get("status")
        hoursplayed = request.form.get("hoursplayed")
        try: 
            if (hoursplayed.strip() == ""):
                hoursplayed = "Nah"
        except:
            hoursplayed
        personalrating = request.form.get("personalrating")
        

        if mcrmin or mcrmax or permin or permax:
            sorteddict = None
            gamedatadict2 = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)
            return (jsonify (gamedatadict2))
        elif sorttype:
            gd2 = gamedatadict2
            gdlsdict = gm_data_dict_conv(gd2)
            
            unsortedgdlsdict= gdlsdict
            sorttype = sorttype.strip()
            # print(sorttype)
            if sorttype =="MCD":
                sorteddict = sorted(gdlsdict, key = sort_mc_desc)
            elif sorttype == "MCA":
                sorteddict = sorted(gdlsdict, key = sort_mc_asc)
            elif sorttype == "PRD":
                sorteddict = sorted(gdlsdict, key = sort_pr_desc)
            elif sorttype == "PRA":
                sorteddict = sorted(gdlsdict, key = sort_pr_asc)
            elif sorttype == "NS/TA":  
                sorteddict = unsortedgdlsdict
            elif sorttype == "HPD":
                sorteddict = sorted(gdlsdict, key = sort_hp_desc)
            elif sorttype == "HPA":
                sorteddict = sorted(gdlsdict, key = sort_hp_asc)
            else:
                sorteddict = unsortedgdlsdict
            return (jsonify(sorteddict))
        elif status:
            status = status.strip()
            print(status)
            gamename = (request.form.get("gamename")).strip()
            print(gamename)
            db.execute("UPDATE gamelist SET status = ? WHERE userid = ? AND game = ?", ((status), session["user_id"], gamename))
            gd2 = gamedatadict2
            names = gamedatadict2["name"]
            if gamename in names:
                nmindex = names.index(gamename)
                gamedatadict2["status"][nmindex] = status 
                singlegamedict["ST"] = status 
        elif hoursplayed:
            gamename = (request.form.get("gamename")).strip()
            print(gamename)
            if isint(hoursplayed):
                print(hoursplayed)
                db.execute("UPDATE gamelist SET hoursplayed = ? where userid = ? AND game = ?", ((hoursplayed,session["user_id"], gamename)))
                names = gamedatadict2["name"]
                if gamename in names:
                    nmindex = names.index(gamename)
                    gamedatadict2["hoursplayed"][nmindex] = int(hoursplayed)
                    singlegamedict["HP"] = int(hoursplayed) 
            
            else:
                db.execute("UPDATE gamelist SET hoursplayed = ? where userid = ? AND game = ?", ((None,session["user_id"], gamename))) 
                names = gamedatadict2["name"]
                if gamename in names:
                    nmindex = names.index(gamename)
                    gamedatadict2["hoursplayed"][nmindex] = "_"
                    singlegamedict["hp"] = "_"
        elif personalrating:
            gamename = (request.form.get("gamename")).strip()
            print(gamename)

            if isint(personalrating):
                db.execute("UPDATE gamelist SET personalrating = ? where userid = ? AND game = ?", ((personalrating,session["user_id"], gamename)))
                names = gamedatadict2["name"]
                if gamename in names:
                    nmindex = names.index(gamename)
                    gamedatadict2["personalrating"][nmindex] = int(personalrating) 
                    singlegamedict["PR"] = int(personalrating)
            else:
                db.execute("UPDATE gamelist SET personalrating = ? where userid = ? AND game = ?", ((None,session["user_id"], gamename)))

                names = gamedatadict2["name"]
                if gamename in names:
                    nmindex = names.index(gamename)
                    gamedatadict2["personalrating"][nmindex] = "_"
                    singlegamedict["PR"] = "_"

        db2.commit()

            # for i in ra
        return(jsonify(gamedatadict2))


    else:   
            print(sorteddict)
            if (sorteddict):

                # tabledata = db.execute('PRAGMA table_info(gamelist)')
                # tabledata=tabledata.fetchall()
                # gamedatadict2 = getgamelistdata()

                return (jsonify(sorteddict))
            # elif (gamedatadict2filter):
            #     return (jsonify(gamedatadict2filter))
            elif (gamedatadict2):
                return (jsonify(gamedatadict2))
@app.route("/sortlist", methods=["GET", "POST"])
@login_required
def sortlist():
    global gamedatadict2
    if request.method =="POST":
        sorttype = request.form.get("sort-type")
        sorttype = sorttype.strip()
        print(sorttype)
        if sorttype == "Metacritic Descending":
            gamedatadict2 = getgamelistdatasort("DESC","onlinerating")
        elif sorttype == "Metacritic Ascending":
            gamedatadict2 = getgamelistdatasort("ASC","onlinerating")
        elif sorttype == "Personal Descending":
            gamedatadict2 = getgamelistdatasort("DESC","personalrating")

        elif sorttype == "Personal Ascending":
            gamedatadict2 = getgamelistdatasort("ASC","personalrating")
        elif sorttype == "Normal/Time Added":
            gamedatadict2 = getgamelistdata()
        else:
            gamedatadict2 = getgamelistdatasort("ASC","onlinerating")

    
        return render_template("mylist.html",gamedata=gamedatadict)
    else:
        # print(sorttype)
        gamedatadict=getgamelistdata()
        return jsonify (gamedatadict2)

# @app.route("/sortfetch",methods=["GET"])
# def fetchsortlist():
@app.route("/filterlist", methods=["GET", "POST"])
@login_required
def filterlist():
    global gamedatadict2

    if request.method =="POST":
        mcrmin = request.form.get("fmetamin")
        mcrmax = request.form.get("fmetamax")

        permin=request.form.get("fpermin")
        permax = request.form.get("fpermax")

        gamedatadict = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)
        gamedatadict2 = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)


        # mylistfeed(gamedatadict)
        return render_template("mylist.html",gamedata=gamedatadict)
    else:
        gamedatadict=getgamelistdata()
        return render_template("mylist.html",gamedata=gamedatadict)
def rendereditlist(message):
    gamedatadict=getgamelistdata()
    hoursplayedls = gamedatadict['hoursplayed']
    for i in range (len(hoursplayedls)):
        if hoursplayedls[i] == "":
            hoursplayedls[i] ="_"
       

    return render_template("editlist.html", gamedata = gamedatadict, warning = message)
def editing():
    tabledata = db.execute('PRAGMA table_info(gamelist)')
    tabledata = tabledata.fetchall()
    gamedatadict=getgamelistdata()

    changedgamename = request.form.get("gamename")
    changedrating=request.form.get("rating")
    changedhours = request.form.get("hoursplayed")
    changedstatus = request.form.get("status")
    #print(changedgamename)
    #print(changedrating)
    #print(changedstatus)
    gamecheck=db.execute("SELECT * FROM gamelist where game = ?",[changedgamename])
    gamecheck2=db.execute("SELECT * FROM gamelist where userid = ?",[session["user_id"]])
    #gamecheckdata = [list(i) for i in gamecheck2]
    #print(gamecheckdata[0][0])
    #print(str(changedgamename.rstrip())==str(gamecheckdata[0][0]))
    if changedrating:
        if changedrating.isdigit() or type(changedrating) == float:

            if int(changedrating) < 0  or int(changedrating) > 100:
                return rendereditlist( "Choose Any Real Number Between 0 and 100")
        else:
                return rendereditlist("Please Only Submit Numbers")

    print(session["user_id"])
    if (changedrating != None):
        if changedrating =="":
            changedrating = None
        db.execute("UPDATE gamelist SET personalrating = ? WHERE userid = ? AND game = ?", ((changedrating), session["user_id"], changedgamename.strip()))
        db2.commit()
    elif (changedhours != None):
        db.execute("UPDATE gamelist SET hoursplayed = ? WHERE userid = ? AND game = ?", (str(changedhours), session["user_id"], changedgamename.strip()))
        db2.commit()
    elif(changedstatus != None):
        db.execute("UPDATE gamelist SET status = ? WHERE userid = ? AND game = ?", (str(changedstatus), session["user_id"], changedgamename.strip()))
        db2.commit()
    return(changedgamename)
@app.route("/editlist", methods=["GET", "POST"])
@login_required
def editlist():
    if request.method =="POST":
        changedgamename = editing()

        return redirect(f"/editlist#{changedgamename.strip()}")
        #rendereditlist("")

    else:
        return rendereditlist("")
@app.route("/editgamepage", methods=["GET", "POST"])
@login_required
def editgamepage():
    if request.method =="POST":
        changedgamename = editing()

        return redirect(f"/game/{changedgamename.strip()}")
        #rendereditlist("")

    else:
        return rendereditlist("")
def getrandomgamelist():
    gamedatadict=getgamelistdata()
    randlist =[]
    gamedatadictname = gamedatadict["name"]
    gamedatalen = len(gamedatadictname)
    if gamedatalen < 10 :
        while len(randlist) <= gamedatalen:
            print(len(randlist))
            randnumb=rand.randint(0,len(gamedatadictname)-1)
            if randnumb not in randlist: 
                randlist.append(randnumb)
    else:
        while len(randlist) <= 10:
            randnumb=rand.randint(0,len(gamedatadictname)-1)
            if randnumb not in randlist: 
                randlist.append(randnumb)
    return(randlist)
def renderaddlist(warning):
    gamedatadict=getgamelistdata()
    randlist = getrandomgamelist()
    
    return render_template("addlist.html", addwarning= warning , gamedata =  gamedatadict, numblist = randlist)

@app.route("/aboutsite", methods=["GET", "POST"])
@login_required
def aboutsite():
    bgimgdict = {"sitebgimgs":[]}
    gamedatadict=getgamelistdata()
    randlist = getrandomgamelist()
    # for i in randlist:
    #     bgimg = gamedatadict["backgroundimages"][i]
    #     bgimgdict["sitebgimgs"].append(bgimg)

    # print(bgimgdict)

    # return bgimgdict

    return render_template("aboutsite.html", gamedata = gamedatadict, numblist = randlist)

@app.route("/addlist", methods=["GET", "POST"])
@login_required
def addlist():
    tabledata = db.execute('PRAGMA table_info(gamelist)')
    tabledata=tabledata.fetchall()
    global singlegamedict
    #print(tabledata)
    
    if request.method == "POST":
        gamename= request.form.get("slug")
        print(f'{gamename} yeah' )

        # gamename2 =  request.form.get("game")
        gamestatus = request.form.get("status")
        gamerating = request.form.get("rating")
        if gamerating:
            if not isint(gamerating):
                gamerating = None

            if gamerating.strip() == "":
                gamerating = None

        hoursplayed = request.form.get("hoursplayed")
        gamerows = db.execute( "SELECT * FROM gamelist WHERE slugs = ? AND userid = ?;", (gamename, session["user_id"]))
        games=gamename
        # games2=slugify(gamename2,regex_pattern=pattern)
        
        if lookup(games) == None:
            queryresults=sluglookuplist(gamename)
            searchnames=queryresults["gamelist"]
            slugnames = queryresults["sluglist"]
            metacriticrating = queryresults["metacriticlist"]
            backgroundimages = queryresults["backgroundimage"]

            if gamename in searchnames:
                nameindex=searchnames.index(gamename)
                sluggame=slugnames[nameindex]
                #print(sluggame) 
                gameresult = lookup(sluggame)
            else:
                flash("That Game Does Not Exist", "error")
                return renderaddlist("")
        else:
            gameresult = lookup(games)

        #print(gameresult)
        if not gamename or not gamestatus:
            flash("Need a Game Name and Status", "error")
            return renderaddlist("")
        elif gameresult == None:
            flash("That Game Does Not Exist", "error")
            return renderaddlist("")
        elif len(list(gamerows)) != 0:
            flash("That Game is Already in Your List", "error")
            return renderaddlist("")
        
        
        truegamename = gameresult["name"]
        # truegamename = truegamename.replace('“','"').replace('”','"').replace("’","'").replace("‘","'")
        if hoursplayed:
            if not isint(hoursplayed):
                hoursplayed = 0
        else:
            hoursplayed = 0
        db.execute("INSERT INTO gamelist (userid, game, status, personalrating, onlinerating, releasedate,website, hoursplayed,backgroundimage, dayadded,slugs) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (session["user_id"],truegamename, gamestatus, gamerating, gameresult["metacriticrating"] , gameresult["releasedate"], gameresult["website"], hoursplayed, gameresult["backgroundimage"], datetime.utcnow().strftime("%m-%d-%Y"), gameresult["slug"]))
        
        db2.commit()

        


        gamecheck=db.execute("SELECT * FROM gamedatabase where gamename = ?",[gameresult["name"]])
        
        platforms = listToString(gameresult["platform"])

        singlegamedict = gen_sing_gdict(truegamename,gameresult["slug"], gameresult["releasedate"], hoursplayed, gamestatus,gameresult["backgroundimage"]
        ,gameresult["metacriticrating"],gamerating,"No","Yes",gameresult["slug"], platforms,gameresult["website"])


        if len(list(gamecheck)) == 0:
            db.execute ("INSERT INTO gamedatabase(gamename,metacriticrating,slugname,backgroundimage,releasedate,websites,platforms) VALUES(?,?,?,?,?,?,?)",(
                truegamename,gameresult["metacriticrating"],gameresult["slug"],gameresult["backgroundimage"],gameresult["releasedate"], gameresult["website"], platforms))
            db2.commit()
        # flash ("Game Successfully Added", "success")
        return jsonify(singlegamedict)
    else:
        return render_template("index.html")

@app.route("/addlistfeeder", methods=["GET", "POST"])
@login_required
def addlistfeeder():
    return(jsonify())

@app.route("/removelist", methods=["GET", "POST"])
@login_required
def removelist():

    if request.method == "POST":
        deletedgame= request.form.get("deletedgame")
        db.execute("DELETE from gamelist WHERE userid = ? AND slugs = ?;", (session["user_id"], deletedgame))
        db2.commit()
        flash("Game Has Been Removed From List","success")
        return (redirect(f"/game/{deletedgame}"))

    
@app.route("/search", methods=["GET", "POST"])
@login_required
def search():

    #print(tabledata)

    if request.method == "POST":
        if request.form.get("headersluggame"):
            gamename = request.form.get("headersluggame")
        else:
            gamename = request.form.get("rand-game-slug")
        # gamename2= request.form.get("headersearchresult")

        print (gamename)
        # gamerows = db.execute( "SELECT * FROM gamelist WHERE game = ? AND userid = ?;", (gamename2, session["user_id"]))
        games=gamename
        #print(games)
        
        if lookup(games) == None:
            queryresults=sluglookuplist(gamename)
            searchnames=queryresults["gamelist"]
            slugnames = queryresults["sluglist"]
            metacriticrating = queryresults["metacriticlist"]
            backgroundimages = queryresults["backgroundimage"]

            if gamename in searchnames:
                nameindex=searchnames.index(gamename)
                sluggame=slugnames[nameindex]
                #print(sluggame) 
                gameresult = lookup(sluggame)
            else:
                return renderaddlist("That Game Does Not Exist")
        else:
            gameresult = lookup(games)

        gamecheck=db.execute("SELECT * FROM gamedatabase where gamename = ?",[gameresult["name"]])
        #print(len(list(gamecheck)))

        # print (gameresult["platform"])
        platforms = listToString(gameresult["platform"])
        truegamename = gameresult["name"]
        # truegamename = truegamename.replace('“','"').replace('”','"').replace("’","'").replace("‘","'")
        # print(platforms)
        if len(list(gamecheck)) == 0:
            db.execute ("INSERT INTO gamedatabase(gamename,metacriticrating,slugname,backgroundimage,releasedate,websites,platforms) VALUES(?,?,?,?,?,?,?)",(
                truegamename,gameresult["metacriticrating"],gameresult["slug"],gameresult["backgroundimage"],gameresult["releasedate"], gameresult["website"], platforms))
            db2.commit()
        truegamename
        return redirect(f'/game/{gameresult["slug"]}')

def renderpasschange(warning):
    return render_template("changepassword.html", warning= warning, iconchars = acabrev, username=username)
@app.route("/account/changepassword", methods=["GET", "POST"])
@login_required
def password_change():
    global userdata
    """Let user change the password"""
    oldpassword = request.form.get("oldpassword")
    password = request.form.get("password")
    confirmingpassword = request.form.get("confirmation")
    if request.method == "POST":
        # Ensure form was filled out
        if not oldpassword:
            return renderpasschange( "Please Provide Your Old Password")
        elif not password:
            return renderpasschange( "Please Submit a Password")
        elif not check_password_hash(userhash, oldpassword):
             return renderpasschange("Please Ensure That Your Old Password is Correct")
        # Ensure password equals confirmation password submitted
        elif password != confirmingpassword:
            return renderpasschange("Passwords Don't Match")
        else:
            # hash the password
            pwdhash = generate_password_hash(password)
            db.execute("UPDATE users SET hash = ? WHERE id = ?", (pwdhash, session["user_id"]))
            db2.commit()
            # Redirect user to home page
            flash("Password Changed Successfully")
            return redirect("/")
    # For Loading the Page
    else:
        return renderpasschange("")


@app.route("/account")
@login_required
def accountpage():
    #global gamedatadict
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    rawuserdata=users.fetchall()
    userdata = [list(i) for i in rawuserdata]
    # print(userdata)
    # userid = session["user_id"]
    username = userdata[0][0]
    # userhash = userdata[0][2]
    gamedatadict=getgamelistdata()
    names = gamedatadict['name']


    return render_template("account.html", username=username, iconchars = acabrev, gamedata = gamedatadict, variable = "", onlynames = names)

@app.route("/account/wishlist")
@login_required
def wishlistpage():
    #global gamedatadict

    #gamedatadict=getgamelistdata()
    wishdata = db.execute("SELECT * FROM gamelist WHERE userid = ? AND status = ?;", (session["user_id"], "Wishlist"))
    wishlistdata= [list(i) for i in wishdata.fetchall()]

    wishlistnames, onlinegameratinglist,websitelist,backgroundimagelist,releasedatelist = ([] for i in range(5))
    
    for i in range (len(wishlistdata)):
        wishlistnames.append(wishlistdata[i][0])
        onlinegameratinglist.append(wishlistdata[i][2])
        releasedatelist.append(wishlistdata[i][7])
        websitelist.append(wishlistdata[i][8])
        backgroundimagelist.append(wishlistdata[i][10])




    wishdatadict = {'name': wishlistnames, 'onlinerating': onlinegameratinglist, 
    'website' : websitelist, 'backgroundimages' :backgroundimagelist ,   'releasedate' :releasedatelist}


    names = wishdatadict['name']

    return render_template("wishlist.html", username=username, iconchars = acabrev, gamedata = wishdatadict, onlynames = names)
@app.route("/account/details", methods=["GET", "POST"])
def accountdetails():

    return render_template("accountdetails.html", 
    username = username, iconchars = acabrev)
@app.route("/logout")
def logout():
    """Log user out"""

    # Clears all user ids for next login
    session.clear()

    # Takes user to the main login form
    return redirect("/")

def errorhandler(e):
    """Handle error"""
    if not isinstance(e, HTTPException):
        e = InternalServerError()
    return render_template("error.html",errorname=e.name, errorcode = e.code)

for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

  

SECURITY_PASSWORD_SALT = 'email_send'



if __name__ == '__main__':
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    rawuserdata=users.fetchall()
    userdata = [list(i) for i in rawuserdata]
    print(userdata)
    userid = session["user_id"]
    username = userdata[0][0]
    app.debug = True
    app.run(debug=True)