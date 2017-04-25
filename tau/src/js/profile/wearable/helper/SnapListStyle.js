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
 * #SnapListStyle Helper Script
 * Helper script using SnapListview.
 * @class ns.helper.SnapListStyle
 * @author Junyoung Park <jy-.park@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../helper",
			"../../../core/engine",
			"../../../core/util/object",
			"../../../core/util/selectors",
			"../widget/wearable/SnapListview"
		],
		function () { //>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,

				SnapListStyle = function (listDomElement, options) {
					var self = this;

					self._snapListviewWidget = null;
					self._callbacks = {};
					self.init(listDomElement, options);
				},

				prototype = SnapListStyle.prototype;

			/**
			 * Show edge effect
			 * @method showEdgeEffect
			 * @param {string} direction
			 * @member ns.helper.SnapListStyle
			 */
			function showEdgeEffect(direction) {
				if (window.addEdgeEffectONSCROLLTizenUIF) {
					if (direction === "CW") {
						window.addEdgeEffectONSCROLLTizenUIF(false, true, false, false);
					} else {
						window.addEdgeEffectONSCROLLTizenUIF(true, false, false, false);
					}
				}
			}

			/**
			 * Handler for rotary event
			 * @method rotaryDetentHandler
			 * @param {Event} e
			 * @member ns.helper.SnapListStyle
			 */
			function rotaryDetentHandler(e) {
				var snapListviewWidget = this._snapListviewWidget,
					selectedIndex = snapListviewWidget.getSelectedIndex(),
					listItems = snapListviewWidget._listItems,
					listItemLength = listItems.length,
					direction = e.detail.direction,
					scrolled = false;

				if (direction === "CW" && selectedIndex !== null) {
					if (listItems[listItemLength - 1].element.classList.contains("ui-snap-listview-selected")) {
						showEdgeEffect(direction);
					}
					// try to scroll to the next element on list
					// - the next element can be hidden, so we try as long as it is possible to change element
					while (!scrolled && ++selectedIndex < listItemLength) {
						scrolled = snapListviewWidget.scrollToPosition(selectedIndex);
					}
				} else if (direction === "CCW" && selectedIndex !== null) {
					if (listItems[0].element.classList.contains("ui-snap-listview-selected")) {
						showEdgeEffect(direction);
					}
					// try to scroll to the previous element on list
					// - the previous element can be hidden, so we try as long as it is possible to change element
					while (!scrolled && --selectedIndex >= 0) {
						scrolled = snapListviewWidget.scrollToPosition(selectedIndex);
					}
				}
			}

			/**
			 * Initialize helper
			 * @method init
			 * @param {HTMLElement} listDomElement
			 * @param {Object} options
			 * @member ns.helper.SnapListStyle
			 */
			prototype.init = function (listDomElement, options) {
				var self = this;

				// create SnapListview widget
				self._snapListviewWidget = engine.instanceWidget(listDomElement, "SnapListview", options);
				self.bindEvents();
			};

			/**
			 * Bind events
			 * @method bindEvents
			 * @member ns.helper.SnapListStyle
			 */
			prototype.bindEvents = function () {
				var self = this,
					rotaryDetentCallback;

				rotaryDetentCallback = rotaryDetentHandler.bind(self);

				self._callbacks.rotarydetent = rotaryDetentCallback;

				window.addEventListener("rotarydetent", rotaryDetentCallback);
			};

			/**
			 * Unbind events
			 * @method unbindEvents
			 * @member ns.helper.SnapListStyle
			 */
			prototype.unbindEvents = function () {
				var self = this;

				window.removeEventListener("rotarydetent", self._callbacks.rotarydetent);

				self._callbacks.rotarydetent = null;
			};

			/**
			 * Destroy helper
			 * @method destroy
			 * @member ns.helper.SnapListStyle
			 */
			prototype.destroy = function () {
				var self = this;

				self.unbindEvents();
				if (self._snapListviewWidget) {
					self._snapListviewWidget.destroy();
				}

				self._snapListviewWidget = null;
				self._callbacks = null;
			};

			/**
			 * Return Snap list
			 * @method getSnapList
			 * @member ns.helper.SnapListStyle
			 */
			prototype.getSnapList = function () {
				return this._snapListviewWidget;
			};

			/**
			 * Create helper
			 * @method create
			 * @param {HTMLElement} listDomElement
			 * @param {Object} options
			 * @static
			 * @member ns.helper.SnapListStyle
			 */
			SnapListStyle.create = function (listDomElement, options) {
				return new SnapListStyle(listDomElement, options);
			};

			ns.helper.SnapListStyle = SnapListStyle;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListStyle;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
