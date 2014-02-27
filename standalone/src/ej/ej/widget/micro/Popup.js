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

/**
 * #Popup widget
 *
 * ##Default selectors
 * All elements with class=ui-popup will be become Popup widgets
 *
 * ##Manual constructor
 * To create the widget manually you can use the instanceWidget method
 *
 * @example
 * var popup = ej.engine.instanceWidget(document.getElementById('popup'), 'Popup');
 * //or
 * var popup = gear.ui.popup(document.getElementById('popup'));
 * 
 * #HTML Examples
 *
 * ###Simple popup
 * <div id="popup-example" class="ui-popup">
 *		Hello world!
 * </div>
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
			var /**
				* Popup widget
				* @class ns.widget.micro.Popup
				* @extends ns.widget.BaseWidget
				*/
				/**
				* @class gear.ui.Popup
				* @inheritdoc ns.widget.micro.Popup
				* @extends ns.widget.micro.Popup
				*/
				Popup = function () {
					var self = this,
						/**
						 * @property {Object} ui A collection of UI elements
						 * @memberOf ns.widet.micro.Popup
						 * @instance
						 */
						ui = {};

					/**
					 * @property {Object} options
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self.options = {
						/**
						 * @property {string|boolean} [options.header=false] Header content
						 * @memberOf ns.widget.micro.Popup
						 * @instance
						 */
						header: false,
						/**
						 * @property {string|boolean} [options.footer=false] Footer content
						 * @memberOf ns.widget.micro.Popup
						 * @instance
						 */
						footer: false
					};

					/**
					 * @private
					 * @property {DOMTokenList?} [_elementClassList=null] Popup element classList 
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self._elementClassList = null;

					// public html elements					
					/**
					* @property {HTMLElement?} [ui.header=null] Header element 
					* @memberOf ns.widget.micro.Popup
					* @instance
					*/
					ui.header = null;
					
					/**
					* @property {HTMLElement?} [ui.header=null] Footer element
					* @memberOf ns.widget.micro.Popup
					* @instance
					*/
					ui.footer = null;
				
					/**
					* @property {HTMLElement?} [ui.content=HTMLElement] Content element
					* @memberOf ns.widget.micro.Popup
					* @instance
					*/
					ui.content = null;
									
					self.ui = ui;

					/**
					 * @property {boolean} [active=false] Popup state flag
					 * @memberOf ns.widget.micro.Popup
					 * @instance
					 */
					self.active = false;
				},
				/**
				* @property {Object} BaseWidget Alias for {@link ns.widget.BaseWidget}
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				BaseWidget = ns.widget.BaseWidget,
				/**
				* @property {ns.engine} engine Alias for class ns.engine
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {ns.utils.events} events Alias for class ns.utils.events
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				eventUtils = ns.utils.events,
				/**
				* @property {ns.utils.object} object Alias for class ns.utils.events
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				object = ns.utils.object,
				/**
				* @property {ns.utils.selectors} selectors Alias for class ns.selectors
				* @memberOf ns.widget.micro.Popup
				* @private
				*/
				selectors = ns.micro.selectors,
				prototype = new BaseWidget(),
				/**
				* @property {Object} classes Dictionary for popup related css class names
				* @memberOf ns.widget.micro.Popup
				* @static
				*/
				classes = {
					active: "ui-popup-active",
					header: "ui-popup-header",
					footer: "ui-popup-footer",
					content: "ui-popup-content",
					background: "ui-popup-background",
					toast: "ui-popup-toast"
				};

			/**
			* @property {Object} events Dictionary for popup related events
			* @memberOf ns.widget.micro.Popup
			* @static
			*/
			Popup.events = {
				show: "popupshow",
				hide: "popuphide",
				before_show: "popupbeforeshow",
				before_hide: "popupbeforehide"
			};
			Popup.classes = classes;

			/**
			 * @property {string} [popup=".ui-popup"]
			 * @memberOf ns.micro.selectors
			 */
			selectors.popup = ".ui-popup";

			/**
			* Build the popup DOM tree
			* @method _build
			* @protected
			* @instance
			* @param {string} template
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._build = function (template, element) {
				var ui = this.ui,
					classes = Popup.classes,
					options = this.options,
					header = element.querySelector("." + classes.header),
					content = element.querySelector("." + classes.content),
					footer = element.querySelector("." + classes.footer),
					i,
					l,
					node;

				if (!content) {
					content = document.createElement("div");
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
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}

				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}

				ui.header = header;
				ui.content = content;
				ui.footer = footer;

				return element;
			};

			/**
			* Initialize popup
			* @method _init
			* @protected
			* @instance
			* @param {HTMLElement} element
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._init = function (element) {
				var self = this,
					ui = self.ui;

				// re-init if already built
				if (!ui.header) {
					ui.header = element.querySelector("." + classes.header);
				}
				if (!ui.footer) {
					ui.footer = element.querySelector("." + classes.footer);
				}
				if (!ui.content) {
					ui.content = element.querySelector("." + classes.content);
				}
				ui.content.style.overflowY = "scroll";
				self._elementClassList = element.classList;
				self._refresh();
			};

			/**
			* Bind events
			* @method _bindEvents
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._bindEvents = function () {
				var self = this;
				self.closeFunction = function () {
					self.close({transition: "none"});
				};
				self.onResize = function () {
					if (self.active === true) {
						self._refresh();
					}
				};
				window.addEventListener("resize", self.onResize, false);
				document.addEventListener("pagebeforehide", self.closeFunction, false);
			};

			/**
			* Destroy the popup
			* @method _destroy
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._destroy = function () {
				window.removeEventListener("resize", this.onResize, false);
				document.removeEventListener("pagebeforehide", this.closeFunction, false);
			};

			/**
			* Refresh the popup 
			* @method _refresh
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype._refresh = function () {
				var ui = this.ui,
					header = ui.header,
					footer = ui.footer,
					element = this.element,
					content = ui.content,
					props = {
						"margin-top": 0,
						"margin-bottom": 0,
						"margin-left": 0,
						"margin-right": 0,
						"border-width": 0,
						"display": null
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
					originalDisplay = '',
					originalVisibility = '',
					isDisplayNone;

				dom.extractCSSProperties(element, props);

				borderWidth = parseFloat(props["border-width"]) || 0;

				isDisplayNone = props.display === "none";

				if (isDisplayNone) {
					originalDisplay = elementStyle.display;
					originalVisibility = elementStyle.visibility;
					elementStyle.visibility = "hidden";
					elementStyle.display = "block";
				}

				contentWidth = window.innerWidth - (parseInt(props["margin-left"], 10) + parseInt(props["margin-right"], 10));
				elementStyle.width = contentWidth + "px";

				if (!isToast) {
					if (header) {
						headerHeight = header.offsetHeight;
					}

					if (footer) {
						footerHeight = footer.offsetHeight;
					}

					contentHeight = window.innerHeight - (parseInt(props["margin-top"], 10) + parseInt(props["margin-bottom"], 10));

					elementStyle.height = contentHeight + "px";
					contentStyle.height = (contentHeight - headerHeight - footerHeight - borderWidth * 2) + "px";
					contentStyle.overflowY = "scroll";
				}

				if (isDisplayNone) {
					elementStyle.display = originalDisplay;
					elementStyle.visibility = originalVisibility;
				}
			};

			/**
			* Set the state of the popup
			* @method _setActive
			* @param {boolean} active
			* @protected
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
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

			/**
			* Open the popup 
			* @method open
			* @param {Object=} [options]
			* @param {string=} [options.transition] options.transition
			* @param {string=} [options.ext= in ui-pre-in] options.ext
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype.open = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = document.createElement("div");

				container.classList.add(classes.background);
				container.appendChild(element.parentElement.replaceChild(container, element));

				if (element.classList.contains(classes.toast)) {
					container.addEventListener("click", self.closePopup, false);
				}
				self.background = container;

				self.trigger(events.before_show);
				self._transition(transitionOptions, function () {
					self._setActive(true);
					self.trigger(events.show);
				});
			};

			/**
			* Close the popup 
			* @method close
			* @param {Object=} [options]
			* @param {string=} [options.transition]
			* @param {string=} [options.ext= in ui-pre-in] options.ext 
			* @instance
			* @memberOf ns.widget.micro.Popup
			*/
			prototype.close = function (options) {
				var transitionOptions = object.multiMerge({}, options, {ext: " in ui-pre-in "}),
					events = Popup.events,
					self = this,
					element = self.element,
					container = self.background,
					parent = container.parentElement;

				if (element.classList.contains(classes.toast)) {
					container.removeEventListener("click", self.closePopup, false);
				}

				parent = container.parentElement;
				if (parent) {
					parent.appendChild(element);
					parent.removeChild(container);
				}
				container = null;

				self.trigger(events.before_hide);
				self._transition(transitionOptions, function () {
					self._setActive(false);
					self.trigger(events.hide);
				});
			};

			/**
			* Animate popup opening/closing
			* @method close
			* @protected
			* @instance
			* @param {Object=} [options]
			* @param {string=} [options.transition]
			* @param {string=} [options.ext]
			* @param {Function} resolve
			* @memberOf ns.widget.micro.Popup
			*/

			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || '',
					transitionClass = transition + options.ext,
					element = self.element,
					elementClassList = element.classList,
					pageContainer = engine.getRouter().getContainer().element,
					deferred = {
						resolve: resolve
					},
					animationEnd = function () {
						element.removeEventListener("animationend", animationEnd, false);
						element.removeEventListener("webkitAnimationEnd", animationEnd, false);
						pageContainer.classList.remove("ui-viewport-transitioning");
						transitionClass.split(" ").forEach(function (cls) {
							var _cls = cls.trim();
							if (_cls.length > 0) {
								elementClassList.remove(_cls);
							}
						});
						deferred.resolve();
					};

				if (transition !== "none") {
					element.addEventListener("animationend", animationEnd, false);
					element.addEventListener("webkitAnimationEnd", animationEnd, false);
					pageContainer.classList.add("ui-viewport-transitioning");
					transitionClass.split(" ").forEach(function (cls) {
						var _cls = cls.trim();
						if (_cls.length > 0) {
							elementClassList.add(_cls);
						}
					});
				} else {
					window.setTimeout(deferred.resolve, 0);
				}
				return deferred;
			};

			Popup.prototype = prototype;

			engine.defineWidget(
				"popup",
				"",
				".ui-popup",
				["setActive", "show", "hide", "open", "close"],
				Popup,
				"micro"
			);
			ns.widget.micro.Popup = Popup;
			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return Popup;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.screen, window.ej));
