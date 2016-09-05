/**
 * Method of storing listening sessions and applying mshuffle to these sessions
 */
var MshuffleAPI = (function () {
		let userSessions = {},
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
					},
					// References to songs for measuring satisfaction across artists, albums, etc.
					// Initialized by MshuffleAPI.satisfaction.init(session)
					satisfaction: {}
				};

				// Initialize satisfaction References
				MshuffleAPI.satisfaction.init(userSessions[userId]);

				// Debugging
				console.log(userSessions[userId].name + " created with: \n" +
					"\t" + "history queue [size: " + userSessions[userId].history.CAPACITY + "]");
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
				let session = userSessions[userId];

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
				let totalProbability = session.songs.reduce(function (prev, song) {
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
				let i = 0,
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
				let session = userSessions[userId];

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
					let removed;

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
					let songIndex = session.songs.findIndex(function (song) {
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
			},

			/**
			 * Satisfaction (enjoy/dislike) related functionality
			 */
			satisfaction: {
				/**
				 * Initialize session with data structures
				 */
				init: function (session) {
					// Structure for mapping ids to song index
					session.satisfaction.songs = MshuffleAPI.satisfaction.getSongMap(session);
					// Structure for mapping ids to songs
					session.satisfaction.albums = MshuffleAPI.satisfaction.getAlbumMap(session);
					// Structure for mapping ids to songs and related artists
					// as well as mapping names to artist ids
					session.satisfaction.artists = MshuffleAPI.satisfaction.getArtistMap(session);

					// Debugging: songs map
					// Object.keys(session.satisfaction.songs.ids).forEach(function (songId) {
					// 	console.log(songId + "\t\t" + session.satisfaction.songs.ids[songId].index);
					// });

					// Debugging: albums map
					// Object.keys(session.satisfaction.albums.ids).forEach(function (albumId) {
					// 	console.log(albumId);
					// 	session.satisfaction.albums.ids[albumId].songs.forEach(function (songId) {
					// 		console.log("\t" + songId);
					// 	});
					// });

					// Debugging: artists ids map
					// Object.keys(session.satisfaction.artists.ids).forEach(function (artistId) {
					// 	console.log(artistId);
					// 	console.log("\tSong Ids:");
					// 	session.satisfaction.artists.ids[artistId].songs.forEach(function (songId) {
					// 		console.log("\t\t" + songId);
					// 	});
					// 	console.log("\tSimilar Normalized Artist Names:");
					// 	session.satisfaction.artists.ids[artistId].similar.forEach(function (similarArtist) {
					// 		console.log("\t\t" + similarArtist);
					// 	});
					// 	// Via reverse search value (should not be a typical operation)
					// 	console.log("\tName:");
					// 	console.log("\t\t" + Object.keys(session.satisfaction.artists.names).find(function (name) {
					// 		return session.satisfaction.artists.names[name] === artistId;
					// 	}));
					// });

					// Debugging: artists names map
					// Object.keys(session.satisfaction.artists.names).forEach(function (name) {
					// 	console.log(name);
					// 	console.log("\t" + session.satisfaction.artists.names[name]);
					// });
				},

				/**
				 * Generate song ids mapping
				 */
				getSongMap: function (session) {
					let idMap = {};

					session.songs.forEach(function (song, index) {
						// Song Id -> { index: Song Index }
						idMap[song.id] = {
							index: index
						};
					});

					// songs.ids: Song Id -> { index: Song Index }
					return {
						ids: idMap
					};
				},

				/**
				 * Generate song ids mapping
				 */
				getAlbumMap: function (session) {
					let idMap = {};

					session.songs.forEach(function (song) {
						let album = song.album;
						
						if (idMap[album.id] === undefined || idMap[album.id] === null) {
							// Albums Id -> { songs: Song Ids }
							idMap[album.id] = {
								songs: new Set()
							};
						}

						// Add song to set 
						idMap[album.id].songs.add(song.id);
					});

					// albums.ids: Album Id -> { songs: Set of Song Ids }
					return {
						ids: idMap
					};
				},

				/**
				 * Generate song ids mapping
				 */
				getArtistMap: function (session) {
					let idMap = {},
						nameMap = {};

					session.songs.forEach(function (song) {
						song.artists.forEach(function (artist) {
							// Artist Id Map
							if (idMap[artist.id] === undefined || idMap[artist.id] === null) {
								// Artist Id -> { songs: Set of Song Ids, similar: Set of Normalized Artist Names }
								idMap[artist.id] = {
									songs: new Set(),
									similar: new Set()
								};
							}

							// Add song to set 
							idMap[artist.id].songs.add(song.id);

							// Artist Name Map
							let artistNormalizedName = MshuffleAPI.satisfaction.normalizeArtistName(artist.name);
							if (nameMap[artistNormalizedName] === undefined || nameMap[artistNormalizedName] === null) {
								// Normalized Artist Name -> Artist Id
								nameMap[artistNormalizedName] = artist.id;
							}
						});
					});

					// artists.ids: Artist Id -> {
					//                 songs: Set of Song Ids,
					//                 similar: Set of Normalized Artist Names
					//              }
					// artists.names: Normalized Artist Name -> Artist Id
					return {
						ids: idMap,
						names: nameMap
					};
				},

				/**
				 * Normalize an artist name,
				 * Currently done by changing to lowercase
				 */
				normalizeArtistName: function (artist) {
					if (artist === undefined || artist === null || typeof(artist) !== "string") {
						console.error("Cannot normalize an undefined, null, or non-string artist name");
						return artist;
					}

					return artist.toLowerCase();
				}
			}
		};
	})();

module.exports = MshuffleAPI;