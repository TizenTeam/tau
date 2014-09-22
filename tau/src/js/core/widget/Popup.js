/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */

/**
 * # Popup Widget
 * Shows a pop-up window.
 *
 * The popup widget shows in the middle of the screen a list of items in a pop-up window. It automatically optimizes the pop-up window size within the screen. The following table describes the supported popup classes.
 *
 * ## Default selectors
 * All elements with class *ui-popup* will be become popup widgets.
 *
 * The pop-up window can contain a header, content, and footer area like the page element.
 *
 * To open a pop-up window from a link, use the data-rel attribute in HTML markup as in the following code:
 *
 *      @example
 *      <a href="#popup" class="ui-btn" data-rel="popup">Open popup when clicking this element.</a>
 *
 * The following table shows examples of various types of popups.
 *
 * The popup contains header, content and footer area
 *
 * ###HTML Examples
 *
 * #### Basic popup with header, content, footer
 *
 *		@example
 *		<div class="ui-page">
 *		    <div class="ui-popup">
 *		        <div class="ui-popup-header">Power saving mode</div>
 *		        <div class="ui-popup-content">
 *		            Turning on Power
 *		            saving mode will
 *		            limit the maximum
 *		            per
 *		        </div>
 *		        <div class="ui-popup-footer">
 *		            <button id="cancel" class="ui-btn">Cancel</button>
 *		        </div>
 *		    </div>
 *		</div>
 *
 * #### Popup with 2 buttons in the footer
 *
 *      @example
 *         <div id="2btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Delete</div>
 *             <div class="ui-popup-content">
 *                 Delete the image?
 *             </div>
 *             <div class="ui-popup-footer ui-grid-col-2">
 *                 <button id="2btnPopup-cancel" class="ui-btn">Cancel</button>
 *                 <button id="2btnPopup-ok" class="ui-btn">OK</button>
 *             </div>
 *         </div>
 *
 * #### Popup with checkbox/radio
 *
 * If you want make popup with list checkbox(or radio) just include checkbox (radio) to popup and add class *ui-popup-checkbox-label* to popup element.
 *
 *		@example
 *         <div id="listBoxPopup" class="ui-popup">
 *             <div class="ui-popup-header">When?</div>
 *             <div class="ui-popup-content" style="height:243px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="check-1" class="ui-popup-checkbox-label">Yesterday</label>
 *                         <input type="checkbox" name="checkset" id="check-1" />
 *                     </li>
 *                     <li>
 *                         <label for="check-2" class="ui-popup-checkbox-label">Today</label>
 *                         <input type="checkbox" name="checkset" id="check-2" />
 *                     </li>
 *                     <li>
 *                         <label for="check-3" class="ui-popup-checkbox-label">Tomorrow</label>
 *                         <input type="checkbox" name="checkset" id="check-3" />
 *                     </li>
 *                 </ul>
 *                 <ul class="ui-listview">
 *                     <li>
 *                         <label for="radio-1" class="ui-popup-radio-label">Mandatory</label>
 *                         <input type="radio" name="radioset" id="radio-1" />
 *                     </li>
 *                     <li>
 *                         <label for="radio-2" class="ui-popup-radio-label">Optional</label>
 *                         <input type="radio" name="radioset" id="radio-2" />
 *                     </li>
 *                 </ul>
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="listBoxPopup-close" class="ui-btn">Close</button>
 *             </div>
 *         </div>
 *     </div>
 *
 * #### Popup with no header and footer
 *
 *      @example
 *         <div id="listNoTitleNoBtnPopup" class="ui-popup">
 *             <div class="ui-popup-content" style="height:294px; overflow-y:scroll">
 *                 <ul class="ui-listview">
 *                     <li><a href="">Ringtones 1</a></li>
 *                     <li><a href="">Ringtones 2</a></li>
 *                     <li><a href="">Ringtones 3</a></li>
 *                 </ul>
 *             </div>
 *         </div>
 *
 * #### Toast popup
 *
 *      @example
 *         <div id="PopupToast" class="ui-popup ui-popup-toast">
 *             <div class="ui-popup-content">Saving contacts to sim on Samsung</div>
 *         </div>
 *
 * ### Create Option popup
 *
 * Popup inherits value of option positionTo from property data-position-to set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#popupOptionText" data-rel="popup"  data-position-to="origin">Text</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="popupOptionText" class="ui-popup">
 *			<div class="ui-popup-content">
 *				<ul class="ui-listview">
 *				<li><a href="#">Option 1</a></li>
 *				<li><a href="#">Option 2</a></li>
 *				<li><a href="#">Option 3</a></li>
 *				<li><a href="#">Option 4</a></li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ### Opening and closing popup
 *
 * To open popup from "a" link using html markup, use the following code:
 *
 *		@example
 *      <div class="ui-page">
 *          <header class="ui-header">
 *              <h2 class="ui-title">Call menu</h2>
 *          </header>
 *          <div class="ui-content">
 *              <a href="#popup" class="ui-btn" data-rel="popup" >Open Popup</a>
 *          </div>
 *
 *          <div id="popup" class="ui-popup">
 *               <div class="ui-popup-header">Power saving mode</div>
 *                   <div class="ui-popup-content">
 *                       Turning on Power
 *                       saving mode will
 *                       limit the maximum
 *                       per
 *                   </div>
 *               <div class="ui-popup-footer">
 *               <button id="cancel" class="ui-btn">Cancel</button>
 *           </div>
 *       </div>
 *
 *  To open the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.openPopup("popup")
 *
 *  To close the popup widget from JavaScript use method *tau.openPopup(to)*
 *
 *          @example
 *          tau.closePopup("popup")
 *
 * To find the currently active popup, use the ui-popup-active class.
 *
 * To bind the popup to a button, use the following code:
 *
 *      @example
 *         <!--HTML code-->
 *         <div id="1btnPopup" class="ui-popup">
 *             <div class="ui-popup-header">Power saving mode</div>
 *             <div class="ui-popup-content">
 *             </div>
 *             <div class="ui-popup-footer">
 *                 <button id="1btnPopup-cancel" class="ui-btn">Cancel</button>
 *             </div>
 *         </div>
 *         <script>
 *             // Popup opens with button click
 *             var button = document.getElementById("button");
 *             button.addEventListener("click", function() {
 *                 tau.openPopup("#1btnPopup");
 *             });
 *
 *             // Popup closes with Cancel button click
 *             document.getElementById("1btnPopup-cancel").addEventListener("click", function() {
 *                 tau.closePopup();
 *             });
 *         </script>
 *
 * ## Manual constructor
 * For manual creation of popup widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*.
 *
 * ## Options for Popup Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.popup(buttonElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * ## Transitions
 *
 * By default, the framework doesn't apply transition. To set a custom transition effect, add the data-transition attribute to the link.
 *
 *		@example
 *		<a href="index.html" data-rel="popup" data-transition="slideup">I'll slide up</a>
 *
 * Global configuration:
 *
 *		@example
 *		gear.ui.defaults.popupTransition = "slideup";
 *
 * ### Transitions list
 *
 * - **none** Default value, no transition.
 * - **slideup** Makes the content of the pop-up slide up.
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *      @example
 *         <!--Popup html code-->
 *         <div id="popup" class="ui-popup">
 *             <div class="ui-popup-header"></div>
 *             <div class="ui-popup-content"></div>
 *         </div>
 *         </div>
 *         <script>
 *             // Use popup events
 *             var popup = document.getElementById("popup");
 *             popup.addEventListener("popupbeforecreate", function() {
 *                 // Implement code for popupbeforecreate event
 *             });
 *         </script>
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.Popup
 * @extends ns.widget.BasePopup
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event",
			"../util/selectors",
			"../util/object",
			"../util/DOM/attributes",
			"../util/DOM/manipulation",
			"../util/DOM/css",
			"./BasePopup"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var

			BasePopup = ns.widget.BasePopup,

			engine = ns.engine,

			selectors = ns.util.selectors,

			domUtils = ns.util.DOM,

			objectUtils = ns.util.object,

			eventUtils = ns.event,

			deferred = ns.util.deferred,

			Popup = function () {
				var self = this;

				BasePopup.call(this);

				self.options = objectUtils.merge({}, Popup.defaults);

				self.element = null;
				self.wrapper = null;
				self.arrow = null;

				self.header = null;
				self.footer = null;
				self.content = null;
			},

			/**
			 * @property {Object} defaults Object with default options
			 * @property {string} [options.transition="none"] Sets the default transition for the popup.
			 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
			 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
			 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
			 * @property {string} [overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
			 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
			 * @property {string} [options.arrow="l,t,r,b"] Sets directions of popup's placement by priority. First one has the highest priority, last the lowest.
			 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
			 * @member ns.widget.Popup
			 * @static
			 */
			defaults = objectUtils.merge({}, BasePopup.defaults, {
				arrow:"l,t,r,b",
				positionTo: "window"
			}),

			/**
			* @property {Object} classes Dictionary for popup related css class names
			* @member ns.widget.Popup
			* @static
			*/
			classes = objectUtils.merge({}, BasePopup.classes, {
				header: "ui-popup-header",
				footer: "ui-popup-footer",
				content: "ui-popup-content",
				wrapper: "ui-popup-wrapper",
				context: "ui-ctxpopup",
				arrow: "ui-arrow",
				arrowDir: "ui-popup-arrow-",
				build: "ui-build"
			}),

			/**
			* @property {Object} events Dictionary for popup related events
			* @member ns.widget.Popup
			* @static
			*/
			events = objectUtils.merge({}, BasePopup.events, {
				beforeposition: "beforeposition"
			}),

			positionType = {
				WINDOW: "window",
				ORIGIN: "origin"
			};

			prototype = new BasePopup();

			Popup.defaults = defaults;
			Popup.classes = classes;
			Popup.events = events;

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
					options = this.options,
					fragment = document.createDocumentFragment(),
					wrapper,
					arrow;

				BasePopup.prototype._build.call(this, element);

				// create wrapper
				wrapper = document.createElement("div");
				wrapper.classList.add(classes.wrapper);
				self.wrapper = wrapper;

				[].forEach.call([].slice.call(element.children), function(child) {
					wrapper.appendChild(child);
				});

				// create arrow
				arrow = document.createElement("div");
				arrow.appendChild(document.createElement("span"));
				arrow.classList.add(classes.arrow);
				self.arrow = arrow;

				element.appendChild(arrow);
				element.appendChild(wrapper);

				self.header = element.querySelector("." + classes.header);
				self.footer = element.querySelector("." + classes.footer);
				self.content = element.querySelector("." + classes.content);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			prototype._init = function(element) {
			};

			prototype._setActive = function (active) {
				var options = this.options;
				// NOTE: popup's options object is stored in window.history at the router module,
				// and this window.history can't store DOM element object.
				if (typeof options.positionTo !== "string") {
					options.positionTo = null;
				}

				BasePopup.prototype._setActive.call(this, active);
			};

			prototype._reposition = function(options) {
				var element = this.element;

				options = {
					x: options.x,
					y: options.y,
					positionTo: options.positionTo
				};

				this.trigger(events.beforeposition, null, false);

				element.classList.add(classes.build);

				this._layout();
				this._placementCoords(options);

				element.classList.remove(classes.build);

			};

			function findBestPosition(clickedElement) {
				var arrow = this.options.arrow,
					element = this.element,
					windowSize = {w: window.innerWidth, h: window.innerHeight},
					popupSize = {w: element.offsetWidth, h: element.offsetHeight},
					clickElementRect = clickedElement.getBoundingClientRect(),
					clickElementOffset = {
						x: clickElementRect.left,
						y: clickElementRect.top,
						w: Math.min(clickElementRect.right - clickElementRect.left, windowSize.w - clickElementRect.left),
						h: Math.min(clickElementRect.bottom - clickElementRect.top, windowSize.h - clickElementRect.top)
					},
					params = {
						"l": {dir: "l", fixedField: "w", fixedPositionField: "x", fixedPositionFactor: -1, size: popupSize.w, max: clickElementOffset.x},
						"r": {dir: "r", fixedField: "w", fixedPositionField: "x", fixedPositionFactor: 1, size: popupSize.w, max: windowSize.w - clickElementOffset.x - clickElementOffset.w},
						"b": {dir: "b", fixedField: "h", fixedPositionField: "y", fixedPositionFactor: 1, size: popupSize.h, max: windowSize.h - clickElementOffset.y - clickElementOffset.h},
						"t": {dir: "t", fixedField: "h", fixedPositionField: "y", fixedPositionFactor: -1, size: popupSize.h, max: clickElementOffset.y}
					},
					bestDirection = params["t"],
					direction,
					bestOffsetInfo;

				arrow.split(",").forEach(function(key){
					if (direction) {
						return;
					}

					if ( params[key].size < params[key].max ) {
						direction = params[key];
					} else if ( params[key].max > bestDirection.max ) {
						bestDirection = params[key];
					}
				});

				if ( !direction ) {
					direction = bestDirection;
					popupSize[direction.fixedField] = direction.max;
				}

				bestOffsetInfo = {
					x: clickElementOffset.x + clickElementOffset.w/2 - popupSize.w/2,
					y: clickElementOffset.y + clickElementOffset.h/2 - popupSize.h/2,
					w: popupSize.w,
					h: popupSize.h,
					dir: direction.dir
				};

				bestOffsetInfo[direction.fixedPositionField] += (popupSize[direction.fixedField]/2 + clickElementOffset[direction.fixedField]/2) * direction.fixedPositionFactor;

				return bestOffsetInfo;
			}

			function adjustedPositionAndPlacementArrow(bestRect, x, y) {
				var element = this.element,
					wrapper = this.wrapper,
					arrow = this.arrow,
					arrowStyle = arrow.style,
					windowSize = {w: window.innerWidth, h: window.innerHeight},
					wrapperRect = wrapper.getBoundingClientRect(),
					arrowHalfWidth = arrow.offsetWidth/2,
					params = {
						"t": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"b": {pos: x, min: "left", max: "right", posField: "x", valField: "w", styleField: "left"},
						"l": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"},
						"r": {pos: y, min: "top", max: "bottom", posField: "y", valField: "h", styleField: "top"}
					},
					p = params[bestRect.dir],
					surplus;

				wrapperRect = {
					left: wrapperRect.left + bestRect.x,
					right: wrapperRect.right + bestRect.x,
					top: wrapperRect.top + bestRect.y,
					bottom: wrapperRect.bottom += bestRect.y
				};

				if (wrapperRect[p.min] > p.pos - arrowHalfWidth) {
					surplus = bestRect[p.posField];
					if (surplus > 0) {
						bestRect[p.posField] = Math.max(p.pos - arrowHalfWidth, 0);
						p.pos = bestRect[p.posField] + arrowHalfWidth;
					} else {
						p.pos = wrapperRect[p.min] + arrowHalfWidth;
					}
				} else if (wrapperRect[p.max] < p.pos + arrowHalfWidth) {
					surplus = windowSize[p.valField] - (bestRect[p.posField] + bestRect[p.valField]);
					if (surplus > 0) {
						bestRect[p.posField] += Math.min(surplus, (p.pos + arrowHalfWidth) - wrapperRect[p.max]);
						p.pos = bestRect[p.posField] + bestRect[p.valField] - arrowHalfWidth;
					} else {
						p.pos = wrapperRect[p.max] - arrowHalfWidth;
					}
				}

				arrowStyle[p.styleField] = (p.pos - arrowHalfWidth - bestRect[p.posField]) + "px";

				return bestRect;
			}

			prototype._placementCoords = function(options) {
				var self = this,
					positionTo = options.positionTo,
					x = options.x,
					y = options.y,
					element = self.element,
					content = self.content,
					elementStyle = element.style,
					contentStyle = content.style,
					elementWidth,
					elementHeight,
					clickedElement,
					bestRect;

				if (typeof positionTo === "string") {
					if (positionTo === positionType.ORIGIN && typeof x === "number" && typeof y === "number") {
						clickedElement = document.elementFromPoint(x, y);
					} else if (positionTo !== positionType.WINDOW) {
						try {
							clickedElement = document.querySelector(options.positionTo);
						} catch(e) {}
					}
				} else {
					clickedElement = positionTo;
				}

				if (clickedElement) {

					element.classList.add(classes.context);

					elementHeight = element.offsetHeight;
					bestRect = findBestPosition.call(this, clickedElement);

					element.classList.add(classes.arrowDir + bestRect.dir);

					bestRect = adjustedPositionAndPlacementArrow.call(this, bestRect, x, y);

					if (elementHeight > bestRect.h) {
						this._layout(bestRect.h);
					}

					elementStyle.left = bestRect.x + "px";
					elementStyle.top = bestRect.y + "px";

				} else {
					elementWidth = element.offsetWidth;
					elementHeight = element.offsetHeight;

					elementStyle.top = (window.innerHeight - elementHeight) + "px";
					elementStyle.left = "50%";
					elementStyle.marginLeft = -(elementWidth/2) + "px";
				}

			};

			prototype._layout = function(maxHeight) {
				var self = this,
					element = self.element,
					content = self.content,
					contentStyle = content.style,
					contentHeight = 0,
					elementOffsetHeight = 0;

				if (!content) {
					return;
				}

				if (contentStyle.height) {
					contentStyle.height = "";
					contentStyle.minHeight = "";
				}

				maxHeight = maxHeight || window.innerHeight;

				contentHeight = content.offsetHeight;
				elementOffsetHeight = element.offsetHeight;

				if ( elementOffsetHeight > maxHeight ) {
					contentHeight -= (elementOffsetHeight - maxHeight);
					contentStyle.height = contentHeight + "px";
					contentStyle.minHeight = contentHeight + "px";
				}

			};

			prototype._onHide = function() {
				var element = this.element,
					content = this.content,
					arrow = this.arrow;

				BasePopup.prototype._onHide.call(this);

				element.classList.remove(classes.context);
				["l", "r", "b", "t"].forEach(function(key) {
					element.classList.remove(classes.arrowDir + key);
				});

				element.removeAttribute("style");
				content.removeAttribute("style");
				arrow.removeAttribute("style");
			};

			prototype._destroy = function() {
				var element = this.element,
					wrapper = this.wrapper;

				BasePopup.prototype._destroy.call(this);

				[].forEach.call([].slice.call(wrapper.children), function(child) {
					element.appendChild(child);
				});

				wrapper.parentNode.removeChild(wrapper);

				this.wrapper = null;
				this.arrow = null;
			};

			prototype._show = function(options) {
				var openOptions = objectUtils.merge({}, options);
				this._reposition( openOptions );
				BasePopup.prototype._show.call(this, openOptions);
			};

			prototype.reposition = function(options/*{x,y,positionTo}*/) {
				if ( this.active ) {
					this._reposition( options );
				}
			};

			Popup.prototype = prototype;
			ns.widget.Popup = Popup;

			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"core"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
