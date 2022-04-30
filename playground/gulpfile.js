'use strict'
const sass = require('gulp-sass')(require('sass'))
const async = require('async')

const imagemin = require('gulp-imagemin')
const gulp = require('gulp'),
  browserify = require('gulp-browserify'),
  autoprefixer = require('gulp-autoprefixer'),
  cssBeautify = require('gulp-cssbeautify'),
  removeComments = require('gulp-strip-css-comments'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  rigger = require('gulp-rigger'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch'),
  plumber = require('gulp-plumber'),
  run = require('run-sequence'),
  rimraf = require('rimraf'),
  browserSync = require('browser-sync'),
  imageminPngquant = require('imagemin-pngquant'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  sourcemaps = require('gulp-sourcemaps')

const merge = require('merge-stream')

const babel = require('gulp-babel')

const iconfont = require('gulp-iconfont')
const runTimestamp = Math.round(Date.now() / 1000)
const iconfontCss = require('gulp-iconfont-css')

/* Paths to source/build/watch files
=========================*/

const path = {
  build: {
    html: 'build/',
    js: 'build/assets/js/',
    css: 'build/assets/css/',
    img: 'build/assets/images/',
    fonts: 'build/assets/fonts/',
    iconsFont: 'build/assets/fonts/icons',
  },
  watchBuild: {
    css: 'build/assets/css/**/*.min.css',
    img: 'build/assets/images/**/*.*',
    fonts: 'build/assets/fonts/**/*.*',
  },
  buildPublic: {
    imgPublic: '../public/assets/images/',
    cssPublic: '../public/assets/css/',
    fontsPublic: '../public/assets/fonts/',
  },
  src: {
    html: 'src/*.{htm,html}',
    js: 'src/assets/js/*.js',
    css: 'src/assets/scss/style.scss',
    img: 'src/assets/images/**/*.*',
    fonts: 'src/assets/fonts/**/*.*',
    icons: 'src/assets/icons/*.*',
    components: 'src/components/**/*.*',
  },
  watch: {
    html: 'src/**/*.{htm,html}',
    js: 'src/assets/js/**/*.js',
    css: 'src/assets/scss/**/*.scss',
    img: 'src/assets/images/**/*.*',
    fonts: 'src/assets/fonts/**/*.*',
    icons: 'src/assets/icons/*.*',
    components: 'src/components/**/*.*',
  },
  clean: './build',
}

/* Webserver config
=========================*/

const config = {
  server: 'build/',
  notify: false,
  open: false,
  ui: false,
}

/* Tasks
=========================*/

gulp.task('Iconfont', function () {
  return gulp
    .src(path.src.icons)
    .pipe(
      iconfontCss({
        fontName: 'an-ico',
        path: 'src/assets/scss/fonts/_icons_template.scss',
        targetPath: '../../../../src/assets/scss/_icons.scss',
        fontPath: '../fonts/icons/',
      }),
    )
    .pipe(
      iconfont({
        fontName: 'an-ico', // required
        prependUnicode: true, // recommended option
        fixedWidth: true,
        centerHorizontally: true,
        formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
        timestamp: runTimestamp, // recommended to get consistent builds when watching files
      }),
    )
    .on('glyphs', function (glyphs, options) {
      // CSS templating, e.g.
      console.log(glyphs, options)
    })
    .pipe(gulp.dest(path.build.iconsFont))
})

gulp.task('server', function () {
  browserSync(config)
  browserSync.watch([path.build.html]).on('change', browserSync.reload)
})

gulp.task('html:build', function () {
  return gulp
    .src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('css:build', function () {
  return (
    gulp
      .src(path.src.css)
      // .pipe(plumber())
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(
        autoprefixer({
          overrideBrowserslist: ['last 5 versions'],
          cascade: true,
        }),
      )
      .pipe(removeComments())
      .pipe(cssBeautify())
      .pipe(gulp.dest(path.build.css))
      .pipe(
        cssnano({
          zindex: false,
          discardComments: {
            removeAll: true,
          },
        }),
      )
      .pipe(rename('style.min.css'))
      .pipe(gulp.dest(path.build.css))
      .pipe(browserSync.reload({ stream: true }))
  )
})

gulp.task('js:browserify', function () {
  return gulp
    .src('build/assets/js/react.js')
    .pipe(
      browserify({
        insertGlobals: true,
      }),
    )
    .pipe(rename('app.js'))
    .pipe(gulp.dest('build/assets/js/app'))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(gulp.dest('build/assets/js/app'))
})

gulp.task('js:build', function () {
  return gulp
    .src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(removeComments())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('fonts:build', function () {
  return merge([gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts))])
})

gulp.task('image:build', function () {
  return gulp.src(path.src.img).pipe(gulp.dest(path.build.img))
})

gulp.task('image:opti', function () {
  return gulp
    .src(path.src.img)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imageminJpegRecompress({
          progressive: true,
          max: 70,
          min: 60,
        }),
        imageminPngquant({ quality: [0.2, 0.4] }),
        imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
      ]),
    )
    .pipe(gulp.dest(path.build.img))
})

gulp.task('clean', function (cb) {
  return rimraf(path.clean, cb)
})

gulp.task('cleanPublic', function (cb) {
  async.parallel(
    Object.keys(path.buildPublic).map(function (dirKey) {
      return function (done) {
        console.log('cleaning: ' + path.buildPublic[dirKey])
        rimraf(path.buildPublic[dirKey] + '/*', done)
      }
    }),
    cb,
  )
  return rimraf(path.buildPublic.cssPublic, cb)
})

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'html:build',
      'css:build',
      'js:build',
      'fonts:build',
      'image:build',
      'Iconfont',
    ),
  ),
)

gulp.task('imageToPublic:move', function () {
  return gulp
    .src(path.watchBuild.img)
    .pipe(gulp.dest(path.buildPublic.imgPublic))
})
gulp.task('cssToPublic:move', function () {
  return gulp
    .src(path.watchBuild.css)
    .pipe(gulp.dest(path.buildPublic.cssPublic))
})
gulp.task('fontsToPublic:move', function () {
  return gulp
    .src(path.watchBuild.fonts)
    .pipe(gulp.dest(path.buildPublic.fontsPublic))
})

gulp.task(
  'move',
  gulp.series(
    'cleanPublic',
    gulp.parallel(
      'imageToPublic:move',
      'cssToPublic:move',
      'fontsToPublic:move',
    ),
  ),
)

gulp.task('watchBuild', function () {
  gulp.watch([path.build.css], gulp.series('cssToPublic:move'))
  gulp.watch([path.build.fonts], gulp.series('fontsToPublic:move'))
  gulp.watch([path.build.img], gulp.series('imageToPublic:move'))
})

gulp.task('watch', function () {
  gulp.watch([path.watch.html], gulp.series('html:build'))
  gulp.watch([path.watch.css], gulp.series('css:build'))
  gulp.watch([path.watch.js], gulp.series('js:build'))
  gulp.watch([path.watch.components], gulp.series('css:build'))
  gulp.watch([path.watch.img], gulp.series('image:build'))
  gulp.watch([path.watch.fonts], gulp.series('fonts:build'))
  gulp.watch([path.watch.icons], gulp.series('Iconfont'))
})

gulp.task(
  '====> moveToPublicWatcher',
  gulp.series('move', gulp.parallel('watchBuild')),
)

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')))
