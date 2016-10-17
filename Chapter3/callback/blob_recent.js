var http = require('http');
var fs = require('fs');

// http.createServer(function(req,res){
// 	if(req.url == '/'){
// 		fs.readFile('./title.json',function(err,data){
// 			if(err){
// 				console.error(err);
// 				res.end('Server Error');
// 			}else{
// 				var titles = JSON.parse(data.toString());
// 				fs.readFile('./template.html',function(err,data){
// 					if(err){
// 						console.error(err);
// 						res.end('Server Error');		
// 					}else{
// 						var tmpl = data.toString();
// 						var html = tmpl.replace('%',titles.join('<li></li>'));
// 						res.writeHead(200,{'Content-Type':'text/html'});
// 						res.end(html);
// 					}
// 				});
// 			}
// 		});
// 	}
// }).listen(8000,'127.0.0.1');

http.createServer(function(req, res) {
	if (req.url == '/') {
		getTitles(res);
	}
}).listen(8000, '127.0.0.1');

function getTitles(res) {
	fs.readFile('./title.json', function(err, data) {
		if (err) {
			handleError(err,res);
		} else {
			var titles = JSON.parse(data.toString());
			fs.readFile('./template.html', function(err, data) {
				getTemplate(titles,data.toString(), err,res)
			});
		}
	});
}

function getTemplate(titles,tmpl, err,res) {
	if (err) {
		handleError(err,res);
	} else {
		var html = tmpl.replace('%', titles.join('<li></li>'));
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end(html);
	}
}

function handleError(error, res) {
	console.error(error);
	res.end('Server Error');
};