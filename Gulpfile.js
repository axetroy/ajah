/**
 * Created by axetroy on 16-10-28.
 */

const gulp = require('gulp');
const process = require('process');
const exec = require('child_process').exec;

gulp.task('test:watch', function () {
  gulp.watch([
    './*.ts',
    './src/*.ts',
    './test/*.ts'
  ], function () {
    var steam = exec('npm run test');
    steam.stdout.pipe(process.stdout);
    steam.stderr.pipe(process.stderr);
  });
});