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
 * #Search Bar Widget
 * @class ns.widget.Searchbar
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
			"../../../../core/utils/DOM/attributes",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
//>>excludeEnd("tauBuildExclude");
			var Searchbar = function () {
					return this;
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				themes = ns.theme,
				DOM = ns.utils.DOM,
				events = ns.event;

			Searchbar.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for Searchbar related css class names
			* @member ns.widget.Searchbar
			* @static
			*/
			Searchbar.classes = {
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

			Searchbar.prototype._configure = function () {
				this.options = this.options || {};

				/** @expose */
				this.options.theme = null;

				/** @expose */
				this.options.cancelBtn = false;

				/** @expose */
				this.options.icon = false;
			};

			/**
			* Enable Searchbar
			* @method _enable
			* @param {HTMLElement} element
			* @member ns.widget.Searchbar
			* @protected
			*/
			Searchbar.prototype._enable = function (element) {
				element = element || this.element;
				if (element) {
					element.removeAttribute("disabled");
					element.classList.remove("ui-disabled");
				}
			};

			/**
			* Disable Searchbar
			* @method _disable
			* @param {HTMLElement} element
			* @member ns.widget.Searchbar
			* @protected
			*/
			Searchbar.prototype._disable = function (element) {
				element = element || this.element;
				if (element) {
					element.setAttribute("disabled", "disabled");
					element.classList.add("ui-disabled");
				}
			};

			function findLabel(element) {
				var elemParent = element.parentNode,
					label = elemParent.querySelector('label[for="' + element.id + '"]');
				return label;
			}

			Searchbar.prototype._build = function (element) {
				var options = this.options,
					protoOptions = Searchbar.prototype.options,
					classes = Searchbar.classes,
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
					DOM.setNSData(frontIcon, 'icon', options.icon);
					inputSearchBar.appendChild(frontIcon);
					engine.instanceWidget(frontIcon, 'Button', {
						iconpos: "notext",
						corners: true,
						shadow: true,
						style: 'circle'
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

			function clearButtonClick(self, event) {
				var input = self._ui.input;
				if (!input.getAttribute("disabled")) {
					input.value = '';
					events.trigger(input, 'change');
					input.focus();
					event.preventDefault();
				}
			}

			function cancelButtonClick(self, event) {
				var input = self._ui.input,
					classes = Searchbar.classes,
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

			function inputFocus(self) {
				var input = self._ui.input,
					classes = Searchbar.classes,
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

			function inputBlur(self) {
				var inputedText = self._ui.input.value,
					classes = Searchbar.classes,
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

			function labelClick(self) {
				self._ui.input.blur();
				self._ui.input.focus();
			}

			Searchbar.prototype._init = function (element) {
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
			* @member ns.widget.Searchbar
			* @instance
			*/
			Searchbar.prototype._bindEvents = function () {
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

			ns.widget.mobile.Searchbar = Searchbar;
			engine.defineWidget(
				"Searchbar",
				"input[type='search'],[data-type='search'], input[type=tizen-search],[data-type='tizen-search'], .ui-searchbar",
				[],
				Searchbar,
				"tizen"
			);
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Searchbar;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
