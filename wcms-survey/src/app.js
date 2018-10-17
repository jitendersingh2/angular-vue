(function(window, angular, undefined) {

    'use strict';

    /**
     * Initialize entire application.
     *
     * @namespace Applications
     * @class managePolicy
     */
    angular
        .module('eruSurvey', [

            'ngRoute',
            'eruSurvey.config',
            'managePolicy.controllers.homeCtrl',
            'ui.bootstrap'

        ])
        .config ([
            '$routeProvider',
            'config',
            function ($routeProvider, config) {


                $routeProvider.
                    when ('/', {
                        templateUrl: config.partials.viewHome,
                        caseInsensitiveMatch: true
                    }).
                    otherwise({
                        redirectTo: '/'
                    });

            }]);

})(this, window.angular);
