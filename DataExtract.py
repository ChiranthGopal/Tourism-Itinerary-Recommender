with open('Intermidiate.p','rb') as f:
    dat = pickle.load(f)

#Get urls of all places as a list  
links, subLinks = dat[0], dat[1]
urls = set()
for placeType, link in subLinks.items():
    for l in link:
        urls.add(l)
urls = list(urls)

import requests
import random
from bs4 import BeautifulSoup
#from geopy.geocoders import Nominatim
import googleplaces
#geolocator = Nominatim()

#Main list of data
dataList = []
#Place urls with parsing error
errorPlaceUrls = []
#place names with latlong error
latlongErrorPlaces = []
#Places outside range
outsideRangePlaces = []


def rand_float(start, stop, step):
    return random.randint(0, int((stop - start) / step)) * step + start

#dict of places with min and max times(in hrs) spent at each
categ_times = {}

categ_times["Sights & Landmarks"] = [1,2]
categ_times["Nature & Parks"] = [1.5,2.5]
categ_times["Outdoor Activities"] = [2.5,3.5]
categ_times["Zoos & Aquariums"] = [2.5,4]
categ_times["Museums"] = [1.5,3]
categ_times["Shopping"] = [1,3]
categ_times["Food & Drink"] = [1,2]
categ_times["Spas & Wellness"] = [1,3]
categ_times["Water & Amusement Parks"] = [3,6]
categ_times["Concerts & Shows"] = [1.5,3.5]
categ_times["Nightlife"] = [1,2.5]
categ_times["Tours"] = [3,4]


#Parse each url and obtain relevant data
for url in urls:
    latlongErrorFlag = False
    parseErrorFlag= False
    dataRow = [0] * 8
    #make this url as list and apply function on each element 
    #url = "https://www.tripadvisor.in/Attraction_Review-g304553-d319703-Reviews-Mysore_Maharajah_s_Palace_Amba_Vilas-Mysuru_Mysore_Karnataka.html"
    request = requests.get(url)
    soup = BeautifulSoup(request.content,"html.parser")
    
    data = soup.find("h1",{"class":"heading_name"})
    # make place_name also list
    try:
        place_name = data.contents[2].strip()
    except:
        print("****CAUTION: unexpected error while getting name of place")
        parseErrorFlag = True
        pass

    #place details
    category=[]
    data = soup.find("div",{"class":"detail"})
    try:
        for i in range(len(data.contents)):
            if 'bs4.element.Tag' in  str(type(data.contents[i])) :
                category.append(data.contents[i].text)
    except:
        print("****CAUTION: unexpected error while getting catagory of place")
        parseErrorFlag = True
        pass
        #print(data.contents[i].text)
    #get latitude longitude

    try:
        temp = googleplaces.geocode_location(place_name+" Mysore",sensor=False)
        longitude = float(temp['lng'])
        latitude = float(temp['lat'])
        #if values not in range, dont continue further
        if(latitude < 11.5 or latitude > 13.0 or longitude < 75.5 or longitude > 78.0):#ie if lat not between 11.5 and 13
            outsideRangePlaces.append(place_name)
            print("EXCLUDED :"+place_name)
            continue
    except:
        #print(" *****CAUTION : unexpected error in finding lattitude longitude of the place ")
        latlongErrorFlag = True
        pass
    
    try:
        data = soup.find("span", {"class":"rate sprite-rating_rr rating_rr"})
        rating = float(data.contents[1]['content'])
    except:
        parseErrorFlag = True
        pass
        
    try:
        data = soup.find("a", {"class":"more"})
        review = int(data['content'])
    except:
        parseErrorFlag = True
        pass
        
    print(place_name,latitude,longitude,category)
    if parseErrorFlag:
        errorPlaceUrls.append(url)
    elif latlongErrorFlag:
        latlongErrorPlaces.append(place_name)
        print("*****LATLONG ERROR :"+place_name)
    else:
        #calculate avg time for multiple categories and then choose randomly betweent them
        avgTimes = []
        for categ in category:
            try:#try because categories like flea have not been defined so skip adding their times
                avgTimes.append(rand_float(categ_times[categ][0], categ_times[categ][1], 0.5))
            except:
                pass
            
        if(len(avgTimes) == 1):
            avgTime = avgTimes[0]
        else:
            avgTime = random.choice(avgTimes)
        
        dataRow[0] = place_name
        dataRow[1] = latitude
        dataRow[2] = longitude
        dataRow[3] = category
        dataRow[4] = rating
        dataRow[5] = review
        dataRow[6] = url
        dataRow[7] = avgTime
        dataList.append(dataRow)