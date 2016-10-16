/**
 * Gulpfile for site's build
 */

var browserify = require("browserify");
var del = require("del");
var gulp = require("gulp");
var pathmodify = require("pathmodify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");


// Configurations
var config = {
    baseDir: ".",
    codeDir: "js",
    outDir: "js",
    outFile: "mshuffle-bundle.js"
};

// Build - compiles ts and bundles
// Based on: http://www.typescriptlang.org/docs/handbook/gulp.html
gulp.task("build", function () {
    return browserify({
        basedir: config.baseDir,
        debug: true,
        entries: [
            `${config.codeDir}/mshuffle.ts`
        ],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source(config.outFile))
    .pipe(gulp.dest(config.outDir))
});

// Clean - cleans compilations and bundles
// Based on: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task("clean", function () {
    return del([
        `${config.outDir}/${config.outFile}`
    ]);
});

// Default
gulp.task("default", ["clean", "build"]);
