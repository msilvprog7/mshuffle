# mshuffle
A music shuffling algorithm that takes into account your listening history and current preferences.
Implemented with NodeJS and the Spotify Web API.

## Setup

Install node package with `npm install`

### Spotify Web App credentials

Create a __Spotify Web Application__ and enter your credentials in `lib/spotify/SpotifyCredentials.js`

If you are developing, please first run the following command to prevent yourself from uploading your credentials to the repository:

```
git update-index --assume-unchanged lib/spotify/SpotifyCredentials.js
```

## Running

Run the server `npm start` or `node mshuffle.js`

Navigate to the site at `http://localhost:5000/`