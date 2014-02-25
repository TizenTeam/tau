module("BaseWidget", {
	teardown: function () {
		ej.engine._clearBindings();
	}
});

var BaseWidget = ej.widget.BaseWidget,
	BasicWidget = function () {
		this.property = 1;
	},
	TestWidget = function () {
		this.property = 5;
	};

function setupTestWidget() {
	TestWidget.prototype = new BaseWidget();
	TestWidget.prototype._configure = function () {
		ok(true, "Function _configure was called");
	};
	TestWidget.prototype._build = function (template, element) {
		ok(true, "Function _build was called");
		return element;
	};
	TestWidget.prototype._init = function () {
		ok(true, "Function _init was called");
	};
	TestWidget.prototype._buildBindEvents = function () {
		ok(true, "Function _buildBindEvents was called");
	};
	TestWidget.prototype._bindEvents = function () {
		ok(true, "Function _bindEvents was called");
	};
	TestWidget.prototype._destroy = function () {
		ok(true, "Function _destroy was called");
	};
	TestWidget.prototype._disable = function () {
		ok(true, "Function _disable was called");
	};
	TestWidget.prototype._enable = function () {
		ok(true, "Function _enable was called");
	};
	TestWidget.prototype._refresh = function () {
		ok(true, "Function _refresh was called");
	};
	TestWidget.prototype._getValue = function () {
		ok(true, "Function _getValue was called");
		return this.property;
	};
	TestWidget.prototype._setValue = function (value) {
		this.property = value;
		ok(true, "Function _setValue was called");
		return true;
	};
	ej.engine.defineWidget(
		"TestWidget",
		"",
		"[data-role='test']",
		[
		],
		TestWidget,
		"mobile"
	);
}

function setupBasicWidget() {
	BasicWidget.prototype = new BaseWidget();

	BaseWidget.prototype._configure = function () {
		this.options.option1 = "old";
		this.options.optionA = "old";
	}

	BaseWidget.prototype._getProperty = function () {
		return this.property;
	}
	BaseWidget.prototype._setProperty = function (element, value) {
		ok (true, "Function _setProperty was called");
		this.property = value;
	}
	BaseWidget.prototype._refresh = function (element, value) {
		ok (true, "Function _refresh was called");
	}
	ej.engine.defineWidget(
		"BasicWidget",
		"",
		"",
		[
		],
		BasicWidget,
		"mobile"
	);
}

setupTestWidget();
setupBasicWidget();

test ("Protected functions", 15, function () {
	var elem = document.getElementById("test"),
		widget;

	widget = ej.engine.instanceWidget(elem, "TestWidget");
	deepEqual(widget.disable(), widget, "Function disable returns widget");
	deepEqual(widget.enable(), widget, "Function enable returns widget");
	deepEqual(widget.refresh(), widget, "Function refresh returns widget");
	widget.value();
	widget.value(5);
	widget.destroy();
});

test ("Function build", function () {
	var elem = document.getElementsByClassName("option")[0],
		widget;

	equal(elem.hasAttribute("data-ej-built"), false, "Element doesn't have attribute data-ej-built before building");
	equal(elem.hasAttribute("data-ej-binding"), false, "Element doesn't have attribute data-ej-binding before building");
	equal(elem.hasAttribute("data-ej-name"), false, "Element doesn't have attribute data-ej-name before building");
	equal(elem.hasAttribute("data-ej-selector"), false, "Element doesn't have attribute data-ej-selector before building");
	equal(elem.hasAttribute("id"), false, "Element doesn't have id before building");
	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	equal(elem.hasAttribute("data-ej-built"), true, "Element doesn't have attribute data-ej-built before building");
	equal(elem.hasAttribute("data-ej-binding"), true, "Element doesn't have attribute data-ej-binding before building");
	equal(elem.hasAttribute("data-ej-name"), true, "Element doesn't have attribute data-ej-name before building");
	equal(elem.hasAttribute("data-ej-selector"), true, "Element doesn't have attribute data-ej-selector before building");
	equal(elem.hasAttribute("id"), true, "Element doesn't have id before building");
});

test ("Functions configure and _getCreateOptions", function () {
	var elem = document.getElementById("widget"),
		widget;

	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	equal(typeof widget._getCreateOptions(elem), "object", "Function _getCreateOptions returns object");
	equal(widget.options.option1, "new", "Widget has new value of option1");
	equal(widget.options.optionA, "new", "Widget has new value of optionA");
});


test ("Function bindEvents - event beforecreate", 1, function () {
	var elem = document.getElementById("widget"),
		widget;

	elem.addEventListener("basicwidgetbeforecreate", function(){
		ok(true, "beforecreate event");
	});
	widget = ej.engine.instanceWidget(elem, "BasicWidget");
});

test ("Function value", 15, function () {
	var elem = document.getElementById("value"),
		widget;

	widget = ej.engine.instanceWidget(elem, "TestWidget");
	equal(widget.value(), 5, "Function value() returns value of widget");
	equal(widget.value(10), true, "Function value(10) returns value of _setValue function");
	equal(widget.value(), 10, "Function value() returns value of widget");
	widget.destroy();

	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	deepEqual(widget.value(), widget, "Function value() returns widget's object if _getValue isn't defined");
	deepEqual(widget.value(10), widget, "Function value(10) returns widget's object if _setValue isn't defined");
});

test ("Function widget", function () {
	var elem = document.getElementById("widget"),
		widget;

	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	deepEqual(widget.widget(), elem, "Function widget returns HTML element of widget");
});

test ("Functions: isBound, isBuilt", function () {
	var elem = document.getElementById("test"),
		widget;

	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	equal(widget.isBound(), true, "Function widget returns value of data-ej-bound");
	equal(widget.isBuilt(), true, "Function widget returns value of data-ej-built");
	elem.removeAttribute("data-ej-bound");
	elem.removeAttribute("data-ej-built");
	equal(widget.isBound(), false, "Function widget returns value of data-ej-bound");
	equal(widget.isBuilt(), false, "Function widget returns value of data-ej-built");
});

test ("Functions: option", 8, function () {
	var elem = document.getElementsByClassName("option")[0],
		widget;

	widget = ej.engine.instanceWidget(elem, "BasicWidget");

	equal(typeof widget.option(5), "undefined", "If the first argument isn't string, function returns nothing");
	equal(widget.option("property"), 1, "Function option with 1 arguments calls _getProperty (if exists) or returns value of given option");
	equal(typeof widget.option("property", 4), "undefined", "Function option with 2 arguments calls _setProperty (if exists) and returns nothing");

	equal(typeof widget.option("newproperty", 1), "undefined", "Function with 2 arguments calls _setNewproperty (if exists) and returns nothing");
	equal(widget.option("newproperty"), 1, "Function with 1 arguments calls _getNewproperty (if exists) and returns value of given property");
	equal(elem.getAttribute("data-newproperty"), 1, "New attribute is set");
});

test ("Function destroy", function () {
	var elem = document.getElementById("widget"),
		widget;

	widget = ej.engine.instanceWidget(elem, "BasicWidget");
	equal(typeof widget, "object", "Widget is built");
	equal(widget.isBound(), true, "Attribute data-ej-bound is set");
	widget.destroy();
	equal(widget.isBound(), false, "Attribute data-ej-bound isn't set");
});

test ("Function bindEvents - event create", 1, function () {
	var elem = document.getElementById("widget"),
		widget;

	elem.addEventListener("basicwidgetcreate", function(){
		ok(true, "create event");
	});
	widget = ej.engine.instanceWidget(elem, "BasicWidget");
});

