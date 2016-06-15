/**
 * Required modules and instances
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	SpotifyAPI = require('./lib/spotify/Spotify.js'),
	MshuffleAPI = require('./lib/mshuffle/Mshuffle.js');


/**
 * Set up app for express
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/site"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: SpotifyAPI.generateState(16)}));


/**
 * Helpers
 */

onErrorDisplay = function (error, error_code) {
	// Handle errors
	if (error === undefined) {
		console.error("Error: " + error);
	} else {
		console.error("An Unknown Error Occurred");
	}
};

onErrorStatus = function (res, status, message) {
	res.status(status).send(message);
}


/**
 * Routes
 */

/**
 * Home Route (/)
 * Use this end point to render the web page
 */
app.post('/', function (req, res) {
	res.render("index.html");
});

/**
 * User info Route (/user-info)
 * Use this end point to get user information (name, etc.)
 */
app.get('/user-info', function (req, res) {
	var onSuccess = function (data) {
			res.status(200).send(data);
		},
		onError = function (status, message) {
			onErrorStatus(res, status, message);
		};

	SpotifyAPI.getUserInfo(req, onSuccess, onError);
});

/**
 * Playlists Route (/playlists)
 * Use this end point to get a user's playlists
 */
app.get('/playlists', function (req, res) {
	var onSuccess = function (data) {
			res.status(200).send(data);
		},
		onError = function (status, message) {
			onErrorStatus(res, status, message);
		};

	SpotifyAPI.getPlaylists(req, onSuccess, onError);
});

/**
 * Playlist Route (/playlists/{owner_id}/{playlist_id})
 * Use this end point to retrieve a playlist and apply mshuffle to it
 * for a new listening session
 */
app.get('/playlists/:ownerId/:playlistId', function (req, res) {
	var onSuccess = function (data) {
			// After retrieving the playlist,
			// load it into mshuffle
			MshuffleAPI.load(req.session.access_token, data.playlist);

			// Return success
			res.status(200).send(MshuffleAPI.getSession(req.session.access_token));
		},
		onError = function (status, message) {
			onErrorStatus(res, status, message);
		};

	SpotifyAPI.getPlaylist(req, req.params.ownerId, req.params.playlistId, onSuccess, onError);
});

/**
 * Next route (/next)
 * Use this end point to ask mshuffle to generate the next song to play
 */
app.get('/next', function (req, res) {
	res.status(200).send(MshuffleAPI.next(req.session.access_token));
});

/**
 * Skip route (/skip)
 * Use this end point to ask mshuffle to skip to the next song to play,
 * with an implication that the user did not want to listen to the song
 */
app.get('/skip', function (req, res) {
	res.status(200).send(MshuffleAPI.skip(req.session.access_token));
});

/**
 * Enjoy route (/enjoy)
 * Use this end point to inform mshuffle that the current song was enjoyed
 * by the user
 */
app.get('/enjoy', function (req, res) {
	res.status(200).send(MshuffleAPI.enjoy(req.session.access_token));
});

/**
 * Dislike route (/dislike)
 * Use this end point to inform mshuffle that the current song was disliked
 * by the user
 */
app.get('/dislike', function (req, res) {
	res.status(200).send(MshuffleAPI.dislike(req.session.access_token));
});

/**
 * Probability Mass Function route (/pmf)
 * Use this end point to retrieve the current PMF for the current song shuffling
 */
app.get('/pmf', function (req, res) {
	res.status(200).send(MshuffleAPI.pmf(req.session.access_token));
});

/**
 * Log in Route (/login)
 * Use this end point to allow a user to route to the music service's login
 */
app.get('/login', function (req, res) {
	SpotifyAPI.login(req, res);
});

/**
 * Callback Route for Music service Auth (/callback)
 * Use this end point as a callback from a music service's authentication
 */
app.get('/callback', function (req, res) {
	var onSuccess = function (access_token, refresh_token) {
		// Route to index (session already set with access and refresh tokens)
		res.redirect('/');
	};

	SpotifyAPI.callback(req, res, onSuccess, onErrorDisplay);
});

/**
 * Refresh token Route for Music service Auth (/refresh_token)
 * Use this end point to acquire a new access token for the music service's authentication
 */
app.get('/refresh-token', function (req, res) {
	var onSuccess = function (access_token) {
		// Route to index (session already set with new access token)
		res.redirect('/');
	};

	SpotifyAPI.refreshToken(req, res, onSuccess, onErrorDisplay);
});


/**
 * Make app listen on specified port
 */
app.listen(app.get('port'), function () {
	console.log("Server on port", app.get('port'));
});