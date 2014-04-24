/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
* @author Maciej Urbanski <m.urbanski@samsung.com>
* @class ns.widget.mobile.Listview.Filter
* @override ns.widget.mobile.Listview
 */
(function (document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/events",
			"../../utils/DOM/attributes",
                        "../../utils/DOM/manipulation",
			"../../utils/selectors",
			"../mobile",
			"./Listview",
			"./Searchbar"
		],
		function () {
			//>>excludeEnd('tauBuildExclude');
			/**
			* Local alias for ns.utils.events
			* @property {Object} events Alias for {@link ns.utils.events}
			* @member ns.widget.mobile.Listview.Filter
			* @static
			* @private
			*/
			var events = ns.utils.events,

				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				engine = ns.engine,

				/**
				* Local alias for ns.utils.DOM
				* @property {Object} DOM Alias for {@link ns.utils.DOM}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				DOM = ns.utils.DOM,

				/**
				* Local alias for ns.utils.selectors
				* @property {Object} selectors Alias for {@link ns.utils.selectors}
				* @member ns.widget.mobile.Listview.Filter
				* @static
				* @private
				*/
				selectors = ns.utils.selectors,

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
				parent_destroy = Listview.prototype._destroy;

			/**
			* @method _configure
			* @member ns.widget.mobile.Listview.Filter
			* @instance
			* @protected
			*/
			Listview.prototype._configure = function Listview_configure() {
				var options;
				if (typeof parent_configure === 'function') {
					parent_configure.call(this);
				}

				this.options = this.options || {};
				options = this.options;

				/** @expose */
				options.filter = false;
				/** @expose */
				options.filterPlaceholder = '';
				/** @expose */
				options.filterTheme = 'c';
				/** @expose */
				options.filterCallback = defaultFilterCallback;
			};

			Listview.classes = Listview.classes || {};
			Listview.classes.uiListviewFilter = 'ui-listview-filter';
			Listview.classes.uiBarPrefix = 'ui-bar-';
			Listview.classes.uiListviewFilterInset = 'ui-listview-filter-inset';
			Listview.classes.uiFilterHidequeue = "ui-filter-hidequeue";

			/**
			* Initialize autodividers features on Listview
			* Override method '_build' from Listview & call the protected '_build'
			* @method _build
			* @member ns.widget.mobile.Listview.Filter
			* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			* @return {HTMLUListElement|HTMLOListElement}
			* @instance
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
					wrapper = document.createElement('form');
					wrapperClass = wrapper.classList;
					wrapperClass.add(classes.uiListviewFilter);
					wrapperClass.add(classes.uiBarPrefix + options.filterTheme);
					wrapper.setAttribute('role', 'search');
					wrapper.setAttribute('id', id + '-form');
					search = document.createElement('input');
					search.setAttribute('placeholder', options.filterPlaceholder);
					search.setAttribute('type', 'search');
					DOM.getNSData(search, 'lastval', '');
					search.setAttribute('id', id + '-search');
					wrapper.appendChild(search);
					if (options.inset) {
						wrapperClass.add(options.uiListviewFilterInset);
					}
					DOM.insertNodesBefore(element, wrapper);
					engine.instanceWidget(search, 'Searchbar');
				}
				return element;
			};

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

				events.trigger(list, "beforefilter", { input: search });

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

						if (DOM.getNSData(item, "role") === 'list-divider') {
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
				events.trigger(self.element, 'updatelayout');
			}

			function preventDefault(event) {
				event.preventDefault();
			}

			Listview.prototype._init = function Listview_init(element) {
				var id = element.id;

				this._ui = this._ui || {};
				this._ui.form = document.getElementById(id + "-form");
				this._ui.search = document.getElementById(id + "-search");

				if (typeof parent_init === 'function') {
					parent_init.call(this, element);
				}

				return element;
			};

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
			* Removing and cleaning autodividers extension
			* Override method '_destroy' from Listview & call the protected '_destroy'
			* @method _destroy
			* @member ns.widget.mobile.Listview.Filter
			* @instance
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
				if (typeof parent_destroy === 'function') {
					parent_destroy.call(this);
				}
			};
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return false;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
