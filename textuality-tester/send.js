var request = require('request');
var texts = require('./test-texts');

var host = "http://localhost";
var port = 3000;
var path = "/textHandler";

var text = texts.normal;
text.Body = process.argv[2];

console.log(text.Body);

request({
	url: host + ':' + port + path,
	method: 'POST',
	json: true,
	body: texts.normal
});

