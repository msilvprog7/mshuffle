/**
 * Minimal type declaration for chart.js
 */
declare module "chart.js" {
    export class Chart {
        data: ChartData;
        constructor(canvas: HTMLCanvasElement, config: ChartConfiguration);
        destroy(): void;
        update(): void;
    }

    export interface ChartConfiguration {
        type: string;
        data: ChartData;
        options: ChartOptions;
    }

    export interface ChartData {
        labels: string[];
        datasets: ChartDataSet[];
    }

    export interface ChartDataSet {
        label: string,
        backgroundColor: string,
        borderColor: string,
        borderWidth: number,
        hoverBackgroundColor: string,
        hoverBorderColor: string,
        data: number[]
    }

    export interface ChartOptions {
        display: boolean,
        categoryPercentage: number,
        barPercentage: number,
        responsive: boolean,
        maintainAspectRatio: boolean,
        scales: ChartScales;
    }

    export interface ChartScale {
        display: boolean;
        type?: string;
        ticks?: ChartTicks;
    }

    export interface ChartScales {
        xAxes: ChartScale[];
        yAxes: ChartScale[];
    }

    export interface ChartTicks {
        max: number;
        min: number;
        stepSize: number;
    }
}
