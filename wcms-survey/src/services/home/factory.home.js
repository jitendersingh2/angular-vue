(function(window, angular, undefined) {

    'use strict';

    /**
     * Demo factory. Brings all services under one factory for the front-end to utilize.
     *
     * @namespace Services
     * @class homeFactory
     */

    angular
        .module('eruSurvey.services.homeFactory', [
            'bcbsnc.member.eruSurvey.services.dataCaptureService'
        ])
        .factory('homeFactory', [
            '$http',
            '$q',
            '$filter',
            'dataCaptureService',
            'config',
            function($http, $q, $filter, dataCaptureService, config) {

                var response;

                var rejectPromise = $q.reject();

                return {

                    /**
                     * @ngdoc method
                     * @name set
                     * @methodOf bcbsnc.member.billingPayment.services.trackFactory. : trackFactory
                     * @description Set analytics and debugging data.
                     * @param {String} name The key to set an error against.
                     * @param {*} data Data to store/set.
                     * @param {Boolean} adobe adobe
                     * @param {Boolean} touchpoint touchpoint
                     */
                    set: function(name, data) {

                        dataCaptureService.track(name, data);
                    }
                };
            }]);


})(this, window.angular);
