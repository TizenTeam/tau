module("ej.widget.SplitView", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("empty-fixed"),
		widget = ej.engine.instanceWidget(element, "SplitView");

	equal(widget.option("fixed"), true, "SplitView is fixed");
	widget.option("fixed", false);
	equal(widget.option("fixed"), false, "SplitView is fixed");
	equal(widget.panes.length, 2, "SplitView has correct children count");
});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("nested"),
		widget = ej.engine.instanceWidget(element, "SplitView");
	deepEqual(widget.option("ratio"), [0.4, 0.6], "SplitView has correct ratio");
});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("nested"),
		nestedElement = document.getElementById("child-splitview"),
		widget = ej.engine.instanceWidget(element, "SplitView"),
		nestedWidget = ej.engine.instanceWidget(nestedElement, "SplitView"),
		mockEvent = null;
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

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("with-scrollview"),
		widget = ej.engine.instanceWidget(element, "SplitView"),
		newElement = document.createElement("div"),
		scrollView = document.getElementById("scrollview");
	ej.engine.instanceWidget(widget.panes[0], "Scrollview");
	widget.pane("#scrollview", newElement);
	equal(scrollView.children[0].children[0], newElement, "change pane in scrollview");
	scrollView.removeChild(scrollView.children[0]);
	equal(widget.pane("#scrollview", newElement), null, "change invalid pane");
});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("nested"),
		widget = ej.engine.instanceWidget(element, "SplitView"),
		classes = ej.widget.SplitView.classes;

	ok(element.classList.contains(classes.uiSplitView), "SplitView has correct CSS class");
	ok(element.classList.contains(classes.uiDirectionVertical), "SplitView has ui-vertical class");

	widget.panes.forEach(function(pane, i){
		ok(pane.classList.contains(classes.uiPane), "SplitView pane has correct CSS class");
	});
	ok(widget.splitterTouchElement.classList.contains(classes.uiSplitter));
	ok(widget.splitterBar.classList.contains(classes.uiSplitterBar));
	ok(widget.splitterHandle.classList.contains(classes.uiSplitterHandle));
	ok(ej.utils.DOM.getNSData(element, "ej-built"));
});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("empty-fixed"),
		widget = ej.engine.instanceWidget(element, "SplitView"),
		classes = ej.widget.SplitView.classes;

	ok(element.classList.contains(classes.uiDirectionHorizontal), "SplitView has ui-horizontal CSS class");
	ok(widget.splitterBar.classList.contains(classes.uiFixed), "SplitView has ui-fixed CSS class");
});

test ( "ej.widget.SplitView" , function () {
	var element = document.getElementById("nested"),
		widget = ej.engine.instanceWidget(element, "SplitView"),
		classes = ej.widget.SplitView.classes;

	mockEvent = new CustomEvent("vmousedown", {});
	mockEvent.clientX = 1;
	mockEvent.clientY = 1;
	widget.splitterTouchElement.dispatchEvent(mockEvent);
	ok(widget.splitterBar.classList.contains(classes.uiSplitterActive), "SplitView has ui-splitter-active CSS class");
});