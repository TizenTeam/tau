/*global window, define, ns, HTMLElement */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*
 * #Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"../engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				registeredTags = {};

			function defineCustomElement(event) {
				try {
					var name = event.detail.name,
						BaseElement = event.detail.BaseElement || HTMLElement,
						CustomWidgetProto = Object.create(BaseElement.prototype),
						//define types on elements defined by is selector
						controlTypes = ["search", "text", "slider", "checkbox", "radio", "button"],
						//define if to use elements with is attribute
						lowerName = name.toLowerCase(),
						tagName = "tau-" + lowerName,
						extendTo = "";

					switch (BaseElement.name) {
						case "HTMLInputElement" :
							extendTo = "input";
							break;
						case "HTMLSelectElement" :
							extendTo = "select";
							break;
						case "HTMLTextAreaElement" :
							extendTo = "textarea";
							break;
						case "HTMLButtonElement" :
							extendTo = "button";
							break;
					}

					CustomWidgetProto._tauName = name;

					CustomWidgetProto.createdCallback = function () {
						var self = this,
							//needs to be extended for elements which will be extended by "is" attribute
							//it should contain the type in the name like "search" in 'tau-inputsearch'
							itemText = self.getAttribute("is");

						if (itemText) {
							[].some.call(controlTypes, function(item) {
								// if element is a control then set the proper type
								if (itemText && itemText.indexOf(item) !== -1) {
									switch (item) {
										case "slider":
											//force proper type as cannot extract this from name
											self.type = "range";
											break;
										default:
											self.type = item;
											break;
									}
									return true;
								}
							});
						}

						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("creating custom element:", self._tauName);
						//>>excludeEnd("tauDebug");

						self._tauWidget = engine.instanceWidget(self, self._tauName);
					};

					CustomWidgetProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
						var tauWidget = this._tauWidget;
						if (tauWidget) {
							if (attrName === "value") {
								tauWidget.value(newVal);
							} else if (tauWidget.options && tauWidget.options[attrName] !== undefined) {
								if (newVal === "false") {
									newVal = false;
								}
								if (newVal === "true") {
									newVal = true;
								}

								tauWidget.option(attrName, newVal);
								tauWidget.refresh();
							}
						}
					};

					CustomWidgetProto.attachedCallback = function () {
						if (this._tauWidget && this._tauWidget.state !== "destroying") {
							this._tauWidget.refresh();
						}
					};

					if (registeredTags[tagName]) {
						ns.warn(tagName + " already registred");
					} else {
						if (extendTo !== "") {
							registeredTags[tagName] = document.registerElement(tagName, {extends: extendTo, prototype: CustomWidgetProto});
						} else {
							registeredTags[tagName] = document.registerElement(tagName, {prototype: CustomWidgetProto});
						}
					}

				} catch (e) {
					ns.log(e);
				}
			}

			if (typeof document.registerElement === "function" && ns.getConfig("registerCustomElements", true)) {
				document.addEventListener("widgetdefined", defineCustomElement);
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
