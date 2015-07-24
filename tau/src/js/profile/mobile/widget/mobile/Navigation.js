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
 * #Navigation Bar
 * Navigation Bar inside header to navigate back and forth according to
 *  navigational history array, which is created by application.
 * By clicking horizontally listed element on the Navigation Bar,
 *  a page is possible to navigate to the target page.
 *
 * ##Default selector
 * You can make the navigation widget as data-role="navigation".
 * To use *NAV* tag is recommended for semantic understanding.
 *
 * ####  Create Navigation Bar using data-role
 *
 * 		@example
 *		<div data-role="page" id="pageid">
 *			<div data-role="header" data-position="fixed">
 *				<h1>title</h1>
 *				<nav data-role="navigation" id="navigation"></nav>
 *			</div>
 *			<div data-role="content"></div>
 *		</div>
 *
 * ##HTML Examples
 *
 * ####How to use Navigation Bar in your code
 *
 * This component is made to support navigational
 * indication on panel change mainly. So Navigation Bar is
 * not only hard to be used alone, but also not efficient with solo usage.
 *
 * The essential function of navigation bar is to add navigational item
 * according to the given element's id. And this component also
 * provides navigational changes on the click of each item.
 *
 *
 * To create a navigation bar, navigation bar needs to be defined in
 * your HTMl with 'data-role="navigation"' or 'class="ui-navigation"'.
 *
 * 		@example
 *		<div data-role="page" id="navigation-bar">
 *			<!-- declare navigation in header -->
 *			<div data-role="header" data-position="fixed">
 *				<h1>Navigation Bar</h1>
 *				<nav data-role="navigation" id="navigation"></nav>
 *			</div>
 *
 *			<!-- you can put several panels to move -->
 *			<div data-role="content">
 *			</div>
 *		</div>
 *
 * @class ns.widget.mobile.Navigation
 * @extends ns.widget.BaseWidget
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Maciej Moczulski <m.moczulsku@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Koeun Choi <koeun.choi@samsung.com>
 * @author Piort Karny <p.karny@samsung.com>
 * @author Krzysztof Antonszek <k.antonszek@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/event",
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"./BaseWidgetMobile"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				events = ns.event,
				Navigation = function () {
					var self = this;

					self._clickBound = null;
					self._ui = {};
					self._navigationStack = [];
				},

				attributes = {
					POSITION: "data-position"
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Navigation
				 */
				classes = {
					NAVIGATION: "ui-navigation",
					NAVIGATION_CONTAINER: "ui-navigation-container",
					NAVIGATION_ITEM: "ui-navigation-item",
					NAVIGATION_ACTIVE: "ui-navigation-active"
				},
				prototype = new BaseWidget();

			Navigation.prototype = prototype;
			Navigation.classes = classes;
			Navigation.attributes = attributes;

			/**
			 * Navigation navigateTrigger function
			 * @method navigateTrigger
			 * @private
			 * @static
			 * @param {event} event
			 * @member ns.widget.mobile.Navigation
			 */
			function onClick(event) {
				var self = this,
					container = self._ui.container,
					target = event.target,
					position = parseInt(target.getAttribute(attributes.POSITION), 10),
					stack = self._navigationStack,
					id = stack[position];

				if (target && target.classList.contains(classes.NAVIGATION_ACTIVE)) {
					return;
				}
				while (stack.length - 1 > position) {
					container.removeChild(container.children[position + 1]);
					stack.pop();
				}
				target.classList.add(classes.NAVIGATION_ACTIVE);
				if(target.classList.contains(classes.NAVIGATION_ITEM)){
					//not to trigger event on the last li vclick
					events.trigger(self.element, "navigate", {
						id: id,
						//element Id to move
						position: position
					});
				}
			}

			/**
			 * Build structure of Navigation widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._build = function (element) {
				var container;

				element.classList.add(classes.NAVIGATION);
				container = document.createElement("ul");
				container.classList.add(classes.NAVIGATION_CONTAINER);

				this._ui.container = container;

				element.appendChild(container);
				return element;
			};

			/**
			 * Bind events of Navigation widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._bindEvents = function (element) {
				var self = this;

				self._clickBound = onClick.bind(self);
				element.addEventListener("vclick", self._clickBound, false);
			};


			/**
			 * Initiate creating navigation bar in old version way
			 * @method create
			 * @public
			 * @deprecated
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.create = function() {
				ns.warn("Create method is deprecated because with 'create' method," +
				"it is hard to meet the newly changed Navigation function. " +
				"To handle Navigation Bar, please utilize 'push' method with " +
				"and 'panelChanger' component, instead.");
			};

			/**
			 * Add navigation bar item only one at a time
			 * @method add
			 * @param {HTMLElement} targetElement
			 * @public
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.push = function(id) {
				this._pushItem(id);
			};

			prototype.pop = function() {
				var self = this,
					container = self._ui.container,
					stack = self._navigationStack;

				container.removeChild(container.lastChild);
				stack.pop();
				setTimeout(function() {
					container.lastChild.classList.add(classes.NAVIGATION_ACTIVE);
				}, 0);
			};
			/**
			 * Navigation _addItems function
			 * @method _addItems
			 * @private
			 * @static
			 * @param {HTMLElement} targetElement
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._pushItem = function(id) {
				var self = this,
					element = self.element,
					stack = self._navigationStack,
					container = self._ui.container,
					itemLength = container.childElementCount,
					list;

				stack.push(id);
				itemLength > 0 && container.children[itemLength - 1].classList.remove(classes.NAVIGATION_ACTIVE);

				list = document.createElement("li");
				list.setAttribute(attributes.POSITION, itemLength);
				list.classList.add(classes.NAVIGATION_ITEM);
				list.innerHTML = id;

				setTimeout(function(){
					list.classList.add(classes.NAVIGATION_ACTIVE);
				}, 0);

				container.appendChild(list);
				if (container.offsetWidth > element.offsetWidth) {
					element.scrollLeft = container.offsetWidth - element.offsetWidth;
				}
			};

			/**
			 * Destroy Navigation widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._destroy = function (element) {
				var self = this;

				element.removeEventListener("vclick", self._clickBound, false);
				element.removeChild(self._ui.container);
				self._clickBound = null;
				self._ui = null;
				self._navigationStack = null;
			};

			ns.widget.mobile.Navigation = Navigation;
			engine.defineWidget(
				"Navigation",
				"[data-role='navigation'], .ui-navigation",
				[
					"push",
					"pop",
					"create"
				],
				Navigation,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Navigation;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
