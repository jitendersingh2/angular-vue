
var packageJson     = require('./package.json'),

    browserSync     = require('browser-sync'),
    apiMock         = require('api-mock'),
    proxyMiddleware = require('http-proxy-middleware'),

    del             = require('del'),
    gulp            = require('gulp'),
    less            = require('gulp-less'),
    concat          = require('gulp-concat'),
    jshint          = require('gulp-jshint'),
    jsonLint        = require("gulp-jsonlint"),
    wrap            = require('gulp-wrap'),
    insert          = require('gulp-insert'),

    fs              = require('fs'),

    karma           = require('karma').Server;


var settings = {

    version:        (packageJson.version || ''),
    date:           new Date().toDateString(),

    apiRoutes: {

        '/members/services/sec/surveytouchpoints'  : './api/touchpoints.apib',
        '/members/secure/data/erusurvey.json': './api/userinfo.apib'
    },

    servePath:      './src',

    serveRoutes: {


        '/members/secure/footer-responsive.htm': './node_modules/blueconnect-templates/dist/templatedAssets/members/secure/footer-responsive.htm',
        '/members/secure/header-responsive.htm': './node_modules/blueconnect-templates/dist/templatedAssets/members/secure/header-responsive.htm',
        '/members/secure/footer-responsive-classic.htm': './node_modules/blueconnect-templates/dist/templatedAssets/members/secure/footer-responsive-classic.htm',
        '/members/secure/header-responsive-classic.htm': './node_modules/blueconnect-templates/dist/templatedAssets/members/secure/header-responsive-classic.htm',

        '/assets/global/dist': './node_modules/fontcustom-icons/dist',
        '/assets/global': './node_modules/bcbsnc-global-assets/dist/global',
        '/assets/common': './node_modules/bcbsnc-global-assets/dist/common',
        '/assets/home': './node_modules/bcbsnc-global-assets/dist/home',
        '/assets/global/images/bc-subhead-bg.png':'../../images/bc-subhead-bg.png',

        '/assets/members/secure/apps/erusurvey/images/': './src/images'
    },

    genericMatch:   ['./src/**/*.md'],
    graphicMatch:   ['./src/**/*.png','./src/**/*.jpg','./src/**/*.gif'],
    jsonMatch:      ['./src/data/**/*.json'],

    jsQAMatch:      ['./src/**/*.js',                    '!src/**/*.ps.js', '!src/**/*.prod.js', '!src/**/*.dev.js', '!src/**/*_spec.js', '!src/bower_components/**/*.js'],
    jsPSMatch:      ['./src/**/*.js', '!src/**/*.qa.js',                    '!src/**/*.prod.js', '!src/**/*.dev.js', '!src/**/*_spec.js', '!src/bower_components/**/*.js'],
    jsMatch:        ['./src/**/*.js', '!src/**/*.qa.js', '!src/**/*.ps.js',                      '!src/**/*.dev.js', '!src/**/*_spec.js', '!src/bower_components/**/*.js'],

    jsHintMatch:    ['./src/**/*.js', 'src/**/*.qa.js', 'src/**/*.ps.js',                        'src/**/*.dev.js', '!src/**/*_spec.js', '!src/bower_components/**/*.js', '!src/js/**/*.js'],

    imgMatch:       ['./src/images/**/*'],
    cssMatch:       ['./src/styles/**/*.css', './src/styles/.cache/**/*.css'],
    htmlMatch:      ['./src/**/*.html','./src/**/*.htm', '!src/**/*.dev.html', '!src/**/*.dev.htm'],
    indexMatch:     ['./src/index.htm', './src/index.html'],
    partialMatch:   ['./src/components/**/*.htm', './src/components/**/*.html'],

    lessMain:       './src/styles/less/app.less',
    lessMatch:      ['./src/styles/**/*.less'],
    lessCache:      './src/styles/.cache',

    distDocs:       './docs',
    distLess:       './src/styles',

    // EDIT THESE PATHS. Add the name of the directory where your app will be built.
    dist:           './dist/assets/members/secure/apps/erusurvey',
    distStyles:     './dist/assets/members/secure/apps/erusurvey/css',
    distJSON:       './dist/templatedAssets/members/secure/data',
    distApp:        './dist/templatedAssets/members/secure/account/erusurvey/',
    distJsFile:     'app.min.js'
};


/**
 * Clean up the distribution directory
 */
gulp.task('clean', function () {

    return del([settings.dist+'/**/*']);
});


/**
 * Copy markdown, HTML, partials and CSS over to dist
 */
gulp.task('copy', ['clean'], function () {

    gulp.src(settings.genericMatch, {base: settings.servePath})
        .pipe(gulp.dest(settings.dist));

    gulp.src(settings.graphicMatch, {base: settings.servePath})
        .pipe(gulp.dest(settings.dist));

    gulp.src(settings.indexMatch)
        .pipe(gulp.dest(settings.distApp));

    gulp.src(settings.partialMatch, { base: settings.servePath })
        .pipe(gulp.dest(settings.dist));

    gulp.src(settings.cssMatch)
        .pipe(gulp.dest(settings.distStyles));

    gulp.src(settings.imgMatch, { base: settings.servePath })
        .pipe(gulp.dest(settings.dist));
});

/**
 * Setup for prod
 */
gulp.task('js-prod', function () {

});


/**
 * Setup for pstage
 */
gulp.task('js-ps', function () {

    settings.jsMatch = settings.jsPSMatch;
});


/**
 * Setup for pstage
 */
gulp.task('js-qa', function () {

    settings.jsMatch = settings.jsQAMatch;
});


/**
 * Setup directory for JSON build
 */
gulp.task('json-build', function () {

    gulp.src(settings.jsonMatch)
        .pipe(gulp.dest(settings.distJSON));
});


/**
 * Concat JS files and move over to dist
 */
gulp.task('js', ['clean', 'js-hint'], function () {

    var version = '//@version ' + settings.version +', '+ settings.date + '\n',
     wrapper = '//@file <%= file.path.split("/").pop() %>\n<%= contents %>';

    gulp.src(settings.jsMatch, { base: settings.servePath })
        .pipe(wrap(wrapper))
        .pipe(concat(settings.distJsFile))
        .pipe(insert.prepend(version))
        .pipe(gulp.dest(settings.dist));
});


/**
 * Compile Less into CSS
 */
gulp.task('less', function () {

    return gulp.src(settings.lessMain)
        .pipe(less())
        .pipe(gulp.dest(settings.lessCache))
        .pipe(browserSync.reload({ stream: true }));
});


/**
 * JSHint JS files
 */
gulp.task('js-hint', function () {

    return gulp.src(settings.jsHintMatch)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserSync.reload({ stream: true }));
});


/**
 * Run unit test
 */
gulp.task('unit-test', function (done) {

    /*new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();*/
});


/**
 * JSON Lint
 */
gulp.task('json-lint', [], function () {

    return gulp.src(settings.jsonMatch)
        .pipe(jsonLint())
        .pipe(jsonLint.reporter());
});


/**
 * Launch local file serve and api spoof from api-blueprint.
 */
gulp.task('browser-sync', ['less', 'js-hint'], function() {

    var routes = settings.serveRoutes || {},
        port,
        localArr;

    var browserSyncOptions = {
        server: {
            middleware: [function (req, res, next) {

                if ((/\.htm$|\.html$/i).test(req.url)) {

                    var content    = fs.readFileSync('./src' + req.url).toString(),
                        matchParse = content.match(/#parse\(\s*["'](?:.*)["']\s*\)|#include\(\s*["'](?:.*)["']\s*\)/g),
                        replaceTags= content.match(/#if\((?:.*)\)|#end|#set\((?:.*)\)/g);

                    try {

                        if (replaceTags) {

                            replaceTags.map(function (val, index) {

                                content = content.replace(val, '');
                            });
                        }

                        if (matchParse) {

                            matchParse.map(function (val, index) {

                                var file        = val.replace(/#parse|#include|\(|\)|"|'/g, ''),
                                    routeKeys   = Object.keys(routes),
                                    success     = false;

                                for (var i=0; i<routeKeys.length; i++) {

                                    if (routeKeys[i].indexOf(file) > -1) {

                                        tempContent = fs.readFileSync(routes[routeKeys[i]], 'utf8');
                                        tempReplaceTags= tempContent.match(/#parse\(\s*["'](?:.*)["']\s*\)|#include\(\s*["'](?:.*)["']\s*\)|#if\((?:.*)\)|#end|#set\((?:.*)\)/g);

                                        if (tempReplaceTags) {

                                            tempReplaceTags.map(function (val, index) {

                                                tempContent = tempContent.replace(val, '');
                                            });
                                        }

                                        content = content.replace(val, tempContent);
                                        success = true;
                                        break;
                                    }
                                }

                                if (!success) {

                                    content = content.replace(val, '');
                                }
                            });

                            res.setHeader('Content-Type', 'text/html');
                            res.end(content);

                        } else {

                            next();
                        }

                    } catch(e) {

                        console.log('browser-sync #parse/#include issue...', e);
                        next();
                    }

                } else {

                    next();
                }

            }],
            baseDir:    settings.servePath,
            routes:     settings.serveRoutes,
            directory:  true
        }
    };

    if (settings.apiRoutes) {

        port = 8080;
        localArr = [];

        Object.keys(settings.apiRoutes).map(function(key) {

            var apiProxy = 'http://localhost:' + port;

            var mockServer = new apiMock({
                blueprintPath: settings.apiRoutes[key],
                options      : {
                    port: port
                }
            });

            //mockServer.run();

            localArr.push(
                proxyMiddleware(key, {target: apiProxy})
            );

            port += 1;
        });

        browserSyncOptions.server.middleware = browserSyncOptions.server.middleware.concat(localArr);
    }

    browserSync(browserSyncOptions);

    gulp.watch(settings.lessMatch, ['less']);

    gulp.watch(settings.jsMatch, ['js-hint', 'unit-test']);

    gulp.watch(settings.jsonMatch, ['json-lint']);

    gulp.watch([settings.servePath+'/**/*']).on('change', browserSync.reload);
});


/**
 * Serve documentation
 */
gulp.task('docs',function() {

    var docs = browserSync({
        server:{
            baseDir:settings.distDocs,
            index:'index.html'
        }
    });
});


gulp.task('serve', ['less','browser-sync']);
gulp.task('build', ['less', 'copy', 'js-prod', 'js', 'json-build']);
gulp.task('build-ps', ['less','copy','js-ps','js', 'json-build']);
