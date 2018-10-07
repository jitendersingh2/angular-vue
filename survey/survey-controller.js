/**
 * bcbsnc.med.survey
 *
 * @category Controllers
 * @class SurveyCtrl
 * @constructor
 * @parameter  {Object}                $scope                AngularJS scope service.
 * @parameter  {Object}                $rootScope            AngularJS rootScope service.
 */
angular.module('bcbsnc.med.survey', ['ui.router'])
	.controller('SurveyCtrl',
	//@ngInject
	function ($scope, $rootScope) {

		$scope.isMemberHasTeleHealth = bcbsnc.dashboard.features.telehealth;
		$scope.isMemberHasHealthLineBlue = bcbsnc.dashboard.features.healthLineBlue;
		$scope.isMemberRewardble = bcbsnc.thisMember.blueRewards.available;
		
		$scope.firstQPage = true;
		$scope.secondQPage = false;
		$scope.thirdQPage = false;
		$scope.fourthQPage = false;
		$scope.teleHealthPage = false;
		$scope.healthLineBluePage = false;
		$scope.rewardPage = false;
		$scope.surveyConfirmation = false;
		$scope.printCustomizedGuide = false;
		$scope.hideSubmitBtn = false;
		
		/*
		 * 1st Question
		 */
		$scope.showAnsweredCorrectly = false;
		$scope.showAnsweredInCorrectly = false;
		$scope.firstAnswers = [];
        $scope.insertFirstAnswers = function(e) {
			var val = e.target.value;
			if (e.target.checked) {
				$scope.firstAnswers.push(val);
			} else {
				$scope.firstAnswers.pop();
			}
		};

        $scope.submitFirstAnswer = function(e) {
			console.log(bcbsnc);
            e.preventDefault();
			if ($scope.firstAnswers.length === 3) {
				$scope.showAnsweredCorrectly = true;
			} else {
				$scope.showAnsweredInCorrectly = true;
			}
			$scope.hideSubmitBtn = true;
		};
		
		$scope.next2 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.firstQPage = false;
			$scope.secondQPage = true;
		}

		/*
		 * 2nd Question
		 */
		$scope.secondAnsweredYes = false;
		$scope.secondAnsweredNo = false;
		$scope.secondAnswer = '';
		$scope.selectSecondAnswer = function(e) {
			$scope.secondAnswer = e.target.value;
			if ($scope.hideSubmitBtn) {
				$scope.secondAnsweredYes = $scope.secondAnswer === 'Yes';
				$scope.secondAnsweredNo = $scope.secondAnswer === 'No';
			}
		}

		$scope.submitSecondAnswer = function(e) {
            e.preventDefault();
			if ($scope.secondAnswer === "") {
				return true;
			}
			if ($scope.secondAnswer === "Yes") {
				$scope.secondAnsweredYes = true;
			} else if ($scope.secondAnswer === "No") {
				$scope.secondAnsweredNo = true;
			}
			
			$scope.hideSubmitBtn = true;
		};

		$scope.next3 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.secondQPage = false;
			$scope.thirdQPage = true;	
		}

		/*
		 * 3rd Question
		 */
		$scope.showThirdAnsweredCorrectly = false;
		$scope.showThirdAnsweredInCorrectly = false;
		$scope.thirdAnswers = [];
        $scope.selectThirdAnswers = function(e) {
			var val = e.target.value;
			if (e.target.checked) {
				$scope.thirdAnswers.push(val);
			} else {
				$scope.thirdAnswers.pop();
			}
		};

        $scope.submitThirdAnswer = function(e) {
            e.preventDefault();
			if ($scope.thirdAnswers.length === 4) {
				$scope.showThirdAnsweredCorrectly = true;
			} else {
				$scope.showThirdAnsweredInCorrectly = true;
			}
			$scope.hideSubmitBtn = true;
		};
		
		$scope.next4 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.thirdQPage = false;
			$scope.fourthQPage = true;
		}

		/*
		 * 4th Question
		 */
		$scope.fourthAnsweredYes = false;
		$scope.fourthAnsweredNo = false;
		$scope.fourthAnswer = '';
		$scope.selectFourthAnswer = function(e) {
			$scope.fourthAnswer = e.target.value;
			if ($scope.hideSubmitBtn) {
				$scope.fourthAnsweredYes = $scope.fourthAnswer === 'Yes';
				$scope.fourthAnsweredNo = $scope.fourthAnswer === 'No';
			}
		}

		$scope.submitFourthAnswer = function(e) {
            e.preventDefault();
			if ($scope.fourthAnswer === "") {
				return true;
			}
			if ($scope.fourthAnswer === "Yes") {
				$scope.fourthAnsweredYes = true;
			} else if ($scope.fourthAnswer === "No") {
				$scope.fourthAnsweredNo = true;
			}
			
			$scope.hideSubmitBtn = true;
		};

		$scope.next5 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.fourthQPage = false;
			if ($scope.isMemberHasTeleHealth) {
				$scope.teleHealthPage = true;
				return true;
			}
			if ($scope.isMemberHasHealthLineBlue) {
				$scope.healthLineBluePage = true;
				return true;
			}
			$scope.rewardPage = true;		
		}

		/*
		 * Tele Health
		 */
		$scope.showTeleHealthAnsweredCorrectly = false;
		$scope.showTeleHealthAnsweredInCorrectly = false;
		$scope.teleHealthAnswers = [];
        $scope.selectTeleHealthAnswers = function(e) {
			var val = e.target.value;
			if (e.target.checked) {
				$scope.teleHealthAnswers.push(val);
			} else {
				$scope.teleHealthAnswers.pop();
			}
		};

        $scope.submitTeleHealthAnswers = function(e) {
            e.preventDefault();
			if ($scope.teleHealthAnswers.length === 0) {
				return true;
			}
			if ($scope.teleHealthAnswers.indexOf('Chest Pain') === -1) {
				$scope.showTeleHealthAnsweredCorrectly = true;
			} else {
				$scope.showTeleHealthAnsweredInCorrectly = true;
			}
			$scope.hideSubmitBtn = true;
		};
		
		$scope.next6 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.teleHealthPage = false;
			if ($scope.isMemberHasHealthLineBlue) {
				$scope.healthLineBluePage = true;
				return true;
			}
			$scope.rewardPage = true;
		}

		/*
		 * Health Line Blue
		 */
		$scope.showHealthLineBlueAnsweredCorrectly = false;
		$scope.showHealthLineBlueAnsweredInCorrectly = false;
		$scope.healthLineBlueAnswers = [];
        $scope.selectHealthLineBlueAnswers = function(e) {
			var val = e.target.value;
			if (e.target.checked) {
				$scope.healthLineBlueAnswers.push(val);
			} else {
				$scope.healthLineBlueAnswers.pop();
			}
		};

        $scope.submitHealthLineBlueAnswers = function(e) {
            e.preventDefault();
			if ($scope.healthLineBlueAnswers.length === 4) {
				$scope.showHealthLineBlueAnsweredCorrectly = true;
			} else {
				$scope.showHealthLineBlueAnsweredInCorrectly = true;
			}
			$scope.hideSubmitBtn = true;
		};
		
		$scope.next7 = function (e) {
			e.preventDefault();
			$scope.hideSubmitBtn = false;
			$scope.healthLineBluePage = false;
			$scope.rewardPage = true;
		}

		/*
		 * Rewards
		 */
		$scope.onInputChange = function(e) {
			$scope[e.target.name] = e.target.value;
		}

		$scope.printCustomizedGuide = function() {
			console.log('printing');
			$scope.surveyConfirmation = true;
			
			var documentId = 'pdfDocument';
			var doc = document.getElementById(documentId);
			console.log('doc- ', doc);
			doc.contentWindow.focus()
			doc.contentWindow.print();
		}
	}
);
