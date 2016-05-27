/**
 * Required modules and instances
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	cookieParser = require('cookie-parser'),
	SpotifyAPI = require('./lib/spotify/SpotifyAPI.js');


/**
 * Set up app for express
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/site"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/**
 * Routes
 */

/**
 * Home Route (/)
 */
app.post('/', function (req, res) {
	res.render("index.html");
});

/**
 * Log in Route (/login)
 */
app.get('/login', function (req, res) {
	SpotifyAPI.login(res);
});


/**
 * Make app listen on specified port
 */
app.listen(app.get('port'), function () {
	console.log("Server on port", app.get('port'));
});