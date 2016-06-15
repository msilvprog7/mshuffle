/**
 * Handle displaying probability data to a Chart
 */
var ChartAPI = (function () {
	var ctx = document.getElementById("chart"),
		chart;

	return {
		/**
		 * Initialize the chart with data,
		 * specifically where data is an array of arrays with each
		 * inner array containing a String (title) and a probability
		 * (e.g. data = [["song 1", 0.5], ["song 2", 0.25]])
		 */
		initPMF: function (data) {
			chart = new Chart(ctx, {
				type: 'bar',
				data: ChartAPI.formatPMFData(data),
				options: {
					display: true,
					categoryPercentage: 1.0,
					barPercentage: 1.0,
					responsive: false,
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
						backgroundColor: "rgba(39,128,227,0.2)",
						borderColor: "rgba(39,128,227,1)",
						borderWidth: 1,
						hoverBackgroundColor: "rgba(39,128,227,0.4)",
						hoverBorderColor: "rgba(39,128,227,1)",
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
		}
	};
})();