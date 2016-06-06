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
			MshuffleClientAPI.stop();
			$(".view-playlist").hide();
			$(".view-playlists").show();
		},

		/**
		 * Handle displaying the user's playlist
		 */
		showPlaylist: function (playlist) {
			// Display info for playlist
			$("[name='playlistName']").html(playlist.name);
			$("img[name='playlistImage']").attr("src", playlist.image.url);
			$("[name='playlistSongName']").html(playlist.name);
			$("[name='playlistSongArtist']").html("-------");

			// Show content
			$(".view-playlists").hide();
			$(".view-playlist").show();
		},

		/**
		 * Change the play icons
		 */
		play: function (playing) {
			if (playing) {
				// To pause icon
				$(".mshuffle-play").html("<i class='fa fa-pause'></i>");
			} else {
				// To play icon
				$(".mshuffle-play").html("<i class='fa fa-play'></i>");
			}
		},

		/**
		 * Set the current song information
		 */
		setSong: function (song) {
			// Display info for new song
			$("[name='playlistSongName']").html(song.name);
			$("[name='playlistSongArtist']").html(song.artists.reduce(function (prev, curr, index) {
				if (index === 0) {
					return curr.name;
				} else {
					return prev.name + ", " + curr.name;
				}
			}, ""));
			$("img[name='playlistImage']").attr("src", song.album.image.url);
		}
	};
})();