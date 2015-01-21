<?php

require_once('../inc/db_functions.php');

if($_POST['SmsSid']) {
	$phoneNumber = $_POST['From'];
	$content = $_POST['Body'];
	$smsSid = $_POST['SmsSid'];
	$zipcode = $_POST['FromZip'];
	$state = $_POST['FromState'];
	$city = $_POST['FromCity'];
	
	$isNewNumber = false;
	$isNewAlias = false;
	$flag = 0;
	
	dbConnect();

	$numberRecord = queryPhoneNumber($phoneNumber);
	if(is_null($numberRecord)) {
		$numberRecord = addPhoneNumber($phoneNumber,$zipcode,$state,$city,$db);
		$isNewNumber = true;
		
		$numberRecord = assignNewAlias($numberRecord);
		$isNewAlias = true;
	}
		
	if(stristr($content,"#change") && !$isNewNumber) {
		$numberRecord = assignNewAlias($numberRecord);
		$isNewAlias = true;
		$flag = 2;
	}
	else {
		
	}
	
	recordText($numberRecord,$content,$smsSid,$flag);
	
	$responseTexts = array();
	
	if($isNewNumber) {
		array_push($responseTexts,"Welcome to #textuality, creature. Text me notes of love, lust, or libel, and I will anonymously broadcast them to all. Unfaithfully yours, ~");
	}
	if($isNewAlias) {
		if($isNewNumber) {
			array_push($responseTexts,"I bestow upon you the alias '" . $numberRecord['Alias'] . "'. I believe this alias embodies you... if you disagree, text '#change' to me.");
		}
		else {
			array_push($responseTexts,"Your new alias is '" . $numberRecord['Alias'] . "'. I have reached my fingers into your essence, and think this fits you perfectly.");
		}
	}
	
	echo '<?xml version="1.0" encoding="UTF-8"?><Response>';
	foreach($responseTexts as $responseText) {
		echo "<Sms>$responseText</Sms>";
	}
	echo '</Response>';
	
	writeToDebug("End of conditional");

	dbClose();
}


?>