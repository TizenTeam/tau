/*global jQuery, module, asyncTest, test, equal, deepEqual, ok, CustomEvent, start, stop */
(function (tau) {
	"use strict";

	module("API widget.SplitView");

	test("Static properties", 3, function () {
		equal(typeof tau.widget.SplitView, 'function', 'Class tau.widget.SplitView exists');
		equal(typeof tau.widget.mobile.SplitView, 'function', 'Class tau.widget.mobile.SplitView exists');
		equal(typeof tau.widget.mobile.SplitView.classes, 'object', '.classes property exists');
	});

	test("Static properties - classes property", 11, function () {
		var classes = tau.widget.mobile.SplitView.classes,
			classesThatShouldExist = {
				uiPane :'ui-pane',
				uiSplitView : 'ui-splitview',
				uiDirectionHorizontal : 'ui-direction-horizontal',
				uiDirectionVertical : 'ui-direction-vertical',
				uiPageActive : 'ui-page-active',
				uiSplitter : 'ui-spliter',
				uiSplitterBar : 'ui-spliter-bar',
				uiSplitterHandle : 'ui-spliter-handle',
				uiSplitterActive : 'ui-spliter-active',
				uiFixed : 'ui-fixed'
			};
		equal(Object.keys(classes).length, 10, '.classes property object contains 10 elements');
		Object.keys(classesThatShouldExist).forEach(function (classKey) {
			equal(classes[classKey], classesThatShouldExist[classKey], ".classes['" + classKey + "'] === '" + classesThatShouldExist[classKey] + "'");
		});
	});

	test("Instance properties and methods", 19, function() {
		var widget = new tau.widget.mobile.SplitView();

		equal(typeof widget.configure, 'function', 'Method SplitView.configure exists');
		equal(typeof widget.build, 'function', 'Method SplitView.build exists');
		equal(typeof widget.init, 'function', 'Method SplitView.init exists');
		equal(typeof widget.bindEvents, 'function', 'Method SplitView.bindEvents exists');
		equal(typeof widget.destroy, 'function', 'Method SplitView.destroy exists');
		equal(typeof widget.disable, 'function', 'Method SplitView.disable exists');
		equal(typeof widget.enable, 'function', 'Method SplitView.enable exists');
		equal(typeof widget.refresh, 'function', 'Method SplitView.refresh exists');
		equal(typeof widget.option, 'function', 'Method SplitView.option exists');

		equal(typeof widget._build, 'function', 'Method SplitView._build exists');
		equal(typeof widget._bindEvents, 'function', 'Method SplitView._bindEvents exists');
		equal(typeof widget._init, 'function', 'Method SplitView._init exists');
		equal(typeof widget._destroy, 'function', 'Method SplitView._destroy exists');

		equal(typeof widget._setRatio, 'function', 'Method SplitView._setRatio exists');
		equal(typeof widget._setDividerVertical, 'function', 'Method SplitView._setDividerVertical exists');
		equal(typeof widget._setFixed, 'function', 'Method SplitView._setFixed exists');

		equal(typeof widget.pane, 'function', 'Method SplitView.pane exists');
		equal(typeof widget.restore, 'function', 'Method SplitView.restore exists');
		equal(typeof widget.maximize, 'function', 'Method SplitView.maximize exists');
	});
}(window.tau));