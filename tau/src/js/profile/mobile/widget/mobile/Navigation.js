/*global window, define */
/* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
 * License : MIT License V2
 */
/**
 * #Navigation Widget
 * Navigation Bar inside header to navigate back and forth according to
 * navigational history array, which is created by application.
 * By clicking horizontally listed element on the Navigation Bar,
 * page is possible to be changed to the target page.
 *
 * ##Default selector
 * You can make the navigation widget as data-role="navigation".
 * On creation, to use *NAV* tag is recommended for semantic understanding.
 *
 * ###  HTML Examples
 *
 * ####  Create Navigation Bar using data-role
 *
 * 		@example
 *		<div data-role="page">
 *			<div data-role="header" data-position="fixed">
 *				<h1>title</h1>
 *				<nav data-role="navigation" id="navigation">
 *				</nav>
 *			</div>
 *			<div data-role="content">
 *			</div>
 *		</div>
 *
 * ##Navigation methods
 *
 * You can use method of navigation widget.
 *
 * - "create" - create navigation bar according to history array.
 * - To create a naviagtion bar, an array containing history is required.
 * And also, each value of the array is recommended to have identifiable value such as name.
 * In the example below, the array is named as historyArraytoUse.
 *
 * - This widget only provides creation of navigation bar visually, not funtional navigation.
 * So, it is required to implement the navigational function in application by using other
 * method such as history.go() or something.
 *
 *		@examples
 *		<script>
 *			var navigation = document.getElementById("navigation"),
 *			navigationBar = tau.widget.Navigation(navigation);
 *
 *			navigationBar.create(historyArraytoUse);
 *		</script>
 *
 * @class ns.widget.mobile.Navigation
 * @extends ns.widget.BaseWidget
 * @author Maciej Moczulski <m.moczulsku@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Koeun Choi <koeun.choi@samsung.com>
 * @author Piort Karny <p.karny@samsung.com>
 * @author Krzysztof Antonszek <k.antonszek@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
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
				if (!document.querySelector("." + classes.navigationUl + " > *:first-child")) {
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
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._destroy = function () {
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
