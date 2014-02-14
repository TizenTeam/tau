/*global window, define */
/*jslint nomen: true, plusplus: true */
(function (window, document, screen, ej) {
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
			var BaseWidget = ej.widget.BaseWidget,
				engine = ej.engine,
				eventUtils = ej.utils.events,
				object = ej.utils.object,
				selectors = ej.micro.selectors,
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
				};

			Popup.events = {
				SHOW: 'popupshow',
				HIDE: 'popuphide',
				BEFORE_SHOW: 'popupbeforeshow',
				BEFORE_HIDE: 'popupbeforehide'
			};
			Popup.classes = {
				ACTIVE: 'ui-popup-active',
				HEADER: 'ui-popup-header',
				FOOTER: 'ui-popup-footer',
				CONTENT: 'ui-popup-content'
			};

			selectors.popup = '.ui-popup';

			Popup.prototype = new BaseWidget();

			Popup.prototype._build = function (template, element) {
				var classes = Popup.classes,
					options = this.options,
					header = element.querySelector('.' + classes.HEADER),
					content = element.querySelector('.' + classes.CONTENT),
					footer = element.querySelector('.' + classes.FOOTER),
					i,
					l,
					node;


				if (!content) {
					content = document.createElement('div');
					content.className = classes.CONTENT;
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
					header.className = classes.HEADER;
					if (typeof options.header !== 'boolean') {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}

				if (!footer && options.footer !== false) {
					footer = document.createElement('div');
					footer.className = classes.FOOTER;
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
			Popup.prototype._init = function (element) {
				var classes = Popup.classes,
					ui = this.ui;

				// re-init if already built
				if (!ui.header) {
					ui.header = element.querySelector('.' + classes.HEADER);
				}
				if (!ui.footer) {
					ui.footer = element.querySelector('.' + classes.FOOTER);
				}
				if (!ui.content) {
					ui.content = element.querySelector('.' + classes.CONTENT);
				}
				ui.content.style.overflowY = 'scroll';
				this._elementClassList = element.classList;

				this._refresh();
			};
			Popup.prototype._bindEvents = function () {
				var self = this;
				window.addEventListener("resize", function () {
					if (self.active === true) {
						self._refresh();
					}
				}, false);
			};
			Popup.prototype._destroy = function () {
				return null;
			};

			Popup.prototype._refresh = function () {
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
						'display': null
					},
					elementStyle = element.style,
					contentStyle = content.style,
					borderWidth = parseFloat(elementStyle.borderWidth) || 0,
					headerHeight = 0,
					footerHeight = 0,
					contentHeight = 0,
					contentWidth = 0,
					isToast = element.classList.contains("ui-popup-toast"),
					dom = ej.utils.DOM,
					isDisplayNone;

				dom.extractCSSProperties(element, props);

				isDisplayNone = props.display === 'none';

				if (isDisplayNone) {
					elementStyle.visibility = "hidden";
					elementStyle.display = "block";
				}


				contentWidth = screen.width - (parseInt(props['margin-left'], 10) + parseInt(props['margin-right'], 10));
				elementStyle.width = contentWidth + 'px';

				if (!isToast) {
					if (header) {
						headerHeight = dom.getElementHeight(header);
					}

					if (footer) {
						footerHeight = dom.getElementHeight(footer);
					}

					contentHeight = screen.height - (parseInt(props['margin-top'], 10) + parseInt(props['margin-bottom'], 10));

					elementStyle.height = contentHeight + 'px';
					contentStyle.height = (contentHeight - headerHeight - footerHeight - borderWidth * 2) + 'px';
					contentStyle.overflowY = "scroll";
				}

				if (isDisplayNone) {
					elementStyle.display = "";
					elementStyle.visibility = "";
				}
			};

			Popup.prototype._setActive = function (active) {
				var activeClass = Popup.classes.ACTIVE,
					elementCls = this._elementClassList;
				if (!active) {
					elementCls.remove(activeClass);
				} else {
					elementCls.add(activeClass);
				}

				this.active = elementCls.contains(activeClass);
			};

			Popup.prototype.open = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element;

				eventUtils.trigger(element, events.BEFORE_SHOW);
				this._transition(transitionOptions, function () {
					self._setActive(true);
					eventUtils.trigger(element, events.SHOW);
				});
			};

			Popup.prototype.close = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element;

				eventUtils.trigger(element, events.BEFORE_HIDE);
				this._transition(transitionOptions, function () {
					self._setActive(false);
					eventUtils.trigger(element, events.HIDE);
				});
			};

			Popup.prototype._transition = function (options, resolve) {
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

			engine.defineWidget(
				'popup',
				'',
				'.ui-popup',
				['setActive', 'show', 'hide', 'open', 'close'],
				Popup,
				"micro"
			);
			ej.widget.micro.Popup = Popup;
			//>>excludeStart('ejBuildExclude', pragmas.ejBuildExclude);
			return ej.widget.micro.Popup;
		}
	);
	//>>excludeEnd('ejBuildExclude');
}(window, window.document, window.screen, window.ej));