var gulp = require('gulp'),

    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify      = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del         = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache       = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
	imageResize = require('gulp-image-resize');
			

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/bootstrap/js/bootstrap.min.js',
		'app/libs/flexslider/jquery.flexslider-min.js',
		'app/libs/owl-carousel/owl.carousel.min.js',
        'app/libs/magnific/jquery.magnific-popup.min.js', // Берем Magnific Popup
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', function() {
    return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/bootstrap/css/bootstrap.min.css',
		'app/libs/flexslider/flexslider.css',
		'app/libs/owl-carousel/owl.carousel.css',
		'app/libs/owl-carousel/owl.theme.css',
        'app/libs/magnific/magnific-popup.css', 
		'app/libs/FontAwesome/css/font-awesome.min.css', 
        ])
        .pipe(concat('libs.css')) // Собираем их в кучу в новом файле libs.css
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('styles', function() {
    return gulp.src([ // Берем все необходимые файлы css
		'app/css/styles/styles.css',
		'app/css/styles/media-queries.css',
        ])
        .pipe(concat('main.css')) // Собираем их в кучу в новом файле libs.css
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        //.pipe(cssnano()) // Сжимаем
        //.pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('fonts', function() {
    return gulp.src([ 
        'app/libs/FontAwesome/fonts/*', // берем шрифты
		'app/libs/bootstrap/fonts/*' // берем шрифты
        ])
        .pipe(gulp.dest('app/fonts')); // Выгружаем в папку app/fonts
});

/*

Пока не удалось завести!

gulp.task('image-resize', function () {
  gulp.src('app/images/ava_src/*.*')
    .pipe(imageResize({
		width : 100,
		height : 100,
		crop : true,
		upscale : false,
		imageMagick: true
    }))
    .pipe(gulp.dest('app/images/ava'));
});*/


/*gulp.task('css-libs', function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});*/

gulp.task('watch', ['browser-sync', 'css-libs', 'styles', 'scripts', 'fonts'], function() {

    // Наблюдение за другими типами файлов
	gulp.watch('app/css/*.css', browserSync.reload); // Наблюдение за CSS
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
	
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/images/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/*',
        ])
		.pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);