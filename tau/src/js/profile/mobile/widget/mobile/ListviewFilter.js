/*global window, define */
/*
* Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
/*jslint nomen: true, plusplus: true */
/**
 * # ListView Filter Widget
 * Filter Extension For ListView Widget
 *
 * ## Default selectors
 * In default all ListView elements with _data-filter=true_ are changed to Tizen Web UI Listview Filter.
 *
 *		@example
 *		<ul data-role="listview" data-filter="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *
 * #### Create Listview widget with filter using tau method:
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
*		</ul>
 *		<script>
 *			var listview = tau.widget.Listview(document.getElementById("contacts"), {filter: true});
 *		</script>
 *
 * ## Options
 *
 * ### Filter
 * _data-filter_ option set to true, creates a listview filter the HTML unordered list (&lt;ul&gt;) element.
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *
 * ### Filter Placeholder
 * _data-filter-placeholder_ option sets the placeholder for filter input field.
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true" data-placeholder="First name">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *
 * ### Filter Theme
 * _data-filter-theme_ option sets the search box theme
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true" data-filter-theme="s">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *
 * ### Filter Callback
 * This option allow to change the way in which list items are filtered
 *
 *		@example
 *		<ul id="contacts" data-role="listview">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *		<script>
 *			var listview = tau.widget.Listview(document.getElementById("contacts"), {filter: true});
 *			function yourFilterFunction(text, searchValue, item) {
 *				return text.toString().toLowerCase().indexOf(searchValue) === -1;
 *			}
 *			listview.option("filterCallback", yourFilterFunction);
 *		</script>
 *
 * ### Filter text
 * _data-filtertext_ To filter list items by values other than the text,
 * add a _data-filtertext_ attribute to the list item.
 * The value of this attribute will be passed as the first argument to the filterCallback function instead of the text.
 * Alternately you can use an attribute of your choosing as defined on the list item itself.
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true">
 *			<li data-filtertext="Anton">Person</li>
 *			<li data-filtertext="Arabella">Person</li>
 *			<li>Barry</li>
 *			<li data-filtertext="Bily">Person</li>
 *		</ul>
 *
 * ## Events
 *
 * ### beforefilter
 * Triggered before the listview will be filtered.
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *		<script>
 *			var element = document.getElementById("contacts"),
 *				list = tau.widget.Listview(element);
 *
 *			// add the event handler
 *			list.on("beforefilter", function (event) {
 *				// handle event
 *			});
 *		</script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		<ul id="contacts" data-role="listview" data-filter="true">
 *			<li>Anton</li>
 *			<li>Arabella</li>
 *			<li>Barry</li>
 *			<li>Bily</li>
 *		</ul>
 *		<script>
 *			var element = document.getElementById("contacts"),
 *				contacts = tau.widget.Listview(element);
 *
 *			contacts.methodName(methodArgument1, methodArgument2, ...);
 *
 *			// or JQueryMobile notation:
 *			$(element).contacts("methodName", methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @class ns.widget.mobile.Listview.Filter
 * @override ns.widget.mobile.Listview
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/util/selectors",
			"../mobile",
			"./Listview",
			"./SearchBar"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* Local alias for ns.event
			* @property {Object} events Alias for {@link ns.event}
			* @member ns.widget.mobile.Listview.Filter
			* @static
			* @private
			*/
			var events = ns.event,

				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				engine = ns.engine,

				/**
				* Local alias for ns.util.DOM
				* @property {Object} DOM Alias for {@link ns.util.DOM}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				DOM = ns.util.DOM,

				/**
				* Local alias for ns.util.selectors
				* @property {Object} selectors Alias for {@link ns.util.selectors}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				selectors = ns.util.selectors,

				/**
				* @method defaultFilterCallback
				* @member ns.widget.mobile.Listview.Filter
				* @param {string} text
				* @param {string} searchValue
				* @return {boolean}
				* @static
				* @private
				*/
				defaultFilterCallback = function (text, searchValue) {
					return text.toString().toLowerCase().indexOf(searchValue) === -1;
				},

				/**
				* @property {Function} Listview Alias for class ns.widget.mobile.Listview
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				Listview = ns.widget.mobile.Listview,

				/**
				* Backup of _build methods for replacing it
				* @method parent_build
				* @member ns.widget.mobile.Listview.Filter
				* @private
				*/
				parent_build = Listview.prototype._build,

				/**
				* Backup of _configure methods for replacing it
				* @method parent_configure
				* @member ns.widget.mobile.Listview.Filter
				* @private
				*/
				parent_configure = Listview.prototype._configure,

				/**
				* Backup of _init methods for replacing it
				* @method parent_init
				* @member ns.widget.mobile.Listview.Filter
				* @private
				*/
				parent_init = Listview.prototype._init,

				/**
				* Backup of _bindEvents methods for replacing it
				* @method parent_bindEvents
				* @member ns.widget.mobile.Listview.Filter
				* @private
				*/
				parent_bindEvents = Listview.prototype._bindEvents,

				/**
				* Backup of _destroy methods for replacing it
				* @method parent_destroy
				* @member ns.widget.mobile.Listview.Filter
				* @private
				*/
				parent_destroy = Listview.prototype._destroy,

				/**
				 * @property {Object} listviewClasses Alias for object ns.widget.mobile.Listview.classes
				 * @member ns.widget.mobile.Listview.Filter
				 * @static
				 * @private
				 * @property {string} uiListviewFilter Main class of listview filter
				 * @property {string} uiBarPrefix Class of bar prefix
				 * @property {string} uiListviewFilterInset Class of listview filter as inset
				 * @property {string} uiFilterHidequeue The working class for prepare items queue to hiding
				 */
				ListviewClasses = Listview.classes || {},

				/**
				 * @property {Object} eventType Listview event types
				 * @property {string} [eventType.DESTROYED="destroyed"] Event is triggering after _destroy method call.
				 * @static
				 * @readonly
				 * @member ns.widget.mobile.Listview.Filter
				 */
				eventType = Listview.eventType || {},

				/**
				 * @property {string} [TYPE_FUNCTION="function"] local cache of function type name
				 * @private
				 * @static
				 * @member ns.widget.mobile.Listview.Filter
				 */
				TYPE_FUNCTION = "function";

			/**
			 * Prepare default configuration of listview widget
			 * @method _configure
			 * @member ns.widget.mobile.Listview.Filter
			 * @protected
			 */
			Listview.prototype._configure = function Listview_configure() {
				var options;
				if (typeof parent_configure === TYPE_FUNCTION) {
					parent_configure.call(this);
				}

				/**
				 * @property {Object} options Object with default options
				 * @property {boolean} [options.filter=false] Sets if filter should be enabled.
				 * @property {string} [options.filterPlaceholder=""] Sets a place holder.
				 * @property {string} [options.filterTheme="c"] Sets a theme for listview filter.
				 * @property {Function} [options.filterCallback] Sets a custom filter method
				 * @member ns.widget.mobile.Listview.Filter
				 */
				this.options = this.options || {};
				options = this.options;

				options.filter = false;
				options.filterPlaceholder = "";
				options.filterTheme = "c";
				options.filterCallback = defaultFilterCallback;
			};

			// the extension of Listview events dictionary
			/*
			 * Event is triggering after _destroy method call
			 * @event beforefilter
			 * @member ns.widget.mobile.Listview.Filter
			 */
			eventType.BEFORE_FILTER = "beforefilter";

			// the extension of Listview classes
			ListviewClasses.uiListviewFilter = "ui-listview-filter";
			ListviewClasses.uiBarPrefix = "ui-bar-";
			ListviewClasses.uiListviewFilterInset = "ui-listview-filter-inset";
			ListviewClasses.uiFilterHidequeue = "ui-filter-hidequeue";

			/**
			* Initialize filter features on Listview
			* Override method "_build" from Listview & call the protected "_build"
			* @method _build
			* @member ns.widget.mobile.Listview.Filter
			* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			* @return {HTMLUListElement|HTMLOListElement}
			* @protected
			*/
			Listview.prototype._build = function Listview_build(element) {
				var wrapper,
					wrapperClass,
					search,
					options = this.options,
					classes = Listview.classes,
					id = this.id;

				parent_build.call(this, element);

				if (options.filter) {
					wrapper = document.createElement("form");
					wrapperClass = wrapper.classList;
					wrapperClass.add(classes.uiListviewFilter);
					wrapperClass.add(classes.uiBarPrefix + options.filterTheme);
					wrapper.setAttribute("role", "search");
					wrapper.setAttribute("id", id + "-form");
					search = document.createElement("input");
					search.setAttribute("placeholder", options.filterPlaceholder);
					search.setAttribute("type", "search");
					DOM.getNSData(search, "lastval", "");
					search.setAttribute("id", id + "-search");
					wrapper.appendChild(search);
					if (options.inset) {
						wrapperClass.add(options.uiListviewFilterInset);
					}
					DOM.insertNodesBefore(element, wrapper);
					engine.instanceWidget(search, "Searchbar");
				}
				return element;
			};

			/**
			 * Handle method event for change of the filter input field
			 * @param {ns.widget.mobile.Listview} self instance of listview widget
			 * @param {Event} event triggered event
			 * @member ns.widget.mobile.Listview.Filter
			 * @static
			 * @private
			 */
			function inputChangeHandler(self, event) {
				var search = event.target,
					val = search.value.toLowerCase(),
					listItems = null,
					lastval = DOM.getNSData(search, "lastval") || "",
					childItems = false,
					itemtext = "",
					item,
					// Check if a custom filter callback applies
					isCustomFilterCallback = self.options.filterCallback !== defaultFilterCallback,
					list = self.element,
					classes = Listview.classes,
					i,
					slice = [].slice;

				events.trigger(list, eventType.BEFORE_FILTER, { input: search });

				// Change val as lastval for next execution
				DOM.setNSData(search, "lastval", val);
				if (val) {
					if (isCustomFilterCallback || val.length < lastval.length || val.indexOf(lastval) !== 0) {
						// Custom filter callback applies or removed chars or pasted something totally different, check all items
						listItems = slice.call(list.children);
					} else {
						// Only chars added, not removed, only use visible subset
						listItems = slice.call(selectors.getChildrenBySelector(list, ":not(.ui-screen-hidden)"));
					}
					// This handles hiding regular rows without the text we search for
					// and any list dividers without regular rows shown under it
					for (i = listItems.length - 1; i >= 0; i--) {
						item = listItems[i];

						itemtext =  DOM.getNSData(item, "filtertext") || item.innerText;

						if (DOM.getNSData(item, "role") === "list-divider") {
							if (childItems) {
								item.classList.remove(classes.uiFilterHidequeue);
							} else {
								item.classList.add(classes.uiFilterHidequeue);
							}
							// New bucket!
							childItems = false;
						} else if (self.options.filterCallback(itemtext, val, item)) {
							//mark to be hidden
							item.classList.add(classes.uiFilterHidequeue);
						} else {
							// There's a shown item in the bucket
							childItems = true;
						}
					}
					// Hide elements which marked to hide
					listItems.forEach(function (item) {
						var itemClassList = item.classList;
						if (itemClassList.contains(classes.uiFilterHidequeue)) {
							itemClassList.add("ui-screen-hidden");
							itemClassList.remove(classes.uiFilterHidequeue);
						} else {
							itemClassList.remove("ui-screen-hidden");
						}
					});
				} else {
					slice.call(list.children).forEach(function (item) {
						item.classList.remove("ui-screen-hidden");
					});
				}
				// @todo self._refreshCorners(); this trigger should move to refreshCorners
				events.trigger(self.element, "updatelayout");
			}

			/**
			 * @param {Event} event
			 * @method preventDefault
			 * @private
			 * @static
			 */
			function preventDefault(event) {
				event.preventDefault();
			}

			/**
			 * Initialize properties of widget
			 * Override method "_init" from Listview & call the protected "_init"
			 * @method _init
			 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			 * @return {HTMLUListElement|HTMLOListElement}
			 * @member ns.widget.mobile.Listview.Filter
			 * @protected
			 */
			Listview.prototype._init = function Listview_init(element) {
				var id = element.id;

				this._ui = this._ui || {};
				this._ui.form = document.getElementById(id + "-form");
				this._ui.search = document.getElementById(id + "-search");

				if (typeof parent_init === TYPE_FUNCTION) {
					parent_init.call(this, element);
				}

				return element;
			};

			/**
			 * Bind events to HTML elements
			 * Override method "_bindEvents" from Listview & call the protected "_bindEvents"
			 * @method _bindEvents
			 * @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			 * @return {HTMLUListElement|HTMLOListElement}
			 * @member ns.widget.mobile.Listview.Filter
			 * @protected
			 */
			Listview.prototype._bindEvents = function Listview_bindEvents(element) {
				var search = this._ui.search;
				parent_bindEvents.call(this, element);

				if (search) {
					this._inputChangeHandler = inputChangeHandler.bind(null, this);
					search.addEventListener("keyup", this._inputChangeHandler, false);
					search.addEventListener("change", this._inputChangeHandler, false);
					search.addEventListener("submit", preventDefault, false);
				}
			};

			/**
			 * Removing and cleaning filter extension
			 * Override method "_destroy" from Listview & call the protected "_destroy"
			 * @method _destroy
			 * @member ns.widget.mobile.Listview.Filter
			 * @protected
			 */
			Listview.prototype._destroy = function Listview_destroy() {
				var search = this._ui.search;
				if (search) {
					search.removeEventListener("keyup", this._inputChangeHandler, false);
					search.removeEventListener("change", this._inputChangeHandler, false);
					search.removeEventListener("submit", preventDefault, false);
				}
				// call protected method from Listview;
				if (typeof parent_destroy === TYPE_FUNCTION) {
					parent_destroy.call(this);
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return false;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
