/*global window, define */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Drawer Widget in Wearable
 * Wearable Drawer widget provide drawer UX in wearable device.
 *
 * ## HTML Examples
 *
 *        @example
 *        <div id="drawerPage" class="ui-page">
 *          <header id="contentHeader" class="ui-header">
 *              <h2 class="ui-title">Drawer</h2>
 *          </header>
 *          <div id = "content" class="ui-content">
 *            Drawer
 *          </div>
 *
 *          <!-- Drawer Handler -->
 *          <a id="drawerHandler" href="#Drawer" class="drawer-handler">Drawer Button</a>
 *          <!-- Drawer Widget -->
 *          <div id="drawer" class="ui-drawer" data-drawer-target="#drawerPage" data-position="left" data-enable="true" data-drag-edge="1">
 *              <header class="ui-header">
 *                  <h2 class="ui-title">Left Drawer</h2>
 *              </header>
 *              <div class="ui-content">
 *                  <p>CONTENT</p>
 *              </div>
 *          </div>
 *        </div>
 *
 * ## Manual constructor
 *
 *         @example
 *             (function() {
 *                 var handler = document.getElementById("drawerHandler"),
 *                     page = document.getElementById("drawerPage"),
 *                     drawerElement = document.querySelector(handler.getAttribute("href")),
 *                     drawer = tau.widget.Drawer(drawerElement);;
 *
 *                     page.addEventListener( "pagebeforeshow", function() {
 *                         drawer.setDragHandler(handler);
 *                         tau.event.on(handler, "mousedown touchstart", function(e) {
 *                             switch (e.type) {
 *                             case "touchstart":
 *                             case "mousedown":
 *                             // open drawer
 *                             drawer.transition(60);
 *                         }
 *                     }, false);
 *             })();
 *
 * ##Drawer state
 * Drawer has four state type.
 * - "closed" - Drawer closed state.
 * - "opened" - Drawer opened state.
 * - "sliding" - Drawer is sliding state. This state does not mean that will operate open or close.
 * - "settling" - drawer is settling state. 'Settle' means open or close status. So, this state means that drawer is animating for opened or closed state.
 *
 * ##Drawer positioning
 * You can declare to drawer position manually. (Default is left)
 *
 * If you implement data-position attributes value is 'left', drawer appear from left side.
 *
 *        @example
 *        <div class="ui-drawer" data-position="left" id="leftdrawer">
 *
 * - "left" - drawer appear from left side
 * - "right" - drawer appear from right side
 *
 * ##Drawer targeting
 * You can declare to drawer target manually. (Default is Page)
 *
 * If you implement data-drawer-target attribute value at CSS selector type, drawer widget will be appended to target.
 *
 *        @example
 *        <div class="ui-drawer" data-drawer-target="#drawerPage">
 *
 * ##Drawer enable
 * You can declare for whether drawer gesture used or not. (Default is true)
 *
 * If you implement data-enable attribute value is 'true', you can use the drawer widget.
 * This option can be changed by 'enable' or 'disable' method.
 *
 *        @example
 *        <div class="ui-drawer" data-enable="true">
 *
 * ##Drawer drag gesture start point
 * You can declare to drag gesture start point. (Default is 1)
 *
 * If you implement data-drag-edge attribute value is '0.5', you can drag gesture start in target width * 0.5 width area.
 *
 *        @example
 *        <div class="ui-drawer" data-drag-edge="1">
 *
 * @class ns.widget.wearable.Drawer
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/Drawer",
			"../../../../core/util/DOM",
			"../../../../core/util/object",
			"../../../../core/util/selectors",
			"../../../../core/event",
			"../../../../core/event/gesture",
			"./Page",
			"../../../../core/engine"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				CoreDrawerPrototype = CoreDrawer.prototype,
				Page = ns.widget.wearable.Page,
				engine = ns.engine,
				domUtils = ns.util.DOM,
				object = ns.util.object,
				selectors = ns.util.selectors,
				events = ns.event,
				Gesture = ns.event.gesture,
				classes = CoreDrawer.classes,
				STATE = {
					CLOSED: "closed",
					OPENED: "opened",
					SLIDING: "sliding",
					SETTLING: "settling"
				},
				CUSTOM_EVENTS = {
					OPEN: "draweropen",
					CLOSE: "drawerclose"
				},

				Drawer = function () {
					var self = this;
					CoreDrawer.call(self);

					self._isDrag = false;
					self._state = STATE.CLOSED;
					self._settlingType = STATE.CLOSED;
					self._traslatedX = 0;
				},
				prototype = new CoreDrawer();


			Drawer.prototype = prototype;
			Drawer.classes = classes;

			/**
			 * Unbind drag events
			 * @method unbindDragEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function unbindDragEvents(element) {
				var self = this;

				ns.event.disableGesture(element);
				events.off(element, "drag dragstart dragend dragcancel swipe transitionEnd webkitTransitionEnd", self, false);
				events.off(self.element, "transitionEnd webkitTransitionEnd", self, false);
			}

			/**
			 * bind drag events
			 * @method bindDragEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			function bindDragEvents(element) {
				var self = this;
				self._eventBoundElement = element;
				ns.event.enableGesture(
					element,

					new ns.event.gesture.Drag({
						blockVertical: true
					}),
					new ns.event.gesture.Swipe({
						orientation: Gesture.Orientation.HORIZONTAL
					})
				);

				events.on(element, "drag dragstart dragend dragcancel swipe transitionEnd webkitTransitionEnd", self, false);
				events.on(self.element, "transitionEnd webkitTransitionEnd", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Drawer
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "dragcancel":
						self._onDragCancel(event);
						break;
					case "swipe":
						self._onSwipe(event);
						break;
					case "transitionEnd":
					case "webkitTransitionEnd":
						self._onTransitionEnd(event);
				}
			};

			/**
			 * Configure Drawer widget
			 * @method _configure
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._configure = function(element) {
				var self = this;
				/**
				 * Widget options
				 * @property {string} [options.drawerTarget="ui-page"] Drawer appended target. Value type is CSS selector type.
				 * @property {string} [options.position="left"] Drawer position. "left" or "right"
				 * @property {boolean} [options.enable=true] Enable drawer widget.
				 * @property {Number} [options.dragEdge=1] Start dragging gesture possible area ratio of target or handler between 0 and 1.
				 */
				object.merge(self.options, {
					drawerTarget: "." + Page.classes.uiPage,
					position: "left",
					enable: true,
					dragEdge: 1
				});
			};

			/**
			 * init Drawer widget
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._init = function(element) {
				this._initLayout();
				return element;
			};

			/**
			 * init Drawer widget layout
			 * @method _initLayout
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._initLayout = function() {
				var self = this,
					options = self.options,
					element = self.element,
					ui = self._ui,
					placeholder = document.createComment(element.id + "-placeholder");

				ui._pageElement = selectors.getClosestByClass(element, Page.classes.uiPage);
				ui._targetElement = selectors.getClosestBySelector(element, options.drawerTarget);
				ui._targetElement.appendChild(element);
				if (!ui._placeholder) {
					ui._placeholder = placeholder;
					element.parentNode.insertBefore(placeholder, element);
				}
				options.width = options.width || element.offsetWidth;

				CoreDrawerPrototype._init.call(self, element);
			};
			/**
			 * Swipe event handler
			 * @method _onSwipe
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onSwipe = function(event) {
				var self = this,
					direction = event.detail.direction === "left" ? "right" : "left",
					options = self.options;

				if (options.enable && options.position === direction) {
					self.open();
				}
			};
			/**
			 * Dragstart event handler
			 * @method _onDragStart
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onDragStart = function(event) {
				var self = this;
				if (self.options.enable && !self._isDrag && self._state !== STATE.SETTLING && self._checkSideEdge(event)) {
					self._isDrag = true;
				} else {
					self.close();
				}
			};
			/**
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onDrag = function(event) {
				var self = this,
					deltaX = event.detail.deltaX,
					options = self.options,
					translatedX = self._traslatedX,
					movedX;

				if (options.enable && self._isDrag && self._state !== STATE.SETTLING) {
					if (options.position === "left"){
						movedX = -options.width + deltaX + translatedX;
						if (movedX < 0) {
							self._translate(movedX, 0);
						}
					} else {
						movedX = options.width + deltaX - translatedX;
						if (movedX > 0) {
							self._translate(movedX, 0);
						}
					}
				}
			};
			/**
			 * DragEnd event handler
			 * @method _onDragEnd
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onDragEnd = function(event) {
				var self = this,
					options = self.options,
					detail = event.detail;
				if (options.enable && self._isDrag) {
					if (Math.abs(detail.deltaX) > options.width / 2) {
						self.open();
					} else if (self._state !== STATE.SETTLING) {
						self.close();
					}
				}
				self._isDrag = false;
			};
			/**
			 * DragCancel event handler
			 * @method _onDragCancel
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onDragCancel = function(event) {
				var self = this;
				if (self.options.enable && self._isDrag) {
					self.close();
				}
				self._isDrag = false;
			};
			/**
			 * TransitionEnd event handler
			 * @method _onTransitionEnd
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._onTransitionEnd = function(event) {
				var self = this,
					element = self.element,
					position = self.options.position;

				if (self._state === STATE.SETTLING) {
					if (self._settlingType === STATE.OPENED) {
						self.trigger(CUSTOM_EVENTS.OPEN, {
							position: position
						});
						self._state = STATE.OPENED;
					} else {
						self.trigger(CUSTOM_EVENTS.CLOSE, {
							position: position
						});
						self._state = STATE.CLOSED;
					}
				}
			};

			/**
			 * Check dragstart event whether triggerred on side edge area or not
			 * @method _checkSideEdge
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._checkSideEdge = function(event) {
				var self = this,
					detail = event.detail,
					eventClientX = detail.pointer.clientX - detail.estimatedDeltaX,
					options = self.options,
					position = options.position,
					boundElement = self._eventBoundElement,
					boundElementOffsetWidth = boundElement.offsetWidth,
					boundElementRightEdge = boundElement.offsetLeft + boundElementOffsetWidth,
					dragStartArea = boundElementOffsetWidth * options.dragEdge;

				if ((position === "left" && eventClientX > 0 && eventClientX < dragStartArea) ||
					(position === "right" && eventClientX > boundElementRightEdge - dragStartArea &&
						eventClientX < boundElementRightEdge)) {
					return true;
				}
				return false;
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._bindEvents = function() {
				var self = this,
					targetElement = self._ui._targetElement;
				CoreDrawerPrototype._bindEvents.call(self);

				bindDragEvents.call(self, targetElement);
			};

			/**
			 * Enable Drawer widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._enable = function() {
				this._oneOption("enable", true);
			};

			/**
			 * Disable Drawer widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._disable = function() {
				this._oneOption("enable", false);
			};

			/**
			 * Destroy Drawer widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._destroy = function() {
				var self = this,
					element = self.element,
					placeholder = self._ui._placeholder,
					placeholderParent = placeholder.parentNode;

				placeholderParent.insertBefore(element, placeholder);
				placeholderParent.removeChild(placeholder);
				CoreDrawerPrototype._destroy.call(self);
				unbindDragEvents.call(self, self._eventBoundElement);

			};

			prototype._translate = function(x, duration) {
				var self = this;
				if (self._state !== STATE.SETTLING) {
					self._state = STATE.SLIDING;
				}
				CoreDrawerPrototype._translate.call(self, x, duration);
			};
			/**
			 * Set Drawer drag handler.
			 * If developer use handler, drag event is bound at handler only.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.setDragHandler(handler);
			 * </script>
			 *
			 * @method setDragHandler
			 * @public
			 * @param {Element} element
			 * @member ns.widget.wearable.Drawer
			 */
			prototype.setDragHandler = function(element) {
				var self = this;
				self.options.dragEdge = 1;
				unbindDragEvents.call(self, self._eventBoundElement);
				bindDragEvents.call(self, element);
			};

			/**
			 * Transition Drawer widget.
			 * This method use only positive integer number.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.Transition(60);
			 * </script>
			 *
			 * @method transition
			 * @public
			 * @param {Integer} position
			 * @member ns.widget.wearable.Drawer
			 */
			prototype.transition = function(position) {
				var self = this,
					options = self.options;
				if (options.position === "left"){
					self._translate(-options.width + position, options.duration);
				} else {
					self._translate(options.width - position , options.duration);
				}
				self._traslatedX = position;
			};
			/**
			 * Open Drawer widget.
			 *
			 * #####Running example in pure JavaScript:
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.open();
			 * </script>
			 *
			 * @method open
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			prototype.open = function(){
				var self = this;
				if (self._state !== STATE.OPENED) {
					self._state = STATE.SETTLING;
					self._settlingType = STATE.OPENED;
					CoreDrawerPrototype.open.call(self);
				}
			};
			/**
			 * Close Drawer widget.
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href"));
			 *
			 *     drawer.close();
			 * </script>
			 *
			 * @method close
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			prototype.close = function(){
				var self = this;
				if (self._state !== STATE.CLOSED) {
					self._state = STATE.SETTLING;
					self._settlingType = STATE.CLOSED;
					CoreDrawerPrototype.close.call(self);
				}
			};
			/**
			 * Refresh Drawer widget.
			 * @method refresh
			 * @protected
			 * @member ns.widget.wearable.Drawer
			 */
			prototype._refresh = function() {
				var self = this;
				CoreDrawerPrototype._refresh.call(self);
				self._initLayout();
			};
			/**
			 * Get state of Drawer widget.
			 *
			 * @example
			 * <!-- Drawer Handlers -->
			 * <a id="leftDrawerHandler" href="#leftDrawer" class="drawer-handler">Left Handler</a>
			 *
			 * <div id="leftDrawer" class="ui-drawer" data-drawer-target="#drawerSinglePage" data-position="left" data-enable="true" data-drag-edge="1">
			 *    <header class="ui-header">
			 *        <h2 class="ui-title">Left Drawer</h2>
			 *    </header>
			 *    <div id="leftClose" class="ui-content">
			 *        <p>Click Close</p>
			 *    </div>
			 * </div>
			 *
			 * <script>
			 *     var handler = document.getElementById("leftDrawerHandler"),
			 *         drawer = tau.widget.Drawer(document.querySelector(handler.getAttribute("href")),
			 *         state;
			 *
			 *     state = drawer.getState();
			 * </script>
			 * @method getState
			 * @return {String} Drawer state {"closed"|"opened"|"sliding"|"settling"}
			 * @public
			 * @member ns.widget.wearable.Drawer
			 */
			prototype.getState = function() {
				return this._state;
			};
			ns.widget.wearable.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				".ui-drawer",
				[
					"transition",
					"setDragHandler",
					"open",
					"close",
					"getState"
				],
				Drawer,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
