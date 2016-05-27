var SpotifyAPI = (function () {
		var SpotifyCredentials = require('./SpotifyCredentials.js'),
			querystring = require('querystring'),
			stateKey = 'spotify_auth_state',
			STATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		return {
			/** 
			 * Log in request to Spotify
			 * Based on /login in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
			 */
			login: function (res) {
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