/**
 * Required modules and instances
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	cookieParser = require('cookie-parser'),
	SpotifyAPI = require('./lib/spotify/SpotifyAPI.js'),
	error;


/**
 * Set up app for express
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/site"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/**
 * Helpers
 */

onError = function (error, error_code) {
	// Handle errors
	if (error === undefined) {
		console.error("Error: " + error);
	} else {
		console.error("An Unknown Error Occurred");
	}
};


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
 * User info Route (/user-info)
 */
app.get('/user-info', function (req, res) {
	SpotifyAPI.getUserInfo(req, res);
});

/**
 * Log in Route (/login)
 */
app.get('/login', function (req, res) {
	SpotifyAPI.login(req, res);
});

/**
 * Callback Route for Spotify Auth (/callback)
 */
app.get('/callback', function (req, res) {
	var onSuccess = function () {
		// Route to index
		res.redirect('/');
	};

	SpotifyAPI.callback(req, res, onSuccess, onError);
});


/**
 * Make app listen on specified port
 */
app.listen(app.get('port'), function () {
	console.log("Server on port", app.get('port'));
});