angular.module('bcbsnc.med', [
	'ui.router',
	'ngAnimate',
	'ngOnboarding',
	'ipCookie',
	'angular-data.DSCacheFactory',
	'angularSpinner',
	'LocalStorageModule',
	'snap',
	'med.constants',
	'bcbsnc.blueConnect.med.constants.config',
	'bcbsnc.blueConnect.factories.vendorSso',
	'blueconnect.services.data-capture',
	'bcbsnc.med.app',
	'bcbsnc.med.alerts',
	'bcbsnc.med.blueLink',
	'bcbsnc.med.chat',
	'bcbsnc.filters.alertsFilters',
	'bcbsnc.tileDefinition.rtdmFilters',
	'bcbsnc.tileDefinition.bluelinkFilters',
	'bcbsnc.med.blueLinkItem',
	'bcbsnc.med.blueRewards',
	'bcbsnc.med.chooseInterests',
	'bcbsnc.med.dashboard',
	'bcbsnc.med.footer',
	'bcbsnc.med.accountStatus',
	'bcbsnc.med.healthNav',
	'bcbsnc.med.inbox',
	'bcbsnc.med.lightboxes',
	'bcbsnc.med.mobileInterestsDrawer',
	'bcbsnc.med.onboarding',
	'bcbsnc.med.profile',
	'bcbsnc.med.search',
	'bcbsnc.med.statusPanel',
	'bcbsnc.med.popoutContent',
	'bcbsnc.med.popoutNav',
	'bcbsnc.med.myInterests',
	'bcbsnc.med.survey',
	'bcbsnc.med.nav',
	'bcbsnc.med.thingsYouShouldKnow',
	'bcbsnc.med.tileAccountStatus',
	'bcbsnc.med.tileAlereSso',
	'bcbsnc.med.tileBasic',
	'bcbsnc.med.tileBlueConnect',
	'bcbsnc.med.tileBlueRewards',
	'bcbsnc.med.tileDrawer',
	'bcbsnc.med.tileExternalLink',
	'bcbsnc.med.tileAdestinnLink',
	'bcbsnc.med.tileFundBalance',
	'bcbsnc.med.tileHsaBalance',
	'bcbsnc.med.tileSilverFit',
	'bcbsnc.med.tileSocialMedia',
	'bcbsnc.med.tileVitals',
	'bcbsnc.services.alertsFactory',
	'bcbsnc.services.accountStatusFactory',
	'bcbsnc.services.analyticsFactory',
	'bcbsnc.services.benefitsFactory',
	'bcbsnc.services.bcbsncFactory',
	'bcbsnc.services.blueLinkFactory',
	'bcbsnc.services.blueRewardsFactory',
	'bcbsnc.services.campaignsFactory',
	'bcbsnc.services.claimsFactory',
	'bcbsnc.services.customizationsFactory',
	'bcbsnc.services.fundBalanceFactory',
	'bcbsnc.services.focusPriorityFactory',
	'bcbsnc.services.healthNavFactory',
	'bcbsnc.services.localStorageFactory',
	'bcbsnc.services.mediaFeedFactory',
	'bcbsnc.services.memberFactory',
	'bcbsnc.services.memberSsoFactory',
	'bcbsnc.services.navFactory',
	'bcbsnc.services.numberService',
	'bcbsnc.services.onboardingFactory',
	'bcbsnc.services.optionsFactory',
	'bcbsnc.services.paramService',
	'bcbsnc.services.profileFactory',
	'bcbsnc.services.routingFactory',
	'bcbsnc.services.screenSizeFactory',
	'bcbsnc.services.sessionFactory',
	'bcbsnc.services.tileCategoryFactory',
	'bcbsnc.services.tileDefinitionFactory',
	'bcbsnc.services.tileDataFactory',
	'bcbsnc.services.tileTopicFactory',
	'bcbsnc.services.userPrefFactory',
	'bcbsnc.services.userSubscriptionFactory',
	'bcbsnc.services.rtdmFactory',
	'bcbsnc.common.directiveHelperFactory',
	'bcbsnc.directives.benefits',
	'bcbsnc.directives.claims',
	'bcbsnc.directives.claimsChart',
	'bcbsnc.directives.dynamicView',
	'bcbsnc.directives.heroImg',
	'bcbsnc.directives.lightBox',
	'bcbsnc.directives.lightBoxHeader',
	'bcbsnc.directives.lightBoxTrigger',
	'bcbsnc.directives.ngVisible',
	'bcbsnc.directives.enterPressed',
	'bcbsnc.directives.packery',
	'bcbsnc.directives.packeryContainer',
	'bcbsnc.directives.scrollTo',
	'bcbsnc.directives.spinnerOnload',
	'bcbsnc.directives.twitterTimeline',
	'bcbsnc.directives.tileDecorator',
	'bcbsnc.directives.accordionButton',
	'bcbsnc.directives.tileFlip',
	'bcbsnc.directives.windowResize',
    'bcbsnc.directives.dropDownMenuAccessibility',
	'templates'
])
	.config(['localStorageServiceProvider', function(localStorageServiceProvider){
		localStorageServiceProvider.setPrefix('med');
	}])
	.config(['$uiViewScrollProvider', function($uiViewScrollProvider){
		$uiViewScrollProvider.useAnchorScroll();
	}])
	.config(
		/**
		* Configures the routing for the application.
		*
		* @param $stateProvider - the stateProvider supplied by ui-router.
		* @param $urlRouterProvider - the routeProvider supplied by ui-router.
		*
		* See also:
		*
		* https://github.com/angular-ui/ui-router/wiki
		* @ngInject
		*/
		function configureRouting($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.otherwise('/');
			$stateProvider
				.state('index', { url  : '/',
					views: {
						'mobile-interests-drawer': {templateUrl: 'tile-drawer/mobile-interests-drawer.html', controller: 'MobileInterestsDrawerCtrl'},
						'nav-panel' : {
							templateUrl: 'templates-common/nav.html',
							controller: 'NavCtrl as nav',
							resolve: NavCtrl.resolve // jshint ignore:line
						},
						'mobile-nav': {
							templateUrl: 'templates-common/mobile-nav.html',
							controller: 'NavCtrl as nav',
							resolve: NavCtrl.resolve // jshint ignore:line
						},
						'top-nav-panel' : {
							templateUrl: 'templates-common/top-nav.html',
							controller: 'NavCtrl as nav',
							resolve: NavCtrl.resolve // jshint ignore:line
						},
						'footer' : { templateUrl: 'templates-common/footer.html'},
						"tile-list" : { templateUrl: 'dashboard/dashboard.html', controller : 'DashboardCtrl'},
						"tile-drawer" : { templateUrl: 'tile-drawer/drawer.html', controller : 'TileDrawerCtrl'},
						'popout-panel-nav': { templateUrl: 'popout-panel/navigation.html', controller: 'PopoutNavCtrl'},
						'popout-panel-content' : { templateUrl: 'popout-panel/content.html', controller : 'PopoutContentCtrl'},
						"alerts-panel"    : { templateUrl: 'alerts/alerts-list.html', controller : 'AlertsCtrl'},
						"status-panel"    : { templateUrl: 'status-panel/status-panel.html', controller : 'StatusPanelCtrl'},
						"lightboxes" : {templateUrl: 'lightboxes/lightboxes.html', controller: 'LightboxesCtrl'},
						"onboarding" : {templateUrl: 'onboarding/onboarding.html', controller: 'OnboardingCtrl'}
					}
				})
				.state('index.menu',{ url  : 'menu/:menu',
					views: {
						'popout-panel-content@': { templateUrl: 'popout-panel/content.html', controller : 'PopoutContentCtrl'},
						'popout-panel-nav@': { templateUrl: 'popout-panel/navigation.html', controller: 'PopoutNavCtrl'}
					}
				})
				.state('index.dashboard',{ url  : 'dashboard/:dashboard',
					views: {
						"tile-list@": { templateUrl: 'dashboard/dashboard.html', controller : 'DashboardCtrl'},
						"tile-drawer@": { templateUrl: 'tile-drawer/drawer.html', controller : 'TileDrawerCtrl'}
					}
				})
				.state('index.dashboard.menu',{ url  : '/menu/:menu',
					views: {
						'popout-panel-content@': { templateUrl: 'popout-panel/content.html', controller : 'PopoutContentCtrl'},
						'popout-panel-nav@': { templateUrl: 'popout-panel/navigation.html', controller: 'PopoutNavCtrl'}
					}
				})
				.state('index.dashboard.categories',{ url  : '/category/:category',
					views: {
						"tile-list@": { templateUrl: 'dashboard/dashboard.html', controller : 'DashboardCtrl'},
						"tile-drawer@": { templateUrl: 'tile-drawer/drawer.html', controller : 'TileDrawerCtrl'}
					}
				})
				.state('index.dashboard.categories.menu',{ url  : '/menu/:menu',
					views: {
						'popout-panel-content@': { templateUrl: 'popout-panel/content.html', controller : 'PopoutContentCtrl'},
						'popout-panel-nav@': { templateUrl: 'popout-panel/navigation.html', controller: 'PopoutNavCtrl'}
					}
				});
	}) /** end router configuration */ /** jshint ignore:end */
	.config(['snapRemoteProvider', function(snapRemoteProvider){
		/**
		 * Angular-snap js /drawer configuration options
		 */
		// disable touchToDrag - screen drag causes issues with native back/forward
		// browser drag features on some devices
		snapRemoteProvider.globalOptions.touchToDrag = false;

		//max px to allow for snap.js shelves
		snapRemoteProvider.globalOptions.maxPosition = window.innerWidth;
		snapRemoteProvider.globalOptions.minPosition = -Math.abs(window.innerWidth);

	}]).run(['$rootScope', '$state', '$stateParams', '$window', 'ScreenSizeFactory', function($rootScope, $state, $stateParams, $window, ScreenSizeFactory){
		//route change events
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			//focus the tile container area for screen readers if a dashboard element was clicked
			if(toParams && toParams.dashboard && ScreenSizeFactory.screenSize() == "desktop"){
				var x = window.scrollX, y = window.scrollY;
				$('#tile-list-container').attr('tabIndex', -1).focus();
				window.scrollTo(x, y);
			}
		});

		$rootScope.$on('$viewContentLoaded', function(){

		});
	}]);
