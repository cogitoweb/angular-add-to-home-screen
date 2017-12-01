'use strict';

var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();

gulp.task('clean', function () {
  return gulp.src(['dist/'], {read: false}).pipe(plugins.clean());
});

gulp.task('scripts', function () {
  return gulp.src('js/**/*.js')
    .pipe(plugins.changed('dist/'))
    .pipe(plugins.concat('angular-add-to-home-screen.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(plugins.size());
});

gulp.task('styles', function () {
  return gulp.src('styles/**/*.css')
    .pipe(plugins.changed('dist/'))
    .pipe(plugins.base64())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['scripts', 'styles']);

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

