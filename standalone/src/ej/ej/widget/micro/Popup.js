/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, screen, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../core",
			"../../micro/selectors",
			"../../engine",
			"../../utils/events",
			"../../utils/object",
			"../../utils/DOM/css",
			"../micro",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				eventUtils = ns.utils.events,
				object = ns.utils.object,
				selectors = ns.micro.selectors,
				Popup = function () {
					this.options = {
						header: false,
						footer: false
					};
					this._elementClassList = null;
					// public html elements
					this.ui = {};
					this.ui.header = null;
					this.ui.footer = null;
					this.ui.content = null;
					this.active = false;
				},
				prototype = new BaseWidget(),
				classes = {
					active: 'ui-popup-active',
					header: 'ui-popup-header',
					footer: 'ui-popup-footer',
					content: 'ui-popup-content',
					background: "ui-popup-background",
					toast: "ui-popup-toast"
				};

			Popup.events = {
				SHOW: 'popupshow',
				HIDE: 'popuphide',
				BEFORE_SHOW: 'popupbeforeshow',
				BEFORE_HIDE: 'popupbeforehide'
			};
			Popup.classes = classes;

			selectors.popup = '.ui-popup';

			prototype._build = function (template, element) {
				var classes = Popup.classes,
					options = this.options,
					header = element.querySelector('.' + classes.header),
					content = element.querySelector('.' + classes.content),
					footer = element.querySelector('.' + classes.footer),
					i,
					l,
					node;


				if (!content) {
					content = document.createElement('div');
					content.className = classes.content;
					if (element.children.length > 0) {
						for (i = 0, l = element.children.length; i < l; ++i) {
							node = element.children[i];
							if (node !== footer && node !== header) {
								content.appendChild(element.children[i]);
							}
						}
					}
					element.appendChild(content);
				}

				if (!header && options.header !== false) {
					header = document.createElement('div');
					header.className = classes.header;
					if (typeof options.header !== 'boolean') {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}

				if (!footer && options.footer !== false) {
					footer = document.createElement('div');
					footer.className = classes.footer;
					if (typeof options.footer !== 'boolean') {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}

				this.ui.header = header;
				this.ui.content = content;
				this.ui.footer = footer;

				return element;
			};
			prototype._init = function (element) {
				var classes = Popup.classes,
					ui = this.ui;

				// re-init if already built
				if (!ui.header) {
					ui.header = element.querySelector('.' + classes.header);
				}
				if (!ui.footer) {
					ui.footer = element.querySelector('.' + classes.footer);
				}
				if (!ui.content) {
					ui.content = element.querySelector('.' + classes.content);
				}
				ui.content.style.overflowY = 'scroll';
				this._elementClassList = element.classList;

				this._refresh();
			};

			prototype._bindEvents = function () {
				var self = this,
					closeFunction = function() {
						self.close({transition: "none"});
					};
				window.addEventListener("resize", function () {
					if (self.active === true) {
						self._refresh();
					}
				}, false);
				document.addEventListener("pagebeforehide", closeFunction, false);
			};

			prototype._destroy = function () {
				return null;
			};

			prototype._refresh = function () {
				var ui = this.ui,
					header = ui.header,
					footer = ui.footer,
					element = this.element,
					content = ui.content,
					props = {
						'margin-top': 0,
						'margin-bottom': 0,
						'margin-left': 0,
						'margin-right': 0,
						'border-width': 0,
						'display': null
					},
					elementStyle = element.style,
					contentStyle = content.style,
					borderWidth,
					headerHeight = 0,
					footerHeight = 0,
					contentHeight = 0,
					contentWidth = 0,
					isToast = element.classList.contains(classes.toast),
					dom = ns.utils.DOM,
					isDisplayNone;

				dom.extractCSSProperties(element, props);

				borderWidth = parseFloat(props['border-width']) || 0;

				isDisplayNone = props.display === 'none';

				if (isDisplayNone) {
					elementStyle.visibility = "hidden";
					elementStyle.display = "block";
				}

				contentWidth = window.innerWidth - (parseInt(props['margin-left'], 10) + parseInt(props['margin-right'], 10));
				elementStyle.width = contentWidth + 'px';

				if (!isToast) {
					if (header) {
						headerHeight = header.offsetHeight;
					}

					if (footer) {
						footerHeight = footer.offsetHeight;
					}

					contentHeight = window.innerHeight - (parseInt(props['margin-top'], 10) + parseInt(props['margin-bottom'], 10));

					elementStyle.height = contentHeight + 'px';
					contentStyle.height = (contentHeight - headerHeight - footerHeight - borderWidth * 2) + 'px';
					contentStyle.overflowY = "scroll";
				}

				if (isDisplayNone) {
					elementStyle.display = "";
					elementStyle.visibility = "";
				}
			};

			prototype._setActive = function (active) {
				var activeClass = Popup.classes.active,
					elementCls = this._elementClassList;
				if (!active) {
					elementCls.remove(activeClass);
				} else {
					elementCls.add(activeClass);
				}

				this.active = elementCls.contains(activeClass);
			};

			prototype.open = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = document.createElement("div");

				container.classList.add(classes.background);
				container.appendChild(element.parentElement.replaceChild(container, element));

				if ( element.classList.contains(classes.toast) ) {
					container.addEventListener("click", self.closePopup, false);
				}
				self.background = container;

				eventUtils.trigger(element, events.BEFORE_SHOW);
				self._transition(transitionOptions, function () {
					self._setActive(true);
					eventUtils.trigger(element, events.SHOW);
				});
			};

			prototype.close = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = self.background,
					parent = container.parentElement;

				if ( element.classList.contains(classes.toast) ) {
					container.removeEventListener("click", self.closePopup, false);
				}

				parent = container.parentElement;
				if ( parent ) {
					parent.appendChild(element);
					parent.removeChild(container);
				}
				container = null;

				eventUtils.trigger(element, events.BEFORE_HIDE);
				this._transition(transitionOptions, function () {
					self._setActive(false);
					eventUtils.trigger(element, events.HIDE);
				});
			};

			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition,
					transitionClass = transition + options.ext,
					element = self.element,
					pageContainer = engine.getRouter().pageContainer,
					deferred = {
						resolve: resolve
					},
					animationEnd = function () {
						element.removeEventListener('animationend', animationEnd);
						element.removeEventListener('webkitAnimationEnd', animationEnd);
						pageContainer.classList.remove("ui-viewport-transitioning");
						element.classList.remove(transitionClass);
						deferred.resolve();
					};

				if (transition !== "none") {
					element.addEventListener('animationend', animationEnd);
					element.addEventListener('webkitAnimationEnd', animationEnd);
					pageContainer.classList.add("ui-viewport-transitioning");
					element.classList.add(transitionClass);
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			Popup.prototype = prototype;

			engine.defineWidget(
				'popup',
				'',
				'.ui-popup',
				['setActive', 'show', 'hide', 'open', 'close'],
				Popup,
				"micro"
			);
			ns.widget.micro.Popup = Popup;
			//>>excludeStart('ejBuildExclude', pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd('ejBuildExclude');
}(window, window.document, window.screen, window.ej));