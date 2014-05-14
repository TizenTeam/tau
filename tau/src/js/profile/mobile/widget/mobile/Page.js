/*global window, define */
/*jslint nomen: true */
/**
 * #Page Widget
 *
 * @class ns.widget.mobile.Page
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @alias Page
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/selectors",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/DOM/css",
			"../../../../core/utils/object",
			"../../../../core/events/orientationchange",
			"../mobile",
			"../../../../core/theme",
			"./BaseWidgetMobile",
			"./Button",
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} BaseWidget Alias for {@link ns.widget.mobile.BaseWidgetMobile}
			 * @member ns.widget.mobile.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine Alias for {@link ns.engine}
				 * @member ns.widget.mobile.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} selectors Alias for {@link ns.utils.selectors}
				 * @member ns.widget.mobile.Page
				 * @private
				 * @static
				 */
				selectors = ns.utils.selectors,
				/**
				 * @property {Object} object Alias for {@link ns.utils.object}
				 * @member ns.widget.mobile.Page
				 * @private
				 * @static
				 */
				object = ns.utils.object,
				/**
				 * @property {Object} utilsDOM Alias for {@link ns.utils.DOM}
				 * @member ns.widget.mobile.Page
				 * @private
				 * @static
				 */
				utilsDOM = ns.utils.DOM,
				/**
				 * @method slice Alias for array slice method
				 * @member ns.widget.mobile.Page
				 * @private
				 * @static
				 */
				slice = [].slice,

				Page = function () {
					this.pageSetHeight = false;
					this.contentFillCallback = null;
					this.contentFillAfterResizeCallback = null;
					this.destroyCallback = null;
					this.options = object.copy(Page.prototype.options);
				};

			/**
			 * @property {Object} classes Dictionary for page related css class names
			 * @member ns.widget.mobile.Page
			 * @static
			 */
			Page.classes = {
				uiPrefix: 'ui-',
				uiBarPrefix: 'ui-bar-',
				uiBodyPrefix: 'ui-body-',
				uiBtnBack: 'ui-btn-back',
				uiTabbarMarginBack: 'ui-tabbar-margin-back',
				uiTitle: 'ui-title',
				uiTitleTextSub: 'ui-title-text-sub',
				uiTitleMultiline: "ui-title-multiline",
				uiPage: 'ui-page',
				uiPageActive: 'ui-page-active',
				uiPageHeaderFullscreen: 'ui-page-header-fullscreen',
				uiPageFooterFullscreen: 'ui-page-footer-fullscreen',
				uiPageHeaderFixed: 'ui-page-header-fixed',
				uiPageFooterFixed: 'ui-page-footer-fixed',
				uiOverlayPrefix: 'ui-overlay-',
				uiBtnLeft: 'ui-btn-left',
				uiBtnRight: 'ui-btn-right',
				uiBtnRightPrefix: 'ui-btn-right-',
				fixedSuffix: '-fixed',
				fullscreenSuffix: '-fullscreen'
				// @todo put all used classes here
			};

			Page.prototype = new BaseWidget();

			/**
			 * @property {Object} options Object with default options
			 * @property {boolean} [options.fullscreen=false] Fullscreen page flag
			 * @property {string} [options.theme='s'] Page theme
			 * @property {boolean} [options.domCache=false] Use DOM cache
			 * @property {?string} [options.contentTheme=null] Page content theme
			 * @property {string} [options.headerTheme='s'] Page header theme. If headerTheme is empty `theme` will be used
			 * @property {string} [options.footerTheme='s'] Page footer theme. If footerTheme is empty `theme` will be used
			 * @property {boolean} [options.addBackBtn=false] **[REMOVED]** Add back button
			 * @property {boolean} [options.enhanced=false] **[REMOVED]** Is enhanced
			 * @member ns.widget.mobile.Page
			 * @instance
			*/
			Page.prototype.options = {
				fullscreen: false,
				theme: 'a',
				domCache: false,
				keepNativeDefault: ns.getConfig('keepNative'),
				contentTheme: null,
				headerTheme: 'a',
				footerTheme: 'a',
				// @removed
				addBackBtn: false,
				enhanced: false
			};

			/*
			 * @todo allow to change all of this
			 */

			/**
			* @property {string} [backBtnText='Back'] Text of back button
			* @member ns.widget.mobile.Page
			* @protected
			*/
			Page.prototype.backBtnText = "Back";
			/**
			* @property {string} [backBtnTheme=null] Theme of back button
			* @member ns.widget.mobile.Page
			* @protected
			*/
			Page.prototype.backBtnTheme = null;

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method contentFill
			 * @param {ns.widget.mobile.Page} self
			 * @member ns.widget.mobile.Page
			 * @private
			 * @static
			 */
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
						ns.log('Page (contentFill) on ', self.id, ' styles was recalculated');
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

			/**
			 * Build header/footer/content
			 * @method buildSections
             * @param {Object} options Object with options for widget
			 * @param {HTMLElement} pageElement main element of widget
			 * @param {string} pageTheme page theme name
			 * @protected
			 * @member ns.widget.mobile.Page
			 * @instance
			 */
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
						transition = section.getAttribute('data-transition') || '';

						if (transition && transition !== "none") {
							if (transition === "slide") {
								transition = role === "header" ? "slidedown" : "slideup";
							}
							sectionClassList.add(transition);
						}

						if (role === 'content') {
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
											role: 'button'
										});
									});
								}
								if (section.querySelector('.' + pageClasses.uiTitleTextSub)) {
									sectionClassList.add(pageClasses.uiTitleMultiline);
								}
							}else if (role === "footer"){
								footerButtons = selectors.getChildrenBySelector(section, "a,div.naviframe-button,[data-role='button'],button,[type='button'],[type='submit'],[type='reset']");
								if (footerButtons.length) {
									//TODO rethink this solution
									footerWidth = section.offsetWidth ? section.offsetWidth : window.innerWidth;
									moreButton = selectors.getChildrenBySelector(section, "[data-icon='naviframe-more']");
									if(moreButton.length){
										footerWidth -= utilsDOM.getElementWidth(moreButton[0]);
									}
									footerButtonWidth = footerWidth/footerButtons.length;
									footerButtons.forEach(function (button) {
										var buttonStyle = button.style;
										engine.instanceWidget(button, "Button", {
											corners: false,
											bar: true,
											role: 'button'
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
								title.setAttribute('role', 'heading');
								title.setAttribute('aria-level', '1');
								title.setAttribute('aria-label', 'title');
								width = window.innerWidth - parseInt((titleStyle && titleStyle.marginLeft) || "8", 10) * 2 - headerBtnsWidth * headerBtnNum - headerBtnsWidth / 4 - headerImgsWidth * headerSrcNum * 4;
								titleStyle.width = width + 'px';
							});
						}
					});
			};

			/**
			 * Method builds widget.
             *
			 * @method buildStructure
			 * @param {Object} options object with options for create page
			 * @param {HTMLElement} element base element of page
			 * @protected
			 * @member ns.widget.mobile.Page
			 * @instance
			 */
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
			 * @instance
			 */
			Page.prototype._build = function (element) {
				buildStructure(this.options, element);
				return element;
			};

			/*Page.prototype._updatePadding = function (page) {
				var pageStyle = page.style;
				Array.prototype.slice.call(page.querySelectorAll("[data-role='header'],[data-role='content'],[data-role='footer']")).forEach(function (section) {
					var role = section.getAttribute("data-role"),
						dataposition = section.getAttribute('data-position'),
						sectionStyle = section.style;
					if (dataposition === 'fixed') {
						sectionStyle.position = 'fixed';
						if (role === 'header') {
							pageStyle.paddingTop = section.offsetHeight + 'px';
							sectionStyle.top = 0;
						} else if (role === 'footer') {
							pageStyle.paddingBottom = section.offsetHeight + 'px';
							sectionStyle.bottom = 0;
						}
					}
				});
			};*/

			/**
			 * Set page active / unactive
			 * Sets ui-overlay-... class on `body` depending on current theme
			 * @method setActive
			 * @param {boolean} value if true then page will be active if false page will be unactive
			 * @param {HTMLElement} pageContainer
			 * @member ns.widget.mobile.Page
			 * @instance
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
			 * @method setToolbar
			 * @instance
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setToolbar = function () {
				this.trigger("pagebeforeshow");
			};

			/**
			 * Remove style on container
			 * @method removeContainerBackground
			 * @instance
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.removeContainerBackground = function() {
				engine.getRouter().getContainer().classList.remove("ui-overlay-" + engine.getTheme().getInheritedTheme( this.element.parentNode ) );
			};

			/**
			 * set the page container background to the page theme
			 * @method setContainerBackground
			 * @param theme
			 * @instance
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.setContainerBackground = function(theme) {
				theme = theme || this.options.theme;
				engine.getRouter().getContainer().classList.add("ui-overlay-" + theme );
			};

			/**
			 * Add back button
			 * @method addBackBtn
			 * @instance
			 * @deprecated
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.addBackBtn = function() {
				return null;
			};

			/**
			 * Generate keep native selector
			 * @method keepNativeSelector
			 * @instance
			 * @return {string}
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.keepNativeSelector = function() {
				var options = this.options,
					optionsKeepNative = options.keepNative,
					optionsKeepNativeDefault = options.keepNativeDefault,
					keepNativeDefined = optionsKeepNative && optionsKeepNative.trim();

				if ( keepNativeDefined && optionsKeepNative !== optionsKeepNativeDefault ) {
					return [optionsKeepNative, optionsKeepNativeDefault].join( ", " );
				}

				return optionsKeepNativeDefault;
			};


			/**
			 * This will set the content element's top or bottom padding equal to the toolbar's height
			 * @method updatePagePadding
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePagePadding = function () {
				contentFill(this);
			};

			/**
			 * Calculate and update content height
			 * @method updatePageLayout
			 * @instance
			 * @member ns.widget.mobile.Page
			 */
			Page.prototype.updatePageLayout = function () {
				contentFill(this);
			};


			Page.prototype.focus = function () {
				var autofocus = this.element.querySelector("[autofocus]");
				if (autofocus) {
					autofocus.focus();
					return;
				}
				this.element.focus();
			};

			/**
			 * Set blur on all focused elements
			 * @method blur
			 * @member ns.widget.mobile.Page
			 * @instance
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
			 * @instance
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
					var _updatePadding = this.getAttribute('data-update-page-padding') || true,
						disablePageZoom = this.getAttribute('data-disable-page-zoom') || true;
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
				element.addEventListener("pageshow", self.contentFillCallback, false);
				self.on("pageremove", self.destroyCallback);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Page
			 * @instance
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
			 * @instance
			 */
			Page.prototype._destroy = function () {
				var element = this.element;
				window.removeEventListener("throttledresize", this.contentFillAfterResizeCallback, false);
				this.off("pageremove", this.destroyCallback);
				if (element) {
					element.removeEventListener("pageshow", this.contentFillCallback, false);
				}
			};

			// definition
			ns.widget.mobile.Page = Page;
			engine.defineWidget(
				"Page",
				"[data-role='page'], .ui-page",
				[],
				Page,
				'mobile'
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
