(function(window, angular, moment, undefined){

    'use strict';


    /**
     * @ngdoc filter
     * @name erusurvey.filters.internalDataFilter. : internalDataFilter
     * @description Parse internal data for display.
     */
    angular
        .module('erusurvey.filters.internalDataFilter', [

        ])
        .filter('internalDataFilter', [
            function() {


                /**
                 * @ngdoc method
                 * @name internalDataFilter
                 * @methodOf erusurvey.filters.internalDataFilter. : internalDataFilter
                 * @description Parse internal data for display.
                 * @param {Object} internalData internalData
                 * @returns {Array} internalDataFilter internalDataFilter
                 */
                return function(internalData) {

                    var filteredData = [];

                    angular.forEach(internalData, function(value, key) {

                        var codeOrigin = key.split('/')[0];

                        var response = {

                            timestamp:      value.timestamp,
                            success:        null,
                            error:          null,
                            fail:           null,
                            adobe:          value.adobe,
                            touchpoint:     value.touchpoint,
                            displayTitle:   key,
                            displayMessage: null,
                            displayData:    null,
                            xhr:            false,
                            filter:         false,
                            cache:          false,
                            catch:          false,
                            abstract:       false,
                            codeOrigin:     codeOrigin,
                            responseTime:   null
                        };


                        if (typeof value.data == 'string') {

                            response.displayMessage = value.data;

                        } else {

                            if (value.data.status) {

                                response.xhr = true;
                            }

                            if (value.data.responseTime) {

                                response.responseTime = value.data.responseTime;
                            }

                            response.displayData = value.data;
                        }


                        if ((/\/success/i).test(key)) {

                            response.success = true;

                        } else if ((/\/error/i).test(key)) {

                            response.error = true;

                        } else if ((/\/fail/i).test(key)) {

                            response.fail = true;
                        }


                        if ((/filter/i).test(key)) {

                            response.filter = true;
                        }

                        if ((/cache/i).test(key)) {

                            response.cache = true;
                        }

                        if ((/catch/i).test(key)) {

                            response.catch = true;
                        }

                        if (!response.filter && !response.xhr && !response.cache && !response.catch && !response.error) {

                            response.abstract = true;
                        }


                        filteredData.push(response);
                    });


                    filteredData.sort(function(a, b) {
                        var dateA = new Date(a.timestamp).getTime();
                        var dateB = new Date(b.timestamp).getTime();
                        return dateA - dateB;
                    });

                    return filteredData;
                };
            }]);

})(this, window.angular, window.moment);
