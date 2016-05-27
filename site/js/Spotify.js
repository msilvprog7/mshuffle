/**
 * Client to request Spotify API from Node server
 */
var SpotifyClientAPI = (function () {
		return {
			/**
			 * Get user info for the Spotify user
			 */
			getUserInfo: function () {
				$.ajax({
					url: "/user-info",
					type: "GET",
					success: function (response) {
						if (response !== undefined && response.logged_in !== undefined && response.logged_in && response.info !== undefined) {
							// User logged in - use the info
							DisplayAPI.showUserInfo(response.info);
						} else if (response !== undefined && response.error !== undefined) { 
							console.error("Error: Spotify Client API - " + response.error);
						}
					},
					error: function () {
						console.error("Error: Spotify Client API - Getting user info");
					}
				});
			}
		};
	})();