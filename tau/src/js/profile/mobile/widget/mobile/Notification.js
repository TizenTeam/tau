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
 * #Notification widget
 * The Notification widget shows a popup on the screen to provide notifications.
 *
 * ##Default selectors
 * In all elements with _data-role=notification_. Use _p_ tag for messages and _img_ tag for icon.
 *
 * ##Manual constructor
 * For manual creation of notification widget you can use constructor of widget:
 *
 *	@example
 *	var notification = ns.engine.instanceWidget(document.getElementById('notification'), 'Notification');
 *
 * If jQuery library is loaded, its method can be used:
 *
 *	@example
 *	var notification = $('#notification').notification();
 *
 * ##HTML Examples
 *
 * ###Create notification smallpoup
 * Smallpoup has only one line of message and is positioned to the bottom of the active page. It's default type of notification widget.
 *
 *	@example
 *	<div data-role="notification" id="notification" data-type="smallpoup">
 *		<p>Line of message</p>
 *	</div>
 *
 * ###Create notification ticker
 * Notification ticker has maximum two lines of message, other messages will be hidden. Additionaly you can set an icon. Notification ticker is default positioned to the top of the page.
 *
 *	@example
 *	<div data-role="notification" id="notification" data-type="ticker">
 *		<p>First line of message</p>
 *		<p>Second line of message</p>
 *	</div>
 *
 * ###Create notification wih interval
 * Interval defines time to showing notification widget, after this it will close automatically. Values of _data-interval_ is a positive **number of miliseconds**, e.g. _data-interval="2000"_ (sets to close widget after 2 seconds). Otherwise widget will show infinietely.
 *
 *	@example
 *	<div data-role="notification" id="notification" data-type="ticker" data-interval="4000">
 *		<img src="icon.png">
 *		<p>First line of message</p>
 *		<p>Second line of message</p>
 *	</div>
 *
 * ###Create notification ticker with icon
 * Icon is only supported with notification ticker.
 *
 *	@example
 *	<div data-role="notification" id="notification" data-type="ticker">
 *		<img src="icon.png">
 *		<p>First line of message</p>
 *		<p>Second line of message</p>
 *	</div>
 *
 * @class ns.widget.Notification
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/selectors",
			"../../../../core/theme",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile",
			"./Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* {Object} Widget Alias for {@link ns.widget.BaseWidget}
			* @member ns.widget.Notification
			* @private
			*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* {Object} Widget Alias for {@link ns.widget.mobile.Page}
				* @member ns.widget.Notification
				* @private
				*/
				Page = ns.widget.mobile.Page,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.Notification
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class ns.selectors
				* @member ns.widget.Notification
				* @private
				*/
				selectors = ns.utils.selectors,
				/**
				* @property {Object} themes Alias for class ns.theme
				* @member ns.widget.Notification
				* @private
				*/
				themes = ns.theme,

				/**
				* Alias for class ns.widget.Notification
				* @method Notification
				* @member ns.widget.Notification
				* @private
				*/
				Notification = function () {

					/**
					* @property {boolean} _eventsAdded Flag that the widget was binded with events
					* @member ns.widget.Notification
					* @private
					*/
					this._eventsAdded = false;

					/**
					* @property {Object} _ui Holds all needed UI HTMLElements
					* @member ns.widget.Notification
					* @protected
					*/
					this._ui = {
						/**
						* @property {HTMLElement} _ui.wrapper Widgets content wrapper
						* @member ns.widget.Notification
						* @protected
						*/
						wrapper: null,

						/**
						* @property {NodeList} _ui.iconImg Widgets icons
						* @member ns.widget.Notification
						* @protected
						*/
						iconImg: null,

						/**
						* @property {NodeList} _ui.texts Widgets texts
						* @member ns.widget.Notification
						* @protected
						*/
						texts: []
					};

					/**
					* @property {number} interval Widgets interval
					* @member ns.widget.Notification
					* @protected
					*/
					this.interval = null;

					/**
					* @property {boolean} running Widget running status
					* @member ns.widget.Notification
					* @protected
					*/
					this.running = false;

					/**
					* @property {Object} options Widget options
					* @property {string} [options.theme='s'] theme of widget
					* @property {string} [options.type='smallpopup'] type of widget
					* @property {string} [interval='0'] interval value in milliseconds of widget. 0 - show widget infinitely
					* @member ns.widget.Notification
					* @protected
					*/
					this.options = {
						theme: 's',
						type: 'smallpopup',
						interval: '0'
					};
				};

			Notification.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for notification related css class names
			* @member ns.widget.Notification
			* @static
			*/
			Notification.classes = {
				uiTicker : 'ui-ticker',
				uiTickerText1Bg : 'ui-ticker-text1-bg',
				uiTickerText2Bg : 'ui-ticker-text2-bg',
				uiTickerIcon : 'ui-ticker-icon',
				uiSmallpopup : 'ui-smallpopup',
				uiSmallpopupTextBg : 'ui-smallpopup-text-bg',
				uiTickerBtn : 'ui-ticker-btn',
				uiNotificationFix: 'fix',
				uiNotificationShow: 'show',
				uiNotificationHide: 'hide'
			};

			/**
			* Build structure of notification widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @private
			* @member ns.widget.Notification
			* @instance
			*/
			Notification.prototype._build = function (element) {
				var wrapperTag = "div",
					textTag = "p",
					options = this.options,
					classes = Notification.classes,
					uiElements = this._ui,
					notifyBtnWrapper,
					notifyWrapper,
					closeButton,
					nodeList,
					texts,
					i,
					l;

				//Set theme
				options.theme = themes.getInheritedTheme(element) || options.theme;

				//Wrap it!
				notifyWrapper = document.createElement(wrapperTag);
				uiElements.wrapper = notifyWrapper;

				nodeList = element.childNodes;
				while (nodeList.length > 0) {
					notifyWrapper.appendChild(nodeList[0]);
				}

				//Get texts
				texts = notifyWrapper.getElementsByTagName(textTag);

				//Add elements if is lower than 2
				l = texts.length;
				for (i = l; i < 2; i++) {
					notifyWrapper.appendChild(document.createElement(textTag));
				}

				//Hide not visible elements
				l = texts.length; //Update length
				for (i = 2; i < l; i++) {
					texts[i].style.display = 'none';
				}

				if (options.type === 'ticker') {
					//Create elements
					notifyBtnWrapper = document.createElement(wrapperTag);
					closeButton = document.createElement(wrapperTag);

					//Create skeleton
					notifyBtnWrapper.appendChild(closeButton);
					notifyWrapper.appendChild(notifyBtnWrapper);

					//Add classes
					notifyWrapper.className = classes.uiTicker;
					notifyBtnWrapper.className = classes.uiTickerBtn;

					//Instance Button widget
					closeButton.innerText = 'Close';
					engine.instanceWidget(closeButton, "Button", {
						theme: options.theme,
						inline: true
					});

					//Add clases to elements
					texts[0].classList.add(classes.uiTickerText1Bg);
					texts[1].classList.add(classes.uiTickerText2Bg);

				} else {
					//Add classes
					notifyWrapper.className = classes.uiSmallpopup;

					//Add clases to element and hide second element
					texts[0].classList.add(classes.uiSmallpopupTextBg);
					texts[1].style.display = 'none';

					this._setPosition();
				}
				element.appendChild(notifyWrapper);
				uiElements.texts = texts;
				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Notification
			* @instance
			*/

			Notification.prototype._init = function (element) {
				var options = this.options,
					classes = Notification.classes,
					uiElements = this._ui,
					iconImg,
					iconImgLength,
					wrapper,
					i;

				//Set widget wrapper
				uiElements.wrapper = element.firstElementChild;
				wrapper = uiElements.wrapper;

				//Set theme
				options.theme = themes.getInheritedTheme(element) || options.theme;

				//Set texts
				uiElements.texts[0] = wrapper.getElementsByClassName(classes.uiTickerText1Bg)[0];
				uiElements.texts[1] = wrapper.getElementsByClassName(classes.uiTickerText2Bg)[0];

				//Get icons
				iconImg = element.getElementsByTagName('img');
				iconImgLength = iconImg.length;
				for (i = 0; i < iconImgLength; i++) {
					iconImg[i].classList.add(classes.uiTickerIcon);
					//Hide unused icons
					if (i > 1) {
						iconImg[i].style.display = 'none';
					}
				}
				uiElements.iconImg = iconImg;

				//fix for compare tests
				this.type = options.type;
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Notification
			* @instance
			*/
			Notification.prototype._bindEvents = function (element) {
				if (!this._eventsAdded) {
					// Is it needed, that closeButton should has click event binded with self.close() too?
					element.addEventListener('vmouseup', this.close.bind(this), true);
					this._eventsAdded = true;
				}
			};

			/**
			* Enable notification
			* @method _enable
			* @protected
			* @member ns.widget.Notification
			* @instance
			*/
			Notification.prototype._enable = function () {
				this._ui.wrapper.style.display = '';
			};

			/**
			* Disable notification
			* @method _disable
			* @protected
			* @member ns.widget.Notification
			* @instance
			*/
			Notification.prototype._disable = function () {
				this._ui.wrapper.style.display = 'none';
			};

			/**
			* Refresh notification
			* @method _refresh
			* @member ns.widget.Notification
			* @instance
			*/
			Notification.prototype._refresh = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;
				wrapperClassList.add(classes.uiNotificationFix);
				wrapperClassList.remove(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationShow);
				this._setCloseInterval();
			};

			/**
			* Set widget position.
			* @method _setPosition
			* @protected
			* @member ns.widget.Notification
			*/
			Notification.prototype._setPosition = function () {
				var pages = document.body.getElementsByClassName(Page.classes.uiPageActive),
					footers,
					footerHeight = 0,
					wrapper = this._ui.wrapper;

				if (typeof pages[0] === 'object') {
					footers = selectors.getChildrenByClass(pages[0], 'ui-footer');
					if (typeof footers[0] === 'object') {
						footerHeight = footers[0].offsetHeight;
					}
				}
				wrapper.style.bottom = footerHeight + (footerHeight > 0 ? 'px' : '');
			};

			/**
			* Open widget
			* @method open
			* @member ns.widget.Notification
			*/
			Notification.prototype.open = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;

				if (this.running === true) {
					this.refresh();
					return;
				}

				if (this.options.type !== 'ticker') {
					this._setPosition();
				}

				wrapperClassList.add(classes.uiNotificationShow);
				wrapperClassList.remove(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationFix);
				this._setCloseInterval();
				this.running = true;
			};

			/**
			* Close widget
			* @method close
			* @member ns.widget.Notification
			*/
			Notification.prototype.close = function () {
				var wrapperClassList = this._ui.wrapper.classList,
					classes = Notification.classes;

				if (this.running !== true) {
					return;
				}

				wrapperClassList.add(classes.uiNotificationHide);
				wrapperClassList.remove(classes.uiNotificationShow);
				wrapperClassList.remove(classes.uiNotificationFix);
				clearInterval(this.interval);
				this.running = false;
			};

			/**
			* Sets icon
			* @method icon
			* @param {string} src icon source URL
			* @member ns.widget.Notification
			*/
			Notification.prototype.icon = function (src) {
				var uiElements = this._ui,
					iconImg = uiElements.iconImg,
					classes = Notification.classes;

				if (src) {
					//Remove all elements from NodeList
					while (iconImg.length > 0 && iconImg[0].remove) {
						iconImg[0].remove();
					}

					iconImg[0] = document.createElement('img');
					iconImg[0].className = classes.uiTickerIcon;
					iconImg[0].setAttribute('src', src);

					//Append icon
					uiElements.wrapper.appendChild(iconImg[0]);
					uiElements.iconImg = iconImg;
				}
			};

			/**
			* Set widget texts
			* @method text
			* @param {string} text0 first line of text
			* @param {string} text1 second line of text
			* @member ns.widget.Notification
			* @return {?Array} widget text if no param given
			*/
			Notification.prototype.text = function (text0, text1) {

				if (text0 === undefined && text1 === undefined) {
					return this._getText();
				}

				this._setText(text0, text1);
				return null;
			};

			/**
			* Set widgets texts
			* @method _setText
			* @param {string} text0 first line of text
			* @param {string} text1 second line of text
			* @private
			* @member ns.widget.Notification
			*/
			Notification.prototype._setText = function (text0, text1) {
				if (text0 !== undefined) {
					this._ui.texts[0].textContent = text0;
				}
				if (text1 !== undefined) {
					this._ui.texts[1].textContent = text1;
				}
			};

			/**
			* Get widget texts
			* @method _getText
			* @protected
			* @member ns.widget.Notification
			* @return {Array} widget texts
			*/
			Notification.prototype._getText = function () {
				var ui = this._ui,
					texts = [null, null];

				if (this.options.type === 'ticker') {
					texts[0] = ui.texts[0] && ui.texts[0].textContent;
					texts[1] = ui.texts[1] && ui.texts[1].textContent;
				} else {
					texts[0] = ui.texts[0] && ui.texts[0].textContent;
				}

				return texts;
			};

			/**
			* Sets interval
			* @method _setCloseInterval
			* @protected
			* @member ns.widget.Notification
			*/
			Notification.prototype._setCloseInterval = function () {
				//Clear current interval
				clearInterval(this.interval);

				if (this.options.interval > 0) {
					//Create new interval
					this.interval = setInterval(this.close.bind(this), this.options.interval);
				}
			};

			/**
			* Destroy widget
			* @method _destroy
			* @param {?HTMLElement} element base element for destroy widget
			* @protected
			* @member ns.widget.Notification
			*/
			Notification.prototype._destroy = function (element) {
				var wrapper = this._ui.wrapper,
					nodeList;
				if (element) {
					wrapper = element.firstChild;
				} else {
					element = this.element;
				}
				nodeList = wrapper.childNodes;
				while (nodeList.length > 0) {
					element.appendChild(nodeList[0]);
				}
				element.removeChild(wrapper);
			};

			// definition
			ns.widget.mobile.Notification = Notification;
			engine.defineWidget(
				"Notification",
				"[data-role='notification'], .ui-notification",
				["open", "close", "icon", "text"],
				Notification,
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Notification;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
