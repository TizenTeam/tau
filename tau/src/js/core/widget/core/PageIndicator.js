/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #PageIndicator Widget
 * Widget create dots page indicator.
 * @class ns.widget.core.PageIndicator
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../engine",
		 	"../../widget/BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,

				PageIndicator = function () {
					var self = this;
					self._activeIndex = null;
					self.options = {};
				},
				classes = {
					indicator: "ui-page-indicator",
					indicatorActive: "ui-page-indicator-active",
					indicatorItem: "ui-page-indicator-item"
				},
				prototype = new BaseWidget();

			PageIndicator.classes = classes;

			prototype._configure = function () {
				/**
				 * Options for widget.
				 * @property {Object} options
				 * @property {number} [options.maxPage=5] Maximum number of indicator dots.
				 * @property {number} [options.numberOfPages=null] Number of pages to be linked to PageIndicator.
				 * @member ns.widget.core.PageIndicator
				 */
				this.options = {
					maxPage: 5,
					numberOfPages: null
				};
			};
			/**
			 * Build PageIndicator
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._build = function (element) {
				this._createIndicator(element);
				return element;
			};

			/**
			 * Create HTML elements for PageIndicator
			 * @method _createIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._createIndicator = function (element) {
				var self = this,
					i,
					len,
					span,
					options = self.options;

				if(options.numberOfPages === null) {
					ns.error("build error: numberOfPages is null");
					return;
				}

				len = options.numberOfPages < options.maxPage ? options.numberOfPages : options.maxPage;

				for(i = 0; i < len; i++) {
					span = document.createElement("span");
					span.classList.add(classes.indicatorItem);

					if (i === self._activeIndex) {
						span.classList.add(classes.indicatorActive);
					}
					element.appendChild(span);
				}
			};

			/**
			 * Remove contents of HTML elements for PageIndicator
			 * @method _removeIndicator
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._removeIndicator =  function (element) {
				element.textContent = "";
			};

			/**
			 * This method sets a dot to active state.
			 * @method setActive
			 * @param {number} index to be active state.
			 * @member ns.widget.core.PageIndicator
			 */
			prototype.setActive = function (position) {
				var self = this,
					i,
					len,
					dotIndex = position,
					elPageIndicatorItems = self.element.children,
					maxPage = self.options.maxPage,
					numberOfPages = self.options.numberOfPages,
					middle = window.parseInt(maxPage/2, 10),
					numberOfCentralDotPages = 0,
					indicatorActive = classes.indicatorActive;

				self._activeIndex = position;

				if(numberOfPages > maxPage) {
					len = maxPage;
					numberOfCentralDotPages = numberOfPages - maxPage;
				} else if(numberOfPages === null) {
					ns.error("setActive error: numberOfPages is null");
					return;
				} else if(numberOfPages === 0) {
					return;
				} else {
					len = numberOfPages;
				}

				for(i = 0; i < len; i++) {
					elPageIndicatorItems[i].classList.remove(indicatorActive);
				}

				if ((middle < position) && (position <= (middle + numberOfCentralDotPages))) {
					dotIndex = middle;
				} else if (position > (middle + numberOfCentralDotPages)) {
					dotIndex = position - numberOfCentralDotPages;
				}

				elPageIndicatorItems[dotIndex].classList.add(indicatorActive);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._refresh = function () {
				var self = this;
				self._removeIndicator(self.element);
				self._createIndicator(self.element);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.PageIndicator
			 */
			prototype._destroy = function () {
				this._removeIndicator(this.element);
			};

			PageIndicator.prototype = prototype;

			ns.widget.core.PageIndicator = PageIndicator;

			engine.defineWidget(
				"PageIndicator",
				"[data-role='page-indicator'], .ui-page-indicator",
				["setActive"],
				PageIndicator,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.PageIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
