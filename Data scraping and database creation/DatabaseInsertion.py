with open('Intermidiate.p','rb') as f:
    dat = pickle.load(f)

#Get urls of all places as a list  
links, subLinks = dat[0], dat[1]

#Assign id for categories
category_ids = {}
c = 1
for placeType, link in links.items():
    category_ids[placeType] = "c" + str(c).zfill(2)
    c += 1
    
#category table insertion
for cat, cat_id in category_ids.items():
    cursor.execute("INSERT INTO category(category_id,category_name) VALUES (%s, %s)",(cat_id,cat))
    
db.commit()

#db.close()
db = MySQLdb.connect("127.0.0.1","root","","test1")
cursor = db.cursor()

p = 1
for dataRow in dataList:
    place_name = dataRow[0]
    latitude = dataRow[1]
    longitude = dataRow[2]
    category = dataRow[3]
    rating = dataRow[4]
    review = dataRow[5]
    url = dataRow[6]
    avgTime = dataRow[7]
    #Create place_id for the place
    p_id = "p" + str(p).zfill(4)
    
    print(p_id, place_name,"Befpore")
    
    #place table insertion
    cursor.execute("""INSERT INTO place(place_id,place_name,latitude,longitude,rating,review,url,avg_time)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",(p_id, place_name,latitude,longitude,rating,review,url,avgTime))
    
    print(p_id, place_name,"Aft")
    
    #placeToCategory insertion
    for cat in category:
        #if we encounter new category, not in the category database
        if cat not in category_ids:
            continue
            '''
            cat_id =  "c" + str(c).zfill(2)
            category_ids[cat] = cat_id
            cursor.execute("INSERT INTO category(category_id,category_name) VALUES (%s, %s)",(cat_id,cat))
            c += 1
            '''
        cat_id = category_ids[cat]
        print(p_id, cat_id,"Insdide")
        cursor.execute("""INSERT INTO placeToCategory(place_id,category_id)
            VALUES (%s, %s)""",(p_id, cat_id))
        db.commit()
        
    p += 1

db.close()