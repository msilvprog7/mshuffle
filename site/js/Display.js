/**
 * Handle displaying content to pages
 */
var DisplayAPI = (function () {
		return {
			/** 
			 * Handle displaying the user's info to the current page
			 */
			showUserInfo: function (info) {
				// Set spotify data
				$("[name='spotifyFirstname']").html(info.display_name.split(/\s+/g)[0]);
			},

			/**
			 * Handle displaying the content for when a user is logged in to Spotify
			 */
			loggedIn: function () {
				// Show content for logged in users
				$(".not-logged-in").hide();
				$(".logged-in").show();
			},

			/**
			 * Handle displaying the content for when a user is not logged in to Spotify
			 */
			notLoggedIn: function () {
				// Hide the content for logged in users and show the alternative
				// content
				$(".logged-in").hide();
				$(".not-logged-in").show();
			}
		};
	})();