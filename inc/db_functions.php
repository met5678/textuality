<?php

$db = null;

function dbConnect() {
	global $db;

	$db = new mysqli('localhost','metfingo_user','steelpen','metfingo_textuality');
}

function dbClose() {
	global $db;

	$db->close();
	
	writeToDebug("------------------");
}

function writeToDebug($debugText) {
	file_put_contents("/home/metfingo/public_html/textuality/data/debug.txt",$debugText . "\n",FILE_APPEND);
}

function queryPhoneNumber($number) {
	writeToDebug("Querying phone number: $number");

	global $db;

	$queryString = "SELECT * FROM PhoneNumber WHERE PhoneNumber='$number'";
	
	$result = $db->query($queryString);
	
	if($result->num_rows == 0) {
		writeToDebug("Phone number not found");
		return null;
	}
	else {
		$row = $result->fetch_assoc();
		writeToDebug("Phone number found, ID:".$row['PNID']);
		return $row;
	}
}

function addPhoneNumber($number,$zipcode,$state,$city) {
	writeToDebug("Adding phone number: $number");

	global $db;

	$insertString = "INSERT INTO PhoneNumber(PhoneNumber,Zipcode,State,City) VALUES('$number','$zipcode','$state','$city')";
	$db->query($insertString);
	$numberRecord = queryPhoneNumber($number);
	
	return $numberRecord;
}

function recordText($numberRecord,$content,$smsSid,$flag) {
	writeToDebug("Recording text '$content' for number: $number");
	
	global $db;
	
	$currentAlias = $numberRecord['Alias'];
	$pnid = $numberRecord['PNID'];
	$safeContent = $db->escape_string($content);
	
	$db->query("INSERT INTO texts(SmsSid,PNID,Body,Alias,Flag) VALUES('$smsSid',$pnid,'$safeContent','$currentAlias',$flag)");
	if($flag != 2) {
		$db->query("UPDATE PhoneNumber SET UsedAlias=1 WHERE PNID=$pnid");
	}
}

function assignNewAlias($numberRecord) {
	writeToDebug("Assigning new alias to phone number " . $numberRecord['PhoneNumber']);

	global $db;

	// If they never used this alias, release it
	$numberID = $numberRecord['PNID'];
	
	$oldAlias = $numberRecord['Alias'];
	
	if($numberRecord['UsedAlias'] == 0 && $numberRecord['Alias'] != null) {
		$db->query("UPDATE Alias SET Used=0 WHERE Alias='$oldAlias'");
	}
	
	$unusedAliases = $db->query("SELECT * FROM Alias WHERE Used=0");
	
	$randomRowNum = rand(0,$unusedAliases->num_rows-1);
	
	$unusedAliases->data_seek($randomRowNum);
	
	$randomRow = $unusedAliases->fetch_assoc();
	
	$aliasID = $randomRow['AliasID'];
	$alias = $randomRow['Alias'];
	
	writeToDebug("Assigned '$alias' to " . $numberRecord['PhoneNumber']);
	
	$db->query("UPDATE Alias SET Used=1 WHERE AliasID=$aliasID");
	$db->query("UPDATE PhoneNumber SET Alias='$alias', UsedAlias=0 WHERE PNID=$numberID");
	
	$numberRecord = queryPhoneNumber($numberRecord['PhoneNumber']);
	
	return $numberRecord;
}

function repopulateAliases() {
	global $db;

	$db->query("DELETE FROM Alias");
	
	$allAliases = file_get_contents("/home/metfingo/public_html/textuality/data/aliases.txt");
		
	$aliasArray = explode("\n", $allAliases);

	foreach($aliasArray as $iAlias) {
		if(strlen($iAlias) > 0) {
			$db->query("INSERT INTO Alias(Alias) VALUES('$iAlias')");
		}
	}
}

function getNormalTexts($numTexts) {
	global $db;
	
	$resultTexts = $db->query("SELECT TID, Body, Alias, Timestamp FROM texts WHERE Flag=0 ORDER BY Timestamp DESC LIMIT $numTexts");
	
	$textArray = array();
	
	while($row = $resultTexts->fetch_assoc()) {
		$date = new DateTime($row['Timestamp']);
		$row['Timestamp'] = $date->format("U");
		array_push($textArray,$row);
	}
	
	return $textArray;
}

?>