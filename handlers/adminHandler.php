<?php

$actionRequest = $_POST["action"];

if(!is_null($actionRequest)) {
	switch($actionRequest) {
		case "resetAliases":
			repopulateAliases();