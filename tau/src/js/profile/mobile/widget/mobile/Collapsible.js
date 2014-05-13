/*global window, define */
/*jslint nomen: true */
/**
 * Collapsible widget
 * @author Piotr Karny <p.karny@samsung.com>
 * @class ns.widget.mobile.Collapsible
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/theme",
			"../../../../core/utils/selectors",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/DOM/manipulation",
			"../../../../core/utils/events",
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
				selectors = ns.utils.selectors,
				/**
				* @property {Object} events alias variable
				* @private
				* @static
				*/
				events = ns.utils.events,
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
				domUtils = ns.utils.DOM,
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
					* @property {Object} options Collapsible widget options
					* @property {string} [options.expandCueText=' Expandable list, tap to open list']
					* @property {string} [options.collapseCueText=' Expandable list, tap to close list']
					* @property {boolean} [options.collapsed=true] Determines if content should be collapsed on load
					* @property {string} [options.heading='h1,h2,h3,h4,h5,h6,legend,li']
					* @property {?string} [options.theme=null] widget theme, `{@link ns.widget.mobile.Collapsible#defaultOptions}.theme`
					* value is used when .theme option isn't on element itself and on it's parents
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
					// theme, collapsedIcon, expandedIcon, iconpos set as null because they may be overriden with collapsible-set options

					this._eventHandlers = {};
				};

			Collapsible.prototype = new BaseWidget();

			/**
			* @property {Object} defaultOptions Default options for settings of collapsible widget
			* @property {string} defaultOptions.theme='s'
			* @property {string} defaultOptions.collapsedIcon='arrow-u'
			* @property {string} defaultOptions.expandedIcon='arrow-d'
			* @property {string} defaultOptions.iconpos='right'
			* @static
			* @member ns.widget.mobile.Collapsible
			*/
			Collapsible.defaultOptions = {
				theme: 's',
				collapsedIcon: 'arrow-u',
				expandedIcon: 'arrow-d',
				iconpos: 'right'
			};

			/**
			* @property {Object} classes Dictionary object containing commonly used wiget classes
			* @static
			* @member ns.widget.mobile.Collapsible
			*/
			Collapsible.classes = {
				uiCollapsible: 'ui-collapsible',
				uiCollapsibleContent: 'ui-collapsible-content',
				uiCollapsibleContentCollapsed: 'ui-collapsible-content-collapsed',
				uiCollapsibleCollapsed: 'ui-collapsible-collapsed',
				uiCollapsibleInset: 'ui-collapsible-inset',
				uiCollapsibleHeading: 'ui-collapsible-heading',
				uiCollapsibleHeadingCollapsed: 'ui-collapsible-heading-collapsed',
				uiCollapsibleHeadingStatus: 'ui-collapsible-heading-status',
				uiCollapsibleHeadingToggle: 'ui-collapsible-heading-toggle',
				uiCornerTop: 'ui-corner-top',
				uiCornerBottom: 'ui-corner-bottom',
				uiIcon: 'ui-icon',
				// Prefixes
				uiBodyPrefix: 'ui-body-',
				uiIconPrefix: 'ui-icon-'
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
					ns.log('[collapsible widget] no elements matching heading selector found');
					//>>excludeEnd("tauDebug");
					header = document.createElement('h1');
					element.appendChild(header);
				}

				if (header.tagName.toLowerCase() === 'legend') {
					alterHeader = document.createElement('div');
					alterHeader.setAttribute('role', 'heading');
					alterHeader.innerHTML = header.innerHTML;

					element.replaceChild(alterHeader, header);
					header = alterHeader;
				}
				header.classList.add(classes.uiCollapsibleHeading);

				// Wrap all widget content
				domUtils.wrapInHTML(element.childNodes, '<div class="' + classes.uiCollapsibleContent + '"></div>');

				// Move header out
				header = element.insertBefore(header, element.firstChild);
				// .. and set reference to content
				content = header.nextElementSibling;

				if (parentCollapsibleSet) {
					// If set theme from parent set or closest element and if everything is empty set default
					if (!options.theme) {
						options.theme = getDataFromParentSet('theme') || themes.getInheritedTheme(element) || defaults.theme;
					}

					if (!options.contentTheme) {
						options.contentTheme = getDataFromParentSet('content-theme');
					}
					//Get the preference for collapsed icon in the set
					if (!options.collapsedIcon) {
						options.collapsedIcon = getDataFromParentSet('collapsed-icon');
					}
					// Get the preference for expanded icon in the set
					if (!options.expandedIcon) {
						options.expandedIcon = getDataFromParentSet('expanded-icon');
					}
					// Gets the preference icon position in the set
					if (!options.iconpos) {
						options.iconpos = getDataFromParentSet('iconpos');
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
				// [-> collapible-set data-collapsed-icon]
				// -> defaultValue
				options.collapsedIcon = options.collapsedIcon || defaults.collapsedIcon;
				// Based on value from:
				// elements data-expanded-icon or passed options
				// [-> collapible-set data-collapsed-icon]
				// -> defaultValue
				options.expandedIcon = options.expandedIcon || defaults.expandedIcon;

				options.iconpos = options.iconpos || defaults.iconpos;

				headerStatus = document.createElement('span');
				headerStatus.classList.add(classes.uiCollapsibleHeadingStatus);

				header.appendChild(headerStatus);

				domUtils.wrapInHTML(header.childNodes, '<a href="#" class="' + classes.uiCollapsibleHeadingToggle + '"></a>');
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

				headerLink.removeAttribute('role');

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

			/**
			* Handler function for expanding/collapsing widget
			* @method toggleCollapsibleHandler
			* @param {HTMLElement} element
			* @param {Object} options
			* @param {Event} event
			* @private
			*/
			function toggleCollapsibleHandler(element, options, event) {
				var elementClassList = element.classList,
					classes = Collapsible.classes,
					header = selectors.getChildrenByClass(element, classes.uiCollapsibleHeading)[0],
					headerClassList = header.classList,
					headerStatus = header.querySelector('.' + classes.uiCollapsibleHeadingStatus),
					headerIcon = header.querySelector('.' + classes.uiIcon),
					headerIconClassList = headerIcon.classList,
					headerLink = header.firstElementChild,
					content = selectors.getChildrenByClass(element, classes.uiCollapsibleContent)[0],
					parentCollapsibleSet = selectors.getClosestBySelector(element, "[data-role='collapsible-set']"),
					isCollapse = event.type === 'collapse';

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
                //Marcin Jakuszko (m.jakuszko@samsung.com)
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

				content.setAttribute('aria-hidden', isCollapse);

				if (options.contentTheme && options.inset && (!parentCollapsibleSet || domUtils.getNSData(element, 'collapsible-last'))) {
					slice.call(header.querySelectorAll('.' + Button.classes.uiBtnInner)).forEach(function (value) {

                        if(isCollapse) {
                            value.classList.add(classes.uiCornerBottom);
                        } else {
                            value.classList.remove(classes.uiCornerBottom);
                        }
					});

                    if(isCollapse) {
                        headerLink.classList.add(classes.uiCornerBottom);
                        content.classList.remove(classes.uiCornerBottom);
                    } else {
                        headerLink.classList.remove(classes.uiCornerBottom);
                        content.classList.add(classes.uiCornerBottom);
                    }
				}

				// @TODO ?
				//content.trigger( "updatelayout" );
				events.trigger(element, isCollapse ? 'collapsed' : 'expanded');
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
						var link = header.querySelector('a');
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
					var eventType = header.classList.contains(classes.uiCollapsibleHeadingCollapsed) ? 'expand' : 'collapse';

					events.trigger(element, eventType);

					event.preventDefault();
					events.stopPropagation(event);
				};

				// Handle 'expand' and 'collapse' events
				element.addEventListener('expand', toggleHandler, false);
				element.addEventListener('collapse', toggleHandler, false);

				// Handle 'vmousedown' event (this event is triggered with 'touchstart' too)
				header.addEventListener('vmousedown', eventHandlers.addActiveClass, false);

				// Handle 'vmousemove', 'vmousecancel' and 'vmouseup' events
				header.addEventListener('vmousemove', removeActiveClass, false);
				header.addEventListener('vmousecancel', removeActiveClass, false);
				header.addEventListener('vmouseup', removeActiveClass, false);

				// Handle touching and clicking
				header.addEventListener('vclick', eventHandlers.toggleCollapsiness, false);

				events.trigger(element, options.collapsed ? 'collapse' : 'expand');
			};

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

				// Remove 'expand' and 'collapse' listeners
				element.removeEventListener('expand', toggleHandler, false);
				element.removeEventListener('collapse', toggleHandler, false);

				// Remove 'vmousedown' event (this event is triggered with 'touchstart' too) listeners
				header.removeEventListener('vmousedown', eventHandlers.addActiveClass, false);

				// Remove 'vmousemove', 'vmousecancel' and 'vmouseup' events listeners
				header.removeEventListener('vmousemove', removeActiveClassHandler, false);
				header.removeEventListener('vmousecancel', removeActiveClassHandler, false);
				header.removeEventListener('vmouseup', removeActiveClassHandler, false);

				// Remove touching and clicking event listeners
				header.removeEventListener('vclick', eventHandlers.toggleCollapsiness, false);

				// @TODO remove all operations performed on _build
				// maybe store base structure inside element's object property as string
				// instead of reversing all operations?

				events.trigger(document, 'destroyed', {
					widget: "Collapsible",
					parent: parentNode
				});
			};

			// definition
			ns.widget.mobile.Collapsible = Collapsible;
			engine.defineWidget(
				"Collapsible",
				"[data-role='collapsible'], .ui-collapsible",
				[],
				Collapsible,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Collapsible;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
