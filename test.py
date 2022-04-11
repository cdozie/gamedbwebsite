import requests
import os
import urllib.parse
import math
from flask import redirect, render_template, request, session
from functools import wraps
import pyotp
import json
api_key = "bbd0f6e116b145bd81a72ee35824f71f"
game="final-fantasy-10"
game2 = "persona-5"
url2 = f"https://api.rawg.io/api/games/{game}?key={api_key}"
url3 = f"https://api.rawg.io/api/games/{game2}?key={api_key}"
#url4 = f"api.thegamesdb.net/" 

response = requests.get(url2)
response2 = requests.get(url3)

data=response.json()
data2=response2.json()


#print(data)
#print(data2)

#namelist =[]
#for i in range (len(data["platforms"])):

  #  namelist.append(data["platforms"][i]["platform"]["name"])


url2 = f"https://api.rawg.io/api/games?key={api_key}&page=1&page_size=10&search={game2}" 

response2 = requests.get(url2)
response2.raise_for_status()

namelistdata = response2.json()



print (namelistdata["results"][3]["slug"])
#print(namelistdata["results"][0]["platforms"][0]["platform"]["name"])

#listresults = namelistdata["results"]
#gameplatforms= namelistdata["results"][0]["platforms"][0]


#for i in range(len(listresults)):
  #for j in range (len(gameplatforms)):
   # print(namelistdata["results"][i]["platforms"][j]["platform"]["name"])


# Python program for implementation of Quicksort Sort
 
# This function takes last element as pivot, places
# the pivot element at its correct position in sorted
# array, and places all smaller (smaller than pivot)
# to left of pivot and all greater elements to right
# of pivot
 
 
# totp = pyotp.TOTP("base32secret3232")
# print(totp.now())

# totp = pyotp.TOTP("base32secret3232")
# print(totp.verify("492039"))

# secret = pyotp.random_base32()
# print (secret)

# import pyotp
# totp = pyotp.TOTP("JBSWY3DPEHPK3PXP")
# print("Current OTP:", totp.now())