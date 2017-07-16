var express = require('express'),
	app = express(),
	port = 3000,
	fs = require('fs'),
	bodyParser = require('body-parser'),
	responseBody = JSON.parse(process.argv[2]);
	
app.listen(port);
app.use(bodyParser.json({limit: '50mb'}));

var logFile = fs.openSync('requests.log', 'w');
fs.appendFileSync(logFile, '[');

var isFirst = true;
var handler = function (req, res) {
	var logContent = JSON.stringify(req.body);
	if (isFirst) {
		isFirst = false;
	}
	else {
		logContent = ',' + logContent;
	}
	fs.appendFileSync(logFile, logContent);
	res.set({
        'content-type': 'application/json'
    }).send(responseBody);
	//res.json(responseBody);
};


app.all('/EXIT', function(req, res) {
	console.log('exiting');
	res.send('EXITING');
	fs.appendFileSync(logFile, ']');
	process.exit();
});

app.all('*', handler);

console.log('We have liftoff, responsding to all requests with: ' + JSON.stringify(responseBody));