<?php

require_once('inc/db_functions.php');

$mysqli = new mysqli('localhost','metfingo_user','steelpen','metfingo_textuality');

/* check connection */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}

/* Select queries return a resultset */
$testQuery = $mysqli->query("INSERT INTO texts(SmsSid,PhoneNumber,Body) VALUES('000','000','Text message sample (not from Twilio)')");

echo $testQuery;

$mysqli->close();

?>