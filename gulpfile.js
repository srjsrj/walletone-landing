var lr = require('tiny-lr'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    nib = require('nib'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('connect'),
    server = lr();

gulp.task('stylus', function () {
    gulp.src('./src/styl/main.styl')
        .pipe(stylus({use: [nib()]}))
        .on('error', console.log)
        .pipe(gulp.dest('./build/css/'))
        .pipe(livereload(server));
});

gulp.task('scripts', function () {
    gulp.src('./src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('scriptsCompress', function() {
  gulp.src('./build/js/scripts.js')
    .pipe(uglify('scripts.min.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('jade', function() {
    gulp.src(['./src/jade/*.jade', '!./src/jade/_*.jade'])
        .pipe(jade({
            pretty: true
        }))
        .on('error', console.log)
    .pipe(gulp.dest('./build/'))
    .pipe(livereload(server));
});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./build'))
        .listen('1234');
    console.log('Сервер доступен http://localhost:1234');
});

gulp.task('watch', function() {
    gulp.run('stylus');
    gulp.run('jade');
    gulp.run('scripts');

    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('./src/styl/*.styl', function() {
            gulp.run('stylus');
            console.log('Stylus compiling...');
        });
        gulp.watch('./src/jade/*.jade', function() {
            gulp.run('jade');
            console.log('Jade compiling...');
        });
        gulp.watch('./src/js/*.js', function() {
            gulp.run('scripts');
            console.log('Scripts concat and minify...');
        });
    });
    gulp.run('http-server');
});