/**
 * bcbsnc.med.dashboard
 *
 * @category Controllers
 * @class DashboardCtrl
 * @constructor
 * @parameter {Object} $scope       AngularJS scope service.
 * @parameter {Object} $state       AngularJS state service.
 * @parameter {Object} $stateParams AngularJS stateParams service.
 */
angular.module('bcbsnc.med.dashboard', [])
	.controller('DashboardCtrl', ['$scope', '$state', '$stateParams',
		function($scope, $state, $stateParams) {

			var stateParamsDashboardMapping = {
				"survey": { "controller": "SurveyCtrl", "templateUrl": "survey/survey.html"},
				"my-interests": { "controller": "MyInterestsCtrl", "templateUrl": "my-interests/my-interests.html"},
				"things-you-should-know": { "controller": "ThingsYouShouldKnowCtrl", "templateUrl": "things-you-should-know/things-you-should-know.html"},
				"categories": {"controller": "ChooseInterestsCtrl", "templateUrl": "choose-interests/choose-interests.html"}
			};

			$scope.dashboardController = $stateParams.dashboard ?
				stateParamsDashboardMapping[$stateParams.dashboard].controller : 'ThingsYouShouldKnowCtrl';

			$scope.dashboardTemplate = $stateParams.dashboard ?
				stateParamsDashboardMapping[$stateParams.dashboard].templateUrl : 'things-you-should-know/things-you-should-know.html';
		}]);
