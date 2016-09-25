var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglify'),
    order       = require("gulp-order"),
    sourcemaps  = require('gulp-sourcemaps'),
    config = {
        SOURCES         : './sources/*.js',
        DEST            : './app',
        PATTERNS_SRC    : [
            "./sources/flex.core.js",
            "./sources/flex.binds.js",
            "./sources/flex.events.js",
            "./sources/flex.html.js",
            "./sources/flex.types.array.js",
            "./sources/flex.ui.patterns.js",
            "./sources/app.patterns.js",
        ],
        EXPATTERNS_SRC  : [
            "./sources/flex.core.js",
            "./sources/flex.binds.js",
            "./sources/flex.events.js",
            "./sources/flex.html.js",
            "./sources/flex.types.array.js",
            "./sources/flex.ui.window.move.js",
            "./sources/flex.ui.window.resize.js",
            "./sources/flex.ui.window.focus.js",
            "./sources/flex.ui.window.maximize.js",
            "./sources/flex.ui.patterns.js",
            "./sources/app.expatterns.js",
        ]
    };

gulp.task('lint', function () {
    gulp.src(config.SOURCES)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('expatterns', function () {
    gulp.src(config.EXPATTERNS_SRC)
        .pipe(sourcemaps.init())
        .pipe(concat('expatterns.js'))
        .pipe(gulp.dest(config.DEST))
        .pipe(rename('expatterns.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.DEST));
});

gulp.task('patterns', function () {
    gulp.src(config.PATTERNS_SRC)
        .pipe(sourcemaps.init())
        .pipe(concat('patterns.js'))
        .pipe(gulp.dest(config.DEST))
        .pipe(rename('patterns.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(config.DEST));
});

gulp.task('developing', function () {
    gulp.run('lint', 'expatterns', 'patterns');
    gulp.watch(config.SOURCES, function (event) {
        gulp.run('lint','expatterns', 'patterns');
    });
});

gulp.task('build', function () {
    gulp.run('expatterns', 'patterns');
});
