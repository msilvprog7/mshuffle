/**
 * Required modules and instances
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();


/**
 * Set up app for express
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/site"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/**
 * Routes
 */

/**
 * Home Route (/)
 */
app.post('/', function (request, response) {
	res.render("index.html");
});


/**
 * Make app listen on specified port
 */
app.listen(app.get('port'), function () {
	console.log("Server on port", app.get('port'));
});