const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const npmDist = require('gulp-npm-dist');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')


// Sass compilation


  gulp.task('sass', function(){
      return gulp.src('app/sass/**/*.sass')
        .pipe(sass({
            errorLogToConsole:true,
            // outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist:  ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
  });

// Pug

  gulp.task('pug', function(){
    return gulp.src('app/pug/pages/**/*.pug')
      .pipe(pug({
        pretty: true,
        basedir: 'app/pug'
      }))
      .pipe(gulp.dest('app/'))
  });

// Browser sync


  gulp.task('browser-sync', function() {
      browserSync({
          server: {
              baseDir: 'app'
          },
          notify: false
      });
  });


// Watch


  gulp.task('watch', function() {
      gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
      gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
      gulp.watch('app/*.html').on('change', browserSync.reload);
      gulp.watch('app/js/*.js').on('change', browserSync.reload);
  });


// Libs

    // css libs

      var csslibs = [
		'app/libs/normalize.css/normalize.css',
		'app/libs/bootstrap/dist/css/bootstrap-grid.min.css',
		'app/libs/animate.css/animate.min.css',
		'app/libs/magnific-popup/dist/magnific-popup.css',
		'app/libs/slick-slider/slick/slick.css',
		'app/libs/slick-slider/slick/slick-theme.css',
      ]

    // js libs

      var jslibs = [
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/wowjs/dist/wow.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		    'app/libs/slick-slider/slick/slick.min.js',
        'app/libs/mixitup/dist/mixitup.min.js',
      ]

    // pipe libs

      gulp.task('libs', function() {
        return gulp.src(npmDist(), {base:'./node_modules'})
          .pipe(gulp.dest('./app/libs'));
      });

    // min.css

      gulp.task('cssmin', function() {
        return gulp.src(csslibs)
          .pipe(concat('libs.min.css'))
          .pipe(cssnano())
          .pipe(gulp.dest('app/css'))
      })


    // min.js

      gulp.task('jsmin', function() {
        return gulp.src(jslibs)
          .pipe(concat('libs.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('app/js'))
      })

  // build

    gulp.task('build-css',function(){
        return gulp.src('app/css/**')
        .pipe(gulp.dest('dist/css'))
    });

    gulp.task('build-fonts',function(){
        return gulp.src('app/fonts/**')
        .pipe(gulp.dest('dist/fonts'))
    });

    gulp.task('build-js',function(){
        return gulp.src('app/js/**')
        .pipe(gulp.dest('dist/js'))
    });

    gulp.task('build-html',function(){
        return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
    });

    // imagemin

        gulp.task('img', function() {
            return gulp.src('app/img/**/*')
            .pipe(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()]
            }))
            .pipe(gulp.dest('dist/img'))
        });






gulp.task('libsinit', gulp.series('libs','cssmin','jsmin'));
gulp.task('watch', gulp.parallel('sass', 'pug', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('build-css', 'build-fonts', 'build-js', 'build-html','img'));
