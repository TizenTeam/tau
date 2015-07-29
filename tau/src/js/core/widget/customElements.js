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
				registerdTags = {};

			function defineCustomElement(event) {
				try {
					var name = event.detail.name,
						BaseElement = event.detail.BaseElement || HTMLElement,
						CustomWidgetProto = Object.create(BaseElement.prototype),
						//define types on elements defined by is selector
						controlTypes = ["search", "text"],
						//define if to use elements with is attribute
						controlElements = [{"input" :"input"}, {"dropdownmenu": "select"}],
						customElements = ["dropdownmenu"],
						lowerName = name.toLowerCase(),
						tagName = "tau-" + lowerName,
						extendTo = "";

					[].forEach.call(controlElements, function(item) {
						// if element is a control then set the proper type
						var elementKey = Object.keys(item)[0];
						if (lowerName && lowerName.indexOf(elementKey) !== -1) {
							extendTo = item[elementKey];
						}
					});

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
									self.type = item;
									return true;
								}
							});
						}

						self._tauWidget = engine.instanceWidget(self, self._tauName);
					};

					CustomWidgetProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
						if (this._tauWidget) {
							if (this._tauWidget.options[attrName] !== undefined) {
								if (newVal === "false") {
									newVal = false;
								}
								if (newVal === "true") {
									newVal = true;
								}
								this._tauWidget.option(attrName, newVal);
								this._tauWidget.refresh();
							}
						}
					};

					CustomWidgetProto.attachedCallback = function () {
						if (this._tauWidget) {
							this._tauWidget.refresh();
						}
					};

					if (registerdTags[tagName]) {
						ns.warn(tagName + " already registred");
					} else {
						if (extendTo !== "") {
							registerdTags[tagName] = document.registerElement(tagName, {extends: extendTo, prototype: CustomWidgetProto});
						} else {
							registerdTags[tagName] = document.registerElement(tagName, {prototype: CustomWidgetProto});
						}
					}

				} catch (e) {
					console.log(e);
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
