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
						// PMF label (pre-formatted)
						song.label = "'" + song.name + "' by " + song.artists.reduce(function (prev, curr, index) {
							if (index === 0) {
								return curr.name;
							} else {
								return prev.name + ", " + curr.name;
							}
						}, "");
						return song;
					}),
					// Current id for song playing
					current: null,
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
			 * Format a Probability Mass Function for the current listening session
			 */
			pmf: function (userId) {
				var session = userSessions[userId];
				return {
					pmf: session.songs.map(function (song) {
						return {
							label: song.label,
							probability: song.probability
						};
					})
				};
			},

			/**
			 * Accumulate probabilities for random probability and
			 * assign current song
			 */
			select: function (userId) {
				var i = 0,
					accum = 0,
					prob = Math.random(),		
					session = userSessions[userId];

				for (; i < session.songs.length; i++) {
					accum += session.songs[i].probability;

					// Selection criteria: accumulator exceeds random probability
					if (accum > prob) {
						session.current = session.songs[i].id;
						return {current: session.current};
					}
				}
			},

			/**
			 * Acquire the next track in the user's shuffle
			 */
			next: function (userId) {
				// TODO: Manage history buffer

				// Pick a new song
				return MshuffleAPI.select(userId);
			},

			/**
			 * Skip to the next track with an implication that the current song
			 * was disliked
			 */
			skip: function (userId) {
				// TODO: dislike by some factor
				// Get the next track
				return MshuffleAPI.next(userId);
			},

			/**
			 * Recognize that the user enjoys the current track
			 */
			enjoy: function (userId) {
				// TODO: increase probabilities related to the current song
				// Return updated session
				return userSessions[userId];
			},

			/**
			 * Recognize that the user dislikes the current track
			 */
			dislike: function (userId) {
				// TODO: decrease probabilities related to the current song
				// Return updated session
				return userSessions[userId];
			}
		};
	})();

module.exports = MshuffleAPI;