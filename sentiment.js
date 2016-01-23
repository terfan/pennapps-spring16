var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

var myText = "Whoa, AlchemyAPI's Node.js SDK is really great, I can't wait to build my app!";
alchemyapi.sentiment("text", myText, {}, function(response) {
console.log("Sentiment: " + response["docSentiment"]["type"]);
});