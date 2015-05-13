(function (ns) {
	'use strict';
	module("profile/mobile/widget/mobile/ActivityIndicator", {
		});

	test ( "API ns.widget.ActivityIndicator" , function () {
		var widget, activityIndicator;
		equal(typeof ns, 'object', 'Class ns exists');
		equal(typeof ns.widget, 'object', 'Class ns.widget exists');
		equal(typeof ns.widget.mobile, 'object', 'Class ns.widget.mobile exists');
		equal(typeof ns.widget.mobile.ActivityIndicator, 'function', 'Class ns.widget.mobile.ActivityIndicator exists');

		widget = ns.engine.instanceWidget(document.getElementById("activity"), "ActivityIndicator");
		activityIndicator = ns.widget.mobile.ActivityIndicator;

		equal(typeof widget.configure, 'function', 'Method activityIndicator.configure exists');
		equal(typeof widget.build, 'function', 'Method activityIndicator.build exists');
		equal(typeof widget.init, 'function', 'Method activityIndicator.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method activityIndicator.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method activityIndicator.destroy exists');
		equal(typeof widget.disable, 'function', 'Method activityIndicator.disable exists');
		equal(typeof widget.enable, 'function', 'Method activityIndicator.enable exists');
		equal(typeof widget.refresh, 'function', 'Method activityIndicator.refresh exists');
		equal(typeof widget.option, 'function', 'Method activityIndicator.option exists');

		equal(typeof widget.options, 'object', 'Property  exists');
		equal(typeof widget.options.size, 'string', 'Property  exists');
		equal(typeof activityIndicator.classes, 'object', 'Property activityIndicator.classes exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorSmall, 'string', 'Property activityIndicator.classes.uiActivityIndicatorSmall exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorMedium, 'string', 'Property activityIndicator.classes.uiActivityIndicatorMedium exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorLarge, 'string', 'Property activityIndicator.classes.uiActivityIndicatorLarge exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorCircle1, 'string', 'Property activityIndicator.classes.uiActivityIndicatorCircle1 exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorCircle2, 'string', 'Property activityIndicator.classes.uiActivityIndicatorCircle2 exists');
		equal(typeof activityIndicator.classes.uiActivityIndicatorCircle3, 'string', 'Property activityIndicator.classes.uiActivityIndicatorCircle3 exists');
		equal(typeof activityIndicator.classes.uiCircle1Svg, 'string', 'Property activityIndicator.classes.uiCircle1Svg exists');
		equal(typeof activityIndicator.classes.uiCircle2Svg, 'string', 'Property activityIndicator.classes.uiCircle2Svg exists');
		equal(typeof activityIndicator.classes.uiCircle3Svg, 'string', 'Property activityIndicator.classes.uiCircle3Svg exists');
		equal(typeof activityIndicator.classes.uiCircle1In, 'string', 'Property activityIndicator.classes.uiCircle1In exists');
		equal(typeof activityIndicator.classes.uiCircle2In, 'string', 'Property activityIndicator.classes.uiCircle2In exists');
		equal(typeof activityIndicator.classes.uiCircle3In, 'string', 'Property activityIndicator.classes.uiCircle3In exists');

		equal(typeof widget._build, 'function', 'Method activityIndicator._build exists');
		equal(typeof widget._init, 'function', 'Method activityIndicator._init exists');
	});
}(ej));
