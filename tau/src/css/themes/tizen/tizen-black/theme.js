/*global define, ns */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var THEME = 's',
				ThemeCommon = ns.theme.ThemeCommon,
				Page = ns.widget.mobile.Page,
				Listview = ns.widget.mobile.Listview,
				Button = ns.widget.mobile.Button,
				theme = new ThemeCommon(),

				customizePage = function () {
					if (Page) {
						// Clear default theme for child elements
						(function (o) {
							o.backBtnTheme= THEME;
							o.headerTheme = THEME;
							o.footerTheme = THEME;
							o.theme = THEME;
						}(Page.prototype.options));
					}
				},

				customizeListview = function () {
					if (Listview) {
						// clear listview
						(function (o) {
							o.theme = THEME;
							o.countTheme = THEME;
							o.headerTheme = THEME;
							o.dividerTheme = THEME;
							o.splitTheme = THEME;
						}(Listview.prototype.options));
					}
				},

				customizeButton = function () {
					if (Button) {
						//clear button theme
						Button.prototype.options.theme = THEME;
					}
				},

				customizeFrameworkData = function () {
					if (ns.frameworkData) {
						// Original scale of the theme
						ns.frameworkData.defaultViewportWidth = 360; // Fit to device-width
						ns.frameworkData.defaultFontSize = 22;
					}
				};

				/*
				customizeCollapsible = function () {
					if (ns.widget.Collapsible) {
						// Collapsible
						(function (o) {
							o.heading = o.heading + ',li';		// Add listitem as a heading
							o.inset = false;
							o.iconPos = "right";	// Move iconPos to right position
							o.collapsedIcon = "arrow-u";
							o.expandedIcon = "arrow-d";
							o.animation = true;
							o.customEventHandler = function (isCollapse) {
								var self = this,
									c = $(self).children('.ui-collapsible-content')[0],
									h;

								function _getHeight(el) {
									var hh = 0,
										heading = $(el).children('.ui-collapsible-heading')[0],
										content = $(el).children('.ui-collapsible-content')[0];

									hh += heading.clientHeight;
									$(content).children().each(function (idx, _el) {
										if ($(_el).hasClass('ui-collapsible')) {	// recursive call for nested collapsible list
											hh += _getHeight(_el);
										} else {
											hh += _el.clientHeight;
										}
									});
									return hh;
								}

								if (isCollapse) {	// collapse!
									// remember current height
									$(c).data('max-height', _getHeight(self));
									$(self).parentsUntil('.ui-page', '.ui-collapsible').each(function (idx, el) {
										var content = $(el).children('.ui-collapsible-content')[0];
										$(content).data('max-height', _getHeight(el));
									});
								} else {	// expand!
									h = $(c).data('max-height');
									if (!h) {
										h = document.body.clientHeight;
										$(c).data('max-height', h);
									}
									$(c).css('max-height', h);
									$(self).parentsUntil('.ui-page', '.ui-collapsible').each(function (idx, el) {
										var content = $(el).children('.ui-collapsible-content')[0];
										$(content).css('max-height', _getHeight(el));
									});
								}
							};
						}(ns.widget.Collapsible.prototype.options));
					};
				};
				*/

			theme.enable = function () {
				var self = this;
				self._enable();

				customizePage();
				customizeListview();
				customizeButton();
				customizeFrameworkData();

				return self;
			};

			theme.disable = function () {
				var self = this;
				self._disable();
				return self;
			};

			// activate theme;
			theme.enable();
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
