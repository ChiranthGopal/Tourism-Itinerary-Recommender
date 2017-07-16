import MySQLdb

db = MySQLdb.connect("127.0.0.1","root","","test1")
#db = PyMySQL.connect("localhost","testuser","test123","TESTDB" )
cursor = db.cursor()

#cursor.execute("CREATE DATABASE IF NOT EXISTS test1")
#cursor.execute("USE test1")
cursor.execute("DROP TABLE IF EXISTS placeToCategory")
cursor.execute("DROP TABLE IF EXISTS place")
#cursor.execute("DROP TABLE IF EXISTS category")

table1 = """
CREATE TABLE category(
category_id CHAR(3) NOT NULL,
category_name VARCHAR(30),
PRIMARY KEY(category_id)
)
"""

table2 = """
CREATE TABLE place(
place_id CHAR(5) NOT NULL,
place_name VARCHAR(50),
latitude FLOAT,
longitude FLOAT,
review INT,
rating FLOAT,
url VARCHAR(150),
avg_time FLOAT,
PRIMARY KEY(place_id)
)
"""
table3 = """
CREATE TABLE placeToCategory(
place_id CHAR(5) NOT NULL,
category_id CHAR(3) NOT NULL,
PRIMARY KEY(place_id, category_id),
FOREIGN KEY(place_id) REFERENCES place(place_id),
FOREIGN KEY(category_id) REFERENCES category(category_id)
)
"""
#cursor.execute(table1)
cursor.execute(table2)
cursor.execute(table3)



#cursor.execute("INSERT INTO TABLE place()")