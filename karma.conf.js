// Karma configuration
// Generated on Wed May 06 2015 15:58:47 GMT-0400 (EDT)

module.exports = function(config) {

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
            basePath: './',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
            frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
            files: [
                //'http://www.bcbsnc.com/assets/global/js/libs/angular/1.2.13/angular.min.js',
                { pattern: 'http://www.bcbsnc.com/assets/global/js/libs/angular/1.2.28/angular.min.js', watch: false },
                { pattern: 'http://www.bcbsnc.com/assets/global/js/libs/angular/1.2.28/angular-mocks.js', watch: false },
                //{ pattern: 'node_modules/angular/lib/angular.min.js', watch: false },
                //{ pattern: 'node_modules/angular-mocks/angular-mocks.js', watch: false },
                'src/**/*.js',
                'src/**/*.htm',
                'src/**/*.html',
                'src/**/*.json'
                //{ pattern: 'src/**/*.json', watched: true, served: true, included: false }
            ],


        // list of files to exclude
            exclude: [
                'src/config.js',
                'src/app.js',
                'src/data/erusurvey.json'
            ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
            preprocessors: {
                'src/**/*.htm': ['ng-html2js'],
                'src/**/*.html': ['ng-html2js'],
                'src/**/*.json': ['ng-json2js']
            },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
            reporters: ['progress'],


        // web server port
            port: 9876,


        // enable / disable colors in the output (reporters and logs)
            colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
            logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            //browsers: ['Chrome'],
            browsers: ['PhantomJS'],


        //Plugins
            plugins: [
                'karma-jasmine',
                'karma-chrome-launcher',
                'karma-firefox-launcher',
                'karma-phantomjs-launcher',
                'karma-ng-json2js-preprocessor',
                'karma-ng-html2js-preprocessor'
            ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
            singleRun: false,

            ngHtml2JsPreprocessor: {
                moduleName: 'htmlTemplates',
                stripPrefix: 'src/'
            },

            ngJson2JsPreprocessor: {
                stripPrefix: 'src/'
            }
    });
};
