/**
 * bcbsnc.med.survey
 *
 * @category Controllers
 * @class MyInterestsCtrl
 * @constructor
 * @parameter  {Object}                $scope                AngularJS scope service.
 * @parameter  {Object}                $rootScope            AngularJS rootScope service.
 * @parameter  {Object}                $timeout              AngularJS timeout service.
 * @parameter  {TileDefinitionFactory} TileDefinitionFactory A [TileDefinitionFactory](#/class/tiledefinitionfactory) instance.
 * @parameter  {UserPrefFactory}       UserPrefFactory       A [UserPrefFactory](#/class/userpreffactory) instance.
 * @parameter  {AnalyticsFactory}      AnalyticsFactory      A [AnalyticsFactory](#/class/analyticsfactory) instance.
 * @parameter  {ScreenSizeFactory}      ScreenSizeFactory      A [ScreenSizeFactory](#/class/screensizefactory) instance.
 */
angular.module('bcbsnc.med.survey', ['ui.router'])
	.controller('SurveyCtrl',
	//@ngInject
	function ($scope, $rootScope, $timeout, ScreenSizeFactory) {

        $scope.showAnsweredCorrectly = false;
        $scope.showAnsweredInCorrectly = false;
        $scope.answers = [];
        $scope.insertAnswers = function(e) {
            console.log(e.target);
        };

        $scope.submit = function(e) {
            console.log('event- ', e);
            e.preventDefault();
            $scope.showAnsweredInCorrectly = true;
        };
        $scope.draggable = Modernizr.touch ? "" : "true";

		/*
		 * listen for reload event from mobile interests drawer / window-resize
		 */
		var u = $rootScope.$on('Interests:reload', function (event, notifyAdobe) {
			getMyInterestsTiles(notifyAdobe);

			if(ScreenSizeFactory.screenSize() == 'desktop'){
				$scope.arrangeMode = false;
				$scope.draggable = Modernizr.touch ? "" : "true";
			}
		});
		$scope.$on('$destroy', u);

		/*
		 * Listen for "Arrange" mode via tile-drawer-controller.js
		 */
		$scope.arrangeMode = false;
		var e = $rootScope.$on('Interests:arrangeMode', function (event, enable) {
			$scope.draggable = enable ? "true": "";
			$scope.arrangeMode = $scope.draggable;

			getMyInterestsTiles(false);
		});
		$scope.$on('$destroy', e);

		$scope.getTileClass = function(style, color){
			return style + ' ' + color + ($scope.arrangeMode ? ' arrange-mode' : '');
		};
	}
);
