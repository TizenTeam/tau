/*global define, ns */
//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
(function (ns) {
	"use strict";
	define(
		[
			'../utils/object',
			'../theme' // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.utils.object,
				nsTheme = ns.theme,
				ThemeCommon = function () {
					var self = this;
					self.enabled = false;
					self.backup = null;
				},
				protoThemeCommon = {};

			protoThemeCommon._enable = function () {
				var self = this;
				// disable it active theme
				if (nsTheme._activeTheme) {
					nsTheme._activeTheme.disable();
				}
				self.backup = {};
				self.backup.frameworkData = utilsObject.copy(ns.frameworkData);
				self.backup.widgetOptions = {};
				self.storeAllWidgetOptions();
				nsTheme._activeTheme = self;
				self.enabled = true;
			};

			protoThemeCommon._disable = function () {
				var self = this;
				self.restoreAllWidgetOptions();
				if (self.backup.frameworkData) {
					ns.frameworkData = self.backup.frameworkData;
				}
				nsTheme._activeTheme = null;
				self.enabled = false;
			};

			protoThemeCommon.storeAllWidgetOptions = function () {
				var self = this,
					i,
					widgets = ns.engine.getDefinitions();
				for (i in widgets) {
					self.backup.widgetOptions[i] = utilsObject.copy(widgets[i].widgetClass.prototype.options);
				}
			};

			protoThemeCommon.restoreAllWidgetOptions = function () {
				var self = this,
					i,
					widgets = ns.engine.getDefinitions();
				for (i in self.backup.widgetOptions) {
					widgets[i].widgetClass.prototype.options = utilsObject.copy(self.backup.widgetOptions[i]);
				}
			};
			ThemeCommon.prototype = protoThemeCommon;
			nsTheme.ThemeCommon = ThemeCommon;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
}(ns));
//>>excludeEnd("tauBuildExclude");