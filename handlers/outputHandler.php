<?php

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

require_once('../inc/db_functions.php');

dbConnect();

$normalTexts = getNormalTexts(30);

$jsonRoot = array(
	"texts" => $normalTexts
);

echo json_encode($jsonRoot);

dbClose();

?>