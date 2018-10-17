#Blue Connect AngularJS Seed Project

##How to Install, Serve, Test, &amp; Build

###Setup your environment

Fork and clone the repository. From the terminal change directories into the root of the repository and run...


Fork and clone the respository. Navigate into the repository folder and run

```
$ npm install
```

###Serve the app locally

To serve the application locally from the "./src" directory simply...

Navigate into the repository folder and run
```
$ npm start
```



=======
### Testing ###

Navigate into the repository folder and run

```
$ npm test
```

###Build the app

To compile/build the app into the "./dist" directory...

####Build for Pstage


Navigate into the repository folder and run

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

[http://wwwps.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE](http://wwwps.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE)

```
http://wwwps.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE
```

####Production:

[http://www.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE](http://www.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE)

```
http://www.bcbsnc.com/assets/members/secure/apps/YOUR-APP-URL-HERE
```

##How to Troubleshoot Environment & Testing Issues/Defects

Because the app uses JSON to function everything passes through a series of factories/services. You can leverage that
behavior to your advantage by logging into any environment, like production or pstage, and copying the responses into the
repository's APIB files. When you do this you should receive a close approximation of what's happening within the related
environment.

###Steps
1. First, log into production or pstage, open the console, and navigate to the YOUR-APP-NAME-HERE page
 - Prod, [https://www.bcbsnc.com/members/secure/account/YOUR-APP-URL-HERE](https://www.bcbsnc.com/members/secure/account/YOUR-APP-URL-HERE)
 - Stage, [https://wwwps.bcbsnc.com/members/secure/account/YOUR-APP-URL-HERE](https://wwwps.bcbsnc.com/members/secure/account/YOUR-APP-URL-HERE)
2. Second, under the Network/XHR tab within console look for the following responses
 - ```managepolicy.json```
   - copy the response body and paste into the ```api/member.apib``` under the 200 response section
3. Third, restart/start the projects local run server and you should be seeing an emulated version of the project, from there you can start debugging
