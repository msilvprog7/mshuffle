import {DisplayAPI} from "../../../shared/display";
import LoggedInDisplayFeature from "./LoggedInDisplayFeature";
import PMFChartDisplayFeature from "./PMFChartDisplayFeature";
import PlayButtonToggleDisplayFeature from "./PlayButtonToggleDisplayFeature";
import PlaylistDisplayFeature from "./PlaylistDisplayFeature";
import PlaylistsDisplayFeature from "./PlaylistsDisplayFeature";
import SongDisplayFeature from "./SongDisplayFeature";
import UserDisplayFeature from "./UserDisplayFeature";

import {ChartAPI} from "../../../shared/chart";
import PMFChartAPI from "../chart/PMFChartAPI";
import {PMFData} from "../../../shared/data";

import {MshuffleClientAPI} from "../../../shared/mshuffle";


/**
 * API to interact with the display on the site
 */
export default class SiteDisplayAPI extends DisplayAPI {
    /**
     * Static Id
     */
    public static DisplayFeatureId = "SiteDisplayAPI";

    /**
     * PMF Chart API
     */
    private pmfChartAPI: ChartAPI<PMFData>;

    /**
     * Id of the Canvas for PMF
     */
    private static PMFCanvasId = "pmfCanvas";

    /**
     * Label for the PMF Chart
     */
    private static PMFChartLabel = "Song Probability";
    
    /**
     * Creates an instance of a SiteDisplayAPI
     * @param mshuffleClientAPI Mshuffle Client API
     */
    constructor(private mshuffleClientAPI: MshuffleClientAPI) {
        super(SiteDisplayAPI.DisplayFeatureId);

        this.pmfChartAPI = new PMFChartAPI(
            document.getElementById(SiteDisplayAPI.PMFCanvasId) as HTMLCanvasElement, 
            SiteDisplayAPI.PMFChartLabel);
        
        this.add(new LoggedInDisplayFeature());
        this.add(new PMFChartDisplayFeature(this.pmfChartAPI));
        this.add(new PlayButtonToggleDisplayFeature());
        this.add(new PlaylistDisplayFeature(this.pmfChartAPI));
        this.add(new PlaylistsDisplayFeature(this.mshuffleClientAPI));
        this.add(new SongDisplayFeature());
        this.add(new UserDisplayFeature());
    }
}
