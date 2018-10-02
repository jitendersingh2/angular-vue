/**
 * bcbsnc.med.tileDrawer
 *
 * @category Controllers
 * @class TileDrawerCtrl
 * @constructor
 * @param {Object}              $scope              AngularJS scope service.
 * @param {Object}              $rootScope          AngularJS rootScope service.
 * @param {Object}              $stateParams        AngularJS stateParams service.
 * @param {RoutingFactory}      RoutingFactory      A [RoutingFactory](#/class/routingfactory) instance.
 * @param {TileCategoryFactory} TileCategoryFactory A [TileCategoryFactory](#/class/tilecategoryfactory) instance.
 * @param {AnalyticsFactory}    AnalyticsFactory    An [AnalyticsFactory](#/class/analyticsfactory) instance.
 */
angular.module('bcbsnc.med.tileDrawer', ['snap'])
	.controller('TileDrawerCtrl',
	//@ngInject
		function($scope, $rootScope, $stateParams, RoutingFactory, TileCategoryFactory, AnalyticsFactory) {

			TileCategoryFactory.getMyInterestsTileCategories().then(function(categories){
				$scope.categories = categories;
			});

			$scope.currentDashboard = $stateParams.dashboard;
			$scope.currentCategory = $stateParams.category;

			//collapse if we have no category routing params, otherwise, show categories
			$scope.isCollapsed = !$stateParams.category;

			//link handlers
			$scope.tyskClick = function(){
				RoutingFactory.tyskRoute();
			};

			$scope.interestsClick = function(){
				RoutingFactory.myInterestsRoute();
			};

			$scope.surveyClick = function(){
				RoutingFactory.surveyRoute();
			};

			$scope.categoryClick = function(category){
				RoutingFactory.categoryRoute(category.route);

				/**
				 * Adobe Analytics - editInterests
				 */
				AnalyticsFactory.editInterests(category.title);
			};

			/**
			 * Listen for InterestsChanged event in the Choose-Interests Controller
			 */
			$scope.topicHasBeenClicked = false;
			var u = $rootScope.$on('InterestsChanged.desktop', function (event) {
				$scope.topicHasBeenClicked = true;
			});
			$scope.$on('$destroy', u);

			$scope.editInterestsClick = function(categories) {
				$scope.isCollapsed = !$scope.isCollapsed;
				$scope.categoryClick(categories[0]);
			};

			$scope.rightDrawerOpen = function(){
				/**
				 * Adobe Analytics - menuOpenInterests
				 */
				AnalyticsFactory.menuOpenInterests();
			};

			$scope.toggleActive = false;
			$scope.arrangeLabel = "Rearrange";
			$scope.toggleArrangeClick = function(){
				$scope.toggleActive = !$scope.toggleActive;
				AnalyticsFactory.dragOverride = $scope.toggleActive;
				$scope.arrangeLabel = $scope.toggleActive ? "Save" : "Rearrange";

				if(!$scope.toggleActive){
					//re-enable tile click if arrange mode disabled
					AnalyticsFactory.tileClickEnabled = true;
				}

				$rootScope.$emit('Interests:arrangeMode', $scope.toggleActive);
			};

		});
