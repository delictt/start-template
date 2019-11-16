const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const npmDist = require('gulp-npm-dist');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');


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
      gulp.watch('app/sass/*.sass', gulp.parallel('sass'));
      gulp.watch('app/*.html').on('change', browserSync.reload);
      gulp.watch('app/js/*.js').on('change', browserSync.reload);
  });


// Libs

  // libs list

    // css libs

      var csslibs = [
          'app/libs/normalize.css/normalize.css',
          'app/libs/bootstrap/dist/css/bootstrap-grid.min.css',
          'app/libs/animate.css/animate.min.css',
          'app/libs/hamburgers/dist/hamburgers.min.css',
          'app/libs/owl.carousel/dist/assets/owl.carousel.min.css'
      ]

    // js libs

      var jslibs = [
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/owl.carousel/dist/owl.carousel.min.js',
        'app/libs/wowjs/dist/wow.min.js',
        'app/libs/scroll.js'
      ]

  // libs tasks

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

    // fontawesome

      // fontawesome fonts

        gulp.task('fafont', function() {
            return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*.+(eot|ttf|woff|woff2)')
                .pipe(gulp.dest('app/fonts/fontawesome/webfonts'))
        });

      // fontawesome css

        gulp.task('facss', function() {
            return gulp.src('node_modules/@fortawesome/fontawesome-free/css/all.min.css')
                .pipe(gulp.dest('app/fonts/fontawesome/css'))
        });

      // pipe fontawesome

        gulp.task('fontawesome', gulp.parallel('fafont','facss'));







gulp.task('libsinit', gulp.series('libs','cssmin','jsmin','fontawesome'))

gulp.task('watch', gulp.parallel('sass', 'browser-sync', 'watch'));
