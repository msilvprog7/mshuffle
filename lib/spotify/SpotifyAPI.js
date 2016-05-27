/**
 * Method of interacting with Spotify's Web API
 */
var SpotifyAPI = (function () {
		var SpotifyCredentials = require('./SpotifyCredentials.js'),
			querystring = require('querystring'),
			request = require('request'),
			stateKey = 'spotify_auth_state',
			STATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
			access_token,
			refresh_token;

		return {
			/**
			 * Get information about the user
			 */
			getUserInfo: function (req, res) {
				var options = {
		          url: 'https://api.spotify.com/v1/me',
		          headers: { 'Authorization': 'Bearer ' + access_token },
		          json: true
		        };

		        // use the access token to access the Spotify Web API
		        request.get(options, function(error, response, body) {
		        	if (error !== undefined && error !== null) {
		        		// Send error
		        		res.status(error.status).send(error.message);
		        	} else if (body.error !== undefined) {
		        		// Send error
		        		res.status(body.error.status).send(body.error.message);
		        	} else {
		        		// Send user info
		        		res.status(200).send({
		        			logged_in: true,
		        			info: body
		        		});
		        	}
		        });
			},

			/** 
			 * Log in request to Spotify
			 * Based on /login in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
			 */
			login: function (req, res) {
				// Set the rand 16 char state
				var state = SpotifyAPI.generateState(16);
				res.cookie(stateKey, state);

				// Route to Spotify's login
				res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
						response_type: 'code',
						client_id: SpotifyCredentials.CLIENT_ID,
						scope: SpotifyCredentials.SCOPE,
						redirect_uri: SpotifyCredentials.REDIRECT_URI,
						state: state
					}));
			},

			/**
			 * Handle the callback from authorizing in login stage
			 * Based on /callback in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
			 */
			callback: function (req, res, success, error) {
				var code = req.query.code || null,
					state = req.query.state || null,
					storedState = req.cookies ? req.cookies[stateKey] : null,
					authOptions;
			 
					if (state === null || state !== storedState) {
						// Error: State mismatch
						error('Spotify API state mismatch', 'state_mismatch');
					} else {
						// Clear state and request an authorization tokens
						res.clearCookie(stateKey);

						authOptions = {
							url: 'https://accounts.spotify.com/api/token',
							form: {
								code: code,
								redirect_uri: SpotifyCredentials.REDIRECT_URI,
								grant_type: 'authorization_code'
							},
							headers: {
								'Authorization': 'Basic ' + 
									(new Buffer(SpotifyCredentials.CLIENT_ID + ':' + SpotifyCredentials.CLIENT_SECRET).toString('base64'))
							},
							json: true
						};

						request.post(authOptions, function(error, response, body) {
						  if (!error && response.statusCode === 200) {
						  	// Set access and refresh tokens
						    access_token = body.access_token,
						    refresh_token = body.refresh_token;
						    // Success
						    success();
						  } else {
						  	// Invalid token
						    error('Spotify API invalid token', 'invalid_token');
						  }
						});
					}
			},

			/**
			 * Generate random string of characters for state to send to Spotify server
			 * Based on generateRandomString(length) in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
			 */
			generateState: function (len) {
				return Array.apply(null, Array(len)).map(function () { 
					return STATE_CHARS.charAt(Math.floor(Math.random() * STATE_CHARS.length)); 
				}).reduce(function (prev, curr) {
					return prev + curr;
				}, "");
			}
		};
	})();

module.exports = SpotifyAPI;