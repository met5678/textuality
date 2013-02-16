<html>
<head>
<link rel="stylesheet" type="text/css" href="/textuality/css/textuality_base.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
<button id="resetTexts">Reset texts table</button>
<button id="resetPhoneNumbers">Reset phone number table</button>
<button id="resetAliases">Reset alias table from file</button>
<button id="gitUpdate">Update from Git</button><script>(function($) {	var adminUrl = "http://www.metfingo.com/textuality/handlers/adminHandler.php";	$('#resetAliases').click(function() {		$.post(adminUrl,{			"action":"resetAliases"		}, function(){ 			console.log("Admin success");		});	});})(jQuery);</script>
</body>
</html>