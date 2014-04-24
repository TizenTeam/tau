/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
* @author Tomasz Lukawski <t.lukawski@samsung.com>
* @class ns.widget.mobile.Listview.Autodividers
* @override ns.widget.mobile.Listview
 */
(function (document, ns) {
	'use strict';
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/selectors",
			"../mobile",
			"./Listview",
			"./Listdivider"
		],
		function () {
			//>>excludeEnd('tauBuildExclude');
			/**
			* Local alias for ns.utils.selectors
			* @property {Object} selectors Alias for {@link ns.utils.selectors}
			* @member ns.widget.mobile.Listview.Autodividers
			* @static
			* @private
			*/
			var selectors = ns.utils.selectors,

				/**
				* Local alias for ns.engine
				* @property {Object} engine Alias for {@link ns.engine}
				* @member ns.widget.mobile.Listview.Autodividers
				* @static
				* @private
				*/
				engine = ns.engine,

				/**
				* Object contains handlers for listeners of "beforeRefreshListItems" event,
				* Keys are [instance].id
				* @property {Object} onBeforeRefreshListItems description
				* @member ns.widget.mobile.Listview.Autodividers
				* @static
				* @private
				*/
				beforeRefreshListItemsHandlers = {},

				/**
				* Handler method for event "beforerefreshitems"
				* @method beforeRefreshListItems
				* @member ns.widget.mobile.Listview.Autodividers
				* @param {ns.widget.mobile.Listview} listview instance of Listview.
				* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement
				* @static
				* @private
				*/
				beforeRefreshListItems = function beforeRefreshListItems(listview, element) {
					if (listview.options.autodividers) {
						listview.addAutodividers(element);
					}
				},

				/**
				* Method finding text in list element and return first letter
				* @method findFirstLetter
				* @member ns.widget.mobile.Listview.Autodividers
				* @param {HTMLUListElement|HTMLOListElement} listElement bound UList or OList HTMLElement
				* @return {null|string} return 'null' if doesn't text found
				* @static
				* @private
				*/
				findFirstLetter = function (listElement) {
					// look for the text in the given element
					var text = listElement.textContent || null;
					if (!text) {
						return null;
					}
					// create the text for the divider (first uppercased letter)
					text = text.trim().slice(0, 1).toUpperCase();
					return text;
				},

				/**
				* Method removes list dividers from list.
				* @method removeDividers
				* @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement
				* @member ns.widget.mobile.Listview.Autodividers
				* @static
				* @private
				*/
				removeDividers = function removeDividers(list) {
					var liCollection = selectors.getChildrenBySelector(list, 'li[data-role="list-divider"]'),
						i,
						len = liCollection.length;
					for (i = 0; i < len; i++) {
						list.removeChild(liCollection[i]);
					}
				},

				/**
				* Insert list dividers into list.
				* @method insertAutodividers
				* @param {ns.widget.mobile.Listview} self
				* @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement
				* @member ns.widget.mobile.Listview.Autodividers
				* @static
				* @private
				*/
				insertAutodividers = function insertAutodividers(self, list) {
						/*
						* @property {NodeList} liCollection collection of HTMLLIElements
						*/
					var liCollection = selectors.getChildrenByTag(list, 'li'),
						/*
						* @property {HTMLLIElement} li HTMLLIElement
						*/
						li,
						/*
						* @property {string|null} lastDividerText Text in last divider for comparison
						*/
						lastDividerText = null,
						/*
						* @property {string|null} dividerText Text found in LI element
						*/
						dividerText,
						/*
						* @property {ns.widget.listdivider} divider Instance of divider widget
						*/
						divider,
						/*
						* @property {Number} i Counter of loop
						*/
						i,
						/*
						* @property {Number} len Length of collection of HTMLLIElements
						*/
						len;

					for (i = 0, len = liCollection.length; i < len; i++) {
						li = liCollection[i];
						dividerText = self.options.autodividersSelector(li);
						if (dividerText && lastDividerText !== dividerText) {
							divider = document.createElement('li');
							divider.appendChild(document.createTextNode(dividerText));
							divider.setAttribute('data-role', 'list-divider');
							li.parentNode.insertBefore(divider, li);
							engine.instanceWidget(divider, 'Listdivider');
						}
						lastDividerText = dividerText;
					}
				},

				/**
				* Major method of autodividers extension.
				* It removes old and inserts new dividers.
				* @method replaceDividers
				* @member ns.widget.mobile.Listview.Autodividers
				* @param {ns.widget.mobile.Listview} self
				* @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement.
				* @static
				* @private
				*/
				replaceDividers = function replaceDividers(self, list) {
					// remove dividers if exists;
					removeDividers(list);
					// insert new dividers;
					insertAutodividers(self, list);
				},

				/**
				* @property {Function} Listview Alias for class ns.widget.mobile.Listview
				* @member ns.widget.mobile.Listview.Autodividers
				* @static
				* @private
				*/
				Listview = ns.widget.mobile.Listview,

				/**
				* Backup of _build methods for replacing it
				* @method parent_build
				* @member ns.widget.mobile.Listview.Autodividers
				* @private
				*/
				parent_build = Listview.prototype._build,

				/**
				* Backup of _configure methods for replacing it
				* @method parent_configure
				* @member ns.widget.mobile.Listview.Autodividers
				* @private
				*/
				parent_configure = Listview.prototype._configure,

				/**
				* Backup of _init methods for replacing it
				* @method parent_init
				* @member ns.widget.mobile.Listview.Autodividers
				* @private
				*/
				parent_init = Listview.prototype._init,

				/**
				* Backup of _destroy methods for replacing it
				* @method parent_destroy
				* @member ns.widget.mobile.Listview.Autodividers
				* @private
				*/
				parent_destroy = Listview.prototype._destroy,

				/**
				* Initializing autodividers on Listview instance
				* @method initializeAutodividers
				* @member ns.widget.mobile.Listview.Autodividers
				* @param {ns.widget.mobile.Listview} self listview instance.
				* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
				* @static
				* @private
				*/
				initializeAutodividers = function initializeAutodividers(self, element) {
					var onBeforeRefreshListItems = beforeRefreshListItems.bind(null, self, element);
					beforeRefreshListItemsHandlers[self.id] = onBeforeRefreshListItems;
					/**
					* Adding new property for Widget's options
					* @expose
					* @property {Boolean} [options.autodividers=false]
					* @member ns.widget.mobile.Listview.Autodividers
					* @instance
					*/
					self.options.autodividers = false;
					self._getCreateOptions(element);
					element.addEventListener('beforerefreshitems',
						onBeforeRefreshListItems);
				};

			/**
			* Rebuilding html list element
			* @method addAutodividers
			* @member ns.widget.mobile.Listview.Autodividers
			* @param {HTMLUListElement|HTMLOListElement} list bound UList or OList HTMLElement.
			* @instance
			*/
			Listview.prototype.addAutodividers = function addAutodividers(list) {
				replaceDividers.call(null, this, list);
			};

			/**
			* @expose
			* @method _setAutodividers
			* @member ns.widget.mobile.Listview.Autodividers
			* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			* @param {boolean} enabled
			* @return {boolean}
			* @instance
			* @protected
			*/
			Listview.prototype._setAutodividers = function Listview_setAutodividers(element, enabled) {
				var options = this.options;
				if (options.autodividers === enabled) {
					return false;
				}
				// If autodividers option is changing from 'true' to 'false'
				// we need remove older dividers;
				if (options.autodividers && !enabled) {
					removeDividers(element);
				}
				options.autodividers = enabled;
				element.setAttribute('data-autodividers', enabled);
				if (enabled) {
					this.refresh();
				}
				return true;
			};

			/**
			* @method _configure
			* @member ns.widget.mobile.Listview.Autodividers
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
				options.autodividers = false;
				/** @expose */
				options.autodividersSelector = findFirstLetter;
			};

			/**
			* Initialize autodividers features on Listview
			* Override method '_build' from Listview & call the protected '_build'
			* @method _build
			* @member ns.widget.mobile.Listview.Autodividers
			* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			* @return {HTMLUListElement|HTMLOListElement}
			* @instance
			* @protected
			*/
			Listview.prototype._build = function Listview_build(element) {
				initializeAutodividers(this, element);
				return parent_build.call(this, element);
			};

			/**
			* Initialize autodividers features on Listview
			* Override method '_init' from Listview & call the protected '_init' or 'init'
			* @method _init
			* @member ns.widget.mobile.Listview.Autodividers
			* @param {HTMLUListElement|HTMLOListElement} element bound UList or OList HTMLElement.
			* @return {HTMLUListElement|HTMLOListElement}
			* @instance
			* @protected
			*/

			Listview.prototype._init = function Listview_init(element) {
				var autodividers = this.options.autodividers;
				if (autodividers === undefined || autodividers === null) {
					initializeAutodividers(this, element);
				}
				return (typeof parent_init === 'function') ?
						parent_init.call(this, element) :
						element;
			};

			/**
			* Removing and cleaning autodividers extension
			* Override method '_destroy' from Listview & call the protected '_destroy'
			* @method _destroy
			* @member ns.widget.mobile.Listview.Autodividers
			* @instance
			* @protected
			*/
			Listview.prototype._destroy = function _destroy() {
				var element = this.element;
				element.removeEventListener('beforerefreshitems',
					beforeRefreshListItemsHandlers[this.id]);
				this.options.autodividers = null;
				// delete attribute
				element.removeAttribute('data-autodividers');
				// recovery previous version of protected methods;
				this._build = parent_build;
				this._init = parent_init;
				this._destroy = parent_destroy;
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