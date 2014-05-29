/*global window, define, ns */
/*jslint nomen: true */
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
/**
 * #Page Widget
 * Page widget represents the screen of an application
 *
 * ## Default selectors
 * All elements which have a class _.ui-page or a _data-role=page
 * will become Page widgets
 *
 * ### HTML examples
 *
 * #### Create a page widget using the data-role attribute
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="content">
 *				page content
 *			</div>
 *		</div>
 *
 * #### Create page widget using data-role attribute wth header and footer
 *
 *		@example
 *		<div data-role="page">
 *			<div data-role="header">
 *				My Page
 *			</div>
 *			<div data-role="content">
 *				page contents
 *			</div>
 *			<div data-role="footer">
 *				Status: OK
 *			</div>
 *		</div>
 *
 * #### Create a page widget using css classes
 *
 *		@example
 *		<div class="ui-page">
 *			<div class="ui-content">
 *				page content
 *			</div>
 *		</div>
 *
 * #### Create a page widget using css classes with header and footer
 *
 *		@example
 *		<div class="ui-page">
 *			<div class="ui-header">
 *				My Page
 *			</div>
 *			<div class="ui-content">
 *				page contents
 *			</div>
 *			<div class="ui-footer">
 *				Status: OK
 *			</div>
 *		</div>
 *
 * ### Manual constructor
 *
 * Thease examples show how to create a Page widget by hand using
 * JavaScript code
 *
 * #### Created using TAU api
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"));
 *		</script>
 *
 * #### Created using jQuery api
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = $("#myPage").page();
 *		</script>
 *
 * ## Options for Page widget
 *
 * Options can be set by using data-* attributes or by passing them
 * to the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ### Fullscreen
 *
 * Determines if the page is shown fullscreen. The default value is
 * *false*.
 *
 * You can change this by all available methods for options setting.
 *
 * #### By data-fullscreen attribute
 *
 *		@example
 *		<div data-role="page" data-fullscreen="true"></div>
 *
 * #### By config object passed to constructor
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"), {"fullscreen": true});
 *		</script>
 *
 * #### By setting the option after widget creation
 *
 *		@example
 *		<div data-role="page"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"));
 *			page.option("fullscreen", true);
 *		</script>
 *
 * #### By using jQuery API
 *
 *		@example
 *		<div data-role="page"></div>
 *		<script type="text/javascript">
 *			$("#myPage").page({"fullscreen": true});
 *		</script>
 *
 * ### Themes
 *
 * By using theme options we can change the default theme of a Page
 *
 * Possible theme options are: *theme*, *contentTheme*, *footerTheme*
 * and *headerTheme*. The default value for all of them is *"a"*.
 *
 * #### Using data-* attributes
 *		@example
 *		<div data-role="page" data-theme="s" data-content-theme="s" data-footer-theme="s"></div>
 *
 * #### Using config object passed to constructor
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = tau.widget.Page(document.getElementById("myPage"), {
 *				"theme": "s",
 *				"footerTheme": "s",
 *				"contentTheme": "s"
 *			});
 *		</script>
 *
 * #### Using jQuery API
 *
 *		@example
 *		<div id="myPage"></div>
 *		<script type="text/javascript">
 *			var page = $("#myPage").page({
 *				"theme": "s",
 *				"footerTheme": "s",
 *				"contentTheme": "s"
 *			});
 *		</script>
 *
 * ## Methods
 *
 * Page methods can be can be accessed trough 2 APIs: TAU API and jQuery
 * API (jQuery Mobile-like API)
 *
 * **WARNING** Some methods are not accessible through jQuery API
 * since jQuery already supplies functionalities for them (ex. focus).
 *
 * @class ns.widget.mobile.Page
 * @extends ns.widget.mobile.BaseWidgetMobile
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */

/**
 * Triggered before switching current page
 * @event pagebeforchange
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before the widget is created and initialized
 * @event pagebeforecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before current page is about to be closed
 * @event pagebeforehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before external page will be loaded
 * @event pagebeforeload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered before page will be displayed
 * @event pagebeforeshow
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after switching current page
 * @event pagechange
 * @member ns.widget.mobile.Page
 *
 */

/**
 * Triggered when page switching failed
 * @event pagechangefailed
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget creation
 * @event pagecreate
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is hidden
 * @event pagehide
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after widget initialization occurs
 * @event pageinit
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after an external page is loaded
 * @event pageload
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the external page is removed from the DOM
 * @event pagremove
 * @member ns.widget.mobile.Page
 */

/**
 * Triggered after the page is displayed
 * @event pageshow
 * @member ns.widget.mobile.Page
 */

(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/css",
			"../../../../core/util/object",
			"../../../../core/event/orientationchange",
			"../mobile",
			"../../../../core/theme",
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				selectors = ns.util.selectors,
				object = ns.util.object,
				utilsDOM = ns.util.DOM,
				slice = [].slice,
				Page = function () {
					/**
					 * @property {boolean} [pageSetHeight=false] The flag is indicates that height of the page  was set by framework
					 * @member ns.widget.mobile.Page
					 */
					this.pageSetHeight = false;
					this.contentFillCallback = null;
					this.contentFillAfterResizeCallback = null;
					this.destroyCallback = null;
					this.options = object.copy(Page.prototype.options);
				};

			/**
			 * @property {Object} classes Dictionary for page related css class names
			 * @property {string} [classes.uiPrefix='ui-'] Main ui prefix
			 * @property {string} [classes.uiBarPrefix='ui-bar-'] Ui bar prefix
			 * @property {string} [classes.uiBodyPrefix='ui-body-'] Ui body prefix
			 * @property {string} [classes.uiBtnBack='ui-btn-back'] Button class
			 * @property {string} [classes.uiTabbarMargin-back='ui-tabbar-margin-back'] Tabbar margin class
			 * @property {string} [classes.uiTitle='ui-title'] Title class
			 * @property {string} [classes.uiTitleTextStub='ui-title-text-stub'] Title stub class
			 * @property {string} [classes.uiTitleMultiline='ui-title-multiline'] Title multiline class
			 * @property {string} [classes.uiPage='ui-page'] Main page class
			 * @property {string} [classes.uiPageActive='ui-page-active'] Page active class
			 * @property {string} [classes.uiPageHeaderFullscreen='ui-page-header-fullscreen'] Page header fullscreen class
			 * @property {string} [classes.uiPageFooterFullscreen='ui-page-footer-fullscreen'] Page footer fullscreen class
			 * @property {string} [classes.uiPageHeaderFixed='ui-page-header-fixed'] Page header fixed class
			 * @property {string} [classes.uiPageFooterFixed='ui-page-footer-fixed'] Page footer fixed class
			 * @property {string} [classes.uiOverlayPrefix='ui-overlay-'] Ui overlay prefix
			 * @property {string} [classes.uBtnLeft='ui-btn-left'] Left button class
			 * @property {string} [classes.uiBtnRight='ui-btn-right'] Right button class
			 * @property {string} [classes.uiBtnRightPrefix='ui-btn-right-'] Right button prefix
			 * @property {string} [classes.fixedSuffix='-fixed'] Class fixed suffix
			 * @property {string} [classes.fullscreenSuffix='-fullscreen'] class fullscreen suffix
			 * @member ns.widget.mobile.Page
			 * @static
			 * @readonly
			 */
			Page.classes = {
				uiPrefix: "ui-",
				uiBarPrefix: "ui-bar-",
				uiBodyPrefix: "ui-body-",
				uiBtnBack: "ui-btn-back",
				uiTabbarMarginBack: "ui-tabbar-margin-back",
				uiTitle: "ui-title",
				uiTitleTextSub: "ui-title-text-sub",
				uiTitleMultiline: "ui-title-multiline",
				uiPage: "ui-page",
				uiPageActive: "ui-page-active",
				uiPageHeaderFullscreen: "ui-page-header-fullscreen",
				uiPageFooterFullscreen: "ui-page-footer-fullscreen",
				uiPageHeaderFixed: "ui-page-header-fixed",
				uiPageFooterFixed: "ui-page-footer-fixed",
				uiOverlayPrefix: "ui-overlay-",
				uiBtnLeft: "ui-btn-left",
				uiBtnRight: "ui-btn-right",
				uiBtnRightPrefix: "ui-btn-right-",
				fixedSuffix: "-fixed",
				fullscreenSuffix: "-fullscreen"
				// @todo put all used classes here
			};

			Page.prototype = new BaseWidget();

			/**
			 * @property {Object} options Object with default options
			 * @property {boolean} [options.fullscreen=false] Fullscreen page flag
			 * @property {string} [options.theme='a'] Page theme
			 * @property {boolean} [options.domCache=false] Use DOM cache
			 * @property {?string} [options.contentTheme=null] Page content theme
			 * @property {string} [options.headerTheme='a'] Page header theme. If headerTheme is empty `theme` will be used
			 * @property {string} [options.footerTheme='a'] Page footer theme. If footerTheme is empty `theme` will be used
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.options = {
				fullscreen: false,
				theme: "a",
				domCache: false,
				keepNativeDefault: ns.getConfig("keepNative"),
				contentTheme: null,
				headerTheme: "a",
				footerTheme: "a",
				// @removed
				addBackBtn: false,
				enhanced: false
			};

			/**
			 * Text of back button
			 * @property {string} [backBtnText='Back']
			 * @member ns.widget.mobile.Page
			 * @protected
			 * @deprecated 2.3
			 */
			Page.prototype.backBtnText = "Back";

			/**
			 * Theme of back button
			 * @property {string} [backBtnTheme=null]
			 * @member ns.widget.mobile.Page
			 * @deprecated 2.3
			 */
			Page.prototype.backBtnTheme = null;

			// Sets top-bottom css attributes for content element
			// to allow it to fill the page dynamically
			// @method contentFill
			// @param {ns.widget.mobile.Page} self
			function contentFill(self) {
				var content,
					contentStyle,
					element = self.element,
					header,
					footer,
					top = 0,
					bottom = 0;

				if (element && !self.pageSetHeight && element.classList.contains(Page.classes.uiPageActive)) {
					content = element.querySelector("[data-role=content]");
					if (content) {
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.log("Page (contentFill) on ", self.id, " styles was recalculated");
						//>>excludeEnd("tauDebug");
						contentStyle = content.style;
						header = element.querySelector("[data-role=header]");
						top = utilsDOM.getElementHeight(header);

						footer = element.querySelector("[data-role=footer]");
						bottom = utilsDOM.getElementHeight(footer);

						contentStyle.top = top + "px";
						contentStyle.bottom = bottom + "px";
						contentStyle.height = utilsDOM.getElementHeight(content.parentNode) - top - bottom + "px";
						self.pageSetHeight = true;
					}
				}
			}

			// Build header/footer/content
			// @method buildSections
			// @param {Object} options Object with options for widget
			// @param {HTMLElement} pageElement main element of widget
			// @param {string} pageTheme page theme name
			function buildSections(options, pageElement, pageTheme) {
				var pageClassList = pageElement.classList,
					pageClasses = Page.classes,
					fullscreen = options.fullscreen;

				if (fullscreen) {
					// "fullscreen" overlay positioning
					pageClassList.add(pageClasses.uiPageHeaderFullscreen);
					pageClassList.add(pageClasses.uiPageFooterFullscreen);
				} else {
					// If not fullscreen, add class to page to set top or bottom padding
					pageClassList.add(pageClasses.uiPageHeaderFixed);
					pageClassList.add(pageClasses.uiPageFooterFixed);
				}

				[].slice.call(pageElement.querySelectorAll("[data-role='header'],[data-role='content'],[data-role='footer']"))
					.forEach(function (section) {
						var role = section.getAttribute("data-role"),
							sectionTheme = section.getAttribute("data-theme"),
							currentTheme,
							sectionClassList = section.classList,
							transition,
							headerButtons,
							headerAnchors,
							footerButtons,
							footerWidth,
							footerButtonWidth,
							moreButton,
							leftButton,
							rightButton;

						sectionClassList.add(pageClasses.uiPrefix + role);

						// Adding transition classes for all matched elements
						// @todo support transition form config
						transition = section.getAttribute("data-transition") || "";

						if (transition && transition !== "none") {
							if (transition === "slide") {
								transition = role === "header" ? "slidedown" : "slideup";
							}
							sectionClassList.add(transition);
						}

						if (role === "content") {
							section.setAttribute("role", "main");
							currentTheme = sectionTheme || options.contentTheme;
							if (currentTheme) {
								sectionClassList.add(pageClasses.uiBodyPrefix + currentTheme);
							}
						} else {
							currentTheme = sectionTheme || (role === "header" ? options.headerTheme : options.footerTheme) || pageTheme;
							sectionClassList.add(pageClasses.uiBarPrefix + currentTheme);

							// We always set the ui-[header|footer]-fixed class to match Tizen design needs
							sectionClassList.add(pageClasses.uiPrefix + role + pageClasses.fixedSuffix);

							if (fullscreen) {
								sectionClassList.add(pageClasses.uiPrefix + role + pageClasses.fullscreenSuffix);
							}

							section.setAttribute("role", role === "header" ? "banner" : "contentinfo");

							if (role === "header") {
								headerAnchors = selectors.getChildrenBySelector(section, "a, div.naviframe-button, button");
								headerAnchors.forEach(function (anchor) {
									var anchorClassList = anchor.classList;
									leftButton = anchorClassList.contains(pageClasses.uiBtnLeft);
									rightButton = anchorClassList.contains(pageClasses.uiBtnRight);
								});

								if (!leftButton && headerAnchors[0] && !headerAnchors[0].classList.contains(pageClasses.uiBtnRight)) {
									leftButton = headerAnchors[0];
									leftButton.classList.add(pageClasses.uiBtnLeft);
								}

								if (!rightButton && headerAnchors[1]) {
									rightButton = headerAnchors[1];
									rightButton.classList.add(pageClasses.uiBtnRight);
								}

								headerAnchors.reverse().forEach(function (element, index) {
									element.classList.add(pageClasses.uiBtnRightPrefix + index);
								});

								headerButtons = selectors.getChildrenByTag(section, "a");
								if (headerButtons.length) {
									headerButtons.forEach(function (button) {
										engine.instanceWidget(button, "Button", {
											corners: false,
											bar: true,
											role: "button"
										});
									});
								}
								if (section.querySelector("." + pageClasses.uiTitleTextSub)) {
									sectionClassList.add(pageClasses.uiTitleMultiline);
								}
							} else if (role === "footer") {
								footerButtons = selectors.getChildrenBySelector(section, "a,div.naviframe-button,[data-role='button'],button,[type='button'],[type='submit'],[type='reset']");
								if (footerButtons.length) {
									//TODO rethink this solution
									footerWidth = section.offsetWidth || window.innerWidth;
									moreButton = selectors.getChildrenBySelector(section, "[data-icon='naviframe-more']");
									if (moreButton.length) {
										footerWidth -= utilsDOM.getElementWidth(moreButton[0]);
									}
									footerButtonWidth = footerWidth / footerButtons.length;
									footerButtons.forEach(function (button) {
										var buttonStyle = button.style;
										engine.instanceWidget(button, "Button", {
											corners: false,
											bar: true,
											role: "button"
										});
										buttonStyle.width = footerButtonWidth + "px";
									});
								}
							}

							selectors.getChildrenBySelector(section, "h1, h2, h3, h4, h5, h6").forEach(function (title) {
								var headerBtnsWidth = 0,
									headerBtnNum = 0,
									headerImgsWidth = 0,
									headerSrcNum = 0,
									width,
									titleStyle = title.style;

								title.classList.add(pageClasses.uiTitle);
								title.setAttribute("role", "heading");
								title.setAttribute("aria-level", 1);
								title.setAttribute("aria-label", "title");
								width = window.innerWidth - parseInt((titleStyle && titleStyle.marginLeft) || "8", 10) * 2 - headerBtnsWidth * headerBtnNum - headerBtnsWidth / 4 - headerImgsWidth * headerSrcNum * 4;
								titleStyle.width = width + "px";
							});
						}
					});
			}

			// Method builds widget.
			// @method buildStructure
			// @param {Object} options object with options for create page
			// @param {HTMLElement} element base element of page
			function buildStructure(options, element) {
				var pageTheme = options.theme,
					dataPageTitle = utilsDOM.getNSData(element, "title"),
					pageTitle = dataPageTitle,
					titleElement,
					classes = Page.classes;

				element.classList.add(classes.uiPage);
				element.classList.add(classes.uiBodyPrefix + pageTheme);

				if (!pageTitle) {
					titleElement = selectors.getChildrenByDataNS(element, "role=header")[0];
					if (titleElement) {
						titleElement = titleElement.getElementsByClassName(classes.uiTitle)[0];
						if (titleElement) {
							pageTitle = titleElement.innerText;
						}
					}
				}

				if (!dataPageTitle && pageTitle) {
					utilsDOM.setNSData(element, "title", pageTitle);
				}
				buildSections(options, element, pageTheme);
			}

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._build = function (element) {
				buildStructure(this.options, element);
				return element;
			};

			/*Page.prototype._updatePadding = function (page) {
				var pageStyle = page.style;
				Array.prototype.slice.call(page.querySelectorAll("[data-role='header'],[data-role='content'],[data-role='footer']")).forEach(function (section) {
					var role = section.getAttribute("data-role"),
						dataposition = section.getAttribute("data-position"),
						sectionStyle = section.style;
					if (dataposition === "fixed") {
						sectionStyle.position = "fixed";
						if (role === "header") {
							pageStyle.paddingTop = section.offsetHeight + "px";
							sectionStyle.top = 0;
						} else if (role === "footer") {
							pageStyle.paddingBottom = section.offsetHeight + "px";
							sectionStyle.bottom = 0;
						}
					}
				});
			};*/

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setActive(true, document.body);
			 *		</script>
			 *
			 * @TODO make params optional (default action should be make page active if
			 * its not in its own container)
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @param {HTMLElement} pageContainer
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setActive = function (value, pageContainer) {
				var theme = this.options.theme,
					classes = Page.classes,
					themeClass = classes.uiOverlayPrefix + theme,
					bodyClassList = pageContainer.classList;

				if (value) {
					this.element.classList.add(classes.uiPageActive);
					this.focus();
					bodyClassList.add(themeClass);
				} else {
					this.element.classList.remove(classes.uiPageActive);
					this.blur();
					bodyClassList.remove(themeClass);
				}
			};

			/**
			 * GUI Builder only : redesign page when user drag&drop header, footer
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setToolbar();
			 *		</script>
			 *
			 * @method setToolbar
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setToolbar = function () {
				this.trigger("pagebeforeshow");
			};

			/**
			 * Removes background from the page containing element
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.removeContainerBackground();
			 *		</script>
			 *
			 *#### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			$("#myPage").page("removeContainerBackground");
			 *		</script>
			 *
			 * @method removeContainerBackground
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.removeContainerBackground = function () {
				engine.getRouter().getContainer().classList.remove("ui-overlay-" + engine.getTheme().getInheritedTheme(this.element.parentNode));
			};

			/**
			 *  Sets background for page containing element
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.setContainerBackground("s");
			 *		</script>
			 *
			 * #### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			$("#myPage").page("setContainerBackground", "s");
			 *		</script>
			 *
			 * @method setContainerBackground
			 * @param {string} [theme]
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setContainerBackground = function (theme) {
				theme = theme || this.options.theme;
				engine.getRouter().getContainer().classList.add("ui-overlay-" + theme);
			};

			/**
			 * Add back button
			 * @method addBackBtn
			 * @deprecated 2.3
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.addBackBtn = function () {
				return null;
			};

			/**
			 * Returns native selector
			 *
			 * #### TAU API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage")),
			 *				s = page.keepNativeSelector();
			 *		</script>
			 *
			 * #### jQuery API
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var s = $("#myPage").page("keepNativeSelector");
			 *		</script>
			 *
			 * @method keepNativeSelector
			 * @return {string}
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.keepNativeSelector = function () {
				var options = this.options,
					optionsKeepNative = options.keepNative,
					optionsKeepNativeDefault = options.keepNativeDefault,
					keepNativeDefined = optionsKeepNative && optionsKeepNative.trim();

				if (keepNativeDefined && optionsKeepNative !== optionsKeepNativeDefault) {
					return [optionsKeepNative, optionsKeepNativeDefault].join(", ");
				}

				return optionsKeepNativeDefault;
			};


			/**
			 * This will set the content element's top or bottom padding equal to the toolbar's height
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.updatePagePadding();
			 *		</script>
			 *
			 * @method updatePagePadding
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePagePadding = function () {
				contentFill(this);
			};

			/**
			 * Calculate and update content height
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.updatePageLayout();
			 *		</script>
			 *
			 * @method updatePageLayout
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePageLayout = function () {
				contentFill(this);
			};


			/**
			 * Sets the focus to page
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.focus();
			 *		</script>
			 * @method focus
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.focus = function () {
				var autofocus = this.element.querySelector("[autofocus]");
				if (autofocus) {
					autofocus.focus();
					return;
				}
				this.element.focus();
			};

			/**
			 * Removes focus from page and all descendants
			 *
			 * **This method is only available through TAU API**
			 *
			 *		@example
			 *		<div id="myPage"></div>
			 *		<script type="text/javascript">
			 *			var page = tau.widget.page(document.getElementById("myPage"));
			 *			page.blur();
			 *		</script>
			 *
			 * @method blur
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.blur = function () {
				slice.call(this.element.querySelectorAll(":focus")).forEach(function (element) {
					element.blur();
				});
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._bindEvents = function (element) {
				var self = this;
				self.contentFillCallback = contentFill.bind(null, self);
				self.contentFillAfterResizeCallback = function () {
					self.pageSetHeight = false;
					contentFill(self);
				};
				self.destroyCallback = self.destroy.bind(self, element);
				/*
				* @TODO
				* mobile zoom and persistant toolbar
				element.addEventListener("pagebeforehide", function (e, ui) {
					var _updatePadding = this.getAttribute("data-update-page-padding") || true,
						disablePageZoom = this.getAttribute("data-disable-page-zoom") || true;
					if (disablePageZoom === true) {
						// @TODO $.mobile.zoom.enable( true );
					}
					var thisFooter = $( ".ui-footer-fixed:jqmData(id)", this ),
						thisHeader = $( ".ui-header-fixed:jqmData(id)", this ),
						nextFooter = thisFooter.length && ui.nextPage && $( ".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData( "id" ) + "')", ui.nextPage ) || $(),
						nextHeader = thisHeader.length && ui.nextPage && $( ".ui-header-fixed:jqmData(id='" + thisHeader.jqmData( "id" ) + "')", ui.nextPage ) || $();
					if ( nextFooter.length || nextHeader.length ) {
						nextFooter.add( nextHeader ).appendTo( $.mobile.pageContainer );
						ui.nextPage.one( "pageshow", function () {
							nextFooter.add( nextHeader ).appendTo( this );
						});
					}
				}, false);
				*/
				window.addEventListener("throttledresize", self.contentFillAfterResizeCallback, false);
				element.addEventListener("updatelayout", self.contentFillAfterResizeCallback, false);
				element.addEventListener("pageshow", self.contentFillCallback, true);
				self.on("pageremove", self.destroyCallback);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._refresh = function () {
				buildStructure(this.options, this.element);
				this.pageSetHeight = false;
				contentFill(this);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._destroy = function () {
				var element = this.element;
				window.removeEventListener("throttledresize", this.contentFillAfterResizeCallback, false);
				this.off("pageremove", this.destroyCallback);
				if (element) {
					element.removeEventListener("pageshow", this.contentFillCallback, true);
				}
			};

			// definition
			ns.widget.mobile.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role='page'], .ui-page",
				[
					"keepNativeSelector",
					"setContainerBackground",
					"removeContainerBackground"
				],
				Page,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
