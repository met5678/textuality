<?php

require_once('../inc/db_functions.php');

if($_POST['SmsSid']) {

	$phoneNumber = $_POST['From'];
	$content = $_POST['Body'];
	$smsSid = $_POST['SmsSid'];

	$isNewNumber = isNewNumber($phoneNumber);
	
	
	
	if($isNewNumber) {
		sendWelcomeText();
	}


	$handle = fopen('debugText.txt','w');


	fwrite($handle,print_r($_POST,true));
	fclose($handle);
}




function sendWelcomeText() {
	echo '<?xml version="1.0" encoding="UTF-8"?>';
	?>
<Response>
	<Sms>Welcome to #textuality, creature. Text me notes of love, lust, or libel, and I will anonymously broadcast them to all. Unfaithfully yours, ~</Sms>
</Response>
	<?php
}
?>