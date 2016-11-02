/**
 * Gulpfile for mshuffle test's build
 */

var del = require("del");
var gulp = require("gulp");
var gulpTs = require("gulp-typescript");
var pathmodify = require("pathmodify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");


// Configurations
var config = {
    tsConfig: "tsconfig.json",
    outDir: "build-js",
    mainFile: "mshuffle.js"
};

// Build - compiles ts and bundles
// Based on: http://www.typescriptlang.org/docs/handbook/gulp.html
gulp.task("build", function () {
    var tsProject = gulpTs.createProject(config.tsConfig);

    return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest(config.outDir));
});

// Clean - cleans compilations
// Based on: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task("clean", function () {
    return del([
        // Output directory
        `${config.outDir}/`
    ]);
});

// Default
gulp.task("default", ["clean", "build"]);
