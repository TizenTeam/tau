/*global window, define, ns */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # ScrollHandler Widget
 *
 * @class ns.widget.tv.ScrollHandler
 * @extends ns.widget.mobile.ScrollHandler
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile/ScrollHandler",
			"../../../core/engine",
			"../../../core/util/object",
			"../tv"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				BaseScrollHandler = ns.widget.mobile.ScrollHandler,
				BaseScrollHandlerPrototype = BaseScrollHandler.prototype,
				ScrollHandler = function () {
					var self = this;
					BaseScrollHandler.call(self);
					self.options = objectUtils.merge(self.options, defaults);
				},
				classes = BaseScrollHandler.classes,
				defaults = objectUtils.merge({}, BaseScrollHandler.defaults, {
					delay: 5000,
					scrollIndicator: true
				}),
				prototype = new BaseScrollHandler();

			ScrollHandler.events = BaseScrollHandler.events;
			ScrollHandler.classes = classes;
			ScrollHandler.prototype = prototype;

			/**
			 * Builds widget
			 * @method _build
			 * @param {HTMLElement} element Element of widget
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.ScrollHandler
			 */
			prototype._build = function (element) {
				element = BaseScrollHandlerPrototype._build.call(this, element);
				element.style.minWidth = "";

				return element;
			};

			prototype._setProperWidth = function () {
				var self = this,
					element = self.element,
					view = self._ui.view,
					contentStyle = window.getComputedStyle(element),
					width = parseFloat(contentStyle.width),
					paddingLeft = parseFloat(contentStyle.paddingLeft),
					paddingRight = parseFloat(contentStyle.paddingRight);
				view.style.width = Math.floor(width - paddingLeft - paddingRight) + "px";
			};

			prototype._init = function (element) {
				element = BaseScrollHandlerPrototype._init.call(this, element);
				this._setProperWidth();
				return element;
			};

			// definition
			ns.widget.tv.ScrollHandler = ScrollHandler;

			engine.defineWidget(
				"ScrollHandler",
				".ui-content:not([data-scroll='none']):not(.ui-scrollview-clip):not(.ui-scrolllistview),[data-handler='true'], .ui-scrollhandler",
				[
					"enableHandler",
					"scrollTo",
					"ensureElementIsVisible",
					"centerToElement",
					"getScrollPosition",
					"skipDragging",
					"translateTo"
				],
				ScrollHandler,
				"tv",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.ScrollHandler;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
