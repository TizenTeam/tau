document.addEventListener('DOMContentLoaded', function() {
	module("gear.ui");
	
	test ( "gear.ui.noConflict" , function () {
		var gearUI = window.gear,
			gearUInoConflict = null;
		equal(window.gear.ui.v, undefined, 'object gear.ui was changed');
		gearUInoConflict = window.gear.ui.noConflict();
		equal(window.gear.ui.v, 'old', 'object gear.ui was restored');
		equal(gearUI, gearUInoConflict, 'object noConflict return new gear.ui object');
	});
});