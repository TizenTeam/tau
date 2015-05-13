$().ready(function() {
	module("profile/mobile/widget/mobile/ActivityIndicator", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "ActivityIndicator with option", function () {
		var activityLarge = document.getElementById("activity-large"),
			activityMedium = document.getElementById("activity-medium"),
			activitySmall = document.getElementById("activity-small");

		ok(activityLarge.classList.contains("ui-activity-indicator"), 'ActivityIndicator has ui-activity-indicator class');
		ok(activityLarge.classList.contains("ui-activity-indicator-large"), 'ActivityIndicator has ui-activity-indicator-large class');
		ok(activityMedium.classList.contains("ui-activity-indicator-medium"), 'ActivityIndicator has ui-activity-indicator-medium class');
		ok(activitySmall.classList.contains("ui-activity-indicator-small"), 'ActivityIndicator has ui-activity-indicator-small class');
	});

	test ( "ActivityIndicator default size", function () {
		var activityDefault = document.getElementById("activity-default");

		ok(activityDefault.classList.contains("ui-activity-indicator"), 'ActivityIndicator has ui-activity-indicator class');
		ok(activityDefault.classList.contains("ui-activity-indicator-medium"), 'ActivityIndicator has ui-activity-indicator-medium class');
	});
});
