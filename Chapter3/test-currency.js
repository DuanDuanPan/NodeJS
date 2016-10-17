// var currency = require('./currency');

// console.log('50 Canadian dollars equals this amount of US dollars:');
// console.log(currency.canadianToUS(50));
// console.log('30 US dollars equals this amount of Canaidan dollars');
// console.log(currency.USToCanadian(30));

var Currency = require('./currency');

var currency = new Currency(0.91);

console.log('50 Canadian dollars equals this amount of US dollars:');
console.log(currency.canadianToUS(50));
console.log('30 US dollars equals this amount of Canaidan dollars');
console.log(currency.USToCanadian(30));
