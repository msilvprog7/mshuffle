/**
 * Client to request music/playlist information or services from the NodeJS Server
 */
var MshuffleClientAPI = (function () {
	return {
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