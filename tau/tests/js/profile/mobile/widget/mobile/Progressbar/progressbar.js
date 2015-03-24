$().ready(function() {
	module("profile/mobile/widget/mobile/Progressbar", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test ( "Progressbar activity style", function () {
		var progressActivity = document.getElementById("progressActivity"),
			progressActivityValue = progressActivity.querySelector(".ui-progressbar-value");

		ok(progressActivity.classList.contains("ui-progressbar"), 'Progressbar has ui-progressbar class');
		ok(progressActivityValue.classList.contains("ui-progressbar-activity"), 'Activity style has ui-progressbar-activity class in value element');
	});

	test ( "Progressbar progressbar style", function () {
		var progressBar = document.getElementById("progressBar"),
			progressBarValue = progressBar.querySelector(".ui-progressbar-value");

		ok(progressBar.classList.contains("ui-progressbar"), 'Progressbar has ui-progressbar class');
		ok(progressBarValue.classList.contains("ui-progressbar-value-front"), 'Progressbar style has ui-progressbar-value-front class in value element');
		ok(progressBarValue.nextSibling.classList.contains("ui-progressbar-value-back"), 'Progressbar style has ui-progressbar-value-back element');
	});
});
