/*global window, define */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PanelChanger Widget
 *
 * @class ns.widget.core.PanelChanger
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../../util/object",
			"../BaseWidget",
			"../core",
			"./Page",
			"./Panel"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				selectors = ns.util.selectors,
				object = ns.util.object,
				engine = ns.engine,
				page = ns.widget.core.Page,
				panel = ns.widget.core.Panel,
				events = ns.event,
				classes = {
					PANEL_CHANGER: "ui-panel-changer",
					PAGE: page.classes.uiPage,
					PANEL: panel.classes.PANEL,
					ACTIVE_PANEL: panel.classes.ACTIVE_PANEL,
					HEADER: "ui-header",
					FOOTER: "ui-footer",
					PRE_IN: "pre-in",
					IN: "-in",
					OUT: "-out"
				},
				PanelChanger = function () {
					var self = this;
					self._ui = {};
					self.options = {};
					self.eventType = {};
					self._animating = false;
					self._animationClasses = {};
				},
				DEFAULT = {
					ANIMATE: "slide"
				},
				prototype = new BaseWidget();

			PanelChanger.prototype = prototype;

			/**
			 * Configure PanelChanger component
			 * @method _configure
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._configure = function() {
				var self = this;
				object.merge(self.options, {
					animationType: DEFAULT.ANIMATE
				});
				object.merge(self.eventType, panel.eventType);
			};

			/**
			 * Build PanelChanger component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._build = function(element) {
				element.classList.add(classes.PANEL_CHANGER);

				return element;
			};

			/**
			 * Init PanelChanger component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._init = function(element) {
				var self = this,
					ui = self._ui;
				ui.page = selectors.getClosestByClass(element, classes.PAGE);
				ui.header = ui.page.querySelector("." + classes.HEADER);
				ui.footer = ui.page.querySelector("." + classes.FOOTER);
				ui.activePanel = ui.page.querySelector("." + classes.ACTIVE_PANEL);
				if (!ui.activePanel) {
					ui.activePanel = ui.page.querySelector("[data-role='panel']");
					ui.activePanel.classList.add(classes.ACTIVE_PANEL);
				}
				ui.activePanel.style.display = "block";
				this._initLayout();
				return element;
			};

			/**
			 * Init PanelChanger component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._initLayout = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					pageOffsetHeight = ui.page ? ui.page.offsetHeight : 0,
					headerOffsetHeight = ui.header ? ui.header.offsetHeight : 0,
					footerOffsetHeight = ui.footer ? ui.footer.offsetHeight : 0,
					parentNode = element.parentNode;

				element.style.height = pageOffsetHeight - headerOffsetHeight - footerOffsetHeight + "px";
			};
			/**
			 * Bind events on PanelChanger component
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._bindEvents = function(element) {
				bindEvents.call(this, element);
			};

			/**
			 * Click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._onClick = function(event) {
				var self = this,
					link = event.target.tagName.toLowerCase() === "a" ? event.target : selectors.getClosestByTag(event.target, "A"),
					href;

				if (link && !self._animating) {
					href = link.getAttribute("href");
					self._changePanel(href);
					event.preventDefault();
				}
			};

			prototype._changePanel = function(address, animationType) {
				var self = this,
					request = new XMLHttpRequest(),
					url = address.split(/[#|?]+/)[0];

				if (animationType) {
					self.options.animationType = animationType;
				}
				request.responseType = "document";
				request.open("GET", url);
				request.addEventListener("error", self._loadError);
				request.addEventListener("load", function (event) {
					var request = event.target;
					if (request.readyState === 4) {
						if (request.status === 200 || (request.status === 0 && request.responseXML)) {
							self._loadSuccess(address, request.responseXML);
						} else {
							self._loadError();
						}
					}
				});
				request.send();
			};
			/**
			 * AJAX loadsuccess event handler
			 * @method _loadSuccess
			 * @param {String} href address string
			 * @param {XML} xml element
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._loadSuccess = function(href, xml) {
				var self = this,
					element = self.element,
					id = href.substring(href.lastIndexOf("#")),
					eventType = self.eventType,
					ui = self._ui,
					panel = element.querySelector(id);

				if (!panel) {
					panel = xml.querySelector(id) || xml.querySelector("[data-role='panel']");
					element.appendChild(panel);
				}

				ui._toPanel = panel;
				events.trigger(panel, eventType.BEFORE_CREATE);
				panel.style.display = "none";
				engine.createWidgets(element);
				events.trigger(panel, eventType.CREATE);
				events.trigger(panel, eventType.BEFORE_SHOW);
				events.trigger(ui.activePanel, eventType.BEFORE_HIDE);
				panel.classList.add(classes.PRE_IN);

				self._show();
			};

			/**
			 * Show next panel component
			 * @method _show
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._show = function() {
				var self = this,
					options = self.options,
					toPanel = self._ui._toPanel,
					fromPanel = self._ui.activePanel,
					type = options.animationType,
					animationClasses = self._animationClasses;

				self._animating = true;
				fromPanel.classList.remove(classes.ACTIVE_PANEL);
				toPanel.style.display = "block";
				animationClasses.IN = type + classes.IN;
				animationClasses.OUT = type + classes.OUT;

				fromPanel.classList.add(animationClasses.OUT);
				toPanel.classList.add(animationClasses.IN);
			};

			/**
			 * animationEnd event handler
			 * @method _onAnimationEnd
			 * @param {Event} event
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._onAnimationEnd = function(event) {
				var self = this,
					toPanel = self._ui._toPanel,
					activePanel = self._ui.activePanel,
					animationClasses = self._animationClasses;

				if (!self._animating) {
					return;
				}
				activePanel.style.display = "none";
				activePanel.classList.remove(animationClasses.OUT);
				toPanel.classList.add(classes.ACTIVE_PANEL);
				toPanel.classList.remove(classes.PRE_IN);
				toPanel.classList.remove(animationClasses.IN);

				events.trigger(activePanel, self.eventType.HIDE);
				events.trigger(toPanel, self.eventType.SHOW);
				events.trigger(toPanel, self.eventType.CHANGE, {
					fromPanel: activePanel,
					toPanel: toPanel
				});
				self._ui.activePanel = toPanel;
				self._animating = false;
			};

			/**
			 * Loaderror event handler
			 * @method _loadError
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype._loadError = function() {
				console.warn("We can't load AJAX")
			};

			/**
			 * Bind events on this component
			 * @method bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @private
			 */
			function bindEvents(element) {
				var self = this;
				events.on(element, "vclick", self, false);
				events.prefixedFastOn(element, "animationEnd", self, false);
			}

			/**
			 * Unbind events on this component
			 * @method unBindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.PanelChanger
			 * @private
			 */
			function unBindEvents(element) {
				var self = this;
				events.off(element, "vclick", self, false);
				events.prefixedFastOff(element, "animationEnd", self, false);
			}

			/**
			 * handleEvent
			 * @method bindEvents
			 * @param {Event} event
			 * @member ns.widget.core.PanelChanger
			 * @protected
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "vclick":
						self._onClick(event);
						break;
					case "webkitAnimationEnd":
					case "mozAnimationEnd":
					case "msAnimationEnd":
					case "oAnimationEnd":
					case "animationend":
						self._onAnimationEnd(event);
						break;
				}
			};

			/**
			 * Change panel method
			 * @method changePanel
			 * @param {String} address
			 * @member ns.widget.core.PanelChanger
			 * @public
			 */
			prototype.changePanel = function(address) {
				this._changePanel(address);
			};

			prototype._destroy = function() {
				var self = this;
				self._ui = null;
				self.options = null;
				self._eventType = null;
				unBindEvents(self.element);
			};
			// definition
			ns.widget.core.PanelChanger = PanelChanger;

			engine.defineWidget(
				"PanelChanger",
				"[data-role='panel-changer'], .ui-panel-changer",
				["changePanel"],
				PanelChanger,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
