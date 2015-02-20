/*global test, module, asyncTest, ok, equal, strictEqual, start, console */
/*jslint browser: true, nomen: true */
(function (tau) {
	"use strict";

	module("profile/tv/widget/Popup - API");

	test("Architecture", 1, function () {
		var tauWidget = tau.widget,
			Popup = tauWidget.tv.Popup;

		ok(Popup.prototype instanceof tauWidget.core.ContextPopup, "Popup prototype is an instance of core.ContextPopup");
	});

	test("Class properties", 11, function () {
		var tauWidget = tau.widget,
			Popup = tauWidget.tv.Popup,
			referenceClasses = {
				toast: "ui-popup-toast",
				headerEmpty: "ui-header-empty",
				footerEmpty: "ui-footer-empty",
				content: "ui-popup-content",
				custom: "ui-popup-custom",
				notification: "ui-popup-notification",
				headerIcon: "ui-popup-header-icon",
				focus: "ui-focus",
				uiPage: tauWidget.tv.Page.classes.uiPage
			},
			classes = Popup.classes,
			events = Popup.events;

		strictEqual(typeof classes, "object", ".classes property is defined");

		Object.keys(referenceClasses).forEach(function (key) {
			strictEqual(classes[key], referenceClasses[key], ".classes['" + key + "'] == '" + classes[key] + "' class is defined");
		});

		strictEqual(typeof events, "object", ".events property is defined");
	});

	test("Instance properties", 21, function () {
		var tauWidget = tau.widget,
			engine = tau.engine,
			Popup = tauWidget.tv.Popup,
			instance,
			instanceAction,
			utilObject = tau.util.object,
			fixture = document.getElementById("qunit-fixture"),
			element = document.createElement("div"),
			elementAction = document.createElement("div"),
			buttonElement = document.createElement("button"),
			referenceSelectors = {
				header: "header",
				content: "div",
				footer: "footer"
			},
			referenceOptions = {
				arrow: "t,b,l,r",
				distance: 16,
				positionTo: "window",
				headerIcon: null,
				mainColor: null,
				autofocus: 0,
				timeout: 5000
			},
			referenceOptionsAction = utilObject.copy(referenceOptions);

		// For action type popup the timeout is different
		referenceOptionsAction.timeout = 60000;

		elementAction.appendChild(buttonElement);
//		engine.instanceWidget(inputElement, "Textbox");

		elementAction.classList.add("ui-popup-notification");
		element.classList.add("ui-popup-notification");

		fixture.appendChild(element);
		fixture.appendChild(elementAction);

		instance = engine.instanceWidget(element, "Popup");
		instanceAction = engine.instanceWidget(elementAction, "Popup");

		ok(instance instanceof Popup, "Proper instance is created");

		strictEqual(typeof instance.options, "object", ".options property is defined (normal popup)");

		Object.keys(referenceOptions).forEach(function (key) {
			strictEqual(instance.options[key], referenceOptions[key], ".options['" + key + "'] == " + instance.options[key] + " (normal popup)");
		});

		strictEqual(typeof instanceAction.options, "object", ".options property is defined (action popup)");

		Object.keys(referenceOptionsAction).forEach(function (key) {
			strictEqual(instanceAction.options[key], referenceOptionsAction[key], ".options['" + key + "'] == " + instanceAction.options[key] + " (action popup)");
		});

		strictEqual(typeof instance.selectors, "object", ".selector property is defined");

		Object.keys(referenceSelectors).forEach(function (key) {
			strictEqual(instance.selectors[key], referenceSelectors[key], ".selectors['" + key + "'] == " + instance.selectors[key]);
		});
	});
}(window.tau));
