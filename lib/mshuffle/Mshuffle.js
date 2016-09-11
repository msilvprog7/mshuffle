/**
 * Method of storing listening sessions and applying mshuffle to these sessions
 */
var MshuffleAPI = (function () {
		var userSessions = {},
			HISTORY_QUEUE_SIZE = 0.15, // If < 1, Proportion of songs, else num songs
			MusicAPI;

		return {
			/**
			 * Initialized the API
			 */
			init: function (musicAPI) {
				MusicAPI = musicAPI;
			},

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
						song.label = "'" + song.name + "' by " + song.artists.map(function (artist) { return artist.name; }).join(", ");
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
				MshuffleAPI.normalize(session);

				// Pick a new song
				return MshuffleAPI.select(session);
			},

			/**
			 * Skip to the next track with an implication that the current song
			 * was disliked
			 */
			skip: function (userId) {
				// Future: at some point it may be nice
				// to dislike by some factor, but currently
				// this is not an obvious need

				// Get the next track
				return MshuffleAPI.next(userId);
			},

			/**
			 * Recognize that the user enjoys the current track
			 * and return the updated pmf
			 */
			enjoy: function (userId, onSuccess, onError) {
				var session = userSessions[userId],
					enjoySuccess = function () {
						// Normalize probabilities
						MshuffleAPI.normalize(session);

						// Call success: returns pmf
						onSuccess(MshuffleAPI.pmf(userId));
					};

				// Increase probabilities related to the current song
				MshuffleAPI.satisfaction.enjoy(session, userId, enjoySuccess, onError);
			},

			/**
			 * Recognize that the user dislikes the current track
			 * and return the updated pmf
			 */
			dislike: function (userId, onSuccess, onError) {
				var session = userSessions[userId],
					dislikeSuccess = function () {
						// Normalize probabilities
						MshuffleAPI.normalize(session);

						// Call success: returns pmf
						onSuccess(MshuffleAPI.pmf(userId));
					};

				// Decrease probabilities related to the current song
				MshuffleAPI.satisfaction.dislike(session, userId, dislikeSuccess, onError);
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

					// Adjust probability
					// (Keep probability for later)
					var song = session.songs[session.satisfaction.songs.ids[session.current].index];
					song.history = {
						probability: song.probability
					};
					song.probability = 0.0;
					// console.log(`Storing prob: ${song.history.probability}`);

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
						// console.log("Removing " + songId + " from queue");
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
					// session.songs[songIndex].probability = (session.songs.length > 0) ? (1 / session.songs.length) : 0;

					// P(Song) = probability prior to history queue
					session.songs[songIndex].probability = session.songs[songIndex].history.probability;
					delete session.songs[songIndex].history;
					// console.log(`Restoring prob: ${session.songs[songIndex].probability}`);

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

					// Values for probability adjustments
					session.satisfaction.adjustments = MshuffleAPI.satisfaction.getAdjustments(session);

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
					// 	console.log("\tSimilar Artist Ids:");
					// 	session.satisfaction.artists.ids[artistId].similar.forEach(function (similarArtist) {
					// 		console.log("\t\t" + similarArtist);
					// 	});
					// });
				},

				/**
				 * Generate song ids mapping
				 */
				getSongMap: function (session) {
					var idMap = {};

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
					var idMap = {};

					session.songs.forEach(function (song) {
						var album = song.album;
						
						if (!idMap[album.id]) {
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
					var idMap = {};

					session.songs.forEach(function (song) {
						song.artists.forEach(function (artist) {
							// Artist Id Map
							if (!idMap[artist.id]) {
								// Artist Id -> { songs: Set of Song Ids, similar: Set of Normalized Artist Names }
								idMap[artist.id] = {
									songs: new Set(),
									similar: new Set()
								};
							}

							// Add song to set 
							idMap[artist.id].songs.add(song.id);
						});
					});

					// artists.ids: Artist Id -> {
					//                 songs: Set of Song Ids,
					//                 similar: Set of Normalized Artist Names
					//              }
					return {
						ids: idMap
					};
				},

				/**
				 * Get initial probability adjustments for satisfaction scenarios
				 */
				getAdjustments: function (session) {
					var equalProb = (session.songs.length > 0) ? (1 / session.songs.length) : 0;

					return {
						// Same song adjustments
						// 		enjoy: 		+(1 / n)
						// 		dislike: 	-(1 / n)
						song: MshuffleAPI.satisfaction.getAdjustmentValue(equalProb, -equalProb),

						// Same album adjustments
						// 		enjoy: 		+(1 / n)
						// 		dislike: 	-(1 / n)
						album: MshuffleAPI.satisfaction.getAdjustmentValue(equalProb, -equalProb),

						// Same artist adjustments
						// 		enjoy: 		+(1 / n)
						// 		dislike: 	-(1 / n)
						artist: MshuffleAPI.satisfaction.getAdjustmentValue(equalProb, -equalProb),

						// Similar artist adjustments
						// 		enjoy: 		+(1 / n)
						// 		dislike: 	-(1 / n)
						similarArtist: MshuffleAPI.satisfaction.getAdjustmentValue(equalProb, -equalProb)
					}
				},

				/**
				 * Get a standard format for adjustment values that Store
				 * both an enjoy and dislike factor
				 */
				getAdjustmentValue: function (enjoy, dislike) {
					return {
						enjoy: enjoy,
						dislike: dislike
					};
				},

				/**
				 * Get enjoy value from an adjustment value
				 */
				getEnjoyValue: function (adjustmentValue) {
					return adjustmentValue.enjoy;
				},

				/**
				 * Get dislike value from an adjustment value
				 */
				getDislikeValue: function (adjustmentValue) {
					return adjustmentValue.dislike;
				},

				/**
				 * Enjoy a song, increase the probabilities associated
				 * with the current song
				 */
				enjoy: function (session, userId, onSuccess, onError) {
					MshuffleAPI.satisfaction.adjustProbabilities(session, userId, MshuffleAPI.satisfaction.getEnjoyValue, onSuccess, onError);
				},

				/**
				 * Dislike a song, decrease the probabilities associated
				 * with the current song
				 */
				dislike: function (session, userId, onSuccess, onError) {
					MshuffleAPI.satisfaction.adjustProbabilities(session, userId, MshuffleAPI.satisfaction.getDislikeValue, onSuccess, onError);
				},

				/**
				 * Adjust song probabilities based on the following factors related
				 * to the current song:
				 * 		Same song
				 * 		Same album
				 * 		Same artist
				 * 		Similar artists
				 */
				adjustProbabilities: function (session, userId, adjustmentValueAccessor, onSuccess, onError) {
					if (!session.current) {
						onSuccess();
					}

					var song = session.songs[session.satisfaction.songs.ids[session.current].index];

					// Adjust song probability
					MshuffleAPI.satisfaction.adjustSongProbability(session, song, session.satisfaction.adjustments.song, adjustmentValueAccessor);

					// Adjust album probability
					session.satisfaction.albums.ids[song.album.id].songs.forEach(function (albumSongId) {
						var albumSong = session.songs[session.satisfaction.songs.ids[albumSongId].index];
						MshuffleAPI.satisfaction.adjustSongProbability(session, albumSong, session.satisfaction.adjustments.album, adjustmentValueAccessor);
					});

					// Adjust artist probability
					song.artists.forEach(function (artist) {
						session.satisfaction.artists.ids[artist.id].songs.forEach(function (artistSongId) {
							var artistSong = session.songs[session.satisfaction.songs.ids[artistSongId].index];
							MshuffleAPI.satisfaction.adjustSongProbability(session, artistSong, session.satisfaction.adjustments.artist, adjustmentValueAccessor);
						});
					});

					// Adjust similar artists probability
					var artistIds = song.artists.map(function (artist) { return artist.id; });

					MshuffleAPI.satisfaction.getSimilarArtistsRecursive(session, userId, artistIds.slice(0), function () {
						MshuffleAPI.satisfaction.adjustSimilarArtistProbabilities(session, artistIds, adjustmentValueAccessor);
						onSuccess();
					}.bind(this));
				},

				/**
				 * Recursively request similar artists if they have not yet
				 * been populated for any of the artist ids in the array passed,
				 * processes in reverse order
				 * 
				 * Afterwards, call onSuccess after all related artists have been
				 * requested
				 */
				getSimilarArtistsRecursive: function (session, userId, artistIds, onSuccess) {
					switch (artistIds.length) {
						case 0:
							onSuccess();
							break;
						case 1:
							MshuffleAPI.satisfaction.getSimilarArtists(session, userId, artistIds.pop(), onSuccess);
							break;
						default:
							MshuffleAPI.satisfaction.getSimilarArtists(session, userId, artistIds.pop(), function () {
								MshuffleAPI.satisfaction.getSimilarArtistsRecursive(session, userId, artistIds, onSuccess);
							});
					}
				},

				/**
				 * Request similar artists if not populated, then call onSuccess
				 * Failed request is not treated as a failure as its not a big deal
				 * if it doesn't go through, API requests could be throttled
				 * and it can get picked up later
				 */
				getSimilarArtists: function (session, userId, artistId, onSuccess) {
					var artist = session.satisfaction.artists.ids[artistId];

					// No artist entry or already have related artists
					if (!artist || artist.similar.size > 0) {
						onSuccess();
						return;
					}

					// Request similar artists and continue via onSuccess
					MusicAPI.getSimilarArtists(userId, artistId, function (similarArtistIds) {
							// Set related artists and continue
							similarArtistIds.forEach(function (similarArtistId) {
								artist.similar.add(similarArtistId);
							});
							onSuccess();
						}, function (status, message) {
							// Continue anyways
							console.error(`${status}: ${message}`);
							onSuccess();
						});
				},

				/**
				 * Helper method to adjust the probability of a song
				 */
				adjustSongProbability: function (session, song, adjustmentValue, adjustmentValueAccessor) {
					// Adjust the probability so long as both:
					//	the song is not in the history queue
					//  the probability can go no lower than 0
					if (session.history.map[song.id] === undefined) {
						song.probability += Math.max(adjustmentValueAccessor(adjustmentValue), -song.probability);
					}
				},

				/**
				 * Adjust probabilities for similar artists to the provided
				 * list of artist ids
				 */
				adjustSimilarArtistProbabilities: function (session, artistIds, adjustmentValueAccessor) {
					artistIds.forEach(function (artistId) {
						session.satisfaction.artists.ids[artistId].similar.forEach(function (similarArtistId) {
							// Store the songs for a similar artist (if a similar artist is in the playlist)
							var similarArtistSongs = (session.satisfaction.artists.ids[similarArtistId]) ? 
								session.satisfaction.artists.ids[similarArtistId].songs : [];

							// Adjust probabilities of these songs
							similarArtistSongs.forEach(function (similarArtistSongId) {
								var similarArtistSong = session.songs[session.satisfaction.songs.ids[similarArtistSongId].index];
								// console.log(`Similar artist ${similarArtistSong} adjusted!`);
								MshuffleAPI.satisfaction.adjustSongProbability(session, similarArtistSong, session.satisfaction.adjustments.similarArtist, adjustmentValueAccessor);
							});
						});
					});
				}
			}
		};
	})();

module.exports = MshuffleAPI;