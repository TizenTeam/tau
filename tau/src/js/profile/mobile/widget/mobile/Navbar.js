/*global document, window, define, ns */
/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * #Navbar Widget
 *
 * To create navbar using engine methods use:
 *
 *		@example
 *
 *		var navbar = ns.engine.instanceWidget(document.getElementById("navbar-test"), "Navbar");
 *
 * To create widget when jquery is available use:
 *
 *		@example
 *
 *		var navbar = $("#navbar-test").navbar();
 *
 * To create widget by HTML markup creation write:
 *
 *		@example
 *
 *		<div id="navbar-test" data-role="navbar">
 *			<ul>
 *				<li><a href="a.html">One</a></li>
 *				<li><a href="b.html">Two</a></li>
 *			</ul>
 *		</div>
 *
 * @class ns.widget.Navbar
 * @extends ns.widget.BaseWidget
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
			"../../../../core/utils/grid",
			"../../../../core/utils/selectors",
			"../../../../core/event/vmouse",
			"../mobile",
			"./Button",
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				grid = ns.utils.grid,
				selectors = ns.utils.selectors,
				buttonActiveClass = ns.widget.mobile.Button.classes.uiBtnActive,
				slice = [].slice,
				// basic options set for navbar buttons
				buttonOptions = {
					corners: false,
					shadow: false,
					inline: true,
					iconpos: null,
					theme: 's'
				},
				Navbar = function () {
					/**
					* @property {Object} options Navbar widget options
					* @property {string} [options.iconpos='top'] Position of the icons inside the navbar widget buttons
					* @property {(string|null)} [options.grid=null] Type of grid applied to the navbar items
					* @member ns.widget.Navbar
					*/
					this.options = {
						iconpos : 'top',
						grid: null
					};

					/**
					* @property {Object} _callbacks Stores the event handlers in where the context has been defined (bind method has been applied)
					* @property {function(NodeList, Event)} _callbacks.buttonClick vclick listener callback attached to the navbar
					* @member ns.widget.Navbar
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
			* @property {Object} classes
			* @property {string} [classes.uiNavbar='ui-navbar'] Navbar core class
			* @property {string} [classes.uiMini='ui-mini'] Navbar mini class
			* @member ns.widget.Navbar
			* @static
			* @readonly
			*/
			Navbar.classes = {
				uiNavbar: 'ui-navbar',
				uiMini: 'ui-mini'
			};

			/**
			* Builds navbar DOM structure
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Navbar
			* @protected
			* @instance
			*/
			proto._build = function (element) {

				var navClassList = element.classList,
					classes = Navbar.classes,
					lists = element.querySelectorAll('ul'),
					buttons = element.getElementsByTagName('a'),
					i = buttons.length,
					options = this.options;

				buttonOptions.iconpos = options.iconpos;
				element.setAttribute('role', 'navigation');
				navClassList.add(classes.uiNavbar);
				navClassList.add(classes.uiMini);

				while (--i >= 0) {
					engine.instanceWidget(buttons[i], 'Button', buttonOptions);
				}

				i = lists.length;
				while (--i >= 0) {
					if (selectors.getParentsBySelectorNS(lists[i], 'enhance=false').length === 0) {
						grid.makeGrid(lists[i], options.grid);
					}
				}

				return element;
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @member ns.widget.Navbar
			* @protected
			* @instance
			*/
			proto._bindEvents = function (element) {
				var buttons = element.getElementsByTagName('a'),
					buttonClick = vclickHandler.bind(null, slice.call(buttons));
				element.addEventListener("vclick", buttonClick, false);
				this._callbacks.buttonClick = buttonClick;
			};

			/**
			* Destroy widget. Removes event listeners from the Navbar buttons.
			* @method _destroy
			* @member ns.widget.Navbar
			* @instance
			* @protected
			*/
			proto._destroy = function () {
				var buttonClick = this._callbacks.buttonClick;
				if (buttonClick) {
					this.element.removeEventListener("vclick", buttonClick, false);
				}
			};

			Navbar.prototype = proto;
			ns.widget.mobile.Navbar = Navbar;

			engine.defineWidget(
				'Navbar',
				'[data-role="navbar"], .ui-navbar',
				[],
				Navbar,
				'mobile'
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Navbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
