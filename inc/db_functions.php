<?php

function dbConnect() {
	$db = new mysqli('localhost','metfingo_user','steelpen','metfingo_textuality');
	return $db;
}

function addToDb($weatherData) {
	$db = connect();
	mysql_query($queryString);
	$id = mysql_insert_id($db);
	insertCurrent($id,$weatherData->currentConditions,$db);
	//insertForecasts($id,$weatherData->dayForecasts,$db);
	mysql_close($db);
}

?>