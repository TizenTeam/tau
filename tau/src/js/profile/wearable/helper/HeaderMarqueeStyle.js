/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
			"../widget/wearable/Page"
		],
		function () {//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				objectUtils = ns.util.object,
				events = ns.event,
				Marquee = ns.widget.core.Marquee,
				Page = ns.widget.wearable.Page,
				defaults = {
					delay: 0,
					marqueeStyle: "scroll",
					ellipsisEffect: "none",
					speed: 100,
					interation: "infinite",
					autoRun: false
				},
				Events = Page.expandableHeaderEvents,
				Classes = {
					TITLE: "ui-title",
					MARQUEE: "ui-marquee"
				},

				HeaderMarqueeStyle = function (pageElement, options) {
					var self = this;

					self.options = objectUtils.merge({}, defaults);
					self._marqueeWidget = null;

					self.init(pageElement, options);
				},

				prototype = HeaderMarqueeStyle.prototype;

			function bindDragEvents(element) {
				events.on(element, Events.COLLAPSE + " " + Events.COMPLETE , this, false);
			}

			function unBindDragEvents(element) {
				events.off(element, Events.COLLAPSE + " " + Events.COMPLETE , this, false);
			}

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
				var marquee = this._marquee;

				if (marquee) {
					marquee.start();
				}
			};

			prototype._onCollapse = function(event) {
				var marquee = this._marquee;

				if (marquee) {
					marquee.reset();
				}
			};

			prototype.init = function(pageElement, options) {
				var self = this,
					textElement;

				if (options.textElement) {
					if (typeof options.textElement === "string") {
						textElement = pageElement.querySelector(options.textElement);
					} else {
						textElement = options.textElement;
					}
				} else {
					textElement = pageElement.querySelector("." + Classes.TITLE);
				}

				objectUtils.fastMerge(self.options, options);

				self._element = pageElement;

				if (textElement) {
					textElement.classList.add(Classes.MARQUEE);
					self._marquee = engine.instanceWidget(textElement, "Marquee", self.options);
					self._bindEvents();
				}
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
				self._marquee = null;
				self._options = null;
			};

			HeaderMarqueeStyle.create = function(pageElement, options) {
				return new HeaderMarqueeStyle(pageElement, options);
			};

			ns.helper.HeaderMarqueeStyle = HeaderMarqueeStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return HeaderMarqueeStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
