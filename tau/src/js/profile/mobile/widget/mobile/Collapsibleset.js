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
 *
 * @author Marcin Jakuszko <m.jakuszko@samsung.com>
 * @class ns.widget.Collapsibleset
 * @extends ns.widget.BaseWidget
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
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/selectors",
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
				* @property {ns.utils.selectors} selectors alias variable
				* @private
				* @static
				*/
				selectors = ns.utils.selectors,
				/**
				* @property {ns.utils.DOM} domUtils alias variable
				* @private
				* @static
				*/
				domUtils = ns.utils.DOM,
				/**
				* @property {Object} BaseWidget alias variable
				* @private
				* @static
				*/
				BaseWidget = widget.mobile.BaseWidgetMobile,
				prototype = new BaseWidget(),

				/**
				* Local constructor function
				* @method Collapsibleset
				* @private
				* @member ns.widget.Collapsibleset
				*/
				Collapsibleset = function () {
					/**
					* @property {Object} options Collapsibleset widget options
					* @property {?string} [options.theme=null] widget theme
					* @property {?string} [options.contentTheme=null] widget content theme
					* @property {boolean} [options.inset=true] Determines if widget should be shown as inset
					* @property {boolean} [options.mini=false] Sets widget to mini version
					* @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load
					* @property {?string} [options.collapsedIcon=null] Icon for collapsed widget
					* @property {?string} [options.expandedIcon=null] Icon for expanded widget
					* @member ns.widget.Collapsible
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
			* @property {Object} classes Dictionary object containing commonly used wiget classes
			* @static
			* @member ns.widget.Collapsibleset
			*/
			Collapsibleset.classes = {
				uiCollapsible: 'ui-collapsible',
				uiCollapsibleSet: 'ui-collapsible-set',
				uiCollapsibleHeading: 'ui-collapsible-heading',
				uiCornerTop: 'ui-corner-top',
				uiCornerBottom: 'ui-corner-bottom',
				uiBtnInner: 'ui-btn-inner',
				uiCollapsibleContent : 'ui-collapsible-content'
			};


			/**
			* @property {Object} attributes Dictionary object containing commonly used wiget attributes
			* @static
			* @member ns.widget.Collapsibleset
			*/
			Collapsibleset.attributes = {
				last: 'collapsible-last'
			};

			/**
			* Build widget structure
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.Collapsibleset
			*/
			prototype._build = function (element) {
				element.classList.add(Collapsibleset.classes.uiCollapsibleSet);
				return element;
			};

			/**
			* Set proper corners' style for elements inside widget
			* @method roundCollapsibleSetBoundaries
			* @param {Array} collapsiblesInSet
			* @private
			* @member ns.widget.Collapsibleset
			*/
			function roundCollapsibleSetBoundaries(collapsiblesInSet) {
				if(collapsiblesInSet.length > 0) {

					var firstCollapsible = collapsiblesInSet[0],
						classes = Collapsibleset.classes,
						dataAttributes = Collapsibleset.attributes,
						firstCollapsibleHeading = selectors.getChildrenByClass(firstCollapsible, classes.uiCollapsibleHeading)[0],
						firstCollapsibleLink = selectors.getChildrenByTag(firstCollapsibleHeading, 'a')[0],
						firstCollapsibleButtonInner = selectors.getChildrenByClass(firstCollapsibleLink, classes.uiBtnInner)[0],

						lastCollapsible = collapsiblesInSet[collapsiblesInSet.length-1],
						lastCollapsibleHeading = selectors.getChildrenByClass(lastCollapsible, classes.uiCollapsibleHeading)[0],
						lastCollapsibleLink = selectors.getChildrenByTag(lastCollapsibleHeading, 'a')[0],
						lastCollapsibleButtonInner = selectors.getChildrenByClass(lastCollapsibleLink, classes.uiBtnInner)[0];

					//clean up borders
					collapsiblesInSet.forEach(function(collapsibleElement) {
						var heading = selectors.getChildrenByClass(collapsibleElement, classes.uiCollapsibleHeading)[0],
							link = selectors.getChildrenByTag(heading, 'a')[0],
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

			/**
			* Handler function for expanding/collapsing widget
			* @method expandCollapseHandler
			* @param {HTMLElement} element
			* @param {Object} options
			* @param {Event} event
			* @private
			* @member ns.widget.Collapsibleset
			*/
			function expandCollapseHandler(element, options, event) {
				var collapsible = event.target,
					isCollapse = event.type === "collapse",
					classes = Collapsibleset.classes,
					dataAttributes = Collapsibleset.attributes,
					firstCollapsible = element.firstChild,
					collapsibleHeading = selectors.getChildrenByClass(collapsible, classes.uiCollapsibleHeading)[0],
					headingLink = selectors.getChildrenByTag(collapsibleHeading, 'a')[0],
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
							events.trigger(firstCollapsible, 'collapse');
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
			* @member ns.widget.Collapsibleset
			*/
			prototype._bindEvents = function (element) {
				var eventHandler = this._eventHandlers.expandCollapseHandler = expandCollapseHandler.bind(null, element, this.options);

				element.addEventListener('expand', eventHandler, true);
				element.addEventListener('collapse', eventHandler, true);

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.Collapsibleset
			*/
			prototype._init = function (element) {
				var expanded = selectors.getChildrenBySelector(element, "[data-collapsed='false']"),
					expandedLength = expanded.length,
					i;

				this.refresh();

				for(i = 0; i < expandedLength; i++) {
					events.trigger(expanded[i], 'expand');
				}

			};

			/**
			* Refresh structure
			* @method _refresh
			* @protected
			* @member ns.widget.Collapsibleset
			*/
			prototype._refresh = function () {
				var element = this.element,
					collapsiblesInSet = selectors.getChildrenBySelector(element, "[data-role='collapsible']"),
					bareCollapsibles = selectors.getChildrenBySelector(element, ":not(.ui-collapsible)"),
					bareCollapsiblesLength = bareCollapsibles.length,
					i;

				for(i=0; i < bareCollapsiblesLength; i++) {
					engine.instanceWidget(bareCollapsibles[i], 'Collapsible');
				}

				roundCollapsibleSetBoundaries(collapsiblesInSet);

				return this;
			};

			/**
			* Destroy widget
			* @method _destroy
			* @protected
			* @member ns.widget.Collapsibleset
			*/
			prototype._destroy = function () {
				var element = this.element,
					eventHandler = this._eventHandlers.expandCollapseHandler;

				element.removeEventListener('expand', eventHandler, true);
				element.removeEventListener('collapse', eventHandler, true);
			};

            Collapsibleset.prototype = prototype;

            // definition
            widget.mobile.Collapsibleset = Collapsibleset;
            engine.defineWidget(
                "Collapsibleset",
                "[data-role='collapsible-set'],.ui-collapsible-set",
                [],
                Collapsibleset,
                'mobile'
            );
            //>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
            return Collapsibleset;
        }
    );
    //>>excludeEnd("tauBuildExclude");
}(window.document, ns));
