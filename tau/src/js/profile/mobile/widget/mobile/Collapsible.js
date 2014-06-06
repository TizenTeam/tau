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
/*jslint nomen: true */
/**
 * #Collapsible Widget
 * This is a simple widget that allows you to expand or collapse content when
 * tapped.
 *
 * ## Default selectors
 * All elements with _data-role="collapsible"_ or class _.ui-collapsible_ are
 * changed to collapsible widget.
 *
 * ###HTML Examples
 *
 * ####Create using data-role
 *
 *		@example
 *		<div id="collapsible" data-role="collapsible" data-inset="false">
 *			<h1>Collapsible head</h1>
 *			<div>Content</div>
 *		</div>
 *
 * ####Create using class selector
 *
 *		@example
 *		<div id="collapsible" class="ui-collapsible" data-inset="false">
 *			<h1>Collapsible head</h1>
 *			<div>Content</div>
 *		</div>
 *
 * ## Manual constructor
 * For manual creation of collapsible widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<script>
 *			var collapsibleElement = document.getElementById("collapsible"),
 *				collapsible = tau.widget.Collapsible(collapsibleElement,
 *					{mini: true});
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is
 * a object with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<script>
 *			var collapsible = $("#collapsible").collapsible({mini: true});
 *		</script>
 *
 * jQuery Mobile constructor has one optional parameter, which is **options**
 * and it is a object with options for widget.
 *
 * ##Options for Collapsible Widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var collapsibleElement = document.getElementById("collapsible"),
 *			collapsible = tau.widget.Collapsible(collapsibleElement);
 *
 *		collapsible.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").collapsible("methodName", methodArgument1, ...);
 *
 *
 * @class ns.widget.mobile.Collapsible
 * @extends ns.widget.BaseWidget
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 */
(function (document, ns) {
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
			"../mobile",
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
				/**
				 * @property {Object} BaseWidget alias variable
				 * @private
				 * @static
				 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} Button alias variable
				 * @private
				 * @static
				 */
				Button = ns.widget.mobile.Button,
				/**
				 * @property {Object} engine alias variable
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} selectors alias variable
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * @property {Object} events alias variable
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * Shortcut for slice method from Array.prototype
				 * @method slice
				 * @private
				 * @static
				 */
				slice = [].slice,
				/**
				 * @property {Object} domUtils alias variable
				 * @private
				 * @static
				 */
				domUtils = ns.util.DOM,
				/**
				 * @property {Object} themes alias variable
				 * @private
				 * @static
				 */
				themes = ns.theme,
				/**
				 * Local constructor function
				 * @method Collapsible
				 * @private
				 * @member ns.widget.mobile.Collapsible
				 */
				Collapsible = function () {
					/**
					 * Collapsible widget options.
					 * @property {Object} options
					 * @property {string} [options.expandCueText=" Expandable list, tap to open list"] This text is used to provide audible feedback that
					 * list is expanded for users with screen reader software.
					 * @property {string} [options.collapseCueText=" Expandable list, tap to close list"] This text is used to provide audible feedback that
					 * list is collapsed for users with screen reader software.
					 * @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load
					 * @property {string} [options.heading="h1,h2,h3,h4,h5,h6,legend,li"] Within the collapsible container, the first immediate child element
					 * that matches this selector will be used as the header for the collapsible.
					 * @property {?string} [options.theme=null] Sets the color scheme (swatch) for the collapsible. `{@link ns.widget.mobile.Collapsible#defaultOptions}.theme`
					 * This value is used when .theme option isn't on element itself and on it's parents
					 * @property {?string} [options.contentTheme=null] widget content theme
					 * @property {?string} [options.collapsedIcon=null] Icon for collapsed widget, `{@link ns.widget.mobile.Collapsible#defaultOptions}.collapsedIcon`
					 * value is used when collapsible is not in a collapsible-set or option isn't set
					 * @property {?string} [options.expandedIcon=null] Icon for expanded widget, `{@link ns.widget.mobile.Collapsible#defaultOptions}.expandedIcon`
					 * value is used when collapsible is not in a collapsible-set or option isn't set
					 * @property {?string} [options.iconpos=null] Icon position, `{@link ns.widget.mobile.Collapsible#defaultOptions}.iconPos`
					 * value is used when collapsible is not in a collapsible-set or option isn't set
					 * @property {boolean} [options.inset=true] Determines if widget should be shown as inset
					 * @property {boolean} [options.mini=false] Sets widget to mini version
					 * @member ns.widget.mobile.Collapsible
					 */
					this.options = {
						expandCueText: " Expandable list, tap to open list",
						collapseCueText: " Expandable list, tap to close list",
						collapsed: true,
						heading: "h1,h2,h3,h4,h5,h6,legend,li",
						theme: null,
						contentTheme: null,
						collapsedIcon: null,
						expandedIcon: null,
						iconpos: null,
						inset: false,
						mini: false
					};
					// theme, collapsedIcon, expandedIcon, iconpos set as null
					// because they may be overriden with collapsible-set options

					this._eventHandlers = {};
				};

			Collapsible.prototype = new BaseWidget();

			/**
			 * Default options for settings of collapsible widget
			 * @property {Object} defaultOptions
			 * @property {string} defaultOptions.theme="s"
			 * @property {string} defaultOptions.collapsedIcon="arrow-u"
			 * @property {string} defaultOptions.expandedIcon="arrow-d"
			 * @property {string} defaultOptions.iconpos="right"
			 * @static
			 * @readonly
			 * @member ns.widget.mobile.Collapsible
			 */
			Collapsible.defaultOptions = {
				theme: "s",
				collapsedIcon: "arrow-u",
				expandedIcon: "arrow-d",
				iconpos: "right"
			};

			/**
			 * Dictionary object containing commonly used wiget classes
			 * @property {Object} classes
			 * @readonly
			 * @static
			 * @member ns.widget.mobile.Collapsible
			 */
			Collapsible.classes = {
				uiCollapsible: "ui-collapsible",
				uiCollapsibleContent: "ui-collapsible-content",
				uiCollapsibleContentCollapsed: "ui-collapsible-content-collapsed",
				uiCollapsibleCollapsed: "ui-collapsible-collapsed",
				uiCollapsibleInset: "ui-collapsible-inset",
				uiCollapsibleHeading: "ui-collapsible-heading",
				uiCollapsibleHeadingCollapsed: "ui-collapsible-heading-collapsed",
				uiCollapsibleHeadingStatus: "ui-collapsible-heading-status",
				uiCollapsibleHeadingToggle: "ui-collapsible-heading-toggle",
				uiCornerTop: "ui-corner-top",
				uiCornerBottom: "ui-corner-bottom",
				uiIcon: "ui-icon",
				// Prefixes
				uiBodyPrefix: "ui-body-",
				uiIconPrefix: "ui-icon-"
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Collapsible
			 */
			Collapsible.prototype._build = function (element) {
				var classes = Collapsible.classes,
					defaults = Collapsible.defaultOptions,
					options = this.options,
					elementClassList = element.classList,
					header,
					headerLink,
					headerLinkClassList,
					headerStatus,
					btnInner,
					btnInnerClassList,
					content,
					alterHeader,
					parentCollapsibleSet = selectors.getClosestBySelector(element, "[data-role='collapsible-set']"),
					getDataFromParentSet = domUtils.getNSData.bind(null, parentCollapsibleSet);

				elementClassList.add(classes.uiCollapsible);

				// First child matching selector is collapsible header
				header = selectors.getChildrenBySelector(element, options.heading)[0];
				if (!header) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("[collapsible widget] no elements matching heading selector found");
					//>>excludeEnd("tauDebug");
					header = document.createElement("h1");
					element.appendChild(header);
				}

				if (header.tagName.toLowerCase() === "legend") {
					alterHeader = document.createElement("div");
					alterHeader.setAttribute("role", "heading");
					alterHeader.innerHTML = header.innerHTML;

					element.replaceChild(alterHeader, header);
					header = alterHeader;
				}
				header.classList.add(classes.uiCollapsibleHeading);

				// Wrap all widget content
				domUtils.wrapInHTML(element.childNodes, "<div class='" + classes.uiCollapsibleContent + "'></div>");

				// Move header out
				header = element.insertBefore(header, element.firstChild);
				// .. and set reference to content
				content = header.nextElementSibling;

				if (parentCollapsibleSet) {
					// If set theme from parent set or closest element and if everything is empty set default
					if (!options.theme) {
						options.theme = getDataFromParentSet("theme") || themes.getInheritedTheme(element) || defaults.theme;
					}

					if (!options.contentTheme) {
						options.contentTheme = getDataFromParentSet("content-theme");
					}
					//Get the preference for collapsed icon in the set
					if (!options.collapsedIcon) {
						options.collapsedIcon = getDataFromParentSet("collapsed-icon");
					}
					// Get the preference for expanded icon in the set
					if (!options.expandedIcon) {
						options.expandedIcon = getDataFromParentSet("expanded-icon");
					}
					// Gets the preference icon position in the set
					if (!options.iconpos) {
						options.iconpos = getDataFromParentSet("iconpos");
					}
					// Inherit the preference for inset from collapsible-set
					if (getDataFromParentSet("inset") !== undefined) {
						options.inset = getDataFromParentSet("inset");
					}
					// Gets the preference for mini in the set
					if (!options.mini) {
						options.mini = getDataFromParentSet("mini");
					}
				} else {
					if (!options.theme) {
						options.theme = themes.getInheritedTheme(element) || defaults.theme;
					}
				}

				if (options.contentTheme) {
					content.classList.add(classes.uiBodyPrefix + options.contentTheme);
				}

				// Based on value from:
				// elements data-collapsed-icon or passed options
				// [-> collapsible-set data-collapsed-icon]
				// -> defaultValue
				options.collapsedIcon = options.collapsedIcon || defaults.collapsedIcon;
				// Based on value from:
				// elements data-expanded-icon or passed options
				// [-> collapsible-set data-collapsed-icon]
				// -> defaultValue
				options.expandedIcon = options.expandedIcon || defaults.expandedIcon;

				options.iconpos = options.iconpos || defaults.iconpos;

				headerStatus = document.createElement("span");
				headerStatus.classList.add(classes.uiCollapsibleHeadingStatus);

				header.appendChild(headerStatus);

				domUtils.wrapInHTML(header.childNodes, "<a href='#' class='" + classes.uiCollapsibleHeadingToggle + "'></a>");
				headerLink = header.firstElementChild;
				headerLinkClassList = headerLink.classList;

				// Make headerLink button-like
				engine.instanceWidget(headerLink, "Button", {
					shadow: false,
					corners: false,
					iconpos: options.iconpos,
					icon: options.collapsedIcon,
					mini: options.mini,
					theme: options.theme
				});

				headerLink.removeAttribute("role");

				// Append everything to header
				header.appendChild(headerLink);

				if (options.inset) {
					elementClassList.add(classes.uiCollapsibleInset);

					headerLinkClassList.add(classes.uiCornerTop);
					headerLinkClassList.add(classes.uiCornerBottom);

					btnInner = headerLink.firstElementChild;
					if (btnInner) {
						btnInnerClassList = btnInner.classList;
						btnInnerClassList.add(classes.uiCornerTop);
						btnInnerClassList.add(classes.uiCornerBottom);
					}
				}

				Collapsible.prototype.options = options;

				return element;
			};

			// Handler function for expanding/collapsing widget
			// @method toggleCollapsibleHandler
			// @param {HTMLElement} element
			// @param {Object} options
			// @param {Event} event
			// @private
			function toggleCollapsibleHandler(element, options, event) {
				var elementClassList = element.classList,
					classes = Collapsible.classes,
					header = selectors.getChildrenByClass(element, classes.uiCollapsibleHeading)[0],
					headerClassList = header.classList,
					headerStatus = header.querySelector("." + classes.uiCollapsibleHeadingStatus),
					headerIcon = header.querySelector("." + classes.uiIcon),
					headerIconClassList = headerIcon.classList,
					headerLink = header.firstElementChild,
					content = selectors.getChildrenByClass(element, classes.uiCollapsibleContent)[0],
					parentCollapsibleSet = selectors.getClosestBySelector(element, "[data-role='collapsible-set']"),
					isCollapse = event.type === "collapse";

				if (event.defaultPrevented) {
					return;
				}

				event.preventDefault();

				// @TODO customEventHandler or max-height from WebUI
				// is defined inside of themes/tizen/tizen-white/theme.js and themes/tizen/tizen-black/theme.js
				// those handlers set max-height property
				//if (options.customEventHandler) {
				//	options.customEventHandler.call(element, isCollapse);
				//}

				//Toggle functions switched to if/else statement due to toggle bug on Tizen
				if (isCollapse) {
					headerClassList.add(classes.uiCollapsibleHeadingCollapsed);
					headerIconClassList.remove(classes.uiIconPrefix + options.expandedIcon);
					headerIconClassList.add(classes.uiIconPrefix + options.collapsedIcon);
					elementClassList.add(classes.uiCollapsibleCollapsed);
					content.classList.add(classes.uiCollapsibleContentCollapsed);
				} else {
					headerClassList.remove(classes.uiCollapsibleHeadingCollapsed);
					headerIconClassList.add(classes.uiIconPrefix + options.expandedIcon);
					headerIconClassList.remove(classes.uiIconPrefix + options.collapsedIcon);
					elementClassList.remove(classes.uiCollapsibleCollapsed);
					content.classList.remove(classes.uiCollapsibleContentCollapsed);
				}

				headerStatus.innerHTML = isCollapse ? options.expandCueText : options.collapseCueText;

				if(options.expandedIcon === options.collapsedIcon) {
					headerIconClassList.add(classes.uiIconPrefix + options.collapsedIcon);
				}

				content.setAttribute("aria-hidden", isCollapse);

				if (options.contentTheme && options.inset && (!parentCollapsibleSet || domUtils.getNSData(element, "collapsible-last"))) {
					slice.call(header.querySelectorAll("." + Button.classes.uiBtnInner)).forEach(function (value) {

						if (isCollapse) {
							value.classList.add(classes.uiCornerBottom);
						} else {
							value.classList.remove(classes.uiCornerBottom);
						}
					});

					if (isCollapse) {
						headerLink.classList.add(classes.uiCornerBottom);
						content.classList.remove(classes.uiCornerBottom);
					} else {
						headerLink.classList.remove(classes.uiCornerBottom);
						content.classList.add(classes.uiCornerBottom);
					}
				}

				// @TODO ?
				//content.trigger( "updatelayout" );
				events.trigger(element, isCollapse ? "collapsed" : "expanded");
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Collapsible
			 */
			Collapsible.prototype._bindEvents = function (element) {
				var classes = Collapsible.classes,
					options = this.options,
					eventHandlers = this._eventHandlers,
					toggleHandler,
					removeActiveClass,
					header = selectors.getChildrenByClass(element, classes.uiCollapsibleHeading)[0],
					setActiveHeaderLinkClass = function (setClass) {
						var link = header.querySelector("a");
						// @todo change to method called on button object
						if (setClass) {
							link.classList.add(Button.classes.uiBtnActive);
						} else {
							link.classList.remove(Button.classes.uiBtnActive);
						}
					};

				// Declare handlers with and assign them to local variables
				toggleHandler = eventHandlers.toggleHandler = toggleCollapsibleHandler.bind(null, element, options);
				removeActiveClass = eventHandlers.removeActiveClass = setActiveHeaderLinkClass.bind(null, false);
				eventHandlers.addActiveClass = setActiveHeaderLinkClass.bind(null, true);
				eventHandlers.toggleCollapsiness = function toggleCollapsiness(event) {
					var eventType = header.classList.contains(classes.uiCollapsibleHeadingCollapsed) ? "expand" : "collapse";

					events.trigger(element, eventType);

					event.preventDefault();
					events.stopPropagation(event);
				};

				// Handle "expand" and "collapse" events
				element.addEventListener("expand", toggleHandler, false);
				element.addEventListener("collapse", toggleHandler, false);

				// Handle "vmousedown" event (this event is triggered with "touchstart" too)
				header.addEventListener("vmousedown", eventHandlers.addActiveClass, false);

				// Handle "vmousemove", "vmousecancel" and "vmouseup" events
				header.addEventListener("vmousemove", removeActiveClass, false);
				header.addEventListener("vmousecancel", removeActiveClass, false);
				header.addEventListener("vmouseup", removeActiveClass, false);

				// Handle touching and clicking
				header.addEventListener("vclick", eventHandlers.toggleCollapsiness, false);

				events.trigger(element, options.collapsed ? "collapse" : "expand");
			};

			/**
			 * This method refreshes collapsible.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.refresh();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("refresh");
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.Collapsible
			 */

			/**
			* Refresh structure
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.Collapsible
			*/
			Collapsible.prototype._refresh = function () {
				return;
			};

			/**
			 * Removes the collapsible functionality completely.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.destroy();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("destroy");
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Collapsible
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Collapsible
			 */
			Collapsible.prototype._destroy = function () {
				var element = this.element,
					header = selectors.getChildrenByClass(element, Collapsible.classes.uiCollapsibleHeading)[0],
					eventHandlers = this._eventHandlers,
					toggleHandler = eventHandlers.toggleHandler,
					removeActiveClassHandler = eventHandlers.removeActiveClass,
					parentNode = element.parentNode;

				// Remove "expand" and "collapse" listeners
				element.removeEventListener("expand", toggleHandler, false);
				element.removeEventListener("collapse", toggleHandler, false);

				// Remove "vmousedown" event (this event is triggered with "touchstart" too) listeners
				header.removeEventListener("vmousedown", eventHandlers.addActiveClass, false);

				// Remove "vmousemove", "vmousecancel" and "vmouseup" events listeners
				header.removeEventListener("vmousemove", removeActiveClassHandler, false);
				header.removeEventListener("vmousecancel", removeActiveClassHandler, false);
				header.removeEventListener("vmouseup", removeActiveClassHandler, false);

				// Remove touching and clicking event listeners
				header.removeEventListener("vclick", eventHandlers.toggleCollapsiness, false);

				// @TODO remove all operations performed on _build
				// maybe store base structure inside element's object property as string
				// instead of reversing all operations?

				events.trigger(document, "destroyed", {
					widget: "Collapsible",
					parent: parentNode
				});
			};

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
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible")),
			 *				value;
			 *
			 *			value = collapsibleWidget.option("mini"); // get value
			 *			collapsibleWidget.option("mini", true); // set value
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var value;
			 *
			 *			value = $("#collapsible").collapsible("option", "mini"); // get value
			 *			$("#collapsible").collapsible("option", "mini", true); // set value
			 *		</script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Collapsible
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.FieldContain
			 */

			/**
			 * Disable the collapsible
			 *
			 * Method adds disabled attribute on collapsible and adds classes
			 * related with disabled state.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.disable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("disable");
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Collapsible
			 */

			/**
			 * Enable the collapsible
			 *
			 * Method removes disabled attribute on collapsible and adds
			 * classes related with enabled state.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.enable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("enable");
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Collapsible
			 */

			/*
			 * Trigger an event on widget's element.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.trigger("eventName");
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("trigger", "eventName");
			 *		</script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.Collapsible
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible"));
			 *			collapsibleWidget.on("eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsible").collapsible("on", "eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.Collapsible
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsibleWidget = tau.widget.Collapsible(document.getElementById("collapsible")),
			 *				callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			collapsibleWidget.on("eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			collapsibleWidget.off("eventName", callback);
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsible" data-role="collapsible" data-inset="false">
			 *			<h6>Collapsible head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			$("#collapsible").collapsible("on", "eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			$("#collapsible").collapsible("off", "eventName", callback);
			 *		</script>
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.Collapsible
			 */

			// definition
			ns.widget.mobile.Collapsible = Collapsible;
			engine.defineWidget(
				"Collapsible",
				"[data-role='collapsible'], .ui-collapsible",
				[],
				Collapsible,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Collapsible;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
