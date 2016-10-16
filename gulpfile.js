/**
 * Gulpfile for mshuffle library's build
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
    outDir: ".",
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
        // Shared compiled js
        `${config.outDir}/shared/**/*.js`,
        // Library compiled js
        `${config.outDir}/lib/**/*.js`,
        `${config.outDir}/${config.mainFile}`
    ]);
});

// Default
gulp.task("default", ["clean", "build"]);
