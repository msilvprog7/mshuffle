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
					history: {
						queue: [],
						map: {},
						CAPACITY: (HISTORY_QUEUE_SIZE < 1) ? Math.round(HISTORY_QUEUE_SIZE * playlist.songs.length) : HISTORY_QUEUE_SIZE
					}
				};

				// Debugging
				console.log(userSessions[userId].name + " created with history queue [size: " + userSessions[userId].history.CAPACITY + "]");
			},

			/**
			 * Get user's listening session
			 */
			getSession: function (userId) {
				return userSessions[userId];
			},

			/**
			 * Format a Probability Mass Function for the current listening session
			 * Returns object with:
			 *		pmf - the probability mass function as a list of items,
			 *				each item has:
			 *					label - 'Song' by Artist(s)
			 *					probability
			 *
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
			 * Normalize the song probabilities
			 */
			normalize: function (session) {
				var totalProbability = session.songs.reduce(function (prev, song) {
						return prev + song.probability;
					}, 0.0);

				// If total probability is less than or equal to 0, just return the session
				if (totalProbability <= 0) {
					return session;
				}

				// Divide all probabilities by the total probability
				session.songs = session.songs.map(function (song) {
					song.probability = song.probability / totalProbability;
					return song;
				});

				// Return the user's session
				return session;
			},


			/**
			 * Accumulate probabilities for random probability and
			 * assign current song
			 */
			select: function (session) {
				var i = 0,
					accum = 0,
					prob = Math.random();

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
				var session = userSessions[userId];

				// Manage history buffer, apply probability changes, and renormalize probabilities
				MshuffleAPI.history.push(session);
				MshuffleAPI.history.apply(session);
				MshuffleAPI.normalize(session);

				// Pick a new song
				return MshuffleAPI.select(session);
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
			},

			/**
			 * History queue related functionality
			 */
			history: {
				/**
				 * Push in song, possibly remove first if at capacity, and normalize probabilities of all songs
				 */
				push: function (session) {
					// Ignore if no current song or history queue already has song, just return user's session
					if (session.current === undefined || session.current === null || session.history.map[session.current] !== undefined) {
						return session;
					}

					// If queue is at capacity, pop from the top
					if (session.history.queue.length === session.history.CAPACITY) {
						MshuffleAPI.history.pop(session);
					}

					// Add to queue and map (for quickly checking containment)
					session.history.queue.push(session.current);
					session.history.map[session.current] = true;

					// Return user's session
					return session;
				},

				/**
				 * Pop song from the front of the queue
				 */
				pop: function (session) {
					var removed;

					// Cannot pop from an empty array, just return user's session
					if (session.history.queue.length === 0) {
						console.log("Cannot pop from an empty queue...");
						return session;
					}

					// Remove one song from the top
					removed = session.history.queue.splice(0, 1);

					// Handle the remove songs
					removed.forEach(function (songId) {
						console.log("Removing " + songId + " from queue");
						// Clear the map of those removed
						delete session.history.map[songId];
						// Update probability of the song
						MshuffleAPI.history.setPoppedProbability(session, songId);
					});

					// Return user's session
					return session;
				},

				/**
				 * Set the probability of a song that has just been popped from the queue,
				 * Currently resets the probability to (1 / n), where n is
				 * the number of songs
				 */
				setPoppedProbability: function (session, songId) {
					var songIndex = session.songs.findIndex(function (song) {
							return (song.id === songId);
						});

					// If song index not found, just return session
					if (songIndex < 0) {
						return session;
					}

					// P(Song) = 1 / n (0 if n = 0)
					session.songs[songIndex].probability = (session.songs.length > 0) ? (1 / session.songs.length) : 0;

					// Return user's session
					return session;
				},

				/**
				 * Apply probability change to those in the history queue
				 * If a song is in the history queue:
				 *		The song is given a probability of 0.0
				 */
				apply: function (session) {
					session.songs = session.songs.map(function (song) {
						// Change probability to 0 for songs in the queue
						if (session.history.map[song.id] !== undefined) {
							song.probability = 0.0;
						}

						return song;
					});

					// Return user's session
					return session;
				}
			}
		};
	})();

module.exports = MshuffleAPI;