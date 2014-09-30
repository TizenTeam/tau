/*global window, define */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.tv.PageContainer
 * @extends ns.widget.wearable.PageContainer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../profile/wearable/widget/wearable/PageContainer",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePageContainer = ns.widget.wearable.PageContainer,
				WearablePageContainerPrototype = WearablePageContainer.prototype,
				PageContainer = function () {
				},
				engine = ns.engine,
				prototype = new WearablePageContainer();

			PageContainer.events = WearablePageContainer.events;

			prototype._build = function ( element ) {
				var optionsBackground = this.options.background;
				if (WearablePageContainerPrototype._build) {
					element = WearablePageContainerPrototype._build(element);
				}

				if (optionsBackground) {
					element.style.background = "url(" + optionsBackground + ") no-repeat center center";
				}

				return element;
			};

			prototype._configure = function ( ) {
				var options = this.options || {};
				options.background = null;
				this.options = options;
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.tv.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"body",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
