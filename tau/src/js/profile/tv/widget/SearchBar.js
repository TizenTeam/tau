/*global window, define, ns */
/**
 * # Search Bar Widget
 * The search filter bar widget is used to search for page content.
 *
 * This widget can be placed in the header or page content.
 *
 * For more information please read documentation of parent widget.
 * #Search Bar Widget
 * @class ns.widget.tv.SearchBar
 * @extends ns.widget.mobile.SearchBar
 */
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
		 	"../../../profile/mobile/widget/mobile/SearchBar",
			"../../../core/engine",
			"../../../core/util/object",
			"./BaseKeyboardSupport",
			"../tv"
		],
		function () {
//>>excludeEnd("tauBuildExclude");
			var BaseSearchBar = ns.widget.mobile.SearchBar,
				BaseSearchBarPrototype = BaseSearchBar.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				engine = ns.engine,
				objectUtils = ns.util.object,
				SearchBar = function() {
					var self = this;

					BaseSearchBar.call(self);
					self._callbacks = {};
					BaseKeyboardSupport.call(self);
					self._previousCharPosition = 0;
				},
				/**
				 * Dictionary for SearchBar related css class names
				 * @property {Object} classes
				 * @member ns.widget.tv.SearchBar
				 * @static
				 */
				classes = objectUtils.merge({}, BaseSearchBar.classes, {
						iconBox: "ui-search-bar-icon-box"
					}),
				prototype = new BaseSearchBar();

			SearchBar.prototype = prototype;
			SearchBar.classes = classes;

			/**
			 * Build icon with loop on Search Bar
			 * @method _buildIcon
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SearchBar
			 */
			prototype._buildIcon = function(element) {
				var icon = document.createElement("span");
				icon.classList.add(classes.iconBox);
				element.parentNode.appendChild(icon);
			};

			/**
			 * Change default value of options
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SearchBar
			 */
			prototype._configure = function(element) {
				BaseSearchBarPrototype._configure.call(this, element);
				this.options.clearButton = false;
			};

			/**
			 * Build widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SearchBar
			 */
			prototype._build = function(element) {
				BaseSearchBarPrototype._build.call(this, element);
				this._buildIcon(element);
				return element;
			};


			/**
			 * Method overrides Textarea behavior on keyup event.
			 * @method onKeyUp
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.SearchBar
			 */
			function onKeyUp(self, event) {
				var textarea = self.element,
					value = textarea.value,
					charCount = value.length,
					currentCharPosition = textarea.selectionStart;

				switch (event.keyCode) {
					case KEY_CODES.left:
						if (currentCharPosition > 0 || self._previousCharPosition !== charCount) {
							// we do not jump to other element
							event.stopImmediatePropagation();
						}
						break;
					case KEY_CODES.right:
						if (currentCharPosition < charCount || self._previousCharPosition !== charCount) {
							// we do not jump to other element
							event.stopImmediatePropagation();
						}
						break;
				}

				self._previousCharPosition = charCount;
			}

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SearchBar
			 */
			prototype._bindEvents = function(element) {
				var self = this,
					callbacks = self._callbacks;
				BaseSearchBarPrototype._bindEvents.call(self, element);

				self._bindEventKey();

				callbacks.onKeyup = onKeyUp.bind(null, self);
				element.addEventListener("keyup", callbacks.onKeyup, false);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.tv.SearchBar
			 */
			prototype._destroy = function(element) {
				var self = this,
					callbacks = self._callbacks;

				BaseSearchBarPrototype._destroy.call(self, element);

				self._destroyEventKey();

				element.removeEventListener("keyup", callbacks.onKeyup, false);
			};

			engine.defineWidget(
				"SearchBar",
				"input[type='search'], [data-type='search'], [data-type='tizen-search'], .ui-searchbar",
				[],
				SearchBar,
				"tv",
				true
			);

			BaseKeyboardSupport.registerActiveSelector("." + classes.uiInputText);

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.SearchBar = SearchBar;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
