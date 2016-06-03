/**
 * Method of storing listening sessions and applying mshuffle to these sessions
 */
var MshuffleAPI = (function () {
		var userSessions = {},
			HISTORY_QUEUE_SIZE = 0.15; // If < 1, Proportion of songs, else num songs

		return {
			/**
			 * Load a user's playlist to begin shuffling music
			 */
			load: function (userId, playlist) {
				// Create a session
				userSessions[userId] = {
					// Id
					id: playlist.id,
					// Name
					name: playlist.name,
					// Description
					description: playlist.description,
					// Image
					image: playlist.image,
					// Owner
					owner: playlist.owner,
					// Songs in the playlist
					songs: playlist.songs.map(function (song) {
						// Add initial probabilities (all equal odds)
						song.probability = (playlist.songs.length > 0) ? (1 / playlist.songs.length) : 0;
						return song;
					}),
					// References to songs that cannot be repeated
					historyQueue: [],
					HISTORY_QUEUE_SIZE: (HISTORY_QUEUE_SIZE < 1) ? Math.round(HISTORY_QUEUE_SIZE * playlist.songs.length) : HISTORY_QUEUE_SIZE
				};
			},

			/**
			 * Get user's listening session
			 */
			getSession: function (userId) {
				return userSessions[userId];
			},

			/**
			 * Acquire the next track in the user's shuffle
			 */
			next: function (userId) {
				// TODO
			},

			/**
			 * Recognize that the user enjoys the current track
			 */
			enjoy: function (userId) {
				// TODO
			},

			/**
			 * Recognize that the user dislikes the current track
			 */
			dislike: function (userId) {
				// TODO
			}
		};
	})();

module.exports = MshuffleAPI;