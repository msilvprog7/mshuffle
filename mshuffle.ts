/**
 * Required modules and instances
 */
import express = require("express");
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import session = require("express-session");

import SpotifyAPI from "./lib/music/spotify/SpotifyAPI";

import {Playlist} from "./shared/music";

import {BaseMshuffleAPI} from "./shared/mshuffle";
import MshuffleAPI from "./lib/mshuffle/MshuffleAPI";

import {RedirectInfo, RequestError, RequestSuccess} from "./shared/http";

import {Authorization} from "./shared/auth";


/**
 * Set up app for express
 */
let app: express.Application = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + "/site"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: SpotifyAPI.GenerateState(16)}));

/**
 * Set up Mshuffle API
 */
let mshuffleAPI: BaseMshuffleAPI = new MshuffleAPI();


/**
 * Routes
 */

/**
 * Home Route (/)
 * Use this end point to render the web page
 */
app.post('/', function (req: express.Request, res: express.Response) {
	res.render("index.html");
});

/**
 * User info Route (/user-info)
 * Use this end point to get user information (name, etc.)
 */
app.get('/user-info', function (req: express.Request, res: express.Response) {
	mshuffleAPI.getMusicAPI().getUser(
		Authorization.make(req.session["access_token"], req.session["refresh_token"]),
		RequestSuccess.make(function (data?: any): void {
			res.status(200).send(data);
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Playlists Route (/playlists)
 * Use this end point to get a user's playlists
 */
app.get('/playlists', function (req: express.Request, res: express.Response) {
	mshuffleAPI.getMusicAPI().getPlaylists(
		Authorization.make(req.session["access_token"], req.session["refresh_token"]),
		RequestSuccess.make(function (data?: any): void {
			res.status(200).send(data);
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Playlist Route (/playlists/{owner_id}/{playlist_id})
 * Use this end point to retrieve a playlist and apply mshuffle to it
 * for a new listening session
 */
app.get('/playlists/:userId/:playlistId', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);

	mshuffleAPI.getMusicAPI().getPlaylist(
		auth,
		req.params.userId,
		req.params.playlistId,
		RequestSuccess.make(function (data?: any): void {
			if (Playlist.IsPlaylist(data)) {
				mshuffleAPI.createListeningSession(auth, data);
				res.status(200).send(mshuffleAPI.getListeningSession(auth).playlist);
			} else {
				console.error("Unable to retrieve a proper playlist from the Music API");
			}
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Next route (/next)
 * Use this end point to ask mshuffle to generate the next song to play
 */
app.get('/next', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);
	res.status(200).send(mshuffleAPI.next(auth));
});

/**
 * Skip route (/skip)
 * Use this end point to ask mshuffle to skip to the next song to play,
 * with an implication that the user did not want to listen to the song
 */
app.get('/skip', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);
	res.status(200).send(mshuffleAPI.skip(auth));
});

/**
 * Enjoy route (/enjoy)
 * Use this end point to inform mshuffle that the current song was enjoyed
 * by the user
 */
app.get('/enjoy', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);

	mshuffleAPI.enjoy(
		auth,
		RequestSuccess.make(function (data?: any): void {
			res.status(200).send(data);
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Dislike route (/dislike)
 * Use this end point to inform mshuffle that the current song was disliked
 * by the user
 */
app.get('/dislike', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);

	mshuffleAPI.dislike(
		auth,
		RequestSuccess.make(function (data?: any): void {
			res.status(200).send(data);
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Probability Mass Function route (/pmf)
 * Use this end point to retrieve the current PMF for the current song shuffling
 */
app.get('/pmf', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);
	res.status(200).send(mshuffleAPI.getPMF(auth));
});

/**
 * Log in Route (/login)
 * Use this end point to allow a user to route to the music service's login
 */
app.get('/login', function (req: express.Request, res: express.Response) {
	let redirectInfo: RedirectInfo = mshuffleAPI.getMusicAPI().login();

	// Set cookies
	for (let cookieKey of Object.keys(redirectInfo.cookies)) {
		res.cookie(cookieKey, redirectInfo.cookies[cookieKey]);
	}

	// Redirect
	res.redirect(redirectInfo.url);
});

/**
 * Callback Route for Music service Auth (/callback)
 * Use this end point as a callback from a music service's authentication
 */
app.get('/callback', function (req: express.Request, res: express.Response) {
	mshuffleAPI.getMusicAPI().authCallback(
		req,
		res,
		RequestSuccess.make(function (data?: any): void {
			if (Authorization.IsAuthorization(data)) {
				// Set access and refresh tokens for the user's session
				req.session["access_token"] = data.accessToken;
				req.session["refresh_token"] = data.refreshToken;

				// Redirect to index
				res.redirect("/");
			} else {
				res.status(403).send("Could not set Authorization from Music API");
			}
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});

/**
 * Refresh token Route for Music service Auth (/refresh_token)
 * Use this end point to acquire a new access token for the music service's authentication
 */
app.get('/refresh-token', function (req: express.Request, res: express.Response) {
	let auth: Authorization = Authorization.make(req.session["access_token"], req.session["refresh_token"]);

	mshuffleAPI.getMusicAPI().refreshToken(
		auth,
		RequestSuccess.make(function (data?: any): void {
			if (Authorization.IsAuthorization(data)) {
				// Set access and refresh tokens for the user's session
				req.session["access_token"]= data.accessToken;
				req.session["refresh_token"] = data.refreshToken;

				// Redirect to index
				res.redirect("/");
			} else {
				res.status(403).send("Could not refresh Authorization using Music API");
			}
		}),
		RequestError.make(function (statusCode: number, errorMessage: string): void {
			console.error(`${statusCode}: ${errorMessage}`);
			res.status(statusCode).send(errorMessage);
		}));
});


/**
 * Make app listen on specified port
 */
app.listen(app.get('port'), function () {
	console.log("Server on port", app.get('port'));
});
