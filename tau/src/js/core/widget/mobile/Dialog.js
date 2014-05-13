/*global window, define */
/*jslint nomen: true, plusplus: true */

/**
 * Display div as a model dialog page with inset appearance.
 *
 * @class ns.widget.Dialog
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/selectors",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"../../../profile/mobile/widget/mobile/Button",
			"../../../profile/mobile/widget/mobile/Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			* @member ns.widget.Dialog
			* @private
			* @static
			*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class {@link ns.engine}
				* @member ns.widget.Dialog
				* @private
				* @static
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias to {@link ns.utils.selectors}
				* @member ns.widget.Dialog
				* @private
				* @static
				*/
				selectors = ns.utils.selectors,
				/**
				 * @property {Object} events alias variable
				 * @private
				 * @static
				 */
				events = ns.utils.events,
				/**
				* @property {Object} buttonClasses Alias to {@link ns.widget.mobile.Button.classes}
				* @member ns.widget.Dialog
				* @private
				* @static
				*/
				buttonClasses = ns.widget.mobile.Button.classes,
				/**
				* Creates a new Dialog
				* @constructor Dialog
				*/
				Dialog = function () {
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.closeBtn='left'] Position of the dialog close button in the header, accepts: left, right and none
					* @property {string} [options.closeBtnText='Close'] Customize text of the close button, by default close button is displayed as an icon-only so the text isn't visible, but is read by screen readers
					* @property {string} [options.overlayTheme='a'] Backgroudn under dialog content color
					* @property {boolean} [options.corners=true] Sets if dialog should be drawn with rounded corners
					* @member ns.widget.Dialog
					* @instance
					*/
					this.options = {
						closeBtn : 'left',
						closeBtnText : "Close",
						overlayTheme : "c",
						corners : true
					};
					this._headerCloseButton = null;
					this._eventHandlers = {};
				};

			/**
			* @property {Object} classes Dictionary for dialog related css class names
			* @member ns.widget.Dialog
			* @protected
			* @static
			*/
			Dialog.classes = {
				/**
				* @property {string} uiDialog
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiDialog: "ui-dialog",
				/**
				* @property {string} uiDialogContain
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiDialogContain: "ui-dialog-contain",
				/**
				* @property {string} uiOverlayShadow
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiOverlayShadow: "ui-overlay-shadow",
				/**
				* @property {string} uiOverlayPrefix
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiOverlayPrefix: "ui-overlay-",
				/**
				* @property {string} uiCornerAll
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiCornerAll: "ui-corner-all",
				/**
				* @property {string} uiHeader
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiHeader: "ui-header",
				/**
				* @property {string} uiContent
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiContent: "ui-content",
				/**
				 * @property {string} uiFooter
				 * @member ns.widget.Dialog.classes
				 * @static
				 */
				uiFooter: "ui-footer",
				/**
				* @property {string} uiBarPrefix
				* @member ns.widget.Dialog.classes
				* @static
				*/
				uiBarPrefix: "ui-bar-",
				/**
				 * @property {string} uiBodyPrefix
				 * @member ns.widget.Dialog.classes
				 * @static
				 */
				uiBodyPrefix: "ui-body-",
				/**
				 * @property {string} uiDialogHidden
				 * @member ns.widget.Dialog.classes
				 * @static
				 */
				uiDialogHidden: "ui-dialog-hidden"
			};

			Dialog.prototype = new BaseWidget();

			/**
			* Set page active / unactive
			* @method setActive
			* @param {boolean} value
			* @instance
			* @member ns.widget.Dialog
			*/
			Dialog.prototype.setActive = function (value) {
				var elementClassList = this.element.classList,
					dialogClasses = Dialog.classes,
					pageClasses = ns.widget.mobile.Page.classes;
				if (value) {
					elementClassList.remove(dialogClasses.uiDialogHidden);
					elementClassList.add(pageClasses.uiPage);
					elementClassList.add(pageClasses.uiPageActive);
					elementClassList.add(dialogClasses.uiOverlayPrefix + this.options.overlayTheme);
				} else {
					elementClassList.remove(pageClasses.uiPage);
					elementClassList.remove(pageClasses.uiPageActive);
					elementClassList.remove(dialogClasses.uiOverlayPrefix + this.options.overlayTheme);
					elementClassList.add(dialogClasses.uiDialogHidden);
				}
			};

			/**
			* Builds Dialog widget
			* @method _build
			* @param {HTMLElement} element
			* @returns {HTMLElement}
			* @protected
			* @instance
			* @member ns.widget.Dialog
			*/
			Dialog.prototype._build = function (element) {
				var container = document.createElement('div'),
					i,
					l,
					childrenLength = element.children.length,
					headers = selectors.getChildrenBySelector(element, "[data-role='header']"),
					content = selectors.getChildrenBySelector(element, "[data-role='content']"),
					footers = selectors.getChildrenBySelector(element, "[data-role='footer']"),
					dialogClasses = Dialog.classes,
					options = this.options,
					pageOptions = ns.widget.mobile.Page.prototype.options,
					containerClassList = container.classList,
					headersClassList,
					dataTheme,
					elementTheme,
					contentTheme;

				this.element = element;

				dataTheme = element.getAttribute('data-theme');
				elementTheme = dataTheme ? dataTheme : options.overlayTheme;
				contentTheme = dataTheme ? dataTheme : pageOptions.contentTheme;

				element.classList.add(dialogClasses.uiDialog);
				element.classList.add(dialogClasses.uiBodyPrefix + elementTheme);

				for (i = 0; i < childrenLength; i++) {
					container.appendChild(element.children[0]);
				}

				containerClassList.add(dialogClasses.uiDialogContain);
				containerClassList.add(dialogClasses.uiOverlayShadow);

				if (options.corners) {
					containerClassList.add(dialogClasses.uiCornerAll);
				}

				for (i = 0, l = headers.length; i < l; i++) {
					headersClassList = headers[i].classList;
					headersClassList.add(dialogClasses.uiHeader);
					headersClassList.add(dialogClasses.uiBarPrefix + pageOptions.headerTheme);
				}

				for (i = 0, l = content.length; i < l; i++) {
					content[i].classList.add(dialogClasses.uiContent);
					content[i].classList.add(dialogClasses.uiBodyPrefix + contentTheme);
				}

				for (i = 0, l = footers.length; i < l; i++) {
					footers[i].classList.add(dialogClasses.uiFooter);
					footers[i].classList.add(dialogClasses.uiBarPrefix + pageOptions.footerTheme);
				}

				element.appendChild(container);
				element.parentNode.removeChild(element);
				document.body.appendChild(element);

				this._setCloseButton(options.closeBtn, options.closeBtnText);

				return element;
			};

			/**
			* Close dialog.
			* @method _close
			* @param {Event} event
			* @returns {boolean} false
			* @protected
			* @instance
			* @member ns.widget.Dialog
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
			* @instance
			* @member ns.widget.Dialog
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
					headerCloseButtonClassList.add(buttonClasses.uiBtn + "-" + location);
				} else {
					button = document.createElement('a');

					//TODO When button will accept notext and
					button.className = buttonClasses.uiBtn + "-" + location;

					//button.innerText = text || this.options.closeBtnText || "";

					button.addEventListener('vclick', this._close.bind(this), true);
					header = this.element.getElementsByClassName(Dialog.classes.uiHeader)[0];
					if (header) {
						header.appendChild(button);
					}

					engine.instanceWidget(button, "Button", {
						iconpos: 'left',
						icon: 'delete',
						inline: true,
						corners: true
					});
				}
			};

			/**
			* Close dialog
			* @method close
			* @instance
			* @member ns.widget.Dialog
			*/
			Dialog.prototype.close = function () {
				window.history.back();
			};

			/**
			 * Handler function to add class on pagebeforeshow
			 * @method pageBeforeShowHandler
			 * @param {HTMLElement} element
			 * @private
			 */
			function pageBeforeShowHandler(element, options, classes) {
				document.body.classList.add(classes.uiOverlayPrefix + options.overlayTheme);
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.Dialog
			 */
			Dialog.prototype._bindEvents = function (element) {
				var options = this.options,
					classes = Dialog.classes,
					eventHandlers = this._eventHandlers;

				eventHandlers.pageBeforeShow = pageBeforeShowHandler.bind(null, element, options, classes);

				element.addEventListener('pagebeforeshow', eventHandlers.pageBeforeShow, true);
			};

			Dialog.prototype._destroy = function () {
				var element = this.element,
					parentNode = element.parentNode,
					eventHandlers = this._eventHandlers;

				element.removeEventListener('pagebeforeshow', eventHandlers.pageBeforeShow, true);

				events.trigger(document, 'destroyed', {
					widget: "Dialog",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.Dialog = Dialog;
			engine.defineWidget(
				"Dialog",
				'[data-role="dialog"], .ui-dialog',
				['close'],
				Dialog,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Dialog;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
