/*global QUnit, define, require */
/* eslint no-unused-vars: off */
var allTestFiles = [],
	TEST_REGEXP = /^\/base\/tests\/karma.*test\.js$/,
	testCount = 0,
	qunitTest = QUnit.test,
	ns = {},
	nsConfig = {
		"autorun": false
	},
	testPaths = [
		"profile/mobile/config",
		"profile/wearable/config",
		"core/widget/core/Page",
		"core/widget/core/Checkbox",
		"core/widget/core/Radio",
		"core/widget/core/Slider",
		"core/widget/core/PageContainer",
		"core/widget/core/Popup",
		"core/widget/core/PanelChanger",
		"core/widget/core/SectionChanger",
		"core/event/vmouse",
		"core/event/throttledresize",
		"profile/mobile/widget/mobile/Popup",
		"profile/mobile/widget/mobile/Listview",
		"profile/mobile/widget/mobile/TextEnveloper",
		"profile/mobile/widget/mobile/TextInput",
		"profile/mobile/widget/mobile/GridView",
		"profile/mobile/widget/mobile/FloatingActions",
		"profile/wearable/helper/SnapListMarqueeStyle",
		"profile/wearable/widget/wearable/SnapListview",
		"profile/wearable/widget/wearable/ArcListview",
		"profile/wearable/widget/wearable/Scrollview",
		"profile/wearable/widget/wearable/ColorPicker",
		"core/defaults",
		"core/support/tizen",
		"core/util",
		"core/util/array",
		"core/util/DOM/css",
		"core/util/DOM/attributes",
		"core/util/DOM/manipulation",
		"core/util/easing",
		"core/util/polar",
		"core/util/date",
		"core/util/string",
		"core/util/rotaryScrolling",
		"core/util/anchorHighlight",
		"core/event/gesture/Manager",
		"core/event/gesture/Instance",
		"core/event/gesture/Drag",
		"core/event/gesture/LongPress",
		"core/event/gesture/Pinch",
		"core/event/gesture/Swipe",
		"profile/wearable/router/route/grid",
		"core/widget/core/tab/Tabbar",
		"profile/wearable/widget/wearable/Grid",
		"profile/wearable/widget/wearable/CircleIndicator",
		"profile/wearable/widget/wearable/NumberPicker"
	];

window.tauPerf = {
	start: function () {

	},
	get: function () {

	}
};

QUnit.test = window.test = function () {
	testCount += 1;
	qunitTest.apply(this, arguments);
};

QUnit.begin(function (args) {
	args.totalTests = testCount;
});

function pathToModule(path) {
	return path.replace(/^\/base\//, "").replace(/\.js$/, "");
}

QUnit.config.autostart = false;

Object.keys(window.__karma__.files).forEach(function (file) {
	if (TEST_REGEXP.test(file)) {
		// Normalize paths to RequireJS module names.
		allTestFiles.push(pathToModule(file));
	}
});

testPaths.forEach(function (testPath) {
	var module = testPath.split("/").pop();

	define(testPath,
		[
			"tests/karma/tests/helpers",
			"tests/js/" + testPath + "/" + module,
			"src/js/" + testPath
		],
		function (helpers, runTests, object) {
			console.log(testPath);
			runTests(object, helpers);
		});
	allTestFiles.push(testPath);
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: "/base",

	// example of using a couple path translations (paths), to allow us to refer to different library dependencies, without using relative paths
	paths: {
		"src": "/base/src"
	},


	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});
