# mshuffle
A music shuffling algorithm that takes into account your listening history and current preferences.
Implemented with NodeJS and the Spotify Web API.

## Setup

### Spotify Web App

Create a [Spotify Web Application](https://developer.spotify.com/my-applications) and enter your credentials in `lib/music/spotify/SpotifyCredentials.ts`

If you are __developing__, please run the following command to prevent yourself from uploading your credentials to the repository:

```
git update-index --assume-unchanged lib/music/spotify/SpotifyCredentials.ts
```

### Node

You will need [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) to begin, then install the required dependencies:

```
npm install -g gulp-cli
npm install -g mocha
npm install
```

### Build

[Gulp](http://gulpjs.com/) is used to build both the __site__ and __lib__, with a set of handy `tools/` for quickly building or cleaning the project.

`package.json` has a `prestart` command that will run a __clean-build__ (Gulp default task) on both the site and lib.

Be sure to edit `prestart` for the appropriate build tool you would like to run (either __.bat__ or __.sh__).

### Tests

[Mocha](http://mochajs.org/) is used for a test framework along with [Chai](http://chaijs.com/) for an assertion library.


## Running

Edit `package.json` to call the appropriate `prestart` build tool (either __.bat__ or __.sh__).

Build and run the server using `npm start`

Navigate to the site at `http://localhost:5000/`