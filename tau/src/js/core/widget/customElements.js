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
			var engine = ns.engine;

			function defineCustomElement(event) {
				try {
					var name = event.detail.name,
						BaseElement = event.detail.BaseElement || HTMLElement,
						CustomWidgetProto = Object.create(BaseElement.prototype);

					CustomWidgetProto._tauName = name;

					CustomWidgetProto.createdCallback = function () {
						this._tauWidget = engine.instanceWidget(this, this._tauName);
					};

					CustomWidgetProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
						if (this._tauWidget) {
							console.log(attrName, attrName.indexOf("data"));
							if (attrName.indexOf("data") !== 0 && attrName.indexOf("tau") !== 0 && attrName !== "class") {
								if (newVal === "false") {
									newVal = false;
								}
								if (newVal === "true") {
									newVal = true;
								}
								console.log("changed attr", attrName, oldVal, newVal);
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

					CustomWidgetProto.detachedCallback = function () {
						if (this._tauWidget) {
							this._tauWidget.destroy();
						}
					};

					document.registerElement("tau-" + name.toLowerCase(), {prototype: CustomWidgetProto});
				} catch (e) {
					console.log(e);
				}
			}

			if (typeof document.registerElement === "function") {
				document.addEventListener("widgetdefined", defineCustomElement);

				ns.setConfig("useDataAttributes", false, true);
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
