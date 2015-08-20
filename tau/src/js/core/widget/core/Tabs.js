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
 *
 * #Tabs Component
 * The Tabs component is a controller component for operate closely with tabbar and sectionChanger.
 * So this component should be used with tabbar and sectionChanger.
 *
 * ##Default selectors
 * By default, all elements with the class="ui-tabs" or data-role="tabs" attribute are displayed as a tabs components.
 *
 * ##HTML Examples
 *
 *      @examples
 *      <div id="tabs" class="ui-tabs">
 *          <div class="ui-tabbar">
 *              <ul>
 *                  <li><a href="#" class="ui-btn-active">Tab1</a></li>
 *                  <li><a href="#">Tab2</a></li>
 *                  <li><a href="#">Tab3</a></li>
 *              </ul>
 *          </div>
 *          <div class="ui-section-changer">
 *              <div>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 1
 *                          </li>
 *                      </ul>
 *                  </section>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 2
 *                          </li>
 *                      </ul>
 *                  </section>
 *                  <section class="ui-section-active">
 *                      <ul class="ui-listview">
 *                          <li class="ui-li-static">
 *                              Section 3
 *                          </li>
 *                      </ul>
 *                  </section>
 *              </div>
 *          </div>
 *      </div>
 *
 * ##Manual constructor
 * For manual creation of tabs widget you can use constructor of widget
 *
 *      @example
 *      <script>
 *          var tabsElement = document.getElementById("tabs"),
 *                tabs;
 *          tabs = tau.widget.Tabs(tabsElement);
 *      </script>
 *
 * @class ns.widget.core.Tabs
 * @extends ns.widget.core.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../util/selectors",
			"../../event",
			"../../engine",
			"../BaseWidget",
			"./tab/Tabbar",
			"./SectionChanger",
			"./Page"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				selectors = ns.util.selectors,
				Page = ns.widget.core.Page,
				Tabbar = ns.widget.TabBar,
				Sectionchanger = ns.widget.SectionChanger,
				events = ns.event,
				Tabs = function () {
					var self = this;
					self._ui = {};
					self._component = {};
					self.options = {
						changeDuration: 0
					};
					self._callbacks = {};
				},
				classes = {
					TABS: "ui-tabs",
					WITH_TITLE: "ui-tabs-with-title",
					TITLE: "ui-title",
					PAGE: Page.classes.uiPage
				},
				prototype = new BaseWidget();

			Tabs.prototype = prototype;
			Tabs.classes = classes;

			/**
			 * bind Tabs component necessary events
			 * @method bindTabsEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 * @private
			 * @static
			 */
			function bindTabsEvents(element) {
				var self = this;
				events.on(element, "tabchange sectionchange", self, false);
				window.addEventListener("resize", self, false);
			};

			/**
			 * unbind Tabs component necessary events
			 * @method unBindTabsEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 * @private
			 * @static
			 */
			function unBindTabsEvents(element) {
				var self = this;
				events.off(element, "tabchange sectionchange", self, false);
				window.removeEventListener("resize", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "tabchange":
						self._onTabChange(event);
						break;
					case "sectionchange":
						self._onSectionChange(event);
						break;
					case "resize":
						self._refresh();
						break;
				}
			};

			/**
			 * Build the Tabs component
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 */
			prototype._build = function(element){

				element.classList.add(classes.TABS);
				if (element.getElementsByClassName(classes.TITLE).length) {
					element.classList.add(classes.WITH_TITLE);
				}
				return element;
			};

			/**
			 * Init the Tabs component
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Tabs
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui,
					sectionChangerSelector = engine.getWidgetDefinition("SectionChanger").selector + ",tau-sectionchanger",
					tabbarSelector = engine.getWidgetDefinition("TabBar").selector + ",tau-tabbar";

				ui.page = selectors.getClosestByClass(element, classes.PAGE);
				ui.tabbar = element.querySelector(tabbarSelector);
				ui.sectionChanger = element.querySelector(sectionChangerSelector);

				self._changed = false;
				self._lastIndex = 0;

				self._initTabbar();
				self._initSectionChanger();

				return element;
			};

			/**
			 * Set style for section changer
			 * @method _setSectionChangerStyle
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._setSectionChangerStyle = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					sectionChangerStyle = ui.sectionChanger.style,
					tabbar = ui.tabbar,
					tabbarOffsetHeight = tabbar.offsetHeight;

				sectionChangerStyle.width = window.innerWidth + "px";
				sectionChangerStyle.height = element.offsetHeight - tabbarOffsetHeight + "px";
			};

			/**
			 * Init section changer
			 * @method _initSectionChanger
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._initSectionChanger = function() {
				var self = this;

				self._component.sectionChanger = Sectionchanger(self._ui.sectionChanger);
				self._setSectionChangerStyle();
			};

			/**
			 * Init tabbar
			 * @method _initTabbar
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._initTabbar = function() {
				var self = this;

				self._component.tabbar = Tabbar(self._ui.tabbar);
			};

			/**
			 * Tabchange event handler
			 * @method _onTabChange
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype._onTabChange = function(event) {
				var self = this,
					index = event.detail.active,
					sectionChanger = self._component.sectionChanger;

				if (self._changed) {
					self._changed = false;
				} else if (self._lastIndex !== index) {
					self._changed = true;
					sectionChanger.setActiveSection(index, self.options.changeDuration);
				}
				self._lastIndex = index;
			};

			/**
			 * Sectionchange event handler
			 * @method _onSectionChange
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.Tabs
			 */
			prototype._onSectionChange = function(event) {
				var self = this,
					index = event.detail.active,
					tabbar = self._component.tabbar;

				if (self._changed) {
					self._changed = false;
				} else if (self._lastIndex !== index) {
					self._changed = true;
					tabbar.setActive(index);
				}
				self._lastIndex = index;
			};

			/**
			 * Callback on event pagebeforeshow
			 * @method onPageBeforeShow
			 * @param self
			 * @private
			 * @member ns.widget.core.Tabs
			 */
			function onPageBeforeShow(self) {
				self.refresh();
				self._component.sectionChanger.refresh();
			}

			/**
			 * bind event to the Tabs component
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._bindEvents = function() {
				var self = this;
				bindTabsEvents.call(self, self.element);

				self._callbacks.onPageBeforeShow = onPageBeforeShow.bind(null, self);
				self._ui.page.addEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow);
			};

			/**
			 * Unbind event to the Tabs component
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._unbindEvents = function() {
				var self = this;

				unBindTabsEvents.call(self, self.element);

				if (self._callbacks.onPageBeforeShow) {
					self._ui.page.removeEventListener(Page.events.BEFORE_SHOW, self._callbacks.onPageBeforeShow);
				}
			};

			/**
			 * destroy the Tabs component
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._destroy = function() {
				var self = this;

				self._unbindEvents();
				self._ui = null;
				self._component = null;
			};

			/**
			 * Refresh Tabs component
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Tabs
			 */
			prototype._refresh = function() {
				this._setSectionChangerStyle();
			};
			/**
			 * Set the active tab
			 * @method _setIndex
			 * @protected
			 * @param {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype._setIndex = function(index) {
				var self = this,
					length = self._ui.sectionChanger.getElementsByTagName("section").length;
				if (index < length && !(index < 0)) {
					self._component.tabbar.setActive(index);
				} else {
					console.warn("You inserted the wrong index value");
				}

			};

			/**
			 * Set the active tab
			 * @method setIndex
			 * @public
			 * @param {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype.setIndex = function(index) {
				this._setIndex(index);
			};

			/**
			 * Get the active tab
			 * @method _getIndex
			 * @protected
			 * @return {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype._getIndex = function() {
				return this._lastIndex;
			};

			/**
			 * Get the active tab
			 * @method getIndex
			 * @public
			 * @return {number} index
			 * @member ns.widget.core.Tabs
			 */
			prototype.getIndex = function() {
				return this._getIndex();
			};
			ns.widget.core.Tabs = Tabs;
			engine.defineWidget(
				"Tabs",
				"[data-role='tabs'], .ui-tabs",
				[
					"setIndex", "getIndex"
				],
				Tabs,
				"core"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Tabs;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
