"use strict";

// Plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const gulp = require('gulp');
// gulp plugins and utils
const livereload = require('gulp-livereload');
// var sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const plumber = require("gulp-plumber");
const concat = require('gulp-concat');
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");
const postcss = require('gulp-postcss');
const custom_media = require('postcss-custom-media');
const ejs = require("gulp-ejs");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./_site/"
    },
    port: 8000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function css() {
  return gulp
    .src('src/sass/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest('./public/assets/css/'))
    .pipe(concat('styles.css'))
    .pipe(postcss([custom_media(),autoprefixer()]))
    .pipe(gulp.dest('./public/assets/css/'))
    // .pipe(browsersync.stream())
}

function onceagaincss() {
  return gulp
    .src('src/onceagain/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest('./public/assets/css/'))
    .pipe(concat('onceagain.css'))
    .pipe(postcss([custom_media(),autoprefixer()]))
    .pipe(gulp.dest('./public/assets/css/'))
    // .pipe(browsersync.stream())
}

// template compilation
const compiler = require('gulp-hogan-compile');

function templates() {
  return gulp
  .src('src/templates/**/*.html')
  .pipe(compiler('templates.js'))
  // .pipe(gulp.dest('./public/assets/js/'))
  .pipe(gulp.dest('./src/js/'))
}

function templatesAndScripts() {

}

function scripts() {
  return (
    gulp
    .src(['./src/js/vendor/*.js', './src/js/lib/*.js', './src/js/scripts.js'])
      // .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(babel({
        "plugins": ["@babel/plugin-proposal-class-properties"],
        "presets": ["@babel/preset-env"]
      }))
      .pipe(webpackstream(webpackconfig, webpack))
      .pipe(concat('all.js'))
      .pipe(rename('application.js'))
      .pipe(gulp.dest('./public/assets/js/'))
      // .pipe(browsersync.stream())
  )
}

function generateHTML() {
  return gulp.src('./src/content/**/*.ejs')
    .pipe(ejs({title: "Parts"}))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./public/'))
}

// Watch files
function watchFiles() {
  /* First build */
  gulp.parallel(css, onceagaincss, js, generateHTML, templates);
  /* Now Watch */
  gulp.watch("./src/sass/**/*", css);
  gulp.watch("./src/onceagain/**/*", onceagaincss);
  gulp.watch("./src/js/**/*", scripts);
  gulp.watch("./src/templates/**/*", gulp.series(templates, js))
  gulp.watch("./src/content/**/*", generateHTML);

  gulp.watch("./src/onceagain/**/*", hundredthingscss);
  gulp.watch("./src/hundredthings/content/**/*", hundredthingscontent);
}

function bigBuild(){
  return gulp.series(gulp.parallel(css, js))
}

// deploy Stuff
function hundredthingscss() {
  return gulp
  .src('src/onceagain/*.scss')
  .pipe(plumber())
  .pipe(sass({ outputStyle: "expanded" }))
  .pipe(gulp.dest('./public/hundredthings/assets/css/'))
  .pipe(concat('styles.css'))
  .pipe(postcss([custom_media(),autoprefixer()]))
  .pipe(gulp.dest('./public/hundredthings/assets/css/'))
}

function hundredthingscontent() {
    return gulp.src('./src/hundredthings/content/**/*.ejs')
    .pipe(ejs({title: "I'm gonna make 100 things as fast as possible!"}))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./public/hundredthings/'))
  }

const js = gulp.series(scripts);
// const build = gulp.series(templates, gulp.parallel(css, js, generateHTML, templates));
const build = gulp.parallel(css, onceagaincss, js, generateHTML, templates);
// const watch = gulp.parallel(watchFiles, browserSync);
const watch = gulp.parallel(watchFiles);

exports.css = css;
exports.js = js;
exports.build = build;
// exports.build = bigBuild;
exports.watch = watch;
exports.html = generateHTML;
exports.default = watch;

