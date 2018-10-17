(function (window, angular, undefined) {

    'use strict';

    /**
     * Create a configuration object shared between all modules.
     *
     * @namespace Constant
     * @class config
     */
    angular
        .module('eruSurvey.config', [])
        .constant('config', {

            namespace: 'eruSurvey',
            analytics: false,
            debug: true,
            appUrlRoot: '/members/secure/account/eruSurvey/',
            servicesTimeout: 120000,
            services: {
                dataCapture: '/members/services/sec/touchpoints'
            },
            partials: {
                viewHome: '/assets/members/secure/apps/managepolicy/components/home/view.home.htm',
                partsDir: '/assets/members/secure/apps/managepolicy/components/home/partials/'
            }
        });

})(this, window.angular);
