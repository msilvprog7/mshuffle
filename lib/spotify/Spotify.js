/**
 * Method of interacting with Spotify's Web API
 */
var SpotifyAPI = (function () {
		var SpotifyCredentials = require('./SpotifyCredentials.js'),
			querystring = require('querystring'),
			request = require('request'),
			stateKey = 'spotify_auth_state',
			STATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		return {
			/**
			 * Get information about the user
			 */
			getUserInfo: function (req, onSuccess, onError) {
				var options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + req.session.access_token },
					json: true
		        };

		        // use the access token to access the Spotify Web API
		        request.get(options, function(error, response, body) {
		        	if (error !== undefined && error !== null) {
		        		// Send error
		        		onError(error.status, error.message);
		        	} else if (body.error !== undefined) {
		        		// Send error
		        		onError(body.error.status, body.error.message);
		        	} else {
		        		// Send user info
		        		onSuccess({
		        			logged_in: true,
		        			info: {
		        				fullname: body.display_name
		        			}
		        		});
		        	}
		        });
			},

			/**
			 * Get a list of playlists for the user
			 * Add url and playlists to recursively request next paging
			 * object of playlists
			 */
			getPlaylists: function (req, onSuccess, onError, url, playlists) {
				// Use defaults or defined values
				url = (url !== undefined) ? url : 'https://api.spotify.com/v1/me/playlists';
				playlists = (playlists !== undefined) ? playlists : [];

				// Get user's playlists
				var options = {
					url: url,
					headers: { 'Authorization': 'Bearer ' + req.session.access_token },
					json: true
		        };

		        request.get(options, function(error, response, body) {
		        	if (error !== undefined && error !== null) {
		        		// Send error
		        		onError(error.status, error.message);
		        	} else if (body.error !== undefined) {
		        		// Send error
		        		onError(body.error.status, body.error.message);
		        	} else {
		        		// Extend playlists
		        		playlists.push.apply(playlists, body.items.map(function (playlist) {
		        			/**
		        			 * Playlist Information
		        			 *		id
		        			 *		name
		        			 *		description
		        			 *		image
		        			 *			url
		        			 *		owner
		        			 *			id
		        			 */
		        			return {
		        				id: playlist.id,
		        				name: playlist.name,
		        				description: playlist.description,
		        				image: (playlist.images !== undefined && playlist.images !== null && playlist.images.length > 0) ? playlist.images[0] : null,
		        				owner: playlist.owner
		        			};
		        		}));

		        		// Either get more playlists recursively or return results
		        		if (body.next !== null) {
		        			SpotifyAPI.getPlaylists(req, onSuccess, onError, body.next, playlists);
		        		} else {
		        			onSuccess({
		        				logged_in: true,
		        				playlists: playlists
		        			});
		        		}
		        	}
		        });
			},

			/**
			 * Get a playlist (with songs) for the user
			 * Add url and playlist to recursively request next paging
			 * object of tracks
			 */
			getPlaylist: function (req, ownerId, playlistId, onSuccess, onError, url, playlist) {
				// Use defaults or defined values
				url = (url !== undefined) ? url : 'https://api.spotify.com/v1/users/' + ownerId + '/playlists/' + playlistId;
				playlist = (playlist !== undefined) ? playlist : { id: undefined, name: undefined, description: undefined, image: undefined, owner: undefined, songs: [] };

				// Get user's playlist
				var options = {
					url: url,
					headers: { 'Authorization': 'Bearer ' + req.session.access_token },
					json: true
		        };

		        request.get(options, function(error, response, body) {
		        	if (error !== undefined && error !== null) {
		        		// Send error
		        		onError(error.status, error.message);
		        	} else if (body.error !== undefined) {
		        		// Send error
		        		onError(body.error.status, body.error.message);
		        	} else {
		        		// Set details once
		        		playlist.id = (playlist.id !== undefined) ? playlist.id : body.id;
		        		playlist.name = (playlist.name !== undefined) ? playlist.name : body.name;
		        		playlist.description = (playlist.description !== undefined) ? playlist.description : body.description;
		        		playlist.image = (playlist.image === undefined && body.images !== undefined && body.images !== null && 
		        			body.images.length > 0) ? body.images[0] : playlist.image;
		        		playlist.owner = (playlist.owner !== undefined) ? playlist.owner : body.owner;
						
		        		// Extend playlist tracks (note that if recursively paging, the tracks will be the whole body response)
		        		var tracks = (body.tracks !== undefined) ? body.tracks : body;
		        		playlist.songs.push.apply(playlist.songs, tracks.items.map(function (trackObj) {
		        			// Get underlying track without playlist info
		        			var track = trackObj.track;
		        			/**
		        			 * Song Information
		        			 *		id
		        			 *		name
		        			 *		duration (s)
		        			 *		popularity [0.0, 1.0]
		        			 *		artists []
		        			 *			each artist contains:
							 *				id
		        			 *				name
		        			 *		album
							 *			id
		        			 *			name
		        			 *			image
		        			 *		uri
		        			 *		href
		        			 *		preview (url)
		        			 */
		        			return {
		        				id: track.id,
		        				name: track.name,
		        				duration: track.duration_ms / 1000,
		        				popularity: track.popularity / 100,
		        				artists: track.artists,
		        				album: {
									id: track.album.id,
		        					name: track.album.name,
		        					image: (track.album.images !== undefined && track.album.images !== null && 
		        						track.album.images.length > 0) ? track.album.images[0] : null
		        				},
		        				uri: track.uri,
		        				href: track.href,
		        				preview: track.preview_url
		        			};
		        		}));

		        		// Either get more playlists recursively or return results
		        		if (tracks.next !== null) {
		        			SpotifyAPI.getPlaylist(req, ownerId, playlistId, onSuccess, onError, tracks.next, playlist);
		        		} else {
		        			onSuccess({
		        				logged_in: true,
		        				playlist: playlist
		        			});
		        		}
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
			callback: function (req, res, onSuccess, onError) {
				var code = req.query.code || null,
					state = req.query.state || null,
					storedState = req.cookies ? req.cookies[stateKey] : null,
					authOptions;
			 
					if (state === null || state !== storedState) {
						// Error: State mismatch
						onError('Spotify API state mismatch', 'state_mismatch');
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
						  	// Set access and refresh tokens for the user's session
						    req.session.access_token = body.access_token,
						    req.session.refresh_token = body.refresh_token;
						    // Success
						    onSuccess(body.access_token, body.refresh_token);
						  } else {
						  	// Invalid token
						    onError('Spotify API invalid token', 'invalid_token');
						  }
						});
					}
			},

			/**
			 * Handle refreshing the user's token for Spotify Auth
			 * Based on /refresh_token in https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js 
			 */
			refreshToken: function (req, res, onSuccess, onError) {
				// Use user's refresh token stored in the current user's session
				var authOptions = {
					url: 'https://accounts.spotify.com/api/token',
					form: {
						grant_type: 'refresh_token',
						refresh_token: req.session.refresh_token
					},
					headers: { 
						'Authorization': 'Basic ' + 
							(new Buffer(SpotifyCredentials.CLIENT_ID + ':' + SpotifyCredentials.CLIENT_SECRET).toString('base64'))
					},
					json: true
				};

				// Request new token
				request.post(authOptions, function(error, response, body) {
					if (!error && response.statusCode === 200) {
						// Set access token for the user's session
						req.session.access_token = body.access_token;
						// Success
						onSuccess(body.access_token);
					} else {
						// Invalid token
						onError('Spotify API invalid token', 'invalid_token');
					}
				});
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