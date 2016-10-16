import {ChartAPI} from "../../../shared/chart";
import {Color, Colors} from "../../../shared/display";
import {PMFData} from "../../../shared/data";
import * as ChartJS from "chart.js";


/**
 * API for interacting with a PMF Chart
 */
export default class PMFChartAPI extends ChartAPI<PMFData> {
    /**
     * Canvas' 2d context
     */
    private canvasContext: CanvasRenderingContext2D;

    /**
     * Chart API's chart
     */
    private chart: ChartJS.Chart | null;
    
    /**
     * Color for the chart
     */
    private color: Color;

    /**
     * Create an instance of a PMF Chart API
     * @param canvas Chart's HTML canvas element
     * @param chartLabel Chart's label for the data set
     */
    constructor(private canvas: HTMLCanvasElement, private chartLabel: string) {
        super();
        this.canvasContext = canvas.getContext("2d");
        this.chart = null;
    }

    /**
     * Load the PMF Data
     * @param data PMF Data
     */
    load(data: PMFData): void {
        this.color = Colors.GetRandomColor();
        this.chart = new ChartJS.Chart(this.canvas, {
            type: 'bar',
            data: this.formatData(data),
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
    }

    /**
     * Reset the Chart
     */
    reset(): void {
        if (this.chart !== null) {
            this.chart.destroy();
        }

        this.chart = null;
    }

    /**
     * Set the PMF data (either a load or update)
     * @param PMF Data
     */
    set(data: PMFData): void {
        if (this.chart === null) {
            this.load(data);
        } else {
            this.update(data);
        }
    }

    /**
     * Strictly update the existing PMF data with
     * new values
     * @param data PMF Data
     */
    update(data: PMFData): void {
        // Update probabilities only
        this.chart.data.datasets[0].data = data.data.map(function (dataValue) {
            // Return probability
            return dataValue.value;
        });
        // Update chart
        this.chart.update();
    }

    /**
     * Format the PMF Data for Chart support
     * @param data PMF Data
     * @returns Chart Data
     */
    private formatData(data: PMFData): ChartJS.ChartData {
        let rgbColor = Colors.GetRGB(this.color);

        return {
            labels: data.data.map(function (dataItem) {
                // Return title
                return dataItem.label;
            }),
            datasets: [
                {
                    label: this.chartLabel,
                    backgroundColor: Colors.GetRGBAString(Colors.GetRGBA(rgbColor, 0.2)),
                    borderColor: Colors.GetRGBAString(Colors.GetRGBA(rgbColor, 1.0)),
                    borderWidth: 1,
                    hoverBackgroundColor: Colors.GetRGBAString(Colors.GetRGBA(rgbColor, 0.4)),
                    hoverBorderColor: Colors.GetRGBAString(Colors.GetRGBA(rgbColor, 1.0)),
                    data: data.data.map(function (dataValue) {
                        // Return probability
                        return dataValue.value;
                    }),
                }
            ]
        };
    }
}
