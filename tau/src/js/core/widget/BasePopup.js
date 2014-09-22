/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * # BasePopup Widget
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.BasePopup
 * @extends ns.widget.BaseWidget
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../util/object",
			"../util/DOM/css",
			"./BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var
			/**
			* @property {Function} BaseWidget Alias for {@link ns.widget.BaseWidget}
			* @member ns.widget.BasePopup
			* @private
			*/
			BaseWidget = ns.widget.BaseWidget,
			/**
			* @property {ns.engine} engine Alias for class ns.engine
			* @member ns.widget.BasePopup
			* @private
			*/
			engine = ns.engine,
			/**
			* @property {Object} objectUtils Alias for class ns.util.events
			* @member ns.widget.BasePopup
			* @private
			*/
			objectUtils = ns.util.object,

			BasePopup = function () {
				this.options = objectUtils.merge({}, BasePopup.defaults);
				/**
				 * @property {boolean} [active=false] Popup state flag
				 * @member ns.widget.BasePopup
				 * @instance
				 */
				this.active = false;
				this.overlay = null;
			},
			/**
			 * @property {Object} defaults Object with default options
			 * @property {string} [options.transition="none"] Sets the default transition for the popup.
			 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
			 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
			 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
			 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
			 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
			 * @member ns.widget.BasePopup
			 * @static
			 */
			defaults = {
				transition: "none",
				dismissible: true,
				overlay: true,
				overlayClass: "",
				history: true
			},
			/**
			* @property {Object} classes Dictionary for popup related css class names
			* @member ns.widget.BasePopup
			* @static
			*/
			classes = {
				popup: "ui-popup",
				active: "ui-popup-active",
				overlay: "ui-popup-overlay"
			},
			/**
			* @property {Object} events Dictionary for popup related events
			* @member ns.widget.BasePopup
			* @static
			*/
			events = {
				/**
				 * @event popupshow Triggered when the popup has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
				 * @member ns.widget.BasePopup
				 */
				show: "popupshow",
				/**
				 * Triggered on the popup after the transition animation has completed.
				 * @event popuphide
				 * @member ns.widget.BasePopup
				 */
				hide: "popuphide",
				/**
				 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off.
				 * @event popupbeforeshow
				 * @member ns.widget.BasePopup
				 */
				before_show: "popupbeforeshow",
				/**
				 * Triggered on the popup we are transitioning away from, before the actual transition animation is kicked off.
				 * @event popupbeforehide
				 * @member ns.widget.BasePopup
				 */
				before_hide: "popupbeforehide"
			},

			prototype = new BaseWidget();

			BasePopup.classes = classes;
			BasePopup.events = events;
			BasePopup.defaults = defaults;

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._build = function (element) {
				var options = this.options;

				this.element = element;

				// set overlay
				this._setOverlay(options.overlay);

				return element;
			};

			prototype._setOverlay = function(enable) {
				var overlayClass = this.options.overlayClass,
					element = this.element,
					overlay = this.overlay;
				// create overlay
				if (enable) {
					if (!overlay) {
						overlay = document.createElement("div");
						element.parentNode.insertBefore(overlay, element);
						this.overlay = overlay;
					}
					overlay.className = classes.overlay + (overlayClass ? " "+overlayClass : "");
				} else if (overlay) {
					element.parentNode.removeChild(overlay);
					this.overlay = null;
				}
			};

			/**
			* Set the state of the popup
			* @method _setActive
			* @param {boolean} active
			* @protected
			* @instance
			* @member ns.widget.BasePopup
			*/
			prototype._setActive = function (active) {
				var activeClass = classes.active,
					elementCls = this.element.classList,
					route = engine.getRouter().getRoute("popup"),
					options = this.options;
				if (active) {
					// set global variable
					route.setActive(this, options);
					// add proper class
					elementCls.add(activeClass);
				} else {
					// no popup is opened, so set global variable on "null"
					route.setActive(null, options);
					// remove proper class
					elementCls.remove(activeClass);
				}

				this.active = elementCls.contains(activeClass);
			};

			prototype._bindEvents = function (element) {
				window.addEventListener("pagebeforehide", this, false);
				window.addEventListener("resize", this, false);
				if (this.overlay) {
					this.overlay.addEventListener("click", this);
				}
			};

			prototype._unbindEvents = function (element) {
				window.removeEventListener("pagebeforehide", this, false);
				window.removeEventListener("resize", this, false);
				if (this.overlay) {
					this.overlay.removeEventListener("click", this);
				}
			};

			/**
			* Open the popup
			* @method open
			* @param {Object=} [options]
			* @param {string=} [options.transition] options.transition
			* @instance
			* @member ns.widget.BasePopup
			*/
			prototype.open = function (options) {
				var newOptions = objectUtils.merge(this.options, options);
				if (!this.active) {
					if (!newOptions.dismissible) {
						engine.getRouter().lock();
					}
					this._show(newOptions);
				}
			};

			/**
			* Close the popup
			* @method close
			* @param {Object=} [options]
			* @param {string=} [options.transition]
			* @instance
			* @member ns.widget.BasePopup
			*/
			prototype.close = function (options) {
				var newOptions = objectUtils.merge(this.options, options);
				if (this.active) {
					if (!newOptions.dismissible) {
						engine.getRouter().unlock();
					}
					this._hide(newOptions);
				}
			};

			prototype._show = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge({}, options);

				transitionOptions.ext = " in ";

				self.trigger(events.before_show);
				self._transition(transitionOptions, self._onShow.bind(this));
			};

			prototype._onShow = function() {
				var self = this;
				if (this.overlay) {
					this.overlay.style.display = "block";
				}
				self._setActive(true);
				self.trigger(events.show);
			};

			prototype._hide = function (options) {
				var transitionOptions = objectUtils.merge(this.options, options),
					self = this;

				transitionOptions.ext = " out ";

				self.trigger(events.before_hide);
				self._transition(transitionOptions, self._onHide.bind(this));
			};

			prototype._onHide = function() {
				var self = this;
				if (this.overlay) {
					this.overlay.style.display = "";
				}
				self._setActive(false);
				self.trigger(events.hide);
			};

			prototype.handleEvent = function(event) {
				switch(event.type) {
				case "pagebeforehide":
					this.close({transition: "none"});
					break;
				case "resize":
					this._onResize(event);
					break;
				case "click":
					if ( event.target === this.overlay ) {
						this._onClickOverlay(event);
					}
					break;
				}
			};

			prototype._refresh = function() {
				var options = this.options;
				this._unbindEvents(this.element);
				this._setOverlay(options.overlay);
				this._bindEvents(this.element);
			};

			prototype._onClickOverlay = function(event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					this.close();
				}
			};

			prototype._onResize = function(event) {
				if (this.active === true) {
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
			* @member ns.widget.BasePopup
			*/
			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || "none",
					transitionClass = transition + options.ext,
					element = self.element,
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
								if (self.overlay) {
									self.overlay.classList.remove(_cls);
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
							if (self.overlay) {
								self.overlay.classList.add(_cls);
							}
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			prototype._destroy = function() {
				this._unbindEvents(this.element);
				this._setOverlay(false);

				this.active = false;
				this.overlay = null;
			};

			BasePopup.prototype = prototype;

			ns.widget.BasePopup = BasePopup;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return BasePopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
