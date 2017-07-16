from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

driver = webdriver.Chrome('/Users/Chiranth/anaconda/selenium/webdriver/chrome/chromedriver')
url = "https://www.tripadvisor.in/Attractions-g304553-Activities-Mysuru_Mysore_Karnataka.html"
driver.get(url)
placeTypes = ["Sights & Landmarks", "Nature & Parks", "Outdoor Activities", "Zoos & Aquariums", "Museums", "Shopping", "Tours", "Food & Drink", "Spas & Wellness", "Water & Amusement Parks", "Concerts & Shows", "Nightlife"]
#Dictionary for each place type and its link
links = {}
for i in range(len(placeTypes)):
    #Try to click More, if already clicked, try will fail, do nothing
    try:
        expand = driver.find_element_by_link_text("More")
        expand.click()
    except:
        pass
    
    #Find each Category, click it open, get the url and store it
    driver.find_element_by_partial_link_text(placeTypes[i]).click()
    links[placeTypes[i]] = driver.current_url
    #links[placeTypes[i]] = driver.find_element_by_partial_link_text(placeTypes[i]).get_attribute("href")
    
    #If the url of the page is not the same as main url, then go back
    if(driver.current_url != url):
        driver.back()
        
#After operation quit chrome
driver.quit()

#Dictionary for each place type and list of links of all places in its page
subLinks = {}
driver = webdriver.Chrome('/Users/Chiranth/anaconda/selenium/webdriver/chrome/chromedriver')
for placeType, link in links.items():
    print(placeType, link)
    driver.get(link)
    
    #List of elements for each place type
    elem = []
    #Keep index at 0
    i = 0
    while True:
        try:
            #Find elements with class property_title, and each such element has anchor tag. Get its href
            temp = driver.find_elements_by_xpath("//div[@class='property_title']")[i].find_element_by_tag_name("a").get_attribute("href")
            elem.append(temp)
            i += 1
            #30 elements displayed per page, so after 30, go to next page and start from 0th index
            if(i >= 30):
                i = 0
                driver.find_element_by_link_text("Next").click()
        except:
            break
    #Now add the place type and its links to dict
    subLinks[placeType] = elem 

#Store intermediate results
import pickle
with open('Intermidiate.p','wb') as f:
    pickle.dump([links,subLinks], f)