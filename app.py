from asyncio.windows_events import NULL
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

from zmq import PROTOCOL_ERROR_ZMTP_UNEXPECTED_COMMAND
from SQL import create_connection,login_required, lookup, lookuplist, sluglookuplist
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

# import os

# from .util import ts, send_email


import os


import re

pattern = re.compile(r'[^-a-zA-Z0-9.]+')


app = Flask(__name__,template_folder='templates',static_folder='static')
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.static_folder = 'static'
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'cdozcodeprojects@gmail.com'
app.config['MAIL_PASSWORD'] = 'chimchid8912'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

session1 = Session(app)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gamestorage.db'
# db3 = SQLAlchemy(app)
# Base = declarative_base()
# Base.metadata.reflect(db3.engine)
# class Games(Base):
#     __table__ = Base.metadata.tables['gamedatabase']

# print(db3.engine.table_names())
# print(Games.query.all())
# engine = create_engine('sqlite:///gamestorage.db')
# # db_session = scoped_session(sessionmaker(autocommit=False,
# #                                          autoflush=False,
# #                                          bind=engine))
# metadata = MetaData(bind=engine)
# metadata.reflect(engine)
# GAMEDB = metadata.tables['gamedatabase']
# print(GAMEDB.columns)

# execution = sqlalchemy.select([
#     GAMEDB.c.backgroundimage,

# ])    

# result = engine.execute(execution).fetchall()
# print(result)
# Base = automap_base()
# # Base.query = db_session.query_property()
# Base.prepare(engine, reflect=True)
# GameDb = Base.classes.gamedatabase
# session = sqlalchemy.orm.Session(engine)
# res=session.query(GameDb).all()
# print (res)

# def init_db():
#     # import all modules here that might define models so that
#     # they will be registered properly on the metadata.  Otherwise
#     # you will have to import them first before calling init_db()
#     import yourapplication.models
#     Base.metadata.create_all(bind=engine)

cur_path = os.path.dirname(os.path.abspath(__file__))

#names db2 since always call it after a database change 
db2 = create_connection(cur_path + "\\gamestorage.db")
db = db2.cursor()

# Base = automap_base()
# conn_str = 'sqlite:///gamestorage.db'    
# class User(db3.Model):
#     id = db3.Column(db3.Integer, primary_key=True)
#     name = db3.Column(db3.String)
#     email = db3.Column(db3.String)
from SQL import getgamelistdata, getgamelistdatasort,getgamedatabasedata, listToString, ratingfilter


# individualpagelinks = getgamelistdata()

# for i in individualpagelinks["name"]:
#     print (i)
@celery.task
def updatedatabase():
    print("running")
    gamedbdata=getgamedatabasedata()
    gamelistdata=getgamelistdata()
    slugsdb = gamedbdata["slugname"]
    dbnames = gamedbdata["name"]
    gamenamelist = gamelistdata["name"]
    names = gamedbdata["slugname"]
    for i in slugsdb:
        gamedata=lookup(i)
        platforms = listToString(gamedata["platform"])

        db.execute("UPDATE gamedatabase set gamename = ?, slugname = ?, metacriticrating = ?, backgroundimage = ?, releasedate = ?, websites = ?, platforms = ? WHERE slugname = ? ",
        (gamedata["name"], gamedata["slug"],gamedata["metacriticrating"],gamedata["backgroundimage"] , gamedata["releasedate"] , gamedata["website"], platforms, i))
    
    # db2.commit()
    for i in gamenamelist:
        if i in dbnames:
            index = dbnames.index(i)
            gameslug = slugsdb[index]
            gamedata2 = lookup(gameslug)
            db.execute("UPDATE gamelist set game = ?, slugs = ?, onlinerating = ?, backgroundimage = ? , releasedate = ? WHERE game = ?",
            (gamedata2["name"], gamedata2["slug"],gamedata2["metacriticrating"],gamedata2["backgroundimage"] , gamedata2["releasedate"], i))
    db2.commit()


    
@app.route("/")
@login_required
def game_data():
    task = updatedatabase.delay()

    global userdata,userid,username,userhash, gamedatadict,acabrev
    
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    rawuserdata=users.fetchall()
    userdata = [list(i) for i in rawuserdata]
    # print(userdata)
    userid = session["user_id"]
    username = userdata[0][0]
    userhash = userdata[0][2]
    usercharacters = list(username)
    firstchar = usercharacters[0]
    lastchar = usercharacters[len(usercharacters)-1]
    acabrev=firstchar+lastchar
    randlist=[]



    
    randomlist = lookuplist("")
    ranklist = []
    # print(randomlist["metacritic"])
    frontpagelisttotal= 11
    for i in range(1,frontpagelisttotal):
        ranklist.append(i)
        if randomlist["metacritic"][i-1]==None:  
            randomlist["metacritic"][i-1]==0
    # print(randomlist["metacritic"])
    randgamedict = {'name': randomlist["gamelist"], 'rank' : ranklist,  'rating' : randomlist["metacritic"], 
    'backgroundimage' : randomlist["backgroundimage"], 'slug':randomlist["slugs"] }
    randomlistmcr = randomlist["metacritic"]
    # print(randomlistmcr)
    for i in range(len(randomlistmcr)):
        # print (i)
        if randomlistmcr[i] == None:
            randomlistmcr[i] = "_"
    gamedatadict=getgamelistdata()
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


    #print (gamedatadict['personalrating'])
    # updatedatabase()

    return render_template('index.html', gamedatameta=randgamedict,gamedataserver=gamedatadict,numblist = randlist)



    # @app.route(f"/{i}", methods=["GET", "POST"])
    # def page():
    #     return render_template(f"{i}.html")


@app.route('/game/<variable>', methods=["GET", "POST"])
def displaypage (variable):
    #Allows for displaying in HTML
    
    variable3 =unidecode.unidecode(variable)
    # variable3 = variable3.replace('“','"').replace('”','"').replace("’","'").replace("‘","'")
    
    # variable = variable.replace('“','"').replace('”','"').replace("’","'").replace("‘","'")

    
    vargamedata=getgamelistdata()
    vargamedatanames = vargamedata["name"]
    if variable in vargamedatanames:

        vargamedata=getgamelistdata()
        vargamedatadb = getgamedatabasedata()
        vargamedatanames = vargamedata["name"]
        gamedataindex=vargamedatanames.index(variable)
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
        displayadd = "none"
        displayremove = "block"
        
        databasenames = vargamedatadb["name"]
        #for determining if the editing features provided via javascript should be active
        liststatus = "yes"
        if variable in databasenames:

            dbgameindex = databasenames.index(variable)
            varplatform = vargamedatadb["platforms"][dbgameindex]
            
            varslugs = vargamedatadb["slugname"][dbgameindex]
            varonlinerating = vargamedatadb["onlinerating"][dbgameindex]
            varbackgroundimage = vargamedatadb["backgroundimages"][dbgameindex]
            varwebsite = vargamedatadb["website"][dbgameindex]  
            varreleasedate = vargamedatadb["releasedate"][dbgameindex]

            if varslugs == None:
                varslugs = variable
            if varplatform == None:
                varplatform = "Not Yet Stored"

        else:
            varslugs = variable
            varplatform = "Not Yet Stored"

        print (varhoursplayed)
     
    else:
        vargamedata = getgamedatabasedata()
        vargamedatanames = vargamedata["name"]
        gamedataindex=vargamedatanames.index(variable)
        varonlinerating = vargamedata["onlinerating"][gamedataindex]
        varpersonalrating = "_"
        varbackgroundimage = vargamedata["backgroundimages"][gamedataindex]
        varstatus = "Not in List"
        varwebsite = vargamedata["website"][gamedataindex]
        varreleasedate = vargamedata["releasedate"][gamedataindex]
        varplatform = vargamedata["platforms"][gamedataindex]
        # for storing game slug id to use for when search for game from redirect as will use the id in the search
        varslugs = vargamedata["slugname"][gamedataindex]
        if varplatform == None:
            varplatform = "Not Yet Stored"

        # varplatform = varplatform[:-2]
        varhoursplayed = "Not in List"
        displayadd = "block"
        displayremove = "none"
        
        liststatus = "not"

    if varhoursplayed == 0 or varhoursplayed =="": 
        varhoursplayed = "Never Played"
    #AutoGenerating HTML PAGES
    filedata= f"""
    {{% extends "layout.html" %}}
    {{% block main %}}
    {{% with messages = get_flashed_messages(with_categories=true) %}} 
    {{% if messages %}} 
        {{% for category, message in messages %}}  
            <hr>
                    <p class="alert alert-secondary border text-center w-25 m-auto font-weight-bolder password-alert sticky-top {{{{category}}}}" role="alert">{{{{ message }}}}</p> 
            <hr> 
        {{% endfor %}}  
    {{% endif %}}  
    {{% endwith %}}  

    <div class="container-fluid var-page-container" id = "{liststatus}">
        <div class = "var-page-heading"> 
            <h2 class = "var-game-title gradientcolor"> <a href = "{varwebsite}" > {variable3} </a></h2>
            <div class = "var-online-rating">
            <span class = "vargamelabels gradientcolor "> Metacritic Rating: </span>
            <div data-color ="{varonlinerating}" class = "vargamerankings var-online-rating-data">{varonlinerating}</div>
            </div>
            <h7 data-color ="{varonlinerating}" class = "onlinerankdescription">Not Reviewed</h7>  
            

        </div> 
        <hr>
        <form action = "/editgamepage" id = "var-edit-form"  method = "post">
        <div class = "var-page-main"> 
            
                    <img class = "var-game-image" src = "{varbackgroundimage}">
                    <div class = "var-user-analytics">
                        <h6 class = "var-personal-rating analytic"> Your Rating : 
                        <div data-color = "{varpersonalrating}" class = "var-personal-rating-data varpersonalrankings var-rating-border">{varpersonalrating}</div> 
                        </h6>
                        <h6 class = "var-status analytic"> Game Status:
                        <div class = "var-status-data gradientcolorpinkwhite "> {varstatus}</div>
                        </h6>
                        <h6 class = "var-release-date analytic"> Game Release Date:
                        <div class = "gradientcolorpinkwhite">{varreleasedate}</div>
                        </h6>
                        <h6 class = "var-hours-played analytic"> Game Hours Played:
                        <div class = "var-hours-played-data gradientcolorpinkwhite"> {varhoursplayed}</div>
                        </h6>

                    </div>
                    <h6 class = "var-platforms gradientcolorpinkwhite" > Platforms: {varplatform}</h6>

                <input name="gamename" value = "{variable}" style = "display:none">
                <button type = "button"  class = "btn btn-warning var-edit-button var-buttons" style = "display: none"> Submit Changes </button>  
                
                <button type="button" class="btn btn-success var-add-button var-buttons" id = "{variable3}" style =  "display:{displayadd};">Add to List</button>

            
            
               <div class = "var-slug-game" id = "{varslugs}" style = "display:none;"></div>


        </div>
        </form>
                <form action = "/removelist" class = "var-remove-button-form" id = "remove-form" method = "post">
                    <input name = "deletedgame" style = "display:none" value = "{variable3}">
                    <button type = "submit" class="btn btn-danger var-remove-button var-buttons" id = "{variable3}" style = "display:{displayremove};">Remove from List</button>
                </form>
        

    </div>
    {{% endblock %}}

    """
    # variable= variable.replace(" ", "")

    variable2=slugify(variable,regex_pattern=pattern)

    cur_path = os.path.dirname(os.path.abspath(__file__))
    filedata= filedata.encode("utf-8")
    # cur_path = os.path.dirname(os.path.abspath(__file__))
    print (cur_path)
    new_path = cur_path + f'\\templates\\gamefolder\\{variable2}.html'

    # filepath = os.path.join(url_for('.index') + , f'{variable}.html')
    # if not os.path.exists('c:/your/full/path'):
    #     os.makedirs('c:/your/full/path')
    # f = open(filepath, "a")
    file = open(new_path,"wb")
    file.write(filedata)
    file.close()





# gamedatadict = {'name': realgamelist, 'personalrating' : personalgameratinglist, 'onlinerating': onlinegameratinglist, 
#     'website' : websitelist, 'backgroundimages' :backgroundimagelist , 'status' : statuslist , 'hoursplayed' : hoursplayedlist, 'releasedate' :releasedatelist}


    return render_template(f'/gamefolder/{variable2}.html')



#     return render_template(f'{variable}.html', gamename = variable)

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    #global userdata
    # Forget the user id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Checks the database for the username
        username = request.form.get("username")
        users = db.execute("SELECT * FROM users WHERE username = ?", [username])
        password = request.form.get("password")
        rawuserdata=users.fetchall()
        userdata = [list(i) for i in rawuserdata]
        #print (userdata[0])
        #print(userdata[0][3])
        #print(password)
        #print(list(users.fetchone()))
  
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


        # Redirect user to index page
        return redirect("/")

    # Takes to login page if used anything but POST to get to page
    else:
        return render_template("login.html", warning = "")
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
    changedrating = request.form.get("rating")
    tabledata = db.execute('PRAGMA table_info(gamelist)')
    tabledata=tabledata.fetchall()
    gamedatadict=getgamelistdata()

    return render_template("mylist.html", gamedata = gamedatadict)


@app.route("/sortlist", methods=["GET", "POST"])
@login_required
def sortlist():
    if request.method =="POST":
        sorttype = request.form.get("sort-type")
        sorttype = sorttype.strip()
        print(sorttype)
        if sorttype == "Metacritic Descending":
            gamedatadict = getgamelistdatasort("DESC","onlinerating")
        elif sorttype == "Metacritic Ascending":
            gamedatadict = getgamelistdatasort("ASC","onlinerating")
        elif sorttype == "Personal Descending":
            gamedatadict = getgamelistdatasort("DESC","personalrating")

        elif sorttype == "Personal Ascending":
            gamedatadict = getgamelistdatasort("ASC","personalrating")
    
        return render_template("mylist.html",gamedata=gamedatadict)
    else:
        print(sorttype)
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
    #print(tabledata)
    
    if request.method == "POST":
        gamename= request.form.get("sluggame")
        gamename2 =  request.form.get("game")
        print(gamename)
        gamestatus = request.form.get("status")
        gamerating = request.form.get("rating")
        if gamerating.strip() == "":
            gamerating = None

        hoursplayed = request.form.get("hoursplayed")
        gamerows = db.execute( "SELECT * FROM gamelist WHERE game = ? AND userid = ?;", (gamename2, session["user_id"]))
        games=gamename
        games2=slugify(gamename2,regex_pattern=pattern)

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
                flash("That Game Does Not Exist", "error")
                return renderaddlist("")
        else:
            gameresult = lookup(games)

        #print(gameresult)
        if not gamename or not gamename2 or not gamestatus:
            flash("Need a Game Name and Status", "error")
            return renderaddlist("")
        elif gameresult == None:
            flash("That Game Does Not Exist", "error")
            return renderaddlist("")
        elif len(list(gamerows)) != 0:
            flash("That Game is Already in Your List", "error")
            return renderaddlist("")
        
        if gamerating:
            if gamerating.isdigit() or type(gamerating) == float:

                if int(gamerating) < 0  or int(gamerating) > 100:
                    flash ("Choose Any Real Number Between 0 and 100", "error")
                    return renderaddlist("")
            else:
                    flash ("Please Only Submit Numbers", "error")
                    return renderaddlist("")



        if hoursplayed:
            if int(hoursplayed) < 0:
                flash ("Only Positive Hours Allowed", "error")
                return renderaddlist("")

        
        truegamename = gameresult["name"]
        # truegamename = truegamename.replace('“','"').replace('”','"').replace("’","'").replace("‘","'")
        db.execute("INSERT INTO gamelist (userid, game, status, personalrating, onlinerating, releasedate,website, hoursplayed,backgroundimage, dayadded,slugs) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        (session["user_id"],truegamename, gamestatus, gamerating, gameresult["metacriticrating"] , gameresult["releasedate"], gameresult["website"], hoursplayed, gameresult["backgroundimage"], datetime.utcnow().strftime("%m-%d-%Y"), gameresult["slug"]))
        db2.commit()
        gamecheck=db.execute("SELECT * FROM gamedatabase where gamename = ?",[gameresult["name"]])
        # print (gameresult["platform"])
        platforms = listToString(gameresult["platform"])
        # print(platforms)
        if len(list(gamecheck)) == 0:
            db.execute ("INSERT INTO gamedatabase(gamename,metacriticrating,slugname,backgroundimage,releasedate,websites,platforms) VALUES(?,?,?,?,?,?,?)",(
                truegamename,gameresult["metacriticrating"],gameresult["slug"],gameresult["backgroundimage"],gameresult["releasedate"], gameresult["website"], platforms))
            db2.commit()
        flash ("Game Successfully Added", "success")
        return renderaddlist( "")
    else:
        return renderaddlist("")


@app.route("/removelist", methods=["GET", "POST"])
@login_required
def removelist():

    if request.method == "POST":
        deletedgame= request.form.get("deletedgame")
        db.execute("DELETE from gamelist WHERE userid = ? AND game = ?;", (session["user_id"], deletedgame))
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
        return redirect(f'/game/{gameresult["name"]}')

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

  
# app name
# @app.errorhandler(404)
  
# # inbuilt function which takes error as parameter
# def not_found(e):
# # defining function
#   return render_template("error.html")
# # Listen for errors
SECURITY_PASSWORD_SALT = 'email_send'



if __name__ == '__main__':
    users = db.execute("SELECT * FROM users WHERE id = ?", [session["user_id"]])
    rawuserdata=users.fetchall()
    userdata = [list(i) for i in rawuserdata]
    print(userdata)
    userid = session["user_id"]
    username = userdata[0][0]
    app.run(debug=True)