(function(window, angular, undefined) {

    'use strict';


    /**
     * @ngdoc service
     * @name erusurvey.services.dataCaptureService. : dataCaptureService
     * @description Emits events to the Data Capture REST API, TouchPoint History, with AngularJS.
     * @requires $window A reference to the browser's window object {@link https://docs.angularjs.org/api/ng/service/$window}
     * @requires $http a core AngularJS service that facilitates communication with the remote HTTP servers via the browser's XMLHttpRequest object or via JSONP. {@link https://docs.angularjs.org/api/ng/service/$http}
     * @requires $q service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing. {@link https://docs.angularjs.org/api/ng/service/$q}
     * @requires config config
     */
    angular
        .module('erusurvey.services.dataCaptureService', [

        ])
        .service('dataCaptureService', [
            '$window',
            '$http',
            '$q',
            'config',
            function($window, $http, $q, config) {

                var serviceUrl = config.services.dataCapture;


                /**
                 * @ngdoc method
                 * @name track
                 * @methodOf erusurvey.services.dataCaptureService. : dataCaptureService
                 * @description Tracks an event.
                 * @param {String} code code
                 * @param {Object} data data
                 * @returns {Object} promise promise
                 */
                this.track = function(code, data) {

                    var url         = serviceUrl,
                        passData    = data || {};

                    var eventObject = {

                        transactionStatus: passData.success ? 'SUCCESS' : 'FAILURE',
                        touchpointTransactionContextCode: code
                    };

                    delete passData.success;

                    angular.extend(eventObject, passData);
                    
                    return $http({
                            url: url,
                            method: 'POST',
                            data: eventObject,
                            withCredentials: (($window.document.location.hostname||'').indexOf('localhost') < 0),
                            cache:false
                        })
                        .then(function(response) {

                            return response.data;
                            
                        }, function(error) {

                            return $q.reject({});
                        });
                };

            }]);

})(this, window.angular);
