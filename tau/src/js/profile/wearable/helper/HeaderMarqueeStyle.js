/*global window, define, ns */
/* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #HeaderMarqueeStyle Helper Script
 * Helper script using SnapListview and Marquee.
 * @class ns.helper.HeaderMarqueeStyle
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/event",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/widget/core/Marquee",
			"../widget/wearable/ExpandableHeader"
		],
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				events = ns.event,
				Marquee = ns.widget.core.Marquee,
				ExpandableHeader = ns.widget.wearable.ExpandableHeader,
				defaults = {
					delay: 0,
					marqueeStyle: "scroll",
					ellipsisEffect: "none",
					speed: 100,
					interation: "infinite",
					autoRun: false
				},
				Events = ExpandableHeader.events,
				Classes = {
					TITLE: "ui-title",
					MARQUEE: "ui-marquee"
				},

				HeaderMarqueeStyle = function (headerElement, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._expandableHeader = null;
					self._marqueeWidget = null;

					self.init(headerElement, options);
				},

				prototype = HeaderMarqueeStyle.prototype;

			function bindDragEvents(element) {

				events.on(element, Events.COLLAPSE + " " + Events.COMPLETE , this, false);
			};

			function unBindDragEvents(element) {

				events.off(element, Events.COLLAPSE + " " + Events.COMPLETE , this, false);
			};

			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case Events.COMPLETE:
						self._onComplete(event);
						break;
					case Events.COLLAPSE:
						self._onCollapse(event);
						break;
				}
			};

			prototype._onComplete = function(event) {
				this._marquee.start();
			};

			prototype._onCollapse = function(event) {
				this._marquee.reset();
			};

			prototype.init = function(headerElement, options) {
				var self = this,
					textElement,
					scrollElement;

				if (options.textElement) {
					if (typeof options.textElement === "string") {
						textElement = headerElement.querySelector(options.textElement);
					} else {
						textElement = options.textElement;
					}
				} else {
					textElement = headerElement.querySelector("." + Classes.TITLE);
				}



				objectUtils.fastMerge(self.options, options);

				self._element = headerElement;
				textElement.classList.add(Classes.MARQUEE);

				self._expandableHeader = engine.instanceWidget(headerElement, "ExpandableHeader", {
					scrollElement: options.scrollElement
				});
				self._marquee = engine.instanceWidget(textElement, "Marquee", self.options);
				self._bindEvents();
			};

			prototype._bindEvents = function() {
				var self = this;

				bindDragEvents.call(self, self._element);
			};

			prototype._unbindEvents = function() {
				var self = this;

				unBindDragEvents.call(self, self._element);
			};

			prototype.destroy = function() {
				var self = this;

				self._unbindEvents();
				self._element = null;
				self._expandableHeader = null;
				self._marquee = null;
				self._options = null;
			};

			HeaderMarqueeStyle.create = function(headerElement, options) {
				return new HeaderMarqueeStyle(headerElement, options);
			};

			ns.helper.HeaderMarqueeStyle = HeaderMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return HeaderMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
