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
 * # Dialog Widget
 * Display div as a model dialog page with inset appearance.
 *
 * Any page can be presented as a modal dialog by adding the data-rel="dialog"
 * attribute to the page anchor link. When the "dialog" attribute is applied,
 * the framework adds styles to add rounded corners, margins around the page
 * and a dark background to make the "dialog" appear to be suspended above
 * the page.
 *
  * ## Default selectors
 * By default all elements with _data-role=dialog_ are changed to Tizen Web UI
 * Dialog.
 *
 * In additional all elements with class _ui-dialog_ are changed to Tizen Web UI
 * Dialog.
 *
 * #### Create simple dialog from div using data-role
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * #### Create simple dialog from div using class selector
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" id="btn-open" href="#">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *		<script>
 *			var element = document.getElementById("dialogPage"),
 *				dialogOpen = function () {
 *					var dialog = tau.widget.Dialog(element);
 *				};
 *			document.getElementById("btn-open")
 *				.addEventListener("vclick", dialogOpen);
 *		</script>
 *
 * ## Options for Dialog
 * Options for widget can be defined as _data-..._ attributes or given
 * as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ### closeBtn
 * _data-close-btn_ Position of the dialog close button
 * in the header
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" data-close-btn="left" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * ### closeBtnText
 * _data-close-btn-text_ Customize text of the close button,
 * by default close button is displayed as an icon-only so the text
 * isn't visible, but is read by screen readers
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" data-close-btn="left"
 *			data-close-btn-text="Click to close" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * ### overlayTheme
 * _data-overlay-theme_ Background under dialog content color
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" data-overlay-theme="s" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * ### corners
 * _data-corners_ Sets if dialog should be drawn with rounded corners
 *
 *		@example
 *		<div data-role="page" id="page1">
 *			<div data-role="header">
 *				<h1>Page</h1>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<a data-role="button" href="#dialogPage"
 *					data-rel="dialog">Open dialog</a>
 *			</div>
 *		</div>
 *
 *		<div data-role="dialog" data-corners="false" id="dialogPage">
 *			<div data-role="header">
 *				<h2>Dialog</h2>
 *			</div>
 *			<div data-role="content" class="ui-content">
 *				<p>I am a dialog</p>
 *			</div>
 *		</div>
 *
 * @class ns.widget.mobile.Dialog
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/selectors",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"./Button",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Widget Alias for {@link ns.widget.BaseWidget}
			 * @property {Object}
			 * @member ns.widget.mobile.Dialog
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias to {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				getChildrenBySelector = ns.util.selectors.getChildrenBySelector,
				/**
				 * Alias to {@link ns.event}
				 * @property {Object} events
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * Alias to {@link ns.widget.mobile.Button.classes}
				 * @property {Object} buttonClasses
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 */
				buttonClasses = ns.widget.mobile.Button.classes,

				/**
				 * Dictionary for dialog related css class names
				 * {@link ns.widget.mobile.Dialog.classes}
				 * @property {Object} classes
				 * @member ns.widget.mobile.Dialog
				 * @private
				 * @static
				 * @readonly
				 * @property {string} classes.uiDialog Main Dialog class name
				 * @property {string} classes.uiDialogContain
				 * Dialog container class name
				 * @property {string} classes.uiOverlayShadow
				 * Dialog overlay shadow
				 * @property {string} classes.uiOverlayPrefix
				 * @property {string} classes.uiCornerAll
				 * Class for all Dialog corners
				 * @property {string} classes.uiHeader
				 * @property {string} classes.uiContent
				 * @property {string} classes.uiFooter
				 * @property {string} classes.uiBarPrefix
				 * @property {string} classes.uiBodyPrefix
				 * @property {string} classes.uiDialogHidden
				 */
				classes = {
					uiDialog: "ui-dialog",
					uiDialogContain: "ui-dialog-contain",
					uiOverlayShadow: "ui-overlay-shadow",
					uiOverlayPrefix: "ui-overlay-",
					uiCornerAll: "ui-corner-all",
					uiHeader: "ui-header",
					uiContent: "ui-content",
					uiFooter: "ui-footer",
					uiBarPrefix: "ui-bar-",
					uiBodyPrefix: "ui-body-",
					uiDialogHidden: "ui-dialog-hidden"
				};

				Dialog = function () {
					var self = this;
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {"left"|"right"|"none"} [options.closeBtn="left"] Position of the dialog close button in the header, accepts: left, right and none
					 * @property {string} [options.closeBtnText="Close"] Customize text of the close button, by default close button is displayed as an icon-only so the text isn't visible, but is read by screen readers
					 * @property {string} [options.overlayTheme="a"] Backgroudn under dialog content color
					 * @property {boolean} [options.corners=true] Sets if dialog should be drawn with rounded corners
					 * @member ns.widget.mobile.Dialog
					 */
					self.options = {
						closeBtn : "left",
						closeBtnText : "Close",
						overlayTheme : "c",
						corners : true
					};
					self._headerCloseButton = null;
					self._eventHandlers = {};
				};

			/**
			 * Dictionary for dialog related css class names
			 * @property {Object} classes
			 * @protected
			 */
			Dialog.classes = classes;

			Dialog.prototype = new BaseWidget();

			/**
			 * Set page active / unactive
			 * @method setActive
			 * @param {boolean} value
			 * @member ns.widget.mobile.Dialog
			 * @protected
			 */
			Dialog.prototype.setActive = function (value) {
				var self = this,
					options = self.options,
					elementClassList = self.element.classList,
					dialogClasses = classes,
					pageClasses = ns.widget.mobile.Page.classes;
				if (value) {
					elementClassList.remove(dialogClasses.uiDialogHidden);
					elementClassList.add(pageClasses.uiPage);
					elementClassList.add(pageClasses.uiPageActive);
					elementClassList.add(dialogClasses.uiOverlayPrefix +
							options.overlayTheme);
				} else {
					elementClassList.remove(pageClasses.uiPage);
					elementClassList.remove(pageClasses.uiPageActive);
					elementClassList.remove(dialogClasses.uiOverlayPrefix +
							options.overlayTheme);
					elementClassList.add(dialogClasses.uiDialogHidden);
				}
			};

			/**
			 * Builds Dialog widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @returns {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._build = function (element) {
				var self = this,
					container = document.createElement("div"),
					i,
					l,
					childrenLength = element.children.length,
					headers = getChildrenBySelector(element, "[data-role='header']"),
					content = getChildrenBySelector(element, "[data-role='content']"),
					footers = getChildrenBySelector(element, "[data-role='footer']"),
					options = self.options,
					pageOptions = ns.widget.mobile.Page.prototype.options,
					containerClassList = container.classList,
					headersClassList,
					dataTheme,
					elementTheme,
					contentTheme;

				self.element = element;

				dataTheme = element.getAttribute("data-theme");
				elementTheme = dataTheme ? dataTheme : options.overlayTheme;
				contentTheme = dataTheme ? dataTheme : pageOptions.contentTheme;

				element.classList.add(classes.uiDialog);
				element.classList.add(classes.uiBodyPrefix +
						elementTheme);

				for (i = 0; i < childrenLength; i++) {
					container.appendChild(element.children[0]);
				}

				containerClassList.add(classes.uiDialogContain);
				containerClassList.add(classes.uiOverlayShadow);

				if (options.corners) {
					containerClassList.add(classes.uiCornerAll);
				}

				for (i = 0, l = headers.length; i < l; i++) {
					headersClassList = headers[i].classList;
					headersClassList.add(classes.uiHeader);
					headersClassList.add(classes.uiBarPrefix +
							pageOptions.headerTheme);
				}

				for (i = 0, l = content.length; i < l; i++) {
					content[i].classList.add(classes.uiContent);
					content[i].classList.add(classes.uiBodyPrefix +
							contentTheme);
				}

				for (i = 0, l = footers.length; i < l; i++) {
					footers[i].classList.add(classes.uiFooter);
					footers[i].classList.add(classes.uiBarPrefix +
							pageOptions.footerTheme);
				}

				element.appendChild(container);
				element.parentNode.removeChild(element);
				document.body.appendChild(element);

				self._setCloseButton(options.closeBtn, options.closeBtnText);

				return element;
			};

			/**
			 * Close dialog.
			 * @method _close
			 * @param {Event} event
			 * @returns {boolean} false
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._close = function (event) {
				event.preventDefault();
				this.close();
				return false;
			};

			/**
			 * If needed add close button.
			 * @method _setCloseButton
			 * @param {string} location
			 * @param {string} text
			 * @protected
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._setCloseButton = function (location, text) {
				var headerCloseButton = this._headerCloseButton,
					headerCloseButtonClassList,
					button,
					header;
				if (location !== "left" && location !== "right") {
					location = "none";
				}
				if (location === "none") {
					if (headerCloseButton) {
						headerCloseButton.parentNode.removeChild(headerCloseButton);
					}
				} else if (headerCloseButton) {
					headerCloseButtonClassList = headerCloseButton.classList;
					headerCloseButtonClassList.remove(buttonClasses.uiBtnLeft);
					headerCloseButtonClassList.remove(buttonClasses.uiBtnRight);
					headerCloseButtonClassList.add(buttonClasses.uiBtn +
							"-" + location);
				} else {
					button = document.createElement("a");

					//TODO When button will accept notext and
					button.className = buttonClasses.uiBtn + "-" + location;
					button.innerText = text || this.options.closeBtnText || "";

					button.addEventListener("vclick", this._close.bind(this), true);
					header = this.element.getElementsByClassName(classes.uiHeader)[0];
					if (header) {
						header.appendChild(button);
					}

					engine.instanceWidget(button, "Button", {
						iconpos: "left",
						icon: "delete",
						inline: true,
						corners: true
					});
				}
			};

			/**
			 * Close dialog
			 *
			 *		@example
			 *		<div data-role="page" id="page1">
			 *			<div data-role="header">
			 *				<h1>Page</h1>
			 *			</div>
			 *			<div data-role="content" class="ui-content">
			 *				<a href="#dialogPage" data-role="button"
			 *					data-rel="dialog">Open dialog</a>
			 *			</div>
			 *		</div>
			 *
			 *		<div data-role="dialog" id="dialogPage">
			 *			<div data-role="header">
			 *				<h2>Dialog</h2>
			 *			</div>
			 *			<div data-role="content" class="ui-content">
			 *				<div data-role="button" id="button-close">
			 *					Close dialog
			 *				</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = document.getElementById("dialogPage"),
			 *				onClose = function () {
			 *					// gets the dialog instance and closes Dialog
			 *					tau.widget.Dialog(element).close();
			 *				};
			 *			document.getElementById("button-close")
			 *				.addEventListener("vclick", onClose, true);
			 *		</script>
			 *
			 *
			 * @method close
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype.close = function () {
				window.history.back();
			};

			/**
			 * Handler function to add class on pagebeforeshow
			 * @method pageBeforeShowHandler
			 * @param {HTMLElement} element
			 * @param {Object} options
			 * @param {Object} classes
			 * @private
			 */
			function pageBeforeShowHandler(element, options, classes) {
				document.body.classList.add(classes.uiOverlayPrefix +
						options.overlayTheme);
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Dialog
			 */
			Dialog.prototype._bindEvents = function (element) {
				var options = this.options,
					eventHandlers = this._eventHandlers;

				eventHandlers.pageBeforeShow = pageBeforeShowHandler.bind(null, element, options, classes);

				element.addEventListener("pagebeforeshow", eventHandlers.pageBeforeShow, true);
			};

			/**
			 * Destroy Dialog widget
			 *
			 * The method removes event listeners.
			 *
			 *		@example
			 *		<div data-role="page" id="page1">
			 *			<div data-role="header">
			 *				<h1>Page</h1>
			 *			</div>
			 *			<div data-role="content" class="ui-content">
			 *				<a href="#dialogPage" data-role="button"
			 *					data-rel="dialog">Open dialog</a>
			 *			</div>
			 *		</div>
			 *
			 *		<div data-role="dialog" id="dialogPage">
			 *			<div data-role="header">
			 *				<h2>Dialog</h2>
			 *			</div>
			 *			<div data-role="content" class="ui-content">
			 *				<div data-role="button" id="button-close">
			 *					Close dialog
			 *				</div>
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = document.getElementById("dialogPage"),
			 *				onClose = function () {
			 *					// gets the dialog instance, closes and destroy
			 *					// Dialog widget
			 *					tau.widget.Dialog(element)
			 *						.close()
			 *						.destroy();
			 *				};
			 *			document.getElementById("button-close")
			 *				.addEventListener("vclick", onClose, true);
			 *		</script>
			 *
			 * @method _destroy
			 * @member ns.widget.mobile.Dialog
			 * @protected
			 */
			Dialog.prototype._destroy = function () {
				var element = this.element,
					parentNode = element.parentNode,
					eventHandlers = this._eventHandlers;

				element.removeEventListener("pagebeforeshow", eventHandlers.pageBeforeShow, true);

				events.trigger(document, "destroyed", {
					widget: "Dialog",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.Dialog = Dialog;
			engine.defineWidget(
				"Dialog",
				"[data-role='dialog'], .ui-dialog",
				["close"],
				Dialog,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Dialog;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
