/*global window, define, ns, $ */
/*jslint nomen: true, white: true, plusplus: true*/
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Extendable List Widget
 * The extendable list is used to display a list of data elements that can be extended.
 *
 * @class ns.widget.ExtendableList
 * @extend ns.widget.BaseWidget
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */
(function(document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils",
			"../../../../core/utils/DOM",
			"../../../../core/theme",
			"../mobile", // fetch namespace
			"./Listview",
			"./BaseWidgetMobile"
		],
		function() {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {ns.widget.mobile.Listview} Listview alias variable
			 * @private
			 * @static
			 */
			var Listview = ns.widget.mobile.Listview,

				/**
				 * @property {Object} parent_refresh Shortcut for parent's {@link ns.widget.mobile.Listview#refresh}
				 * method from {@link ns.widget.mobile.Listview.prototype}
				 * @private
				 * @static
				 * @member ns.widget.ExtendableList
				 */
					parent_build = Listview.prototype._build,
				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @private
				 * @static
				 * @member ns.widget.ExtendableList
				 */
					engine = ns.engine,
				utils = ns.utils,
				DOM = ns.utils.DOM,
				/**
				 * Local constructor function
				 * @method ExtendableList
				 * @private
				 * @member ns.widget.ExtendableList
				 */
					ExtendableList = function() {
					var self = this;

					/**
					 * @property {number} _currentIndex Current zero-based index of data set.
					 * @member ns.widget.ExtendableList
					 * @protected
					 * @instance
					 */
					self._currentIndex = 0;

					/**
					 * @property {Object} options ExtendableList widget options.
					 * @property {number} [options.bufferSize=100] Number of items of result set. The default value is 100.
					 * As the value gets higher, the loading time increases while the system performance
					 * improves. So you need to pick a value that provides the best performance
					 * without excessive loading time. It's recomended to set bufferSize at least 3 times bigger than number
					 * of visible elements.
					 * @property {number} [options.dataLength=0] Total number of items.
					 * @property {string} [options.orientation='y'] Scrolling orientation. Default vertical scrolling enabled.
					 * @property {Object} options.listItemUpdater Holds reference to method which modifies list item, depended
					 * at specified index from database. **Method should be overridden by developer using
					 * {@link ns.widget.ExtendableList#setListItemUpdater} method.** or defined as a config
					 * object. Method takes two parameters:
					 *  -  element {HTMLElement} List item to be modified
					 *  -  index {number} Index of data set
					 * @member ns.widget.ExtendableList
					 */
					self.options = {
						bufferSize: 50,
						dataLength: 0,
						listItemUpdater: null,
						listItemLoader: null,
						loadMore: 'tmp_load_more'
					};

					//@TODO jQuery template, change for better templating system
					self._jQueryTmpl = false;
					self.$tmpl = {};

					/**
					 * @property {Object} _listItemLoaderBound Binding for loader item to fire method {ns.widget.ExtendableList._buildList}.
					 * @member ns.widget.ExtendableList
					 * @protected
					 * @instance
					 */
					self._listItemLoaderBound = null;
				},

				classes = {
					CONTAINER: "ui-extendable-list-container",
					ACTIVE: "ui-listview-active"
				},
			// Cached prototype for better minification
				prototype = new Listview();

			function _unbindLoader(self, loaderItem) {
				if (self._listItemLoaderBound !== null) {
					loaderItem.removeEventListener('click', self._listItemLoaderBound, false);
				}
				self._listItemLoaderBound = null;
			}

			function _bindLoader(self, loaderItem) {
				if (loaderItem) {
					_unbindLoader(self, loaderItem);
					self._listItemLoaderBound = self._buildList.bind(self);
					loaderItem.addEventListener('click', self._listItemLoaderBound, false);
				}
			}


			/**
			 * Updates list item using user defined listItemUpdater function.
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._updateListItem = function (element, index) {
				var self = this,
					listItemUpdater = self.options.listItemUpdater;

				//@TODO jQuery template, change for better templating system
				if (self._jQueryTmpl === true) {
					element.innerHTML = self.$tmpl.item.tmpl(listItemUpdater(index))[0].innerHTML;
					engine.createWidgets(element);
				} else {
					listItemUpdater(element, index);
				}
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @param {string} template
			 * @param {HTMLElement} element Widget's element
			 * @return {HTMLElement} Element on which built is widget
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._build = function (element) {
				var self = this;

				//Call parent's method
				parent_build.call(self, element);

				element.classList.add(classes.CONTAINER);
				self._currentIndex = 0;
				return element;
			};

			/**
			 * Builds Virtual List structure
			 * @method _buildList
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._buildList = function() {
				var listItem,
					self = this,
					list = self.element,
					options = self.options,
					bufferSize = options.bufferSize,
					dataLength = options.dataLength - 1, // Indexes are 0 based
					numberOfItems,
					documentFragment = document.createDocumentFragment(),
					currentIndex = self._currentIndex,
					loaderItem = null,
					i;

				// Get loader item if exists or create new one
				loaderItem = currentIndex > 0 ? list.lastElementChild : document.createElement("li");

				// Get number of items to load
				numberOfItems = currentIndex + bufferSize > dataLength ? dataLength - currentIndex : bufferSize;

				// Load additional items
				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement("li");
					self._updateListItem(listItem, i + currentIndex);
					documentFragment.appendChild(listItem);
				}

				// Append new items
				list.appendChild(documentFragment);

				// Update current Index
				currentIndex += numberOfItems;

				// Get number of items to load for next time
				numberOfItems = currentIndex + bufferSize > dataLength ? dataLength - currentIndex : bufferSize;

				if (numberOfItems > 0) {
					// Add loader item
					list.appendChild(loaderItem);
					// Update loader
					//@TODO jQuery template, change for better templating system
					if (self._jQueryTmpl === true) {
						loaderItem.innerHTML = self.$tmpl.more.tmpl({ "NUM_MORE_ITEMS" : numberOfItems })[0].innerHTML;
						engine.createWidgets(loaderItem);
					} else {
						options.listItemLoader(loaderItem, numberOfItems);
					}
					_bindLoader(self, loaderItem);
				} else {
					// Remove loader item node
					if (loaderItem.parentElement) {
						loaderItem.parentElement.removeChild(loaderItem);
						_unbindLoader(self, loaderItem);
					}
					loaderItem = null;
				}

				self._currentIndex = currentIndex;
				self._refresh();
			};

			prototype._configureNormal = function (config) {
				var options = this.options;

				if (utils.isNumber(config.dataLength)) {
					options.dataLength = config.dataLength;
				}

				if (utils.isNumber(config.bufferSize)) {
					options.bufferSize = config.bufferSize;
				}

				if (typeof config.listItemLoader === 'function') {
					options.listItemLoader = config.listItemLoader;
				}

				if (typeof config.listItemUpdater === 'function') {
					options.listItemUpdater = config.listItemUpdater;
				}
			};

			//@TODO jQuery template, change for better templating system
			prototype._configureTemplate = function (config) {
				var self = this,
					$tmpl = self.$tmpl,
					element = self.element,
					options = self.options,
					tmp;

				// Set jQueryTmpl mode
				//@TODO jQuery template, change for better templating system
				self._jQueryTmpl = true;

				// Assign buffer size
				tmp = DOM.getNSData(element, 'extenditems');
				options.bufferSize = config.extenditems ? parseInt(config.extenditems, 10)  || 0 : parseInt(tmp, 10) || 0;

				// Assign template for item
				tmp = DOM.getNSData(element, 'template');
				options.template = config.template || tmp;
				$tmpl.item = $('#' + options.template);

				// Assign update function for list items
				if (config.itemData) {
					options.listItemUpdater = config.itemData;
				}

				// Assign load more item
				tmp = DOM.getNSData(element, 'loadmore');
				if (config.loadmore || tmp) {
					options.loadMore = config.loadmore || tmp;
				}
				$tmpl.more = $('#' + options.loadMore);

				tmp = DOM.getNSData(element, 'numitemdata');
				options.dataLength = config.numItemData || tmp;

			};

			prototype._configure = function () {
				var self = this,
					options = self.options;

				// Check option for old Tizen web UI
				if (options.extenditems && !options.bufferSize) {
					options.bufferSize = parseInt(options.extenditems, 10) || 0;
				}

				if (options.dataLength < options.bufferSize) {
					options.bufferSize = options.dataLength - 1;
				}

				if (options.bufferSize < 1) {
					options.bufferSize = 1;
				}
			};

			/**
			 * Initialize widget on an element.
			 * @method _init
			 * @param {HTMLElement} element Widget's element
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._init = function(element) {
				var self = this;

				// Set current index to first element
				self._currentIndex = 0;

				// Assign variables to members
				self.element = element;

				// Build first part of list
				self._buildList();
			};

			/**
			 * Refresh list
			 * @method _refresh
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._refresh = function(create) {
				// Refresh
				//Calling NOT overrided parent's method
				this._refreshItems(this.element, !!create);
			};

			/**
			 * Binds ExtendableList events
			 * @method _bindEvents
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._bindEvents = function() {
				var self = this;

				_bindLoader(self, self.element.lastElementChild);
			};

			/**
			 * Cleans widget's resources
			 * @method _destroy
			 * @member ns.widget.ExtendableList
			 * @protected
			 * @instance
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					listItem,
					loaderItem = element.lastElementChild;

				_unbindLoader(self, loaderItem);

				//Remove li elements.
				while (element.firstElementChild) {
					listItem = element.firstElementChild;
					element.removeChild(listItem);
				}
			};

			/**
			 * Builds widget
			 * @method create
			 * @member ns.widget.ExtendableList
			 */
			prototype.create = function(config) {
				var self = this,
					element = self.element;

				//@TODO jQuery template, change for better templating system
				if (self._jQueryTmpl || config.template || config.itemData) {
					self._configureTemplate(config);
				} else {
					self._configureNormal(config);
				}
				self._currentIndex = 0;
				self._buildList();
				_bindLoader(self, element.lastElementChild);
			};

			/**
			 * Recreates widget. Removes loaded data and loads only first part of data.
			 * @method create
			 * @member ns.widget.ExtendableList
			 */
			prototype.recreate = function(newArray){
				var element = this.element;

				while (element.hasChildNodes()) {
					element.removeChild(element.lastChild);
				}

				return this.create({
					itemData: function ( idx ) { return newArray[ idx ]; },
					numItemData: newArray.length
				});
			};


			/**
			 * Sets list item updater function. To learn how to create list item updater function please
			 * visit Virtual List User Guide
			 * @method setListItemUpdater
			 * @param {Object} updateFunction Function reference.
			 * @member ns.widget.ExtendableList
			 */
			prototype.setListItemUpdater = function(updateFunction) {
				this.options.listItemUpdater = updateFunction;
			};

			/**
			 * Sets list item updater function. To learn how to create list item updater function please
			 * visit Virtual List User Guide
			 * @method setListItemUpdater
			 * @param {Object} updateFunction Function reference.
			 * @member ns.widget.ExtendableList
			 */
			prototype.setListItemLoader = function(loadFunction) {
				this.options.listItemLoader = loadFunction;
			};

			/**
			 * Returns widget options.
			 * @method option
			 * @member ns.widget.ExtendableList
			 * @deprecated Web UI compability method.
			 */
			prototype.option = function() {
				var options = this.options;

				return {
					"id": '#' + this.element.id,
					"childSelector": 'li',
					"extenditems": options.bufferSize,
					"template": options.template,
					"loadmore": options.loadMore,
					"numitemdata": options.dataLength,
					"scrollview": true
				};
			};


			/**
			 * @property {Object} classes Dictionary object containing commonly used widget classes
			 * @static
			 * @member ns.widget.ExtendableList
			 */
			ExtendableList.classes = classes;

			// Assign prototype
			ExtendableList.prototype = prototype;

			// definition
			ns.widget.mobile.ExtendableList = ExtendableList;

			engine.defineWidget(
				"ExtendableList",
				"[data-role='extendablelist'], .ui-extendablelist",
				["recreate", "create", "option", "setListItemUpdater", "getTopByIndex", "scrollTo", "scrollToIndex"],
				ExtendableList,
				"tizen"
			);


			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ExtendableList;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));