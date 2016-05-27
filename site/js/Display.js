/**
 * Handle displaying content to pages
 */
var DisplayAPI = (function () {
		return {
			/** 
			 * Handle display the user's info to the current page
			 */
			showUserInfo: function (info) {
				// Set spotify data
				$("[name='spotifyFirstname']").html(info.display_name.split(/\s+/g)[0]);
				// Hide not-logged-in and show logged-in
				$(".not-logged-in").hide();
				$(".logged-in").show();
			}
		};
	})();