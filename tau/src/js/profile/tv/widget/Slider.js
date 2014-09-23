/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/*
 * @class ns.widget.tv.Slider
 * @extends ns.widget.mobile.Slider
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/mobile/widget/mobile/TizenSlider",
			"../../../core/engine",
			"../../../core/theme",
			"../../../core/util/selectors",
			"./BaseKeyboardSupport",
			"../tv"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseSlider = ns.widget.mobile.TizenSlider,
				BaseSliderPrototype = BaseSlider.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				Slider = function () {
					var self = this;
					BaseSlider.call(self);
					BaseKeyboardSupport.call(self);
					self._pageWidget = null;
					self._callbacks = {};
					self.status = false;
				},
				selectors = ns.util.selectors,
				engine = ns.engine,
				FUNCTION_TYPE = "function",
				prototype = new BaseSlider(),
				KEY_CODES = BaseKeyboardSupport.KEY_CODES;

			Slider.classes = BaseSlider.classes;
			Slider.prototype = prototype;

			function showPopup(self) {
				if (self.options.popup) {
					self._updateSlider();
					self._showPopup();
				}
			}

			function hidePopup(self) {
				self._closePopup();
			}

			function onKeyup(self, event) {
				var status = self.status;

				if (event.keyCode === KEY_CODES.enter) {
					if (status) {
						self._pageWidget.enableKeyboardSupport();
					} else {
						self._pageWidget.disableKeyboardSupport();
					}
					self.status = !status;
				}
			}

			function onKeydown(self, event) {
				if (event.keyCode !== KEY_CODES.enter && !self.status) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			function onFocus(self) {
				showPopup(self);
			}

			prototype._init = function(element) {
				var pageElement = selectors.getClosestByClass(element, "ui-page");

				if (typeof BaseSliderPrototype._init === FUNCTION_TYPE) {
					BaseSliderPrototype._init.call(this, element);
				}
				this.enableKeyboardSupport();
				this._pageWidget = ns.engine.getBinding(pageElement);
			};

			prototype._bindEvents = function(element) {
				var container = this._ui.container,
					callbacks = this._callbacks;

				if (typeof BaseSliderPrototype._bindEvents === FUNCTION_TYPE) {
					BaseSliderPrototype._bindEvents.call(this, element);
				}

				callbacks.onKeyup = onKeyup.bind(null, this);
				callbacks.onKeydown = onKeydown.bind(null, this);
				callbacks.onFocus = onFocus.bind(null, this);

				this._bindEventKey();

				container.addEventListener("keyup", callbacks.onKeyup, false);
				container.addEventListener("keydown", callbacks.onKeydown, true);
				this.handle.addEventListener("focus", callbacks.onFocus, true);
			};

			prototype._destroy = function() {
				var container = this._ui.container,
					callbacks = this._callbacks;

				this._destroyEventKey();
				container.removeEventListener("keyup", callbacks.onKeyup, false);
				container.removeEventListener("keydown", callbacks.onKeydown, false);
				this.handle.removeEventListener("focus", callbacks.onFocus, true);

				if (typeof BaseSliderPrototype._destroy === FUNCTION_TYPE) {
					BaseSliderPrototype._destroy.call(this);
				}
			};


			// definition
			ns.widget.tv.Slider = Slider;

			engine.defineWidget(
				"TizenSlider",
				"input[type='range'], :not(select)[data-role='slider'], :not(select)[data-type='range']",
				[],
				Slider,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
