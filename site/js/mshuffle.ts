import {MshuffleClientAPI} from "../../shared/mshuffle";
import MshuffleSiteAPI from "./mshuffle/MshuffleSiteAPI";

import * as $ from "jquery";


let mshuffleSiteAPI: MshuffleClientAPI = new MshuffleSiteAPI();

$(document).ready(function () {
    
    mshuffleSiteAPI.getUser();
    mshuffleSiteAPI.getPlaylists();

});