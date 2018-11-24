(function (window, angular, undefined) {

    'use strict';

    /**
     * Create a configuration object shared between all modules.
     *
     * @namespace Constant
     * @class config
     */
    angular
        .module('erusurvey.config', [])
        .constant('config', {

            namespace: 'erusurvey',
            analytics: true,
            debug: true,
            appUrlRoot: '/members/secure/account/erusurvey/',
            servicesTimeout: 120000,
            services: {
                dataCapture: '/members/services/sec/surveytouchpoints',
                userInfo: '/members/secure/data/erusurvey.json'
            },
            partials: {
                viewHome: '/components/home/view.home.htm'
            }
        });

})(this, window.angular);
