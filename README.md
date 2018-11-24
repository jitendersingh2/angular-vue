# wcms-erusurvey
 ##Documentation
 [Generated Application Documentation can be found here... https://pages.ghe.bcbsnc.com/BCBSNC-Member/ERUtilization-Survey/docs/js/](https://pages.ghe.bcbsnc.com/BCBSNC-Member/ERUtilization-Survey/docs/js/index.html)
 ##How to Install, Serve, Test, &amp; Build
 ###Setup your environment
 Fork and clone the repository. From the terminal change directories into the root of the repository and run...
 ```
$ npm install
```
 ###Serve the app locally
 To serve the application locally from the "./src" directory simply...
 ```
$ npm start
```
 Then navigate to ```index.dev.htm```
 ###Testing
 Run the unit tests...
 ```
$ npm test
```
 ###Build the app
 To compile/build the app into the "./dist" directory...
 ####Build for Pstage
 ```
$ npm run build-ps
```
 ####Build for Production
 ```
$ npm run build
```
 From there you'll have to manually move the files into the working environment.
 ###Install the app
 And finally, to install the application simply place all the files under
 - dist/*
 Into this directory/location under the ```www[ps].bcbsnc.com```...
 ####PStage Environment:
 [http://wwwps.bcbsnc.com/assets/members/secure/apps/erusurvey](http://wwwps.bcbsnc.com/assets/members/secure/apps/erusurvey)
 ```
http://wwwps.bcbsnc.com/assets/members/secure/apps/erusurvey
```
 ####Production:
 [http://www.bcbsnc.com/assets/members/secure/apps/erusurvey](http://www.bcbsnc.com/assets/members/secure/apps/erusurvey)
 ```
http://www.bcbsnc.com/assets/members/secure/apps/erusurvey
```
 ##How to Troubleshoot Environment & Testing Issues/Defects
 Because the app uses JSON to function everything passes through a series of factories/services. You can leverage that
behavior to your advantage by logging into any environment, like production or pstage, and copying the responses into the
repository's APIB files. When you do this you'll receive an incredibly close approximation of what's happening
within the related environment.
 ###Steps
1. First, log into production or pstage, open the console, and navigate to the ERU Survey page
 - Prod, [https://www.bcbsnc.com/members/secure/account/erusurvey](https://www.bcbsnc.com/members/secure/account/erusurvey)
 - Stage, [https://wwwps.bcbsnc.com/members/secure/account/erusurvey](https://wwwps.bcbsnc.com/members/secure/account/erusurvey)
2. Second, under the Network/XHR tab within console look for the following responses
 - ```erusurvey.json```
   - copy the response body and paste into the ```api/userinfo.apib``` under the 200 response section
3. Third, restart/start the projects local run server and you should be seeing an emulated version of the project, from there you can start debugging
