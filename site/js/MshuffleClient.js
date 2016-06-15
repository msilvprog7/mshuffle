/**
 * Client to request music/playlist information or services from the NodeJS Server
 */
var MshuffleClientAPI = (function () {
	var playlist,
		currentSong,
		playing = false,
		loaded = false;

	return {
		/**
		 * Play or pause the music player
		 */
		play: function () {
			if (playlist.current === undefined || playlist.current === null) {
				// Generate first song
				MshuffleClientAPI.next();
			} else {
				// Pause or play (opposite of current playing status)
				playing = !playing;
				MshuffleClientAPI.controlMusic();
				DisplayAPI.play(playing);
			}
		},

		/**
		 * Stop music in cases like changing playlist
		 */
		stop: function () {
			// Reset everything
			playlist = null;
			currentSong = null;
			playing = false;
			loaded = false;
			DisplayAPI.play(false);
			AudioAPI.pause();
		},

		/**
		 * Generate the next song and begin playing it
		 */
		next: function () {
			$.ajax({
				url: "/next",
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.current !== undefined) {
						MshuffleClientAPI.setCurrent(response.current);
						MshuffleClientAPI.play();
						// Update probabilities visualized
						MshuffleClientAPI.getPMF();
					} else {
						console.log("Error: Mshuffle Client API - Getting next song");
					}
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Getting next song");
				}
			});
		},

		/**
		 * Skip to the next song
		 */
		skip: function () {
			// Pause
			playing = false;
			MshuffleClientAPI.controlMusic();

			// Skip to the next song and play it
			$.ajax({
				url: "/skip",
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.current !== undefined) {
						MshuffleClientAPI.setCurrent(response.current);
						MshuffleClientAPI.play();
						// Update probabilities visualized
						MshuffleClientAPI.getPMF();
					} else {
						console.log("Error: Mshuffle Client API - Skipping to next song");
					}
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Skipping to next song");
				}
			});
		},

		/**
		 * Let mshuffle know that you enjoy the current song
		 */
		enjoy: function () {
			$.ajax({
				url: "/enjoy",
				type: "GET",
				success: function (response) {
					// Nothing, currently
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Enjoying current song");
				}
			});
		},

		/**
		 * Let mshuffle know that you dislike the current song
		 */
		dislike: function () {
			$.ajax({
				url: "/dislike",
				type: "GET",
				success: function (response) {
					// Nothing, currently
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Disliking current song");
				}
			});
		},

		/**
		 * Get mshuffle PMF for visualization
		 */
		getPMF: function () {
			$.ajax({
				url: "/pmf",
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.pmf !== undefined) {
						DisplayAPI.showPMF(response.pmf);
					} else {
						console.log("Error: Mshuffle Client API - Retrieving PMF of shuffle");
					}
				}, 
				error: function () {
					console.error("Error: Mshuffle Client API - Retrieving PMF of shuffle");
				}
			})
		},

		/**
		 * Set current song playing
		 */
		setCurrent: function (current) {
			// Assign current song
			playlist.current = current;
			currentSong = playlist.songs.filter(function (song) {
				return song.id === current;
			})[0];

			// Set to paused
			playing = false;

			// Not yet loaded
			loaded = false;

			// Display information on song
			DisplayAPI.setSong(currentSong);
		},

		/**
		 * Control the music based on current playing state
		 */
		controlMusic: function () {
			// Check to make sure preview is available
			if (currentSong.preview === undefined || currentSong.preview === null) {
				console.error(currentSong.name + " does not have a preview to listen to, changing to next song.");
				MshuffleClientAPI.next();
				return;
			}

			// Load preview song if not yet loaded with callback to get next song
			if (!loaded) {
				AudioAPI.load(currentSong.preview, MshuffleClientAPI.next);
				loaded = true;
			}

			// Play or pause
			if (playing) {
				AudioAPI.play();
			} else {
				AudioAPI.pause();
			}
		},

		/**
		 * Get user info for the user
		 */
		getUserInfo: function () {
			$.ajax({
				url: "/user-info",
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.logged_in !== undefined && response.logged_in && response.info !== undefined) {
						// User logged in - use the info
						DisplayAPI.showUserInfo(response.info);
						DisplayAPI.loggedIn();
					} else if (response !== undefined && response.error !== undefined) {
						// Not logged in - show alternatives
						console.log("Error: Mshuffle Client API - " + response.error);
						DisplayAPI.notLoggedIn();
					}
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Getting user info");
					DisplayAPI.notLoggedIn();
				}
			});
		},

		/**
		 * Get playlists for the user
		 */
		getPlaylists: function () {
			$.ajax({
				url: "/playlists",
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.logged_in !== undefined && response.logged_in && response.playlists !== undefined) {
						DisplayAPI.showPlaylists(response.playlists);
					} else if (response !== undefined && response.error !== undefined) {
						// Error getting playlists
						console.log("Error: Mshuffle Client API - " + response.error);
					}
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Getting playlists");
				}
			});
		},

		/**
		 * Load playlist for the user in order to play using mshuffle
		 */
		getPlaylist: function (ownerId, playlistId) {
			$.ajax({
				url: "/playlists/" + ownerId + "/" + playlistId,
				type: "GET",
				success: function (response) {
					if (response !== undefined && response.id !== undefined && response.songs !== undefined) {
						playlist = response;
						DisplayAPI.showPlaylist(response);
					} else if (response !== undefined && response.error !== undefined) {
						// Error getting playlists
						console.log("Error: Mshuffle Client API - " + response.error);
					}
				},
				error: function () {
					console.error("Error: Mshuffle Client API - Getting playlist");
				}
			});
		}
	};
})();