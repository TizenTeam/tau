/*global window, define, ns */
/*
* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
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
 * ####Create collapsible div using data-role
 *
 *		@example
 *		<div id="collapsible" data-role="collapsible">
 *			<h1>Collapsible head</h1>
 *			<div>Content</div>
 *		</div>
 *
 * ####Create collapsible list using data-role
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="collapsible">
 *				<h2>Collapsible head</h2>
 *				<-- sub list -->
 *				<ul data-role="listview">
 *					<li>sub list item1</li>
 *					<li>sub list item2</li>
 *				</ul>
 *			</li>
 *		</ul>
 *
 * ####Create using class selector
 *
 *		@example
 *		<div id="collapsible" class="ui-collapsible">
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
 *		var groupIndexElement = document.getElementById("groupIndex"),
 *			groupIndex = tau.widget.GroupIndex(groupIndexElement);
 *
 *		groupIndex.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").GroupIndex("methodName", methodArgument1, ...);
 *
 *
 * @class ns.widget.mobile.GroupIndex
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
			"../../../../core/widget/core/Button",
			"../mobile",
			"./BaseWidgetMobile"
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
				 * @property {Object} domUtils alias variable
				 * @private
				 * @static
				 */
				domUtils = ns.util.DOM,
				/**
				 * Local constructor function
				 * @method GroupIndex
				 * @private
				 * @member ns.widget.mobile.GroupIndex
				 */
				GroupIndex = function () {
					/**
					 * GroupIndex widget options.
					 * @property {Object} options
					 * @property {string} [options.expandCueText=" Expandable list, tap to open list"] This text is used to provide audible feedback that
					 * list is expanded for users with screen reader software.
					 * @property {string} [options.collapseCueText=" Expandable list, tap to close list"] This text is used to provide audible feedback that
					 * list is collapsed for users with screen reader software.
					 * @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load
					 * @property {string} [options.heading="h1,h2,h3,h4,h5,h6,legend,li"] Within the GroupIndex container, the first immediate child element
					 * that matches this selector will be used as the header for the GroupIndex.
					 * @property {?string} [options.theme=null] Sets the color scheme (swatch) for the GroupIndex. `{@link ns.widget.mobile.GroupIndex#defaultOptions}.theme`
					 * This value is used when .theme option isn't on element itself and on it's parents
					 * @property {?string} [options.contentTheme=null] widget content theme
					 * @property {?string} [options.collapsedIcon=null] Icon for collapsed widget, `{@link ns.widget.mobile.GroupIndex#defaultOptions}.collapsedIcon`
					 * value is used when GroupIndex is not in a GroupIndex-set or option isn't set
					 * @property {?string} [options.expandedIcon=null] Icon for expanded widget, `{@link ns.widget.mobile.GroupIndex#defaultOptions}.expandedIcon`
					 * value is used when GroupIndex is not in a GroupIndex-set or option isn't set
					 * @property {?string} [options.iconpos=null] Icon position, `{@link ns.widget.mobile.GroupIndex#defaultOptions}.iconPos`
					 * value is used when GroupIndex is not in a GroupIndex-set or option isn't set
					 * @property {boolean} [options.mini=false] Sets widget to mini version
					 * @member ns.widget.mobile.GroupIndex
					 */
					this.options = {
						collapsed: true,
						heading: "h1,h2,h3,h4,h5,h6,legend,li"
					};
					// theme, collapsedIcon, expandedIcon, iconpos set as null
					// because they may be overriden with GroupIndex-set options

					this._eventHandlers = {};
				},
				/**
				 * Dictionary object containing commonly used wiget classes
				 * @property {Object} classes
				 * @readonly
				 * @static
				 * @member ns.widget.mobile.GroupIndex
				 */
				classes = {
					uiGroupIndex: "ui-group-index",
					uiGroupIndexContent: "ui-group-index-content",
					uiGroupIndexContentCollapsed: "ui-group-index-content-collapsed",
					uiGroupIndexCollapsed: "ui-group-index-collapsed",
					uiGroupIndexHeading: "ui-group-index-heading",
					uiGroupIndexHeadingCollapsed: "ui-group-index-heading-collapsed",
					uiGroupIndexHeadingStatus: "ui-group-index-heading-status",
					uiGroupIndexHeadingToggle: "ui-group-index-heading-toggle",
					uiLiActive: "ui-li-active"
				};


			GroupIndex.prototype = new BaseWidget();

			GroupIndex.classes = classes;

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.GroupIndex
			 */
			GroupIndex.prototype._build = function (element) {
				var options = this.options,
					elementClassList = element.classList,
					header,
					headerLink,
					headerStatus,
					alterHeader;

				if ((element.parentNode.tagName.toLowerCase() === "ul") && (element.tagName.toLowerCase() === "div")) {
					ns.warn("Don't make the GroupIndex list using <div>. It violates standard of HTML rule. Instead of, please use <li>.");
				}
				elementClassList.add(classes.uiGroupIndex);

				// First child matching selector is GroupIndex header
				header = selectors.getChildrenBySelector(element, options.heading)[0];
				if (!header) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("[GroupIndex widget] no elements matching heading selector found");
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
				header.classList.add(classes.uiGroupIndexHeading);

				// Wrap all widget content
				domUtils.wrapInHTML(element.childNodes, "<div class='" + classes.uiGroupIndexContent + "'></div>");

				// Move header out
				header = element.insertBefore(header, element.firstChild);

				// Based on value from:
				headerStatus = document.createElement("span");
				headerStatus.classList.add(classes.uiGroupIndexHeadingStatus);

				header.appendChild(headerStatus);

				domUtils.wrapInHTML(header.childNodes, "<a class='" + classes.uiGroupIndexHeadingToggle + "'></a>");
				headerLink = header.firstElementChild;

				headerLink.removeAttribute("role");

				// Append everything to header
				header.appendChild(headerLink);

				GroupIndex.prototype.options = options;

				return element;
			};

			// Handler function for expanding/collapsing widget
			// @method toggleGroupIndexHandler
			// @param {HTMLElement} element
			// @param {Object} options
			// @param {Event} event
			// @private
			function toggleGroupIndexHandler(element, event) {
				var elementClassList = element.classList,
					header = selectors.getChildrenByClass(element, classes.uiGroupIndexHeading)[0],
					headerClassList = header.classList,
					content = selectors.getChildrenByClass(element, classes.uiGroupIndexContent)[0],
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
					headerClassList.add(classes.uiGroupIndexHeadingCollapsed);
					elementClassList.add(classes.uiGroupIndexCollapsed);
					content.classList.add(classes.uiGroupIndexContentCollapsed);
				} else {
					headerClassList.remove(classes.uiGroupIndexHeadingCollapsed);
					elementClassList.remove(classes.uiGroupIndexCollapsed);
					content.classList.remove(classes.uiGroupIndexContentCollapsed);
				}

				content.setAttribute("aria-hidden", isCollapse);

				// @TODO ?
				//content.trigger( "updatelayout" );
				events.trigger(element, isCollapse ? "collapsed" : "expanded");
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.GroupIndex
			 */
			GroupIndex.prototype._bindEvents = function (element) {
				var options = this.options,
					eventHandlers = this._eventHandlers,
					toggleHandler,
					removeActiveClass,
					header = selectors.getChildrenByClass(element, classes.uiGroupIndexHeading)[0],
					setActiveHeaderLinkClass = function (setClass) {
						var headerClassList = header.classList;

						if (setClass) {
							headerClassList.add(classes.uiLiActive);
						} else {
							headerClassList.remove(classes.uiLiActive);
						}
					};

				// Declare handlers with and assign them to local variables
				toggleHandler = eventHandlers.toggleHandler = toggleGroupIndexHandler.bind(null, element);
				removeActiveClass = eventHandlers.removeActiveClass = setActiveHeaderLinkClass.bind(null, false);
				eventHandlers.addActiveClass = setActiveHeaderLinkClass.bind(null, true);
				eventHandlers.toggleCollapsiness = function toggleCollapsiness(event) {
					var eventType = header.classList.contains(classes.uiGroupIndexHeadingCollapsed) ? "expand" : "collapse";

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
			 * This method refreshes GroupIndex.
			 *
			 *		@example
			 *		<div id="GroupIndex" data-role="groupindex">
			 *			<h6>GroupIndex head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var GroupIndexWidget = tau.widget.GroupIndex(document.getElementById("GroupIndex"));
			 *			GroupIndexWidget.refresh();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="GroupIndex" data-role="groupindex">
			 *			<h6>GroupIndex head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#GroupIndex").GroupIndex("refresh");
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.GroupIndex
			 */

			/**
			* Refresh structure
			* @method _refresh
			* @protected
			* @member ns.widget.mobile.GroupIndex
			*/
			GroupIndex.prototype._refresh = function () {
				return;
			};

			/**
			 * Removes the GroupIndex functionality completely.
			 *
			 *		@example
			 *		<div id="GroupIndex" data-role="groupindex">
			 *			<h6>GroupIndex head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			var GroupIndexWidget = tau.widget.GroupIndex(document.getElementById("GroupIndex"));
			 *			GroupIndexWidget.destroy();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="GroupIndex" data-role="groupindex">
			 *			<h6>GroupIndex head</h6>
			 *			<div>Content</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#GroupIndex").GroupIndex("destroy");
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.GroupIndex
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.GroupIndex
			 */
			GroupIndex.prototype._destroy = function () {
				var element = this.element,
					header = selectors.getChildrenByClass(element, classes.uiGroupIndexHeading)[0],
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
					widget: "GroupIndex",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.GroupIndex = GroupIndex;
			engine.defineWidget(
				"GroupIndex",
				"[data-role='groupindex'], .ui-groupIndex",
				[],
				GroupIndex,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.GroupIndex;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
