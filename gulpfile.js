/**
 - 使用前請先安裝
	1.nodejs ,官網就有 
	2.gulp相關套件 ,裝了nodejs 就有npm(套件管理工具)可用
 - 開command line ,安裝gulp套件(如果裝不了 可能要用系統管理員權限開啟command line)
    npm install -g gulp gulp-connect connect-history-api-fallback gulp-uglify gulp-header gulp-footer gulp-concat gulp-jshint gulp-cached gulp-remember gulp-minify-html gulp-imagemin gulp-minify-css gulp-autoprefixer bower --save-dev 
 - cd 到fruitpay目錄下,設定連結到global的目錄 ,讓gulp在執行時可以引用到lib
    npm link gulp gulp-connect connect-history-api-fallback gulp-uglify gulp-header gulp-footer gulp-concat gulp-jshint gulp-cached gulp-remember gulp-minify-html gulp-imagemin gulp-minify-css gulp-autoprefixer bower --save-dev 
 - 執行gulp
    gulp
uglify : Minify files 
gulp-live-server : easy light weight server with livereload
header : add header to file(s) in the pipeline
footer : add footer to file(s) in the pipeline.
concat : will concat files by your operating systems 
jshint : A Static Code Analysis Tool for JavaScript
cached : A simple in-memory file cache for gulp
**/
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
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

//要打包的檔案
var config = {
	scriptsGlob : [
		'app/app.module.js',	//the top app setup
		'app/**/*.module.js', 	//every feature module setup
		'app/**/controller/*.js',
		'app/**/service/*.js',
		'app/**/model/*.js'
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

gulp.task('bower', function(cb){
  bower.commands.install([], {save: true}, {})
    .on('end', function(installed){
      cb(); // notify gulp that this task is finished
    });
 
});

gulp.task('moveTasks', ['html-minify', 'js-minify', 'images-minify', 'css-minify']);

//打包並存放
gulp.task('js-minify', function() {
	return  gulp.src(config.scriptsGlob)
	  .pipe(cached('scripts'))        // only pass through changed files
      .pipe(jshint())                 // do special things to the changed files...
      .pipe(header('(function () {')) // e.g. jshinting ^^^
      .pipe(footer('})();'))          // and some kind of module wrapping
      .pipe(remember('scripts'))      // add back all files to the stream
      .pipe(concat('main.js'))         // do things that require all files
      .pipe(uglify())
      .pipe(gulp.dest('build/js'));
});

//將html壓縮放到build對應資料夾
gulp.task('html-minify',function() {
  var opts = {comments:false,spare:false,quotes:true};
  return gulp.src(config.htmlGlob) 
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('build'));
});

gulp.task('css-minify', function(){
    return gulp.src(config.stylesGlob)
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('build/css'))
});

gulp.task('images-minify', function() {
    return gulp.src(config.imagesGlob)
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('build/images'));
});


gulp.task('watch',['bower','moveTasks'], function () {
  //檔案變更,就重新打包釋出
  var scriptWatcher = gulp.watch(config.scriptsGlob, ['js-minify']); // watch the same files in our scripts task 
  var htmlWatcher = gulp.watch(config.htmlGlob, ['html-minify']); 
  var imagesWatcher = gulp.watch(config.imagesGlob, ['images-minify']); 
  var styleWatcher = gulp.watch(config.stylesGlob, ['css-minify']); 
  
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
		connect.reload();
	});
	
});


gulp.task('default', ['bower','moveTasks','watch', 'server' ]  );
