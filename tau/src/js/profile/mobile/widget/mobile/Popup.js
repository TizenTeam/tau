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
 * #Popup Widget
 * Widget handles creating and managing popup windows.
 *
 * ##Default selectors
 * In default all elements with _data-role=popup_ or CSS class _.ui-popup_ are changed to Tizen WebUI popups.
 *
 * ##HTML Examples
 *
 * ###Create simple popup from div
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *		<!-- link related with popup-->
 *		<a href="#popup">Click to open popup</a>
 *
 * ###Create simple popup positioned to window
 *
 * Popup inherits value of option _positionTo_ from property _data-position-to_ set in link.
 *
 *		@example
 *		<!--definition of link, which opens popup and sets its position-->
 *		<a href="#center_info" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup, which inherites property position from link-->
 *		<div id="center_info" data-role="popup" class="center_info">
 *			<div class="ui-popup-text">
 *				<p>Pop-up dialog box, a child window that blocks user interaction to the parent windows</p>
 *			</div>
 *		</div>
 *
 * ###Create popup with title and button
 *
 *		@example
 *		<a href="#center_title_1btn">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with menu
 *
 * A menu can be created by placing listview inside a popup.
 *
 *		@example
 *		<a href="#center_liststyle_1btn">Click to open popup</a>
 *		<div id="center_liststyle_1btn" data-role="popup" class="center_liststyle_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-scroller-bg" data-scroll="y">
 *				<ul data-role="listview" data-icon="1line-textonly">
 *					<li><a href="#">List item 1</a></li>
 *					<li><a href="#">List item 2</a></li>
 *				</ul>
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Cancel</a>
 *			</div>
 *		</div>
 *
 * ###Create popup with nested menu
 *
 * A nested menu can be created by placing collapsible-set widget with listview elements.
 *
 *		@example
 *		<a href="#popupNested">Click to open popup</a>
 *		<div id="popupNested" data-role="popup">
 *			<div data-role="collapsible-set" data-collapsed-icon="arrow-r" data-expanded-icon="arrow-d">
 *				<div data-role="collapsible">
 *					<h2>First menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *				<div data-role="collapsible">
 *					<h2>Second menu</h2>
 *					<ul data-role="listview">
 *						<li><a href="#" >Item 1</a></li>
 *						<li><a href="#" >Item 2</a></li>
 *					</ul>
 *				</div>
 *			</div>
 *		</div>
 *
 * ###Create popup with form
 *
 * A form can be created by placing inputs elements inside popup.
 *
 *		@example
 *		<a href="#textbox_popup">Click to open popup</a>
 *		<div id="textbox_popup" data-role="popup" class="center_title_2btn">
 *			<div class="ui-popup-title">
 *				<h1>PopupTest<h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				<input type="text" size="20" />
 *				<input type="text" size="20" />
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" id="btn_textbox_popup_cancel" data-inline="true">Cancel</a>
 *				<a data-role="button" data-rel="back" data-inline="true">OK</a>
 *			</div>
 *		</div>
 *
 * ##Manual constructor
 * For manual creation of popup widget you can use constructor of widget:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 * ##Context popup with arrow
 *
 * If property _id_ is set in link and option _positionTo="origin"_ in popup, the context popup will be opened after clicking.
 *
 *		@example
 *		<!-- definition of link, which opens popup with id popup in context style with arrow -->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic context popup, no options set.</p>
 *		</div>
 *
 * Be award that option _positionTo_ has value "origin" in popup by default. However, the property _positionTo_ is inherited from related link and this inherited value has higher priority during opening process and overwrites the previous value. So, if we do not change it in popup and do not set value of _data-position-to_ other than "origin" in link, popup connected with link will be always opened in context style.
 *
 * To be sure that popup will be opened in context style with arrow, we can set properties _data-position-to="origin"_ as well as _id_ in the related with popup link as in the example above.
 *
 * Moreover, the same resulte can be achieve by setting only _id_ and not setting _positionTo_ in link because popup has value "origin" for option _positionTo_ by default.
 *
 *		@example
 *		<!-- in link id is set -->
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *
 * After building, the value of option _positionTo_ can be changed by using method _option_.
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option("positionTo", "origin");
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<a href="#popup" id="linkId" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// changing value of option positionTo by method option
 *			$("#popup").popup("option", "positionTo", "origin");
 *		</script>
 *
 *
 * Context popup can be created also manually for elements different than link by pushing options such as _positionTo_ and _link to method _open_.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				// open context popup
 *				var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *				// opening with options
 *				popupWidget.open({link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * If jQuery is loaded:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Click to open context popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// opening with options
 *				$("#popup").popup("open", {link: "linkId", positionTo: "origin"});
 *			});
 *		</script>
 *
 * These options can be also set globally and then method _open_ can be called without options. However, this solution can be used only for TAU API.
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set options
 *			var popupWidget = tau.widget.Popup(document.getElementById("popup"));
 *			popupWidget.option({positionTo: "origin", link: "linkId"}); // here we set positionTo and id of link, which sets placement of popup
 *
 *			// set opening popup on click event
 *			document.getElementById("linkId").addEventListener("click", function () {
 *				//if options are set, we can call method open without options
 *				popupWidget.open();
 *			});
 *		</script>
 *
 * For jQuery API, id of link has to be always added as a option:
 *
 *		@example
 *		<!-- element with no properties - popup will be opened next to it in context style manually -->
 *		<div id="linkId">Link for popup</div>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// set option positionTo
 *			$("#popup").popup("option", "positionTo", "origin");
 *
 *			// set opening popup on click event
 *			$("#linkId").on("click", function () {
 *				// for jQuery API, link has to be added as a option
 *				$("#popup").popup("open", {link: "linkId"});
 *			});
 *		</script>
 *
 *
 * ##Special classes
 *
 * There are some special CSS classes, which changes the style of popup:
 *
 *  - _center_info_ - basic pop-up message<br>
 *  - _center_title_ - pop-up message with a title<br>
 *  - _center_basic_1btn_ - pop-up message with 1 button<br>
 *  - _center_basic_2btn_ - pop-up message with 2 horizontal buttons<br>
 *  - _center_title_1btn_ - pop-up message with a title and 1 button<br>
 *  - _center_title_2btn_ - pop-up message with a title and 2 horizontal buttons<br>
 *  - _center_title_3btn_ - pop-up message with a title and 3 horizontal buttons<br>
 *  - _center_button_vertical_ - pop-up message with vertical buttons<br>
 *  - _center_checkbox_ - pop-up message with a check box<br>
 *  - _center_liststyle_1btn_ - pop-up message with a list and 1 button<br>
 *  - _center_liststyle_2btn_ - pop-up message with a list and 2 horizontal buttons<br>
 *  - _center_liststyle_3btn_ - pop-up message with a list and 3 horizontal buttons<br>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var popupElement = document.getElementById("popup"),
 *			popup = tau.widget.Popup(popupElement);
 *
 *		popup.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").popup("methodName", methodArgument1, methodArgument2, ...);
 *
 * ##Opening popup
 * There are two ways to open popup.
 *
 * ###Opening by clicking on link
 *
 * If link has _id_ of popup set as value of property _href_, then this popup will be opened after clicking on it.
 *
 *		@example
 *		<!--definition of link, which opens popup with id popup-->
 *		<a href="#popup">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * Be award that context popup with arrow will be opened if link has _id_ property set and _data-position-to="origin"_  as in this example:
 *
 *		@example
 *		<!--definition of link, which opens context popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="origin" data-role="button" data-inline="true">Click to open context popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * To open window popup, property _data-position-to="window"_ must be set in link or popup.
 *
 *		@example
 *		<!--definition of link, which opens window popup with id popup-->
 *		<a href="#popup" id="linkId" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 * ###Opening manually
 *
 * To open popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<div id="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			popup.open();
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popup = $("#popup").popup();
 *			popup.popup("open");
 *		</script>
 *
 *
 * ## Closing popup
 *
 * ###Closing by clicking on button inside
 *
 * If link inside popup has property _data-rel="back"_, then popup will be closed after clicking on it as in this example:
 *
 *		@example
 *		<a href="#center_title_1btn" data-position-to="window">Click to open popup</a>
 *		<!--definition of popup with a title and button-->
 *		<div id="center_title_1btn" data-role="popup" class="center_title_1btn">
 *			<div class="ui-popup-title">
 *				<h1>Popup title</h1>
 *			</div>
 *			<div class="ui-popup-text">
 *				Pop-up dialog box, a child window that blocks user interaction to the parent windows
 *			</div>
 *			<div class="ui-popup-button-bg">
 *				<a data-role="button" data-rel="back" data-inline="true">Button</a>
 *			</div>
 *		</div>
 *
 *
 * The selector, which causes closing on click, can be changed by setting option _closeLinkSelector_ in popup.
 *
 * ###Closing manually
 *
 * To close popup with _id_ "popup", tau namespace can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			var popupElement = document.getElementById("popup"),
 *				popup = tau.widget.Popup(popupElement);
 *			// close popup after opening
 *			popupElement.addEventListener("popupafteropen", function () {
 *				popup.close();
 *			});
 *		</script>
 *
 * If jQuery library is loaded, this method can be used:
 *
 *		@example
 *		<a href="#popup" data-position-to="window">Click to open popup</a>
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			$("#popup").on("popupafteropen", function () {
 *				$("#popup").popup("close");
 *			});
 *		</script>
 *
 * ## Handling Popup Events
 *
 * To use popup events, use the following code:
 *
 *		@example
 *		<!-- Popup html code -->
 *		<div id="popup" data-role="popup">
 *			<p>This is a completely basic popup, no options set.</p>
 *		</div>
 *
 *		<script>
 *			// Use popup events
 *			var popup = document.getElementById("popup");
 *			popup.addEventListener("popupafteropen", function() {
 *				// Implement code for popupafteropen event
 *			});
 *		</script>
 *
 * Full list of available events is in [events list section](#events-list).

 *
 * @class ns.widget.mobile.Popup
 * @extends ns.widget.BaseWidget
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Michał Szepielak <m.szepielak@samsung.com>
 */

/**
 * Triggered when process of opening popup is completed.
 * The "popupafteropen" event is triggered when the popup has completely appeared on the screen and all associated animations have completed.
 * @event popupafteropen
 * @member ns.widget.mobile.Popup
 */

/**
 * Triggered before a popup computes the coordinates where it will appear.
 * The "beforeposition" event is triggered before the popup starts the opening animations and calculates the coordinates where it will appear on the screen. Handling this event gives an opportunity to modify the content of the popup before it appears on the screen.
 * @event beforeposition
 * @member ns.widget.mobile.Popup
 */

/**
 * Triggered when the process of closing popup is completed.
 * The "popupafterclose" event is triggered when the popup has completely disappeared from the screen and all associated animations have completed.
 * @event popupafterclose
 * @member ns.widget.mobile.Popup
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/event",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/util/DOM/css",
			"../../../../core/util/deferred",
			"../../../../core/util/deferredWhen",
			"../mobile",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Popup = function () {
				var self = this;
					/**
					* @property {Object} options Object with default options
					* @property {string} [options.theme="s"] Sets the color scheme (swatch) for the popup contents.
					* @property {?string} [options.overlayTheme=""] Sets the color scheme (swatch) for the popup background, which covers the entire window.
					* @property {boolean} [options.shadow=true] Sets whether to draw a shadow around the popup.
					* @property {boolean} [options.corners=true] Sets whether to draw the popup with rounded corners.
					* @property {boolean} [options.noScreen=false] Set screen to be always hidden.
					* @property {string} [options.transition="none"] Sets the default transition for the popup.
					* @property {string} [options.positionTo="origin"] Sets the element relative to which the popup will be centered.
					* @property {Object} [options.tolerance={t: 10, r: 10, b: 10, l: 10}] Sets the minimum distance from the edge of the window for the corresponding edge of the popup.
					* @property {Array} [options.directionPriority=["bottom", "top", "right", "left"]] Sets directions of popup's placement by priority. First one has the highest priority, last the lowest.
					* @property {string} [options.closeLinkSelector="a[data-rel="back"]"] Sets selector for buttons in popup
					* @property {?string} [options.link=null] Sets id of element used as reference for relative popup placement
					* @property {boolean} [options.isHardwarePopup=false] Sets whether the popup is hardware one.
					* @property {?number} [options.positionX=null] Sets desired horizontal coordinate of the center point in popup in pixels.
					* @property {?number} [options.positionY=null] Sets desired vertical coordinate of the center point in popup in pixels.
					* @property {boolean} [options.history=false] Sets whether to alter the url when a popup is open to support the back button.
					* @member ns.widget.mobile.Popup
					*/
					self.options = {
						theme: null,
						overlayTheme: null,
						shadow: true,
						corners: true,
						noScreen: false,
						transition: "pop",
						positionTo: "origin",
						tolerance: { t: 10, r: 10, b: 10, l: 10 },
						directionPriority: ["bottom", "top", "right", "left"],
						closeLinkSelector: "a[data-rel='back']",
						link: null,
						isHardwarePopup: false,
						positionX: null,
						positionY: null,
						history: false
					};
					self.defaultOptions = {
						theme: "s"
					};
					// @property {Object} _ui Object with html elements connected with popup
					// @member ns.widget.mobile.Popup
					self._ui = {
						screen: null,
						placeholder: null,
						container: null,
						arrow: null
					};
					// @property {HTMLElement} _page Page element
					// @member ns.widget.mobile.Popup
					self._page = null;
					// @property {boolean} _isPreOpen Status of popup before animation
					// @member ns.widget.mobile.Popup
					self._isPreOpen = false;
					// @property {boolean} _isOpen Status of popup after animation
					// @member ns.widget.mobile.Popup
					self._isOpen = false;
					// @property {boolean} _isPreClose Status of popup before animation (popup starts to close)
					// @member ns.widget.mobile.Popup
					self._isPreClose = false;
					// animations
					self._prereqs = null;
					self._fallbackTransition = "";
					self._currentTransition = "none";
					// callbacks
					self._onClickBound = null;
					self._onResizeBound = null;
					self._onButtonClickBound = null;
					// @property {Function} _callback Callback for "resize" event, which sets position of widget.
					// This callback must return object with properties "x" and "y".
					// @member ns.widget.mobile.Popup
					self._callback = null;
				},
				/**
				* @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
				* @member ns.widget.mobile.Popup
				* @private
				*/
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class ns.engine
				* @member ns.widget.mobile.Popup
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class ns.selectors
				* @member ns.widget.mobile.Popup
				* @private
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Object} doms Alias for class ns.util.DOM
				* @member ns.widget.mobile.Popup
				* @private
				*/
				doms = ns.util.DOM,
				/**
				* @property {Object} themes Alias for class ns.theme
				* @member ns.widget.mobile.Popup
				* @private
				*/
				themes = ns.theme,
				/**
				* @property {Object} events Alias for class ns.event
				* @member ns.widget.mobile.Popup
				* @private
				*/
				events = ns.event,
				scrollviewClipClass = ns.widget.mobile.Scrollview.classes.clip,
				pageActiveClass = ns.widget.mobile.Page.classes.uiPageActive,
				/**
				* @property {ns.util.deferred} UtilsDeferred Alias for class ns.util.deferred
				* @member ns.widget.mobile.Popup
				* @private
				*/
				UtilsDeferred = ns.util.deferred;

			// Return window coordinates
			// @method windowCoords
			// @return {Object}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function windowCoords() {
				var body = window.body;

				return {
					x: body ? (body.scrollLeft || 0) : 0,
					y: body ? (body.scrollTop || 0) : 0,
					elementWidth: (window.innerWidth || window.width),
					elementHeight: (window.innerHeight || window.height)
				};
			}

			// Return size of segment
			// @method fitSegmentInsideSegment
			// @param {Number} winSize
			// @param {Number} segSize
			// @param {Number} offset
			// @param {Number} desired
			// @return {Number}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function fitSegmentInsideSegment(winSize, segSize, offset, desired) {
				var ret = desired;

				if (winSize < segSize) {
					// Center segment if it's bigger than the window
					ret = offset + (winSize - segSize) / 2;
				} else {
					// Otherwise center it at the desired coordinate while keeping it completely inside the window
					ret = Math.min(Math.max(offset, desired - segSize / 2), offset + winSize - segSize);
				}

				return ret;
			}


			// Return element relative to which popup must be positioned
			// @method findPositionToElement
			// @param {string} elementSelector
			// @return {HTMLElement}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function findPositionToElement(elementSelector) {
				var positionToElement = null;

				if (elementSelector) {
					if (elementSelector[0] === "#") {
						positionToElement = document.getElementById(elementSelector.slice(1));
					} else {
						positionToElement = document.querySelector(elementSelector);
					}
					// :visible - in jq (>=1.3.2) an element is visible if its browser-reported offsetWidth or offsetHeight is greater than 0
					if (positionToElement && positionToElement.offsetWidth <= 0 && positionToElement.offsetHeight <= 0) {
						positionToElement = null;
					}
				}

				return positionToElement;
			}

			// Return offset of element
			// @method getOffsetOfElement
			// @param {HTMLElement} element
			// @param {?string} link
			// @return {Object}
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function getOffsetOfElement(element, link) {
				var top = element.offsetTop,
					left = element.offsetLeft,
					scrollview;
				while (element.offsetParent) {
					top += element.offsetParent.offsetTop;
					left += element.offsetParent.offsetLeft;
					if (element.getAttribute("data-role") === "page") {
						break;
					}

					element = element.offsetParent;
				}
				if (link) {
					scrollview = selectors.getClosestByClass(document.getElementById(link), scrollviewClipClass);
					top -= scrollview ? scrollview.scrollTop : 0;
				}

				return {top: top, left: left};
			}

			// Function fires on window resizing
			// @method onResize
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function onResize(self) {
				var callback,
					options;
				if (!self._isOpen) {
					return;
				}
				if (self._callback) {
					callback = self._callback();
					self._setPosition(callback.x, callback.y);
				} else {
					options = self.options;
					self._setPosition(options.positionX, options.positionY);
				}
			}

			// Function fires on click
			// @method _eatEventAndClose
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function _eatEventAndClose(self, event) {
				event.preventDefault();
				events.stopPropagation(event);
				setTimeout(self.close.bind(self), 10);
				return false;
			}

			function removeProperties() {
				var page = document.getElementsByClassName(pageActiveClass)[0],
					tabindexElements = page ? page.querySelectorAll("[tabindex]") : null,
					hrefElements = page ? page.querySelectorAll("[href]") : null,
					value;

				if (tabindexElements) {
					tabindexElements = [].slice.call(tabindexElements);
					tabindexElements.forEach(function (tabindexElement) {
						if (selectors.getClosestBySelector(tabindexElement, "[data-role='popup']") === null) {
							value = tabindexElement.getAttribute("tabindex");
							doms.setNSData(tabindexElement, "tabindex", value);
							tabindexElement.removeAttribute("tabindex");
						}
					});
				}
				if (hrefElements) {
					hrefElements = [].slice.call(hrefElements);
					hrefElements.forEach(function (hrefElement) {
						if (selectors.getClosestBySelector(hrefElement, "[data-role='popup']") === null) {
							value = hrefElement.getAttribute("href");
							doms.setNSData(hrefElement, "href", value);
							hrefElement.removeAttribute("href");
						}
					});
				}
			}

			function restoreProperties() {
				var page = document.getElementsByClassName(ns.widget.mobile.Page.classes.uiPageActive)[0],
					tabindexElements = page ? selectors.getAllByDataNS(page, "tabindex") : null,
					hrefElements = page ? page.querySelectorAll("[href]") : null,
					value;

				if (tabindexElements) {
					selectors.getAllByDataNS(page, "tabindex").forEach(function (tabindexElement) {
						value = doms.getNSData(tabindexElement, "tabindex");
						tabindexElement.setAttribute("tabindex", value);
						doms.removeNSData(tabindexElement, "tabindex");
					});
				}
				if (hrefElements) {
					selectors.getAllByDataNS(page, "href").forEach(function (hrefElement) {
						value = doms.getNSData(hrefElement, "href");
						hrefElement.setAttribute("href", value);
						doms.removeNSData(hrefElement, "href");
					});
				}
			}

			function applyTheme(element, theme, prefix) {
				var classes = element.classList,
					classesLength = classes.length,
					currentTheme = null,
					matches,
					i,
					regex = new RegExp("^ui-" + prefix + "-([a-z]+)$");

				for (i = 0; i < classesLength; i++) {
					matches = regex.exec(classes[i]);
					if (matches && matches.length > 1) {
						currentTheme = matches[1];
						break;
					}
				}

				if (theme !== currentTheme) {
					element.classList.remove("ui-" + prefix + "-" + currentTheme);
					if (theme !== null && theme !== "none") {
						element.classList.add("ui-" + prefix + "-" + theme);
					}
				}
			}

			 // @method chooseDirectionByPriority
			 // @param {Array} directionPriority
			 // @param {Object} positionOffsets
			 // @param {Object} elementDimensions
			 // @param {Object} arrowBorderWidths
			 // @private
			 // @static
			 // @return {string}
			function chooseDirectionByPriority(directionPriority, positionOffsets, elementDimensions, arrowBorderWidths) {
				var direction,
					bestMatchingDirection,
					spaceOccupied,
					// Copy array to queue
					priorityQueue = directionPriority.slice();

				do {
					// Get get first element
					direction = priorityQueue.shift();
					if (direction) {
						if (direction === "top" || direction === "bottom") {
							spaceOccupied = elementDimensions.height;
						} else {
							spaceOccupied = elementDimensions.width;
						}

						spaceOccupied += arrowBorderWidths[direction];

						// Check if popup fits into free space
						if (spaceOccupied <= positionOffsets[direction]) {
							bestMatchingDirection = direction;
						}
					}
				// Repeat until space is found or queue is empty
				} while (!bestMatchingDirection && priorityQueue.length > 0);

				// Last matching direction has the highest priority
				return bestMatchingDirection || "bottom";
			}

			// Set events connected with animation
			// @method animationComplete
			// @param {HTMLElement} element
			// @param {Function} callback
			// @private
			// @static
			// @member ns.widget.mobile.Popup
			function animationComplete(element, callback) {
				events.one(element, "webkitAnimationEnd", callback);
				events.one(element, "animationend", callback);
			}

			// This function starts opening popup by seting global property "activePopup"
			// and calling "_open" method
			// @method startOpeningPopup
			// @param {ns.widget.mobile.Popup} instance
			// @param {Object} options opening options
			// @param {Event} event
			// @private
			// @static
			// @memberOf ns.widget.Popup
			function startOpeningPopup(instance, options, event) {
				ns.activePopup = instance;
				events.trigger(document, "activePopup", instance);
				instance._open(options, event);
			}

			Popup.prototype = new BaseWidget();

			/**
			* @property {Object} classes Dictionary for popup related css class names
			* @member ns.widget.mobile.Popup
			* @static
			*/
			Popup.classes = {
				IN: "in",
				OUT: "out",
				REVERSE: "reverse",
				SCREEN_HIDDEN: "ui-screen-hidden",
				uiPopupScreen: "ui-popup-screen",
				uiPopupContainer: "ui-popup-container",
				uiPopupWindow: "ui-popup-window",
				uiPopupWindowPadding: "ui-popupwindow-padding",
				uiCtxpopupContainer: "ui-ctxpopup-container",
				uiSelectmenuHidden: "ui-selectmenu-hidden",
				uiArrow: "ui-arrow",
				uiPopup: "ui-popup",
				top: "top",
				bottom: "bottom",
				right: "right",
				left: "left",
				uiPopupActive: "ui-popup-active",
				uiPopupOpen: "ui-popup-open",
				uiCtxpopup: "ui-ctxpopup",
				uiCornerAll: "ui-corner-all",
				uiOverlaryShadow: "ui-overlay-shadow",
				uiCtxpopupOptionmenu: "ui-ctxpopup-optionmenu",
				uiBodyPrefix: "ui-body-"
			};

			/**
			* Build structure of popup widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._build = function (element) {
				var classes = Popup.classes,
					page = selectors.getParentsByClass(element, "ui-page")[0] || document.body,
					uiScreen = document.createElement("div"),
					uiScreenClasses = uiScreen.classList,
					uiPlaceholder = document.createElement("div"),
					uiContainer = document.createElement("div"),
					uiContainerClasses = uiContainer.classList,
					uiArrow = document.createElement("div"),
					myId = element.id,
					fragment = document.createDocumentFragment();

				// init ui elements
				uiScreenClasses.add(classes.SCREEN_HIDDEN);
				uiScreenClasses.add(classes.uiPopupScreen);
				uiPlaceholder.style.display = "none";
				uiContainerClasses.add(classes.uiPopupContainer);
				uiContainerClasses.add(classes.uiSelectmenuHidden);
				uiArrow.classList.add(classes.uiArrow);

				// define the container for navigation event bindings
				// TODO this would be nice at the the mobile widget level
				//this.options.container = this.options.container || $.mobile.pageContainer;

				uiScreen.setAttribute("id", myId + "-screen");
				uiContainer.setAttribute("id", myId + "-popup");
				uiPlaceholder.setAttribute("id", myId + "-placeholder");
				uiPlaceholder.innerHTML = "<!-- placeholder for " + myId + " -->";
				uiArrow.setAttribute("id", myId + "-arrow");
				element.classList.add(classes.uiPopup);

				doms.insertNodeAfter(element, uiPlaceholder);
				uiContainer.appendChild(element);
				uiContainer.appendChild(uiArrow);
				fragment.appendChild(uiScreen);
				fragment.appendChild(uiContainer);
				page.appendChild(fragment);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._init = function (element) {
				var id = element.id,
					options = this.options,
					ui;

				// set options
				options.theme = options.theme || themes.getInheritedTheme(element, this.defaultOptions.theme);

				// @todo define instance variables
				ui = {
					screen: document.getElementById(id + "-screen"),
					placeholder: document.getElementById(id + "-placeholder"),
					container: element.parentNode,
					arrow: document.getElementById(id + "-arrow")
				};
				// if page isn't built, we choose body as page
				this._page = selectors.getParentsByClass(element, "ui-page")[0] || document.body;
				this._ui = ui;
				this._isPreOpen = false;
				this._isOpen = false;
				this._isPreClose = false;
			};

			/**
			* Set tolerance for widget's position
			* @method _setTolerance
			* @param {HTMLElement} element
			* @param {string|Array} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setTolerance = function (element, value) {
				var options = this.options,
					tolerance = options.tolerance;

				if (value) {
					if (typeof value === "string") {
						value = value.split(",");
					}
					value.forEach(function(val, index){
						value[index] = parseInt(val, 10);
					});
					switch (value.length) {
						// All values are to be the same
						case 1:
							if (!isNaN(value[0])) {
								tolerance.t = tolerance.r = tolerance.b = tolerance.l = value[0];
							}
							break;

						// The first value denotes top/bottom tolerance, and the second value denotes left/right tolerance
						case 2:
							if (!isNaN(value[0])) {
								tolerance.t = tolerance.b = value[0];
							}
							if (!isNaN(value[1])) {
								tolerance.l = tolerance.r = value[1];
							}
							break;

						// The array contains values in the order top, right, bottom, left
						case 4:
							if (!isNaN(value[0])) {
								tolerance.t = value[0];
							}
							if (!isNaN(value[1])) {
								tolerance.r = value[1];
							}
							if (!isNaN(value[2])) {
								tolerance.b = value[2];
							}
							if (!isNaN(value[3])) {
								tolerance.l = value[3];
							}
							break;

						default:
							break;
					}
				}
				options.tolerance = tolerance;
			};

			/**
			* Return desired coordinates of popup
			* @method _desiredCoords
			* @param {string|HTMLElement} positionTo
			* @param {Number} x
			* @param {Number} y
			* @return {Object}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._desiredCoords = function (positionTo, x, y) {
				var winCoords = windowCoords(),
					offset;

				if (positionTo === "window") {
					x = winCoords.elementWidth / 2 + winCoords.x;
					y = winCoords.elementHeight / 2 + winCoords.y;
				} else if (positionTo) {
					// In this case, positionTo is HTML element, to which popup is positioned
					offset = getOffsetOfElement(positionTo, this.options.link);
					x = offset.left + positionTo.offsetWidth / 2;
					y = offset.top + positionTo.offsetHeight / 2;
				}

				// Make sure x and y are valid numbers - center over the window
				if (typeof x !== "number" || isNaN(x)) {
					x = winCoords.elementWidth / 2 + winCoords.x;
				}
				if (typeof y !== "number" || isNaN(y)) {
					y = winCoords.elementHeight / 2 + winCoords.y;
				}

				return {x : x,
						y : y};
			};

			/**
			* Return placement of popup
			* @method _placementCoords
			* @param {Object} desired
			* @return {Object}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._placementCoords = function (desired) {
				// rectangle within which the popup must fit
				var uiContainer = this._ui.container,
					winCoords = windowCoords(),
					tolerance = this.options.tolerance,
					maxCoords = {
						x: tolerance.l,
						y: winCoords.y + tolerance.t,
						elementWidth: winCoords.elementWidth - tolerance.l - tolerance.r,
						elementHeight: winCoords.elementHeight - tolerance.t - tolerance.b
					},
					menuSize,
					finalCoords,
					docElement = document.documentElement,
					docBody = document.body,
					docHeight = Math.max(docElement.clientHeight, docBody.scrollHeight, docBody.offsetHeight, docElement.scrollHeight, docElement.offsetHeight);

				// Clamp the width of the menu before grabbing its size
				uiContainer.style.maxWidth = maxCoords.elementWidth;

				menuSize = {
					elementWidth: uiContainer.clientWidth,
					elementHeight: uiContainer.clientHeight
				};

				// Center the menu over the desired coordinates, while not going outside
				// the window tolerances. This will center wrt. the window if the popup is too large.
				finalCoords = {
					x: fitSegmentInsideSegment(maxCoords.elementWidth, menuSize.elementWidth, maxCoords.x, desired.x),
					y: fitSegmentInsideSegment(maxCoords.elementHeight, menuSize.elementHeight, maxCoords.y, desired.y)
				};

				// Make sure the top of the menu is visible
				finalCoords.y = Math.max(0, finalCoords.y);

				// If the height of the menu is smaller than the height of the document
				// align the bottom with the bottom of the document

				finalCoords.y -= Math.min(finalCoords.y, Math.max(0, finalCoords.y + menuSize.elementHeight - docHeight));

				if (this.options.isHardwarePopup) {
					return {
						left: tolerance.l,
						top: maxCoords.elementHeight - menuSize.elementHeight - tolerance.b,
						arrowleft: 0,
						arrowtop: 0
					};
				}
				return {left: finalCoords.x, top: finalCoords.y};
			};


			/**
			 * Set placement of arrow
			 * @method _setArrowPosition
			 * @param {number} type
			 * @param {HTMLElement} positionToElement
			 * @param {number} containerLeft container's left position
			 * @param {number} containerTop container's top position
			 * @param {Object} positionToElementOffset contains toElement offsets
			 * @return {Object}
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype._setArrowPosition = function (type, positionToElement, containerLeft, containerTop, positionToElementOffset) {
				var classes = Popup.classes,
					uiContainer = this._ui.container,
					uiContainerHeight = uiContainer.clientHeight,
					uiContainerWidth = uiContainer.clientWidth,
					popupMargin,
					arrow = this._ui.arrow,
					arrowClasses = arrow.classList,
					arrowStyle = arrow.style,
					// @TODO this will fail when not all arrow borders are the same
					arrowBorderWidth = parseInt(doms.getCSSProperty(arrow, "border-" + type + "-width"), 10) || 0,
					left = positionToElement ? getOffsetOfElement(positionToElement, this.options.link).left + positionToElement.clientWidth / 2 - arrowBorderWidth : 0,
					positionToElementHeight = positionToElement ? positionToElement.clientHeight : 0,
					positionToElementWidth = positionToElement ? positionToElement.clientWidth : 0,
					correctionValue,
					containerHeight = uiContainer.clientHeight,
					color = doms.getCSSProperty(uiContainer.firstChild, "background-color");

				arrow.removeAttribute("class");
				arrowClasses.add(classes.uiArrow);

				arrowClasses.add(classes[type]);

				arrowStyle.borderColor = "transparent";

				switch (type) {
				case "bottom":
					popupMargin = parseInt(doms.getCSSProperty(this.element, "margin-top"), 10) || 0;
					arrowClasses.add(classes.bottom);
					arrowStyle.left = left - containerLeft + "px";
					arrowStyle.top = -arrowBorderWidth * 2 + popupMargin + "px";
					arrowStyle.borderBottomColor = color;
					correctionValue = [0, positionToElementHeight + positionToElementOffset.top - containerTop];
					break;
				case "right":
					// @todo
					arrowStyle.left = -arrowBorderWidth * 2 + 1 + "px";
					arrowStyle.top = uiContainerHeight / 2 - arrowBorderWidth + "px";
					arrowStyle.borderRightColor = color;
					correctionValue = [positionToElementWidth + positionToElementOffset.left - arrowBorderWidth, 0];
					break;
				case "top":
					popupMargin = parseInt(doms.getCSSProperty(this.element, "margin-bottom"), 10) || 0;
					arrowClasses.add(classes.top);
					arrowStyle.left = left - containerLeft + "px";
					arrowStyle.top = uiContainerHeight - popupMargin + "px";
					arrowStyle.borderTopColor = color;
					correctionValue = [0, -(containerTop + containerHeight - positionToElementOffset.top)];
					break;
				case "left":
					// @todo
					arrowStyle.left = uiContainer.clientWidth + 3 + "px";
					arrowStyle.top = uiContainerHeight / 2 - arrowBorderWidth + "px";
					arrowStyle.borderLeftColor = color;
					correctionValue = [positionToElementOffset.left - uiContainerWidth, 0];
					break;
				}

				return correctionValue;

				// @todo arrow's positions (in original file, it was in _placementCoords)
				// correctionValue = [0, (positionToElement.offsetTop + positionToElement.style.height - y)];
			};

			/**
			 * Set callback, which is called on "resize" event. This callback should return desired position of popup after resizing.
			 *
			 * This function is deprecated and function setPositionCallback should be used to set this callback.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.setPositionCB(function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("setPositionCB", function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * @method setPositionCB
			 * @param {Function} callback Function called on resizing. It should return desired position of popup as object with "x" and "y" properties.
			 * @member ns.widget.mobile.Popup
			 * @deprecated 2.3
			 */
			Popup.prototype.setPositionCB = function (callback) {
				this.setPositionCallback(callback);
			};

			/**
			 * Set callback, which is called on "resize" event. This callback should return desired position of popup after resizing.
			 *
			 * This function should be used instead of "setPositionCB".
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.setPositionCallback(function() {
			 *                return {x: 10, y: 20};
			 *         });
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("setPositionCallback", function() {
			 *                return {x: 10, y: 20};
			 *          });
			 *      </script>
			 *
			 * @method setPositionCallback
			 * @param {Function} callback Function called on resizing. It should return desired position of popup as object with "x" and "y" properties.
			 * @member ns.widget.mobile.Popup
			 * @new 2.3
			 */
			Popup.prototype.setPositionCallback = function (callback) {
				this._callback = callback;
			};

			/**
			* Set position of popup
			* @method _setPosition
			* @param {number} [left]
			* @param {number} [top]
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setPosition = function (left, top) {
				var ui = this._ui,
					uiArrow = ui.arrow,
					uiContainer = ui.container,
					uiContainerStyle = uiContainer.style,
					uiContainerWidth = uiContainer.offsetWidth,
					uiContainerHeight = uiContainer.offsetHeight,
					options = this.options,
					positionToOption = options.positionTo.toLowerCase(),
					positionToElement,
					positionToElementOffset,
					docElement = document.documentElement,
					desired,
					arrowType = "top",
					positionOffsets,
					correctionValue = [0, 0],
					arrowDimensions,
					arrowBorders = {
						"border-top-width": 0,
						"border-right-width": 0,
						"border-bottom-width": 0,
						"border-left-width": 0
					},
					elementDimensions;

				doms.extractCSSProperties(uiArrow, arrowBorders);

				if (typeof top === "number" && typeof left === "number") {
					desired = {
						x: left,
						y: top
					};
				}

				if (positionToOption === "window") {
					desired = this._placementCoords(desired || this._desiredCoords(positionToOption));
					top = desired.top;
					left = desired.left;
				} else if (positionToOption === "origin") {
					// popup with arrow
					if (options.link) {
						positionToElement = findPositionToElement("#" + options.link);
					} else {
						positionToElement = null;
					}
					desired = this._placementCoords(desired || this._desiredCoords(positionToElement));
					top = desired.top;
					left = desired.left;

					if (positionToElement) {
						positionToElementOffset = getOffsetOfElement(positionToElement, options.link);
						positionOffsets = {
							"top": positionToElementOffset.top,
							"right": docElement.clientWidth - (positionToElementOffset.left + doms.getElementWidth(positionToElement)),
							"bottom": docElement.clientHeight - (positionToElementOffset.top + doms.getElementHeight(positionToElement)),
							"left": positionToElementOffset.left
						};
						elementDimensions = {
							width: uiContainerWidth,
							height: uiContainerHeight
						};
						arrowDimensions = {
							// For proper results arrow width and height are assumed to be "0"
							"top": arrowBorders["border-top-width"],
							"right": arrowBorders["border-right-width"],
							"bottom": arrowBorders["border-bottom-width"],
							"left": arrowBorders["border-left-width"]
						};
						arrowType = chooseDirectionByPriority(options.directionPriority, positionOffsets, elementDimensions, arrowDimensions);

						if (uiArrow.style.display !== "none") {
							correctionValue = this._setArrowPosition(arrowType, positionToElement, left, top, positionToElementOffset);
						}
					}
				} else {
					// position to element which matches to options.positionTo selector
					positionToElement = findPositionToElement(options.positionTo);
					desired = this._placementCoords(desired || this._desiredCoords(positionToElement));
					top = desired.top;
					left = desired.left;
				}

				uiContainerStyle.left = left + correctionValue[0] + "px";
				uiContainerStyle.top = top + correctionValue[1] + "px";
			};

			/**
			* Set context style of widget
			* @method _setContextStyle
			* @param {boolean} popupwindow
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setContextStyle = function (popupwindow) {
				var classes = Popup.classes,
					options = this.options,
					ui = this._ui,
					linkElement = options.link ? document.getElementById(options.link) : null,
					position = options.positionTo.toLowerCase(),
					containerList = ui.container.classList;

				if ((position !== "window" && linkElement && linkElement.getAttribute("data-position-to") !== "window") || options.isHardwarePopup) {
					this.element.classList.add(classes.uiCtxpopup);
					if (popupwindow) {
						containerList.add(classes.uiPopupWindow);
						this.element.classList.add(classes.uiPopupWindowPadding);
					} else {
						containerList.remove(classes.uiPopupContainer);
						containerList.add(classes.uiCtxpopupContainer);
					}
					if (position === "origin") {
						ui.arrow.style.display = "initial";
					} else {
						ui.arrow.style.display = "none";
					}
				} else {
					this._setOverlayTheme(this.element, "dim");
					ui.arrow.style.display = "none";
				}

				if (options.isHardwarePopup) {
					ui.arrow.style.display = "none";
				}
			};

			/**
			* Set overlay theme for screen
			* @method _setOverlayTheme
			* @param {HTMLElement} element
			* @param {string} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setOverlayTheme = function (element, value) {
				var classes = Popup.classes,
					screen = this._ui.screen;

				applyTheme(screen, value, "overlay");
				if (this._isOpen) {
					screen.classList.add(classes.IN);
				}
			};

			/**
			* Set type of corners
			* @method _setCorners
			* @param {boolean} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._setCorners = function (value) {
				var classes = Popup.classes;
				if (value) {
					this.element.classList.add(classes.uiCornerAll);
				} else {
					this.element.classList.remove(classes.uiCornerAll);
				}
			};

			/**
			* Set transition
			* @method _applyTransition
			* @param {string} value
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._applyTransition = function (value) {
				var self = this;

				if (self._fallbackTransition) {
					self._ui.container.classList.remove(self._fallbackTransition);
				}
				if (value && value !== "none") {
					// @todo
					// this._fallbackTransition = $.mobile._maybeDegradeTransition( value );
					self._fallbackTransition = value;
					self._ui.container.classList.add(self._fallbackTransition);
				}
			};

			/**
			* Prepare deferred objects for animation
			* @method _createPrereqs
			* @param {Function} screenPrereq
			* @param {Function} containerPrereq
			* @param {Function} whenDone
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._createPrereqs = function (screenPrereq, containerPrereq, whenDone) {
				var self = this,
					prereqs;

				// It is important to maintain both the local variable prereqs and self._prereqs. The local variable remains in
				// the closure of the functions which call the callbacks passed in. The comparison between the local variable and
				// self._prereqs is necessary, because once a function has been passed to .animationComplete() it will be called
				// next time an animation completes, even if that's not the animation whose end the function was supposed to catch
				// (for example, if an abort happens during the opening animation, the .animationComplete handler is not called for
				// that animation anymore, but the handler remains attached, so it is called the next time the popup is opened
				// - making it stale. Comparing the local variable prereqs to the widget-level variable self._prereqs ensures that
				// callbacks triggered by a stale .animationComplete will be ignored.
				prereqs = {
					screen: new UtilsDeferred(),
					container: new UtilsDeferred()
				};

				prereqs.screen.then(function () {
					if (prereqs === self._prereqs) {
						screenPrereq();
					}
				});

				prereqs.container.then(function() {
					if (prereqs === self._prereqs) {
						containerPrereq();
					}
				});

				ns.util.deferredWhen(prereqs.screen, prereqs.container).done(function() {
					if ( prereqs === self._prereqs ) {
						self._prereqs = null;
						whenDone();
					}
				});

				self._prereqs = prereqs;
			};

			/**
			* Set animation
			* @method _animate
			* @param {Object} options
			* @param {boolean} [options.additionalCondition]
			* @param {string} [options.transition]
			* @param {Array|string} [options.classToRemove]
			* @param {Array|string} [options.screenClassToAdd]
			* @param {Array|string} [options.containerClassToAdd]
			* @param {boolean} [options.applyTransition]
			* @param {Object} [options.prereqs]
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._animate = function (options) {
				var ui = this._ui,
					screenClasses = ui.screen.classList,
					container = ui.container,
					containerClasses = container.classList,
					transition = options.transition,
					classesToRemove = typeof options.classToRemove === "string" ? options.classToRemove.split(" ") : options.classToRemove,
					classesToRemoveLen = classesToRemove.length,
					classes,
					classesLen,
					i;

				for (i = 0; i < classesToRemoveLen; i++) {
					if (classesToRemove[i]) {
						screenClasses.remove(classesToRemove[i]);
					}
				}

				classes = typeof options.screenClassToAdd === "string" ? options.screenClassToAdd.split(" ") : options.screenClassToAdd;
				classesLen = classes.length;
				for (i = 0; i < classesLen; i++) {
					if (classes[i]) {
						screenClasses.add(classes[i]);
					}
				}

				options.prereqs.screen.resolve();

				if (transition && transition !== "none") {
					if (options.applyTransition) {
						this._applyTransition(transition);
					}
					animationComplete(container, options.prereqs.container.resolve);
					classes = typeof options.containerClassToAdd === "string" ? options.containerClassToAdd.split(" ") : options.containerClassToAdd;
					classesLen = classes.length;
					for (i = 0; i < classesLen; i++) {
						containerClasses.add(classes[i]);
					}
					for (i = 0; i < classesToRemoveLen; i++) {
						if (classesToRemove[i]) {
							containerClasses.remove(classesToRemove[i]);
						}
					}
				} else {
					for (i = 0; i < classesToRemoveLen; i++) {
						if (classesToRemove[i]) {
							containerClasses.remove(classesToRemove[i]);
						}
					}
					options.prereqs.container.resolve();
				}
			};

			/**
			* Animation's callback on completed opening
			* @method _openPrereqsComplete
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._openPrereqsComplete = function() {
				var self = this,
					container = self._ui.container;

				container.classList.add(Popup.classes.uiPopupActive);
				self._isOpen = true;
				self._isPreOpen = false;

				// Android appears to trigger the animation complete before the popup
				// is visible. Allowing the stack to unwind before applying focus prevents
				// the "blue flash" of element focus in android 4.0
				setTimeout(function(){
					container.setAttribute("tabindex", "0");
					container.focus();
					events.trigger(self.element, "popupafteropen");
				});
			};

			/**
			* Set popup, which will be opened
			* @method _open
			* @param {Object} options
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._open = function (options, event) {
				var element = this.element,
					position = doms.getNSData(element, "position-to"),
					classes = Popup.classes,
					savedOptions = this.options,
					elementTheme = savedOptions.theme,
					ui = this._ui,
					uiContainer = ui.container,
					uiContainerClasses = uiContainer.classList,
					linkElement,
					transition,
					top,
					left;

				this._isPreOpen = true;

				options = options || {};
				top = savedOptions.positionY = options.positionY;
				left = savedOptions.positionX = options.positionX;
				transition = options.transition || savedOptions.transition;
				options.noScreen = options.noScreen || savedOptions.noScreen;

				this._setTolerance(element, options.tolerance);

				// Give applications a chance to modify the contents of the container before it appears
				events.trigger(this.element, "beforeposition");

				if (options.link) {
					savedOptions.link = options.link;
					savedOptions.positionTo = options.positionTo || position || "origin";
				} else {
					if (event) {
						linkElement = selectors.getClosestBySelector(event.target, "[data-role='button'],input[type='button']");
						savedOptions.link =  linkElement ? linkElement.getAttribute("id") : null;
						savedOptions.positionTo = options.positionTo || position || "origin";
					}
				}

				if (element.classList.contains(classes.uiCtxpopupOptionmenu)) {
					savedOptions.isHardwarePopup = true;
				}

				this._setContextStyle(options.popupwindow || savedOptions.popupwindow);
				this._setPosition(left, top);
				this._setCorners(options.corners || savedOptions.corners);


				this._createPrereqs(function(){}, function(){}, this._openPrereqsComplete.bind(this));

				if (transition) {
					this._currentTransition = transition;
					this._applyTransition(transition);
				}

				if (elementTheme) {
					element.classList.add(classes.uiBodyPrefix + elementTheme);
				}

				if (!options.noScreen) {
					ui.screen.classList.remove(classes.SCREEN_HIDDEN);
				}
				uiContainerClasses.remove(classes.uiSelectmenuHidden);
				this._page.classList.add(classes.uiPopupOpen);

				this._animate({
					additionalCondition: true,
					transition: transition,
					classToRemove: "",
					screenClassToAdd: (options.noScreen) ? "" :  classes.IN,
					containerClassToAdd: classes.IN,
					applyTransition: false,
					prereqs: this._prereqs
				});

				// This fix problem with host keyboard
				removeProperties();
			};

			/**
			* Animation's callback on scren closing
			* @method _closePrereqScreen
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqScreen = function() {
				var classes = Popup.classes,
					screenClasses = this._ui.screen.classList;

				screenClasses.remove(classes.OUT);
				screenClasses.add(classes.SCREEN_HIDDEN);
			};

			/**
			* Animation's callback on container closing
			* @method _closePrereqContainer
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqContainer = function() {
				var classes = Popup.classes,
					container = this._ui.container,
					containerClasses = container.classList;

				containerClasses.remove(classes.REVERSE);
				containerClasses.remove(classes.OUT);
				containerClasses.add(classes.uiSelectmenuHidden);
				container.removeAttribute("style");
			};

			/**
			* Animation's callbacl on completed closing
			* @method _closePrereqsDone
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._closePrereqsDone = function() {
				var self = this,
					opts = self.options;

				self._ui.container.removeAttribute("tabindex");

				// @todo?
				// remove nav bindings if they are still present
				//opts.container.unbind( opts.closeEvents );

				// @todo?
				// unbind click handlers added when history is disabled
				//self.element.undelegate( opts.closeLinkSelector, opts.closeLinkEvents );

				ns.activePopup = null;
				// Popup's closing phase is finished
				this._isPreClose = false;
				events.trigger(document, "activePopup", null);
				events.trigger(this.element, "popupafterclose");		// this event must be triggered after setting mobile.popup.active
			};

			/**
			* Set popup, which will be closed
			* @method _close
			* @return {void}
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._close = function (immediate) {
				var classes = Popup.classes,
					ui = this._ui,
					uiContainer = ui.container,
					uiContainerClass = uiContainer.classList,
					element = this.element,
					inputs = [].slice.call(element.querySelectorAll("input"));

				uiContainerClass.remove(classes.uiPopupActive);
				this._page.classList.remove(classes.uiPopupOpen);

				this._isOpen = false;
				this._isPreOpen = false;
				// Popup is starting to close
				this._isPreClose = true;

				inputs.forEach(function(input){
					input.blur();
				});

				// Count down to triggering "popupafterclose" - we have two prerequisites:
				// 1. The popup window reverse animation completes (container())
				// 2. The screen opacity animation completes (screen())
				this._createPrereqs(
					this._closePrereqScreen.bind(this),
					this._closePrereqContainer.bind(this),
					this._closePrereqsDone.bind(this));

				this._animate( {
					additionalCondition: this._ui.screen.classList.contains("in"),
					transition: (immediate ? "none" : (this._currentTransition || this.options.transition)),
					classToRemove: classes.IN,
					screenClassToAdd: classes.OUT,
					containerClassToAdd: [classes.REVERSE, classes.OUT],
					applyTransition: true,
					prereqs: this._prereqs
				});

				restoreProperties();
			};

			/**
			 * This method opens popup.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.open();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *     @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *     <script>
			 *       $("#popup").open("open", {"noScreen" : true, "positionX" : 10});
			 *     </script>
			 *
			 * @method open
			 * @param {Object} [options]
			 * @param {boolean} [options.corners] Sets whether to draw the popup with rounded corners.
			 * @param {string} [options.positionTo="origin"] Sets the element relative to which the popup will be centered.
			 * @param {?string} [options.link=null] Sets id of element used as reference for relative popup placement.
			 * @param {Object} [options.tolerance] Sets the minimum distance from the edge of the window for the corresponding edge of the popup.
			 * @param {boolean} [options.noScreen] Set screen to be always hidden
			 * @param {string} [options.transition] Sets the default transition for the popup.
			 * @param {boolean} [options.popupwindow] Sets whether the popup has context style.
			 * @param {boolean} [options.isHardwarePopup] Sets whether the popup is hardware one.
			 * @param {?number} [options.positionX] Sets desired horizontal coordinate of the center point in popup in pixels.
			 * @param {?number} [options.positionY] Sets desired vertical coordinate of the center point in popup in pixels.
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype.open = function (options) {
				var activePopup = ns.activePopup,
					closePopup,
					event = arguments[1],
					startOpeningCallback = startOpeningPopup.bind(null, this, options, event);

				if (activePopup === this) {
					return;
				}
				// If there is an active popup, wait until active popup will close
				if (activePopup) {
					events.one(activePopup.element, "popupafterclose", startOpeningCallback);
					if (activePopup._isOpen) {
						activePopup.close();
					} else if (!activePopup._isPreClose) {
						// If popup is opening or is promised to be opened
						// close it just after opening
						closePopup = activePopup.close.bind(activePopup);
						events.one(activePopup.element, "popupafteropen", closePopup);
					}
				} else {
					startOpeningCallback();
				}
				ns.activePopup = this;
			};

			/**
			 * Close popup
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.close(true); // popup will be closed without animation
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("close");
			 *      </script>
			 *
			 * @method close
			 * @param {boolean} [immediate=false] defined if popup should be closed without animation
			 * @protected
			 * @member ns.widget.mobile.Popup
			 */
			Popup.prototype.close = function (immediate) {
				// @todo define mutex $.mobile.popup.active
				if (!ns.activePopup || !this._isOpen) {
					return;
				}

				this._close(immediate);
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._bindEvents = function () {
				var self = this,
					buttons = self.element.querySelectorAll(self.options.closeLinkSelector),
					i,
					buttonsLen = buttons.length;
				self._onClickBound = _eatEventAndClose.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._closeOnEvent = self.close.bind(self, true);
				self._destroyOnEvent = self.destroy.bind(self, self.element);

				self._ui.screen.addEventListener("vclick", self._onClickBound, true);
				window.addEventListener("throttledresize", self._onResizeBound, true);
				if (buttonsLen) {
					for (i = 0; i < buttonsLen; i++) {
						buttons[i].addEventListener("click", self._closeOnEvent, true);
					}
				}
				self._page.addEventListener("pagebeforehide", self._closeOnEvent, true);
				self._page.addEventListener("pagedestroy", self._destroyOnEvent, true);
				// @todo
				// - orientationchange
				// - resize
				// - keyup
			};

			/**
			 * Removes the popup functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.destroy();
			 *      <script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("destroy");
			 *      </script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Popup
			 */

			/**
			* Destroy popup
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._destroy = function () {
				var self = this,
					classes = Popup.classes,
					ui = self._ui,
					uiScreen = ui.screen,
					uiPlaceholder = ui.placeholder,
					page = self._page,
					element = self.element,
					elementClasses = element.classList,
					buttons = element.querySelectorAll(self.options.closeLinkSelector),
					i,
					buttonsLen = buttons.length;

				// When we destroy widget, we close it without animation
				self.close(true);

				uiScreen.removeEventListener("vclick", self._onClickBound, true);
				window.removeEventListener("throttledresize", self._onResizeBound, true);
				if (buttonsLen) {
					for (i = 0; i < buttonsLen; i++) {
						buttons[i].removeEventListener("click", self._closeOnEvent, true);
					}
				}

				page.removeEventListener("pagebeforehide", self._closeOnEvent, true);
				page.removeEventListener("pagedestroy", self._destroyOnEvent, true);

				doms.insertNodesBefore(uiPlaceholder, element);
				elementClasses.remove(classes.uiPopup);
				elementClasses.remove(classes.uiOverlaryShadow);
				elementClasses.remove(classes.uiCornerAll);
				uiPlaceholder.parentNode.removeChild(uiPlaceholder);
				ui.arrow.parentNode.removeChild(ui.arrow);
				ui.container.parentNode.removeChild(ui.container);
				uiScreen.parentNode.removeChild(uiScreen);
			};

			/**
			 * This method refreshes position of opened popup.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *
			 *          popupWidget.refresh(); // only refresh original position
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("refresh", {top: 10, left: 10}); // try to set new position for the center point of popup
			 *      </script>
			 *
			 * @method refresh
			 * @param {Object} [options] options
			 * @param {number} [options.positionX] desired horizontal coordinate of the center point in popup in pixels (it only works if both coordinates are set - top and left)
			 * @param {number} [options.positionY] desired vertical coordinate of the center point in popup in pixels (it only works if both coordinates are set - top and left)
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			* Refresh popup
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Popup
			*/
			Popup.prototype._refresh = function (options) {
				// @todo - add argument with options (positionTo should be changed, because there is problem with arrow)
				options = options || {};
				this._setPosition(options.positionX, options.positionY);
			};

			/**
			 * This method changes state of popup on enabled and removes CSS classes connected with state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.enable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("enable");
			 *      </script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * This method changes state of popup on disabled and adds CSS classes connected with state.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.disable();
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("disable");
			 *      </script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              optionValue;
			 *
			 *          optionValue = popupWidget.option("positionTo"); // read value of option positionTo
			 *          popupWidget.option("positionTo", "window") // set value
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          optionValue = $("#popup").popup("option", "positionTo");
			 *          $("#popup").popup("option", "positionTo", "window");
			 *      </script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Popup
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup"));
			 *          popupWidget.trigger("eventName");
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("trigger", "eventName");
			 *      </script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.Popup
			*/

			/**
			 * Add event listener to widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              callback = function () {
			 *                  console.log("event fires");
			 *              });
			 *
			 *          popupWidget.on("eventName", callback);
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          $("#popup").popup("on", callback);
			 *      </script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Popup
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          var popupWidget = tau.widget.Popup(document.getElementById("popup")),
			 *              callback = function () {
			 *                  console.log("event fires");
			 *              });
			 *
			 *          // add callback on event "eventName"
			 *          popupWidget.on("eventName", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          popupWidget.off("eventName", callback);
			 *      </script>
			 *
			 * If jQuery is loaded:
			 *
			 *      @example
			 *      <div id="popup" data-role="popup">
			 *          <p>This is a completely basic popup, no options set.</p>
			 *      </div>
			 *
			 *      <script>
			 *          // add callback on event "eventName"
			 *          $("#popup").popup("on", callback);
			 *          // ...
			 *          // remove callback on event "eventName"
			 *          $("#popup").popup("off", "eventName", callback);
			 *      </script>
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Popup
			 */

			ns.widget.mobile.Popup = Popup;
			engine.defineWidget(
				"Popup",
				"[data-role='popup'], .ui-popup",
				[
					"open",
					"close",
					"setPositionCallback",
					"setPositionCB"
				],
				Popup,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
