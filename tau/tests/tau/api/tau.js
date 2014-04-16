module("API tau");

test ( "API tau" , function () {
	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.noConflict, 'function', 'Class tau.noConflict exists');
});