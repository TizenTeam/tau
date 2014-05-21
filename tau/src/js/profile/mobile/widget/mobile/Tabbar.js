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
 * #Tab Bar Widget
 *
 * @class ns.widget.Tabbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/grid",
			"../../../../core/util/DOM/attributes",
			"../../../../core/event/vmouse",
			"../mobile",  // fetch namespace
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ButtonClasses = ns.widget.mobile.Button.classes,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				grid = ns.util.grid,
				DOM = ns.util.DOM,
				slice = [].slice,
				Tabbar = function () {
					this.vclickCallback = null;
				};

			Tabbar.prototype = new BaseWidget();

			/*
			* @todo move to options object
			*/

			Tabbar.prototype.iconpos = 'top';
			Tabbar.prototype.grid = null;

			Tabbar.classes = {
				tabbarScrollUl: "tabbar-scroll-ul",
				tabbarScrollLi: "tabbar-scroll-li",
				uiTabbarActive: "ui-tabbar-active",
				uiStatePersist: "ui-state-persist",
				uiHeader: "ui-header",
				uiScrollviewView: "ui-scrollview-view",
				uiScrollviewClip: "ui-scrollview-clip",
				uiNavbar: "ui-navbar",
				uiFooter: "ui-footer",
				uiTabBtnStyle: "ui-tab-btn-style",
				uiTitle: "ui-title",
				uiTitleTabbar: "ui-title-tabbar",
				uiTabbarNoicons: "ui-tabbar-noicons",
				uiTabbarNotext: "ui-tabbar-notext",
				uiTitleTabbarMultiline: "ui-title-tabbar-multiline",
				uiTabbarPersist: "ui-tabbar-persist",
				uiTabbar: "ui-tabbar",
				uiPortraitTabbar: "ui-portrait-tabbar",
				uiLandscapeTabbar: "ui-landscape-tabbar"
			};

			/**
			* Returns true if one of elements has data-icon set to true
			* @param {Array} elements
			*/
			function hasIcon(elements) {
				return !elements.every(function (element) {
					return !element.getAttribute('data-icon');
				});
			}

			function vclickEvent(self) {
				/*
					$tabbar.delegate( "a", "vclick", function ( event ) {
						if ( $tabbtns.parents( "ul" ).is( ".tabbar-scroll-ul" ) ) {
							$tabbtns.removeClass( "ui-tabbar-active" );
							$( event.target ).parents( "a" ).addClass( "ui-tabbar-active" );
						} else {
							$tabbtns.not( ".ui-state-persist" ).removeClass( $.mobile.activeBtnClass );
							$( this ).addClass( $.mobile.activeBtnClass );
						}
					});
				*/
				var element = self.element,
					uls = element.getElementsByTagName("ul"),
					ul = uls[0],
					buttons = element.getElementsByTagName("a"),
					i = 0,
					max,
					hasClass = false,
					buttonClasses,
					btnActiveClass = ns.widget.mobile.Button.classes.uiBtnActive,
					classes = Tabbar.classes,
					activatedButton = selectors.getClosestByTag(event.target, "a");

				while (!hasClass && ul) {
					if (ul.classList.contains(classes.tabbarScrollUl)) {
						hasClass = true;
					}
					ul = uls[++i];
				}

				if (hasClass) {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttons[i].classList.remove(classes.uiTabbarActive);
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(classes.uiTabbarActive);
					}
				} else {
					for (i = 0, max = buttons.length; i < max; i++) {
						buttonClasses = buttons[i].classList;
						if (!buttonClasses.contains(classes.uiStatePersist)) {
							buttonClasses.remove(btnActiveClass);
						}
					}
					/*
					* In original file btnActiveClass is always added.
					* Here, if button is disabled, this class will not be added
					*/
					if (activatedButton) {
						activatedButton.classList.add(btnActiveClass);
					}
				}
			}

			/**
			 * Sets tabbar elements disabled and aria-disabled attributes according
			 * to specified value
			 * @method setDisable
			 * @private
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @param {number} index the element index
			 */
			function setDisabled(element, value, index) {
				var liItems = selectors.getChildrenByTag(element.children[0], 'li')[index];

				DOM.setAttribute(liItems, 'disabled', value);
				DOM.setAttribute(liItems, 'aria-disabled', value);
				if (value) {
					liItems.classList.add(ButtonClasses.uiDisabled);
				} else {
					liItems.classList.remove(ButtonClasses.uiDisabled);
				}
			}

			/**
			* Build method
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.Tabbar
			*/
			Tabbar.prototype._build = function (element) {
				var classes = Tabbar.classes,
					tabbarClassList = element.classList,
					links = slice.call(element.getElementsByTagName('a')),
					headers = selectors.getParentsByClass(element, classes.uiHeader),
					scrollview = selectors.getParentsByClass(element, classes.uiScrollviewView),
					li = slice.call(element.getElementsByTagName("li")),
					iconpos,
					textpos,
					instanceButtonOptions = {
						shadow: false,
						corners: false,
						inline: false,
						bar: true,
						role: 'button'
					};

				if (links.length) {
					iconpos = hasIcon(links) ? this.iconpos : undefined;
					textpos = links[0].innerHTML.length ? true : false;
				}

				if (headers.length && scrollview.length) {
					li.forEach(function (item) {
						item.classList.add(classes.tabbarScrollLi);
					});
					slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
						item.classList.add(classes.tabbarScrollUl);
					});

					/* add shadow divider */
					selectors.getParentsByClass(classes.uiScrollviewClip).forEach(function (item) {
						item.insertAdjacentHTML('beforeend', '<div class="ui-tabbar-divider ui-tabbar-divider-left" style="display:none"></div><div class="ui-tabbar-divider ui-tabbar-divider-right" style="display:none"></div>');
					});

					//@todo how read something from jquery.data?
		//			/* add width calculation*/
		//			if ( $tabscrollview.data("default-list") ) {
		//				this.options.defaultList = $tabscrollview.data( "default-list" );
		//			}
		//			$tabli.css( "width", window.innerWidth / this.options.defaultList + "px" );
				} else {
					if (li.length) {
						tabbarClassList.add(classes.uiNavbar);
						slice.call(element.getElementsByTagName("ul")).forEach(function (item) {
							/*
							* @todo delete getAttribute
							*/
							grid.makeGrid(item, element.getAttribute("data-grid") || this.grid);
						});
					}
				}

				if (selectors.getParentsByClass(element, classes.uiFooter).length) {
					li.forEach(function (item) {
						item.classList.add(classes.uiTabBtnStyle);
					});
				}

				/* title tabbar */
				if (selectors.getChildrenByClass(element.parentNode, classes.uiTitle).length) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbar);
					});
				}

				if (!iconpos) {
					tabbarClassList.add(classes.uiTabbarNoicons);
				}
				if (!textpos) {
					tabbarClassList.add(classes.uiTabbarNotext);
				}
				if (textpos && iconpos) {
					headers.forEach(function (header) {
						header.classList.add(classes.uiTitleTabbarMultiline);
					});
				}

				if (links.length) {
					if (iconpos) {
						instanceButtonOptions.iconpos = iconpos;
					}
					links.forEach(function (item) {
						engine.instanceWidget(item, "Button", instanceButtonOptions);
					});
				}

				if (element.getElementsByClassName(classes.uiStatePersist).length) {
					tabbarClassList.add(classes.uiTabbarPersist);
				}

				tabbarClassList.add(classes.uiTabbar);

				this._init(element);
				return element;
			};

			/**
			* Init method
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.Tabbar
			*/
			Tabbar.prototype._init = function (element) {
				var classes = Tabbar.classes,
					tabbarClassList = element.classList,
					isLandscape = window.innerWidth > window.innerHeight;

				if (isLandscape) {
					tabbarClassList.remove(classes.uiPortraitTabbar);
					tabbarClassList.add(classes.uiLandscapeTabbar);
				} else {
					tabbarClassList.remove(classes.uiLandscapeTabbar);
					tabbarClassList.add(classes.uiPortraitTabbar);
				}
			};

			/*
			* @TODO events
			*/
			Tabbar.prototype._bindEvents = function () {
				this.vclickCallback = vclickEvent.bind(null, this);
				this.element.addEventListener("vclick", this.vclickCallback, false);
			};

			Tabbar.prototype._destroy = function () {
				this.element.removeEventListener("vclick", this.vclickCallback, false);
			};

			/**
			 * Disables specified element in tabbar
			 * @method _disable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.Slider
			 * @instance
			 */
			Tabbar.prototype._disable = function (element, index) {
				if (index !== undefined) {
					setDisabled(element, true, index);
				}
			};

			/**
			 * Enables specified element in tabbar
			 * @method _enable
			 * @param {HTMLElement} element
			 * @param {number} index the element index
			 * @protected
			 * @member ns.widget.mobile.Slider
			 * @instance
			 */
			Tabbar.prototype._enable = function (element, index) {
				if (index !== undefined) {
					setDisabled(element, false, index);
				}
			};

			ns.widget.mobile.Tabbar = Tabbar;
			engine.defineWidget(
				"Tabbar",
				"[data-role='tabbar'], .ui-tabbar",
				[],
				Tabbar,
				'tizen'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Tabbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
