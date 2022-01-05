"use strict";

// Plugins
const autoprefixer = require("autoprefixer");
const gulp = require('gulp');
// gulp plugins and utils
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const plumber = require("gulp-plumber");
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const custom_media = require('postcss-custom-media');
const ejs = require("gulp-ejs");

function css() {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(gulp.dest('./public/assets/css/'))
    .pipe(concat('littel.css'))
    .pipe(postcss([custom_media(),autoprefixer()]))
    .pipe(gulp.dest('./public/assets/css/'))
    .pipe(gulp.dest('./dist/css/'))
}

function generateHTML() {
  return gulp.src('./content/**/*.ejs')
    .pipe(ejs({title: "Littel"}))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./public/'))
}

// Watch files
function watchFiles() {
  /* First build */
  gulp.parallel(css, generateHTML);
  /* Now Watch */
  gulp.watch("./src/scss/**/*", css);
  gulp.watch("./src/content/**/*", generateHTML);
}

const build = gulp.parallel(css, generateHTML);
const watch = gulp.parallel(watchFiles);

exports.css = css;
exports.build = build;
exports.watch = watch;
exports.html = generateHTML;
exports.default = watch;
