import {DisplayFeature} from "../../../shared/display";

import {ChartAPI} from "../../../shared/chart";
import {PMFData} from "../../../shared/data";


/**
 * Display Feature for presenting PMF data onto
 * a chart
 */
export default class PMFChartDisplayFeature extends DisplayFeature {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "PMFChart";
    
    /**
     * Create an instance of PMFChartDisplayFeature
     * @param pmfChartAPI PMF Chart API
     */
    constructor(private pmfChartAPI: ChartAPI<PMFData>) {
        super(PMFChartDisplayFeature.DisplayFeatureId);
    }
    
    /**
     * Fill the PMF data to the chart
     * @param content PMFData
     */
    fill(content: any): void {
        super.fill(content);

        if (PMFData.IsPMF(content)) {
            this.pmfChartAPI.set(content);
        }
    }
}
