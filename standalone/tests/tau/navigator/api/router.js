module("API");

test ( "tau" , function () {
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.autoInitializePage, 'boolean', 'Class tau.navigator.autoInitializePage exists');
	equal(typeof tau.firstPage, 'object', 'Class tau.navigator.firstPage exists');
	equal(typeof tau.changePage, 'function', 'Class tau.navigator.changePage exists');
	equal(typeof tau.back, 'function', 'Class tau.navigator.back exists');
	equal(typeof tau.initializePage, 'function', 'Class tau.navigator.initializePage exists');
	equal(typeof tau.pageContainer, 'object', 'Class tau.navigator.pageContainer exists');
	equal(typeof tau.rule, 'object', 'Class tau.navigator.rule exists');
	equal(typeof tau.openPopup, 'function', 'Class tau.navigator.openPopup exists');
	equal(typeof tau.closePopup, 'function', 'Class tau.navigator.closePopup exists');
});

test ( "tau.navigator" , function () {
	var navigator = tau.navigator;
	equal(typeof navigator.rule, 'object', 'Class tau.navigator.rule exists');
	equal(typeof navigator.open, 'function', 'Class tau.navigator.open exists');
	equal(typeof navigator.back, 'function', 'Class tau.navigator.back exists');
	equal(typeof navigator.history, 'object', 'Class tau.navigator.history exists');
});