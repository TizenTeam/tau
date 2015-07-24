
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
 * #### Create page widget using data-role attribute with header and footer
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

(function (window, ns) {
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
			"../../../../core/widget/core/Page",
			"../../../../core/widget/core/Button",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CorePage = ns.widget.core.Page,
				CorePagePrototype = CorePage.prototype,
				engine = ns.engine,
				selectors = ns.util.selectors,
				object = ns.util.object,
				utilsDOM = ns.util.DOM,
				Page = function () {
					var self = this;
					CorePage.call(self);
					self.options = object.copy(Page.prototype.options);
				},
				buttonClasses = ns.widget.core.Button.classes,
				classes,
				prototype = new CorePage();

			Page.prototype = prototype;

			/**
			 * Dictionary for page related css class names
			 * @property {Object} classes
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
			 * @property {string} [classes.uiHeaderFullscreen='ui-page-header-fullscreen'] Page header fullscreen class
			 * @property {string} [classes.uiFooterFullscreen='ui-page-footer-fullscreen'] Page footer fullscreen class
			 * @property {string} [classes.uiHeaderFixed='ui-page-header-fixed'] Page header fixed class
			 * @property {string} [classes.uiFooterFixed='ui-page-footer-fixed'] Page footer fixed class
			 * @property {string} [classes.uBtnLeft='ui-btn-left'] Left button class
			 * @property {string} [classes.uiBtnRight='ui-btn-right'] Right button class
			 * @property {string} [classes.uiBtnRightPrefix='ui-btn-right-'] Right button prefix
			 * @property {string} [classes.fixedSuffix='-fixed'] Class fixed suffix
			 * @property {string} [classes.fullscreenSuffix='-fullscreen'] class fullscreen suffix
			 * @member ns.widget.mobile.Page
			 * @static
			 * @readonly
			 */
			classes = object.merge({}, CorePage.classes, {
				uiPrefix: "ui-",
				uiBarPrefix: "ui-bar-",
				uiBodyPrefix: "ui-body-",
				uiBtnBack: "ui-btn-back",
				uiTabbarMarginBack: "ui-tabbar-margin-back",
				uiTitle: "ui-title",
				uiTitleTextSub: "ui-title-text-sub",
				uiTitleMultiline: "ui-title-multiline",
				uiFooterBtn: "ui-footer-btn-",
				uiHeaderFullscreen: "ui-page-header-fullscreen",
				uiFooterFullscreen: "ui-page-footer-fullscreen",
				uiHeaderFixed: "ui-page-header-fixed",
				uiFooterFixed: "ui-page-footer-fixed",
				uiOverlayPrefix: "ui-overlay-",
				uiBtnLeft: "ui-btn-left",
				uiBtnRight: "ui-btn-right",
				uiBtnRightPrefix: "ui-btn-right-",
				fixedSuffix: "-fixed",
				fullscreenSuffix: "-fullscreen",
				uiHeaderDivider: "ui-header-divider"
				// @todo put all used classes here
			});

			Page.classes = classes;

			/**
			 * Object with default options
			 * @property {Object} options
			 * @property {boolean} [options.fullscreen=false] Fullscreen page flag
			 * @property {string} [options.theme='s'] Page theme
			 * @property {boolean} [options.domCache=false] Use DOM cache
			 * @property {?string} [options.contentTheme=null] Page content theme
			 * @property {string} [options.headerTheme='s'] Page header theme. If headerTheme is empty `theme` will be used
			 * @property {string} [options.footerTheme='s'] Page footer theme. If footerTheme is empty `theme` will be used
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.options = {
				theme: "s",
				contentTheme: null,
				headerTheme: "s",
				footerTheme: "s",
				fullscreen: false,
				domCache: false,
				keepNativeDefault: ns.getConfig("keepNative"),
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

			// Build header/footer/content
			// @method buildSections
			// @param {Object} options Object with options for widget
			// @param {HTMLElement} pageElement main element of widget
			// @param {string} pageTheme page theme name
			function buildSections(options, pageElement, pageTheme) {
				var pageClassList = pageElement.classList,
					fullscreen = options.fullscreen;

				if (fullscreen) {
					// "fullscreen" overlay positioning
					pageClassList.add(classes.uiHeaderFullscreen);
					pageClassList.add(classes.uiFooterFullscreen);
				} else {
					// If not fullscreen, add class to page to set top or bottom padding
					pageClassList.add(classes.uiHeaderFixed);
					pageClassList.add(classes.uiFooterFixed);
				}

				[].slice.call(pageElement.querySelectorAll("." + classes.uiHeader +
						",." + classes.uiContent +
						",." + classes.uiFooter))
					.forEach(function (section) {
						var role = section.getAttribute("data-role"),
							sectionTheme = section.getAttribute("data-theme"),
							currentTheme,
							sectionClassList = section.classList,
							transition,
							headerButtons,
							headerButtonsWidth = 0,
							headerAnchors,
							headerDivider,
							footerButtons,
							footerWidth,
							moreButton,
							leftButton,
							rightButton,
							previousElementOfHeaderButton;

						if (!role) {
							if (sectionClassList.contains(classes.uiHeader)) {
								role = "header";
							} else if (sectionClassList.contains(classes.uiContent)) {
								role = "content";
							} else {
								role = "footer";
							}

							section.setAttribute("data-role", role);
						}

						sectionClassList.add(classes.uiPrefix + role);

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
								sectionClassList.add(classes.uiBodyPrefix + currentTheme);
							}
						} else {
							currentTheme = sectionTheme || (role === "header" ? options.headerTheme : options.footerTheme) || pageTheme;
							sectionClassList.add(classes.uiBarPrefix + currentTheme);

							// We always set the ui-[header|footer]-fixed class to match Tizen design needs
							sectionClassList.add(classes.uiPrefix + role + classes.fixedSuffix);

							if (fullscreen) {
								sectionClassList.add(classes.uiPrefix + role + classes.fullscreenSuffix);
							}

							section.setAttribute("role", role === "header" ? "banner" : "contentinfo");

							if (role === "header") {
								headerAnchors = selectors.getChildrenBySelector(section, "a, div.naviframe-button, button, [data-role=button]");
								headerAnchors.forEach(function (anchor) {
									var anchorClassList = anchor.classList;
									leftButton = anchorClassList.contains(classes.uiBtnLeft);
									rightButton = anchorClassList.contains(classes.uiBtnRight);
								});

								if (!leftButton && headerAnchors[0] && !headerAnchors[0].classList.contains(classes.uiBtnRight)) {
									leftButton = headerAnchors[0];
									utilsDOM.setNSData(leftButton, "role", "button");
									leftButton.classList.add(classes.uiBtnLeft);
								}

								if (!rightButton && headerAnchors[1]) {
									rightButton = headerAnchors[1];
									utilsDOM.setNSData(rightButton, "role", "button");
									rightButton.classList.add(classes.uiBtnRight);
								}

								headerButtons = selectors.getChildrenBySelector(section, "a,[data-role='button']");
								if (headerButtons.length) {
									headerButtons.forEach(function (button) {
										engine.instanceWidget(button, "Button");
										previousElementOfHeaderButton = button.previousElementSibling;
										// @TODO move this calculation after page show
										headerButtonsWidth += 90;//utilsDOM.getElementWidth(button, true) + 2;

									});
								}
								if (section.querySelector("." + classes.uiTitleTextSub)) {
									sectionClassList.add(classes.uiTitleMultiline);
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
									footerButtons.forEach(function (button) {
										var buttonStyle = button.style;
										engine.instanceWidget(button, "Button", {
											role: "button"
										});
									});
									section.classList.add(classes.uiFooterBtn + footerButtons.length);
								}
							}

							selectors.getChildrenBySelector(section, "h1, h2, h3, h4, h5, h6").forEach(function (title) {
								var headerImgsWidth = 0,
									headerSrcNum = 0,
									width,
									titleStyle = title.style;

								title.classList.add(classes.uiTitle);
								title.setAttribute("role", "heading");
								title.setAttribute("aria-level", 1);
								title.setAttribute("aria-label", "title");
								width = window.innerWidth - headerButtonsWidth - headerImgsWidth * headerSrcNum * 4;

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
			 * Configure widget
			 * @method _configure
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			prototype._configure = function(element) {
				CorePagePrototype._configure.call(this, element);
				// in mobile header should always be build by default
				this.options.header = true;
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._build = function (element) {
				CorePagePrototype._build.call(this, element);
				buildStructure(this.options, element);
				return element;
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
				CorePagePrototype._bindEvents.call(self, element);
				element.addEventListener("pageshow", self.contentFillAfterResizeCallback, false);
				element.addEventListener("updatelayout", self.contentFillAfterResizeCallback, false);
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._contentFill = function () {
				var self = this,
					content,
					contentStyle,
					element = self.element,
					header,
					headerDivider,
					headerBtn,
					headerBtnWidth = 0,
					pageClasses = Page.classes,
					top = 0,
					bottom = 0,
					i,
					footer,
					len;

				CorePagePrototype._contentFill.call(self, element);
				content = element.querySelector("." + pageClasses.uiContent);
				if (content) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Page (contentFill) on ", self.id, " styles was recalculated");
					//>>excludeEnd("tauDebug");
					contentStyle = content.style;
					header = element.querySelector("." + pageClasses.uiHeader);

					if (header) {
						headerDivider = header.getElementsByClassName(pageClasses.uiHeaderDivider);
						len = headerDivider.length;
						if (len) {
							headerBtn = header.getElementsByClassName(buttonClasses.uiBtn);
							// Header divider exist
							for (i = 0; i < len; i++) {
								headerBtnWidth += headerBtn[i].offsetWidth;
								headerDivider[i].style.right = headerBtnWidth + "px";
							}
						}
						top = utilsDOM.getElementHeight(header);
					}

					footer = element.querySelector("." + pageClasses.uiFooter);
					bottom = utilsDOM.getElementHeight(footer);

					contentStyle.top = top + "px";
					contentStyle.bottom = bottom + "px";
					contentStyle.height = window.innerHeight - top - bottom + "px";
				}
			};

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 *
			 * !!!This method is only available through TAU API!!!
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
					themeClass = classes.uiOverlayPrefix + theme,
					bodyClassList;

				bodyClassList = pageContainer.classList;

				CorePagePrototype.setActive.call(this, value);

				if (value) {
					bodyClassList.add(themeClass);
				} else {
					bodyClassList.remove(themeClass);
				}
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._refresh = function () {
				var self = this;
				buildStructure(self.options, self.element);
				CorePagePrototype._refresh.call(self);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype._destroy = function () {
				var self = this,
					element = self.element;
				CorePagePrototype._destroy.call(self);
				element.removeEventListener("updatelayout", self.contentFillAfterResizeCallback, false);
				element.removeEventListener("pageshow", self.contentFillAfterResizeCallback, false);
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
			 * @deprecated 2.3
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.removeContainerBackground = function () {
				ns.warn("removeContainerBackground is deprecated at 2.3");
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
			 * @deprecated 2.3
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setContainerBackground = function (theme) {
				ns.warn("setContainerBackground is deprecated at 2.3");
			};

			/**
			 * Add back button
			 * @method addBackBtn
			 * @deprecated 2.3
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.addBackBtn = function () {
				ns.warn("addBackBtn is deprecated at 2.3");
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

			prototype.bindEvents = function (element, onlyBuild) {
				CorePagePrototype.bindEvents.call(this, element, onlyBuild);
				this.trigger("pageinit");
			};

			// definition
			ns.widget.mobile.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role='page'], .ui-page",
				[
					"focus",
					"blur",
					"setActive",
					"keepNativeSelector",
					"setContainerBackground",
					"removeContainerBackground"
				],
				Page,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
