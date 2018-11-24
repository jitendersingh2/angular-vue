(function(window, angular, moment, undefined) {

    'use strict';


    /**
     * @ngdoc service
     * @name erusurvey.services.trackFactory. : trackFactory
     * @description Create a log against a predefined global object. Access analytics services such as Adobe DTM and TouchPoint history.
     * @requires $window A reference to the browser's window object {@link https://docs.angularjs.org/api/ng/service/$window}
     * @requires $filter used for formatting data displayed to the user. {@link https://docs.angularjs.org/api/ng/service/$filter}
     * @requires adobeAnalyticsService
     * @requires dataCaptureService
     * @requires config
     */
    angular
        .module('erusurvey.services.trackFactory', [

            'erusurvey.services.adobe-analytics',
            'erusurvey.services.dataCaptureService',
            'erusurvey.filters.internalDataFilter'

        ])
        .factory('trackFactory', [
            '$window',
            '$filter',
            'adobeAnalyticsService',
            'dataCaptureService',
            'config',
            function($window, $filter, adobeAnalyticsService, dataCaptureService, config) {

                var namespaceConfig = config.namespace,
                    debugConfig     = config.debug,
                    analyticsConfig = config.analytics,
                    internalCache   = null;


                return {

                    /**
                     * @ngdoc method
                     * @name set
                     * @methodOf erusurvey.services.trackFactory. : trackFactory
                     * @description Set analytics and debugging data.
                     * @param {String} name The key to set an error against.
                     * @param {*} data Data to store/set.
                     * @param {Boolean} adobe adobe
                     * @param {Boolean} touchpoint touchpoint
                     */
                    set: function(name, data, adobe, touchpoint) {

                        var runAnalytics    = analyticsConfig,
                            localTimestamp  = moment().toISOString(),
                            typeObject      = { adobe:(adobe||false), touchpoint:(touchpoint||false) },
                            internalData    = angular.extend({ data:data, timestamp:localTimestamp }, typeObject);

                        internalCache = internalCache || {};
                        internalCache[name] = internalData;

                        $window[namespaceConfig] = $filter('internalDataFilter')(internalCache);


                        if (debugConfig) {

                            try {
                                console.log(namespaceConfig+'/'+name+':', internalData);
                            } catch (e) {}
                        }


                        if (runAnalytics && (adobe === true || touchpoint === true)) {

                            adobeAnalyticsService.emitEvent(name, data);
                        }


                        if (runAnalytics && touchpoint === true) {

                            dataCaptureService.track(name, data);
                        }
                    }

                };
            }]);


})(this, window.angular, window.moment);
