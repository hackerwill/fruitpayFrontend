/**
 - 使用前請先安裝
	1.nodejs ,官網就有 
**/

require('es6-promise').polyfill();	//因為autoprefixer的BUG才需要加
var gulp = require('gulp');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');
var uglify = require('gulp-uglify'); 
var header = require('gulp-header');
var footer = require('gulp-footer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var minifyHTML  = require('gulp-minify-html');
var remember = require('gulp-remember');	
var bower = require('bower');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var gulpIf = require("gulp-if");
var minimist = require("minimist");
var replace = require("gulp-replace");

var options = minimist(process.argv.slice(2), { boolean: "prod", boolean: "test"});

//要打包的檔案
var config = {
	replacement : {
		gaId : {
			path : "build/js/main.js",
			dest : "build/js/",
			origin : "${GA_ID}",
			replace : options.prod ? "UA-54050037-3" : options.test ? "UA-54050037-4" : "UA-54050037-4"
		},
		htmlBaseHref : {
			path : "build/index.html",
			dest : "build",
			origin : "${GULP_BASE_HREF}",
			replace : options.prod ? "/fruitpay/" : options.test ? "/fruitpayTest/" : "/"
		},
		htmlLiveloadScript : {
			path : "build/index.html",
			dest : "build",
			origin : "${GULP_LIVELOAD_SCRIPT}",
			replace : options.prod ? "" : options.test ? "" : "<script src='//localhost:35729/livereload.js'></script>"
		},
		jsServerDomain : {
			path : "build/js/main.js",
			dest : "build/js/",
			origin : "${GULP_SERVER_DOMAIN}",
			replace : options.prod ? "http://fruitpay.com.tw/fruitpay/" : options.test ? "http://beta.fruitpay.com.tw/fruitpayTest/" : "http://beta.fruitpay.com.tw/fruitpayTest/"
		},
		jsClientDomain : {
			path : "build/js/main.js",
			dest : "build/js/",
			origin : "${GULP_CLIENT_DOMAIN}",
			replace : options.prod ? "http://fruitpay.com.tw/fruitpay/" : options.test ? "http://beta.fruitpay.com.tw/fruitpayTest/" : "http://beta.fruitpay.com.tw/fruitpayTest/"
		}
	},
	scriptsGlob : [
		'app/app.module.js',	//the top app setup
		'app/**/*.module.js', 	//every feature module setup
		'app/**/controller/*.js',
		'app/**/service/*.js',
		'app/**/model/*.js',
		'app/**/directive/*.js'
	],
	customizedLibGlob : [
		'customized_components/**'
	],
	htmlGlob : [
		'app/**/*.html',
		'index.html'
	],
	stylesGlob : [
		'app/**/css/*.css'
	],
	imagesGlob : [
		'content/images/*.jpg',
		'content/images/*.png'
	],
	getAllPath : function(){
		return this.scriptsGlob
			.concat(this.htmlGlob)
			.concat(this.imagesGlob)
			.concat(this.stylesGlob);
	}
};

gulp.task('build-libs', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb(); // notify gulp that this task is finished
    });
 
});

gulp.task('build-customized-lib', function() {
	return gulp.src(config.customizedLibGlob, {base: '.'})
		.pipe(gulp.dest('build/'));
});

//打包並存放
gulp.task('build-js', function() {
	return  gulp.src(config.scriptsGlob)
		.pipe(replace(config.replacement.htmlBaseHref.origin, config.replacement.htmlBaseHref.replace))
		.pipe(replace(config.replacement.jsServerDomain.origin, config.replacement.jsServerDomain.replace))
		.pipe(replace(config.replacement.jsClientDomain.origin, config.replacement.jsClientDomain.replace))
		.pipe(replace(config.replacement.gaId.origin, config.replacement.gaId.replace))
		.pipe(cached('scripts'))        // only pass through changed files
		.pipe(jshint())                 // do special things to the changed files...
		.pipe(header('(function () {')) // e.g. jshinting ^^^
		.pipe(footer('})();'))          // and some kind of module wrapping
		.pipe(remember('scripts'))      // add back all files to the stream
		.pipe(concat('main.js'))         // do things that require all files
		.pipe(gulpIf(options.prod, uglify()))
		.pipe(gulp.dest('build/js'));
});

//將html壓縮放到build對應資料夾
gulp.task('build-html',function() {
  var opts = {comments:false,spare:false,quotes:true};
  return gulp.src(config.htmlGlob) 
	.pipe(replace(config.replacement.htmlBaseHref.origin, config.replacement.htmlBaseHref.replace))
	.pipe(replace(config.replacement.htmlLiveloadScript.origin, config.replacement.htmlLiveloadScript.replace))
    .pipe(gulpIf(options.prod, minifyHTML(opts)))
    .pipe(gulp.dest('build'));
});

gulp.task('build-css', function(){
    return gulp.src(config.stylesGlob)
    .pipe(gulpIf(options.prod, cleanCSS()))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task('build-images', function() {
    return gulp.src(config.imagesGlob)
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('build/content/images'));
});


gulp.task('watch',['build-files'], function () {
  //檔案變更,就重新打包釋出
  var scriptWatcher = gulp.watch(config.scriptsGlob, ['build-js']); // watch the same files in our scripts task 
  var htmlWatcher = gulp.watch(config.htmlGlob, ['build-html']); 
  var imagesWatcher = gulp.watch(config.imagesGlob, ['build-images']); 
  var styleWatcher = gulp.watch(config.stylesGlob, ['build-css']); 
  
  scriptWatcher.on('change', function (event) {
   //假如有檔案刪除,要拿掉相對在記憶體catch的檔案資訊
    if (event.type === 'deleted') { // if a file is deleted, forget about it 
      delete cached.caches['scripts'][event.path];
      remember.forget('scripts', event.path);
    }
  });
});

gulp.task('server', function(){
	connect.server({
		root: 'build',
		port: 8888,
		livereload: true,
		middleware: function(connect, opt) {
            return [ historyApiFallback({}) ];
        }
    });
	//頁面綁上<script src="//localhost:35729/livereload.js"></script>
	//當檔案變更時可以觸發browser reload
	gulp.watch(config.getAllPath(), function (file) {
		gulp.src(config.getAllPath())
			.pipe(connect.reload());
	});
	
});


gulp.task('default', ['build','watch', 'server' ]  );
gulp.task('build', ['build-files']);
gulp.task('build-files', ['build-html', 'build-js', 'build-images', 'build-css', 'build-customized-lib']);
