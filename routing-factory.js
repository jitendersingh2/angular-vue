/**
 * bcbsnc.services.routingFactory
 *
 * @category Factories
 * @class RoutingFactory
 * @constructor
 * @parameter {Object} $state    AngularJS state service.
 * @parameter {Object} $location AngularJS location service.
 */
angular.module('bcbsnc.services.routingFactory', [])
	.factory('RoutingFactory', ['$state', '$location',
		function RoutingFactory ($state, $location) {

			/**
			 * Returns the menu route.
			 *
			 * @method getMenuRoute
			 * @returns {String} The menu route.
			 */
			RoutingFactory.myInterestsActive = function(){
				return $state.params.dashboard == 'my-interests';
			};

			RoutingFactory.surveyActive = function(){
				return $state.params.dashboard == 'survey';
			};

			RoutingFactory.getMenuRoute = function(){
				return $state.params.menu ? '/menu/' + $state.params.menu : '';
			};

			/**
			* Returns the dashboard route.
			*
			* @method getDashboardRoute
			* @returns {String} The dashboard route.
			*/
			RoutingFactory.getDashboardRoute = function(){
				return $state.params.dashboard ? '/dashboard/' + $state.params.dashboard : '';
			};

			/**
			* Returns the category route.
			*
			* @method getCategoryRoute
			* @returns {String} The category route.
			*/
			RoutingFactory.getCategoryRoute = function(){
				return $state.params.category ? '/category/' + $state.params.category : '';
			};

			/**
			 * Redirects the user to the menu.
			 *
			 * @method menuRoute
			 * @parameter {Object} menu The menu to route to.
			 */
			RoutingFactory.menuRoute = function(menu){
				RoutingFactory.changeRoute(
					RoutingFactory.getDashboardRoute()
					+ RoutingFactory.getCategoryRoute()
					+ '/menu/' + menu
				);
			};

			/**
			 * Redirects the user back to the category.
			 *
			 * @method closeMenuRoute
			 */
			RoutingFactory.closeMenuRoute = function(){
				RoutingFactory.changeRoute( RoutingFactory.getDashboardRoute()
					+ RoutingFactory.getCategoryRoute());
			};

			/**
			 * Redirects the user to the 'Things you should know' page.
			 *
			 * @method tyskRoute
			 */
			RoutingFactory.tyskRoute = function(){
				RoutingFactory.changeRoute(
					'/dashboard/things-you-should-know' + RoutingFactory.getMenuRoute()
				);
			};

			/**
			 * Redirects the user to 'My interests' page.
			 *
			 * @method myInterestsRoute
			 */
			RoutingFactory.myInterestsRoute = function(){
				RoutingFactory.changeRoute(
					'/dashboard/my-interests' + RoutingFactory.getMenuRoute()
				);
			};

			/**
			 * Redirects the user to 'Survey' page.
			 *
			 * @method surveyRoute
			 */
			RoutingFactory.surveyRoute = function(){
				RoutingFactory.changeRoute(
					'/dashboard/survey' + RoutingFactory.getMenuRoute()
				);
			};

			/**
			 * Redirects the user to the category.
			 *
			 * @method categoryRoute
			 * @parameter {Object} category The category to route to.
			 */
			RoutingFactory.categoryRoute = function(category){
				RoutingFactory.changeRoute(
					'/dashboard/categories/category/' + category +
						RoutingFactory.getMenuRoute()
				);
			};

			/**
			 * Redirects the user.
			 *
			 * @method changeRoute
			 * @parameter {String} url The URL to redirect to.
			 */
			RoutingFactory.changeRoute = function(url){
				$location.path(url);
			};

			return RoutingFactory;
		}]);
