data = "";
placeLocations = []; 
clusterPlaces = [];
org = [];
day = 1;
    category_timer=null;
    markers = [];
    green_marker = null;
    end_time=null;
    start_time=null;
    current_time =[]; //2d array to keep track of time at each place in hrs,mins
    remaining_time = 0;
    initial_times = []; //keep track of starttime, time per day
    days =0;
    t_times = []; //store all the travel times
    v_times = []; //store all the visit times
    shownPlaces = []; //places in the itinerary
    cur_usr_lat=12.29;
    cur_usr_lng=76.64;
    function getTime(){
        start_time = document.getElementById("start_time").value;
        end_time = document.getElementById("end_time").value;
        start_date = document.getElementById("start_date").value;
        end_date = document.getElementById("end_date").value;
        day1 = new Date(start_date);
        day2 = new Date(end_date);

        days= Math.round(day2.getTime() - day1.getTime()) / (1000*60*60*24);
        
        start=start_time.split(":");
        temp_start = Number(start[0]) * 3600 + Number(start[1]) * 60;
        end = end_time.split(":");
        temp_end = Number(end[0]) * 3600 + Number(end[1]) * 60;
        remaining_time = Math.abs(temp_end-temp_start)/3600;
        start_time = [];
        start_time[0] = Number(start[0]);
        start_time[1] = Number(start[1]);
        initial_times.push(start_time[0]);
        initial_times.push(start_time[1]);
        initial_times.push(remaining_time);
        console.log(days,remaining_time);
        if(isNaN(days) || isNaN(remaining_time))
            alert("Please enter proper time");
        //daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
        //remaining_time=7;

        //start_time will now be a tuple of hrs and mins
        //start_time = new Array(date1.getUTCHours(), date1.getUTCMinutes());
        //add that time into current_time array
        current_time.push(start_time);

        days_dropdown = document.getElementById('days_dropdown');
        for(i=1; i<=days;i++){
            li = document.createElement("li");
            a = document.createElement("a");
            a.href = "#";
            a.innerHTML="Day "+i;
            li.setAttribute('id',"Day "+i);
            li.appendChild(a);
            li.addEventListener('click', dropdown_click);
            days_dropdown.appendChild(li);
        }
        console.log(remaining_time);
    }

    function loadMap() {
      // script_tag=document.createElement("script");
      // script_tag["defer"]=true;
      // document.body.appendChild(script_tag);
      // script_tag.href="https://maps.googleapis.com/maps/api/js?key=AIzaSyDat4JgHxdH5PWQ-AJ2OKIWjRB63gLrJFY&callback=initMap";
      x=document.getElementById("hello");
      x.className=x.className+" tab-pane active";
      // x.style.width = "800px";
      // var windowWidth = window.offsetWidth + 10 + 'px';
      //document.body.style.width = 1500 + "px";
      //window.style.innerWidth = windowWidth;
      //window.resizeTo(windowWidth,window.offsetHeight);
      //window.focus();
      console.log('s');

    }

    function init()
    {
        historical = document.getElementById('historical');
        religious = document.getElementById('religious');
        poi = document.getElementById('poi');
        nature = document.getElementById('nature');
        outdoor = document.getElementById('outdoor');
        shopping = document.getElementById('shopping');
        museums = document.getElementById('museums');
        water = document.getElementById('water');
        zoo = document.getElementById('zoo');
        spas = document.getElementById('spas');
        //food = document.getElementById('food');
        //night = document.getElementById('night');
        //concerts = document.getElementById('concerts');
        //tours = document.getElementById('tours');
        setTimeout(loadMap,100);
    }

    function register_catagory() 
    {
        if(category_timer!=null)
        {
            clearTimeout(category_timer);
        }  
        category_timer=setTimeout(show_places,2000);
    }

  //Sets markers on the map
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
        }
    }

      // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

      // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

      // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
   var directionsDisplay;
    function initMap() {
        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        service = new google.maps.DistanceMatrixService;
        mapDiv = document.getElementById('map');
        map = new google.maps.Map(mapDiv, {
        center: {lat: 12.29, lng: 76.64},
          zoom: 10
        });
        
        var infoWindow = new google.maps.InfoWindow({map: map});

        // below line checks for users geo location if it is found then it sets  center of the map to users current position(setting to mysore for now)
        //if (navigator.geolocation) {
            //navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              //lat: position.coords.latitude,
              //lng: position.coords.longitude
              lat: 12.29, lng: 76.64
            };

          
        //infoWindow.setPosition(pos);
        //infoWindow.setContent('Location found.');
         marker = new google.maps.Marker
        (
          {
            position:pos,
            map:map,
           //modified  part
            draggable:true,
            icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"//11111111111111111111111111111111111111111111
          }
        );



        //modified part this part is to locate the new lat long of the dragged part

        var t= new google.maps.event.addListener(marker, 'dragend', function(evt){
            //document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
            cur_usr_lat=evt.latLng.lat();
            cur_usr_lng=evt.latLng.lng();
        });

        var tt =  new google.maps.event.addListener(marker, 'dragstart', function(evt){
            document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
        });





        
        map.setCenter(pos);
      //}, function() {
     //   handleLocationError(true, infoWindow, map.getCenter());
     // });
       // }
    //else {
          // Browser doesn't support Geolocation
     //     handleLocationError(false, infoWindow, map.getCenter());
     //   }

    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
    }

  // Check selected categories and send a request to server
    function show_places(event) 
    {
    document.getElementById("table").innerHTML = "";
    clearMarkers();
    //modified part

    toSend = "";
    if(historical.checked==true)
     toSend = toSend + "Historic Places & Monuments"+ ";";
    if(religious.checked==true)
     toSend = toSend + "Religious Sites"+ ";";
    if(poi.checked==true)
     toSend = toSend + "Points of Interest & Landmarks"+ ";";
    if(nature.checked==true)
     toSend = toSend + "Nature & Parks"+ ";";
    if(outdoor.checked==true)
     toSend = toSend + "Outdoor Activities"+ ";";
    if(shopping.checked==true)
     toSend = toSend + "Shopping"+ ";";
    if(museums.checked==true)
     toSend = toSend + "Museums"+ ";";
    if(water.checked==true)
     toSend = toSend + "Water & Amusement Parks"+ ";";
    if(spas.checked==true)
     toSend = toSend + "Spas & Wellness"+ ";";
    if(zoo.checked==true)
     toSend = toSend + "Zoos & Aquariums"+ ";";
    //if(food.checked==true)
    // toSend = toSend + "Food & Drink"+ ";";
    //if(tours.checked==true)
     //toSend = toSend + "Tours"+ ";";
    //if(concerts.checked==true)
    // toSend = toSend + "Concerts & Shows"+ ";";

    console.log(toSend);

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = updateinfo;
    xhr.open("GET","http://localhost/Project/retrieve.php?category="+encodeURIComponent(toSend),true);
    xhr.send(); 

    }
      
    // Changes the color of the marker on map from red to green
    function find_marker(event)
    {
        for (var i = markers.length - 1; i >= 0; i--)
        {
      //markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      console.log(event.target.parentNode.id);
      if(markers[i]['title']==event.target.parentNode.id)
      {
        if(green_marker==null)
        {
          //console.log('green marker is null');
          markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          green_marker=markers[i];
          //console.log(green_marker);
          break;
        }
        else
        {
          //console.log('green marker is not null');
          green_marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
          markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
          green_marker=markers[i];
          break; 
        }
      }
    }
    }
   
        //this function assigns onclick event on each newly created  row in table
  function click_assigner(id)
  {
    row = document.getElementById(id);
    //this while loop will check whether the div element is created or not
    while(true)
    {
      if(row!=null)
      {
        row.addEventListener('click',find_marker,true);
        break;
      }
      else
      {
        row = document.getElementById(id);
        //console.log(row); 
      }
    }
  }

  //func which normalizes ratings and reviews
  function betaFunction(rating, review){
    alpha = 3;
    beta = 2;
    R = rating/5;
    v = review;
    return ((alpha+(R*v)) / (alpha+beta+v))*5;
  }

  // normalize and add a field to obtained data
  function normalizeRatings(){
    lim = data.place.length;
    for(var i=0;i<lim;i++){
      data.place[i]['rating_score'] = betaFunction(Number(data.place[i]['rating']), Number(data.place[i]['review']));
      data.place[i]['avg_time'] =  Number(data.place[i]['avg_time']);
      data.place[i]['latitude'] = Number(data.place[i]['latitude']);
      data.place[i]['longitude'] = Number(data.place[i]['longitude']);
      //console.log(data.place[i]['place_name'],":",data.place[i]['rating_score']);
    }
  }

  function sortResults(prop, asc) {
    data.place = data.place.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
  }

  //func that gets called when get response from backend
  function updateinfo()
  {
    if (xhr.readyState == 4 && xhr.status == 200)
    {
      data = JSON.parse(xhr.responseText);
      console.log(data);

      normalizeRatings();
      sortResults('rating_score',false);//false for desc sort
      /* to structure the json object look at line no 154
      */

      //dict to get the min max times based on categories
      categ_times = {}

      categ_times["Religious Sites"] = [1,2]
      categ_times["Historic Places & Monuments"] = [1,3]
      categ_times["Points of Interest & Landmarks"] = [0.5, 1]
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

      table = document.getElementById("table");

      //creates the heading of the table
      thead=document.createElement("thead");
      tbody=document.createElement("tbody");
      tr = document.createElement("tr");
      chk= document.createElement("th"); 
      nam= document.createElement("th");
      cat= document.createElement("th");
      rat= document.createElement("th");
      rev = document.createElement("th");
      timeSpent = document.createElement("th");
      editTime = document.createElement("th");
      chk.innerHTML = "";
      nam.innerHTML = "Name";
      cat.innerHTML = "Category";
      rat.innerHTML = "Rating";
      rev.innerHTML = "Reviews";
      timeSpent.innerHTML = "Recommended Duration(hrs)";
      editTime.innerHTML = "Edit time";

      tr.appendChild(chk);
      tr.appendChild(nam);
      tr.appendChild(cat);
      tr.appendChild(rat);
      tr.appendChild(rev);
      tr.appendChild(timeSpent);
      tr.appendChild(editTime);
      thead.appendChild(tr);
      table.appendChild(thead);

      for(var i=0;i<data.place.length;i++)
      {
        tr = document.createElement("tr");
        s=i+'';
        tr.setAttribute("id",data.place[i]['place_name']);
        //tr.setAttribute("id",s);
        
        box_chk = document.createElement("td");
        chk = document.createElement("input");
        chk.setAttribute("type","checkbox");
        checkId = "check"+data.place[i]['place_name'];
        chk.setAttribute("id",checkId);
        box_chk.appendChild(chk);
        
        nam= document.createElement("td");
        a = document.createElement('a');
        a.setAttribute('href',data.place[i]['url'])
        //a.setAttribute('href','abc.com');

        //this line causes link to open a new window
        a.setAttribute('target','_blank');
        a.innerHTML=data.place[i]['place_name'];
        //a.innerHTML='palace';
        nam.appendChild(a);

        cat= document.createElement("td");
        cat.innerHTML = data.place[i]['category_name'];

        rat= document.createElement("td");
        rat.innerHTML = data.place[i]['rating'];
        //rat.innerHTML = '4.5';

        rev = document.createElement("td");
        rev.innerHTML = data.place[i]['review'];
        //rev.innerHTML = '1500';

        timeSpent = document.createElement("td");
        timeSpent.innerHTML = data.place[i]['avg_time'];
        //timeSpent.innerHTML = '1.5'

        //small calc for min and max times since avg time is randomly taken from any of the multiple categories but we are getting only one categ from the db and avg time may not fall in its range
        console.log(categ_times[data.place[i]['category_name']],i);
        minTime = categ_times[data.place[i]['category_name']][0];
        maxTime = categ_times[data.place[i]['category_name']][1];
        if(data.place[i]['avg_time'] < minTime){
          minTime = data.place[i]['avg_time'];
        }
        else if(data.place[i]['avg_time'] > maxTime){
          maxTime = data.place[i]['avg_time']; 
        }

        box_editTime = document.createElement("td");
        //divMin = document.createElement("div");
        //divMin.innerHTML = minTime;
        editTime = document.createElement("input");
        editTime.setAttribute("type","range");
        slideId = "slide" + i;
        editTime.setAttribute("id",slideId);
        editTime.setAttribute("min",minTime);
        editTime.setAttribute("max",maxTime);
        editTime.setAttribute("value",data.place[i]['avg_time']);
        editTime.setAttribute("step","0.5");
        //divMax = document.createElement("div");
        //divMax.innerHTML = maxTime;
        //box_editTime.appendChild(divMin);
        box_editTime.appendChild(editTime);
        //box_editTime.appendChild(divMax);
        //editTime.setAttribute("onchange",function(){updateRecomTime(data.place[i]['place_name'],this.value);});
        //editTime.setAttribute("oninput",updateRecomTime(this,data.place[i]['place_name'],this.value));
        setTimeout(assign_event,50,slideId);

        tr.appendChild(box_chk);
        tr.appendChild(nam);
        tr.appendChild(cat);
        tr.appendChild(rat);
        tr.appendChild(rev);
        tr.appendChild(timeSpent);
        tr.appendChild(box_editTime);

        tbody.appendChild(tr);

        var pos=
        {
            lat:parseFloat(data.place[i]['latitude']) ,
          //  lat:parseFloat('12.56'+i) ,
            lng:parseFloat(data.place[i]['longitude']) 
          //  lng:parseFloat('75.89'+i) 
        }

        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: data.place[i]['place_name']
          //title: 'palace'
        });
        map.setCenter(pos);
        markers.push(marker);
        timer = setTimeout(click_assigner,50,data.place[i]['place_name']);
      }

      table.appendChild(tbody);

      //add button to calling func to check the checkboxes that are ticked
      
      button=document.getElementById('button');
      button.innerHTML = "";
      but = document.createElement("button");
      but.setAttribute("id","but");
      but.setAttribute("class","btn btn-success")
      but.setAttribute("type","button");
      but.innerHTML="Choose";
      //but.setAttribute("onclick","checkClick()");
      //does the same as above but with parameters
      but.addEventListener("click", function(event) {
        checkClick();
        event.preventDefault();
      });
      
      button.appendChild(but);
    }
  }
  waypoint=[];

  function find_min(arr)
  {

    var min=arr[0];
    var pos=0;
    for(var i=1;i<arr.length;i++)
    {
      if(min>arr[i])
      {
        min=arr[i];
        pos = i;
      }
    }
    return pos;
  }

    MAX = 99999;
    function calculate_cost(matrix,wish_list)
    {
        res = [];
        console.log(matrix.length);
        for(i=0;i<matrix.length;i++)
        {
            temp = [];
            for(j=0;j<matrix.length;j++)
            {
                if(i == j || j ==0){
                    console.log("i j",i,j);
                    temp.push(MAX);
                }
                else if(j !=0){
                    ratingNorm = wish_list[j-1]['rating'] * 2; //Rating on scale of 10
                    avgTimeNorm = wish_list[j-1]['visit_time'] * 3; //Avg Time on scale of 10
                    travelTimeNorm = matrix[i][j] * 10; //Travel time on scale of 10
                    
                    score = travelTimeNorm - ratingNorm + avgTimeNorm;
                    //console.log(travelTimeNorm);
                    temp.push(score);
                }
            }
            res.push(temp);
        }
        console.log(res);
        console.log(matrix);
        calculate_waypoints(matrix,res,wish_list);
    }

  function calculate_waypoints(regi,cost_matrix,wish_list)
  {
    row=0;
    count =0;
    visited ={};
    while_breaker=false;
    
    while(Object.keys(visited).length<Object.keys(wish_list).length)
    {
        
        //console.log('outside while')
      col=find_min(cost_matrix[row]);
      console.log("cost min",cost_matrix[row]);
      while(true)
      {
            //console.log('inside while');
            console.log("wish_list",wish_list," col ",col-1);
        if(visited[wish_list[col-1]['name']] ==true)
        {
          if(count==Object.keys(wish_list).length)
          {
                    while_breaker=true;
            break;
          }
          else
          {
            cost_matrix[row][col]=999996;
            col = find_min(cost_matrix[row]);
          }

        }
        else
        {
          visited[wish_list[col-1]['name']]=true;
          count++;
          break;
        }

      }

      if(while_breaker==true)
        break;
        console.log("********remaining_time  ",remaining_time," travelling time ",regi[row][col]/3600.0," duration ",wish_list[col-1]['visit_time']);
      if(remaining_time-regi[row][col]/3600.0-wish_list[col-1]['visit_time']>regi[col][0]/3600.0)
      {
        remaining_time=remaining_time-regi[row][col]/3600.0-wish_list[col-1]['visit_time'];
            v_times.push(new Array(Math.floor(wish_list[col-1]['visit_time']), (wish_list[col-1]['visit_time']%1)*60));
            t_times.push(new Array(Math.floor(regi[row][col]/3600.0), Math.floor(((regi[row][col]/3600.0)%1)*60)));
            //temp = regi[row][col]/3600.0 + wish_list[col-1]['visit_time'] //adding travel and visit time
            //current_time.push(new Array(current_time[current_time.length-1][0]+Math.floor(temp), Math.floor(current_time[current_time.length-1][1]+(temp%1)*60))); //converting hrs in decimals to hrs,mins and adding to prev value of time
        waypoint.push({'location':new google.maps.LatLng(wish_list[col-1]['lat'],wish_list[col-1]['lng'])});
            shownPlaces.push(wish_list[col-1]['name']);
            //waypoint.push({'location': response.originAddresses[col]});
            row = col;
      } 
        else
        {
            break;
        }
        
    }
    t_times.push(new Array(Math.floor(regi[col][0]/3600.0), Math.floor(((regi[col][0]/3600.0)%1)*60)));
    if(waypoint.length>0)
    {
        var request = 
        {
            origin : cur_usr_lat+","+cur_usr_lng,
            destination : cur_usr_lat+","+cur_usr_lng,
            waypoints : waypoint,
            travelMode : 'DRIVING',
        };
        directionsService.route(request,function(response,status) {
                    if(status=='OK')
                    {
                        deleteMarkers();
                        var mysore = new google.maps.LatLng(12.2933, 79.6465);
                        var mapOptions = {
                                zoom:7,
                                center: mysore
                                }
                        map = new google.maps.Map(document.getElementById('map'),mapOptions);
                        directionsDisplay.setMap(map);
                    
                        directionsDisplay.setDirections(response);
                        console.log(shownPlaces);
                    }
                });

    }
    showPlaceNames(); 
  }


  //func to display times and places
  function showPlaceNames(){
    tab = document.createElement("table");
    tab.setAttribute("class","table-bordered");
    tab.setAttribute("border","1px solid black");
    tr = document.createElement("tr");
    arr = document.createElement("th");
    pla = document.createElement("th");
    dep = document.createElement("th");
    visitDuration = document.createElement("th");
    pla.innerHTML = "Place";
    arr.innerHTML = "Arrival";
    visitDuration.innerHTML = "Visit Time";
    dep.innerHTML = "Departure";
    tr.appendChild(pla);
    tr.appendChild(arr);
    tr.appendChild(visitDuration);
    tr.appendChild(dep);
    tab.appendChild(tr);

    div = document.getElementById("shownPlace");
    
    
    //div.innerHTML = start_time[0]+":"+start_time[1] + " User location" + "<br />";
    tr = document.createElement("tr");
    arr = document.createElement("td");
    pla = document.createElement("td");
    dep = document.createElement("td");
    visitDuration = document.createElement("td");
    arr.innerHTML = "-";
    pla.innerHTML = "User Location";
    dep.innerHTML = start_time[0]+":"+start_time[1];
    visitDuration.innerHTML = "-";
    tr.appendChild(pla);
    tr.appendChild(arr);
    tr.appendChild(visitDuration);
    tr.appendChild(dep);
    tab.appendChild(tr);
    current_time = start_time;
    x = Array.from(new Set(shownPlaces));
    console.log(v_times);
    console.log(t_times);
    
    for(i=0;i<x.length;i++){
        current_time[0] += t_times[i][0];
        current_time[1] += t_times[i][1];
        if(current_time[1] > 60){
            current_time[0] += Math.floor(current_time[1]/60);
            current_time[1] = current_time[1]%60;
        }
        //div.innerHTML += current_time[0]+":"+current_time[1] +" "+ x[i] + "<br />";
        tr = document.createElement("tr");
        arr = document.createElement("td");
        pla = document.createElement("td");
        dep = document.createElement("td");
        visitDuration = document.createElement("td");
        arr.innerHTML = current_time[0]+":"+current_time[1];
        pla.innerHTML = x[i];
        current_time[0] += v_times[i][0];
        current_time[1] += v_times[i][1];
        if(current_time[1] > 60){
            current_time[0] += Math.floor(current_time[1]/60);
            current_time[1] = current_time[1]%60;
        }
        dep.innerHTML = current_time[0]+":"+current_time[1];
        visitDuration.innerHTML = v_times[i][0]+":"+v_times[i][1];
        tr.appendChild(pla);
        tr.appendChild(arr);
        tr.appendChild(visitDuration);
        tr.appendChild(dep);
        tab.appendChild(tr);
    }
    current_time[0] += t_times[t_times.length-1][0];
    current_time[1] += t_times[t_times.length-1][1];
    if(current_time[1] > 60){
            current_time[0] += Math.floor(current_time[1]/60);
            current_time[1] = current_time[1]%60;
    }
    //div.innerHTML += current_time[0]+":"+current_time[1] + " User location" + "<br />";
    tr = document.createElement("tr");
    arr = document.createElement("td");
    pla = document.createElement("td");
    dep = document.createElement("td");
    visitDuration = document.createElement("td");
    arr.innerHTML = current_time[0]+":"+current_time[1];
    pla.innerHTML = "User location";
    dep.innerHTML = "-";
    visitDuration.innerHTML = "-";
    tr.appendChild(pla);
    tr.appendChild(arr);
    tr.appendChild(visitDuration);
    tr.appendChild(dep);
    tab.appendChild(tr);
    
    div.appendChild(document.createElement("br"));
    div.appendChild(tab);
    div.appendChild(document.createElement("br"));
  }




function checkClick(){
    //clearing all globals for every time places are chosen
    wish_list={};
    shownPlaces = [];
    waypoint = [];
    
    placeLocations = [];

    count =0;
    console.log("lat lng",typeof(cur_usr_lat), cur_usr_lng);
    org =[];
    org.push({'location': new google.maps.LatLng(cur_usr_lat,cur_usr_lng)});

    //calculate clusters
    for(i=0;i<data.place.length;i++)
    {
        checkId = "check"+data.place[i]['place_name'];
        if(document.getElementById(checkId).checked)
        {
            //toSend = toSend + data.place[i]['place_id'] + ";";
            temp = [data.place[i]['latitude'], data.place[i]['longitude']];
            placeLocations.push(temp);
        }
    }
    days = Math.min(days, placeLocations.length);
    clusterMaker.k(days);
    clusterMaker.iterations(1000);
    clusterMaker.data(placeLocations);
    cluster_data = clusterMaker.clusters();
    //console.log("CLUSTER: ",cluster_data);

    clusterPlaces = [];
    for(i=0; i<days; i++){
        clusterPlaces[i] = [];
        for(j=0; j<cluster_data[i]['points'].length; j++)
            for(k=0;k<data.place.length;k++){
                if(cluster_data[i]['points'][j][0]==data.place[k]['latitude'] && cluster_data[i]['points'][j][1]==data.place[k]['longitude']){
                    //console.log("COmparing",cluster_data[i]['points'][j][0],data.place[k]['latitude'],"FOR",data.place[k]);
                    clusterPlaces[i].push(data.place[k]);
                }
            }
    }
    day_select();
    //console.log("CLUSter",clusterPlaces);
    /*
    for(i=0;i<data.place.length;i++)
    {
        checkId = "check"+data.place[i]['place_name'];
        if(document.getElementById(checkId).checked)
        {
            wish_list[count]={'name':data.place[i]['place_name'],'visit_time':data.place[i]['avg_time'],'lat':data.place[i]['latitude'],'lng':data.place[i]['longitude'],'rating':data.place[i]['rating_score']};
            count++;
            org.push({'location':new google.maps.LatLng(data.place[i]['latitude'],data.place[i]['longitude'])});
        }
    }*/

}

function dropdown_click(event){
    days_dropdown = document.getElementById('days_dropdown');
    id = event.currentTarget.id;
    temp=id.split(" ");
    day=Number(temp[1]);
}

function day_select(event){
    org =[];
    toSend = "";
    start_time = [];
    start_time[0] = initial_times[0];
    start_time[1] = initial_times[1];
    remaining_time = initial_times[2];
    org.push({'location': new google.maps.LatLng(cur_usr_lat,cur_usr_lng)});
    for(i=0; i<clusterPlaces.length; i++){
        if(i == (day -1)){
            for(j=0; j<clusterPlaces[i].length; j++){
                toSend = toSend + clusterPlaces[i][j]['place_id'] + ";";
                wish_list[count]={'name':clusterPlaces[i][j]['place_name'],'visit_time':clusterPlaces[i][j]['avg_time'],'lat':clusterPlaces[i][j]['latitude'],'lng':clusterPlaces[i][j]['longitude'],'rating':clusterPlaces[i][j]['rating_score']};
                count++;
                org.push({'location':new google.maps.LatLng(clusterPlaces[i][j]['latitude'],clusterPlaces[i][j]['longitude'])});
            }
        }
    }
    poi_to_usr=[];
    for(i=1;i<org.length;i++)
    {
        var request = 
        {
            origins:[org[i]],
            destinations:[org[0]],
            travelMode:'DRIVING'
        };

        service.getDistanceMatrix(request,function(response,status)
        {
        //console.log("hai");
           if (status=='OK') 
            {
                //console.log(response);
                poi_to_usr.push(response.rows[0].elements[0]['duration']['value']);
                
            }
            else 
            {
                //console.log(status);
            }
        });
    }
    //console.log("------------",poi_to_usr);
    //setTime out needed because cal_orgi function and above for loop both gets executed simultaniously .
    orgi=[];
    console.log("POI",toSend,poi_to_usr);
    setTimeout(function(){
        cal_orgi(poi_to_usr,org,wish_list,toSend)
    },3000);
  
  }

  //func to recieve cached data
  function cal_orgi(poi_to_usr,org,wish_list,toSend)
  {
    var request =
    {
      origins : [{'location': new google.maps.LatLng(cur_usr_lat,cur_usr_lng)}],
      destinations : org,
      travelMode : 'DRIVING'
    }
    service.getDistanceMatrix( request,function (response,status) {
      if(status=='OK')
      {
        console.log(response);
        orgi=[]
        dest=[]
        for(i=0;i<response.rows[0].elements.length;i++)
        {              
            dest.push(response.rows[0].elements[i]['duration']['value']);
        }
        orgi.push(dest);
        rr=orgi;
        console.log("origin for distance matrix ",rr);
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () 
        {
            if(xhr.readyState=='4'&& xhr.status==200)
                  {
                    cached_data = JSON.parse(xhr.responseText);
                    //console.log("cached_data before",cached_data);
                    for(i=0;i<Object.keys(cached_data).length;i++)
                    {
                        cached_data[i].splice(0,0,poi_to_usr[i]);
                        cached_data[i].splice(i+1,0,0);
                    }
                    console.log("cached_data after ",cached_data);
                    for(i=0;i<Object.keys(cached_data).length;i++)
                    {
                          dest=[]
                          //console.log(cached_data[i].length);
                          for(j=0;j<cached_data[i].length;j++)
                          {
                            if(typeof(cached_data[i][j])==="number")
                                {
                                    //console.log("inside number")
                                    dest.push(cached_data[i][j]);
                                }
                            else
                                {
                                    dest.push(Number(cached_data[i][j]['duration']));
                                }                          
                                                        
                          }
                          orgi.push(dest);
                    } 
                    r=orgi; 
                    console.log("at the end orgi : ",r);
              }
        }
        
        xhr.open("GET","http://localhost/Project/cache.php?places="+encodeURIComponent(toSend),true);
        xhr.send();

        
      }
      else
      {
        window.alert("Distance matrix request failed due to "+status);
      }
    });
    setTimeout(function(){
            calculate_cost(orgi,wish_list);
        },3000);
  }

    //Intermediate function to bind the slider with the function to change recommended value
    function assign_event(id)
    {
        editTime = document.getElementById(id);
        while(true){
            if(editTime!=null){
                editTime.addEventListener('change',updateRecomTime,true);
                break;
            }
            else
                editTime = document.getElementById(id);       
        }
    }

    //func to update recommended time
    function updateRecomTime(event){
      editTime = document.getElementById(event.target.id);
      tr = document.getElementById(event.target.parentNode.parentNode.id);
      while(true){
        if(typeof(editTime.value) != 'undefined'){
          tr.childNodes[5].innerHTML = editTime.value;
          //now updating the value in data
          lim = data.place.length;
          for(var i=0;i<lim;i++){
            if(data.place[i]['place_name'] == tr.childNodes[1].childNodes[0].innerHTML){
              data.place[i]['avg_time'] = Number(editTime.value);
            }
          }
          break;
        }
        else{
          editTime = document.getElementById(event.target.id);
        }
      }
    }
    
    
     