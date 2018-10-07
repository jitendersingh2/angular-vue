#parse("members/webEnv.htm")
#parse("members/secure/velocityData/data.vm")
console.log('features::::::::::::::::::: ', $wo);

bcbsnc.dashboard = {};
bcbsnc.dashboard.categories = #parse("members/secure/dashboard/config/tile-categories.json");
bcbsnc.dashboard.topics = #parse("members/secure/dashboard/config/tile-topics.json");
bcbsnc.dashboard.tiles = #parse("members/secure/dashboard/config/tile-definition.json");
bcbsnc.dashboard.priority = #parse("members/secure/dashboard/config/tile-priority.json");
bcbsnc.dashboard.profile = #parse("members/secure/dashboard/config/profile-summary.json");
bcbsnc.dashboard.custom = #parse("members/secure/dashboard/config/ui-customizations.json");
bcbsnc.dashboard.alerts = #parse("members/secure/dashboard/config/alerts.json");
bcbsnc.dashboard.navItems = #parse("members/secure/dashboard/config/nav.json");
bcbsnc.dashboard.topNavItems = #parse("members/secure/dashboard/config/top-nav.json");
bcbsnc.dashboard.onboardingSteps = #parse("members/secure/dashboard/config/onboarding-steps.json");

bcbsnc.dashboard.features = {};

#if ($wo.anyActivePolicy.isDental || $wo.feature.dental)
bcbsnc.dashboard.features.dental = true;
#else
bcbsnc.dashboard.features.dental = false;
#end

bcbsnc.dashboard.features.prescriptions = $wo.feature.prescriptions;
bcbsnc.dashboard.features.claimsOnly = !$wo.feature.benefits || $wo.defaultPolicy.medicareAdvantage || $wo.defaultPolicy.medicareSupplement;
bcbsnc.dashboard.features.doctorsAndFacilities = $wo.feature.doctorsAndFacilities;
bcbsnc.dashboard.features.claims = $wo.feature.claims;
bcbsnc.dashboard.features.benefits = $wo.feature.benefits && !$wo.defaultPolicy.medicareAdvantage && !$wo.defaultPolicy.medicareSupplement;
bcbsnc.dashboard.features.blueLink = $wo.program.blueLink;
bcbsnc.dashboard.features.cpc = $wo.feature.contactPreferences;
bcbsnc.dashboard.features.medicareSupplement = $wo.defaultPolicy.medicareSupplement;
bcbsnc.dashboard.features.medicareAdvantage = $wo.defaultPolicy.medicareAdvantage;
bcbsnc.dashboard.features.PDP = $wo.defaultPolicy.PDP;
bcbsnc.dashboard.features.costEstimator = $wo.feature.costEstimator;
bcbsnc.dashboard.features.cpc = $wo.feature.contactPreferences;
bcbsnc.dashboard.features.telehealth = $wo.feature.telehealth;
bcbsnc.dashboard.features.healthLineBlue = $wo.feature.healthLineBlue;
bcbsnc.dashboard.features.wellness = $wo.feature.wellness;
bcbsnc.dashboard.features.tobaccoCessation = $wo.program.tobaccoCessation;
bcbsnc.dashboard.features.blueLocalDukeWake = $wo.defaultPolicy.blueLocalDukeWake;
bcbsnc.dashboard.features.isOver65 = $wo.defaultPolicy.isOver65;
bcbsnc.dashboard.features.isIndividual = $wo.defaultPolicy.isIndividual;
bcbsnc.dashboard.features.billingAndPayments = $wo.feature.billingAndPayments || $wo.feature.legacyBillingAndPayments;
bcbsnc.dashboard.features.medicareSupPlanFHD = $wo.program.medicareSupPlanFHD;
bcbsnc.dashboard.features.stateHealthPlan = $wo.defaultPolicy.isState;
bcbsnc.dashboard.features.isChatInboxPromoPeriod = $wo.defaultPolicy.isChatInboxPromoPeriod;

bcbsnc.dashboard.fluPromo = false;

bcbsnc.dashboard.RUID = "$loggedInMember.getAttribute('ldapRuid')";

bcbsnc.page = {};
bcbsnc.page.type = 'dashboard';
bcbsnc.page.mobile = true;
bcbsnc.page.desktop = false;

bcbsnc.dashboard.rtdm = {};
bcbsnc.dashboard.rtdm.id = "$loggedInMember.getAttribute('ldapRuid')";

bcbsnc.dashboard.livechat = {};
bcbsnc.dashboard.livechat.isActive = $wo.feature.isLiveChat;

bcbsnc.dashboard.services = {};
bcbsnc.dashboard.services.rtdm = true;
bcbsnc.dashboard.services.claims = true;
bcbsnc.dashboard.services.benefits = true;

bcbsnc.dashboard.sso = {};

#if($request.getSession().getAttribute('vender') && $request.getSession().getAttribute('ssoid'))
    bcbsnc.dashboard.sso.vendor = "$request.getSession().getAttribute('vender')";
    bcbsnc.dashboard.sso.ssoid = "$request.getSession().getAttribute('ssoid')";
#end


#if($wo.drugPolicy.lobDesc)
	bcbsnc.dashboard.drugPolicy = "$wo.drugPolicy.lobDesc | $wo.drugPolicy.externalID | ${wo.drugPolicy.effectiveDate}-$wo.drugPolicy.expirationDate";
#else
	bcbsnc.dashboard.drugPolicy = false;
#end

##if($wo.dentalPolicy.lobDesc)
##	bcbsnc.dashboard.dentalPolicy = "$wo.dentalPolicy.lobDesc | $wo.dentalPolicy.externalID | ${wo.dentalPolicy.effectiveDate}-$wo.dentalPolicy.expirationDate";
##else
##	bcbsnc.dashboard.dentalPolicy = false;
##end


// bc-1108 - turn off flu promo
// #if($date.getMonth() > 9 || $date.getMonth() < 3)
// 	bcbsnc.dashboard.fluPromo = true;
// #else
// 	bcbsnc.dashboard.fluPromo = false;
// #end


bcbsnc.dashboard.messages = {};

bcbsnc.dashboard.messages.statusPanelDental = {};
bcbsnc.dashboard.messages.statusPanelDental.message = null;

#if ( $date.whenIs($date.toDate('yyyy-M-d H:m:s', '2016-06-30 21:00:00')).seconds <= 0 && $date.whenIs($date.toDate('yyyy-M-d H:m:s', '2016-07-01 07:00:00')).seconds >= 0 )

	bcbsnc.dashboard.messages.statusPanelDental.message = "The Dental Blue website is currently unavailable for regularly scheduled maintenance. We're sorry for the inconvenience.";
#end
