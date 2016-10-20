function asyncFunction(callBack) {
	setTimeout(callBack, 200);
}

var color = 'blue';

//闭包冻结参数
(function(color) {
	asyncFunction(function() {
		console.log('The color is ' + color);
	});
})(color);

asyncFunction(function() {
	console.log('The color is ' + color);
});

color = 'green';


var flow = require('nimble');

flow.series([
	function(callback){
		setTimeout(function(){
			console.log('I execute first.');
			callback();
		},1000);
	},
	function(callback){
		setTimeout(function(){
			console.log('I execute next.');
			callback();
		},500);
	},
	function(callback){
		setTimeout(function(){
			console.log('I execute last.');
			callback();
		},100);
	}
]);