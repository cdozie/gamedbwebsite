url = 'https://www.metacritic.com/browse/games/score/metascore/all/all/filtered'
req = Request(url, headers = {'User-Agent': 'Mozilla/5.0'})
webpage = urlopen(req).read()
webdata = requests.get(url)

datasoup = soup(webpage, "html.parser")
#print(datasoup)



names = datasoup.find_all("a", class_="title")
names2 = datasoup.find_all(["h3"])

names4 =datasoup.select('a.title h3') 
#print(names2)

namelist=[name.text for name in names]

ranks = datasoup.find_all("span", class_="title numbered")
ranklist=[rank.text for rank in ranks]
ranklistnew=[]
for rankel in ranklist:
    ranklistnew.append(rankel.strip())

ranklist = ranklistnew

ratings = datasoup.select("div[class=clamp-score-wrap]  a[class=metascore_anchor]  div[class='metascore_w large game positive']" )
ratinglist = [rating.text for rating in ratings]
#print(ratinglist)
#print([a.text for a in soup.select('th[attr="attr"].title a')])

platforms = datasoup.select("div[class=platform] span[class=data]")
platformlist = [platform.text for platform in platforms]
platformlistnew = []
for platel in platformlist:
    platformlistnew.append(platel.strip())

platformlist=platformlistnew
#print (platformlist)

fullgamedata= list(zip(namelist, ranklist, platformlist, ratinglist))
#print(fullgamedata)

game = {'name': namelist, 'rank' : ranklist, 'platform': platformlist, 'rating' : ratinglist }
gamenames = game['name']

import string
valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
#valid_chars

filename = "This Is a (valid) - filename%$&$ .txt"
filename = "This is a väryì' :: Strange File-Nömé.jpeg"


#print(slugify(filename,regex_pattern=pattern) )
gamefilenames=[]
for i in gamenames:

    j=slugify(i,regex_pattern=pattern)
    gamefilenames.append(j)
    #downloader.download(f"{j}", limit=1,  output_dir='static', adult_filter_off=True, force_replace=False, timeout=60, verbose=True)
    
#downloader.download("Persona 3 FES", limit=1,  output_dir='static', adult_filter_off=True, force_replace=False, timeout=60, verbose=True)

#game2 = {'name': namelist, 'rank' : ranklist, 'platform': platformlist, 'rating' : ratinglist , 'filename' : gamefilenames}
#print (game['rating'][1])
#print(game2)

