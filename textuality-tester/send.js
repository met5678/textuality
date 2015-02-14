var request = require('request');
var texts = require('./test-texts');

var host = "http://localhost";
var port = 3000;
var path = "/textHandler";

if(process.argv.length >= 4 && process.argv[3] == '-i') {
	console.log("yes");	var text = texts.pic_no_text;
}
else {
	var text = texts.normal;
}

text.Body = process.argv[2];

console.log(text.Body);

request({
	url: host + ':' + port + path,
	method: 'POST',
	json: true,
	body: text
});
