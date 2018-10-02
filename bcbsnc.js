var bcbsnc = (function (context) {
	var environment = {},
		classLibrary = {},
		schedule = {},
		parse = {},
		unparsedVelocityList = [],
		isUnparsed = function(velocityVar) {
			if (velocityVar && velocityVar.length > 0 && velocityVar.substr(0,1) == '$') {
				unparsedVelocityList.push(velocityVar);
				return true;
			} else {
				return false;
			}
		};

	parse.string = function(velocityVar){
		return isUnparsed(velocityVar) ? undefined : velocityVar;
	};

	parse.boolean = function(velocityVar){
		return isUnparsed(velocityVar) ? undefined : velocityVar.toLowerCase() == 'true' || velocityVar.toLowerCase() == 'y';
	};

	parse.date = function(velocityVar){
		return isUnparsed(velocityVar) ? undefined : new Date(velocityVar);
	};

	parse.number = function(number) {
		return (typeof number == 'undefined') ? undefined : (number > 0) && (number != '') && (number != undefined) ? parseFloat(number) : 0;
	};

	parse.toProperCase = function(string){
		return !(string) ? undefined : string.substr(0,1).toUpperCase() + string.substr(1).toLowerCase();
	};


	schedule.heqEffectiveDate = parse.date('07/01/2013');

	environment.providerSearchURL = 'http://healthsearch-test.bcbsnc.com/';
	environment.alereEnv   = 'yourhealthyoutcomes.uat.alerehealth.com';

	/* add return objects to context */
	context.environment = environment;
	context.velocityWarnings = unparsedVelocityList;
	context.classLibrary = classLibrary;
	context.schedule = schedule;
	context.parse = parse;

	return context;
})(bcbsnc || {});
bcbsnc.vdata = (function(c){

	var val = c.parse.string,
		valBool = c.parse.boolean,
		d = {
			firstName		: val("SARAH"),
			lastName		: val("GILLEY"),
			middleInitial	: val('J'),
			emailAddress	: val('test@bcbsnc.com'),
			solicitationPreference : valBool('$m.solicitationPreference'),
			memberKey		: val('0'),
			birthDate		: val('11/16/1953'),
			age 			: val('60'),
			gender 			: val('F'),
			relationship 	: val('SELF'),
			activeLobs 		: val('IHSA'),
			memberIdHash	: val(''),
			HRAportal		: val('$wo.thisMember.roles.HRAPortal'),
			heqEffectiveDate: c.schedule.heqEffectiveDate,
			accessSSN       : valBool('false'),
			accessPharmacy  : valBool('true'),
			carvedOutPharmacy : val(false)
		}
	d.address = {
		line1 : val('228 OAK VILLAGE PKWY'),
		line2 : val(''),
		city     : val('MOORESVILLE'),
		state    : val('NC'),
		zip      : val('28605')
	};
	return d;

})(bcbsnc);bcbsnc.classLibrary.member = (function (c) {
	var proper = c.parse.toProperCase;

	var parseLastName = function(lastName) {
		var nameArray = (lastName) ? lastName.split(' ') : '',
			len = nameArray.length,
			n = '';

		for(var i = 0; i < len; i++)
		{
			if (i == len - 1 && nameArray[i] != 'Jr.' && nameArray[i] != 'Sr.') {
				if (nameArray[i].substr(nameArray[i].length - 1) == '.') {
					nameArray[i] = nameArray[i].substr(0, nameArray[i].length - 1);
				}
			}

			if (i == (nameArray.length-1) && (nameArray[i] == 'II' || nameArray[i] == 'III' || nameArray[i] == 'IV' || nameArray[i] == 'V' || nameArray[i] == 'VI')) {
				n += nameArray[i].toUpperCase();
			} else {
				n += proper(nameArray[i]) + ' ';
			}
		}
		return n;
	}

	var m = function(data) {
		this.index			= data.index;
		this.key			= 'member' + data.index;
		this.isLoggedInMember = data.isLoggedInMember;
		this.firstName		= proper(data.firstName);
		this.lastName		= parseLastName(data.lastName);
		this.middleInitial	= data.middleInitial;
		this.displayName	= this.firstName + " " + this.middleInitial + " " + this.lastName;
		this.emailAddress	= data.emailAddress;
		this.solicitationPreference = data.solicitationPreference;
		this.birthDate 		= data.birthDate;
		this.age 			= data.age;
		this.gender 		= data.gender;
		this.relationship 	= data.relationship;
		this.isSubscriber 	= data.relationship === 'SELF';
		this.isSpouse		= data.relationship === 'SPOUSE';
		this.isDependent	= data.relationship === 'DEPENDENT';

	};

	return m;

}(bcbsnc));bcbsnc.classLibrary.policyMember = (function (c) {
	var proper = c.parse.toProperCase;

	var m = function(data, member) {
		this.key			= member.key;
		this.index			= member.index;
		this.isLoggedInMember = member.isLoggedInMember;
		this.firstName		= member.firstName;
		this.lastName		= member.lastName;
		this.middleInitial	= member.middleInitial;
		this.displayName	= member.displayName;
		this.emailAddress	= member.emailAddress;
		this.solicitationPreference = member.solicitationPreference;
		this.birthDate 		= member.birthDate;
		this.age 			= member.age;
		this.gender 		= member.gender;

		this.relationship	= proper(data.relationship);
		this.isSubscriber	= (data.relationship === 'SELF');
		this.isSpouse		= (data.relationship === 'SPOUSE');

		this.active 		= data.active;
		this.benefitPackageCode = data.benefitPackageCode;
		this.billingExclusion = data.billingExclusion;
		this.confCommActive	= data.confCommActive;
		this.memberNumber = data.memberNumber;
		this.effectiveDate	= new Date(data.effectiveDate);
		this.expirationDate = new Date(data.expirationDate);
		this.effectiveDateString = data.effectiveDate;
		this.expirationDateString = data.expirationDate;
		this.relationship	= data.relationship;

		this.spouse 		= {};
		this.hasSpouse		= function() { return this.spouse.length > 0 };

		this.dependants 	= {};
		this.hasdependants	= function() { return this.spouse.length > 0 };
	};

	return m;

}(bcbsnc));bcbsnc.classLibrary.claim = (function (c) {

	var today = new Date(),
		eobLeadway = today.setDate(today.getDate() -10);


	var claim = function(data) {
		this.amysisPayeeStatusCode = data.amysisPayeeStatusCode;
		this.amysisProviderId = data.amysisProviderId;
		this.appliedCoinsuranceAmount = parseFloat(data.appliedCoinsuranceAmount).toFixed(2);
		this.authKey = data.authKey;
		this.bcbsncDiscount = parseFloat(data.bcbsncDiscount).toFixed(2);
		this.claimId = data.claimId;
		this.claimType = (data.claimType == 'LRSP' || data.claimType.substring(1, 2) == 'M') ? 'MED' : data.claimType;
		this.claimsReceivedDate = new Date(data.claimsReceivedDate);
		this.claimsReceivedDateString = data.claimsReceivedDate;
		this.discount = parseFloat(data.discount).toFixed(2);
		this.endServiceDate = new Date(data.endServiceDate);
		this.endServiceDateString = data.endServiceDate;
		this.memberCost = parseFloat(data.memberCost).toFixed(2);
		this.memberKey = 'member' + data.memberIndex; /*data.memberKey;*/
		this.memberDisplayName = c.thisMember.members[this.memberKey].displayName; /*data.memberName;*/
		this.memberIndex = data.memberIndex;
		this.minimumStatusCode = data.minimumStatusCode;
		this.payCodeDescription = data.payCodeDescription;
		this.paymentDate = new Date(data.paymentDate);
		this.paymentDateString = data.paymentDate;
		this.pharmacyNumber = data.pharmacyNumber;
		this.placeOfServiceCode = data.placeOfServiceCode;
		this.prescriptionNumber = data.prescriptionNumber;
		this.providerRecordName = data.providerRecordName;
		this.serviceType = data.serviceType;
		this.startServiceDate = new Date(data.startServiceDate);
		this.startServiceDateString = data.startServiceDate;
		this.serviceDateYear = this.startServiceDate.getFullYear();
		this.timeStamp = data.timeStamp;
		this.totalAllowedAmount = parseFloat(data.totalAllowedAmount).toFixed(2);
		this.totalClaimInterestAmount = parseFloat(data.totalClaimInterestAmount).toFixed(2);
		this.totalClaimedAmount = parseFloat(data.totalClaimedAmount).toFixed(2);
		this.totalCoInsuranceAmount = parseFloat(data.totalCoInsuranceAmount).toFixed(2);
		this.totalCoPaymentAmount = parseFloat(data.totalCoPaymentAmount).toFixed(2);
		this.totalDeductibleAmount = parseFloat(data.totalDeductibleAmount).toFixed(2);
		this.totalToPayAmount = parseFloat(data.totalToPayAmount).toFixed(2);
		this.viewEOB = data.viewEOB;
		this.yourPart = parseFloat(data.yourPart).toFixed(2);

		this.processed = this.minimumStatusCode == "Processed";
		this.pharmacyClaim = this.claimType == 'PHARM';
		this.medicalClaim = this.claimType == 'MED';

		this.yourCost = this.pharmacyClaim ? this.memberCost : this.yourPart;
		/* if claim is denied, then make discount = ZERO */
		this.yourSavings = (this.totalAllowedAmount == 0) ? 0.00 : (this.totalClaimedAmount - this.totalAllowedAmount).toFixed(2);

		/* EOBs need 10 days from payment date until available online */
		this.viewableEOB = data.paymentDate != '00/00/0000' ? new Date(eobLeadway) >= this.paymentDate : false;
	};

	return claim;
}(bcbsnc));bcbsnc.classLibrary.benefitsPackage = (function (c,jQuery) {

	var bp = function(data) {
		this.hasMaternityBenefits = hasMaternityBenefits(data);
		this.formularyType = data.formularyType;
		this.formularyTypeBasic = data.formularyType === 'Basic';
		this.formularyTypeEnhanced = data.formularyType === 'Enhanced';

		this.raw = data.benefits;

	};

	/*
	 * hasMaternityBenefits
	 *
	 * Determines if a member has maternity coverage.
	 * QB#11178
	 *
	 * @param array benefits
	 * @return bool
	 */
	var hasMaternityBenefits = function(benefits) {
		if (c.thisMember.selectedPolicy.isGroup)
			return false;
		if (typeof(benefits) != 'undefined') {
			// List of benefit codes that indicate maternity coverage.
			var maternity_code_array = ['DH1', 'DH2', 'DK1', 'DK2', 'IA1', 'IA2', 'IA4', 'MA0', 'MB1', 'MB2', 'ME1', 'MF1', 'ML1', 'ML2', 'MP1', 'MS1', 'MV1', 'OX1', 'OX2', 'PM1', 'PM2', 'PM4'],
				has_maternity = false;

			for (var i = 0; i < benefits.length; i++) {
				if (jQuery.inArray(benefits[i].benefitCode, maternity_code_array) > -1) {
					if (benefits[i].holdCode != 'NB') {
						return true;
					}
				}
			}
		}
		return false;
	};

	return bp;
}(bcbsnc,jQuery));bcbsnc.classLibrary.individualAccrual = (function (c) {
	var valBool = c.parse.boolean, valNum = c.parse.number;

	function percentRemaining(a,b) {
		return (((a-b) / a) * 100) + "%";
	}
	function pastDate(date) {
		var now = new Date();
		return date < now;
	}

	var individualAccrual = function(data, network, policy) {
		this.memberIndex	= valNum(data.memberIndex);
		this.memberId		= valNum(data.memberId);
		this.effectiveDateString = data.effectiveDate;
		this.expirationDateString = data.expirationDate;
		this.effectiveDate = new Date(data.effectiveDate);
		this.expirationDate = new Date(data.expirationDate);
		if (network === 'IN') {
			this.coinsuranceMet = valNum(data.individualINCoinsuranceMet);
			this.coinsuranceRem = valNum(data.individualINCoinsuranceRem);
			this.coinsurance 	= valNum(data.individualINCoinsurance);
			this.deductibleMet 	= valNum(data.individualINDeductibleMet);
			this.deductibleRem 	= valNum(data.individualINDeductibleRem);
			this.hasMetDeductible = data.individualINDeductibleMetFlag;
			this.deductible 	= valNum(data.individualINDeductible);
			this.outOfPocketMet = valNum(data.individualINOutOfPocketMet);
			this.outOfPocket 	= valNum(data.individualINOutOfPocket);
		} else {
			this.coinsuranceMet = valNum(data.individualOONCoinsuranceMet);
			this.coinsuranceRem = valNum(data.individualOONCoinsuranceRem);
			this.coinsurance 	= valNum(data.individualOONCoinsurance);
			this.deductibleMet 	= valNum(data.individualOONDeductibleMet);
			this.deductibleRem 	= valNum(data.individualOONDeductibleRem);
			this.hasMetDeductible = data.individualOONDeductibleMetFlag;
			this.deductible 	= valNum(data.individualOONDeductible);
			this.outOfPocketMet = valNum(data.individualOONOutOfPocketMet);
			this.outOfPocket 	= valNum(data.individualOONOutOfPocket);
			this.deductibleRem 	= valNum(data.individualOONDeductibleRem);
		}

		this.hasCoinsurance = this.coinsurance > 0 || policy.utilization[network].coinsurancePerc != "0%";
		this.hasOOP 		= this.outOfPocket > 0;
		this.noDeductible	= this.deductible == 0;
		this.toMeetDeductible = policy.hasAggregateDeductible ? policy.utilization[network].deductibleRem : this.deductibleRem;
		this.coinsuranceMetPerc = percentRemaining(this.coinsurance, this.coinsuranceRem);
		this.outOfPocketMetPerc = percentRemaining(this.outOfPocket, this.outOfPocket - this.outOfPocketMet);
		this.isSubscriber 	= valNum(data.relationshipCode) == 1;
		this.isSpouse 		= valNum(data.relationshipCode) == 2;
		this.isDependent 	= valNum(data.relationshipCode) == 3;
		this.individualCrossOverUtilizationFlag = data.individualCrossOverUtilizationFlag;
		this.expired		= pastDate(this.expirationDate);
	};


	return individualAccrual;

}(bcbsnc));

/*
 function extendAccrual(accrual, utilization, policy) {

 accrual.graphThisUserIndividualINDeductibleMet = accrual.individualINDeductibleMet;
 if(accrual.individualOONDeductibleMet >= accrual.individualINDeductible) {
 accrual.graphThisUserIndividualINDeductibleMet = accrual.individualINDeductible;
 } else if(accrual.individualOONDeductibleMet > accrual.individualINDeductibleMet) {
 accrual.graphThisUserIndividualINDeductibleMet = accrual.individualOONDeductibleMet;
 }

 accrual.graphThisUserIndividualINCoinsuranceMet = accrual.individualINCoinsuranceMet;
 if(accrual.individualOONCoinsuranceMet >= accrual.individualINCoinsurance) {
 accrual.graphThisUserIndividualINCoinsuranceMet = accrual.individualINCoinsurance;
 } else if(accrual.individualOONCoinsuranceMet > accrual.individualINCoinsuranceMet) {
 accrual.graphThisUserIndividualINCoinsuranceMet = accrual.individualOONCoinsuranceMet;
 }
 }
 */
bcbsnc.classLibrary.utilization = (function (c) {

	var utilization = function(data) {
		this.init.apply(this, arguments);
	};

	function validateNumber(number) {
		return (number > 0) && (number != '') && (number != undefined) ? parseFloat(number) : 0;
	}
	function validatePercent(number) {
		return parseInt(validateNumber(number)) + '%';
	}

	function percentRemaining(a,b) {
		return validatePercent(((a-b) / a) * 100);
	}

	utilization.prototype.init = function(data, network) {
		if (network === 'IN') {
			this.coinsuranceMet		= validateNumber(data.familyINCoinsuranceMet);
			this.coinsurance		= validateNumber(data.familyINCoinsurance);
			this.coinsuranceRem		= validateNumber(data.familyINCoinsuranceRem);
			this.coinsurancePerc	= validatePercent(data.familyINCoinsurancePerc);
			this.specCoinsurance	= validateNumber(data.familyINSpecCoinsurance);
			this.specCoinsuranceMet	= validateNumber(data.familyINSpecCoinsuranceMet);
			this.specCoinsurancePerc= validatePercent(data.familyINSpecCoinsurancePerc);
			this.specCoinsuranceRem	= validateNumber(data.familyINSpecCoinsuranceRem);
			this.deductibleMet		= validateNumber(data.familyINDeductibleMet);
			this.deductible			= validateNumber(data.familyINDeductible);
			this.specDeductible		= validateNumber(data.familyINSpecDeductible);
			this.specDeductibleMet	= validateNumber(data.familyINSpecDeductibleMet);
			this.specDeductibleRem	= validateNumber(data.familyINSpecDeductibleRem);
			this.outOfPocketMet		= validateNumber(data.familyINOutOfPocketMet);
			this.outOfPocket		= validateNumber(data.familyINOutOfPocket);
			this.deductibleRem		= validateNumber(data.familyINDeductibleRem);
			this.hasMetDeductible	= data.familyINDeductibleMetFlag;

			this.hasTier2Coinsurance= this.specCoinsurance > 0 || this.specCoinsurancePerc != "0%";
			this.coinsurance100		= this.specCoinsurancePerc == '100%';

			this.totalCoinsurance	= validateNumber(data.totalINCoinsurance);
			this.totalDeductible	= validateNumber(data.totalINDeductible);
			this.totalOutOfPocket	= validateNumber(data.totalINOutOfPocket);

		} else {
			this.coinsuranceMet 	= validateNumber(data.familyOONCoinsuranceMet);
			this.coinsurance 		= validateNumber(data.familyOONCoinsurance);
			this.coinsuranceRem 	= validateNumber(data.familyOONCoinsuranceRem);
			this.coinsurancePerc 	= validatePercent(data.familyOONCoinsurancePerc);
			this.deductibleMet 		= validateNumber(data.familyOONDeductibleMet);
			this.deductible 		= validateNumber(data.familyOONDeductible);
			this.outOfPocketMet 	= validateNumber(data.familyOONOutOfPocketMet);
			this.outOfPocket 		= validateNumber(data.familyOONOutOfPocket);
			this.deductibleRem 		= validateNumber(data.familyOONDeductibleRem);
			this.hasMetDeductible	= data.familyOONDeductibleMetFlag;


			this.hasUnlimitedCoinsurance = (this.coinsurancePerc != "0%" && this.coinsurance == 0);

			this.totalCoinsurance	= validateNumber(data.totalOONCoinsurance);
			this.totalDeductible	= validateNumber(data.totalOONDeductible);
			this.totalOutOfPocket	= validateNumber(data.totalOONOutOfPocke);
		}

		this.hasDeductible		= this.deductible > 0;
		this.hasCoinsurance		= this.coinsurance > 0 || this.coinsurancePerc != "0%";
		this.coinsuranceMetPerc	= percentRemaining(this.coinsurance, this.coinsuranceRem);
		this.outOfPocketMetPerc	= percentRemaining(this.outOfPocket, this.outOfPocket - this.outOfPocketMet);
		this.hasCrossOverUtilization = data.familyCrossOverUtilizationFlag;
		this.familyMultiplier	= validateNumber(data.familyMultiplier);
		this.familyMembers		= validateNumber(data.familyMembers);

	};

	return utilization;
}(bcbsnc));

/*
 function extendUtilization(utilization) {



 var totalOOPIN = 0, totalOOPOON = 0;
 .each(utilization, function(index, value) {
 validateIndividualAccrual(value);
 totalOOPIN = totalOOPIN + value.individualINOutOfPocketMet;
 totalOOPOON = totalOOPOON + value.individualOONOutOfPocketMet;
 });
 utilization.totalINOutOfPocketMet 	= totalOOPIN;
 utilization.totalOONOutOfPocketMet 	= totalOOPOON;


 utilization.graphFamilyINDeductibleMet = utilization.familyINDeductibleMet;
 if(utilization.familyOONDeductibleMet >= utilization.familyINDeductible) {
 utilization.graphFamilyINDeductibleMet = utilization.familyINDeductible;
 } else if(utilization.familyOONDeductibleMet > utilization.familyINDeductibleMet) {
 utilization.graphFamilyINDeductibleMet = utilization.familyOONDeductibleMet;
 }

 utilization.graphFamilyINCoinsuranceMet = utilization.familyINCoinsuranceMet;
 if(utilization.familyOONCoinsuranceMet >= utilization.familyINCoinsurance) {
 utilization.graphFamilyINCoinsuranceMet = utilization.familyINCoinsurance;
 } else if(utilization.familyOONCoinsuranceMet > utilization.familyINCoinsuranceMet) {
 utilization.graphFamilyINCoinsuranceMet = utilization.familyOONCoinsuranceMet;
 }



 utilization.processAsIndivitual		= false;
 utilization.processAsFamily			= false;


 }*/bcbsnc.classLibrary.policy = (function (c) {

	var policy = function(data) {
		this.init.apply(this, arguments);
	};

	policy.prototype.init = function(data) {
		var groupName = data.groupName;
		var groupNum = data.groupNumber;
		var lob = data.lobCode;
		var policyKey = data.policyKey;

		var isHSA = data.isHSA;
		var isHRA = data.isHRA;
		var effDate = new Date(data.effectiveDate);
		var expDate = new Date(data.expirationDate);
		var tmpDate = new Date(expDate);
		var today = new Date();
		var plusSevenMonths = new Date(tmpDate.setMonth(tmpDate.getMonth() + 6));
		var expireLinks = (plusSevenMonths < today);

		this.key = data.key;
		this.index = data.index;
		this.planName = getPlanName(groupNum, data.lobName);
		this.defaultPolicy = data.defaultPolicy;
		this.accountNumber = data.accountNumber;
		this.vbbBlueRewardProgram = data.vbbBlueRewardProgram;
		this.accountStatusCode = data.accountStatusCode;
		this.accountType = data.accountType;
		this.externalID = data.externalID;
		this.subscriberID = data.externalID.substring(0, data.externalID.length - 2);

		this.lobCode = data.lobCode;
		this.lobName = data.lobName;
		this.effectiveDate = effDate;
		this.effectiveDateYear = effDate.getFullYear();
		this.effectiveDateString = data.effectiveDate;
		this.expirationDate = expDate;
		this.expirationDateYear = expDate.getFullYear();
		this.expirationDateString = data.expirationDate;
		this.isActive = data.isActive;
		this.futurePolicy = effDate > new Date();
		this.preACA = effDate < new Date('01/01/2014');
		this.policyYear	= effDate.getFullYear();
		this.subscriberKey = data.subscriberKey;
		this.members = data.members || {};
		this.memberCount = data.memberCount;
		this.grandfatherFlag = data.grandfatherFlag;
		this.hasChangeContact = data.updateContact;

		/* Group Specific */
		this.isGroup = data.isGroup;
		this.groupName = data.groupName;
		this.groupNumber = data.groupNumber;

		/* Individual Specific */
		this.isIndividual = data.isIndividual;
		this.isListBill = data.isListBill;

		this.isState = data.isState;
		this.displayClaimsByYear = data.isState;
		this.claimsStartDate = this.displayClaimsByYear ? new Date(this.policyYear, 0, 1) : this.effectiveDate;
		this.claimsEndDate = this.displayClaimsByYear ? new Date(this.policyYear, 11, 31) : this.expirationDate;

		this.hasPharmacy = data.isMedical && !data.isState && !inArray(parseInt(groupNum), [006523, 008386, 008423, 008454, 008512, 008539, 008577, 008952, 008961, 008963, 009258, 009317, 009321, 009323, 009335, 009401, 009402, 009403, 009405, 009410, 009412, 009413, 009414, 009415, 009727, 009728, 009729, 009730, 009941, 009971, 009986, 009987, 011524, 011525, 011526, 011574, 011575, 011600, 011639, 011644, 011691, 011693, 011694, 011695, 011696, 011697, 011698, 011699, 011700, 011701, 012435, 012436, 012437, 012438, 012439, 012440, 012456, 012459, 012460, 012478, 012479, 012480, 012481, 012485, 012633, 012634, 052108, 055223, 055229, 063993, 065785, 066046, 066870, 068220, 068222, 073219, 073227, 073229, 074602, 075149, 075150, 075321, 077390, 079273, 079346, 079361, 079364, 079368, 079369, 622021, 622024, 622050, 622058, 622075, 622077, 622110, 622115, 622116, 622120, 622132, 622135, 622177, 622185, 622211, 622235, 622238, 622263, 622265, 622267, 622268, 622273, 622277, 622279, 622293, 622295, 622298, 622301, 622302, 622309, 622312, 622315, 622317, 622318, 622320, 622321, 622323, 622326, 622327, 622329, 622330, 622331, 622332, 622333, 622334, 622335, 622337]); /* data.hasPharmacy; */
		this.hasNCHC = data.hasNCHC;
		this.updateSSN = data.accessSSN;

		this.isHSA = isHSA;
		this.isHRA = isHRA;

		this.isDental  = data.isDental;
		this.dentalWaitingPrdEffDate = new Date(data.dentalWaitingPrdEffDateString);
		this.dentalWaitingPrdEffDateString = data.dentalWaitingPrdEffDateString;
		this.dentalWaitingPrdExpDate = new Date(data.dentalWaitingPrdExpDateString);
		this.dentalWaitingPrdExpDateString = data.dentalWaitingPrdExpDateString;
		this.dentalWaitingPrdSatisfied = (this.dentalWaitingPrdExpDateString == '' && this.dentalWaitingPrdEffDateString == '')
		this.isMedical = data.isMedical;
		this.onExchange = data.onExchange;
		this.isASO = data.isASO;

		this.hasAggregateDeductible	= false;
		this.hasEmbeddedDeductible	= false;
//SM3007 this.hsaPortal				= data.hsaPortal || data.hsaPortalI;
		this.fundPortal				= data.fundPortal;
		this.hsaPortal				= (data.fundPortal == 'BenefitWallet' || data.fundPortal == 'HealthEquity'); //SM3007
		this.activeHSALinks			= (this.hsaPortal && !expireLinks && c.thisMember.isSubscriber);
		this.manageHSA 				= this.activeHSALinks && !inArray(groupNum, ["052147","055696","052598"]);
		this.activeHRALinks			= (data.hraPortal && !expireLinks && c.thisMember.isSubscriber);
		this.hasBlueAdvantageFamily	= inArray(lob, ["IADV","IBAS","ISAV"]);
		this.hasOON					= !inArray(lob, ["IBAS","CMM1","HMO1"]);
		this.hasPPO					= inArray(lob, ["PPO1","CMM1","HMO1"]) || data.hasNCHC;
		this.hasPCP					= hasPCP(groupNum);
		this.contentSource			= getPolicyContentSource(this);
		this.isBlueAssurance		= groupName == 'BLUE ASSURANCE';
		this.isBlueAdvantage		= groupName == 'BLUE ADVANTAGE';
		this.isMedSupp				= (lob === 'MED');
		this.isPDP					= (lob === 'PDP');
		this.isOver65				= inArray(lob, ["MED","MADH","MADP","PDP"]);
		this.isMedAdvantage			= inArray(lob, ["MADH","MADP"]);
		this.isBBT					= inArray(parseInt(groupNum), [009321, 009323, 075149, 075150, 079361, 079364, 079368, 079369]);
		this.showWhatsThis			= !inArray(lob, ["TIRC","ILOW","LOWC"]);

		this.sourceSystem			= data.sourceSystem;
		this.isSourceSystemTopaz	= ((data.sourceSystem) && data.sourceSystem.toLowerCase() === "topaz");

		this.canRequestIdCard		= this.isActive && !this.onExchange;
		this.canUpdateAddress		= (c.thisMember.isSubscriber && (this.isIndividual || this.hasChangeContact) && !this.onExchange);
		this.canRequestPOC			= !this.isMedAdvantage && !this.isPDP && !this.isActive;
		this.canProvideOtherCoverageDetails = !this.isMedAdvantage && !this.isPDP && this.isGroup && !this.isState && !this.isSourceSystemTopaz;
		this.canManageBillingAndPayments = c.thisMember.isSubscriber && this.isIndividual;
		this.canViewBenefitBooklet	= (!this.isState && this.isActive && this.lobCode != 'IBAS' && !this.isBBT);

		this.selectOptionDisplay	= data.externalID + " (" + data.effectiveDate + " - " + data.expirationDate + ")";
		this.lagacyPolicyKey		= data.externalID + "|" + data.effectiveDate + "|" + data.expirationDate;

		this.troop = data.troop;
		this.transitional = data.transitional;
		this.isRCP =  inArray(groupNum, ["012483","012484"]);
		this.memberKeys = data.memberKeys;

		if (this.activeHRALinks) {
			this.HRAPolicyProvider = getHRAPolicyProvider(this);
			this.isHEQ = this.HRAPolicyProvider === 'HEQ';
		}

//SM3007
//this.canManageHEQHSA = c.thisMemeber.isSubscriber && !!this.isHEQ;
		this.canManageHEQHSA = this.manageHSA && this.fundPortal == 'HealthEquity';
		this.canManageBWHSA = this.manageHSA && this.fundPortal == 'BenefitWallet';
		this.canManageHeqHRA = this.activeHRALinks && c.thisMember.isSubscriber && !!this.isHEQ && (daysSinceExpirationDate(this.expirationDate) < 90);
		//this.canManageHSA = this.activeHSALinks && c.thisMember.isSubscriber;

		if (this.canManageBWHSA) {
			this.HSABalanceData = {
				externalID : data.HSAExternalID,
				balance : data.HSABalance,
				timestamp : data.HSATimestamp,
				error : data.HSAError,
				hasError : inArray(data.HSAError, ["5001","5002","5003"])
			};
		}
	};

	function getHRAPolicyProvider(policy) {
		var today = new Date(),
			s = '';

		if (policy.effectiveDate >= bcbsnc.schedule.heqEffectiveDate) {
			s = 'HEQ';
		} else {
			if (monthDiff(today, policy.expirationDate) >= -7) {
				s = 'ACS';
			}
		}
		return s;
	}

	function monthDiff(d1, d2) {
		var months;
		months = (d2.getFullYear() - d1.getFullYear()) * 12;
		months -= d1.getMonth() + 1;
		months += d2.getMonth();
		return months <= 0 ? 0 : months;
	}

	function daysSinceExpirationDate (expirationDate) {
		var todaysDate = new Date();
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		var millisecondsBetween = todaysDate.getTime() - expirationDate.getTime();
		var days = millisecondsBetween / millisecondsPerDay;

		return Math.floor(days);
	}

	function hasPCP(groupNumber) {
		var bool = false;
		pcpGroups = ["009851","009852","009853","009854","009855","009864","009866","009868","009870","009872","009876","011668","011669","011671","011676","011678","011660","011661","011662","011663","011664","011665","011666","011667","011679","011677","011672","011673","011674","011675","011680"];
		for (grp in pcpGroups) {
			if(groupNumber==pcpGroups[grp]) {
				bool = true;
				break;
			}
		}
		return bool;
	}

	function inArray(item, array) {
		for (i in array) {
			if(item == array[i]) {
				return true;
			}
		}
		return false;
	}

	var getPlanName = function(groupNumber, lobDescription){
		if(groupNumber == 'ISAV01') {
			return lobDescription + ' Saver 1';
		} else if(groupNumber == 'ISAV02') {
			return lobDescription + ' Saver 2';
		} else if(groupNumber == 'ISAV03') {
			return lobDescription + ' Saver 3';
		} else {
			return lobDescription;
		}
	};

	/* Content Source is used on Benefits pages for over65 */
	function getPolicyContentSource(policy) {
		if (policy.isGroup) {
			switch(policy.lobCode) {
				case 'MADP':
					return 'PPO-Group.html';
					break;
				case 'MADH':
					return 'HMO-Group.html';
					break;
				default :
					return "benefitsService";
			}
		} else if (policy.isIndividual) {
			var dir = policy.policyYear < 2011 ? '' : policy.policyYear +"/";
			switch(policy.groupNumber) {
				case '011200': //HMO Medical Only
					return dir + "HMO-Medical-Only.html";
					break;
				case '011500': //HMO Standard Rx
					return dir + "HMO-Standard.html";
					break;
				case '011100':  //HMO Enhanced Rx
					return dir + "HMO-Enhanced.html";
					break;
				case '011488':  //HMO Enhanced Rx - Added for NCTIO
					return dir + "HMO-Enhanced.html";
					break;
				case '022100': //PPO Enhanced Rx
					return dir + "PPO-Enhanced.html";
					break;
				case '022210': //PPO Enhanced Freedom
					return dir + "PPO-Enhanced-Freedom.html";
					break;
				case '099100': //Standard Rx Prescription Drug Plan
					return undefined; //BCBSNC PDP Standard RX
					break;
				case '099200': //Enhanced Rx Prescription Drug Plan
					return undefined; //BCBSNC PDP Enhanced RX
					break;
				default :
					return "benefitsService";
			}
		} else {
			return "benefitsService";
		}
	}


	return policy;

}(bcbsnc));
bcbsnc.classLibrary.claimsHelper = (function(c){

	var claimsHelper = function(policy) {
		var thisPolicy = policy;
		thisPolicy.claims = [];
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};

		this.getPolicy().selectClaim = function(claimID) {
			for ( var i=0; i < thisPolicy.claims.length; i++) {
				if(thisPolicy.claims[i].claimId == claimID) {
					thisPolicy.selectedClaim = thisPolicy.claims[i];
				}
			}
		};
	};

	var claimsLoader = function(data, scope) {
		var len = data.length,
			claim = {};
		for (var i=0; i < len; i++)
		{
			claim = new c.classLibrary.claim(data[i]);
			if ((scope.getPolicy().displayClaimsByYear && scope.getPolicy().policyYear == claim.serviceDateYear)  || !scope.getPolicy().displayClaimsByYear) {
				scope.getPolicy().claims.push(claim);
			}
		}
		scope.getPolicy().hasClaims = len > 0;
		scope.getPolicy().claimCount = len;
	};

	var resolveDeferred = function(deferred, scope) {
		scope.loaded = true;
		scope.loading = false;
		deferred.resolve(scope.getPolicy().claims);
	};

	claimsHelper.prototype.load = function() {
		var that = this,
			dfd = jQuery.Deferred(),
			policy = this.getPolicy();

		if (!this.loaded) {
			this.loading = true;

			if (!policy.combinedClaimsPolicyKeys) {
				c.services.getClaims(policy).done(function(data) {
					claimsLoader(data, that);
					resolveDeferred(dfd, that);
				});
			} else {
				var len = policy.combinedClaimsPolicyKeys.length,
					resolvedCount = 0,
					allClaims = {};

				for (var i=0;i<len;i++) {
					var pKey = policy.combinedClaimsPolicyKeys[i],
						p = c.thisMember.policies[pKey];

					c.services.getClaims(p).done(function(data){
						claimsLoader(data, that);
						resolvedCount = resolvedCount + 1;

						if (resolvedCount == len) {
							resolveDeferred(dfd, that);
						}
					});
				}
			}

		} else {
			dfd.resolve(that.getPolicy().claims);
		}

		return dfd.promise();

	};


	return claimsHelper;

}(bcbsnc));bcbsnc.classLibrary.benefitsHelper = (function(c){

	var benefitsHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var benefitsLoader = function(data, scope) {

		scope.getPolicy().benefits = new c.classLibrary.benefitsPackage(data);

		scope.getPolicy().hasEmbeddedDeductible = data.deductibleType === "STACKED";
		scope.getPolicy().hasAggregateDeductible = data.deductibleType === "AGGREGATE";

		scope.getPolicy().utilization = {};
		scope.getPolicy().utilization.IN = new c.classLibrary.utilization(data.utilization, 'IN');
		scope.getPolicy().utilization.OUT = new c.classLibrary.utilization(data.utilization, 'OUT');

		scope.getPolicy().individualAccruals = {};
		scope.getPolicy().individualAccruals.IN = {};
		scope.getPolicy().individualAccruals.OUT = {};
		jQuery.each(data.utilization.individualAccruals, function(i,accrual){
			var IN = new c.classLibrary.individualAccrual(accrual, 'IN', scope.getPolicy());
			var OUT = new c.classLibrary.individualAccrual(accrual, 'OUT', scope.getPolicy());
			scope.getPolicy().individualAccruals.IN['member' + IN.memberIndex] = IN;
			scope.getPolicy().individualAccruals.OUT['member' + OUT.memberIndex] = OUT;
		});

		scope.getPolicy().hasOON = scope.getPolicy().utilization.OUT.hasDeductible || scope.getPolicy().utilization.OUT.hasCoinsurance;

		scope.loaded = true;
		scope.loading = false;
	};


	benefitsHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getBenefits(this.getPolicy()).done(function(data) {
			that.loading = true;
			benefitsLoader(data, that);
		});
	};

	return benefitsHelper;

}(bcbsnc));/* TODO : Update for MEMBER-116
 During the invoice generation process for APTC ON exchange members , when members login into MMS application they are getting below message. Below is the JSON for member YPIW1610403401. This is happening only during the invoice generation dates between 12th and 15th every month.

 {"amountDue":98.6,"bankDraft":false,"dueDate":"06/01/2014","monthlyRate":98.6,"payable":true,"reinstateable":"N","reinstatementAmount":0.0,"reinstatementDate":"03/11/3000"}.

 Can you add a message for these members saying that the invoice is in the process of generation. Do you have any check on web office side in the code to check for Invoice dates ? Please let me know if you need any information.
 */

bcbsnc.classLibrary.accountStatus = (function (c) {
	var today = new Date(), valBool = c.parse.boolean;

	var accountStatus = function(data) {
		this.monthlyRate = data.monthlyRate;
		this.amountDue = data.amountDue;
		this.amountDueDisplay = '$' + parseFloat(this.amountDue).toFixed(2);
		this.hasAmountDue = this.amountDue > 0;
		this.dueDateString = data.dueDate;
		this.dueDate = new Date(data.dueDate);
		this.dueDatePlusThirty = new Date(this.dueDate.getTime() + 30*24*60*60*1000);
		//this.generatingInvoice = this.dueDate < today && this.amountDue == 0;
		this.overdue = this.dueDate < today && !this.generatingInvoice;
		this.payable = valBool(data.payable);
		this.bankDraft = valBool(data.bankDraft);
		this.invoiced = !this.bankDraft;
		this.paymentMethod = this.bankDraft ? 'Bank Draft' : 'Invoiced';
		this.reinstateCode = data.reinstateable;
		this.reinstatable = (this.reinstateCode == 'P' || this.reinstateCode == 'W');
		this.reinstateWeb = (this.reinstateCode =='W');
		this.reinstatePhone = (this.reinstateCode =='P');
		this.reinstatementAmount = data.reinstatementAmount;
		this.reinstatementDateString = data.reinstatementDate;
		this.reinstatementDate = new Date(data.reinstatementDate);
		/* If an individual subscriber and account is 30 or more days past due and there is an amount due */
		this.makeMinimumPayment = this.dueDatePlusThirty < today && this.amountDue > 0;
		/* If an individual subscriber and account is paid in full and payment method is direct bill */
		this.setUpAutoPay = (this.monthlyRate > 0) && ((this.amountDue === 0) || (today < this.dueDate)) && (!this.bankDraft) && (!this.overdue);
		this.hasAPTCDateError = false;

		//Hide Overdue/Payment info if invoice year == 0002
		if(data.dueDate.substr(data.dueDate.length-4) == '0002') {
			this.hasAPTCDateError = true;
		}

	};

	return accountStatus;

}(bcbsnc));
bcbsnc.classLibrary.accountStatusHelper = (function(c){

	var accountStatusHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var accountStatusLoader = function(data, scope) {

		scope.getPolicy().accountStatus = new c.classLibrary.accountStatus(data);

		scope.loaded = true;
		scope.loading = false;
	};

	accountStatusHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getAccountStatus(this.getPolicy()).done(function(data) {
			that.loading = true;
			accountStatusLoader(data, that);
		});
	};

	return accountStatusHelper;

}(bcbsnc));bcbsnc.classLibrary.address = (function (c) {
	var valBool = c.parse.boolean;

	var address = function(data) {
		this.subscriberName = data.subscriberName;
		this.address1 = data.address1;
		this.address2 = data.address2;
		this.city = data.city;
		this.countyCode = data.county;
		this.state = data.state;
		this.zip = data.zip;
		this.zip4 = data.zip4;

		this.billingStatement = valBool(data.billingStatement);
		this.individualPolicy = valBool(data.individualPolicy);
		this.hasWorkPhone = valBool(data.workPhoneProvided);
		this.hasHomePhone = data.homePhoneAreaCode.length+data.homePhoneExchangeCode.length+data.homePhoneAccessCode.length > 0;

		this.homePhone = this.hasHomePhone ? (data.homePhoneAreaCode.length > 0 ? data.homePhoneAreaCode+'-' : '')+data.homePhoneExchangeCode+'-'+data.homePhoneAccessCode : '';

		this.workPhone = this.hasWorkPhone ? (data.workPhoneAreaCode.length > 0 ? data.workPhoneAreaCode+'-' : '')+data.workPhoneExchangeCode+'-'+data.workPhoneAccessCode+(data.workPhoneExtentionNumber.length > 0 ? ' x' + data.workPhoneExtentionNumber : '')  : '';

	};

	return address;

}(bcbsnc));bcbsnc.classLibrary.addressHelper = (function(c){

	var addressHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var addressLoader = function(data, scope) {

		scope.getPolicy().address = new c.classLibrary.address(data);

		scope.loaded = true;
		scope.loading = false;
	};

	addressHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getAddress(this.getPolicy()).done(function(data) {
			addressLoader(data, that);
		});
	};

	return addressHelper;

}(bcbsnc));bcbsnc.classLibrary.primaryCareProvider = (function (c) {
	var today = new Date(), valBool = c.parse.boolean;

	var primaryCareProvider = function(data) {
		this.memberIndex = data.memberIndex;
		this.memberElectedProviderID = data.memberElectedProviderID;
		this.memberNumber = data.memberNumber;
		this.officeAddress1 = data.officeAddress1;
		this.officeAddress2 = data.officeAddress2;
		this.officeCity = data.officeCity;
		this.officeName = data.officeName;
		this.officeState = data.officeState;
		this.officeZip = data.officeZip;
		this.planCode = data.planCode;
		this.productID = data.productID;
		this.providerFirstName = data.providerFirstName;
		this.providerLastName = data.providerLastName;
		this.providerMidName = data.providerMidName;
		this.providerNameSuffix = data.providerNameSuffix;
		this.providerNumber = data.providerNumber;
		this.providerNumberSuffix = data.providerNumberSuffix;
		this.providerPhone = data.providerPhone;
		this.providerSex = data.providerSex;
		this.providerTitle = data.providerTitle;
		this.sequenceNumber = data.sequenceNumber;
		this.subscriberNumber = data.subscriberNumber;
	}

	return primaryCareProvider;

}(bcbsnc));bcbsnc.classLibrary.primaryCareProviderHelper = (function(c){

	var primaryCareProviderHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var primaryCareProviderLoader = function(data, scope) {

		var pcpList = data.pcp || [];

		if (pcpList.length) {
			for (var p in pcpList) {
				scope.getPolicy().members["member" + p.memberIndex].primaryCareProvider = new c.classLibrary.primaryCareProvider(pcpList[p]);
			}
		}

		scope.loaded = true;
		scope.loading = false;
	};

	primaryCareProviderHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getPCPList(this.getPolicy()).done(function(data) {
			primaryCareProviderLoader(data, that);
		});
	};

	return primaryCareProviderHelper;

}(bcbsnc));bcbsnc.classLibrary.hraBalanceHelper = (function(c){
	var todaysDate = new Date(),
		formattedDate = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();

	var hraBalanceHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var loader = function(data, scope) {

		scope.getPolicy().hraBalances = {
			hraBalance : '$' + parseFloat(data.HRABalance).toFixed(2),
			hasHraBalance : typeof(data.HRABalance) != 'undefined',
			fsaBalance : '$' + parseFloat(data.FSABalance).toFixed(2),
			hasFsaBalance : typeof(data.FSABalance) != 'undefined',
			dcraBalance : parseFloat(data.DCRABalance).toFixed(2),
			hasDcraBalance : typeof(data.DCRABalance) != 'undefined',
			error : data.error,
			asOfDate : formattedDate,
			optOut : data.error == '200HEQOPTOUT',
			hasError : data.error != '200HEQOPTOUT' && !data.error
		};

		scope.loaded = true;
		scope.loading = false;
	};

	hraBalanceHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getHRABalance(this.getPolicy()).done(function(data) {
			loader(data, that);
		});
	};

	return hraBalanceHelper;

}(bcbsnc));bcbsnc.classLibrary.hsaBalanceHelper = (function(c){
	var todaysDate = new Date(),
		formattedDate = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();

	var hsaBalanceHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var loader = function(data, scope) {

		scope.getPolicy().hsaBalanceData = {
			balance : data.balance,
			externalId : data.externalId,
			timeStamp : (data.timeStamp.substring(5,7) +  '/' + data.timeStamp.substring(8,10) +  '/' + data.timeStamp.substring(4,0)),
			hasError : (data.error == '5001' || data.error == '5002' || data.error == '5003')
		};

		scope.loaded = true;
		scope.loading = false;
	};

	hsaBalanceHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getHSABalance(this.getPolicy()).done(function(data) {
			loader(data, that);
		});
	};

	return hsaBalanceHelper;

}(bcbsnc));bcbsnc.classLibrary.heqHSABalanceHelper = (function(c){
	var todaysDate = new Date(),
		formattedDate = (todaysDate.getMonth() + 1) + '/' + todaysDate.getDate() + '/' + todaysDate.getFullYear();

	var heqHSABalanceHelper = function(policy) {
		var thisPolicy = policy;
		this.loaded = false;
		this.loading = false;
		this.getPolicy = function() {
			return thisPolicy;
		};
	};

	var loader = function(data, scope) {

		scope.getPolicy().heqHSABalances = {
			hsaBalance : '$' + parseFloat(data.HSABalance).toFixed(2),
			hasHsaBalance : typeof(data.HSABalance) != 'undefined',
			fsaBalance : '$' + parseFloat(data.FSABalance).toFixed(2),
			hasFsaBalance : typeof(data.FSABalance) != 'undefined',
			dcraBalance : parseFloat(data.DCRABalance).toFixed(2),
			hasDcraBalance : typeof(data.DCRABalance) != 'undefined',
			error : data.error,
			asOfDate : formattedDate,
			optOut : data.error == '200HEQOPTOUT',
			hasError : data.error && data.error != '200HEQOPTOUT'
		};

		scope.loaded = true;
		scope.loading = false;
	};

	heqHSABalanceHelper.prototype.load = function() {
		var that = this;
		this.loading = true;
		return c.services.getHEQHSABalance(this.getPolicy()).done(function(data) {
			loader(data, that);
		});
	};

	return heqHSABalanceHelper;

}(bcbsnc));bcbsnc.thisMember = (function(c){
	var d = c.vdata,valNum = c.parse.number;
	var m = new c.classLibrary.member(c.vdata);

	m.selectPolicy = function(policyKey) {
		this.selectedPolicyKey = policyKey;
		this.selectedPolicy = this.policies[policyKey];
		return this.selectedPolicy;
	};

	m.selectMember = function(memberKey) {
		this.selectedMemberKey = memberKey;
		this.selectedMember = this.members[memberKey];
		return this.selectedMember;
	};

	/*	m.hasPharmacy = function() {
	 return (d.accessPharmacy && (lobCode != 'DTL1') && !accessNCHC && !carvedOutPharmacy);
	 } */
	m.address = c.vdata.address;
	m.defaultMemberKey = 'member' + valNum('0');
	return m;
}(bcbsnc));
bcbsnc.thisMember.roles = (function(c) {
	var valBool = c.parse.boolean;
	return {
		Dental : false,
		ViewClaims : true,
		CheckBenefits : true,
		RequestIdCard : true,
		Pharma : true,
		ContactInfo : true,
		eBill : true,
		MemberGuide : true,
		BillingPrefs : true,
		ManagePolicy : true,
//SM3007 - start
		//HSAPortal : false,
		//HSAPortal :  true ,
		HSAPortal :  true ,
//SM3007 - end
		HRAPortal : false,
		ImproveHealthMenu : true,
		BlueExtras : true,
		AudioBlue : true,
		GetFitBlue : true,
		VitaBlue : true,
		OpticBlue : true,
		CosSurgery : true,
		CosDentistry : true,
		AltMedBlue : true,
		BlueRewards : true,
		VisionDiscount : false,
		PlanComparison : false,
		PharmAdvisor : true,
		HospitalCompare : true,
		Miavita : true,
		PPA : true,
		PPAPharm : true,
		DIM : true,
		EasyPayBlue : false,
		MedicationDedication : false
	};
}(bcbsnc));bcbsnc.thisMember.members = (function (c) {
	var m = {},id = '',val = c.parse.string,valBool = c.parse.boolean;

	id = 'member0';
	var o = {
		key : id,
		index : val('0'),
		userID : val('$m.userID'),
		isLoggedInMember : valBool('true'),
		firstName : val("SARAH"),
		lastName : val("GILLEY"),
		middleInitial : val('J'),
		suffix : val(''),
		birthDate : val('11/16/1953'),
		emailAddress : val(''),
		gender : val('F'),
		solicitationPreference : valBool('false')
	};

	m[id] = new bcbsnc.classLibrary.member(o);

	c.thisMember.index = o.index;

	if(!c.thisMember.loggedInMember && o.isLoggedInMember) {
		c.thisMember.loggedInMember = o;
	}

	id = 'member1';
	var o = {
		key : id,
		index : val('1'),
		userID : val('$m.userID'),
		isLoggedInMember : valBool('false'),
		firstName : val("KYLE"),
		lastName : val("BUCHANAN"),
		middleInitial : val(''),
		suffix : val(''),
		birthDate : val('08/01/2013'),
		emailAddress : val(''),
		gender : val('M'),
		solicitationPreference : valBool('false')
	};

	m[id] = new bcbsnc.classLibrary.member(o);


	if(!c.thisMember.loggedInMember && o.isLoggedInMember) {
		c.thisMember.loggedInMember = o;
	}

	return m;
}(bcbsnc));bcbsnc.thisMember.policies = (function (c) {
	var p = {}, m = {}, pKey = '', pKeys = [], mKey = '', mKeys = [], dependents = [], val = c.parse.string, valBool = c.parse.boolean, valNum = c.parse.number;

	dependents = [],
		mSelectOptions = [],
		pKey = 'policy0';
	pKeys.push(pKey);
	p[pKey] = new c.classLibrary.policy({
		key : pKey,
		index : val('0'),
		defaultPolicy : valBool('true'),
		accountNumber : val('300798972'),
		accountStatusCode : val('A'),
		accountType : val('10'),
		alphaPrefix : val('YPD'),
		changeContactExclusion : val('false'),
		companyNumber : val('03'),
		effectiveDate : val('01/01/2014'),
		expirationDate : val('12/31/2014'),
		externalID : val('YPDW1337944651'),
		grandfatherFlag : valBool('GF'),
		groupName : val('BLUE OPTIONS HSA'),
		groupNumber	: val('IHSA01'),
		hraPortal : valBool(''),
//SM3007	hsaPortal : valBool(''),
//SM3007	hsaPortalI : valBool('true'),
		fundPortal : val('HealthEquity'),	//SM3007
		hsaExternalID : val(''),
		hsaBalance : val(''),
		hsaTimestamp : val(''),
		hsaError : val(''),
		isActive : valBool('true'),
		isGroup	: valBool('false'),
		isIndividual : valBool('true'),
		isListBill : valBool('false'),
//		lobCode	: val('PDP'),
		lobCode	: val('ISHA'),
		lobName : val('Blue Options HSA'),
		updateContact : valBool('true'),
		isState : valBool('false'),
		isDental : valBool('true'),
		dentalWaitingPrdEffDateString : val(''),
		dentalWaitingPrdExpDateString : val(''),
		isMedical : valBool('true'),
		isHRA : valBool('false'),
		isHSA : valBool('true'),
		hasPharmacy : valBool('true'),
		hasNCHC : valBool('$loggedInMember.hasPolicyAccess($p.index,"NC_HEALTHCHOICE")'),
		memberGuideAvailable : valBool('false'),
		onExchange : valBool('false'),
		sourceSystem : val('P'),
		troop : valBool('false'),
		transitional : valBool('false'),
		vbbBlueRewardProgram : valBool('true'),
		memberCount : 0,
		memberKeys : []
	});

	mSelectOptions.push({ name : 'All Covered Members', value : 'ALL' });

	mKey = 'member' + 0;
	mKeys.push(mKey);
	p[pKey].members[mKey] = new c.classLibrary.policyMember({
		active : valBool('false'),
		benefitPackageCode : val('A498'),
		billingExclusion : valBool('false'),
		confCommActive : valBool('false'),
		memberNumber : val('51'),
		effectiveDate : val('01/01/2014'),
		expirationDate : val('12/31/2014'),
		relationship : val('SELF')
	}, c.thisMember.members[mKey]);
	p[pKey].memberKeys.push(mKey);
	if (p[pKey].members[mKey].isSubscriber){
		p[pKey].subscriber = p[pKey].members[mKey];
	}
	if (!p[pKey].members[mKey].isSubscriber) {
		dependents.push(p[pKey].members[mKey]);
	}
	mSelectOptions.push({ name : p[pKey].members[mKey].displayName, value : p[pKey].members[mKey].key });

	mKey = 'member' + 1;
	mKeys.push(mKey);
	p[pKey].members[mKey] = new c.classLibrary.policyMember({
		active : valBool('false'),
		benefitPackageCode : val('A526'),
		billingExclusion : valBool('false'),
		confCommActive : valBool('false'),
		memberNumber : val('52'),
		effectiveDate : val('01/01/2014'),
		expirationDate : val('12/31/2014'),
		relationship : val('DEPENDENT')
	}, c.thisMember.members[mKey]);
	p[pKey].memberKeys.push(mKey);
	if (p[pKey].members[mKey].isSubscriber){
		p[pKey].subscriber = p[pKey].members[mKey];
	}
	if (!p[pKey].members[mKey].isSubscriber) {
		dependents.push(p[pKey].members[mKey]);
	}
	mSelectOptions.push({ name : p[pKey].members[mKey].displayName, value : p[pKey].members[mKey].key });

	p[pKey].memberSelectOptions = mSelectOptions;
	p[pKey].dependents = dependents;
	p[pKey].memberCount = p[pKey].memberKeys.length;
	p[pKey].hasDependents = p[pKey].dependents.length > 0;
	p[pKey].claimsHelper = new c.classLibrary.claimsHelper(p[pKey]);
	p[pKey].benefitsHelper = new c.classLibrary.benefitsHelper(p[pKey]);
	p[pKey].accountStatusHelper = new c.classLibrary.accountStatusHelper(p[pKey]);
	p[pKey].addressHelper = new c.classLibrary.addressHelper(p[pKey]);
	p[pKey].primaryCareProviderHelper = new c.classLibrary.primaryCareProviderHelper(p[pKey]);
	p[pKey].hraBalanceHelper = new c.classLibrary.hraBalanceHelper(p[pKey]);
	p[pKey].hsaBalanceHelper = new c.classLibrary.hsaBalanceHelper(p[pKey]);
	p[pKey].heqHSABalanceHelper = new c.classLibrary.heqHSABalanceHelper(p[pKey]);
	c.thisMember.selectedPolicyKey = pKey;
	c.thisMember.selectedPolicy = p[pKey];

	dependents = [],
		mSelectOptions = [],
		pKey = 'policy1';
	pKeys.push(pKey);
	p[pKey] = new c.classLibrary.policy({
		key : pKey,
		index : val('1'),
		defaultPolicy : valBool('false'),
		accountNumber : val('300798972'),
		accountStatusCode : val('A'),
		accountType : val('10'),
		alphaPrefix : val('YPD'),
		changeContactExclusion : val('false'),
		companyNumber : val('03'),
		effectiveDate : val('08/01/2013'),
		expirationDate : val('12/31/2013'),
		externalID : val('YPDW1337944651'),
		grandfatherFlag : valBool('GF'),
		groupName : val('BLUE OPTIONS HSA'),
		groupNumber	: val('IHSA01'),
		hraPortal : valBool(''),
//SM3007	hsaPortal : valBool(''),
//SM3007	hsaPortalI : valBool('true'),
		fundPortal : val(''),	//SM3007
		hsaExternalID : val(''),
		hsaBalance : val(''),
		hsaTimestamp : val(''),
		hsaError : val(''),
		isActive : valBool('false'),
		isGroup	: valBool('false'),
		isIndividual : valBool('true'),
		isListBill : valBool('false'),
		lobCode	: val('IHSA'),
		lobName : val('Blue Options HSA'),
		updateContact : valBool('false'),
		isState : valBool('false'),
		isDental : valBool('false'),
		dentalWaitingPrdEffDateString : val(''),
		dentalWaitingPrdExpDateString : val(''),
		isMedical : valBool('true'),
		isHRA : valBool('false'),
		isHSA : valBool('true'),
		hasPharmacy : valBool('true'),
		hasNCHC : valBool('$loggedInMember.hasPolicyAccess($p.index,"NC_HEALTHCHOICE")'),
		memberGuideAvailable : valBool('false'),
		onExchange : valBool('false'),
		sourceSystem : val('P'),
		troop : valBool('false'),
		transitional : valBool('false'),
		vbbBlueRewardProgram : valBool('true'),
		memberCount : 0,
		memberKeys : []
	});

	mSelectOptions.push({ name : 'All Covered Members', value : 'ALL' });

	mKey = 'member' + 0;
	mKeys.push(mKey);
	p[pKey].members[mKey] = new c.classLibrary.policyMember({
		active : valBool('false'),
		benefitPackageCode : val('A498'),
		billingExclusion : valBool('false'),
		confCommActive : valBool('false'),
		memberNumber : val('51'),
		effectiveDate : val('08/01/2013'),
		expirationDate : val('12/31/2013'),
		relationship : val('SELF')
	}, c.thisMember.members[mKey]);
	p[pKey].memberKeys.push(mKey);
	if (p[pKey].members[mKey].isSubscriber){
		p[pKey].subscriber = p[pKey].members[mKey];
	}
	if (!p[pKey].members[mKey].isSubscriber) {
		dependents.push(p[pKey].members[mKey]);
	}
	mSelectOptions.push({ name : p[pKey].members[mKey].displayName, value : p[pKey].members[mKey].key });

	mKey = 'member' + 1;
	mKeys.push(mKey);
	p[pKey].members[mKey] = new c.classLibrary.policyMember({
		active : valBool('false'),
		benefitPackageCode : val('A526'),
		billingExclusion : valBool('false'),
		confCommActive : valBool('false'),
		memberNumber : val('52'),
		effectiveDate : val('08/01/2013'),
		expirationDate : val('12/31/2013'),
		relationship : val('DEPENDENT')
	}, c.thisMember.members[mKey]);
	p[pKey].memberKeys.push(mKey);
	if (p[pKey].members[mKey].isSubscriber){
		p[pKey].subscriber = p[pKey].members[mKey];
	}
	if (!p[pKey].members[mKey].isSubscriber) {
		dependents.push(p[pKey].members[mKey]);
	}
	mSelectOptions.push({ name : p[pKey].members[mKey].displayName, value : p[pKey].members[mKey].key });

	p[pKey].memberSelectOptions = mSelectOptions;
	p[pKey].dependents = dependents;
	p[pKey].memberCount = p[pKey].memberKeys.length;
	p[pKey].hasDependents = p[pKey].dependents.length > 0;
	p[pKey].claimsHelper = new c.classLibrary.claimsHelper(p[pKey]);
	p[pKey].benefitsHelper = new c.classLibrary.benefitsHelper(p[pKey]);
	p[pKey].accountStatusHelper = new c.classLibrary.accountStatusHelper(p[pKey]);
	p[pKey].addressHelper = new c.classLibrary.addressHelper(p[pKey]);
	p[pKey].primaryCareProviderHelper = new c.classLibrary.primaryCareProviderHelper(p[pKey]);
	p[pKey].hraBalanceHelper = new c.classLibrary.hraBalanceHelper(p[pKey]);
	p[pKey].hsaBalanceHelper = new c.classLibrary.hsaBalanceHelper(p[pKey]);
	p[pKey].heqHSABalanceHelper = new c.classLibrary.heqHSABalanceHelper(p[pKey]);

	dependents = [],
		mSelectOptions = [],
		pKey = 'policy2';
	pKeys.push(pKey);
	p[pKey] = new c.classLibrary.policy({
		key : pKey,
		index : val('2'),
		defaultPolicy : valBool('false'),
		accountNumber : val('300798972'),
		accountStatusCode : val('A'),
		accountType : val('10'),
		alphaPrefix : val('YPD'),
		changeContactExclusion : val('false'),
		companyNumber : val('03'),
		effectiveDate : val('01/01/2013'),
		expirationDate : val('07/31/2013'),
		externalID : val('YPDW1337944651'),
		grandfatherFlag : valBool('GF'),
		groupName : val('BLUE OPTIONS HSA'),
		groupNumber	: val('IHSA01'),
		hraPortal : valBool(''),
//SM3007	hsaPortal : valBool(''),
//SM3007	hsaPortalI : valBool('true'),
		fundPortal : val(''),	//SM3007
		hsaExternalID : val(''),
		hsaBalance : val(''),
		hsaTimestamp : val(''),
		hsaError : val(''),
		isActive : valBool('false'),
		isGroup	: valBool('false'),
		isIndividual : valBool('true'),
		isListBill : valBool('false'),
		lobCode	: val('IHSA'),
		lobName : val('Blue Options HSA'),
		updateContact : valBool('false'),
		isState : valBool('false'),
		isDental : valBool('false'),
		dentalWaitingPrdEffDateString : val(''),
		dentalWaitingPrdExpDateString : val(''),
		isMedical : valBool('true'),
		isHRA : valBool('false'),
		isHSA : valBool('true'),
		hasPharmacy : valBool('true'),
		hasNCHC : valBool('$loggedInMember.hasPolicyAccess($p.index,"NC_HEALTHCHOICE")'),
		memberGuideAvailable : valBool('false'),
		onExchange : valBool('false'),
		sourceSystem : val('P'),
		troop : valBool('false'),
		transitional : valBool('false'),
		vbbBlueRewardProgram : valBool('true'),
		memberCount : 0,
		memberKeys : []
	});

	mSelectOptions.push({ name : 'All Covered Members', value : 'ALL' });

	mKey = 'member' + 0;
	mKeys.push(mKey);
	p[pKey].members[mKey] = new c.classLibrary.policyMember({
		active : valBool('false'),
		benefitPackageCode : val('A458'),
		billingExclusion : valBool('false'),
		confCommActive : valBool('false'),
		memberNumber : val('51'),
		effectiveDate : val('01/01/2013'),
		expirationDate : val('07/31/2013'),
		relationship : val('SELF')
	}, c.thisMember.members[mKey]);
	p[pKey].memberKeys.push(mKey);
	if (p[pKey].members[mKey].isSubscriber){
		p[pKey].subscriber = p[pKey].members[mKey];
	}
	if (!p[pKey].members[mKey].isSubscriber) {
		dependents.push(p[pKey].members[mKey]);
	}
	mSelectOptions.push({ name : p[pKey].members[mKey].displayName, value : p[pKey].members[mKey].key });

	p[pKey].memberSelectOptions = mSelectOptions;
	p[pKey].dependents = dependents;
	p[pKey].memberCount = p[pKey].memberKeys.length;
	p[pKey].hasDependents = p[pKey].dependents.length > 0;
	p[pKey].claimsHelper = new c.classLibrary.claimsHelper(p[pKey]);
	p[pKey].benefitsHelper = new c.classLibrary.benefitsHelper(p[pKey]);
	p[pKey].accountStatusHelper = new c.classLibrary.accountStatusHelper(p[pKey]);
	p[pKey].addressHelper = new c.classLibrary.addressHelper(p[pKey]);
	p[pKey].primaryCareProviderHelper = new c.classLibrary.primaryCareProviderHelper(p[pKey]);
	p[pKey].hraBalanceHelper = new c.classLibrary.hraBalanceHelper(p[pKey]);
	p[pKey].hsaBalanceHelper = new c.classLibrary.hsaBalanceHelper(p[pKey]);
	p[pKey].heqHSABalanceHelper = new c.classLibrary.heqHSABalanceHelper(p[pKey]);

	c.thisMember.policyKeys = pKeys;
	c.thisMember.policyCount = pKeys.length;
	return p;
}(bcbsnc));
bcbsnc.thisMember.policySelect = (function(c, jQuery){

	var policySelect = {},
		claimsOptions = [],
		benefitsOptions = [],
		accountOptions = [],
		claimsNames = [];

	var policyOption = function(key, externalID, startDate, endDate) {
		var name = '',
			startDate = formatDate(startDate),
			endDate = formatDate(endDate);

		if (startDate == '12/31/2999') {
			name = externalID;
		} else {
			name = externalID + ' (' + startDate + ' - ' + endDate + ')';
		}

		return {
			name : name,
			value : key,
			startDate : startDate,
			endDate : endDate
		}
	};

	var formatDate = function(date) {
		return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
	};

	var sameYear = function(policyA, policyB) {
		if (policyA.policyYear == policyB.effectiveDateYear) return true;
		if (policyA.policyYear == policyB.expirationDateYear) return true;
		return false;
	};

	var setCombinedClaimsPolicyKeys = function(policy) {
		if (policy.displayClaimsByYear) {
			policy.combinedClaimsPolicyKeys = [];

			for (var i = 0; i < c.thisMember.policyCount; i++) {
				var pKey = c.thisMember.policyKeys[i],
					p = c.thisMember.policies[pKey];

				if (p.externalID == policy.externalID  &&  sameYear(policy,p)) {
					policy.combinedClaimsPolicyKeys.push(p.key);
				}
			}
		}
	};

	for (var i=0; i < c.thisMember.policyCount; i++) {
		var pKey = c.thisMember.policyKeys[i],
			p = c.thisMember.policies[pKey];

		setCombinedClaimsPolicyKeys(p);

		if (!p.isDental && !p.futurePolicy) {
			var option = new policyOption(p.key, p.externalID, p.claimsStartDate, p.claimsEndDate);

			if (jQuery.inArray(option.name, claimsNames) == -1) {
				claimsOptions.push(option);
				claimsNames.push(option.name);
			}
		}

		if (p.isMedical) {
			benefitsOptions.push(new policyOption(p.key, p.externalID, p.effectiveDate, p.expirationDate));
		}

		accountOptions.push(new policyOption(p.key, p.externalID, p.effectiveDate, p.expirationDate));

	}

	policySelect.populatePolicySelect = function(selectId, options) {
		jQuery.each(bcbsnc.thisMember.policySelect[options], function(i, option) {
			jQuery('#' + selectId).append('<option value="' + option.value + '">' + option.name + '</option>');
		});
	};

	policySelect.claimsOptions = claimsOptions;
	policySelect.benefitsOptions = benefitsOptions;
	policySelect.accountOptions = accountOptions;
	return policySelect;

}(bcbsnc, jQuery));bcbsnc.analytics = (function(c){
	return {
		isState	: c.thisMember.selectedPolicy.isState,
		isGroup	: c.thisMember.selectedPolicy.isGroup,
		isActive : c.thisMember.selectedPolicy.isActive,
		isIndividual : c.thisMember.selectedPolicy.isIndividual,
		lobCode : c.thisMember.selectedPolicy.lobCode,
		groupName : c.thisMember.selectedPolicy.groupName,
		groupNumber : c.thisMember.selectedPolicy.groupNumber,
		relationship : c.vdata.relationship,
		age : c.vdata.age,
		gender : c.vdata.gender,
		birthDate : c.vdata.birthDate,
		isDemo : false
	};
}(bcbsnc)) || {};var bcbsnc = (function (c) {
	var services = {},
		documents = {},
		config = {},
		cache = {},
		cacheInit = function() {
			cache.accountStatus = {};
			cache.hsaBalance = {};
			cache.heqHSABalance = {}, //SM3007
			cache.hraBalance = {},
			cache.policies = {},
			cache.claims = {},
			cache.benefits = {},
			cache.rates = {},
			cache.address = {},
			cache.eob = {},
			cache.bb = {};
			cache.ucd = {};
			cache.benefitBooklet = {};
			cache.voc = {};
			cache.ssnInfo = {};
			cache.tnrToken = {};
			cache.pcpList = {};
		},
		promisedCachedServiceCall = function(cacheObject, cacheKey, serviceUrl, serviceData, serviceType) {
			var dfd = jQuery.Deferred();
			if (typeof cacheObject[cacheKey] !== 'undefined') {
				dfd.resolve(cacheObject[cacheKey]);
			} else {
				jQuery.ajax({
					success : function(data) { cacheObject[cacheKey] = data; dfd.resolve(data); },
					type : serviceType,
					url : serviceUrl,
					data : serviceData,
					dataType : 'json'
				});
			}
			return dfd.promise();
		},
		promisedCachedServiceCallWithCred = function(cacheObject, cacheKey, serviceUrl, serviceData, serviceType) {
			var dfd = jQuery.Deferred();
			if (typeof cacheObject[cacheKey] !== 'undefined') {
				dfd.resolve(cacheObject[cacheKey]);
			} else {
				jQuery.support.cors = true;
				jQuery.ajax({
					success : function(data) { cacheObject[cacheKey] = data; dfd.resolve(data); },
					error : function (xhr, ajaxOptions, thrownError) { cacheObject[cacheKey] = null; dfd.resolve(null); },
					type : serviceType,
					url : serviceUrl,
					xhrFields: {
						withCredentials: true
					},
					data : serviceData,
					dataType : 'application/json'
				});
			}
			return dfd.promise();
		},
		promisedServiceCall = function(serviceUrl, serviceData, serviceType) {
			var dfd = jQuery.Deferred();
			jQuery.ajax({
				success : function(data) { dfd.resolve(data); },
				type : serviceType,
				url : serviceUrl,
				data : serviceData,
				dataType : 'json'
			});
			return dfd.promise();
		};

	cacheInit();

	var getRateQuoteDataFromMemberData = function(data, income, members){
		var i = 0,
			length = data.policies.length,
			members,
			membersLength = 0,
			zipcode = parseInt(c.thisMember.address.zip, 10),
			dependentIncrementer = 1,
			d = {
				zipCode: zipcode,
				houseHoldIncome: income,
				numberOfPeopleInHouseHold: members,
				spouseDOB : '',
				spouseGender : '',
				includeSpouse: false,
				includeChildren: false,
				includeDentalQuote: false,
				includeMaternityQuote: false,
				quoteDate : '01/01/2014'
			};

		d.countyOfResidence = bcbsnc.forms.NCZipCodes.getCounties(c.thisMember.address.zip)[0];

		for (i; i < length; i += 1) {
			if (data.policies[i].policyKey === bcbsnc.thisPolicy.policyKey) {
				members = data.policies[i].members;
				membersLength = members.length;
				break;
			}
		}

		for (i = 0; i < membersLength; i += 1) {
			if (members[i].relationship === 'SELF') {
				d.applicantDOB = members[i].birthDate;
			}
			if (members[i].relationship === 'SPOUSE') {
				d.spouseDOB = members[i].birthDate;
				d.spouseGender = members[i].gender;
				d.includeSpouse = true;
			}
			if (members[i].relationship === 'DEPENDENT') {
				d['dependentDOB' + dependentIncrementer] = members[i].birthDate;
				d.includeChildren = true;
				dependentIncrementer += 1;
			}
		}
		return d;
	};

	config.forgotPasswordQuestionUrl	= '/members/services/Register/getForgotPasswordQuestion';
	config.planRatesUrl					= '/assets/shopper/public/quote/services/plans-data-min.json';
	config.membersDataUrl				= '/members/services/Account/getLoggedInMembers';
	config.claimsDataUrl				= 'mocks/claims/getClaimsForAllAccessibleMembers.json';
	config.benefitsDataUrl				= 'mocks/benefits/benefits-hsa-hra.json';
	config.hsaDataUrl					= 'mocks/mellonHSA/getHSABalance.json';
//	config.hraDataUrl					= '/members/services/jsonHeq/getHRAAcctBalance';
	config.heqHSADataUrl				= 'mocks/fund-balance/getHSAAcctBalances.json';
	config.hraDataUrl					= 'mocks/fund-balance/getHRAAcctBalance.json';
    //config.hraDataUrl					= 'mocks/fund-balance/getHSAAcctBalancesError.json';
	config.benefitsBookletDataUrl		= '/members/services/OVBenefits/getMemberBenefitBooklet';
	config.accountStatusUrl				= 'mocks/account-status/getMemberAccountStatus-3.json';
	config.createServiceRequestUrl		= '/members/services/CreateSR/createServiceRequest';
	config.ssoBreakLinkUrl				= '/members/services/SSO/breakLink';
	config.ssoGetIDsUrl					= 'mocks/sso/sso-empty.json';
	config.ssoLinkUrl					= '/members/services/SSO/linkAccounts';
	config.eobUrl						= '/members/services/DocumentService/getEOBDocument';
	config.bluemapMemberQuoteUrl		= '/sapps/bluemap/services/member/quote';
	config.bluemapProspectQuoteUrl		= '/sapps/bluemap/services/prospect/quote';
	config.rateQuoteUrl					= '/sapps/shopperservices/guidedselling/RetrieveRatesJson.do';

	/* New for NCTIO */
	config.addPolicyUrl					= '/members/services/PolicyService/addPolicy';
	config.requestIdCardUrl				= '/members/services/RequestIDService/newOrderIdCard';
	config.verifyCoverageUrl			= '/members/services/VerifyCoverage/verifyCoverage';
	config.addressUrl					= '/members/services/Address/getAddress';
	/* Document Services */
	config.legacyEOBUrl					= '/sapps/members/ViewEOB.do';
	config.eobUrl						= '/members/services/DocumentService/getEOBDocument';
	config.bbUrl						= '/members/services/DocumentService/getBBDocument';
	config.ucdUrl						= '/members/services/DocumentService/getUCDDocument';
	config.documentUrl					= '/members/services/DocumentService/getDocument';


	var demoServiceRoot = '/members/demo-services/',
		demoMode = false;
	function demoServiceURL(folder) {
		return demoServiceRoot + folder + '/' + lobName.split(' ').join('_') + '.json';
		/*if(folder == 'member' || folder == 'hsa') {
		 return demoServiceRoot + folder + '/' + lobName.split(' ').join('_') + '.json';
		 } else {
		 return demoServiceRoot + folder + '/' + lobName.split(' ').join('_') + '_' + getSelectedPolicyYear() + '.json';
		 }*/
	}

	/* Over-rides for Demo Mode */
	if (demoMode) {
		config.membersDataUrl	= demoServiceURL('member');
//		config.claimsDataUrl	= demoServiceURL('claims');
		config.claimsDataUrl	= 'benefits/getMemberBenefitPackage-hsa.json';
//		config.benefitsDataUrl	= demoServiceURL('benefits');
		config.benefitsDataUrl	= 'benefits/getMemberBenefitPackage-hsa.json';
		config.hsaDataUrl		= demoServiceURL('hsa');
		config.eobUrl			= '/assets/members/public/pdf/demosite/eob.pdf';
	}



	services.getPlanRates = function() {
		return promisedCachedServiceCall(ratesCache, 'rates', config.planRatesUrl, {}, 'GET');
	};
	services.getPlanRate = function(planCode) {
		var dfd = jQuery.Deferred();
		services.getPlanRates().done(function(data) {
			jQuery.each(data, function(i, item) {
				if (item.planCode == planCode) { dfd.resolve(item); }
			});
		});
		return dfd.promise();
	};


	/* Secure Services */
	services.requestIdCard = function(memberIndexArray, policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		/* memberID is a comma delimited list of memberIndex */
		var m = memberIndexArray || [bcbsnc.thisMember.index];
		return jQuery.post(config.requestIdCardUrl, { 'policyIndex': p.index, 'memberID': m.join() });
	}

	/* pageSource options for Service Request = benefits, requestid, claims, accountinformation */
	services.createServiceRequest = function(pageSource, index){
		var o = {
			memberIndex: c.thisMember.index,
			policyIndex: index || c.thisMember.selectedPolicy.index,
			pageSource: pageSource,
			notes : ''
		};
		jQuery.post(config.createServiceRequestUrl, o);
	};

	services.addPolicy = function(data) {
		return promisedServiceCall(config.addPolicyUrl, data, 'POST');
	};

	services.getVerifyCoverage = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.voc, p.key, config.verifyCoverageUrl, { 'policyIndex' : p.index  }, 'POST');
	};

	services.getSSOIDs = function(callBack) {
		jQuery.getJSON(config.ssoGetIDsUrl, {}, getSSOIdsHandler);

        function getSSOIdsHandler(data){
            callBack(data);
        }
	};

	services.getAllowedInboundSSOVendors = function(){
		if (bcbsnc.thisMember.selectedPolicy.isState){
			return [ "benefitfocus" ];
		} else {
			return [ "benefitfocus", "BuckRightOpt", "RAI", "BBT", "Mercer" ];
		}
  };

	services.getThompsonReutersToken = function(policy, formType) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		cache.tnrToken = {};
		return promisedCachedServiceCallWithCred(cache.tnrToken, p.key, ((bcbsnc.demo.demoMode) ? demoServiceURL('tnrToken') : config.thompsonReutersTokenUrl),
			{'id' : p.externalID, 'form' : formType, 'date': p.effectiveDateString.replace(/\//g,'_') }, 'GET');
	};

	services.getSsnInfo = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCallWithCred(cache.ssnInfo, p.key, ((bcbsnc.demo.demoMode) ? demoServiceURL('ssnInfo') : config.ssnInfoUrl),
			{ 'id' : p.externalID, 'date': p.effectiveDateString.replace(/\//g,'_') }, 'GET');
	};

	services.isValidTRNMember = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		var retval = false;
		if(bcbsnc.thisMember.isSubscriber && p.isMedical &&
			((!p.onExchange && !p.isGroup) || (!p.isASO || p.isSourceSystemTopaz))) {

			retval = true;
		}
		return retval;
	};

	services.canViewTNRAccounts = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		var retval = false;
		if(services.isValidTRNMember(p)) {
			services.getSsnInfo(bcbsnc.thisMember.selectedPolicy).done(function(data) {
				if(data) {
					var externalID = bcbsnc.thisMember.selectedPolicy.externalID;
					if (data.CustomerID) {
						if (externalID.indexOf(data.CustomerID, externalID.length - data.CustomerID.length) !== -1) {
							retval = true;

							if(location.pathname == '/members/secure/account/index.htm'){
								$('.accountOverviewValidTRN').show();
							}
							else {
								$('.accountSubpageValidTRN').show();

							}
						}
					}
				}
			});
		}
		return retval;
	};

	services.getInboundSSOIDs = function(callback){
		//mock implementation of actual, returns array of approved vendors with vendor sso ID included, i.e:
		//[
		//	{"ssoID":"74941901643", "vendorName": "AonHewitt"},
		//	{"ssoID":"63b6f64a-a3af-4cc0-8134-e24c175d450f" , "vendorName": "VITALS"}
		//]
		var defer = jQuery.Deferred();

		//toggle to enable SSO lightbox
		defer.resolve([]);

//		defer.resolve([
//			{"ssoID": "123ABC", "vendorName": "BBT"}
//		]);
		return defer.promise();
	};

	services.unlinkSSOID = function(ssoID, callBack) {
		jQuery.post(config.ssoBreakLinkUrl, {"SSOIdentifier":ssoID}, function(data) { callBack(data); });
	};

	services.linkSSOID = function(ssoID, callBack) {
		jQuery.post(config.ssoLinkUrl, {"SSOIdentifier":ssoID}, function(data) { callBack(data); });
	};

	services.getPolicies = function() {
		return promisedCachedServiceCall(cache.policies, 'YPDW1337944651', config.membersDataUrl, {}, 'GET');
	};

	services.getAddress = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.address, p.key, config.addressUrl, { 'policyIndex' : p.index  }, 'POST');
	};

	services.getHSABalance = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.hsaBalance, p.key, config.hsaDataUrl, { 'policyIndex' : p.index  }, 'GET');
	};

	//SM3007 - start
	services.getHEQHSABalance = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.heqHSABalance, p.key, config.hraDataUrl, { 'policyIndex' : p.index }, 'GET');
	};
	//SM3007 - end

	services.getHRABalance = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.hraBalance, p.key, config.hraDataUrl, { 'policyIndex' : p.index }, 'GET');
	};

	services.configureHeqSso = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedServiceCall(config.configureHeqSsoUrl, { 'policyIndex' : p.index }, 'POST');
	};

	services.getAccountStatus = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy,
			dfd = jQuery.Deferred(),
			demoMode = true;

		/**
		 * Gets testing and demo data to help test layout of tile data.
		 *
		 * @param {Integer} uid - unique id appended to file names after last dash, but
		 * before dot preceding the .json file extension found in:
		 * *app/mocks/account-status*
		 *
		 * @returns {object} - JSON formatted object.
		 */
		function loadTestData(uid) {
            jQuery.ajax({type : 'GET',
                dataType : 'json',
                url: 'mocks/account-status/getMemberAccountStatus-7.json',
                async:false,
                cache : false,
                success : function(data) {
                    return dfd.resolve(data);
                }
            });
            return dfd.promise();
		}

		if (demoMode) {
			return dfd.resolve(loadTestData(7));
		} else {
			return promisedCachedServiceCall(cache.accountStatus, p.key, config.accountStatusUrl, { 'policyIndex': p.index }, 'GET');
		}
	};

	services.getClaims = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.claims, p.key, config.claimsDataUrl, { 'policyIndex' : p.index }, 'GET');
	};

	services.getBenefits = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.benefits, p.key, config.benefitsDataUrl, { 'policyIndex': p.index }, 'GET');
	};

	services.getPCPList = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.pcpList, p.key, config.getPCPListUrl, { 'policyIndex': p.index }, 'POST');
	};

	services.getRateQuote = function(householdIncome, householdMembers) {
		var dfd = jQuery.Deferred();

		services.getPolicies().done(function(data) {

			var d = getRateQuoteDataFromMemberData(data, householdIncome, householdMembers);

			promisedServiceCall(config.rateQuoteUrl, d, 'POST').done(function(data) {
				dfd.resolve(data);
			});
		});
		return dfd.promise();
	};

	services.getBluemapMemberQuote = function(householdIncome, householdMembers) {
		var data = {
			memberIdHash : memberIdHash,
			memberid : memberID,
			hhincome : householdIncome,
			taxreturnfmlyno : householdMembers
		};

		return promisedServiceCall(config.bluemapMemberQuoteUrl, data, 'POST');
	};

	services.getBluemapProspectQuote = function(householdIncome, householdMembers) {

		var dfd = jQuery.Deferred();
		services.getPolicies().done(function(data) {
			var i = 0,
				length = data.policies.length,
				members,
				membersLength = 0,
				zipcode = parseInt(bcbsnc.thisMember.address.zip, 10),
				dependentIncrementer = 1,
				prospect = {
					dobPrimary: '',
					zipcode: zipcode,
					county: '',
					tobaccousagePrimary: '',
					dobSpouse: '',
					tobaccoUsageSpouse: '',
					dep1dob: '',
					dep1tobaccoUsage: '',
					dep2dob: '',
					dep2tobaccoUsage: '',
					dep3dob: '',
					dep3tobaccoUsage: '',
					dep4dob: '',
					dep4tobaccoUsage: '',
					dep5dob: '',
					dep5tobaccoUsage: '',
					dep6dob: '',
					dep6tobaccoUsage: '',
					familyhealth: 1,
					hhincome: householdIncome,
					taxreturnfmlyno: householdMembers
				};

			prospect.county = bcbsnc.forms.NCZipCodes.getCountyCode(prospect.zipcode);

			for (i; i < length; i += 1) {
				if (data.policies[i].policyKey === bcbsnc.thisPolicy.policyKey) {
					members = data.policies[i].members;
					membersLength = members.length;
					break;
				}
			}

			for (i = 0; i < membersLength; i += 1) {
				if (members[i].relationship === 'SELF') {
					prospect.dobPrimary = members[i].birthDate.replace(/\//g, '');
					prospect.tobaccousagePrimary = false;
				}

				if (members[i].relationship === 'SPOUSE') {
					prospect.dopSpouse = members[i].birthDate.replace(/\//g, '');
					prospect.tobaccoUsageSpouse = false;
				}

				if (members[i].relationship === 'DEPENDENT') {
					prospect['dep' + dependentIncrementer + 'dob'] = members[i].birthDate.replace(/\//g, '');
					prospect['dep' + dependentIncrementer + 'tobaccoUsage'] = false;
					dependentIncrementer += 1;
				}
			}

			promisedServiceCall(config.bluemapProspectQuoteUrl, prospect, 'POST').done(function(data) {
				dfd.resolve(data);
			});
		});
		return dfd.promise();
	};

	documents.getEOB = function(claimId, policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.eob, p.key + '_' + claimId , config.eobUrl, { 'policyIndex' : p.index, 'claimId' : claimId  }, 'POST');
	};

	documents.getBB = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.bb, p.key , config.bbUrl, { 'policyIndex' : p.index  }, 'POST');
	};

	documents.getUCD = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.ucd, p.key , config.ucdUrl, { 'policyIndex' : p.index  }, 'POST');
	};

	/* legecy Benefit Booklet Service */
	services.getBenefitBooklet = function(policy) {
		var p = policy || bcbsnc.thisMember.selectedPolicy;
		return promisedCachedServiceCall(cache.benefitBooklet, p.key , config.benefitsBookletDataUrl, { 'policyKey' : p.lagacyPolicyKey  }, 'POST');
	};

	services.clearCache = function() {
		cacheInit();
	};


	services.config = config;
	services.documents = documents;
	c.services = services;

	return c;

}(bcbsnc || {}));function bcbsncController($scope) {
	var safeApply = function(scope) {
		if(!scope.$$phase) {
			scope.$apply();
		}
	};
	$scope.bcbsnc = bcbsnc;

	$scope.selectPolicy = function() {
		bcbsnc.thisMember.selectPolicy(bcbsnc.thisMember.selectedPolicyKey);
		safeApply($scope);
	};

	$scope.selectMember = function() {
		bcbsnc.thisMember.selectMember(bcbsnc.thisMember.selectedMemberKey);
		safeApply($scope);
	};

	$scope.loadAccountStatus = function() {
		bcbsnc.thisMember.selectedPolicy.accountStatusHelper.load().done(function() {
			safeApply($scope);
			setAccountStatusMessages(bcbsnc.thisMember.selectedPolicy.accountStatus);
		});
	};

	$scope.loadAddress = function() {
		bcbsnc.thisMember.selectedPolicy.addressHelper.load().done(function() {
			safeApply($scope);
		});
	};

	$scope.loadHraBalance = function() {
		if(bcbsnc.thisMember.selectedPolicy.canManageHeqHRA){
			bcbsnc.thisMember.selectedPolicy.hraBalanceHelper.load().done(function() {
				safeApply($scope);
			});
		}
	};

// SM3007 - start
	$scope.loadHEQHSABalance = function() {
		if(bcbsnc.thisMember.selectedPolicy.canManageHEQHSA){
			bcbsnc.thisMember.selectedPolicy.heqHSABalanceHelper.load().done(function() {
				safeApply($scope);
			});
		}
	};
// SM3007 - end

	$scope.loadHsaBalance = function() {
//SM3007		if(bcbsnc.thisMember.selectedPolicy.canManageHSA){
		if(bcbsnc.thisMember.selectedPolicy.canManageBWHSA){
			bcbsnc.thisMember.selectedPolicy.hsaBalanceHelper.load().done(function() {
				safeApply($scope);
			});
		}
	};

	$scope.loadClaims = function(policyIndex, claimID) {
		policyIndex = policyIndex || bcbsnc.thisMember.selectedPolicy.index;
		bcbsnc.thisMember.selectPolicy('policy' + policyIndex)
		bcbsnc.thisMember.selectedPolicy.claimsHelper.load().done(function() {
			bcbsnc.thisMember.selectedPolicy.selectClaim(claimID);
			safeApply($scope);
		});
	};

}
bcbsnc.utilities = (function(util,url){

	function getHiddenField(fieldName, fieldValue){
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("name", fieldName);
		hiddenField.setAttribute("value", fieldValue);
		hiddenField.setAttribute("type", "hidden");
		return hiddenField;
	}

	var hiddenForm = function(data) {
		this.form = document.createElement("form");
		this.form.setAttribute("method", "post");
		this.form.setAttribute("action", url);
		this.form.setAttribute("target", "_blank");

		for (var k in data) {
			this.form.appendChild(getHiddenField(k,data[k]));
		}
		document.body.appendChild(this.form);
	}

	hiddenForm.prototype.download = function() {
		this.form.submit();
	};

	util.document = hiddenForm;
	return util;

}(bcbsnc.utilities || {}, bcbsnc.services.config.documentUrl));bcbsnc.demo = (function (c) {
	var demo = {};

	demo.demoMode 			= false;
	demo.alereScreenShot	= '/members/demo-services/alere/Alere.htm';

	return demo;
}(bcbsnc));

bcbsnc.dashboard = {};
bcbsnc.dashboard.categories = [
		{
			"id": 0,
			"title": "Things You Should Know",
			"route": "things-you-should-know",
			"sortOrder": 0
		},
		{
			"id": 1,
			"title": "My Plan",
			"route": "my-plan",
			"sortOrder": 1
		},
		{
			"id": 2,
			"title": "Health Tools",
			"route": "health-tools",
			"sortOrder": 2
		},
		{
			"id":3,
			"title": "Wellness",
			"route": "wellness",
			"sortOrder": 3
		},
		{
			"id":4,
			"title": "Social Media",
			"route": "social-media",
			"sortOrder": 4
		}
]
;

bcbsnc.dashboard.topics = [
		{
			"id"        : 0,
			"title"     : "Things You Should Know - Placeholder Topic",
			"categories": [0]
		},
		{
			"id"            : 72,
			"title"         : "BlueLink",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "bluelink-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Understand the connection between the things you do every day and the goals you want to achieve.",
			"categories"    : [3]
		},
		{
			"id"            : 1,
			"title"         : "Measure Your Health",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthrisk-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Use screenings, assessments and challenges to gauge your health.",
			"categories"    : [3]
		},
		{
			"id"            : 2,
			"title"         : "Treatment Cost Estimator",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "estimator-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Find your estimated cost by treatment category.",
			"categories"    : [2]
		},
		{
			"id"            : 3,
			"title"         : "IMEM Campaign Tiles",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"  : "../images/topic-2.png",
			"imgAlt"        : "Image alt",
			"label"         : "This is the description text.",
			"categories"    : [0]
		},
		{
			"id"            : 4,
			"title"         : "Find a Drug",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "finddrug-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Search by brand or generic name and see what's covered.",
			"categories"    : [2]
		},
		{
			"id"            : 5,
			"title"         : "Find a Pharmacy",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "pharmacysearch-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Find specialty pharmacies and new low-cost alternatives.",
			"categories"    : [2]
		},
		{
			"id"            : 6,
			"title"         : "No-Cost Health Coach",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthcoaching-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Get confidential support.",
			"categories"    : [3]
		},
		{
			"id"            : 7,
			"title"         : "Health Encyclopedia",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthknowledge-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Look up your health conditions.",
			"categories"    : [3]
		},
		{
			"id"            : 8,
			"title"         : "Ask A Nurse",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrImgInactive": "../images/topic-3-hidden.png",
			"bgrClass"      : "healthlineblue-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Have a live conversation.",
			"categories"    : [3]
		},
		{
			"id"            : 9,
			"title"         : "Healthy Outcomes",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "alereportal-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Discover how to reach your wellness goals.",
			"categories"    : [3]
		},
		{
			"id"            : 10,
			"title"         : "Healthy Living Conversations",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthyliving-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Get ready for some healthy straight talk.",
			"categories"    : [3]
		},
		{
			"id"            : 11,
			"title"         : "Virtual Health Coach",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthprogram-topic",
			"imgAlt"        : "Image alt",
			"label"         : "We offer programs to help you live better.",
			"categories"    : [3]
		},
		{
			"id"            : 12,
			"title"         : "Health Seminars",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "monthlyseminar-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Take these fun seminars to learn more about your health.",
			"categories"    : [3]
		},
		{
			"id"            : 13,
			"title"         : "Maternity Program",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "maternity-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Get the information to ensure a healthy pregnancy.",
			"categories"    : [3]
		},
		{
			"id"            : 14,
			"title"         : "Your Health Record",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "healthrecord-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Gather all your medical info in one place online.",
			"categories"    : [3]
		},
		{
			"id"            : 15,
			"title"         : "Find a Doctor",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "finddoc-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Search for in-network providers in NC, the US or worldwide.",
			"categories"    : [2]
		},
		{
			"id"            : 16,
			"title"         : "Find Urgent Care",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "urgentcare-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Discover fast, quality care right in your neighborhood.",
			"categories"    : [2]
		},
		{
			"id"            : 17,
			"title"         : "Live Fearless",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "membernews-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Tips & Tools for reaching your health goals.",
			"categories"    : [4]
		},
		{
			"id"            : 18,
			"title"         : "BCBSNC Blog",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "blog-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Get news, CEO insight, recipes and info on people across the state.",
			"categories"    : [4]
		},
		{
			"id"            : 19,
			"title"         : "BCBSNC Twitter",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "twitter-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Get in-the-moment updates on the things that interest you.",
			"categories"    : [4]
		},
		{
			"id"            : 20,
			"title"         : "BCBSNC Facebook",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "facebook-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Connect to Blue Cross friends and members.",
			"categories"    : [4]
		},
		{
			"id"            : 21,
			"title"         : "BCBSNC Pinterest",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "pinterest-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Discover visual ideas for all your projects and interests.",
			"categories"    : [4]
		},
		{
			"id"            : 22,
			"title"         : "BCBSNC Google+",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "googleplus-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Share photos, send messages, and stay in touch.",
			"categories"    : [4]
		},
		{
			"id"            : 23,
			"title"         : "BCBSNC Youtube",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "youtube-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Share information and news through video.",
			"categories"    : [4]
		},
		{
			"id"            : 25,
			"title"         : "Find a Dentist",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "finddentist-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Look for licensed, in-network providers near you.",
			"categories"    : [2]
		},
		{
			"id"            : 26,
			"title"         : "Medical Benefits",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "medical-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Understand your costs and learn how to use your benefits.",
			"categories"    : [1]
		},
		{
			"id"            : 27,
			"title"         : "Dental Benefits",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "dental-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Find great tools, quizzes and videos in the Dental Resource Center.",
			"categories"    : [1]
		},
		{
			"id"            : 28,
			"title"         : "Prescription Benefits",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "prescription-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Learn how to get what you need and control your costs.",
			"categories"    : [1]
		},
		{
			"id"            : 29,
			"title"         : "Financial Tools",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "financial-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Tips and information to help you get the most value from your health plan.",
			"categories"    : [1]
		},
		{
			"id"            : 30,
			"title"         : "Help & FAQs",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "help-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Find answers to our members' most frequently asked questions.",
			"categories"    : [1]
		},
		{
			"id"            : 31,
			"title"         : "Dental Cost Estimator",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "costestimator-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Find your estimated dental cost by treatment category.",
			"categories"    : [2]
		},
		{
			"id"            : 32,
			"title"         : "Non-IMEM Campaign Tiles",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "",
			"imgAlt"        : "Image alt",
			"label"         : "This is the description text.",
			"categories"    : [0]
		},
		{
			"id"            : 33,
			"title"         : "Rx Cost Estimator",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "rxestimator-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Connect to drug cost estimator.",
			"categories"    : [2]
		},{
			"id"            : 34,
			"title"         : "Lets Talk Cost",
			"color"         : "gray-dark-bg",
			"style"         : "topic-item w2",
			"bgrClass"      : "letstalkcost-topic",
			"imgAlt"        : "Image alt",
			"label"         : "Learn what drives medical costs and share your ideas.",
			"categories"    : [4]
		},{
		"id"            : 35,
		"title"         : "Case Management",
		"color"         : "gray-dark-bg",
		"style"         : "topic-item w2",
		"bgrClass"      : "casemgmt-topic",
		"imgAlt"        : "Image alt",
		"label"         : "TBD.",
		"categories"    : [3]
		}			,{
		"id"            : 36,
		"title"         : "Disease Management",
		"color"         : "gray-dark-bg",
		"style"         : "topic-item w2",
		"bgrClass"      : "disease-topic",
		"imgAlt"        : "Image alt",
		"label"         : "TBD.",
		"categories"    : [3]
		}			,{
		"id"            : 37,
		"title"         : "Flu and Pneumonia Shots",
		"color"         : "gray-dark-bg",
		"style"         : "topic-item w2",
		"bgrClass"      : "flushot-topic",
		"imgAlt"        : "Image alt",
		"label"         : "TBD.",
		"categories"    : [3]
		}			,{
		"id"            : 38,
		"title"         : "Medication Therapy",
		"color"         : "gray-dark-bg",
		"style"         : "topic-item w2",
		"bgrClass"      : "medicationtherapy-topic",
		"imgAlt"        : "Image alt",
		"label"         : "TBD.",
		"categories"    : [3]
		}			,{
		"id"            : 39,
		"title"         : "Telephone Learning Center",
		"color"         : "gray-dark-bg",
		"style"         : "topic-item w2",
		"bgrClass"      : "telephone-topic",
		"imgAlt"        : "Image alt",
		"label"         : "TBD.",
		"categories"    : [3]
		}
	];
bcbsnc.dashboard.tiles = [
		{
			"id"       : 0,
			"title"    : "Billing",
			"displayTitle"    : "Billing",
			"elementId": "billing-status",
			"linkUrl": "/sapps/members/billing/AccountSummary.do",
			"bgImage"  : "/assets/members/public/dashboard/images/billing-tile-bg.jpg",
			"templateUrl"       : "components/tiles/templates/account-status.html",
			"mappings"          : [
				"easyPayBlue",
				"monthlyRate",
				"amountDue",
				"amountDueDisplay",
				"hasAmountDue",
				"dueDateString",
				"dueDate",
				"dueDatePlusThirty",
				"generatingInvoice",
				"overdue",
				"payable",
				"bankDraft",
				"invoiced",
				"paymentMethod",
				"reinstateCode",
				"reinstatable",
				"reinstateWeb",
				"reinstatePhone ",
				"reinstatementAmount",
				"reinstatementDateString",
				"reinstatementDate",
				"makeMinimumPayment",
				"setUpAutoPay",
				"errorMessage",
				"hasAPTCDateError"
			],
			"easyPayBlue": null,
			"monthlyRate": null,
			"amountDue": null,
			"amountDueDisplay": null,
			"hasAmountDue": null,
			"dueDateString": null,
			"dueDate": null,
			"dueDatePlusThirty": null,
			"generatingInvoice": null,
			"overdue": null,
			"payable": null,
			"bankDraft": null,
			"invoiced": null,
			"paymentMethod": null,
			"reinstateCode": null,
			"reinstatable": null,
			"reinstateWeb": null,
			"reinstatePhone ": null,
			"reinstatementAmount": null,
			"reinstatementDateString": null,
			"reinstatementDate": null,
			"makeMinimumPayment": null,
			"errorMessage": null,
			"setUpAutoPay": null,
			"color"      : "grey",
			"type"       : "BCBS",
			"target"     : "_blank",
			"style"      : "item billing-status",
			"show"       : ["subscriber", "individual"],
			"hide"       : ["Medicare Supplement", "PDP", "Medicare Advantage"],
			"topics"     : [0,29],
			"fixedPriority" : 3
		},
		{
			"id"         : 1,
			"title"      : "Temporary Id Card",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/account/request-card.htm",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/IDcard.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : ["Medicare Supplement", "PDP", "Medicare Advantage"],
			"topics"     : [0]
		},
		{
			"id"         : 66,
			"title"      : "Blue Rewards Promo Tile",
			"alt"        : "Earn $50 in Just a Few Minutes",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/BlueRewards2.jpeg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/campaigns/getstarted/index.htm?cmpid=2015BCOnboarding_tile1",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id"         : 2,
			"title"      : "Onboarding BCBSNC",
			"alt"        : "Welcome to BCBSNC. We're glad you're here. Let us help you learn how to use your new health care plan. Follow the arrow to find answers to our members' most frequently asked questions.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "http://www.bcbsnc.com/assets/help/faq",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/OnboardingBCBSNC.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : [],
			"topics"     : [0]
		},
		{
			"id"         : 3,
			"elementId"  : "fund-account-balance",
			"title"      : "Fund Balance",
			"templateUrl": "components/tiles/templates/fund-balance.html",
			"url"        : "https://wwwqa.bcbsnc.com/FIM/sps/HeqFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://www.HealthEquity.com/HESaml2.aspx",
			"HSABalance" : {
				"label": "HSA Account 2014",
			},
			"HRABalance" : {
				"label": "HRA Account 2014",
				"value": null
			},
			"FSABalance" : {
				"label": "FSA Account",
				"value": null
			},
			"DCRABalance": {
				"label": "DCRA Account",
				"value": null
			},
			"type"       : "BCBS",
			"style"      : "item fund-balance",
			"color"      : "grey",
			"show"       : ["HRA"],
			"hide"       : [],
			"topics"     : [0,29],
			"fixedPriority" : 4
		},
		{
			"id"                 : 4,
			"title"              : "HSA Fund Balance",
			"color"              : "grey",
			"templateUrl"        : "components/tiles/templates/hsa-balance.html",
			"url"            : "https://www.mybenefitwallet.com/",
			"linkText"           : "Fund Account Balance",
			"type"               : "BCBS",
			"style"              : "item fund-balance",
			"balanceLabel"       : "HSA Balance",
			"target"             : "_blank",
			"tags"               : ["tag2"],
			"show"       : ["HSA"],
			"hide"       : [],
			"topics"     : [0,29],
			"fixedPriority" : 4
		},
		{
			"id"         : 5,
			"title"      : "Health Assessment",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthAssessment.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/healthy_assessment.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [0]
		},
		{
			"id"         : 6,
			"title"      : "Treatment Cost Estimator",
			"templateUrl": "components/tiles/templates/vitals.html",
			"color"      : "grey",
			"linkText"   : "Estimate Health Care Costs",
			"bgImage"    : "/assets/members/public/dashboard/images/TreatmentCostEstimator.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : ["Dental","Medicare Supplement","Medicare Advantage"],
			"topics"     : [0,2]
		},
		{
			"id"         : 7,
			"title"      : "Dental Care Resource Center",
			"templateUrl": "components/tiles/templates/img_flip.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/Dental1_FlipA.jpg",
			"bgFlipImage": "/assets/members/public/dashboard/images/Dental1_FlipB.jpg",
			"linkUrl"    : "http://bcbsnc.go2dental.com/scontent/",
			"target"     : "_blank",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasDental", "Dental"],
			"hide"       : [],
			"topics"     : [0,27]
		},
		{
			"id"         : 8,
			"title"      : "Drug Claims",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/DrugClaims.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/claims/index.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy"],
			"hide"       : [],
			"topics"     : [0,28]
		},
		{
			"id"         : 9,
			"title"      : "Drug Search",
			"bgImage"    : "/assets/members/public/dashboard/images/FindADrug.jpg",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "/members/secure/account/bcbsnc_redirect_consent.htm?SSO=PRIME&page=FindDrugs",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy","active"],
			"hide"       : [],
			"topics"     : [0,4],
			"target"     : "_blank"
		},
		{
			"id"         : 10,
			"title"      : "How-To: Over the Counter",
			"bgImage"    : "/assets/members/public/dashboard/images/HowToOverTheCounter.jpg",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/prescriptions/otc.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy","active"],
			"hide"       : [],
			"topics"     : [28]
		},
		{
			"id"         : 11,
			"title"      : "How-To: Use Pharmacy",
			"bgImage"    : "/assets/members/public/dashboard/images/HowToUsePharmacy.jpg",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/prescriptions/index.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy","active"],
			"hide"       : [],
			"topics"     : [28]
		},
		{
			"id"         : 12,
			"title"      : "Mail Order",
			"bgImage"    : "/assets/members/public/dashboard/images/MailOrderA.jpg",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/prescriptions/mail_order_prescriptions.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy","active"],
			"hide"       : [],
			"topics"     : [28]
		},
		{
			"id"         : 13,
			"title"      : "Pharmacy Search",
			"bgImage"    : "/assets/members/public/dashboard/images/PharmacySearch.jpg",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/prescriptions/mail_order_prescriptions.htm",
			"linkText"   : "None",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasPharmacy","active"],
			"hide"       : [],
			"topics"     : [5]
		},
		{
			"id"         : 15,
			"title"      : "Health Coaching",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthCoaching.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&Target=https://${alereEnv}/portal/server.pt/community/coaching/coaching?pageId=LEFT%3ARECOMMENDATION%3AWellness+Activities%2FOne+on+One+HC+with+WC",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [6]
		},
		{
			"id"         : 16,
			"title"      : "Healthwise KB",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthwiseKnowledge.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://producer.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&Target=https://${alereEnv}/server.pt/community/default/sub-index%3Ft%3Dall-conditions%26pageId%3DHEADER%3ADiseases%20And%20Conditions%2FLink%20All%20Conditions",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [7]
		},
		{
			"id"         : 17,
			"title"      : "Ask A Nurse, Health Line Blue",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/AskANurse.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&Target=https://${alereEnv}/portal/server.pt/community/nurse24",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [8]
		},
		{
			"id"         : 18,
			"title"      : "Healthy Outcomes",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/Alere_HealthyOutcomes.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&amp;NameIdFormat=Email&amp;PartnerId=https://${partnerId}/sso/saml&amp;Target=https://${alereEnv}/portal/server.pt",
			"linkText"   : "Getting Started in Alere",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [0,9]
		},
		{
			"id"         : 19,
			"title"      : "Healthy Living Conversations",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthyLivingConversation.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://secure.uat.alerehealth.com/sso/saml&Target=https://${alereEnv}/portal/server.pt/community/default/dashboard?d=CONVERSATIONS&pageId=LEFT%3ARECOMMENDATION%3AWellness+Activities%2FLink+-+Healthy+Living+Conversations",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [10]
		},
		{
			"id"         : 20,
			"title"      : "Virtual Health Coach",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthyLiving.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&RelayState=https://${alereEnv}/portal/server.pt/community/default/hlp_dashboard?d=HLP&programNav=4&pageId=LEFT%3ARECOMMENDATION%3AWellness+Activities%2FLink+-+Healthy+Living+Programs",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [11]
		},
		{
			"id"         : 21,
			"title"      : "Online Monthly Seminars",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/OnlineMonthlySeminars.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&RelayState=https://${alereEnv}/portal/server.pt/community/default/dashboard?d=SEMINAR&pageId=HEADER%3ATools+And+Media%2FLink+Online+Seminars",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [12]
		},
		{
			"id"         : 22,
			"title"      : "Alere Maternity Program",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/MaternityProgram.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&NameIdFormat=Email&PartnerId=https://${partnerId}/sso/saml&Target=https://${alereEnv}/portal/server.pt/community/clientpage?id=alere://BCBSNC-wch-maternity-landing",
			"linkText"   : "None",
			"type"       : "User",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : ["male"],
			"topics"     : [13]
		},
		{
			"id"         : 23,
			"title"      : "Personal Health Record",
			"templateUrl": "components/tiles/templates/alere-sso-tile.html",
			"bgImage"    : "/assets/members/public/dashboard/images/PersonalHealthRecords.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://${producerEnv}.bcbsnc.com/FIM/sps/AlereFed/saml20/logininitial?RequestBinding=HTTPPost&amp;NameIdFormat=Email&amp;PartnerId=https://secure.alerehealth.com/sso/saml&amp;Target=https://yourhealthyoutcomes.alerehealth.com/portal/server.pt/community/PHR/phr_landing?pageId=LEFT%3ARECOMMENDATION%3AWellness+Resources%2FResources+-+Personal+Health+Record",
			"linkText"   : "Personal Health Record",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["wellness"],
			"hide"       : [],
			"topics"     : [14]
		},
		{
			"id"         : 24,
			"title"      : "Provider Search",
			"templateUrl": "components/tiles/templates/vitals.html",
			"bgImage"    : "/assets/members/public/dashboard/images/FindADoctor.jpg",
			"color"      : "grey",
			"linkText"   : "Find Doctors and Facilities",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : [],
			"topics"     : [0,15]
		},
		{
			"id"         : 25,
			"title"      : "Urgent Care Search",
			"templateUrl": "components/tiles/templates/vitals.html",
			"bgImage"    : "/assets/members/public/dashboard/images/UrgentCareSearch.jpg",
			"color"      : "grey",
			"linkText"   : "Find Urgent Care",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : [],
			"topics"     : [0,16]
		},
		{
			"id"         : 26,
			"title"      : "Help & FAQs",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/FAQ.jpg",
			"color"      : "grey",
			"linkUrl"    : "http://www.bcbsnc.com/assets/help/faq/",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"topics"     : [0,30]
		},
		{
			"id"         : 27,
			"title"      : "Dental Benefits Optimization",
			"templateUrl": "components/tiles/templates/img_double.html",
			"bgImage"    : "/assets/members/public/dashboard/images/Dental2.jpg",
			"color"      : "grey",
			"linkUrl"    : "http://bcbsnc.go2dental.com/scontent/risk-assessments-atd.php",
			"linkText"   : "Optimize your dental plan",
			"type"       : "BCBS",
			"style"      : "item w2",
			"show"       : ["hasDental", "Dental"],
			"hide"       : [],
			"topics"     : [0,27]
		},
		{
			"id"         : 28,
			"title"      : "Medical Benefits Optimization",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/benefits/manage_costs.htm",
			"bgImage"    : "/assets/members/public/dashboard/images/MedBens.jpg",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : [],
			"hide"       : ["Dental", "PDP"],
			"topics"     : [0,26]
		},
		{
			"id"         : 29,
			"title"      : "Rx Optimization",
			"templateUrl": "components/tiles/templates/img_double.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/prescriptions/cost_saving_tips.htm",
			"linkText"   : "Link",
			"bgImage"	 : "/assets/members/public/dashboard/images/RXOptimization_Double.jpg",
			"type"       : "BCBS",
			"style"      : "item w2",
			"show"       : ["hasPharmacy"],
			"hide"       : [],
			"topics"     : [0,28]
		},
		{
			"id"         : 30,
			"title"      : "Mange Your Policy",
			"templateUrl": "components/tiles/templates/open-enrollment.html",
			"color"      : "white",
			"type"       : "BCBS",
			"style"      : "item",
			"hide"       : [],
			"topics"     : [0]
		},
		{
			"id"         : 31,
			"title"      : "Blue365 Discounts",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/Blue365.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://www.blue365deals.com/BCBSNC",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : ["Medicare Advantage", "Dental", "PDP", "under18"],
			"topics"     : [0,29,26]
		},
		{
			"id"         : 32,
			"title"      : "Live Fearless",
			"alt"        : "LiveFearlessNC. Go ahead, Live Fearless! Set a goal for healthier living. We've got tips and tools that can help you get there!",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/LiveFearless.jpg",
			"color"      : "grey",
			"linkUrl"    : "http://livefearlessnc.com/",
			"linkText"   : "None",
			"target"     : "_blank",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"topics"     : [17]
		},
		{
			"id"         : 33,
			"tileId"     : "blog",
			"title"      : "BCBSNC Blog",
			"templateUrl": "components/tiles/templates/social-media.html",
			"color"      : "grey",
			"linkUrl"    : "http://blog.bcbsnc.com/",
			"linkText"   : "Go to BCBSNC blog",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/Blog_Slice.jpg",
			"bodyIsHtml" :  true,
			"bodyMaxLength" : 234,
			"htmlSelector": "p:eq(0)",
			"viewMoreLabel"   : "View the BCBSNC Blog",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "bcbsncblog",
			"showTitle"  : true,
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/blog-banner.png",
			"topics"     : [18]
		},
		{
			"id"         : 34,
			"tileId"     : "twitter",
			"title"      : "BCBSNC Twitter",
			"templateUrl": "components/tiles/templates/social-media.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/Twitter_Slice.jpg",
			"bodyIsHtml" :  false,
			"viewMoreLabel"   : "View more Tweets",
			"color"      : "grey",
			"linkUrl"    : "None",
			"linkText"   : "",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "twitter",
			"showTitle"  : false,
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/Twitter_Banner.png",
			"topics"     : [19]
		},
		{
			"id"         : 35,
			"tileId"     : "facebook",
			"title"      : "BCBSNC Facebook",
			"templateUrl": "components/tiles/templates/social-media.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/Facebook_Slice.jpg",
			"bodyIsHtml" :  false,
			"viewMoreLabel"   : "View more Facebook",
			"color"      : "grey",
			"linkUrl"    : "None",
			"linkText"   : "",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "facebook",
			"showTitle"  : false,
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/Facebook_Banner.png",
			"topics"     : [20]
		},
		{
			"id"         : 36,
			"tileId"     : "pinterest",
			"title"      : "BCBSNC Pinterest",
			"templateUrl": "components/tiles/templates/social-media.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/Pinterest_Slice.jpg",
			"bodyIsHtml" :  true,
			"bodyMaxLength" : 71,
			"htmlSelector": "p:eq(1)",
			"viewMoreLabel"   : "See more Pinterest",
			"color"      : "grey",
			"linkUrl"    : "None",
			"linkText"   : "",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "pinterest",
			"showTitle"  : false,
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/Pinterest_Banner.png",
			"topics"     : [21]
		},
		{
			"id"         : 37,
			"tileId"     : "googleplus",
			"title"      : "BCBSNC Google+",
			"templateUrl": "components/tiles/templates/social-media.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/Google_Slice.jpg",
			"bodyIsHtml" :  true,
			"bodyMaxLength" : 234,
			"viewMoreLabel"   : "See more Google+",
			"color"      : "grey",
			"linkUrl"    : "None",
			"linkText"   : "None",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "googleplus",
			"showTitle"  : false,
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/Google_Banner.png",
			"topics"     : [22]
		},
		{
			"id"         : 38,
			"tileId"     : "youtube",
			"title"      : "BCBSNC Youtube",
			"templateUrl": "components/tiles/templates/social-media.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/social-media/YouTube_Slice.jpg",
			"bodyIsHtml" :  false,
			"viewMoreLabel"   : "View more YouTube",
			"color"      : "grey",
			"linkUrl"    : "None",
			"linkText"   : "None",
			"type"       : "User",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"mediaId"    : "youtube",
			"target"     : "_blank",
			"bannerImg"  :  "/assets/members/public/dashboard/images/social-media/YouTube_Banner.png",
			"showTitle"  : true,
			"topics"     : [23]
		},
		{
			"id"         : 39,
			"title"      : "Preventive Care Guide",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "/members/secure/wellness/resources/preventive_care_guidelines.htm",
			"linkText"   : "Guidelines for Staying Healthy",
			"bgImage"	 : "/assets/members/public/dashboard/images/PreventiveCareGuidelines.jpg",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["HSA"],
			"hide"       : [],
			"topics"     : [0,26]
		},
		{
			"id"         : 40,
			"title"      : "Plan Comparison",
			"templateUrl": "components/tiles/templates/img_double.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/PlanComparison_Double.jpg",
			"linkUrl"    : "https://www.ebenefitsnow.com/ypc/ypc/myInfo.jsp",
			"linkText"   : "",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item w2",
			"target"     : "_blank",
			"show"       : ["individual","subscriber"],
			"hide"       : [],
			"topics"     : [29]
		},
		{
			"id"         : 41,
			"title"      : "Medicare Information",
			"alt"        : "Turning 65? Choosing the right Medicare plan has never been easier.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "http://www.bcbsnc.com/content/medicare/shopper/index.htm",
			"linkText"   : "",
			"bgImage"    : "/assets/members/public/dashboard/images/MedicarePromo.jpg",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"target"     : "_blank",
			"show"       : [],
			"hide"       : ["under18","Medicare Advantage","Medicare Supplement","PDP"],
			"topics"     : [0,26]
		},
		{
			"id"         : 42,
			"title"      : "Getting The Most Out of Your HSA Plan",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/benefits/getting_most_from_hsa.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/Getting-the-Most-Out-of-Your-Plan-HSA.jpg",
			"linkText"   : "Link",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"target"     : "_blank",
			"show"       : ["HSA"],
			"hide"       : [],
			"topics"     : [0,29]
		},
		{
			"id"         : 43,
			"title"      : "Dental Video 3",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "http://bcbsnc.go2dental.com/scontent/",
			"linkText"   : "Optimize your dental plan",
			"bgImage"	 : "/assets/members/public/dashboard/images/Dental3.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasDental","Dental"],
			"hide"       : [],
			"topics"     : [0,27]
		},
		{
			"id"         : 44,
			"title"      : "Understanding Your HRA",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/benefits/understanding_your_HRA_plan.htm",
			"bgImage"	 : "/assets/members/public/dashboard/images/HRA.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["HRA"],
			"hide"       : [],
			"topics"     : [0,29]
		},
		{
			"id"         : 45,
			"title"      : "Onboarding BlueConnect",
			"alt"        : "Using BlueConnect. First visit to the member dashboard? Learn how to use it quickly and easily with this short tutorial. Follow the arrow to find a step-by-step map and the answers to frequently asked questions.",
			"templateUrl": "components/tiles/templates/blueconnect.html",
			"color"      : "grey",
			"bgImage"    : "/assets/members/public/dashboard/images/OnboardingMED.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"topics"     : [0,30]
		},
		{
			"id"         : 46,
			"title"      : "Find a Dentist",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "http://${webEnv}.bcbsnc.com/members/public/search/index.htm?providerType=DP",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/FindADentist.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasDental","Dental"],
			"hide"       : [],
			"topics"     : [0,25]
		},
		{
			"id"         : 47,
			"title"      : "Dental Cost Estimator",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "http://${webEnv}.bcbsnc.com/members/public/search/index.htm?providerType=DP",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/DentalCostEstimator.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active","hasDental"],
			"hide"       : [],
			"topics"     : [31]
		},
		{
			"id"         : 48,
			"title"      : "Easy Pay Blue",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://wwwps.bcbsnc.com/members/secure/account/easypayblue.htm",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/EasyPayBlue.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active","individual","subscriber","Medicare Advantage","Medicare Supplement"],
			"hide"       : [],
			"topics"     : [29]
		},
		{
			"id"         : 49,
			"title"      : "Explanation of Benefits, EOB",
			"templateUrl": "components/tiles/templates/img_double.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/claims/eobsearch.html",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/EOB_Double.jpg",
			"type"       : "BCBS",
			"style"      : "item w2",
			"show"       : ["subscriber"],
			"hide"       : ["Medicare Supplement","Medicare Advantage","PDP","Dental"],
			"topics"     : [0,26]
		},
		{
			"id"         : 50,
			"title"      : "Health Care Summary Report",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://wwwps.bcbsnc.com/members/secure/claims/summaryreport.htm",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/HCSR.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["subscriber"],
			"hide"       : ["Medicare Supplement","Medicare Advantage","PDP","Dental"],
			"topics"     : [26]
		},
		{
			"id"         : 51,
			"title"      : "Health Risk Assessment",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/HealthRiskAssessment.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/healthy_assessment.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["Wellness","active"],
			"hide"       : [],
			"topics"     : [1]
		},
		{
			"id"         : 72,
			"title"      : "Blue Link Tile - My Interests",
			"alt"        : "Track. Learn. Apply. Achieve. Do it all with Blue Link.",
			"templateUrl": "components/tiles/templates/blue-link.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/BlueLinkTile_1col.jpg",
			"color"      : "grey",
			"linkUrl"    : "",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"target"     : "_blank",
			"show"       : [],
			"hide"       : [],
			"topics"     : [72]
		},
		{
			"id"         : 52,
			"title"      : "Dont Lose Coverage, IMEM Campaign Tile",
			"templateUrl": "components/tiles/templates/img_double.html",
			"campaignID" : "1",
			"bgImage"    : "/assets/members/public/dashboard/images/IMEM_Double.jpg",
			"color"      : "grey",
			"linkUrl"    : "",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item w2",
			"show"       : [],
			"hide"       : [],
			"topics"     : [3]
		},
		{
			"id"         : 53,
			"title"      : "Know Antibiotics, Non-IMEM Campaign Tile",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"campaignID" : "2",
			"bgImage"    : "/assets/members/public/dashboard/images/TargetedCampaign.jpg",
			"color"      : "grey",
			"linkUrl"    : "http://www.bcbsnc.com/content/campaigns/knowyourmeds/index.htm?cmpid=antibioticknowyourmeds",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : [],
			"hide"       : [],
			"topics"     : [32]
		},
		{
			"id"         : 54,
			"title"      : "Rx Cost Estimator",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/PrescriptionCostEstimator.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://www.myprime.com/content/myprime/en/find-medicine.html",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["hasDental"],
			"hide"       : [],
			"topics"     : [33]
		},
		{
			"id"         : 55,
			"title"      : "View PCP",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/ViewPCP.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://wwwps.bcbsnc.com/members/secure/account/manage-pcp.htm",
			"linkText"   : "None",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["State"],
			"hide"       : [],
			"topics"     : [26]
		},
		{
			"id"         : 71,
			"title"      : "Silver and Fit",
			"alt"        : "Silver and Fit. Find a low-cost fitness program near you.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/SilverAndFit.jpg",
			"color"      : "grey",
			"target"	 : "_blank",
			"type"       : "BCBS",
			"style"      : "item",
			"topics"     : [0]
		},
		{
			"id"         : 56,
			"title"      : "Temporary Id Card Mobile",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/members/secure/account/request-card.htm",
			"linkText"   : "None",
			"bgImage"    : "/assets/members/public/dashboard/images/MobileIDcard.jpg",
			"type"       : "BCBS",
			"style"      : "item",
			"show"       : ["active"],
			"hide"       : ["Medicare Supplement", "PDP", "Medicare Advantage"],
			"topics"     : [0]
		},
		{
			"id"         : 57,
			"title"      : "Medicare Blue365",
			"alt"        : "Blue 365. Because health is a big deal. Get discounts on gym memberships, fitness gear, hearing aids, personal care services and more...",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/Blue365_Medi.jpg",
			"color"      : "grey",
			"linkUrl"    : "/content/blue365/index.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,96]
		},
		{
			"id"         : 58,
			"title"      : "Medicare Case Manager",
			"alt"        : "Work With a Case Manager. We're here to help. Our registered nurses have experience with important health issues and they're here to assist you.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/CaseManager_Medi.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/medicare/case-management.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,35]
		},
		{
			"id"         : 59,
			"title"      : "Medicare Flu Shots",
			"alt"        : "Flu and Pneumonia Shots. Getting an annual flu shot is a simple step to protecting your health. See where you can go to get yours today.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/FlueShots.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/medicare/flu-and-pneumonia-shots.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,37]
		},
		{
			"id"         : 60,
			"title"      : "Medicare Therapy",
			"alt"        : "Medication Therapy. Our Medication Therapy Management Program can help you improve your medication use and reduce risk of side effects.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/MedTherapy_MEDI.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/medicare/medication-therapy-management.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,38]
		},
		{
			"id"         : 61,
			"title"      : "Medicare Telephone Learning",
			"alt"        : "Phone a Registered Nurse. Do you have health questions? Answers are just a phone call away with the Telephone Learning Center (TLC) Line.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/TelephoneLearning.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/medicare/telephone-learning-center.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,39]
		},
		{
			"id"       : 62,
			"title"    : "Medicare Billing",
			"displayTitle"    : "Billing",
			"linkUrl": "/sapps/members/billing/AccountSummary.do",
			"bgImage"  : "/assets/members/public/dashboard/images/billing-tile-bg.jpg",
			"templateUrl"       : "components/tiles/templates/account-status.html",
			"mappings"          : [
				"easyPayBlue",
				"monthlyRate",
				"amountDue",
				"amountDueDisplay",
				"hasAmountDue",
				"dueDateString",
				"dueDate",
				"dueDatePlusThirty",
				"generatingInvoice",
				"overdue",
				"payable",
				"bankDraft",
				"invoiced",
				"paymentMethod",
				"reinstateCode",
				"reinstatable",
				"reinstateWeb",
				"reinstatePhone ",
				"reinstatementAmount",
				"reinstatementDateString",
				"reinstatementDate",
				"makeMinimumPayment",
				"setUpAutoPay",
				"errorMessage",
				"hasAPTCDateError"
			],
			"easyPayBlue": "true",
			"monthlyRate": null,
			"amountDue": null,
			"amountDueDisplay": null,
			"hasAmountDue": null,
			"dueDateString": null,
			"dueDate": null,
			"dueDatePlusThirty": null,
			"generatingInvoice": null,
			"overdue": null,
			"payable": null,
			"bankDraft": null,
			"invoiced": null,
			"paymentMethod": null,
			"reinstateCode": null,
			"reinstatable": null,
			"reinstateWeb": null,
			"reinstatePhone ": null,
			"reinstatementAmount": null,
			"reinstatementDateString": null,
			"reinstatementDate": null,
			"makeMinimumPayment": null,
			"errorMessage": null,
			"setUpAutoPay": null,
			"color"      : "blue",
			"type"       : "BCBS",
			"target"     : "_blank",
			"style"      : "item billing-status",
			"topics"     : [0,29],
			"fixedPriority" : 3
		},
		{
			"id"         : 63,
			"title"      : "Medicare Disease Management",
			"alt"        : "Disease Management. Learn to manage your chronic health condition with specialized health programs, which include support from registered nurses, preventive reminders and more.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/DiseaseMgmt.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/wellness/medicare/health-management.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,36]
		},
		{
			"id"         : 64,
			"title"      : "Blue Link Promo Tile",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/BlueLinkLearnMore.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/content/campaigns/blueconnectnc/bluelink.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id"         : 65,
			"title"      : "HealthNAV Promo Tile",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/HealthNav.jpg",
			"color"      : "grey",
			"linkUrl"    : "https://www.bcbsnc.com/content/campaigns/blueconnectnc/healthnav.htm",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id"         : 66,
			"title"      : "Blue Rewards Promo Tile",
			"templateUrl": "components/tiles/templates/blue-rewards.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/BlueRewards.jpg",
			"color"      : "grey",
			"linkUrl"    : "",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id"         : 67,
			"title"      : "Lets Talk Cost",
			"alt"        : "Let's Talk Cost. Health insurance premiums have doubled in the past decade. Find out what we're doing to help you reduce costs.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/LetsTalkCost.jpg",
			"color"      : "grey",
			"linkUrl"    : "http://letstalkcost.com/",
			"linkText"   : "None",
			"target"     : "_blank",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [34]
		},
		{
			"id"         : 68,
			"title"      : "Temp ID Card Over 65",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/IDcard-Over65.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/account/request-card.htm",
			"linkText"   : "None",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0]
		},
		{
			"id"         : 69,
			"title"      : "Rx Prior Review",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/RxPrior.jpg",
			"color"      : "grey",
			"linkUrl"    : "/members/secure/prescriptions/prior_review.htm",
			"linkText"   : "None",
			"type"       : "User",
			"style"      : "item",
			"topics"     : [0,28]
		},
		{
			"id"         : 70,
			"title"      : "Ask A Nurse, Health Line Blue",
			"alt"        : "Ask a Nurse. Get trusted advice from a nurse at Health Line Blue, anytime, 24/7.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"    : "/assets/members/public/dashboard/images/CE-41_Health-Line-Blue_BC-Campaign-tile_1col@1x.png",
			"color"      : "grey",
			"linkUrl"    : "www.bcbsnc.com/content/campaigns/healthlineblue/index.htm?cmpid=2015healthlineblue_tile",
			"linkText"   : "None",
			"target"	 : "_blank",
			"type"       : "BCBS",
			"style"      : "item",
			"topics"     : [0]
		},
		{
			"id"         : 73,
			"title"      : "Blue Link Connect More",
			"alt"        : "Blue Link. Connect More. Achieve More. Find your motivation on Blue Link.",
			"templateUrl": "components/tiles/templates/blue-link_double.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/BlueLinkConnectTile_Sprite.jpg",
			"color"      : "grey",
			"linkUrl"    : "",
			"linkText"   : "Link",
			"type"       : "User",
			"style"      : "item w2",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id"         : 74,
			"title"      : "Adestinn",
			"alt"        : "Destination: Wellness. Get a 50% vacation savings match to help you relax.",
			"templateUrl": "components/tiles/templates/adestinn-link.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/adestinn-tile.png",
			"color"      : "grey",
			"linkUrl"    : "https://member.adestinn.com/About/NC/?utm_source=BCTile&utm_medium=BCBSNC&utm_campaign=Adestinn",
			"style"      : "item",
			"target"     : "_blank",
			"topics"     : [0]
		},
		{
			"id" 					: 78,
			"title"       : "Get Your Free Tickets",
			"alt"         : "BCBSNC Drive For The Cure 300",
			"templateUrl" : "components/tiles/templates/img_basic.html",
			"bgImage"     : "/assets/members/public/dashboard/images/BCBSNC-ASO-CM-Blue-Connect-Tile-340x340.png",
			"color"       : "grey",
			"linkUrl"     : "http://www.charlottemotorspeedway.com/DFTC300",
			"linkText"    : "None",
			"target"      : "_blank",
			"type"        : "BCBS",
			"style"       : "item",
			"topics"      : [0]
		},
	    {
		    "id"         : 88,
		    "title"      : "National Health Observance",
		    "templateUrl": "components/tiles/templates/img_basic.html",
			"alt"        : "Blue Link – Healthy Habits. It's Stress Awareness Month. What are you doing to reduce it?. Understand the symptoms,signs and causes, and find easy ways to eliminate the stressors in your life.",
		    "bgImage"    : "/assets/members/public/dashboard/images/Natl-Stress-Awareness-April.png",
		    "color"      : "grey",
		    "linkUrl"    : "https://bluelink.bcbsnc.com/campaign/stress-awareness-2016",
		    "linkText"   : "National Health Observance",
		    "target"	 : "_blank",
		    "type"       : "BCBS",
		    "style"      : "item",
		    "topics"     : [0]
	    },
		{
			"id"         : 89,
			"title"      : "TellBlue survey recruitment",
			"alt"        : "TellBlue survey recruitment",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"bgImage"	 : "/assets/members/public/dashboard/images/tellBlue-BC-Tile-Invitation@340x340.png",
			"color"      : "grey",
			"linkUrl"    : "https://www.tellbluenc.com/Portal/default.aspx",
			"linkText"   : "TellBlue survey recruitment",
			"style"      : "item",
			"type"       : "BCBS",
			"target"     : "_blank",
			"topics"     : [0]
		},
        {
            "id"         : 90,
            "title"      : "Town of Cary - drive to Health Assessment",
            "alt"        : "Want to get more from your new health plan? Watch this video and answer five quick questions to earn Blue Rewards points.",
            "templateUrl": "components/tiles/templates/img_basic.html",
            "bgImage"    : "/assets/members/public/dashboard/images/TOC-Health-Assessment-Tile_1.3@340x340.png",
            "color"      : "grey",
            "linkUrl"    : "https://www.bcbsnc.com/members/secure/wellness/healthy_assessment.htm",
            "linkText"   : "Blue Rewards Welcome Onboarding Video",
            "target"	 : "_blank",
            "type"       : "BCBS",
            "style"      : "item",
            "topics"     : [0]
        },
        {
            "id"         : 91,
            "title"      : "National Health Observance",
            "templateUrl": "components/tiles/templates/img_basic.html",
            "alt"        : "What's up doc? Is it your blood pressure? Keep it in check can lower your risk for stroke and heart attack. Learn more today.",
            "bgImage"    : "/assets/members/public/dashboard/images/Natl-High-Blood-Pressure-Education-Month.png",
            "color"      : "grey",
            "linkUrl"    : "https://bluelink.bcbsnc.com/campaign/high-blood-pressure-education-2016",
            "linkText"   : "National Health Observance",
            "target"	 : "_blank",
            "type"       : "BCBS",
            "style"      : "item",
            "topics"     : [0]
        },
		{
			"id"         : 92,
			"title"      : "BCBSNC ASO group with Case Management or Disease Management",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"color"      : "grey",
			"bgImage"    : "/assets/members/public/dashboard/images/BCBSNC-ASO-CM-Blue-Connect-Tile-340x340.jpg",
			"linkUrl"    : "/members/secure/campaigns/bluerewards/casemanagement.htm?cmpid=Tile_BC_U11731a",
			"alt"        : "We're in your corner. Our nurses can help you navigate complex health care issues.",
			"linkText"   : "BCBSNC ASO group with Case Management or Disease Management",
			"target"	 : "_blank",
			"type"       : "BCBS",
			"style"      : "item",
			"topics"     : [0]
	    },
		{
			"id"         : 103,
			"title"      : "Preventive Care Promotion",
			"alt"        : "Preventive Care Promotion. Did you know that some wellness visits and important health screening are covered at no extra cost? Learn more about what services are covered for you and your family.",
			"templateUrl": "components/tiles/templates/img_basic.html",
			"linkUrl"    : "/members/secure/wellness/resources/preventative_care_guidelines.htm",
			"linkText"   : "Guidelines for Staying Healthy",
			"bgImage"	 : "/assets/members/public/dashboard/images/preventive-care-promotion.png",
			"color"      : "grey",
			"type"       : "BCBS",
			"style"      : "item",
			"topics"     : [0,97]
		}
];
bcbsnc.dashboard.priority = {
	"mobile" : [
		//{"id": 78, "title": "members/secure/dashboard/tiles/drive-for-the-cure-300.vm"},
        {"id": 56, "title": "members/secure/dashboard/tiles/temp-id-card-mobile.vm"},
		{"id": 70, "title": "members/secure/dashboard/tiles/promo-healthlineblue.vm"},
		{"id": 73, "title": "members/secure/dashboard/tiles/bluelink-connect.vm"},
		{"id": 68, "title": "members/secure/dashboard/tiles/temp-id-card-over65.vm"},
		{"id": 2, "title": "members/secure/dashboard/tiles/onboarding-bcbsnc.vm"},
		{"id": 0, "title": "members/secure/dashboard/tiles/account-status.vm"},
		{"id": 3, "title": "members/secure/dashboard/tiles/hra-fund-balance.vm"},
		{"id": 4, "title": "members/secure/dashboard/tiles/hsa-fund-balance.vm"},
		{"id": 74, "title": "members/secure/dashboard/tiles/adestinn.vm"},
		{"id": 103, "title": "members/secure/dashboard/tiles/preventive-care-promotion.vm"},
		{"id": 57, "title": "members/secure/dashboard/tiles/medicare-blue365.vm"},
		{"id": 58, "title": "members/secure/dashboard/tiles/medicare-casemanager.vm"},
		{"id": 59, "title": "members/secure/dashboard/tiles/medicare-flushots.vm"},
		{"id": 60, "title": "members/secure/dashboard/tiles/medicare-therapy.vm"},
		{"id": 61, "title": "members/secure/dashboard/tiles/medicare-telephone.vm"},
		{"id": 62, "title": "members/secure/dashboard/tiles/medicare-billing.vm"},
		{"id": 64, "title": "members/secure/dashboard/tiles/promo-bluelink.vm"},
		{"id": 65, "title": "members/secure/dashboard/tiles/promo-healthnav.vm"},
		{"id": 66, "title": "members/secure/dashboard/tiles/promo-bluerewards.vm"},
		{"id": 18, "title": "members/secure/dashboard/tiles/alere-healthyoutcomes.vm"},
		{"id": 7, "title": "members/secure/dashboard/tiles/dental-resource-center.vm"},
		{"id": 12, "title": "members/secure/dashboard/tiles/mail-order.vm"},
		{"id": 44, "title": "members/secure/dashboard/tiles/understanding-hra.vm"},
		{"id": 42, "title": "members/secure/dashboard/tiles/gettingthemost-hsa.vm"},
		{"id": 55, "title": "members/secure/dashboard/tiles/view-pcp.vm"},
		{"id": 17, "title": "members/secure/dashboard/tiles/alere-healthlineblue.vm"},
		{"id": 50, "title": "members/secure/dashboard/tiles/health-care-summary-report.vm"},
		{"id": 49, "title": "members/secure/dashboard/tiles/explanation-of-benefits.vm"},
		{"id": 33, "title": "members/secure/dashboard/tiles/socialmedia-blog.vm"},
		{"id": 28, "title": "members/secure/dashboard/tiles/optimize-medical.vm"},
		{"id": 29, "title": "members/secure/dashboard/tiles/optimize-rx.vm"},
		{"id": 27, "title": "members/secure/dashboard/tiles/optimize-dental.vm"},
		{"id": 10, "title": "members/secure/dashboard/tiles/how-to-overthecounter.vm"},
		{"id": 43, "title": "members/secure/dashboard/tiles/dental-video.vm"},
		{"id": 11, "title": "members/secure/dashboard/tiles/how-to-usepharmacy.vm"},
		{"id": 47, "title": "members/secure/dashboard/tiles/dental-cost-estimator.vm"},
		{"id": 46, "title": "members/secure/dashboard/tiles/find-a-dentist.vm"},
		{"id": 9, "title": "members/secure/dashboard/tiles/find-a-drug.vm"},
		{"id": 69, "title": "members/secure/dashboard/tiles/rx-prior-review.vm"},
		{"id": 13, "title": "members/secure/dashboard/tiles/pharmacy-search.vm"},
		{"id": 54, "title": "members/secure/dashboard/tiles/rx-costestimator.vm"},
		{"id": 8, "title": "members/secure/dashboard/tiles/drug-claims.vm"},
		{"id": 41, "title": "members/secure/dashboard/tiles/medicare-information.vm"},
		{"id": 25, "title": "members/secure/dashboard/tiles/urgent-care-finder.vm"},
		{"id": 24, "title": "members/secure/dashboard/tiles/provider-search.vm"},
		{"id": 6, "title": "members/secure/dashboard/tiles/cost-estimator.vm"},
		{"id": 40, "title": "members/secure/dashboard/tiles/plan-comparison.vm"},
		{"id": 34, "title": "members/secure/dashboard/tiles/socialmedia-twitter.vm"},
		{"id": 35, "title": "members/secure/dashboard/tiles/socialmedia-facebook.vm"},
		{"id": 36, "title": "members/secure/dashboard/tiles/socialmedia-pinterest.vm"},
		{"id": 38, "title": "members/secure/dashboard/tiles/socialmedia-youtube.vm"},
		{"id": 37, "title": "members/secure/dashboard/tiles/socialmedia-googleplus.vm"},
		{"id": 67, "title": "members/secure/dashboard/tiles/socialmedia-letstalkcost.vm"},
		{"id": 23, "title": "members/secure/dashboard/tiles/alere-phr.vm"},
		{"id": 31, "title": "members/secure/dashboard/tiles/blue365.vm"},
		{"id": 22, "title": "members/secure/dashboard/tiles/alere-maternity.vm"},
		{"id": 19, "title": "members/secure/dashboard/tiles/alere-healthylivingconversations.vm"},
		{"id": 51, "title": "members/secure/dashboard/tiles/health-assessment.vm"},
		{"id": 15, "title": "members/secure/dashboard/tiles/alere-healthcoaching.vm"},
		{"id": 20, "title": "members/secure/dashboard/tiles/alere-healthylivingprograms.vm"},
		{"id": 21, "title": "members/secure/dashboard/tiles/alere-monthlyseminar.vm"},
		{"id": 16, "title": "members/secure/dashboard/tiles/alere-knowledgebase.vm"},
		{"id": 39, "title": "members/secure/dashboard/tiles/preventive-care-guide.vm"},
		{"id": 26, "title": "members/secure/dashboard/tiles/faq-help.vm"},
		{"id": 32, "title": "members/secure/dashboard/tiles/socialmedia-membernews.vm"},
		{"id": 52, "title": "members/secure/dashboard/tiles/campaign-imem.vm"},
		{"id": 53, "title": "members/secure/dashboard/tiles/campaign-non-imem.vm"},
		{"id": 30, "title": "members/secure/dashboard/tiles/renew-policy.vm"},
		{"id": 48, "title": "members/secure/dashboard/tiles/easy-pay-blue.vm"}
	],
	"tablet": [
		//{"id": 78, "title": "members/secure/dashboard/tiles/drive-for-the-cure-300.vm"},
		{"id": 2, "title": "members/secure/dashboard/tiles/onboarding-bcbsnc.vm"},
		{"id": 70, "title": "members/secure/dashboard/tiles/promo-healthlineblue.vm"},
		{"id": 73, "title": "members/secure/dashboard/tiles/bluelink-connect.vm"},
		{"id": 0, "title": "members/secure/dashboard/tiles/account-status.vm"},
		{"id": 3, "title": "members/secure/dashboard/tiles/hra-fund-balance.vm"},
		{"id": 4, "title": "members/secure/dashboard/tiles/hsa-fund-balance.vm"},
		{"id": 57, "title": "members/secure/dashboard/tiles/medicare-blue365.vm"},
		{"id": 58, "title": "members/secure/dashboard/tiles/medicare-casemanager.vm"},
		{"id": 59, "title": "members/secure/dashboard/tiles/medicare-flushots.vm"},
		{"id": 60, "title": "members/secure/dashboard/tiles/medicare-therapy.vm"},
		{"id": 61, "title": "members/secure/dashboard/tiles/medicare-telephone.vm"},
		//{"id": 62, "title": "members/secure/dashboard/tiles/medicare-billing.vm"},
		{"id": 64, "title": "members/secure/dashboard/tiles/promo-bluelink.vm"},
		{"id": 74, "title": "members/secure/dashboard/tiles/adestinn.vm"},
		{"id": 103, "title": "members/secure/dashboard/tiles/preventive-care-promotion.vm"},
		{"id": 65, "title": "members/secure/dashboard/tiles/promo-healthnav.vm"},
		{"id": 66, "title": "members/secure/dashboard/tiles/promo-bluerewards.vm"},
		{"id": 18, "title": "members/secure/dashboard/tiles/alere-healthyoutcomes.vm"},
		{"id": 7, "title": "members/secure/dashboard/tiles/dental-resource-center.vm"},
		{"id": 12, "title": "members/secure/dashboard/tiles/mail-order.vm"},
		{"id": 44, "title": "members/secure/dashboard/tiles/understanding-hra.vm"},
		{"id": 42, "title": "members/secure/dashboard/tiles/gettingthemost-hsa.vm"},
		{"id": 55, "title": "members/secure/dashboard/tiles/view-pcp.vm"},
		{"id": 17, "title": "members/secure/dashboard/tiles/alere-healthlineblue.vm"},
		{"id": 50, "title": "members/secure/dashboard/tiles/health-care-summary-report.vm"},
		{"id": 49, "title": "members/secure/dashboard/tiles/explanation-of-benefits.vm"},
		{"id": 33, "title": "members/secure/dashboard/tiles/socialmedia-blog.vm"},
		{"id": 28, "title": "members/secure/dashboard/tiles/optimize-medical.vm"},
		{"id": 29, "title": "members/secure/dashboard/tiles/optimize-rx.vm"},
		{"id": 27, "title": "members/secure/dashboard/tiles/optimize-dental.vm"},
		{"id": 10, "title": "members/secure/dashboard/tiles/how-to-overthecounter.vm"},
		{"id": 43, "title": "members/secure/dashboard/tiles/dental-video.vm"},
		{"id": 11, "title": "members/secure/dashboard/tiles/how-to-usepharmacy.vm"},
		{"id": 47, "title": "members/secure/dashboard/tiles/dental-cost-estimator.vm"},
		{"id": 46, "title": "members/secure/dashboard/tiles/find-a-dentist.vm"},
		{"id": 9, "title": "members/secure/dashboard/tiles/find-a-drug.vm"},
		{"id": 69, "title": "members/secure/dashboard/tiles/rx-prior-review.vm"},
		{"id": 13, "title": "members/secure/dashboard/tiles/pharmacy-search.vm"},
		{"id": 54, "title": "members/secure/dashboard/tiles/rx-costestimator.vm"},
		{"id": 8, "title": "members/secure/dashboard/tiles/drug-claims.vm"},
		{"id": 41, "title": "members/secure/dashboard/tiles/medicare-information.vm"},
		{"id": 25, "title": "members/secure/dashboard/tiles/urgent-care-finder.vm"},
		{"id": 24, "title": "members/secure/dashboard/tiles/provider-search.vm"},
		{"id": 6, "title": "members/secure/dashboard/tiles/cost-estimator.vm"},
		{"id": 40, "title": "members/secure/dashboard/tiles/plan-comparison.vm"},
		{"id": 1, "title": "members/secure/dashboard/tiles/temp-id-card.vm"},
		{"id": 68, "title": "members/secure/dashboard/tiles/temp-id-card-over65.vm"},
		{"id": 34, "title": "members/secure/dashboard/tiles/socialmedia-twitter.vm"},
		{"id": 35, "title": "members/secure/dashboard/tiles/socialmedia-facebook.vm"},
		{"id": 36, "title": "members/secure/dashboard/tiles/socialmedia-pinterest.vm"},
		{"id": 38, "title": "members/secure/dashboard/tiles/socialmedia-youtube.vm"},
		{"id": 37, "title": "members/secure/dashboard/tiles/socialmedia-googleplus.vm"},
		{"id": 67, "title": "members/secure/dashboard/tiles/socialmedia-letstalkcost.vm"},
		{"id": 23, "title": "members/secure/dashboard/tiles/alere-phr.vm"},
		{"id": 31, "title": "members/secure/dashboard/tiles/blue365.vm"},
		{"id": 22, "title": "members/secure/dashboard/tiles/alere-maternity.vm"},
		{"id": 19, "title": "members/secure/dashboard/tiles/alere-healthylivingconversations.vm"},
		{"id": 51, "title": "members/secure/dashboard/tiles/health-assessment.vm"},
		{"id": 15, "title": "members/secure/dashboard/tiles/alere-healthcoaching.vm"},
		{"id": 20, "title": "members/secure/dashboard/tiles/alere-healthylivingprograms.vm"},
		{"id": 21, "title": "members/secure/dashboard/tiles/alere-monthlyseminar.vm"},
		{"id": 16, "title": "members/secure/dashboard/tiles/alere-knowledgebase.vm"},
		{"id": 39, "title": "members/secure/dashboard/tiles/preventive-care-guide.vm"},
		{"id": 26, "title": "members/secure/dashboard/tiles/faq-help.vm"},

		{"id": 32, "title": "members/secure/dashboard/tiles/socialmedia-membernews.vm"},
		{"id": 52, "title": "members/secure/dashboard/tiles/campaign-imem.vm"},
		{"id": 53, "title": "members/secure/dashboard/tiles/campaign-non-imem.vm"},
		{"id": 30, "title": "members/secure/dashboard/tiles/renew-policy.vm"},
		{"id": 48, "title": "members/secure/dashboard/tiles/easy-pay-blue.vm"}
	],
	"desktop": [
		//{"id": 78, "title": "members/secure/dashboard/tiles/drive-for-the-cure-300.vm"},
    //{"id": 92, "title": "members/secure/dashboard/tiles/asogroup-casedisease-management.vm"},
    //{"id": 90, "title": "members/secure/dashboard/tiles/townofcary.vm"},
		{"id": 2, "title": "members/secure/dashboard/tiles/onboarding-bcbsnc.vm"},
		{"id": 72, "title": "members/secure/dashboard/tiles/my-interests-bluelink.vm"},
		{"id": 73, "title": "members/secure/dashboard/tiles/bluelink-connect.vm"},
		{"id": 70, "title": "members/secure/dashboard/tiles/promo-healthlineblue.vm"},
		{"id": 88, "title": "members/secure/dashboard/tiles/national-health-observance.vm"},
		{"id": 45, "title": "members/secure/dashboard/tiles/onboarding-blueconnect.vm"},
		//{"id": 0, "title": "members/secure/dashboard/tiles/account-status.vm"},
		{"id": 3, "title": "members/secure/dashboard/tiles/hra-fund-balance.vm"},
		{"id": 4, "title": "members/secure/dashboard/tiles/hsa-fund-balance.vm"},
		{"id": 74, "title": "members/secure/dashboard/tiles/adestinn.vm"},
		{"id": 103, "title": "members/secure/dashboard/tiles/preventive-care-promotion.vm"},
        {"id": 89, "title": "members/secure/dashboard/tiles/tellblue-survey.vm"},
		{"id": 57, "title": "members/secure/dashboard/tiles/medicare-blue365.vm"},
		{"id": 58, "title": "members/secure/dashboard/tiles/medicare-casemanager.vm"},
		{"id": 59, "title": "members/secure/dashboard/tiles/medicare-flushots.vm"},
		{"id": 60, "title": "members/secure/dashboard/tiles/medicare-therapy.vm"},
		{"id": 61, "title": "members/secure/dashboard/tiles/medicare-telephone.vm"},
		{"id": 62, "title": "members/secure/dashboard/tiles/medicare-billing.vm"},

		{"id": 64, "title": "members/secure/dashboard/tiles/promo-bluelink.vm"},
		{"id": 65, "title": "members/secure/dashboard/tiles/promo-healthnav.vm"},
		{"id": 66, "title": "members/secure/dashboard/tiles/promo-bluerewards.vm"},

		{"id": 18, "title": "members/secure/dashboard/tiles/alere-healthyoutcomes.vm"},
		{"id": 7, "title": "members/secure/dashboard/tiles/dental-resource-center.vm"},
		{"id": 12, "title": "members/secure/dashboard/tiles/mail-order.vm"},
		{"id": 44, "title": "members/secure/dashboard/tiles/understanding-hra.vm"},
		{"id": 42, "title": "members/secure/dashboard/tiles/gettingthemost-hsa.vm"},
		{"id": 55, "title": "members/secure/dashboard/tiles/view-pcp.vm"},
		{"id": 17, "title": "members/secure/dashboard/tiles/alere-healthlineblue.vm"},
		{"id": 50, "title": "members/secure/dashboard/tiles/health-care-summary-report.vm"},
		{"id": 49, "title": "members/secure/dashboard/tiles/explanation-of-benefits.vm"},
		{"id": 33, "title": "members/secure/dashboard/tiles/socialmedia-blog.vm"},
		{"id": 28, "title": "members/secure/dashboard/tiles/optimize-medical.vm"},
		{"id": 29, "title": "members/secure/dashboard/tiles/optimize-rx.vm"},
		{"id": 27, "title": "members/secure/dashboard/tiles/optimize-dental.vm"},
		{"id": 10, "title": "members/secure/dashboard/tiles/how-to-overthecounter.vm"},
		{"id": 43, "title": "members/secure/dashboard/tiles/dental-video.vm"},
		{"id": 11, "title": "members/secure/dashboard/tiles/how-to-usepharmacy.vm"},
		{"id": 47, "title": "members/secure/dashboard/tiles/dental-cost-estimator.vm"},
		{"id": 46, "title": "members/secure/dashboard/tiles/find-a-dentist.vm"},
		{"id": 9, "title": "members/secure/dashboard/tiles/find-a-drug.vm"},
		{"id": 69, "title": "members/secure/dashboard/tiles/rx-prior-review.vm"},
		{"id": 13, "title": "members/secure/dashboard/tiles/pharmacy-search.vm"},
		{"id": 54, "title": "members/secure/dashboard/tiles/rx-costestimator.vm"},
		{"id": 8, "title": "members/secure/dashboard/tiles/drug-claims.vm"},
		{"id": 41, "title": "members/secure/dashboard/tiles/medicare-information.vm"},
		{"id": 25, "title": "members/secure/dashboard/tiles/urgent-care-finder.vm"},
		{"id": 24, "title": "members/secure/dashboard/tiles/provider-search.vm"},
		{"id": 6, "title": "members/secure/dashboard/tiles/cost-estimator.vm"},
		{"id": 40, "title": "members/secure/dashboard/tiles/plan-comparison.vm"},
		{"id": 68, "title": "members/secure/dashboard/tiles/temp-id-card-over65.vm"},
		{"id": 1, "title": "members/secure/dashboard/tiles/temp-id-card.vm"},
		{"id": 34, "title": "members/secure/dashboard/tiles/socialmedia-twitter.vm"},
		{"id": 35, "title": "members/secure/dashboard/tiles/socialmedia-facebook.vm"},
		{"id": 36, "title": "members/secure/dashboard/tiles/socialmedia-pinterest.vm"},
		{"id": 38, "title": "members/secure/dashboard/tiles/socialmedia-youtube.vm"},
		{"id": 37, "title": "members/secure/dashboard/tiles/socialmedia-googleplus.vm"},
		{"id": 67, "title": "members/secure/dashboard/tiles/socialmedia-letstalkcost.vm"},
		{"id": 23, "title": "members/secure/dashboard/tiles/alere-phr.vm"},
		{"id": 31, "title": "members/secure/dashboard/tiles/blue365.vm"},
		{"id": 22, "title": "members/secure/dashboard/tiles/alere-maternity.vm"},
		{"id": 19, "title": "members/secure/dashboard/tiles/alere-healthylivingconversations.vm"},
		{"id": 51, "title": "members/secure/dashboard/tiles/health-assessment.vm"},
		{"id": 15, "title": "members/secure/dashboard/tiles/alere-healthcoaching.vm"},
		{"id": 20, "title": "members/secure/dashboard/tiles/alere-healthylivingprograms.vm"},
		{"id": 21, "title": "members/secure/dashboard/tiles/alere-monthlyseminar.vm"},
		{"id": 16, "title": "members/secure/dashboard/tiles/alere-knowledgebase.vm"},
		{"id": 39, "title": "members/secure/dashboard/tiles/preventive-care-guide.vm"},
		{"id": 26, "title": "members/secure/dashboard/tiles/faq-help.vm"},

		{"id": 32, "title": "members/secure/dashboard/tiles/socialmedia-membernews.vm"},
		{"id": 52, "title": "members/secure/dashboard/tiles/campaign-imem.vm"},
		{"id": 53, "title": "members/secure/dashboard/tiles/campaign-non-imem.vm"},
		{"id": 30, "title": "members/secure/dashboard/tiles/renew-policy.vm"},
		{"id": 48, "title": "members/secure/dashboard/tiles/easy-pay-blue.vm"}
	]
}
;
bcbsnc.dashboard.profile = {
	"dummy": "something"
};
bcbsnc.dashboard.custom = {
	//"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/state-bg.png"
	//"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/medicare-bg.png"
//	"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/hero-red-shirt.jpg"
//	"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/dental-hero-bg.png"
//	"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/MountainTop_Hero_light.jpg"
//	"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/MountainTop_Hero_dark.jpg"
	"backgroundImage":"/assets/members/public/dashboard/images/hero-bgs/quarter2.jpg"
};
bcbsnc.dashboard.alerts = [
	null
    ,{
        "id"              : "2",
        "cssClass"        : "warnMsg center",
        "iconClass"       : "fa-warning",
        "messageText"     : "<strong>Warning.</strong> This message is for indicating warnings."
    }
	,{
        "id"              : "1",
	    "cssClass"        : "successMsg center",
        "iconClass"       : "fa-check",
	    "messageText"     : "<strong>Welcome!</strong> Thank you for registering for BlueConnect! This is a success message."
	}
    ,{
        "id": "7",
         "cssClass": "infoMsg TNR1",
         "iconClass"       : "fa-warning",
         "messageText": "You may soon receive a tax form by mail from us to use on your federal income taxes. This form is needed for qualifying health plans in 2015. You can also <a href='/members/secure/account/tax1095b.htm'>download Form 1095-B here</a>. For tax-related questions, talk with your tax professional.",
         "faClass": "fa-info"
     },
	{
		"id" : 8,
		"cssClass" : "infoMsg hide invoiceBilling",
		"iconClass"     : "fa-warning",
		"messageText" : "March invoices have been mailed. These invoices indicate a due date of March 1. Due to the delay, we encourage you to pay by Tuesday, March 15. Go to Billing & Payment",
		"faClass" : "fa-info"
	},
	{
		"id" : 9,
		"cssClass" : "infoMsg hide bankDraftBilling",
		"iconClass"     : "fa-warning",
		"messageText": "March invoices are now available. We’ll begin processing your next bank draft payment on Thursday, March 3.",
		"faClass": "fa-info"
	},
	{
		"id": 10,
		"cssClass": "infoMsg hide autoPayBilling",
		"iconClass"     : "fa-warning",
		"messageText": "March invoices are now available. We’ll draft your credit card payment on approximately Saturday, March 5.",
		"faClass": "fa-info"
	}
    ,{
        "id": 18,
        "cssClass": "infoMsg",
        "iconClass"       : "fa-warning",
        "messageText": "<strong> IMPORTANT NOTE: AutoPay billing dates are changing.</strong> Starting in October, automatic payments (both recurring bank draft and recurring credit card) will be processed on the due date (1<sup>st</sup> of the month), and monthly bills will generate 5 days earlier. There are no changes if you're not enrolled in AutoPay.",
        "faClass": "fa-info"
    }
    //,{
     // "id"              : "3",
    	//"cssClass"        : "infoMsg center",
     // "iconClass"       : "fa-warning",
    	//"messageText"     : "<strong>Info.</strong> This message is for information."
    //}
	//,{
     // "id"              : "4",
     // "iconClass"       : "fa-warning",
	//	"cssClass"        : "systemErrorMsg center",
	//	"messageText"     : "<strong>Error!</strong> This is an error message!"
	//}
];
bcbsnc.dashboard.navItems = [
	{
		"url": "dashboard/index.htm",
		"title": ""
	}
	,{
		"url": "benefits/index.htm",
		"title": "Benefits"
	}
	,{
		"url": "claims/index.htm",
		"title": "Claims"
	},{
			"url": "doctors/index.htm",
			"title": "Doctors & Facilities"
	},
	,{
		"url": "wellness/index.htm",
		"title": "Wellness"
	}
	,{
		"url": "prescriptions/index.htm",
		"title": "Prescriptions"
	}
];
bcbsnc.dashboard.topNavItems = [
	{
		"url": "content/medicare/providersearch/index.htm",
		"title": "Find a Doctor"
	},
	{
		"url": "members/secure/prescriptions/index.htm",
		"title": "Find a Drug"
	},
	{
		"url": "content/azul/index.htm",
		"title": "Espa&ntilde;ol",
		"target": '_blank'
	}
];

bcbsnc.dashboard.onboardingSteps = [
	{
		title: "Welcome to Blue Connect.",
		position: "centered",
		description: "Would you like a tour?",
		width: 400
	}
	,{
		title: "Top Navigation",
		position: "bottom",
		description: "Click on any link in the blue bar at the top of the page to find more information about your plan.",
		attachTo: "#header-nav-menu",
		width: 500
	}
	,{
		title: "Your Profile",
		position: "right",
		description: "See your plan information, your policy number and effective dates. Need to add a policy, manage your contact preferences or get an ID card? You can do that here, too.",
		attachTo: "#profile-nav",
		width: 300,
		yOffset: -75,
		xOffset: -25
	}
	,{
	title: "HealthNAV",
		position: "right",
		description: "Find the highest quality, lowest cost provider, facility or treatment options in North Carolina or across the US.",
		attachTo: "#healthnav-nav",
		width: 300,
		yOffset: -50,
		xOffset: -25
	}
	,{
	title: "Blue Rewards",
		position: "right",
		description: "Learn about our incentive program for members who make healthy decisions about their health care. If you're eligible, use Blue Rewards to see your current reward status and the rewards options available.",
		attachTo: "#bluerewards-nav",
		width: 300,
		yOffset: -78,
		xOffset: -25
	}
	,{
	title: "Benefits and Claims",
	position: "left",
	description: "Get an at-a-glance view of all your covered services.",
	attachTo: "#status-panel",
	width: 300
	}
	,{
	title: "Things You Should Know",
	position: "right",
	description: "Blue Connect's tiles contain important information specific to you and your plan. From condition management to health care spending to preventive care, if it affects you or your plan, you'll find it here.",
	attachTo: "#tysk",
	yOffset: -85,
	xOffset: 8,
	width: 300
	}
	,{
	title: "My Interests",
	position: "right",
	description: "Your dashboard also features a collection of tiles that you control. Click Edit My Interests and you can add and rearrange the tiles you want to see when you visit Blue Connect.",
	attachTo: "#my-interests",
	yOffset: -94,
	xOffset: 8,
	width: 300
	},
	{
		title: "Survey",
		position: "right",
		description: "Your dashboard also features a collection of tiles that you control.",
		attachTo: "#survey",
		yOffset: -94,
		xOffset: 8,
		width: 300
	},
	{
		title: "That's It!",
		position: "centered",
		description: "Take the tour again anytime you like. Still have questions? Get the answers on our <a href=\"/members/secure/account/help.htm\">Frequently Asked Questions</a> page.",
		width: 400
	}
];

bcbsnc.dashboard.RUID = "FlcPWRyEFy88I6G887AeJI0B8D0=";

bcbsnc.dashboard.features = {};
bcbsnc.dashboard.features.dental = true;
bcbsnc.dashboard.features.prescriptions = true;
bcbsnc.dashboard.features.claimsOnly = false;
bcbsnc.dashboard.features.doctorsAndFacilities = true;
bcbsnc.dashboard.features.claims = true;
bcbsnc.dashboard.features.benefits = true;
bcbsnc.dashboard.features.wellness = true;
bcbsnc.dashboard.features.blueLink = true;
bcbsnc.dashboard.features.cpc = true;
bcbsnc.dashboard.features.blueLocalDukeWake = true;
bcbsnc.dashboard.fluPromo = false;
bcbsnc.dashboard.features.isOver65 = true;
bcbsnc.dashboard.features.isIndividual = true;
bcbsnc.dashboard.features.billingAndPayments = true;
bcbsnc.dashboard.features.stateHealthPlan = true;
bcbsnc.dashboard.features.isChatInboxPromoPeriod = true;


bcbsnc.dashboard.drugPolicy = "PDP | W12341234 | 01/01/2014-12/31/2014";
bcbsnc.dashboard.dentalPolicy = "Dental | W12341234 | “01/01/2014-12/31/2014";

bcbsnc.dashboard.rtdm = {};
bcbsnc.dashboard.rtdm.id = "FlcPWRyEFy88I6G887AeJI0B8D0=";

bcbsnc.dashboard.livechat = {};
bcbsnc.dashboard.livechat.isActive = true;

bcbsnc.dashboard.services = {};
bcbsnc.dashboard.services.rtdm = true;
bcbsnc.dashboard.services.claims = true;
bcbsnc.dashboard.services.benefits = true;

bcbsnc.dashboard.sso = {};
//bcbsnc.dashboard.sso.vendor =  "Mercer";
//bcbsnc.dashboard.sso.ssoid = "1234";

//add bluerewards for local dev
bcbsnc.thisMember.blueRewards = {
	available: 'Y' === 'Y' ? true : false
};


bcbsnc.dashboard.messages = {};

bcbsnc.dashboard.messages.statusPanelDental = {};
bcbsnc.dashboard.messages.statusPanelDental.message = null;
