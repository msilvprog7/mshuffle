/**
 * Handle audio playing
 */
var AudioAPI = (function () {
	var audio;

	return {
		/**
		 * Load audio with url of source and a callback
		 * for when the song has been finished
		 */
		load: function (url, callback) {
			// Stop and remove previous
			if (audio !== undefined && audio !== null) {
				audio.pause();
				audio = null;
			}

			audio = new Audio();
			audio.src = url;
			audio.loop = false;
			audio.onended = callback;
		},

		/**
		 * Pause song
		 */
		pause: function () {
			if (!audio) {
				return;
			}

			audio.pause();
		},

		/**
		 * Play song
		 */
		play: function () {
			if (!audio) {
				return;
			}
			
			audio.play();
		}
	};
})();