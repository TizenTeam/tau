/*global module, test, equal, deepEqual, ok, CustomEvent */
(function (tau) {
	"use strict";

	module("widget.SplitView", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("widget.SplitView", 3, function () {
		var element = document.getElementById("empty-fixed"),
			widget = tau.engine.instanceWidget(element, "SplitView");

		equal(widget.option("fixed"), true, "SplitView is fixed");
		widget.option("fixed", false);
		equal(widget.option("fixed"), false, "SplitView is fixed");
		equal(widget.panes.length, 2, "SplitView has correct children count");
	});

	test("widget.SplitView", 1, function () {
		var element = document.getElementById("nested"),
			widget = tau.engine.instanceWidget(element, "SplitView");
		deepEqual(widget.option("ratio"), [0.4, 0.6], "SplitView has correct ratio");
	});

	test ("widget.SplitView", 6, function () {
		var element = document.getElementById("nested"),
			widget = tau.engine.instanceWidget(element, "SplitView"),
			mockEvent;
		mockEvent = new CustomEvent("vmousedown", {});
		mockEvent.clientX = 1;
		mockEvent.clientY = 1;
		widget.splitterTouchElement.dispatchEvent(mockEvent);
		equal(widget.movementData.hadDownEvent, true, "Down event received");

		mockEvent = new CustomEvent("vmousemove", {});
		mockEvent.clientX = 44;
		mockEvent.clientY = 20;
		widget.splitterTouchElement.dispatchEvent(mockEvent);
		equal(widget.movementData.lastX, mockEvent.clientX, "Splitter movement");
		equal(widget.movementData.lastY, mockEvent.clientY, "Splitter movement");

		mockEvent = new CustomEvent("vmousemove", {});
		mockEvent.clientX = 4;
		mockEvent.clientY = 2;
		widget.option("fixed", true);
		widget.splitterTouchElement.dispatchEvent(mockEvent);
		equal(widget.movementData.lastX, 44, "Splitter movement");
		equal(widget.movementData.lastY, 20, "Splitter movement");

		widget.option("fixed", false);
		mockEvent = new CustomEvent("vmouseup", {});
		mockEvent.clientX = 1;
		mockEvent.clientY = 1;
		widget.splitterTouchElement.dispatchEvent(mockEvent);
		equal(widget.movementData.hadDownEvent, false, "Up event received");
	});

	test("widget.SplitView", 2, function () {
		var element = document.getElementById("with-scrollview"),
			widget = tau.engine.instanceWidget(element, "SplitView"),
			newElement = document.createElement("div"),
			scrollView = document.getElementById("scrollview");
		tau.engine.instanceWidget(widget.panes[0], "Scrollview");
		widget.pane("#scrollview", newElement);
		equal(scrollView.children[0].children[0], newElement, "change pane in scrollview");
		scrollView.removeChild(scrollView.children[0]);
		equal(widget.pane("#scrollview", newElement), null, "change invalid pane");
	});

	test("widget.SplitView", 8, function () {
		var element = document.getElementById("nested"),
			widget = tau.engine.instanceWidget(element, "SplitView"),
			classes = tau.widget.mobile.SplitView.classes;

		ok(element.classList.contains(classes.uiSplitView), "SplitView has correct CSS class");
		ok(element.classList.contains(classes.uiDirectionVertical), "SplitView has ui-vertical class");

		widget.panes.forEach(function(pane){
			ok(pane.classList.contains(classes.uiPane), "SplitView pane has correct CSS class");
		});
		ok(widget.splitterTouchElement.classList.contains(classes.uiSplitter));
		ok(widget.splitterBar.classList.contains(classes.uiSplitterBar));
		ok(widget.splitterHandle.classList.contains(classes.uiSplitterHandle));
		ok(tau.util.DOM.getNSData(element, "tau-built"));
	});

	test("widget.SplitView", 2, function () {
		var element = document.getElementById("empty-fixed"),
			widget = tau.engine.instanceWidget(element, "SplitView"),
			classes = tau.widget.mobile.SplitView.classes;

		ok(element.classList.contains(classes.uiDirectionHorizontal), "SplitView has ui-horizontal CSS class");
		ok(widget.splitterBar.classList.contains(classes.uiFixed), "SplitView has ui-fixed CSS class");
	});

	test("widget.SplitView", 1, function () {
		var element = document.getElementById("nested"),
			widget = tau.engine.instanceWidget(element, "SplitView"),
			classes = tau.widget.mobile.SplitView.classes,
			mockEvent;

		mockEvent = new CustomEvent("vmousedown", {});
		mockEvent.clientX = 1;
		mockEvent.clientY = 1;
		widget.splitterTouchElement.dispatchEvent(mockEvent);
		ok(widget.splitterBar.classList.contains(classes.uiSplitterActive), "SplitView has ui-splitter-active CSS class");
	});
}(window.tau));
