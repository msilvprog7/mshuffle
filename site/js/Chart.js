/**
 * Handle displaying probability data to a Chart
 */
var ChartAPI = (function () {
	var canvas = document.getElementById("chart"),
		ctx = canvas.getContext("2d"),
		chart,
		color;

	return {
		/**
		 * Initialize the chart with data,
		 * specifically where data is an array of arrays with each
		 * inner array containing a String (title) and a probability
		 * (e.g. data = [["song 1", 0.5], ["song 2", 0.25]])
		 */
		initPMF: function (data) {
			color = ChartAPI.selectRGB();
			chart = new Chart(canvas, {
				type: 'bar',
				data: ChartAPI.formatPMFData(data),
				options: {
					display: true,
					categoryPercentage: 1.0,
					barPercentage: 1.0,
					responsive: false,
					maintainAspectRatio: false,
					scales: {
						xAxes: [{
							display: false
						}],
						yAxes: [{
							display: true,
							type: 'linear',
							ticks: {
								max: 1.0,
								min: 0.0,
								stepSize: 0.2
							}
						}]
					}
				}
			});
		},

		/**
		 * Update the PMF data for the current chart
		 */
		updatePMF: function (data) {
			// Update probabilities only
			chart.data.datasets[0].data = data.map(function (dataItem) {
				// Return probability
				return dataItem.probability;
			});
			// Update chart
			chart.update();
		},

		/**
		 * Reset the canvas and the chart
		 */
		reset: function (data) {
			if (chart !== undefined && chart !== null) {
				chart.destroy();
				// ctx.clearRect(0, 0, canvas.width, canvas.height);
			}

			chart = undefined;
		},

		/**
		 * Generate a Chart.js data object from data in an array
		 * of arrays with labels and probabilities
		 * (e.g. data = [["song 1", 0.5], ["song 2", 0.25]])
		 */
		formatPMFData: function (data) {
			return {
				labels: data.map(function (dataItem) {
					// Return title
					return dataItem.label;
				}),
				datasets: [
					{
						label: "Song Probability",
						backgroundColor: ChartAPI.formatRGBAString(color, 0.2),
						borderColor: ChartAPI.formatRGBAString(color, 1.0),
						borderWidth: 1,
						hoverBackgroundColor: ChartAPI.formatRGBAString(color, 0.4),
						hoverBorderColor: ChartAPI.formatRGBAString(color, 1.0),
						data: data.map(function (dataItem) {
							// Return probability
							return dataItem.probability;
						}),
					}
				]
			}
		},

		/**
		 * Update PMF data on chart and refresh chart (create if needed)
		 */
		setPMFData: function (data) {
			if (chart === undefined || chart === null) {
				ChartAPI.initPMF(data);
			} else {
				ChartAPI.updatePMF(data);
			}
		},

		/**
		 * Format an rgb object (has r, g, and b values) along with an
		 * alpha value \in [0.0, 1.0] to an 'rgba(r,g,b,a)' string
		 * (e.g. ({r: 1, g: 2, b: 3}, 0.45) => 'rgba(1,2,3,0.45)')
		 */
		formatRGBAString: function (rgbObj, alpha) {
			rgbObj = (rgbObj) ? rgbObj : {r: 0, g: 0, b: 0};
			alpha = (alpha) ? alpha : 1.0;
			return `rgba(${rgbObj.r},${rgbObj.g},${rgbObj.b},${alpha})`
		},

		/**
		 * Returns an RGB color object to use for the chart display.
		 * Selection is made randomly from the available from the properties
		 * in COLORS.
		 */
		selectRGB: function() {
			var keys = Object.keys(ChartAPI.COLORS);
			return ChartAPI.COLORS[keys[Math.floor(Math.random() * keys.length)]];
		},

		/**
		 * A set of colors to use
		 */
		COLORS: {
			BLUE: {r: 39, g: 128, b: 227},
			PINK: {r: 227, g: 39, b: 128},
			GREEN: {r: 128, g: 227, b: 39},
			ORANGE: {r: 227, g: 138, b: 39},
			LIGHT_GREEN: {r: 39, g: 227, b: 138},
			LIGHT_PURPLE: {r: 138, g: 39, b: 227}
		}
	};
})();