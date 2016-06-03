/**
 * Handle displaying content to pages
 */
var DisplayAPI = (function () {
	return {
		/**
		 * Handle displaying the content for when a user is logged in to the Music service
		 */
		loggedIn: function () {
			// Show content for logged in users
			$(".not-logged-in").hide();
			$(".logged-in").show();
		},

		/**
		 * Handle displaying the content for when a user is not logged in to the Music service
		 */
		notLoggedIn: function () {
			// Hide the content for logged in users and show the alternative
			// content
			$(".logged-in").hide();
			$(".not-logged-in").show();
		},

		/** 
		 * Handle displaying the user's info to the current page
		 */
		showUserInfo: function (info) {
			// Set user information from music service
			$("[name='firstname']").html(info.fullname.split(/\s+/g)[0]);
		},

		/**
		 * Handle displaying the user's playlists
		 */
		showPlaylists: function (playlists) {
			// Add each playlist item
			playlists.forEach(function (playlist) {
				var img = (playlist.image !== undefined && playlist.image !== null) ? "<img src='" + playlist.image.url + "' />" : "",
					div = $("<div />", {
						"class": "playlist",
						html: img + "<span>" + playlist.name + "</span>",
						click: function () {
							MshuffleClientAPI.getPlaylist(playlist.owner.id, playlist.id);
						}
					});

				$("[name='playlists']").append(div);
			});

			// Show
			$(".playlists").show();
			$(".view-playlists").show();
		},

		/**
		 * Go back to viewing the playlists
		 */
		viewPlaylists: function () {
			$(".view-playlist").hide();
			$(".view-playlists").show();
		},

		/**
		 * Handle displaying the user's playlist
		 */
		showPlaylist: function (playlist) {
			console.log(playlist);
			// Display info for playlist
			$("[name='playlistName']").html(playlist.name);
			$("img[name='playlistImage']").attr("src", playlist.image.url);

			// Show content
			$(".view-playlists").hide();
			$(".view-playlist").show();

			// TODO: Call mshuffle to get first song
		}
	};
})();