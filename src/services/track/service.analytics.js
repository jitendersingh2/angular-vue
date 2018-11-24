(function(window, angular, undefined) {

    'use strict';


    /**
     * @ngdoc service
     * @name erusurvey.services.adobe-analytics. : adobeAnalyticsService
     * @description Emits events to rootScope to be picked up by Adobe Analytics.
     * @requires $rootScope angular application's single root scope {@link https://docs.angularjs.org/api/ng/service/$rootScope}
     * @requires $window A reference to the browser's window object {@link https://docs.angularjs.org/api/ng/service/$window}
     * @requires config
     */
    angular
        .module('erusurvey.services.adobe-analytics', [

        ])
        .service('adobeAnalyticsService', [
            '$rootScope',
            '$window',
            'config',
            function($rootScope, $window, config) {

                var namespace       = config.namespace,
                    adobeNamespace  = 'bcbsncDataLayer';


                /**
                 * @ngdoc method
                 * @name emitEvent
                 * @methodOf erusurvey.services.adobe-analytics. : adobeAnalyticsService
                 * @description Stores data against the global window object.
                 * @param {String} name name
                 * @param {*} data data
                 */
                this.emitEvent = function(name, data) {

                    if(typeof name === 'undefined') {

                        return;
                    }

                    data = data || {};

                    if (angular.isObject(data)) {

                        data.eventId = name;
                    }

                    if (!(adobeNamespace in $window)) {

                        $window[adobeNamespace] = {};
                    }

                    if (!(namespace in $window[adobeNamespace])) {

                        $window[adobeNamespace][namespace] = {};
                    }

                    $window[adobeNamespace][namespace][name] = data;
                };

            }]);

})(this, window.angular);
