'use strict'

var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , babel = require('gulp-babel')
  , webpack = require('gulp-webpack')
  , sass = require('gulp-sass')

gulp.task('move', ['pack'], function () {
  return gulp.src('temp/main.js')
    .pipe(gulp.dest('dist'))
})

gulp.task('pack', ['sass'], function () {
  return gulp.src('temp/renderer.js')
    .pipe(webpack({
      entry: './temp/renderer.js',
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('sass', ['transpile'], function () {
  return gulp.src('assets/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('transpile', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      plugins: ['babel-polyfill', 'transform-runtime'],
      presets: ['env', 'react']
    }))
    .pipe(gulp.dest('temp'))
})

