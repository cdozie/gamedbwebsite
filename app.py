from asyncio.windows_events import NULL
import threading
from typing import final
from functools import partial
from flask import Flask, flash, redirect, render_template, request, session, url_for, g, jsonify
from flask_session import Session
from urllib.request import Request, urlopen
import json

from flask_sqlalchemy import SQLAlchemy
from celery import Celery


# from slugify import slugify
import requests
from sqlite3 import Error, SQLITE_PRAGMA
from sqlalchemy import true

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
import os
import re

lock = threading.Lock()

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

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'cdozcodeprojects@gmail.com'
app.config['MAIL_PASSWORD'] = '*********'
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

app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)


#GLOBALLY DEFINED VARIABLES
webnoti = {} #For Form Warnings To User
funcerrornoti = {} #For Operational Errors Like Execution Failures
statusnoti = {}#For Status of Adding and Removing Things From List
def setwebnoti(noti,type):
    webnoti = {"Noti" : noti , "Type" : type }
    return webnoti

def setstatusnoti(noti,type):
    statusnoti = {"Noti" : noti , "Type" : type }
    return statusnoti

sorteddict = None
gamedatadict2filter = None
singlegamedict = {}
gamedatadict3 = None

sorteddictempty = False


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
    global sorteddict 
    gamedatadict2 = getgamelistdata()
    gamedatadict2 = gm_data_dict_conv(gamedatadict2)

    # sorteddict = None
    # gamedatadict2filter = None
    global singlegamedict


    global userdata,userid,username,userhash, gamedatadict,acabrev,email
 
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
    email = userdata[0][4]

    usercharacters = list(username)
    firstchar = usercharacters[0]
    lastchar = usercharacters[len(usercharacters)-1]
    acabrev=firstchar+lastchar


    gamedatadict=getgamelistdata()
    return render_template('index.html')



@app.route('/gmlistfeeder', methods = ["GET", "POST"])
@login_required
def homepagefeeder():

    randlist=[]
    try:
        lock.acquire(True)
        gamedatadict=getgamelistdata()
        gdlsdict = gm_data_dict_conv(gamedatadict)
        randgdlsdict = []
        gamedatadictname = gamedatadict["name"]
        gamedatalen = len(gamedatadictname)
        if gamedatalen < 10 :
            if gamedatalen > 0:
                while len(randlist) <= gamedatalen:
                    randnumb=rand.randint(0,len(gamedatadictname)-1)
                    if randnumb not in randlist: 
                        randlist.append(randnumb)
            else: 
                randlist=[]
        else:
            #print(len(randlist))
            while len(randlist) < 10:
                # print(len(randlist))
                randnumb=rand.randint(0,len(gamedatadictname)-1)
                if randnumb not in randlist: 
                    randlist.append(randnumb)

        if randlist == []:
            randgdlsdict = []
        else:
            for i in randlist:
                randgdlsdict.append(gdlsdict[i])
    finally:
        lock.release()

    return(jsonify(randgdlsdict))
    # randomlist = None
@app.route('/userlistfeeder', methods=["GET"])
@login_required
def userlistfeeder():
    gamelistdata = gm_data_dict_conv(getgamelistdata())

    return(jsonify(gamelistdata))

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
        for i in randgmdict:
            gamecheck=db.execute("SELECT * FROM gamedatabase where slugname = ?", [i["Slug"]])
            if len(list(gamecheck)) == 0:
                result = lookup(i["Slug"])
                platforms = listToString(result["platform"])
                try:
                    lock.acquire(True)
                    db.execute ("INSERT INTO gamedatabase(gamename,metacriticrating,slugname,backgroundimage,releasedate,websites,platforms) VALUES(?,?,?,?,?,?,?)",(
                        result["name"],result["metacriticrating"],result["slug"],result["backgroundimage"],result["releasedate"], result["website"], platforms))
                    db2.commit()
                finally:
                    lock.release()

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
        try:
            lock.acquire(True)
            vargamedata=getgamelistdata()
            varslugs = vargamedata["slug"]
            if variable in varslugs:

                # vargamedata=getgamelistdata()
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
        finally:
            lock.release()
        return (jsonify(singlegamedict))
    else:
        return(render_template("index.html"))




@app.route('/gamegetter', methods=["GET", "POST"])
@login_required
def gamegetter():
    global singlegamedict
    return(jsonify(singlegamedict))


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    global webnoti
    global usererror
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
            webnoti = setwebnoti("No Username", "error")
            return(jsonify(webnoti))
        elif not password:
            webnoti = setwebnoti("No Password","error")
            return(jsonify(webnoti))
        # Makes sure that the username exists in the database and that the provided password 
        # for the username is correct
        if len(list(userdata)) != 1 or not check_password_hash(userdata[0][2], password) :
            webnoti = setwebnoti("Invalid Username and/or Password","error")
            return(jsonify(webnoti))
        elif not check_password_hash(userdata[0][2], password):
            webnoti = setwebnoti("Invalid Password","error")
            return(jsonify(webnoti))
        # Remembers the logged in user

        session["user_id"] = userdata[0][3]
        webnoti = setwebnoti("Logged In","success")
        gamedatadict = getgamelistdata()
        # Redirect user to index page
        return redirect("/")

    # Takes to login page if used anything but POST to get to page
    else:
        return render_template("login.html")
def renderregister(warning):
    return render_template("register.html", warning= warning)

regex2 = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

@app.route("/register", methods=["GET", "POST"])
def register ():
    global username, password, email, secret
    global webnoti
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
            webnoti = setwebnoti("Provide Username","error")
            return("")
        elif not email:
            webnoti = setwebnoti("Provide An Email","error")
            return("")
        elif re.fullmatch(regex2, email) == None:
            webnoti = setwebnoti("Not a Valid Email","error")
            return("")

        # Makes sure the password was submitted or gives error
        elif not password:
            webnoti = setwebnoti("Provide Password","error")
            return("")
        
        # Makes sure that the username is not already used by seeing if there is more than one row
        # for that username

        userrows = db.execute( "SELECT * FROM users WHERE username = ?", [username])
        if len(list(userrows)) != 0:
            webnoti = setwebnoti("Username is Already Taken","error")

            return("")
        emailrows = db.execute( "SELECT * FROM users WHERE email = ?", [email])
        if len(list(emailrows)) != 0:
            webnoti = setwebnoti("Another Account is Already Using That Email? Is It You?","error")

            return("")

        # Have to retype the password for confirmation if do not
        elif not confirmingpassword:
            webnoti = setwebnoti("Provide Confirmation Password","error")
            return("")

        # Have to match to proceed
        elif password != confirmingpassword:
            webnoti = setwebnoti("Passwords Do Not Match","error")
            # return renderregister( "Passwords Do Not Match")
            return("")

        # Only Runs if no errors pop up
        else:
            webnoti = setwebnoti("Verify Registration","success")
            secret = pyotp.random_base32()
        
        return(jsonify(webnoti))

    
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
    global webnoti
    global secret

    if request.method == "POST":
        
        onetimeinput=request.form.get("OTP")
        # print s

        if secret == onetimeinput:
            db.execute("INSERT INTO users (username, hash, email) VALUES (?, ?, ?) ", (username, generate_password_hash(password), email))
            db2.commit()
            flash("Email Confirmed Successfully! You Can Now Login!")
            webnoti = setwebnoti("Email Confirmed","success")
            return("")

            # return redirect("/login")
        else:
            webnoti = setwebnoti("Code Was Incorrect! A New Email Has Been Sent!", "error")
            secret = pyotp.random_base32()
            mailsend(email,secret)

            return("")

            # flash("Code Was Incorrect! Please Reregister")


            # return redirect("/register")
    else: 
        mailsend(email,secret)

        return render_template("verify.html")

# @app.route("/verify2", methods=["GET", "POST"])
# def verify2():
#     if request.method == "POST":
#         return redirect("/verify")
#         #send mail with same code

@app.route("/forgotresend", methods=["GET", "POST"])
def forgotresend():
    if request.method == "POST":
        return redirect("/forgotpassword")
        #send mail with same code
def renderpasswordemail(message):
    return render_template("forgotpasswordemail.html", message= message)
@app.route("/forgotpasswordemail", methods=["GET", "POST"])
def forgotpasswordemail():
    global forgotpasswordsecret, useremail,webnoti
    if request.method == "POST":
        useremail = request.form.get("email")
        emailrows = db.execute( "SELECT * FROM users WHERE email = ?", [useremail])
        if re.fullmatch(regex2, useremail) == None:
            webnoti = setwebnoti("Not a Valid Email","error")

            # return renderpasswordemail("Not a Valid Email")

        elif len(list(emailrows)) == 0:
            webnoti = setwebnoti("This Email Does Not Appear To Be Associated With An Account.","error")

            # return renderpasswordemail("This Email Does Not Appear To Be Associated With An Account. Please Try Again")
        else:
            webnoti = setwebnoti("Show Form","success")
 
            # forgotpasswordsecret = pyotp.random_base32()
        return jsonify(webnoti)
    else:
        return renderpasswordemail("")
@app.route("/sendforgotpasswordemail", methods=["GET", "POST"])
def sendforgotpasswordemail():
    global webnoti
    global forgotpasswordsecret
    forgotpasswordsecret = pyotp.random_base32()
    mailsendforgotpassword(useremail,forgotpasswordsecret)
    webnoti = setwebnoti("Email Has Been Sent","success")
    return("")
@app.route("/forgotpassword", methods=["GET", "POST"])
def forgotpassword():
    global forgotpasswordsecret
    global webnoti
    global useremail
    if request.method == "POST":
        # useremail = request.form.get("email")
        # emailrows = db.execute( "SELECT * FROM users WHERE email = ?", [useremail])
        emailotp = request.form.get("emailOTP")
        password = request.form.get("password")
        confirmationpassword = request.form.get("confirmation")
        
        
        if emailotp == forgotpasswordsecret and password:
            pwdhash = generate_password_hash(password)
            db.execute("UPDATE users SET hash = ? WHERE email = ?", (pwdhash, useremail))
            db2.commit()
            webnoti = setwebnoti("Correct OTP","success")

            # flash("Your Password Has Been Changed")
            return redirect('/login')
        elif emailotp == forgotpasswordsecret: 
            webnoti = setwebnoti("Incorrect OTP. A New OTP has been sent","error")

            # flash("Incorrect OTP. A New OTP has been sent")
            forgotpasswordsecret = pyotp.random_base32()
            mailsendforgotpassword(useremail,forgotpasswordsecret)
            # return redirect("/forgotpassword")     
        elif password != confirmationpassword:
            webnoti = setwebnoti("Passwords do Not Match. A New OTP has been sent","error")
            forgotpasswordsecret = pyotp.random_base32()
            mailsendforgotpassword(useremail,forgotpasswordsecret)
            # flash("Passwords do Not Match. A New OTP has been sent")
            # return redirect("/forgotpassword")
        else:
            webnoti = setwebnoti("Ensure your OTP is Correct and All Forms Are Filled Out. A New OTP has been sent","Error")
            forgotpasswordsecret = pyotp.random_base32()
            mailsendforgotpassword(useremail,forgotpasswordsecret)
            # flash("Ensure your OTP is Correct and All Forms Are Filled Out. A New OTP has been sent")
            # return redirect("/forgotpassword")
        return(jsonify(webnoti))
    else:
        # forgotpasswordsecret = pyotp.random_base32()
        # webnoti = setwebnoti("Email Has Been Sent","success")
        # mailsendforgotpassword(useremail,forgotpasswordsecret)
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

    return (render_template("index.html", gamedata = gamedatadict))


def sort_list (type, stat, desc):
    val = type[stat]
    if isint(val):
        if desc:
            return -val
        else:
            return val
    else:
        return 0
def sort_date (type,stat, desc):
    val = type[stat]
    noval = "01-01-0001-00-00-00"
    # val = datetime.strptime(val, "%d-%b-%y")
    if val:

        if val.strip() == "":
            val = noval
            return datetime.strptime(val, '%m-%d-%Y-%H-%M-%S')       
        else:
            try:
                newval = datetime.strptime(val, '%m-%d-%Y-%H-%M-%S')
            except:
                newval = datetime.strptime(val, '%m-%d-%Y')
            if desc:
                return -newval
            else:
                return newval
    else:
        val = noval
        return datetime.strptime(val, '%m-%d-%Y-%H-%M-%S') 
    
@app.route("/databasefeeder", methods = ["GET", "POST"])
@login_required
def databasefeeder():
    abouttext = ["""This site was created by Chidozie as a way to delve into Web Development and 
    learn more about JavaScript, CSS, HTML, and SQLite. It also acted as a gateway to get into ReactJS as well. This specifc page was made entirely with React
    as a start to learning how it works""", 
    
    """This website was my first foray into Web Development and I hope to learn more.
    Especially about React since it is very powerful for creating dynamic UI and this page of the website was my first experience with it before I learned more about it
    and remade this page""",

    """This Website was first made entirely with plain Javascript and CSS on the Front End as a way to learn the fundamentals, then much of it got implemented in react
    as a way to eliminate loading screens and have seamless updating.""",
    """Thank You for taking the time to explore this website and seeing the work put in.
    Your time is appreciated deeply and we hope you enjoy your time on the site and if you are not a gamer, I hope this gets you GAMING."""
    ]
    gamedatabase= getgamedatabasedata()
    names = gamedatabase["name"]
    nameslength = len(names)

    randimages = []
    abtpgdict = []
    bgimgs = gamedatabase["backgroundimages"]
    while len(randimages) <= 4:
        randnumb=rand.randint(0,nameslength-1)

        if bgimgs[randnumb]: 
            # if (bgimgs[randnumb].strip() != "" or bgimgs[randnumb] !="None"):
                if (bgimgs[randnumb] not in randimages):
                    randimages.append(bgimgs[randnumb])

    for i in range (len(randimages)-1):
        abtpgdict.append({"Text": abouttext[i], "Picture" : randimages[i]})


    
    return(jsonify(abtpgdict))
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


@app.route("/profilefeeder")
def profilefeeder ():

    profileinfo = {"Username": username, "IconChars": acabrev}
    return (jsonify(profileinfo))
def dblockexecute(execution):
    try:
        lock.acquire(True)
        execution
        db2.commit()
    finally:
        lock.release()
def checkexforname(dict,gamename,stat,value):
    counter = 0 
    for i in dict:
        if i["Name"] == gamename:
            nmindex = counter
            dict[nmindex][stat]= value
            break
        counter = counter + 1

@app.route("/mylistfeeder", methods=["GET", "POST"])
@login_required
def mylistfeeder():
    global gamedatadict2
    global sorteddict
    global gamedatadict2filter
    global singlegamedict
    global sorteddictempty

    # Modify the Same Dictionary File So That The List Adapts Changes
    if request.method == "POST":

        # sorteddict = None

        mcrmin = request.form.get("fmetamin")
        mcrmax = request.form.get("fmetamax")
        permin=request.form.get("fpermin")
        permax = request.form.get("fpermax")
        sorttype = request.form.get("sorttype")
        reset = request.form.get("resetrequest")
        
        
        hoursplayed = request.form.get("hoursplayed")

        status = request.form.get("status")
        try: 
            if (hoursplayed.strip() == ""):
                hoursplayed = "None"
        except:
            hoursplayed
        # print(hoursplayed)
        personalrating = request.form.get("personalrating")
        # print(personalrating)
        try: 
            if (personalrating.strip() == ""):
                personalrating = "Nope"
        except:
            personalrating
        

        if mcrmin or mcrmax or permin or permax:
            gamedatadict2 = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)
            # print(gamedatadict2)
            sorteddict = gm_data_dict_conv(gamedatadict2)
            print(sorteddict)
            if sorteddict == []:
                sorteddictempty= True
            else:
                sorteddictempty = False
            return (jsonify (sorteddict))
        if reset:
            sorteddict = gm_data_dict_conv(getgamelistdata())
        elif sorttype:
            # gd2 = gamedatadict2
            gdlsdict = gamedatadict2
            print("sorting")
            unsortedgdlsdict= gdlsdict
            sorttype = sorttype.strip()
            if sorttype =="MCD":
                sorteddict = sorted(gdlsdict, key = partial(sort_list,stat ="GOR",desc = True))
            elif sorttype == "MCA":
                sorteddict = sorted(gdlsdict, key = partial(sort_list,stat = "GOR",desc = False))
            elif sorttype == "PRD":
                sorteddict = sorted(gdlsdict, key = partial(sort_list,stat = "GPR",desc = True))
            elif sorttype == "PRA":
                sorteddict = sorted(gdlsdict,key = partial(sort_list,stat = "GPR",desc = False))
            elif sorttype == "NS/TA": 
                sorteddict = sorted(gdlsdict, key= partial(sort_date, stat ="GDA", desc = False ))
            elif sorttype == "HPD":
                sorteddict = sorted(gdlsdict, key = partial(sort_list,stat = "GHP",desc = True))
            elif sorttype == "HPA":
                sorteddict = sorted(gdlsdict, key = partial(sort_list,stat = "GHP",desc = False))
            else:
                sorteddict = unsortedgdlsdict
            return (jsonify(sorteddict))
        elif status:
            if not sorteddict:
                sorteddict = gm_data_dict_conv(getgamelistdata())
                
            status = status.strip()
            print(status)
            gamename = (request.form.get("gamename")).strip()
            print(gamename)
            dblockexecute(db.execute("UPDATE gamelist SET status = ? WHERE userid = ? AND game = ?", ((status), session["user_id"], gamename)))
            # gd2 = gamedatadict2
            # names = gamedatadict2["name"]
            checkexforname(sorteddict,gamename,"GST", status )

            # if gamename in names:
            #     nmindex = names.index(gamename)
            #     gamedatadict2["status"][nmindex] = status 
            singlegamedict["ST"] = status 
        elif hoursplayed:

            if not sorteddict:
                sorteddict = gm_data_dict_conv(getgamelistdata())
            gamename = (request.form.get("gamename")).strip()
            print(f'{gamename} {hoursplayed} is present')
            if isint(hoursplayed):
                print(hoursplayed)
                dblockexecute(db.execute("UPDATE gamelist SET hoursplayed = ? where userid = ? AND game = ?", ((hoursplayed,session["user_id"], gamename))))
                # names = gamedatadict2["name"]
                checkexforname(sorteddict,gamename,"GHP", int(hoursplayed) )

                # if gamename in names:
                #     nmindex = names.index(gamename)
                #     gamedatadict2["hoursplayed"][nmindex] = int(hoursplayed)
                if int(hoursplayed) == 0: 
                    singlegamedict["HP"] = "Never Played"
                else:
                    singlegamedict["HP"] = hoursplayed
            
            else:

                print("HP not int")
                dblockexecute(db.execute("UPDATE gamelist SET hoursplayed = ? where userid = ? AND game = ?", ((0,session["user_id"], gamename)))) 
                # names = gamedatadict2["name"]
                # counter = 0
                checkexforname(sorteddict,gamename,"GHP", 0 )
                    # for i in gamedatadict2:
                    #     if i["Name"] == gamename:
                    #         nmindex = counter
                    #         gamedatadict2[nmindex]["GHP"]= 0
                    #         break
                    #     counter = counter + 1
                singlegamedict["HP"] = "Never Played"
        elif personalrating:
            if not sorteddict:
                sorteddict = gm_data_dict_conv(getgamelistdata())
            gamename = (request.form.get("gamename")).strip()
            print("Have PR")
            print (personalrating)
            if isint(personalrating):
                dblockexecute(db.execute("UPDATE gamelist SET personalrating = ? where userid = ? AND game = ?", ((personalrating,session["user_id"], gamename))))

                # names = gamedatadict2["name"]
                checkexforname(sorteddict,gamename,"GPR", int(personalrating) )

                # if gamename in names:
                #     nmindex = names.index(gamename)
                #     print("replacement")
                #     gamedatadict2["personalrating"][nmindex] = int(personalrating)
                singlegamedict["PR"] = personalrating
            else:
                dblockexecute(db.execute("UPDATE gamelist SET personalrating = ? where userid = ? AND game = ?", ((None,session["user_id"], gamename))))
                    
                print("No PR")
                # names = gamedatadict2["name"]
                checkexforname(sorteddict,gamename,"GPR", "_" )

                # if gamename in names:
                #     nmindex = names.index(gamename)
                #     gamedatadict2["personalrating"][nmindex] = "_"
                singlegamedict["PR"] = "_"

        # db2.commit()

            # for i in ra
        return(jsonify(gamedatadict2))


    else:   
            # print(sorteddict)
            # if (sorteddict and gamedatadict2):
            #     return (jsonify(gamedatadict2))

            # if (sorteddict):
            #     print("returning sorteddict")
            #     return (jsonify(sorteddict))
            # elif (gamedatadict2filter):
            #     return (jsonify(gamedatadict2filter))
            # if (gamedatadict2):
                # if gamedatadict3 :
                #     gamedatadict2 = gamedatadict3
                print(sorteddictempty)
                if (sorteddict) or sorteddictempty:
                    print("in sorted")
                    gamedatadict2 = sorteddict
                else :
                    gamedatadict2= gm_data_dict_conv(getgamelistdata())

                print("returning gamedatadict2")
                # gdnew2 = gm_data_dict_conv(gamedatadict2)
                return (jsonify(gamedatadict2))
            # if sorteddict:
            #     return (jsonify(sorteddict))
            

@app.route("/sortlistfeeder", methods = ["GET"])
@login_required
def sortlistfeeder():
    return jsonify(gamedatadict2)
# @app.route("/sortlist", methods=["GET", "POST"])
# @login_required
# def sortlist():
#     global gamedatadict2
#     if request.method =="POST":
#         sorttype = request.form.get("sort-type")
#         sorttype = sorttype.strip()
#         print(sorttype)
#         if sorttype == "Metacritic Descending":
#             gamedatadict2 = getgamelistdatasort("DESC","onlinerating")
#         elif sorttype == "Metacritic Ascending":
#             gamedatadict2 = getgamelistdatasort("ASC","onlinerating")
#         elif sorttype == "Personal Descending":
#             gamedatadict2 = getgamelistdatasort("DESC","personalrating")

#         elif sorttype == "Personal Ascending":
#             gamedatadict2 = getgamelistdatasort("ASC","personalrating")
#         elif sorttype == "Normal/Time Added":
#             gamedatadict2 = getgamelistdata()
#         else:
#             gamedatadict2 = getgamelistdatasort("ASC","onlinerating")

    
#         return render_template("mylist.html",gamedata=gamedatadict)
#     else:
#         # print(sorttype)
#         gamedatadict=getgamelistdata()
#         return jsonify (gamedatadict2)

# @app.route("/sortfetch",methods=["GET"])
# def fetchsortlist():
# @app.route("/filterlist", methods=["GET", "POST"])
# @login_required
# def filterlist():
#     global gamedatadict2

#     if request.method =="POST":
#         mcrmin = request.form.get("fmetamin")
#         mcrmax = request.form.get("fmetamax")

#         permin=request.form.get("fpermin")
#         permax = request.form.get("fpermax")

#         gamedatadict = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)
#         gamedatadict2 = getgamelistdatafilter(mcrmin,mcrmax,permin,permax)


#         # mylistfeed(gamedatadict)
#         return render_template("mylist.html",gamedata=gamedatadict)
#     else:
#         gamedatadict=getgamelistdata()
#         return render_template("mylist.html",gamedata=gamedatadict)
def rendereditlist(message):
    gamedatadict=getgamelistdata()
    hoursplayedls = gamedatadict['hoursplayed']
    for i in range (len(hoursplayedls)):
        if hoursplayedls[i] == "":
            hoursplayedls[i] ="_"
       

    return render_template("editlist.html", gamedata = gamedatadict, warning = message)


@app.route("/aboutsite", methods=["GET", "POST"])
@login_required
def aboutsite():

    return render_template("index.html")

@app.route("/addlist", methods=["GET", "POST"])
@login_required
def addlist():
    tabledata = db.execute('PRAGMA table_info(gamelist)')
    tabledata=tabledata.fetchall()
    global singlegamedict
    global statusnoti
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
                return ("")
        else:
            gameresult = lookup(games)

        #print(gameresult)
        if not gamename or not gamestatus:
            flash("Need a Game Name and Status", "error")
            return ("")
        elif gameresult == None:
            flash("That Game Does Not Exist", "error")
            return ("")
        elif len(list(gamerows)) != 0:
            flash("That Game is Already in Your List", "error")
            return ("")
        
        
        truegamename = gameresult["name"]
        if hoursplayed:
            if not isint(hoursplayed):
                hoursplayed = 0
        else:
            hoursplayed = 0
        db.execute("INSERT INTO gamelist (userid, game, status, personalrating, onlinerating, releasedate,website, hoursplayed,backgroundimage, dayadded,slugs) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (session["user_id"],truegamename, gamestatus, gamerating, gameresult["metacriticrating"] , gameresult["releasedate"], gameresult["website"], hoursplayed, gameresult["backgroundimage"], datetime.utcnow().strftime("%m-%d-%Y-%H-%M-%S"), gameresult["slug"]))    
        db2.commit()
        statusnoti = setstatusnoti("Game Sucessfully Added", "positive")

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
    global statusnoti

    if request.method == "POST":
        deletedgame= request.form.get("deletedgame")
        db.execute("DELETE from gamelist WHERE userid = ? AND slugs = ?;", (session["user_id"], deletedgame))
        db2.commit()
        statusnoti = setstatusnoti("Game Removed","negative")
        return (redirect(f"/game/{deletedgame}"))

    
@app.route("/search", methods=["GET", "POST"])
@login_required
def search():
    global funcerrornoti

    #print(tabledata)

    if request.method == "POST":
        if request.form.get("headersluggame"):
            gamename = request.form.get("headerssluggame")
        elif request.form.get('searchslug'):
            gamename = request.form.get("searchslug")

        else:
            gamename = request.form.get("rand-game-slug")
        # gamename2= request.form.get("headersearchresult")

        print (gamename)
        # gamerows = db.execute( "SELECT * FROM gamelist WHERE game = ? AND userid = ?;", (gamename2, session["user_id"]))
        games=gamename
        #print(games)
        

        try:
            lock.acquire(True)
            gamecheck=db.execute("SELECT * FROM gamedatabase where slugname = ?",[str(gamename)])
            if len(list(gamecheck)) == 0:
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
                        funcerrornoti = setwebnoti("This Game Does Not Appear to Exist", "error")
                else:
                    gameresult = lookup(games)
                platforms = listToString(gameresult["platform"])
                truegamename = gameresult["name"]
                db.execute ("INSERT INTO gamedatabase(gamename,metacriticrating,slugname,backgroundimage,releasedate,websites,platforms) VALUES(?,?,?,?,?,?,?)",(
                    truegamename,gameresult["metacriticrating"],gameresult["slug"],gameresult["backgroundimage"],gameresult["releasedate"], gameresult["website"], platforms))
                db2.commit()
        finally:
            lock.release()

        return("")

def renderpasschange(warning):
    # flash(warning)
    return render_template("index.html")

@app.route("/account/changepassword", methods=["GET", "POST"])
@login_required
def password_change():
    global userdata
    global webnoti
    """Let user change the password"""
    oldpassword = request.form.get("oldpassword")
    password = request.form.get("password")
    confirmingpassword = request.form.get("confirmation")
    if request.method == "POST":
        # Ensure form was filled out
        if not oldpassword:
            webnoti = setwebnoti("Please Provide Your Current Password", "error")
            return("")

        elif not password:
            webnoti = setwebnoti("Please Submit a Password")
            return("")

        elif not check_password_hash(userhash, oldpassword):
             webnoti = setwebnoti("Please Ensure That Your Old Password is Correct", "error")
             return("")

        elif password != confirmingpassword:
            webnoti = setwebnoti("Passwords Don't Match", "error")            
            return("")

        else:
            # hash the password
            pwdhash = generate_password_hash(password)
            db.execute("UPDATE users SET hash = ? WHERE id = ?", (pwdhash, session["user_id"]))
            db2.commit()
            # Redirect user to home page
            webnoti = setwebnoti("Password Changed Successfully", "success")

            # return redirect("/")
        return(jsonify(webnoti))
    # For Loading the Page
    else:
        return render_template("index.html")

@app.route("/notifeeder")
def notifeeder():
    return(jsonify(webnoti))

@app.route("/actionstatusfeeder")
def actionstatusfeeder():
    print(statusnoti)
    return(jsonify(statusnoti))

@app.route("/funcerrorfeeder")
def funcerrorfeeder():
    return(jsonify(funcerrornoti))

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


    return render_template("index.html")

@app.route("/account/wishlist")
@login_required
def wishlistpage():
    return render_template("index.html")
@app.route("/wishlistfeeder", methods = ["GET"])
def wishlistfeeder():
    usergamelist = db.execute("SELECT * FROM gamelist WHERE userid = ? AND status = ?;", (session["user_id"], "Wishlist"))
    gamedatadict = gd_dict_creation(usergamelist)
    gdict = gm_data_dict_conv(gamedatadict)
    return(jsonify(gdict))

@app.route("/account/details", methods=["GET", "POST"])
def accountdetails():

    return render_template("index.html", 
    )
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