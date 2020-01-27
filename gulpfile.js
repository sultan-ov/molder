var gulp              = require('gulp'),
		sass              = require('gulp-sass'),
		browserSync       = require('browser-sync').create(),
		concat            = require('gulp-concat'),
		cleancss          = require('gulp-clean-css'),
		autoprefixer      = require('gulp-autoprefixer'),
		rsync             = require('gulp-rsync'),
		newer             = require('gulp-newer'),
		rename            = require('gulp-rename'),
		imagemin          = require('gulp-imagemin'),
		responsive        = require('gulp-responsive'),
		merge             = require('merge-stream'),
		del               = require('del'),
		rollup            = require('rollup'),

		config            = require('./rollup.config.js');

// Local Server
gulp.task('browser-sync', function() {
	browserSync.init({
		// Proxy an EXISTING vhost

		// Using a vhost-based url
		// proxy: "local.dev"

		// Using a localhost address with a port
		// proxy: "localhost:8888"

		// Using localhost sub directories
		// proxy: "localhost/site1"

		// When your app also uses web sockets
		// proxy: {
		//    target: "http://yourlocal.dev",
		//    ws: true
		// }
		server: {
			baseDir: 'app'
		},
		notify: false,
		// cors: true, // Work with WebGL
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
		// browser: ["google chrome", "firefox"] // Open the site in Chrome & Firefox
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({
		outputStyle: 'expanded',
		includePaths: [__dirname + '/node_modules']
	}))
	.pipe(concat('styles.min.css'))
	.pipe(autoprefixer({overrideBrowserslist: ['>= 0.01%']}))
	.pipe(cleancss({
		compatibility: 'ie8',
		level: {
			1: { specialComments: 0 },
			2: { removeDuplicateFontRules: false }
		}
	}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('build', () => {
  return rollup.rollup({
    input: config.input,
    plugins: config.plugins
  }).then(bundle => {
    return bundle.write(config.output);
  });
});

gulp.task('scripts', gulp.series('build', bsReload));

// Lossless optimizers and resizer with compressor
// 'app/img/_src/.icon/' folder only for favicon
gulp.task('img-processing', function() {
	var iconFold = gulp.src('app/img/_src/.icon/**/*.{svg,png,ico}')
	.pipe(newer('app/img/@icon'))
	.pipe(imagemin())
	.pipe(gulp.dest('app/img/@icon'));

	var specFold = gulp.src(['app/img/_src/**/*.{svg,gif}', '!app/img/_src/.icon'])
	.pipe(newer('app/img/@spec'))
	.pipe(imagemin())
	.pipe(gulp.dest('app/img/@spec'));

	var mainFold = gulp.src(['app/img/_src/**/*.{png,jpg,jpeg}', '!app/img/_src/.icon'])
	.pipe(newer('app/img/@1x'))
	.pipe(imagemin())
	.pipe(responsive({
		'*': [{
			// Produce @2x images
			width: '100%', quality: 90, rename: { prefix: '@2x/', },
		}, {
			// Produce @1x images
			width: '50%', quality: 90, rename: { prefix: '@1x/', }
		}]
	})).on('error', function (e) {})
	.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
	.pipe(gulp.dest('app/img'));

	return merge(iconFold, specFold, mainFold);
});

gulp.task('img', gulp.series('img-processing', bsReload));

// Clean @* pictures
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
	return gulp.src('app/**/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/*.{js,jsx}', '!app/js/*.min.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('img', 'styles', 'scripts', 'browser-sync', 'watch'));
