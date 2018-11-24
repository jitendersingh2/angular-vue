(function(window, angular, undefined) {
  "use strict";

  /**
   * Home/ERU Survey view controller.
   *
   * @namespace Controllers
   * @class homeCtrl
   */
  angular
    .module("erusurvey.controllers.homeCtrl", [
      'erusurvey.services.userInfoService',
      'erusurvey.services.trackFactory'
    ])
    .controller("homeCtrl", [
      "userInfoService",
      "trackFactory",
      "config",
      function(
        userInfoService,
        trackFactory,
        config
      ) {
        var userInfo;
        var self = this;

        self.isMemberHasTeleHealth = true;
        self.isMemberHasHealthLineBlue = true;
        self.isMemberRewardble = true;

        self.firstQPage = true;
        self.secondQPage = false;
        self.thirdQPage = false;
        self.fourthQPage = false;
        self.teleHealthPage = false;
        self.healthLineBluePage = false;
        self.rewardPage = false;
        self.surveyConfirmation = false;
        self.printCustomizedGuide = false;
        self.hideSubmitBtn = false;

        
        /*
        * Get userinfo here
        */
        userInfoService.getUserInfo()
          .then(function(response) {
            userInfo = response;
            self.isMemberHasTeleHealth = userInfo.telehealth === "true" ? true : false;
            self.isMemberHasHealthLineBlue = userInfo.healthLineBlue === "true" ? true : false;
          }, function(error) {
            console.log('error- ', error);
          });

        
        /*
        * 1st Question
        */
        self.showAnsweredCorrectly = false;
        self.showAnsweredInCorrectly = false;
        self.firstAnswers = [];
        self.insertFirstAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.firstAnswers.push(val);
          } else {
            self.firstAnswers.pop();
          }
        };

        self.submitFirstAnswer = function(e) {
          e.preventDefault();
          if (self.firstAnswers.length === 3) {
            self.showAnsweredCorrectly = true;
          } else {
            self.showAnsweredInCorrectly = true;
          }
          self.hideSubmitBtn = true;
        };

        self.next2 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.firstQPage = false;
          self.secondQPage = true;
        };


        /*
        * 2nd Question
        */
        self.secondAnsweredYes = false;
        self.secondAnsweredNo = false;
        self.secondAnswer = '';
        self.selectSecondAnswer = function(e) {
          self.secondAnswer = e.target.value;
          if (self.hideSubmitBtn) {
            self.secondAnsweredYes = self.secondAnswer === 'YES';
            self.secondAnsweredNo = self.secondAnswer === 'NO';
          }
        };

        self.submitSecondAnswer = function(e) {
          e.preventDefault();
          if (self.secondAnswer === "") {
            return true;
          }
          if (self.secondAnswer === "YES") {
            self.secondAnsweredYes = true;
          } else if (self.secondAnswer === "NO") {
            self.secondAnsweredNo = true;
          }

          self.hideSubmitBtn = true;
        };

        self.next3 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.secondQPage = false;
          self.thirdQPage = true;
        };


        /*
        * 3rd Question
        */
        self.showThirdAnsweredCorrectly = false;
        self.showThirdAnsweredInCorrectly = false;
        self.thirdAnswers = [];
        self.selectThirdAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.thirdAnswers.push(val);
          } else {
            self.thirdAnswers.pop();
          }
        };

        self.submitThirdAnswer = function(e) {
          e.preventDefault();
          if (self.thirdAnswers.length === 4) {
            self.showThirdAnsweredCorrectly = true;
          } else {
            self.showThirdAnsweredInCorrectly = true;
          }
          self.hideSubmitBtn = true;
        };

        self.next4 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.thirdQPage = false;
          self.fourthQPage = true;
        };

        
        /*
        * 4th Question
        */
        self.fourthAnsweredYes = false;
        self.fourthAnsweredNo = false;
        self.fourthAnswer = '';
        self.selectFourthAnswer = function(e) {
          self.fourthAnswer = e.target.value;
          if (self.hideSubmitBtn) {
            self.fourthAnsweredYes = self.fourthAnswer === 'YES';
            self.fourthAnsweredNo = self.fourthAnswer === 'NO';
          }
        };

        self.submitFourthAnswer = function(e) {
          e.preventDefault();
          if (self.fourthAnswer === "") {
            return true;
          }
          if (self.fourthAnswer === "YES") {
            self.fourthAnsweredYes = true;
          } else if (self.fourthAnswer === "NO") {
            self.fourthAnsweredNo = true;
          }

          self.hideSubmitBtn = true;
        };

        self.next5 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.fourthQPage = false;
          if (self.isMemberHasTeleHealth) {
            self.teleHealthPage = true;
            return true;
          }
          if (self.isMemberHasHealthLineBlue) {
            self.healthLineBluePage = true;
            return true;
          }
          self.rewardPage = true;
        };

        
        /*
        * Tele Health
        */
        self.showTeleHealthAnsweredCorrectly = false;
        self.showTeleHealthAnsweredInCorrectly = false;
        self.teleHealthAnswers = [];
        self.selectTeleHealthAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.teleHealthAnswers.push(val);
          } else {
            self.teleHealthAnswers.pop();
          }
        };

        self.submitTeleHealthAnswers = function(e) {
          e.preventDefault();
          if (self.teleHealthAnswers.length === 0) {
            return true;
          }
          if (self.teleHealthAnswers.indexOf('Chest Pain') === -1) {
            self.showTeleHealthAnsweredCorrectly = true;
          } else {
            self.showTeleHealthAnsweredInCorrectly = true;
          }
          self.hideSubmitBtn = true;
        };

        self.next6 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.teleHealthPage = false;
          if (self.isMemberHasHealthLineBlue) {
            self.healthLineBluePage = true;
            return true;
          }
          self.rewardPage = true;
        };

        
        /*
        * Health Line Blue
        */
        self.showHealthLineBlueAnsweredCorrectly = false;
        self.showHealthLineBlueAnsweredInCorrectly = false;
        self.healthLineBlueAnswers = [];
        self.selectHealthLineBlueAnswers = function(e) {
          var val = e.target.value;
          if (e.target.checked) {
            self.healthLineBlueAnswers.push(val);
          } else {
            self.healthLineBlueAnswers.pop();
          }
        };

        self.submitHealthLineBlueAnswers = function(e) {
          e.preventDefault();
          if (self.healthLineBlueAnswers.length === 4) {
            self.showHealthLineBlueAnsweredCorrectly = true;
          } else {
            self.showHealthLineBlueAnsweredInCorrectly = true;
          }
          self.hideSubmitBtn = true;
        };

        self.next7 = function (e) {
          e.preventDefault();
          self.hideSubmitBtn = false;
          self.healthLineBluePage = false;
          self.rewardPage = true;
        };

        
        /*
        * Rewards
        */
        self.printCustomizedGuide = function() {

          self.surveyConfirmation = true;

          var currDate = moment().toISOString();
          // TouchPoint Service POST Data
          var surveyData = {
            success: "Y",
            "eventEndTimestamp":currDate,
            "eventStartTimestamp":currDate,
            "extensionDataElement":[
              {
                "name":"ImportanceofRegularDoctor",
                "value":self.firstAnswers.length > 0 ? self.firstAnswers.join(',') : ''
              },
              {
                "name":"haveRegulardoctorForRoutineCheckups",
                "value":self.secondAnswer === 'YES' ? "YES,'DoctorName':"+"'"+self.doctorName+"',"+"'PhoneNumber':"+"'"+self.doctorPhoneNumber+"',"+"'OfficeHours':"+"'"+self.officeHours+"',"+"'AfterOurHours':"+"'"+self.afterHoursNumber+"'" : 'NO'
              },
              {
                "name":"whyGoToConvenienceCareOrUrgentCareCenter",
                "value":self.thirdAnswers.length > 0 ? self.thirdAnswers.join(',') : ''
              },
              {
                "name":"whichUrgentcareCenterClosestToYourHome",
                "value": self.fourthAnswer === 'YES' ? "YES,'NameLocation':"+"'"+self.careCenterNameAndLocation+"',"+"'PhoneNumber':"+"'"+self.careCenterPhoneNumber+"',"+"'Hours':"+"'"+self.careCenterOpeningHours+"'" : 'NO'
              },
              {
                "name":"healthIssuesHandledByTelehealthConsultant",
                "value":self.teleHealthAnswers.length > 0 ? self.teleHealthAnswers.join(',') : ''
              },
              {
                "name":"phoneNumberForOurNurseSupportLine",
                "value":self.healthLineBlueAnswers.length > 0 ? self.healthLineBlueAnswers.join(',') : ''
              }
            ]
          };

          // Calling Touch Point Service
          trackFactory.set('SURVEY_ACTIVITY_CENTER', surveyData, false, true);

          // Print Quick Reference Guide PDF
          var documentId = 'pdfDocument';
          var printedContentId = 'printedCustimizedGuide';
          var doc = document.getElementById(documentId);
          var printedContent = document.getElementById(printedContentId).innerHTML;

          doc.contentWindow.document.body.innerHTML = printedContent;

          doc.contentWindow.focus();
          doc.contentWindow.print();
        };


        /*
        * Common
        */
        self.onInputChange = function(e) {
          self[e.target.name] = e.target.value;
        };
      }
    ]);
})(this, window.angular);
