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
 * # Search Bar Widget
 * The search filter bar widget is used to search for page content.
 *
 * This widget can be placed in the header or page content.
 *
 * ## Default selectors
 * In default elementch matches to :
 *
 *  - INPUT with type equals "search" or "tizen-search"
 *  - HTML elements with data-type="search" or data-type="tizen-search"
 *  - HTML elements with class ui-searchbar
 *
 * ###HTML Examples
 *
 * ####Create simple searchbar in header
 *
 *		@example
 * 		<div data-role="page" id="search-bar-page">
 *			<div data-role="header">
 *				<label for="search-bar">Search Input:</label>
 *				<input type="search" name="search" id="search-bar"/>
 *			</div>
 *			<div data-role="content" id="search-bar-content">
 *				<p>Hairston</p>
 *				<p>Hansbrough</p>
 *				<p>Allred</p>
 *				<p>Hanrahan</p>
 *				<p>Egan</p>
 *				<p>Dare</p>
 *				<p>Edmonson</p>
 *				<p>Calip</p>
 *				<p>Baker</p>
 *				<p>Fazekas</p>
 *				<p>Garrity</p>
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				var inputElement = document.getElementById("search-bar"),
 *					contentElement = document.getElementById("search-bar-content"),
 *					contentChildren = contentElement.getElementsByTagName("p"),
 *					contentChildrenLength = contentChildren.length;
 *
 *				function changeHandle(event) {
 *					var i,
 *						child,
 *						childText,
 *						value = inputElement.value;
 *
 *					for (i = 0; i < contentChildrenLength; i++) {
 *						child = contentChildren.item(i);
 *						childText = child.textContent.toLowerCase();
 *						if (!value || ~childText.indexOf(value)) {
 *							child.style.display = "block";
 *						} else {
 *							child.style.display = "none";
 *						}
 *					}
 *				}
 *
 *				inputElement.addEventListener("change", changeHandle);
 *				inputElement.addEventListener("keyup", changeHandle);
 *			}(document));
 *		</script>
 *
 * ## Manual constructor
 * For manual creation of search bar widget you can use constructor of widget from
 * **tau** namespace:
 *
 *		@example
 * 		<div data-role="page" id="search-bar-page">
 *			<div data-role="header">
 *				<label for="search-bar">Search Input:</label>
 *				<input name="search" id="search-bar"/>
 *			</div>
 *			<div data-role="content" id="search-bar-content">
 *				<p>Hairston</p>
 *				<p>Hansbrough</p>
 *				<p>Allred</p>
 *				<p>Hanrahan</p>
 *				<p>Egan</p>
 *				<p>Dare</p>
 *				<p>Edmonson</p>
 *				<p>Calip</p>
 *				<p>Baker</p>
 *				<p>Fazekas</p>
 *				<p>Garrity</p>
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				var inputElement = document.getElementById("search-bar"),
 *					contentElement = document.getElementById("search-bar-content"),
 *					contentChildren = contentElement.getElementsByTagName("p"),
 *					contentChildrenLength = contentChildren.length,
 *					pageElement = document.getElementById("search-bar-page"),
 *					searchBar;
 *
 *				function changeHandle(event) {
 *					var i,
 *						child,
 *						childText,
 *						value = searchBar.value();
 *
 *					for (i = 0; i < contentChildrenLength; i++) {
 *						child = contentChildren.item(i);
 *						childText = child.textContent.toLowerCase();
 *						if (!value || ~childText.indexOf(value)) {
 *							child.style.display = "block";
 *						} else {
 *							child.style.display = "none";
 *						}
 *					}
 *				}
 *
 *				function createPageHandle() {
 *					searchBar = tau.widget.SearchBar(inputElement, {
 *						icon: "call"
 *					});
 *					searchBar.on("change keyup", changeHandle);
 *				}
 *
 *				pageElement.addEventListener("pagecreate", createPageHandle);
 *			}(document));
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div data-role="page" id="search-bar-page">
 *			<div data-role="header">
 *				<label for="search-bar">Search Input:</label>
 *				<input name="search" id="search-bar"/>
 *			</div>
 *			<div data-role="content" id="search-bar-content">
 *				<p>Hairston</p>
 *				<p>Hansbrough</p>
 *				<p>Allred</p>
 *				<p>Hanrahan</p>
 *				<p>Egan</p>
 *				<p>Dare</p>
 *				<p>Edmonson</p>
 *				<p>Calip</p>
 *				<p>Baker</p>
 *				<p>Fazekas</p>
 *				<p>Garrity</p>
 *			</div>
 *		</div>
 *		<script>
 *			(function (document) {
 *				var inputElement = document.getElementById("search-bar"),
 *						contentElement = document.getElementById("search-bar-content"),
 *						contentChildren = contentElement.getElementsByTagName("p"),
 *						contentChildrenLength = contentChildren.length,
 *						pageElement = document.getElementById("search-bar-page");
 *
 *				function changeHandle(event) {
 *					var i,
 *						child,
 *						childText,
 *						value = inputElement.value;
 *
 *					for (i = 0; i < contentChildrenLength; i++) {
 *						child = contentChildren.item(i);
 *						childText = child.textContent.toLowerCase();
 *						if (!value || ~childText.indexOf(value)) {
 *							child.style.display = "block";
 *						} else {
 *							child.style.display = "none";
 *						}
 *					}
 *				}
 *
 *				function createPageHandle() {
 *					$("#search-bar").searchbar(inputElement, {
 *						icon: "call"
 *					}).on("change keyup", changeHandle);
 *				}
 *
 *				$("#search-bar-page").on("pagecreate", createPageHandle);
 *			}(document));
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for search bar widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<script>
 *		var searchBarElement = document.getElementById('search-bar'),
 *			searchBar = tau.widget.SearchBar(searchBarElement);
 *
 *		searchBar.methodName(methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		<script>
 *		$(".selector").searchbar('methodName', methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * #Search Bar Widget
 * @class ns.widget.mobile.SearchBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/event",
			"../../../../core/util/DOM/attributes",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
//>>excludeEnd("tauBuildExclude");
			var SearchBar = function () {
					return this;
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				themes = ns.theme,
				DOM = ns.util.DOM,
				events = ns.event;

			SearchBar.prototype = new BaseWidget();

			/**
			 * Dictionary for SearchBar related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.SearchBar
			 * @static
			 */
			SearchBar.classes = {
				uiInputText: "ui-input-text",
				uiInputSearch: "ui-input-search",
				uiShadowInset: "ui-shadow-inset",
				uiCornerAll: "ui-corner-all",
				uiBtnShadow: "ui-btn-shadow",
				themePrefix: "ui-body-",
				uiInputSearchDefault: "ui-input-search-default",
				uiSearchBarIcon: "ui-search-bar-icon",
				uiInputClear: "ui-input-clear",
				uiInputClearHidden: "ui-input-clear-hidden",
				inputSearchBar: "input-search-bar",
				uiImageSearch: "ui-image-search",
				uiInputCancel: "ui-input-cancel",
				uiInputDefaultText: "ui-input-default-text",
				uiBtnSearchFrontIcon: "ui-btn-search-front-icon",
				uiInputSearchWide: "ui-input-search-wide",
				uiBtnCancelHide: "ui-btn-cancel-hide",
				uiBtnCancelShow: "ui-btn-cancel-show",
				uiFocus: 'ui-focus'
			};

			SearchBar.prototype._configure = function () {
				/**
				 * @property {Object} options All possible widget options
				 * @property {?string} [options.theme=null] theme of widget
				 * @property {boolean} [options.cancelBtn=false] shows or not cancel button
				 * @property {?string} [options.icon=null] type of icon on action button, possible values are the same as in button widget. If opition is not set then action button isn't showing
				 * @member ns.widget.mobile.SearchBar
				 */
				this.options = this.options || {};
				this.options.theme = null;
				this.options.cancelBtn = false;
				this.options.icon = null;
			};

			/**
			 * Enable the search bar
			 *
			 * Method removes disabled attribute on search bar and changes look
			 * of search bar to enabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("searchbar"),
			 *			searchBarWidget = tau.widget.SearchBar(element);
			 *		searchBarWidget.enable();
			 *
			 *		// or
			 *
			 *		$( "#searchbar" ).searchbar( "enable" );
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.SearchBar
			 */
			/**
			* Enable SearchBar
			* @method _enable
			* @param {HTMLElement} element
			* @member ns.widget.mobile.SearchBar
			* @protected
			*/
			SearchBar.prototype._enable = function (element) {
				element = element || this.element;
				if (element) {
					element.removeAttribute("disabled");
					element.classList.remove("ui-disabled");
				}
			};

			/**
			 * Disable the search bar
			 *
			 * Method add disabled attribute on search bar and changes look
			 * of search bar to disabled state.
			 *
			 *		@example
			 *		<script>
			 *		var element = document.getElementById("searchbar"),
			 *			searchBarWidget = tau.widget.SearchBar(element);
			 *		searchBarWidget.disable();
			 *
			 *		// or
			 *
			 *		$( "#searchbar" ).searchbar( "disable" );
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.SearchBar
			 */
			/**
			* Disable SearchBar
			* @method _disable
			* @param {HTMLElement} element
			* @member ns.widget.mobile.SearchBar
			* @protected
			*/
			SearchBar.prototype._disable = function (element) {
				element = element || this.element;
				if (element) {
					element.setAttribute("disabled", "disabled");
					element.classList.add("ui-disabled");
				}
			};

			/**
			 * Finds label for element in parent's element.
			 * @method findLabel
			 * @static
			 * @private
			 * @param {HTMLElement} element base element for finding label
			 * @returns {?HTMLElement}
			 * @member ns.widget.mobile.SearchBar
			 */
			function findLabel(element) {
				var elemParent = element.parentNode,
					label = elemParent.querySelector('label[for="' + element.id + '"]');
				return label;
			}

			/**
			 * Build widget structure
			 * @param {HTMLElement} element
			 * @returns {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.SearchBar
			 */
			SearchBar.prototype._build = function (element) {
				var options = this.options,
					protoOptions = SearchBar.prototype.options,
					classes = SearchBar.classes,
					theme = options.theme || themes.getInheritedTheme(element, (protoOptions || protoOptions.theme) || 'c'),
					themeClass  = classes.themePrefix + theme,
					searchBox,
					clearButton,
					cancelButton,
					defaultText,
					labelDiv,
					searchImage,
					frontIcon = false,
					label = findLabel(element),
					searchBoxClasses,
					inputSearchBar,
					inputClassList = element.classList,
					ui;

				if (label) {
					label.classList.add(classes.uiInputText);
				}

				if (element.autocorrect !== undefined) { // @todo && !$.support.touchOverflow ) {
					// Set the attribute instead of the property just in case there
					// is code that attempts to make modifications via HTML.
					element.setAttribute("autocorrect", "off");
					element.setAttribute("autocomplete", "off");
				}

				element.removeAttribute('type');

				inputClassList.add(classes.uiInputText);
				inputClassList.add(themeClass);
				searchBox = document.createElement('div');
				searchBoxClasses = searchBox.classList;
				searchBoxClasses.add(classes.uiInputSearch);
				searchBoxClasses.add(classes.uiShadowInset);
				searchBoxClasses.add(classes.uiCornerAll);
				searchBoxClasses.add(classes.uiBtnShadow);
				searchBoxClasses.add(themeClass);
				element.parentNode.replaceChild(searchBox, element);
				searchBox.appendChild(element);

				if (options.cancelBtn) {
					searchBoxClasses.add(classes.uiInputSearchDefault);
				}

				clearButton = document.createElement('a');
				clearButton.setAttribute('href', '#');
				clearButton.setAttribute('title', 'clear text');
				clearButton.classList.add(classes.uiInputClear);
				clearButton.innerText = 'clear text';
				if (!element.value) {
					clearButton.classList.add(classes.uiInputClearHidden);
				}
				searchBox.appendChild(clearButton);
				engine.instanceWidget(clearButton, 'Button', {
					icon: "deleteSearch",
					iconpos: "notext",
					corners: true,
					shadow: true
				});

				inputSearchBar = document.createElement('div');
				inputSearchBar.classList.add(classes.inputSearchBar);
				searchBox.parentNode.replaceChild(inputSearchBar, searchBox);
				inputSearchBar.appendChild(searchBox);

				if (options.icon) {
					searchBoxClasses.add(classes.uiSearchBarIcon);
					frontIcon = document.createElement('div');
					DOM.setNSData(frontIcon, 'role', 'button');
					inputSearchBar.appendChild(frontIcon);
					engine.instanceWidget(frontIcon, 'Button', {
						iconpos: "notext",
						corners: true,
						shadow: true,
						style: 'circle',
						icon: options.icon
					});
					frontIcon.classList.add(classes.uiBtnSearchFrontIcon);
				}

				//SLP --start search bar with cancel button
				searchImage = document.createElement('div');
				searchImage.classList.add(classes.uiImageSearch);
				searchBox.appendChild(searchImage);

				if (options.cancelBtn) {
					cancelButton = document.createElement('div');
					DOM.setNSData(cancelButton, 'role', 'button');
					cancelButton.classList.add(classes.uiInputCancel);
					cancelButton.setAttribute('title', 'clear text');
					cancelButton.innerText = 'Cancel';
					inputSearchBar.appendChild(cancelButton);
					engine.instanceWidget(cancelButton, 'Button', {
						icon: "cancel",
						iconpos: "cancel",
						corners: true,
						shadow: true
					});
				}

				// Default Text
				defaultText = DOM.getNSData(element, "default-text");

				if ((defaultText !== null) && (defaultText.length > 0)) {
					labelDiv = document.createElement('div');
					labelDiv.classList.add(classes.uiInputDefaultText);
					labelDiv.style.content = "'" + defaultText + "'";
					inputSearchBar.appendChild(labelDiv);
				}

				if (!element.getAttribute("placeholder")) {
					element.setAttribute("placeholder", "Search");
				}

				this._ui = this._ui || {};
				ui = this._ui;
				ui.input = element;
				ui.clearButton = clearButton;
				clearButton.setAttribute('id', this.id + '-clear-button');
				if (cancelButton) {
					ui.cancelButton = cancelButton;
					cancelButton.setAttribute('id', this.id + '-cancel-button');
				}
				if (labelDiv) {
					ui.labelDiv = labelDiv;
					labelDiv.setAttribute('id', this.id + '-label-div');
				}
				ui.searchBox = searchBox;
				searchBox.setAttribute('id', this.id + '-search-box');

				return element;
			};

			/**
			 * Callback for click event on clear button
			 * @method clearButtonClick
			 * @param {ns.widget.mobile.SearchBar} self
			 * @param {Event} event
			 * @static
			 * @private
			 * @member ns.widget.mobile.SearchBar
			 */
			function clearButtonClick(self, event) {
				var input = self._ui.input;
				if (!input.getAttribute("disabled")) {
					input.value = '';
					events.trigger(input, 'change');
					input.focus();
					event.preventDefault();
				}
			}

			/**
			 * Callback for click event on cancel button
			 * @method cancelButtonClick
			 * @param {ns.widget.mobile.SearchBar} self
			 * @param {Event} event
			 * @static
			 * @private
			 * @member ns.widget.mobile.SearchBar
			 */
			function cancelButtonClick(self, event) {
				var input = self._ui.input,
					classes = SearchBar.classes,
					localClassList;
				if (!input.getAttribute("disabled")) {
					event.preventDefault();
					event.stopPropagation();

					input.value = '';
					events.trigger(input, 'change');
					input.blur();

					if (self.options.cancel) {
						localClassList = self._ui.searchBox.classList;
						localClassList.add(classes.uiInputSearchWide);
						localClassList.remove(classes.uiInputSearchDefault);

						localClassList = self._ui.cancelButton.classList;
						localClassList.add(classes.uiBtnCancelHide);
						localClassList.remove(classes.uiBtnCancelShow);
					}
				}
			}

			/**
			 * Callback for focus event on input
			 * @method inputFocus
			 * @param {ns.widget.mobile.SearchBar} self
			 * @static
			 * @private
			 * @member ns.widget.mobile.SearchBar
			 */
			function inputFocus(self) {
				var input = self._ui.input,
					classes = SearchBar.classes,
					localClassList;
				if (!input.getAttribute("disabled")) {
					localClassList = self._ui.searchBox.classList;
					localClassList.add(classes.uiFocus);
					if (self.options.cancel) {
						localClassList.remove(classes.uiInputSearchWide);
						localClassList.add(classes.uiInputSearchDefault);

						localClassList = self._ui.cancelButton.classList;
						localClassList.remove(classes.uiBtnCancelHide);
						localClassList.add(classes.uiBtnCancelShow);
					}
				}
				if (self._ui.labelDiv) {
					self._ui.labelDiv.classList.add(classes.uiInputDefaultHidden);
				}
			}

			/**
			 * Callback for blur event on input
			 * @method inputBlur
			 * @param {ns.widget.mobile.SearchBar} self
			 * @static
			 * @private
			 * @member ns.widget.mobile.SearchBar
			 */
			function inputBlur(self) {
				var inputedText = self._ui.input.value,
					classes = SearchBar.classes,
					ui = self._ui;
				ui.searchBox.classList.add(classes.uiFocus);
				if (ui.labelDiv) {
					if (inputedText.length > 0) {
						ui.labelDiv.classList.add(classes.uiInputDefaultHidden);
					} else {
						ui.labelDiv.classList.remove(classes.uiInputDefaultHidden);
					}
				}
			}

			/**
			 * Callback for click event on label
			 * @method labelClick
			 * @param {ns.widget.mobile.SearchBar} self
			 * @static
			 * @private
			 * @member ns.widget.mobile.SearchBar
			 */
			function labelClick(self) {
				self._ui.input.blur();
				self._ui.input.focus();
			}

			/**
			 * Init widget on builded structure
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.SearchBar
			 */
			SearchBar.prototype._init = function (element) {
				var ui;
				this._ui = this._ui || {};
				ui = this._ui;
				ui.input = element;
				ui.clearButton = document.getElementById(this.id + '-clear-button');
				ui.cancelButton = document.getElementById(this.id + '-cancel-button');
				ui.labelDiv = document.getElementById(this.id + '-label-div');
				ui.searchBox = document.getElementById(this.id + '-search-box');
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.SearchBar
			*/
			SearchBar.prototype._bindEvents = function () {
				var handlers,
					ui = this._ui,
					input = ui.input;
				this._handlers = this._handlers || {};
				handlers = this._handlers;
				handlers.clearClick = clearButtonClick.bind(null, this);
				handlers.cancelClick = cancelButtonClick.bind(null, this);
				handlers.inputFocus = inputFocus.bind(null, this);
				handlers.inputBlur = inputBlur.bind(null, this);
				handlers.labelClick = labelClick.bind(null, this);

				ui.clearButton.addEventListener("vclick", handlers.clearClick, false);
				if (ui.cancelButton) {
					ui.cancelButton.addEventListener("vclick", handlers.cancelClick, false);
				}
				input.addEventListener("focus", handlers.inputFocus, false);
				input.addEventListener("blur", handlers.inputBlur, false);
				if (ui.labelDiv) {
					ui.labelDiv.addEventListener("vclick", handlers.labelClick, false);
				}
			};

			/**
			 * Gets or sets value of input text.
			 *
			 * If you call with parameter then first argument will be set as new
			 * value of input text. Otherwise method return value of input.
			 *
			 *		@example
			 *		var searchBarElement = document.getElementById("searchbar"),
			 *			searchBarWidget = tau.widget.SearchBar(searchBarElement),
			 *			value = searchBarWidget.value();
			 *			// value contains inner text of button
			 *
			 *		buttonWidget.value( "New text" ); // "New text" will be text of button
			 *
			 *		// or
			 *
			 *		$( "#searchbar" ).searchbar( "value" );
			 *		// value contains inner text of button
			 *
			 *		$( "#searchbar" ).searchbar( "value", "New text" );
			 *		// "New text" will be value of input
			 *
			 * @method value
			 * @param {string} [value] Value to set on widget
			 * @return {string} In get mode return value of widget.
			 * @since 2.3
			 * @member ns.widget.mobile.SearchBar
			 */

			/**
			 * Gets value for widget
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.SearchBar
			 */
			SearchBar.prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Sets value for widget
			 * @param {HTMLElement} element base element of widget
			 * @param {string} value value to set
			 * @protected
			 * @member ns.widget.mobile.SearchBar
			 */
			SearchBar.prototype._setValue = function (value) {
				this.element.value = value;
			};

			/**
			 * Refresh method is not supported in this widget.
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.SearchBar
			 */

			/**
			 * Destroy method is not supported in this widget.
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.SearchBar
			 */
			ns.widget.mobile.SearchBar = SearchBar;
			engine.defineWidget(
				"SearchBar",
				"input[type='search'],[data-type='search'], input[type=tizen-search],[data-type='tizen-search'], .ui-searchbar",
				[],
				SearchBar,
				"tizen"
			);
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.SearchBar;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
