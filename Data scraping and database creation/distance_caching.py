import MySQLdb,urllib.request,time,json,random
db = MySQLdb.connect("127.0.0.1","root","","test1")
cursor = db.cursor()
res = cursor.execute("SELECT p.place_id, p.latitude, p.longitude FROM place p ORDER BY p.place_id")
data = cursor.fetchall()
db.close()
result = []
#this function generates distance matrix between places. Due to Google Maps api restriction for free users at a time only max of 25 places distance from
#source is calculated in each request.
def gen_dist_matrix(src_index,data):
    global result
    origin=str(data[src_index][1])+","+str(data[src_index][2])
    dest=[]
    for j in range(0,len(data)):
        if j==src_index:
            continue;
        else:
            destination=str(data[j][1])+","+str(data[j][2])
            myurl = "https://maps.googleapis.com/maps/api/distancematrix/json?s&origins="+origin+"&destinations="+destination+"&key=AIzaSyDDcQ6Mg-B9Fp627C5ZDor2X2zpfpTH4Dg"
            response = urllib.request.urlopen(myurl)
            str_response = response.read().decode('utf-8')
            obj = json.loads(str_response)
            if(obj["rows"][0]["elements"][0]["status"] != "OK"):
                print("Fail: ",data[src_index][0])
            temp = [data[src_index][0], data[j][0], obj["rows"][0]["elements"][0]["distance"]["value"], obj["rows"][0]["elements"][0]["duration"]["value"]]
            print(temp)
            dest.append(temp) 
    result.extend(dest)
#In this for loop distance between each place to every other is calculated . 
for i in range(1,len(data)):
    gen_dist_matrix(i,data)
    #time gap between each request is needed since google maps api has limit on number of queries it can server from single user in an interval. 
    slp = random.randint(45,75)
    time.sleep(slp)
db = MySQLdb.connect("127.0.0.1","root","","test1")
#all the distance matrix recieved from google are stored in database , in the below for loop 
# the table will be of the form source place id, destination place id , distance, duration
cursor = db.cursor()
for line in data:
    line = eval(line)
    cursor.execute("""INSERT INTO cachedPlaces(src_place,dest_place,distance,time)
        VALUES (%s,%s,%s,%s)""",(line[0], line[1], line[2], line[3]))
db.commit()
db.close()