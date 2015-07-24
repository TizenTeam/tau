/*global window, define */
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
 * To create a navigation bar, an array containing history is required.
 * And also, each value of the array is recommended
 * to have identifiable value such as pageId.
 * In the example below, the array is named as navigationHistory.
 *
 * This widget only provides creation of navigation bar visually,
 * not functional navigation. So, it is required to implement the
 * navigational function in application by using other
 * method such as history.go() or something.
 *
 * - First, in your HTMl code, you can declare navigation by using date-role.
 *
 * 		@example
 *		<div data-role="page" id="navigation-bar">
 *			<!-- declare navigation in header -->
 *			<div data-role="header" data-position="fixed">
 *				<h1>Navigation Bar</h1>
 *				<nav data-role="navigation" id="navigation">
 *				</nav>
 *			</div>
 *			<!-- you can put several pages to move -->
 *			<div data-role="content">
 *				<ul data-role="listveiw">
 *					<li><a href="navigation1.html">Move to Navigation1</a></li>
 *					<li><a href="navigation2.html">Move to Navigation2</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * - Second, you can make history array and create navigation bar
 * by using javascript code.
 *
 *		@example
 *		var historyMaker = function(event) {
 *			//make browsing history be stored in navigationHistory array.
 *			var iteration = window.navigationHistory.length,
 *				i = 0,
 *				targetId = event.target.id;
 *			if (!iteration) {
 *				navigationHistory.push({
 *					pageId : targetId
 *				});
 *			} else {
 *				for (i = 0; i < iteration; i++){
 *					if (targetId === navigationHistory[i].pageId) {
 *						navigationHistory.splice(i + 1, iteration - i - 1);
 *						break;
 *					}
 *				}
 *				if (i >= iteration) {
 *					navigationHistory.push({
 *						pageId : targetId
 *					});
 *				}
 *			}
 *		},
 *
 *		historyDrawer = function(event) {
 *			var navi = document.getElementById("navigation"),
 *				naviWidget = tau.widget.Navigation(navi);
 *			if (document.getElementsByClassName("ui-navigation-ul")[0]
 *				.childElementCount) {
 *				tau.warn("Create method should be called only once in a page");
 *			} else {
 *				//Create Navigation widget with navigationHistory
 *				naviWidget.create(navigationHistory);
 *			}
 *		},
 *
 *		historyMove = function(event) {
 *			var selectedIndex = event.originalEvent.detail,
 *				barLength = navigationHistory.length;
 *			//clear unnecessary array of history out
 *			navigationHistory.splice(selectedIndex + 1, barLength - selectedIndex );
 *			history.go(- (barLength - selectedIndex) + 1);
 *		};
 *
 *		window.navigationHistory = window.navigationHistory || [];
 *		//When page created and showed, following event handlers need to bind only once.
 *		$(document).one("pagebeforeshow", historyMaker);
 *		$(document).one("pageshow", historyDrawer);
 *		$("nav").one("navigate", historyMove);
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
				selectors = ns.util.selectors,
				events = ns.event,
				Navigation = function () {
					var self = this;

					self._navigateTrigger = null;
					self._ui = {
						page: null,
						container: null
					};
					self._barLength = null;
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Navigation
				 */
				classes = {
					page : "ui-page",
					header : "ui-header",
					titleNavigation : "ui-title-navigation",
					navigation: "ui-navigation",
					navigationUl : "ui-navigation-ul",
					navigationLi : "ui-navigation-li",
					navigationLiPress : "ui-navigation-li-press"
				},
				prototype = new BaseWidget();

			Navigation.prototype = prototype;
			Navigation.classes = classes;

			/**
			 * Navigation navigateTrigger function
			 * @method navigateTrigger
			 * @private
			 * @static
			 * @param {ns.widget.mobile.Navigation} self
			 * @param {event} event
			 * @member ns.widget.mobile.Navigation
			 */
			function navigateTrigger(self, event) {
				var target = event.target,
					selectedIndex = target.selectedIndex;

				if(target.nodeName === "LI"){
					//not to trigger event on the last li click
					if (selectedIndex + 1 !== self._barLength) {
						events.trigger(target, "navigate", selectedIndex);
					}
				}
			};

			/**
			 * Initiate making navigation bar
			 * @method create
			 * @param {Array} navigationHistory
			 * @public
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.create = function (navigationHistory) {
				if (!this.element.querySelector("." + classes.navigationUl + " > *:first-child")) {
					this._make(navigationHistory);
				} else {
					ns.warn("Navigation Bar should be created only once.");
				}
			};

			/**
			 * Make history array to navigation bar and add event
			 * @method _make
			 * @param {Array} navigationHistory
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._make = function (navigationHistory) {
				var self = this,
					container = self._ui.container,
					element = self.element,
					docFrag = document.createDocumentFragment(),
					barLength = navigationHistory.length,
					i,
					list,
					arrow;

				for (i = 0; i < barLength; i++) {
					list = document.createElement("li");
					list.className = classes.navigationLi;
					list.selectedIndex = i;
					list.innerHTML = navigationHistory[i].pageId;

					docFrag.appendChild(list);
				};
				self._barLength = barLength;

				container.appendChild(docFrag);

				container.style.width = container.offsetWidth + "px";
				element.scrollLeft = element.scrollWidth;
			};

			/**
			 * Build structure of Navigation widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._build = function (element) {
				var header,
					container;

				header = selectors.getParentsByClass(element, classes.header)[0];
				container = document.createElement("ul");

				header.classList.add(classes.titleNavigation);
				element.className = classes.navigation;
				container.className = classes.navigationUl;

				element.appendChild(container);
				header.appendChild(element);
			};

			/**
			 * Initiate Navigation widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._init = function (element){
				this._ui.page = selectors.getParentsByClass(element, classes.page)[0];
				this._ui.container = selectors.getChildrenByClass(element, classes.navigationUl)[0];
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

				self._navigateTrigger = navigateTrigger.bind(null, self);

				element.addEventListener("vclick", self._navigateTrigger, false);
			};

			/**
			 * Destroy Navigation widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._destroy = function (element) {
				element.removeEventListener("vclick", this._navigateTrigger, false);
			};

			ns.widget.mobile.Navigation = Navigation;
			engine.defineWidget(
				"Navigation",
				"[data-role='navigation'], .ui-navigation",
				[
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
