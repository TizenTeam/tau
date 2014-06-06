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
 * #Collapsible Set Widget
 *
 * ##Default selectors
 * In default all elements with _data-role="collapsible-set"_ or clas _.ui-collapsible-set_ are changed to collapsibleset widget.
 *
 * ##HTML Examples
 *
 * ###Create collapsibleset by data-role
 *
 *		@example
 *		<div data-role="collapsible-set" data-theme="c" data-content-theme="d">
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 1</h6>
 *				<div>Content</div>
 *			</div>
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 2</h6>
 *				<div>Content</div>
 *			</div>
 *		</div>
 *
 * ###Create collapsibleset by class
 *
 *		@example
 *		<div class="ui-collapsible-set" data-theme="c" data-content-theme="d">
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 1</h6>
 *				<div>Content</div>
 *			</div>
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 2</h6>
 *				<div>Content</div>
 *			</div>
 *		</div>
 *
 * ## Manual constructor
 * For manual creation of collapsibleset widget you can use constructor of widget:
 *
 *		@example
 *		<div id="collapsibleset" data-theme="c" data-content-theme="d">
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 1</h6>
 *				<div>Content</div>
 *			</div>
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 2</h6>
 *				<div>Content</div>
 *			</div>
 *		</div>
 *
 *		<script>
 *			var collapsibleset = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<div id="collapsibleset" data-theme="c" data-content-theme="d">
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 1</h6>
 *				<div>Content</div>
 *			</div>
 *			<div data-role="collapsible" data-inset="false">
 *				<h6>Collapsible head 2</h6>
 *				<div>Content</div>
 *			</div>
 *		</div>
 *
 *		<script>
 *			var collapsibleset = $("#collapsibleset").collapsibleset();
 *		</script>
 *
 *
 * @class ns.widget.mobile.CollapsibleSet
 * @extends ns.widget.BaseWidget
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 */

(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../mobile",
			"../../../../core/theme",
			"../../../../core/event",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/selectors",
			"./BaseWidgetMobile",
			"./Collapsible"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

				/**
				 * @property {ns.engine} engine alias variable
				 * @private
				 * @static
				 */
			var engine = ns.engine,
				/**
				 * @property {ns.widget} widget alias variable
				 * @private
				 * @static
				 */
				widget = ns.widget,
				/**
				 * @property {ns.event} events alias variable
				 * @private
				 * @static
				 */
				events = ns.event,
				/**
				 * @property {ns.util.selectors} selectors alias variable
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * @property {ns.util.DOM} domUtils alias variable
				 * @private
				 * @static
				 */
				domUtils = ns.util.DOM,
				/**
				 * @property {Object} BaseWidget alias variable
				 * @private
				 * @static
				 */
				BaseWidget = widget.mobile.BaseWidgetMobile,
				prototype = new BaseWidget(),

				CollapsibleSet = function () {
					/**
					 * @property {Object} options CollapsibleSet widget options
					 * @property {?string} [options.theme=null] Sets the color scheme (swatch) for the collapsible set.
					 * @property {?string} [options.contentTheme=null] Sets the color scheme (swatch) for the content of collapsible set.
					 * @property {boolean} [options.inset=true] Determines if widget should be shown as inset.
					 * @property {boolean} [options.mini=false] Sets the size of the collapsibles to a more compact, mini version.
					 * @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load.
					 * @property {?string} [options.collapsedIcon=null] Sets the icon for the headers of the collapsible containers when in a collapsed state.
					 * @property {?string} [options.expandedIcon=null] Sets the icon for the headers of the collapsible containers when in an expanded state.
					 * @member ns.widget.mobile.CollapsibleSet
					 */
					this.options = {
						theme: null,
						contentTheme: null,
						inset: null,
						mini: null,
						collapsed: true,
						collapsedIcon: null,
						expandedIcon: null
					};

					this._eventHandlers = {};
				};

			/**
			 * Dictionary object containing commonly used wiget classes
			 * @property {Object} classes
			 * @static
			 * @readonly
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			CollapsibleSet.classes = {
				uiCollapsible: "ui-collapsible",
				uiCollapsibleSet: "ui-collapsible-set",
				uiCollapsibleHeading: "ui-collapsible-heading",
				uiCornerTop: "ui-corner-top",
				uiCornerBottom: "ui-corner-bottom",
				uiBtnInner: "ui-btn-inner",
				uiCollapsibleContent : "ui-collapsible-content"
			};


			/**
			 * Dictionary object containing commonly used wiget attributes
			 * @property {Object} attributes
			 * @static
			 * @readonly
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			CollapsibleSet.attributes = {
				last: "collapsible-last"
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			prototype._build = function (element) {
				element.classList.add(CollapsibleSet.classes.uiCollapsibleSet);
				return element;
			};


			// Set proper corners' style for elements inside widget
			// @method roundCollapsibleSetBoundaries
			// @param {Array} collapsiblesInSet
			// @private
			// @member ns.widget.mobile.CollapsibleSet
			function roundCollapsibleSetBoundaries(collapsiblesInSet) {
				if(collapsiblesInSet.length > 0) {

					var firstCollapsible = collapsiblesInSet[0],
						classes = CollapsibleSet.classes,
						dataAttributes = CollapsibleSet.attributes,
						firstCollapsibleHeading = selectors.getChildrenByClass(firstCollapsible, classes.uiCollapsibleHeading)[0],
						firstCollapsibleLink = selectors.getChildrenByTag(firstCollapsibleHeading, "a")[0],
						firstCollapsibleButtonInner = selectors.getChildrenByClass(firstCollapsibleLink, classes.uiBtnInner)[0],

						lastCollapsible = collapsiblesInSet[collapsiblesInSet.length-1],
						lastCollapsibleHeading = selectors.getChildrenByClass(lastCollapsible, classes.uiCollapsibleHeading)[0],
						lastCollapsibleLink = selectors.getChildrenByTag(lastCollapsibleHeading, "a")[0],
						lastCollapsibleButtonInner = selectors.getChildrenByClass(lastCollapsibleLink, classes.uiBtnInner)[0];

					//clean up borders
					collapsiblesInSet.forEach(function(collapsibleElement) {
						var heading = selectors.getChildrenByClass(collapsibleElement, classes.uiCollapsibleHeading)[0],
							link = selectors.getChildrenByTag(heading, "a")[0],
							linkClassList = link.classList,
							buttonInner = selectors.getChildrenByClass(link, classes.uiBtnInner)[0],
							buttonInnerClassList = buttonInner.classList;

						domUtils.removeNSData(collapsibleElement, dataAttributes.last);
						linkClassList.remove(classes.uiCornerBottom);
						linkClassList.remove(classes.uiCornerTop);
						buttonInnerClassList.remove(classes.uiCornerBottom);
						buttonInnerClassList.remove(classes.uiCornerTop);
					});

					firstCollapsibleLink.classList.add(classes.uiCornerTop);
					firstCollapsibleButtonInner.classList.add(classes.uiCornerTop);

					lastCollapsibleLink.classList.add(classes.uiCornerBottom);
					lastCollapsibleButtonInner.classList.add(classes.uiCornerBottom);
					domUtils.setNSData(lastCollapsible, dataAttributes.last, true);
				}
				return collapsiblesInSet;
			}

			//Handler function for expanding/collapsing widget
			//@method expandCollapseHandler
			//@param {HTMLElement} element
			//@param {Object} options
			//@param {Event} event
			//@private
			//@member ns.widget.mobile.CollapsibleSet
			function expandCollapseHandler(element, options, event) {
				var collapsible = event.target,
					isCollapse = event.type === "collapse",
					classes = CollapsibleSet.classes,
					dataAttributes = CollapsibleSet.attributes,
					firstCollapsible = element.firstChild,
					collapsibleHeading = selectors.getChildrenByClass(collapsible, classes.uiCollapsibleHeading)[0],
					headingLink = selectors.getChildrenByTag(collapsibleHeading, "a")[0],
					headingLinkClassList = headingLink.classList,
					buttonInner = selectors.getChildrenByClass(headingLink, classes.uiBtnInner)[0],
					buttonInnerClassList = buttonInner.classList,
					collapsibleContent = selectors.getChildrenByClass(collapsible, classes.uiCollapsibleContent)[0],
					collapsibleContentClassList =  collapsibleContent.classList;

				if(domUtils.hasNSData(collapsible, dataAttributes.last) && !!options.inset) {
					if(isCollapse) {
						headingLinkClassList.add(classes.uiCornerBottom);
						buttonInnerClassList.add(classes.uiCornerBottom);
						collapsibleContentClassList.remove(classes.uiCornerBottom);
					} else {
						headingLinkClassList.remove(classes.uiCornerBottom);
						buttonInnerClassList.remove(classes.uiCornerBottom);
						collapsibleContentClassList.add(classes.uiCornerBottom);
					}
				}

				if(!isCollapse) {
					while(firstCollapsible) {
						if (firstCollapsible.nodeType === 1 && firstCollapsible !== collapsible) {
							events.trigger(firstCollapsible, "collapse");
						}
						firstCollapsible = firstCollapsible.nextSibling;
					}
				}
			}

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			prototype._bindEvents = function (element) {
				var eventHandler = this._eventHandlers.expandCollapseHandler = expandCollapseHandler.bind(null, element, this.options);

				element.addEventListener("expand", eventHandler, true);
				element.addEventListener("collapse", eventHandler, true);

				return element;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			prototype._init = function (element) {
				var expanded = selectors.getChildrenBySelector(element, "[data-collapsed='false']"),
					expandedLength = expanded.length,
					i;

				this.refresh();

				for(i = 0; i < expandedLength; i++) {
					events.trigger(expanded[i], "expand");
				}

			};

			/**
			 * This method refreshes collapsibleset.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.refresh();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("refresh");
			 *		</script>
			 *
			 * @method refresh
			 * @chainable
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			prototype._refresh = function () {
				var element = this.element,
					collapsiblesInSet = selectors.getChildrenBySelector(element, "[data-role='collapsible']"),
					bareCollapsibles = selectors.getChildrenBySelector(element, ":not(.ui-collapsible)"),
					bareCollapsiblesLength = bareCollapsibles.length,
					i;

				for(i=0; i < bareCollapsiblesLength; i++) {
					engine.instanceWidget(bareCollapsibles[i], "Collapsible");
				}

				roundCollapsibleSetBoundaries(collapsiblesInSet);

				return this;
			};

			/**
			 * Removes the collapsibleset functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.destroy();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("destroy");
			 *		</script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.CollapsibleSet
			 */
			prototype._destroy = function () {
				var element = this.element,
					eventHandler = this._eventHandlers.expandCollapseHandler;

				element.removeEventListener("expand", eventHandler, true);
				element.removeEventListener("collapse", eventHandler, true);
			};

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
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset")),
			 *				value;
			 *
			 *			value = collapsiblesetWidget.option("mini"); // get value
			 *			collapsiblesetWidget.option("mini", true); // set value
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var value;
			 *
			 *			value = $("#collapsibleset").collapsibleset("option", "mini"); // get value
			 *			$("#collapsibleset").collapsibleset("option", "mini", true); // set value
			 *		</script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.CollapsibleSet
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Disable the collapsibleset
			 *
			 * Method adds disabled attribute on collapsibleset and changes look of collapsibleset to disabled state.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.disable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("disable");
			 *		</script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Enable the collapsibleset
			 *
			 * Method removes disabled attribute on collapsibleset and changes look of collapsibleset to enabled state.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.enable();
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("enable");
			 *		</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/*
			 * Trigger an event on widget's element.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.trigger("eventName");
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("trigger", "eventName");
			 *		</script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset"));
			 *			collapsiblesetWidget.on("eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			$("#collapsibleset").collapsibleset("on", "eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *		</script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var collapsiblesetWidget = tau.widget.CollapsibleSet(document.getElementById("collapsibleset")),
			 *				callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			collapsiblesetWidget.on("eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			collapsiblesetWidget.off("eventName", callback);
			 *		</script>
			 *
			 * If jQuery is loaded:
			 *
			 *		@example
			 *		<div id="collapsibleset" data-role="collapsible-set" data-theme="c" data-content-theme="d">
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 1</h6>
			 *				<div>Content</div>
			 *			</div>
			 *			<div data-role="collapsible" data-inset="false">
			 *				<h6>Collapsible head 2</h6>
			 *				<div>Content</div>
			 *			</div>
			 *		</div>
			 *
			 *		<script>
			 *			var callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *			// add callback on event "eventName"
			 *			$("#collapsibleset").collapsibleset("on", "eventName", callback);
			 *			// ...
			 *			// remove callback on event "eventName"
			 *			$("#collapsibleset").collapsibleset("off", "eventName", callback);
			 *		</script>
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param tu addEventListener
			 * @member ns.widget.mobile.CollapsibleSet
			 */

			CollapsibleSet.prototype = prototype;

			// definition
			widget.mobile.CollapsibleSet = CollapsibleSet;
			engine.defineWidget(
				"CollapsibleSet",
				"[data-role='collapsible-set'],.ui-collapsible-set",
				[],
				CollapsibleSet,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return CollapsibleSet;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
