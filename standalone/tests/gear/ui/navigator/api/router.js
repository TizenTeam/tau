module("API");

test ( "gear.ui" , function () {
	equal(typeof gear, 'object', 'Class gear exists');
	equal(typeof gear.ui, 'object', 'Class gear.ui exists');
	equal(typeof gear.ui.autoInitializePage, 'boolean', 'Class gear.ui.navigator.autoInitializePage exists');
	equal(typeof gear.ui.firstPage, 'object', 'Class gear.ui.navigator.firstPage exists');
	equal(typeof gear.ui.changePage, 'function', 'Class gear.ui.navigator.changePage exists');
	equal(typeof gear.ui.back, 'function', 'Class gear.ui.navigator.back exists');
	equal(typeof gear.ui.initializePage, 'function', 'Class gear.ui.navigator.initializePage exists');
	equal(typeof gear.ui.pageContainer, 'object', 'Class gear.ui.navigator.pageContainer exists');
	equal(typeof gear.ui.rule, 'object', 'Class gear.ui.navigator.rule exists');
	equal(typeof gear.ui.openPopup, 'function', 'Class gear.ui.navigator.openPopup exists');
	equal(typeof gear.ui.closePopup, 'function', 'Class gear.ui.navigator.closePopup exists');
});

test ( "gear.ui.navigator" , function () {
	var navigator = gear.ui.navigator;
	equal(typeof navigator.rule, 'object', 'Class gear.ui.navigator.rule exists');
	equal(typeof navigator.open, 'function', 'Class gear.ui.navigator.open exists');
	equal(typeof navigator.back, 'function', 'Class gear.ui.navigator.back exists');
	equal(typeof navigator.history, 'object', 'Class gear.ui.navigator.history exists');
});