<?php
require_once('../inc/db_functions.php');dbConnect();
$actionRequest = $_POST["action"];

if(!is_null($actionRequest)) {
	switch($actionRequest) {
		case "resetAliases":
			repopulateAliases();			break;	}}dbClose();?>