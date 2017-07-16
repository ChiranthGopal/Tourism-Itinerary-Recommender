<?php
	extract($_GET);
	//echo $category;

	#Connect to database
	$conn = mysql_connect('127.0.0.1','root','');
	if(!$conn)
	{	
		die("Could not connect to database server");
	}

	#Select database name
	$db = mysql_select_db('test1');
	if(!$db)
	{
		die("Could not select database");
	}
	
	#Categories are separated by colon, so separate them
	$arr = explode(";",$places,-1);
	
	$results = array();

	for($i=0; $i<count($arr); $i++){
		for($j=0; $j<count($arr); $j++){
			if($i != $j){
				$query = "SELECT src_place,dest_place,distance,time FROM cachedPlaces WHERE src_place = '$arr[$i]' AND dest_place = '$arr[$j]';";
				$temp = mysql_query($query);
				$results[] = mysql_fetch_array($temp,MYSQL_ASSOC);
			}
		}
	}

	#print_r($results);
	
	$final_res = [];
	for ($i=0; $i < count($arr); $i++) { 
		$final_res[$i] = [];
		for ($j=0; $j < count($results); $j++) { 
			if($arr[$i] == $results[$j]['src_place']){
				$temp=[];
				$temp["distance"]= $results[$j]['distance'];
				$temp["duration"]= $results[$j]['time'];
				//$temp = json_encode($temp);
				#print_r($temp);
				array_push($final_res[$i], $temp);
			}
		}
	}
	//print_r($final_res);
	#Send the array as a JSON object
	echo json_encode($final_res,JSON_UNESCAPED_SLASHES);
	#if(!$found)
	#{
	#	echo '<h2>NO RESULTS..SORRY :( </h2>';
	#}
?>