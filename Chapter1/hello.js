var fs = require('fs');
fs.readFile('hello.json', function(err, data) {
	console.log(data);
});