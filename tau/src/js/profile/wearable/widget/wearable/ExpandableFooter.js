/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true */
/**
 * # Expandable Footer
 * Expandable footer is to expand footer widget when scrollable widget, for example content or page, reach scroll end position.
 * This widget is created by selector, 'ui-footer-expandable' class, automatically.
 *
 * ## HTML Example
 *
 *      @example
 *      <div class="ui-page ui-scroll-on">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Expandable</h2>
 *          </header>
 *          <div class="ui-content">
 *               <ul class="ui-listview">
 *                   <li><a href="#">List</a></li>
 *                   <li><a href="#">List</a></li>
 *                   <li><a href="#">List</a></li>
 *               </ul>
 *           </div>
 *           <footer class="ui-footer ui-expandable-footer">
 *               <a href="#" class="ui-btn ui-btn-footer-icon btn-icon-showonphone" data-rel="back">Phone</a>
 *           </footer>
 *       </div>
 *
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
/**
 * Triggered while footer size expand.
 * @event footerexpand
 * @member ns.widget.wearable.ExpandableFooter
 */
/**
 * Triggered after footer size is collapsed.
 * @event footercollapse
 * @member ns.widget.wearable.ExpandableFooter
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/object",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.wearable.ExpandableFooter
			 * @private
			 * @static
			 */
			var CONST = {
					SCROLLDURATION: 100,
					EXPANDED: 1,
					COLLAPSED: 0
				},
				Events = {
					EXPAND: "footerexpand",
					COLLAPSE: "footercollapse"
				},
				BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				event = ns.event,
				object = ns.util.object,

				ExpandableFooter = function () {
					var self = this;

					self._onScrollBound = null;
					self._timeoutId = null;
					self._changed = CONST.COLLAPSED;
					self._scrollHeight = null;
					self._footerBottom = null;
					self._lastScrollTop = 0;
					self._ui = {};
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.wearable.ExpandableFooter
				 * @static
				 * @readonly
				 */
				classes = {
					ExpandableFooter: "ui-expandable-footer",
					Expand: "ui-expand"
				},
				prototype = new BaseWidget();

			ExpandableFooter.classes = classes;

			function translate(element, x, y, duration) {
				var elementStyle = element.style,
					transition = "none";
				if (duration) {
					transition =  "-webkit-transform " + duration / 1000 + "s ease-out";
				}
				elementStyle.webkitTransform = "translate3d(" + x + "px, " + y + "px, 0px)";
				elementStyle.webkitTransition = transition;
			}

			/**
			 * Configure Expandable Footer widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._configure = function(){
				object.merge(this.options, {
					scrollElement : null,
					scrollEndThreshold : 100
				});
			};
			/**
			 * Init Exapndable Footer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._init = function (element) {
				this._initElements(element);
				return element;
			};

			/**
			 * Init element that related to Exapndable Footer widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._initElements = function(element) {
				var self = this,
					ui = self._ui;
				ui._scrollElement = document.body;

				if (self.options.scrollElement) {
					ui._scrollElement = self.options.scrollElement;
				}
				self._scrollHeight = ui._scrollElement.scrollHeight;
				self._footerBottom = parseInt(window.getComputedStyle(element).bottom, 10);
			};

			/**
			 * Scroll event handler
			 * @method _init
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._onScroll = function() {
				var self = this,
					element = self.element,
					footerBottom = self._footerBottom,
					scrollElement = self._ui._scrollElement,
					scrollTop = scrollElement.scrollTop,
					scrollHeight = self._scrollHeight,
					offsetHeight = scrollElement.offsetHeight,
					variableHeight = scrollHeight - scrollTop,
					controlHeight = offsetHeight - footerBottom,
					classList = element.classList,
					moveY,
					duration;

				/*
				 * variableHeight is calculated as scrollHeight and scrollTop value.
				 * Please imagine the one element, this element has long height and has overflow css property.
				 * 'scrollHeight - scrollTop' means that remain to be able to scroll area.
				 *
				 * controlHeight is calculated as scrollable element's offsetHeight and bottom value of footer element.
				 * bottom value is negative number. So, controlHeight means that scroll clip element's height plus footer element whole height.
				 *
				 * If variableHeight and controlHeight value is same, this means that same to remain scrollable element area and
				 * to be showed clip element height plus to be not showed footer left height.
				 * This timing is that footer and content element should be scrolled up.
				 */
				if (variableHeight < controlHeight) {
					if (!self._changed) {
						classList.add(classes.Expand);
					}
					self._changed = CONST.EXPANDED;
					moveY = variableHeight - controlHeight;
					if (self._lastScrollTop !== 0 && Math.abs(moveY - self._lastScrollTop) > 10) {
						duration = CONST.SCROLLDURATION;
					} else {
						duration = 0;
					}
					if (moveY < footerBottom) {
						moveY = footerBottom;
					}
					translate(element, 0, moveY, duration);
					self._lastScrollTop = moveY;
					self.trigger(Events.EXPAND);
				} else {
					if (self._changed) {
						classList.remove(classes.Expand);
						translate(element, 0, 0, CONST.SCROLLDURATION);
						self.trigger(Events.COLLAPSE);
						self._changed = CONST.COLLAPSED;
					}
				}
			};
			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._bindEvents = function () {
				var self = this;

				self._onScrollBound = self._onScroll.bind(self);
				self._ui._scrollElement.addEventListener("scroll", self._onScrollBound, false);
			};

			prototype._unbindEvents = function () {
				this._ui._scrollElement.removeEventListener("scroll", this._onScrollBound, false);
			};
			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._refresh = function () {
				var self = this;
				self._initElements(self.element);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.ExpandableFooter
			 */
			prototype._destroy = function () {
				this._unbindEvents();
			};

			ExpandableFooter.prototype = prototype;

			// definition
			ns.widget.wearable.ExpandableFooter = ExpandableFooter;
			engine.defineWidget(
				"ExpandableFooter",
				"",
				[],
				ExpandableFooter,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
