/*global window, define */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 * ## JavaScript API
 *
 * Box widget for layout.
 *
 * @class ns.widget.core.Box
 * @extends ns.widget.core.LayoutDOMWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../../util/selectors",
			"../../util/DOM/attributes",
			"../../support",
			"./LayoutDOMWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var CoreLayoutWidget = ns.widget.core.LayoutDOMWidget,
				engine = ns.engine,
				objectUtil = ns.util.object,

				Box = function () {
					this.options = {
						layout: "default",
						layoutAlign: "left",
						verticalAlign: "top",
						horizontalSpacing: 0,
						verticalSpacing: 0
					};
					this._styleContainer = null;
					CoreLayoutWidget.call(this);
				},
				CLASSES_PREFIX = "ui-box",
				classes =  objectUtil.merge({}, CoreLayoutWidget.classes,{
					box: CLASSES_PREFIX,
					float: CLASSES_PREFIX + "-float",
					floatLeft: CLASSES_PREFIX + "-float-left",
					floatRight: CLASSES_PREFIX + "-float-right",
					floatCenter: CLASSES_PREFIX + "-float-center",
					floatTop: CLASSES_PREFIX + "-float-top",
					floatMiddle: CLASSES_PREFIX + "-float-middle",
					floatBottom: CLASSES_PREFIX + "-float-bottom"
				}),
				prototype = new CoreLayoutWidget();

			/**
			 * Dictionary for Box related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.Box
			 * @static
			 * @readonly
			 */
			Box.classes = classes;

			function insertCSSStyleSheet(rule, styleContainer) {
				var id = ns.getUniqueId(),
					styleElement = null;

				if (!styleContainer) {
					styleElement = document.createElement("style");
					// a text node hack, it forces the browser
					// to create a stylesheet object in the
					// HTMLStyleElement object, which we can
					// then use
					styleElement.appendChild(document.createTextNode(""));
					styleElement.id = id;
					document.head.appendChild(styleElement);
					styleContainer = styleElement.sheet;
				} else {
					styleContainer.deleteRule(0);
				}
				styleContainer.insertRule(rule , 0);
				return styleContainer;
			}

			function setComponentsSpacing(self, element, horizontal, vertical) {
				var propertyValue = "#" + element.id + ".ui-box-float > *:not(script)" +
						"{margin: " + horizontal / 2 + "px " + vertical / 2 + "px" + ";}";

				self._styleContainer = insertCSSStyleSheet(propertyValue, self._styleContainer);
			}

			/**
			 * Implementation of float layout
			 */
			function setFloatLayout(self, element, options) {
				var classList = element.classList;

				// base class for float layout
				classList.add(classes.float);

				// configuration
				switch (options.layoutAlign) {
					case "right" : classList.add(classes.floatRight);
						break;
					case "center" : classList.add(classes.floatCenter);
						break;
					default : // top
						classList.add(classes.floatLeft);
				}

				switch (options.verticalAlign) {
					case "middle" : classList.add(classes.floatMiddle);
						break;
					case "bottom" : classList.add(classes.floatBottom);
						break;
					default : // top
						classList.add(classes.floatTop);
				}

				setComponentsSpacing(self, element, options.horizontalSpacing, options.verticalSpacing);
			}

			function resetFloatLayout(element) {
				var classList = element.classList;
				classList.remove(classes.floatRight);
				classList.remove(classes.floatCenter);
				classList.remove(classes.floatLeft);
				classList.remove(classes.floatTop);
				classList.remove(classes.floatMiddle);
				classList.remove(classes.floatBottom);
			}

			function setLayout(self, element, layout) {
				var options = self.options;

				element = element || self.element;

				layout = layout || options.layout;
				switch (layout) {
					case "float" :
						setFloatLayout(self, element, options);
					break;
				}
			}
			function resetLayout(self, element) {
				var layout = self.options.layout;

				switch (layout) {
					case "float" :
						resetFloatLayout(element);
					break;
				}
			}
			/**
			 * Update element's positions
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._layout = function (element) {
				var self = this;

				element = element || self.element;
				setLayout(self, element);
				return element;
			};

			/**
			 * Update element's positions
			 * @method _setLayout
			 * @param {HTMLElement} element
			 * @param {string} value layout name
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Box
			 */
			prototype._setLayout = function (element, value) {
				var self = this,
					options = self.options;

				if (options.layout !== value) {
					resetLayout(element, options.layout);
					options.layout = value;
					setLayout(self, element, value);
				}
				return element;
			};

			/**
			 * Build Box
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Box
			 */
			prototype._build = function (element) {
				if (typeof this._layout === "function") {
					this._layout(element);
				}
				return element;
			};

			/**
			 * Refresh Box
			 * @method _refresh
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Box
			 */
			prototype._refresh = function (element) {
				element = element || this.element;
				if (typeof this._layout === "function") {
					this._layout(element);
				}
			};

			Box.prototype = prototype;
			ns.widget.core.Box = Box;

			engine.defineWidget(
				"Box",
				"[data-role='box']" +
				", ." + classes.box,
				[],
				Box
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Box;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
