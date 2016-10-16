import {ClientCredentials} from "../../../shared/auth";


/**
 * Store the credentials for Spotify Web Application
 */
export const SpotifyCredentials: ClientCredentials = {
    clientId: "",
    clientSecret: "",
    redirectUri: "http://localhost:5000/callback",
    scopes: ["user-read-private", "playlist-read-private", "playlist-read-collaborative"]
};
