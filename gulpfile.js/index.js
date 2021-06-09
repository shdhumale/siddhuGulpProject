const gulp = require('gulp');
const { src, series, parallel, dest, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const jsPath = 'src/assets/js/**/*.js';
const cssPath = 'src/assets/css/**/*.css';

function transferHtml() {
    return src('src/*.html').pipe(gulp.dest('dist'));
  }

  function transferImageTask() {
    return src('src/images/*').pipe(imagemin()).pipe(gulp.dest('dist/images'));
  }


function transferJsTask() {
    return src(jsPath)
      .pipe(sourcemaps.init())
      .pipe(concat('siddhu-minified.js'))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/assets/js'));
}


function transferCSSTask() {
    return src(cssPath)
      .pipe(sourcemaps.init())
      .pipe(concat('style.css'))
      .pipe(postcss([autoprefixer(), cssnano()])) 
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/assets/css'));
  }

  function watchTask() {
    watch([cssPath, jsPath], { interval: 1000 }, parallel(transferJsTask, transferCSSTask));
  } 

exports.transferHtml = transferHtml;   
exports.transferImageTask = transferImageTask;   

exports.transferJsTask = transferJsTask;  
exports.transferCSSTask = transferCSSTask;  

exports.default = series(
    parallel(transferHtml, transferImageTask, transferJsTask, transferCSSTask),
    watchTask
  );