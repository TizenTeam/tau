/*global window, define */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 * ## JavaScript API
 *
 * linear Layout
 *
 * @class ns.layout.linear
 * @extends ns.layout
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../layout",
			"../util/object",
			"../util/selectors",
			"../widget/core/Box"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var linear = {
				},
				objectUtil = ns.util.object,
				selectors = ns.util.selectors,
				Box = ns.widget.core.Box,
				CLASSES_PREFIX = Box.classes.box,
				LAYOUT_PREFIX = CLASSES_PREFIX + "-linear",
				classes = objectUtil.merge({}, Box.classes, {
					linear: LAYOUT_PREFIX,
					linearHorizontal: LAYOUT_PREFIX + "-horizont",
					linearVertical: LAYOUT_PREFIX + "-vertical",
					linearWrap: LAYOUT_PREFIX + "-wrap"
				}),
				defaults = {
					linearLayoutDirection: "horizontal",
					linearDistance: 10,
					linearFill: false,
					linearWrap: false
				},
				cssRules = [],
				LAYOUTABLE_ELEMENTS_SELECTOR = "*:not(script)";

			linear.name = "linear";
			linear.classes = classes;
			linear.defaults = defaults;

			linear.configure = function (self, element) {
				// set defaults
				self.options = objectUtil.merge({}, defaults, self.options);
			};

			/**
			 * Method determines what elements can be laid
			 * @param element
			 */
			function getLayoutElements(element) {
				return selectors.getChildrenBySelector(element, LAYOUTABLE_ELEMENTS_SELECTOR);
			}

			/**
			 * Styles support
			 */
			function registerRule(rule) {
				cssRules.push(rule);
			};

			/**
			 * Styles support
			 */
			function applyRules(self) {
				for(var i = 0, length = cssRules.length; i < length; i++){
					self.insertCSSRule(cssRules[i]);
				}
			};

			linear.enable = function (self, element) {
				var elements = getLayoutElements(element),
					options = self.options || {},
					classList = element.classList;

				if (options.linearLayoutDirection === "horizontal") {
					element.classList.add(classes.linearHorizontal);
					if(options.linearFill) {
						registerRule("#" + element.id + " > * {height: auto}");//#linear-page
					}
				} else {
					element.classList.add(classes.linearVertical);
					if(options.linearFill) {
						registerRule("#" + element.id + " > * {width: auto}");//#linear-page
					}
				}

				if (options.linearWrap) {
					element.classList.add(classes.linearWrap);
				}

				registerRule("#" + element.id + " > * {margin: "+ options.linearDistance + "px}");
				applyRules(self);
			};

			linear.disable = function (self, element) {
				var classList = self.element.classList;

				classList.remove(classes.linearHorizontal);
				classList.remove(classes.linearVertical);
				classList.remove(classes.linearWrap);
			};

			ns.layout.linear = linear;

			// register linear layout
			Box.register("linear", linear);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.layout.linear;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
