/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # BasePopup Widget
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @extends ns.widget.core.BasePopup
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/object",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var
				/**
				 * @property {Function} BaseWidget Alias for {@link ns.widget.BaseWidget}
				 * @member ns.widget.core.BasePopup
				 * @private
				 */
				BaseWidget = ns.widget.BaseWidget,
				/**
				 * @property {ns.engine} engine Alias for class ns.engine
				 * @member ns.widget.core.BasePopup
				 * @private
				 */
				engine = ns.engine,
				/**
				 * @property {Object} objectUtils Alias for class ns.util.events
				 * @member ns.widget.core.BasePopup
				 * @private
				 */
				objectUtils = ns.util.object,

				Popup = function () {
					var self = this,
						ui;
					ui = self._ui || {};
					self.options = objectUtils.merge({}, Popup.defaults);
					/**
					 * @property {boolean} [active=false] Popup state flag
					 * @member ns.widget.core.BasePopup
					 * @instance
					 */
					ui.overlay = null;
					ui.header = null;
					ui.footer = null;
					ui.content = null;
					ui.container = null;
					self._ui = ui;
				},
				/**
				 * @property {Object} defaults Object with default options
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @member ns.widget.core.BasePopup
				 * @static
				 */
				defaults = {
					transition: "none",
					dismissible: true,
					overlay: true,
					header: false,
					footer: false,
					overlayClass: "",
					history: true
				},
				CLASSES_PREFIX = "ui-popup",
				/**
				 * @property {Object} classes Dictionary for popup related css class names
				 * @member ns.widget.core.BasePopup
				 * @static
				 */
				classes = {
					popup: CLASSES_PREFIX,
					active: CLASSES_PREFIX + "-active",
					overlay: CLASSES_PREFIX + "-overlay",
					header: CLASSES_PREFIX + "-header",
					footer: CLASSES_PREFIX + "-footer",
					content: CLASSES_PREFIX + "-content"
				},
				EVENTS_PREFIX = "popup",
				/**
				 * @property {Object} events Dictionary for popup related events
				 * @member ns.widget.core.BasePopup
				 * @static
				 */

				events = {
					/**
					 * @event popupshow Triggered when the popup has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
					 * @member ns.widget.core.BasePopup
					 */
					show: EVENTS_PREFIX + "show",
					/**
					 * Triggered on the popup after the transition animation has completed.
					 * @event popuphide
					 * @member ns.widget.core.BasePopup
					 */
					hide: EVENTS_PREFIX + "hide",
					/**
					 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off.
					 * @event popupbeforeshow
					 * @member ns.widget.core.BasePopup
					 */
					before_show: EVENTS_PREFIX + "beforeshow",
					/**
					 * Triggered on the popup we are transitioning away from, before the actual transition animation is kicked off.
					 * @event popupbeforehide
					 * @member ns.widget.core.BasePopup
					 */
					before_hide: EVENTS_PREFIX + "beforehide"
				},

				prototype = new BaseWidget();

			Popup.classes = classes;
			Popup.events = events;
			Popup.defaults = defaults;

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.BasePopup
			 */
			prototype._buildContent = function ( element) {
				var ui = this._ui,
					content = element.querySelector("." + classes.content),
					elementChildren = [].slice.call(element.children),
					elementChildrenLength = elementChildren.length,
					i,
					node;

				if (!content) {
					content = document.createElement("div");
					content.className = classes.content;
					for (i = 0; i < elementChildrenLength; ++i) {
						node = elementChildren[i];
						if (node !== ui.footer && node !== ui.header) {
							content.appendChild(node);
						}
					}
					element.appendChild(content);
					ui.content = content;
				}
			};

			/**
			 * Build the popup DOM tree
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.BasePopup
			 */
			prototype._buildHeader = function ( element) {
				var ui = this._ui,
					options = this.options,
					content = ui.content,
					header = ui.header || element.querySelector("." + classes.header);
				if (!header && options.header !== false) {
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
					ui.header = header;
				}
			};

			prototype._setHeader = function ( element, value ) {
				var self = this,
					ui = self._ui,
					header = ui.header;
				if (header) {
					header.parentNode.removeChild(header);
					ui.header = null;
				}
				self.options.header = value;
				self._buildHeader(ui.container);
			};

			prototype._buildFooter = function ( element) {
				var ui = this._ui,
					options = this.options,
					footer = ui.footer || element.querySelector("." + classes.footer);
				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
					ui.footer = footer;
				}
			};

			prototype._setFooter = function ( element, value ) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;
				if (footer) {
					footer.parentNode.removeChild(footer);
					ui.footer = null;
				}
				self.options.footer = value;
				self._buildFooter(ui.container);
			};

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui;

				this._buildHeader(element);
				this._buildFooter(element);

				this._buildContent(element);

				this._setOverlay(element, this.options.overlay);

				ui.container = element;

				return element;
			};

			/**
			 * Set overlay
			 * @method _setOverlay
			 * @param {HTMLElement} element
			 * @param {boolean} enable
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._setOverlay = function(element, enable) {
				var self = this,
					overlayClass = self.options.overlayClass,
					ui = self._ui,
					overlay = ui.overlay;

				// create overlay
				if (enable) {
					if (!overlay) {
						overlay = document.createElement("div");
						element.parentNode.insertBefore(overlay, element);
						ui.overlay = overlay;
					}
					overlay.className = classes.overlay + (overlayClass ? " " + overlayClass : "");
				} else if (overlay) {
					overlay.parentNode.removeChild(overlay);
					ui.overlay = null;
				}
			};

			/**
			 * Returns the state of the popup
			 * @method _isActive
			 * @protected
			 * @instance
			 * @member ns.widget.core.BasePopup
			 */
			prototype._isActive = function () {
				return this.element.classList.contains(classes.active);
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._init = function(element) {
				var ui = this._ui;

				ui.header = ui.header || element.querySelector("." + classes.header);
				ui.footer = ui.footer || element.querySelector("." + classes.footer);
				ui.content = ui.content || element.querySelector("." + classes.content);
				ui.container = element;
			};

			/**
			 * Set the state of the popup
			 * @method _setActive
			 * @param {boolean} active
			 * @protected
			 * @instance
			 * @member ns.widget.core.BasePopup
			 */
			prototype._setActive = function (active) {
				var self = this,
					activeClass = classes.active,
					elementClassList = self.element.classList,
					route = engine.getRouter().getRoute("popup"),
					options = self.options;
				if (active) {
					// set global variable
					route.setActive(self, options);
					// add proper class
					elementClassList.add(activeClass);
				} else {
					// no popup is opened, so set global variable on "null"
					route.setActive(null, options);
					// remove proper class
					elementClassList.remove(activeClass);
				}
			};

			prototype._bindEvents = function (element) {
				var self = this;
				window.addEventListener("pagebeforehide", self, false);
				window.addEventListener("resize", self, false);
				self._bindOverlayEvents();
			};

			prototype._bindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.addEventListener("click", this, false);
				}
			};

			prototype._unbindOverlayEvents = function () {
				var overlay = this._ui.overlay;
				if (overlay) {
					overlay.removeEventListener("click", this, false);
				}
			};

			prototype._unbindEvents = function (element) {
				var self = this;
				window.removeEventListener("pagebeforehide", self, false);
				window.removeEventListener("resize", self, false);
				self._unbindOverlayEvents();
			};

			/**
			 * Open the popup
			 * @method open
			 * @param {Object=} [options]
			 * @param {string=} [options.transition] options.transition
			 * @instance
			 * @member ns.widget.core.BasePopup
			 */
			prototype.open = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);
				if (!self._isActive()) {
					if (!newOptions.dismissible) {
						engine.getRouter().lock();
					}
					self._show(newOptions);
				}
			};

			/**
			 * Close the popup
			 * @method close
			 * @param {Object=} [options]
			 * @param {string=} [options.transition]
			 * @instance
			 * @member ns.widget.core.BasePopup
			 */
			prototype.close = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);
				if (self._isActive()) {
					if (!newOptions.dismissible) {
						engine.getRouter().unlock();
					}
					self._hide(newOptions);
				}
			};

			prototype._show = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge({}, options);

				transitionOptions.ext = " in ";

				self.trigger(events.before_show);
				self._transition(transitionOptions, self._onShow.bind(self));
			};

			prototype._onShow = function() {
				var self = this,
					overlay = self._ui.overlay;
				if (overlay) {
					overlay.style.display = "block";
				}
				self._setActive(true);
				self.trigger(events.show);
			};

			prototype._hide = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge(self.options, options);

				transitionOptions.ext = " out ";

				self.trigger(events.before_hide);
				self._transition(transitionOptions, self._onHide.bind(self));
			};

			prototype._onHide = function() {
				var self = this,
					overlay = self._ui.overlay;
				if (overlay) {
					overlay.style.display = "";
				}
				self._setActive(false);
				self.trigger(events.hide);
			};

			prototype.handleEvent = function(event) {
				var self = this;
				switch(event.type) {
					case "pagebeforehide":
						self.close({transition: "none"});
						break;
					case "resize":
						self._onResize(event);
						break;
					case "click":
						if ( event.target === self._ui.overlay ) {
							self._onClickOverlay(event);
						}
						break;
				}
			};

			prototype._refresh = function() {
				var self = this;
				self._unbindOverlayEvents();
				self._setOverlay(self.options.overlay, self.element);
				self._bindOverlayEvents();
			};

			prototype._onClickOverlay = function(event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					this.close();
				}
			};

			prototype._onResize = function() {
				if (this._isActive()) {
					this._refresh();
				}
			};

			/**
			 * Animate popup opening/closing
			 * @method _transition
			 * @protected
			 * @instance
			 * @param {Object} [options]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext]
			 * @param {?Function} [resolve]
			 * @member ns.widget.core.BasePopup
			 */
			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || "none",
					transitionClass = transition + options.ext,
					element = self.element,
					overlay = self._ui.overlay,
					elementClassList = element.classList,
					deferred = {
						resolve: resolve
					},
					animationEnd = function () {
						element.removeEventListener("animationend", animationEnd, false);
						element.removeEventListener("webkitAnimationEnd", animationEnd, false);
						transitionClass.split(" ").forEach(function (cls) {
							var _cls = cls.trim();
							if (_cls.length > 0) {
								elementClassList.remove(_cls);
								if (overlay) {
									overlay.classList.remove(_cls);
								}
							}
						});
						deferred.resolve();
					};

				if (transition !== "none") {
					element.addEventListener("animationend", animationEnd, false);
					element.addEventListener("webkitAnimationEnd", animationEnd, false);
					transitionClass.split(" ").forEach(function (cls) {
						var _cls = cls.trim();
						if (_cls.length > 0) {
							elementClassList.add(_cls);
							if (overlay) {
								overlay.classList.add(_cls);
							}
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			prototype._destroy = function() {
				var self = this,
					element = self.element;

				self._unbindEvents(element);
				self._setOverlay(false, element);
			};

			Popup.prototype = prototype;

			ns.widget.core.Popup = Popup;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
