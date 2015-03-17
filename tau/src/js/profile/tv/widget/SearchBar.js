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
				initialScreenHeight = window.innerHeight,
				objectUtils = ns.util.object,
				stateForElement = false,
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
				element.parentNode.parentNode.setAttribute("tabindex", 0);
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
			 * @param {SearchBar} self
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
			 * Enable or disable keyboard support after resize od screen (open
			 * virtual keyboard)
			 * @method onResize
			 * @param {ns.widget.tv.SearchBar} self
			 * @private
			 * @static
			 * @member ns.widget.tv.SearchBar
			 */
			function onResize(self) {
				if (window.innerHeight < initialScreenHeight) {
					self.saveKeyboardSupport();
					self.enableKeyboardSupport();
				} else {
					self.disableKeyboardSupport();
					self.restoreKeyboardSupport();
				}
			}

			/**
			 * Callback enable/disbale focus on input element
			 * @method onKeyupInput
			 * @param {TextInput} self
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.tv.SearchBar
			 */
			function onKeyupInputContainer(self, event) {
				var element = self.element,
					eventTarget = event.target,
					elementTypeName = element.tagName.toLowerCase();

				switch (event.keyCode) {
					case KEY_CODES.enter:
						//when the keyboard is on
						if (window.innerHeight < initialScreenHeight) {
							self.saveKeyboardSupport();
							self.enableKeyboardSupport();
						} else {
							self.disableKeyboardSupport();
							self.restoreKeyboardSupport();
							//check if enter to the input or textarea and get focus
							if (stateForElement) {
								eventTarget.parentElement.parentElement.focus();
							} else {
								//only on container
								if (eventTarget.tagName.toLowerCase() === "div"){
									eventTarget.querySelector(elementTypeName).focus();
									//preserve class ui-focus on container for css styling
									eventTarget.classList.add(classes.uiFocus);
								}
							}
							stateForElement = !stateForElement;
						}
						break;
				}
			}

			/**
			 * Callback for focus event on input
			 * @method inputFocus
			 * @param {ns.widget.tv.SearchBar} self
			 * @static
			 * @private
			 * @member ns.widget.tv.SearchBar
			 */
			function inputFocus(self) {
				var ui = self._ui,
					input = self.element;

				self.disableKeyboardSupport();
				if (!input.getAttribute("disabled")) {
					input.parentElement.classList.add(classes.uiFocus);
				}
			}

			/**
			 * Callback for blur event on input
			 * @method inputBlur
			 * @param {ns.widget.tv.SearchBar} self
			 * @static
			 * @private
			 * @member ns.widget.tv.SearchBar
			 */
			function inputBlur(self) {
				var ui = self._ui,
					input = self.element;

				input.parentElement.classList.remove(classes.uiFocus);
			}

			/**
			 * Callback to prevent key movement inside input
			 * @method onKeyupInput
			 * @param {ns.widget.tv.SearchBar} self
			 * @param {Event} event
			 * @static
			 * @private
			 * @member ns.widget.tv.SearchBar
			 */
			function onKeyupInput(self, event) {
				switch (event.keyCode) {
					case KEY_CODES.up:
					case KEY_CODES.down:
					case KEY_CODES.left:
					case KEY_CODES.right:
						// when we are focused on input element, prevent actions on arrows
						event.stopImmediatePropagation();
						break;
				}
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
					callbacks = self._callbacks,
					inputBox;

				BaseSearchBarPrototype._bindEvents.call(self, element);
				inputBox = element.parentElement.parentElement;

				self._bindEventKey();

				callbacks.onKeyup = onKeyUp.bind(null, self);
				callbacks.onResize = onResize.bind(null, self);

				element.addEventListener("keyup", callbacks.onKeyup, false);
				window.addEventListener("resize", callbacks.onResize, false);

				callbacks.inputFocus = inputFocus.bind(null, self);
				callbacks.inputBlur = inputBlur.bind(null, self);
				callbacks.onKeyupInputContainer = onKeyupInputContainer.bind(null, self);
				callbacks.onKeyupInput = onKeyupInput.bind(null, self);

				element.addEventListener("keyup", callbacks.onKeyupInput, false);

				inputBox.addEventListener("keyup", callbacks.onKeyupInputContainer, false);
				inputBox.addEventListener("focus", callbacks.inputFocus, false);
				inputBox.addEventListener("blur", callbacks.inputBlur, false);

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
					callbacks = self._callbacks,
					inputBox = element.parentElement.parentElement;

				BaseSearchBarPrototype._destroy.call(self, element);

				self._destroyEventKey();

				element.removeEventListener("keyup", callbacks.onKeyup, false);
				window.removeEventListener("resize", callbacks.onResize, false);

				element.removeEventListener("keyup", callbacks.onKeyupInput, false);
				inputBox.removeEventListener("keyup", callbacks.onKeyupInputContainer, false);
				inputBox.removeEventListener("focus", callbacks.inputFocus, false);
				inputBox.removeEventListener("blur", callbacks.inputBlur, false);
			};

			engine.defineWidget(
				"SearchBar",
				"input[type='search'], [data-type='search'], [data-type='tizen-search'], .ui-searchbar",
				[],
				SearchBar,
				"tv",
				true
			);

			//BaseKeyboardSupport.registerActiveSelector("." + classes.uiInputText);

			BaseKeyboardSupport.registerActiveSelector("." + classes.uiInputSearch);
			ns.widget.tv.SearchBar = SearchBar;

//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SearchBar;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
