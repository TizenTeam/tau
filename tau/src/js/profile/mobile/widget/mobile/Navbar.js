/*global document, window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/*jslint nomen: true, plusplus: true */
/**
 * #Navigation Bar Widget
 * Creates a navigation bar on the page
 *
 * ##HTML Examples
 * ###Create navigation bar by data-role
 *
 *		@example
 *			<div id="ns-navbar" data-role="navbar">
 *				<ul>
 *					<li><a href="a.html">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *
 *###Create navigation bar by class
 *
 *		@example
 *			<div id="ns-navbar" class="ui-navbar">
 *				<ul>
 *					<li><a href="a.html">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *
 * ##Manual constructor
 * For manual creation of navigation bar widget you can use constructor of
 * widget from **tau** namespace:
 *
 *		@example
 *			<div id="ns-navbar">
 *				<ul>
 *					<li><a href="a.html">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *			<script>
 *				var elementNavBar = document.getElementById("ns-navbar");
 *				navbar = tau.widget.NavBar(elementNavBar);
 *			</script>
 *
 * To create widget when jQuery is available use:
 *
 *		@example
 *			<div id="ns-navbar">
 *				<ul>
 *					<li><a href="a.html">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *			<script">
 *				$("#ns-navbar").navbar();
 *			</script>
 *
 * ##Options for Navigation Bar Widget
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * ###Custom icon position
 * Icons can be added to navigation bar items by adding the data-icon attribute
 * specifying a standard mobile icon to each anchor.
 * By default, icons are added above the text (data-iconpos="top").
 *
 *		@example
 *			<div data-role="navbar" data-iconpos="top">
 *				<ul>
 *					<li><a href="a.html" class="ui-btn-active ui-state-persist"
 *						data-icon="star">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *
 * ###You can change option for widget using method option
 * Initialize the navigation bar
 *
 *		@example
 *			<div id="ns-navbar">
 *				<ul>
 *					<li><a href="a.html">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *			<script>
 *				var elementNavBar = document.getElementById("ns-navbar"),
 *				navbar = tau.widget.NavBar(elementNavBar);
 *			</script>
 *
 * ### Custom icon position
 * Get or set the iconpos option, after initialization
 *
 *		@example
 *			<script>
 *				//getter
 *				navbar.option("iconpos");
 *
 *				//setter
 *				navbar.option("iconpos","left");
 *			</script>
 *
 *
 * ##Activating item in navigation bar.
 * When a link in the navigation bar is clicked it gets the active (selected)
 * state. To set the element after initialization
 * to be active is possible by adding a class **class="ui-btn-active"** to the
 * corresponding anchor.
 * Additionaly add a class of **class="ui-state-persist"** to make the
 * framework restore the active state each time
 * the page is shown while it exists in the DOM
 *
 *		@example
 *			<div data-role="navbar">
 *				<ul>
 *					<li><a href="a.html" class="ui-btn-active
 *						ui-state-persist">One</a></li>
 *					<li><a href="b.html">Two</a></li>
 *				</ul>
 *			</div>
 *
 * @class ns.widget.mobile.NavBar
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/grid",
			"../../../../core/util/selectors",
			"../../../../core/event/vmouse",
			"../mobile",
			"./Button",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				grid = ns.util.grid,
				selectors = ns.util.selectors,
				buttonActiveClass = ns.widget.mobile.Button.classes.uiBtnActive,
				slice = [].slice,
				// basic options set for navigation bar buttons
				buttonOptions = {
					corners: false,
					shadow: false,
					inline: true,
					iconpos: null,
					theme: "s"
				},
				NavBar = function () {
					/**
					 * NavBar widget options
					 * @property {Object} options NavBar widget options
					 * @property {"left"|"right"|"top"|"bottom"|null}
					 * [options.iconpos="top"] Position of the icons inside
					 * the navbar widget buttons
					 * @property {?string} [options.grid=null] Type of grid
					 * applied to the navbar items
					 * @member ns.widget.mobile.NavBar
					 */
					this.options = {
						iconpos : "top",
						grid: null
					};

					/**
					 * Stores the event handlers
					 * @property {Object} _callbacks Stores the event handlers
					 * in where the context has been defined (bind method has
					 * been applied)
					 * @property {function(NodeList, Event)}
					 * _callbacks.buttonClick vclick listener callback attached
					 * to the navigation bar
					 * @member ns.widget.mobile.NavBar
					 * @protected
					 */
					this._callbacks = {
						buttonClick: null
					};
				},
				proto = new ns.widget.mobile.BaseWidgetMobile();

			// Handler for button clicks
			// @function
			// @param {NodeList} button
			// @param {Event} event
			function vclickHandler(buttons, event) {
				var button = event.target,
					buttonIndex = buttons.indexOf(button),
					i = buttons.length;

				if (buttonIndex > -1) { // detect click on button
					while (--i >= 0) {
						if (i === buttonIndex) {
							buttons[i].classList.add(buttonActiveClass);
						} else {
							buttons[i].classList.remove(buttonActiveClass);
						}
					}
				}
			}

			/**
			 * Dictionary for NavBar css classes
			 * @property {Object} classes
			 * @property {string} [classes.uiNavbar="ui-navbar"] NavBar core
			 * @property {string} [classes.uiMini="ui-mini"] NavBar mini
			 * @member ns.widget.mobile.NavBar
			 * @static
			 * @readonly
			 */
			NavBar.classes = {
				uiNavbar: "ui-navbar",
				uiMini: "ui-mini"
			};

			/**
			 * Builds navigation bar DOM structure
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.NavBar
			 * @protected
			 */
			proto._build = function (element) {

				var navClassList = element.classList,
					classes = NavBar.classes,
					lists = element.querySelectorAll("ul"),
					buttons = element.getElementsByTagName("a"),
					i = buttons.length,
					options = this.options;

				buttonOptions.iconpos = options.iconpos;
				element.setAttribute("role", "navigation");
				navClassList.add(classes.uiNavbar);
				navClassList.add(classes.uiMini);

				while (--i >= 0) {
					engine.instanceWidget(buttons[i], "Button", buttonOptions);
				}

				i = lists.length;
				while (--i >= 0) {
					if (selectors.getParentsBySelectorNS(lists[i],
						"enhance=false").length === 0) {
						grid.makeGrid(lists[i], options.grid);
					}
				}

				return element;
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.NavBar
			 * @protected
			 */
			proto._bindEvents = function (element) {
				var buttons = element.getElementsByTagName("a"),
					buttonClick = vclickHandler.bind(null, slice.call(buttons));
				element.addEventListener("vclick", buttonClick, false);
				this._callbacks.buttonClick = buttonClick;
			};

			/**
			 * Destroy widget. Removes event listeners from the Navbar buttons.
			 * @method _destroy
			 * @member ns.widget.mobile.NavBar
			 * @protected
			 */
			proto._destroy = function () {
				var buttonClick = this._callbacks.buttonClick;
				if (buttonClick) {
					this.element.removeEventListener("vclick", buttonClick, false);
				}
			};

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Disable the navigation bar
			 *
			 * Method adds disabled attribute on navigation bar and changes
			 * look of navigation bar to disabled state.
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *		document.getElementById("ns-navbar"));
			 *		elementNavBar.disable();
			 *
			 *		// when jQuery is available:
			 *
			 *		$("#ns-navbar").navbar("disable");
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Enable the navigation bar
			 *
			 * Method removes disabled attribute on navigation bar and changes
			 * look of navigation bar to enabled state.
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *				document.getElementById("ns-navbar")
			 *			);
			 *		elementNavBar.enable();
			 *
			 *		// when jQuery is available:
			 *
			 *		$("#ns-navbar").navbar("enable");
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * The refresh method is used to refresh the widget.
			 * This method is called automatically after changing any option
			 * of widget
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *				document.getElementById("ns-navbar")
			 *			);
			 *		elementNavBar.refresh();
			 *
			 *		// when jQuery is available:
			 *
			 *		$("#ns-navbar").navbar("refresh");
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * The function "option" is not supported in this widget.
			 * This widget does not have any options.
			 *
			 * @method option
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *				document.getElementById("ns-navbar")
			 *			);
			 *		elementNavBar.trigger("eventName");
			 *
			 *		// when jQuery is available:
			 *
			 *		$("#ns-navbar").navbar("trigger", "eventName");
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event
			 * is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault
			 * on event object
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *				document.getElementById("ns-navbar")
			 *			);
			 *
			 *		elementNavBar.on("eventName", function() {
			 *			console.log("event fires");
			 *		});
			 *
			 *		// when jQuery is available:
			 *
			 *		$("#ns-navbar").navbar("on", function() {
			 *			console.log("event fires");
			 *		});
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param tu
			 * addEventListener
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *		@example
			 *		var elementNavBar = tau.widget.NavBar(
			 *		document.getElementById("ns-navbar")),
			 *			callback = function () {
			 *				console.log("event fires");
			 *		});
			 *
			 *		// add callback on event "eventName"
			 *		elementNavBar.on("eventName", callback);
			 *		// ...
			 *		// remove callback on event "eventName"
			 *		elementNavBar.off("eventName", callback);
			 *
			 *		// when jQuery is available:
			 *
			 *		// add callback on event "eventName"
			 *		$("#ns-navbar").navbar("on", callback);
			 *		// ...
			 *		// remove callback on event "eventName"
			 *		$("#ns-navbar").navbar("off", "eventName", callback);
			 *
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param tu
			 * addEventListener
			 * @member ns.widget.mobile.NavBar
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for
			 * options given in object. Keys of object are names of options and
			 * values from object are values to set.
			 *
			 * If you give only one string argument then method return value
			 * for given option.
			 *
			 * If you give two arguments and first argument will be a string
			 * then second argument will be intemperate as value to set.
			 *
			 * Options for widget can be get/set.
			 *
			 * You can change option for widget using method **option**.
			 *
			 * **Get or set the option, after initialization**
			 * Custom icon position
			 *
			 * 		@example
			 *		<script>
			 *			//getter
			 *			navbar.option( "iconpos" );
			 *
			 *			//setter
			 *			navbar.option( "iconpos", "bottom", );
			 *		</script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.NavBar
			 * @return {*} return value of option or undefined if method is
			 * called in setter context
			 */

			NavBar.prototype = proto;
			ns.widget.mobile.NavBar = NavBar;

			engine.defineWidget(
				"NavBar",
				"[data-role='navbar'], .ui-navbar",
				[],
				NavBar,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.NavBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
