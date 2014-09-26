/*global window, define, ns */
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
 * ## Background Settings
 * Widget allows to set fullscreen background with centered content.
 *
 *		@example
 *		<body class="ui-pagecontainer" data-background="bg.jpg">...
 *
 *
 * @class ns.widget.tv.PageContainer
 * @extends ns.widget.core.PageContainer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/PageContainer",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CorePageContainer = ns.widget.core.PageContainer,
				CorePageContainerPrototype = CorePageContainer.prototype,
				PageContainer = function () {
				},
				engine = ns.engine,
				prototype = new CorePageContainer();

			PageContainer.events = CorePageContainer.events;

			/**
			 * Build structure of PageContainer widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.tv.PageContainer
			 */
			prototype._build = function ( element ) {
				var optionsBackground = this.options.background;
				if (CorePageContainerPrototype._build) {
					element = CorePageContainerPrototype._build(element);
				}

				if (optionsBackground) {
					element.style.background = "url(" + optionsBackground + ") no-repeat center center";
				}

				return element;
			};

			/**
			 * Configure method to setup PageContainer options.
			 * @method _configure
			 * @protected
			 * @member ns.widget.tv.PageContainer
			 */
			prototype._configure = function ( ) {
				var options = this.options || {};
				/**
				 * The background attribute specifies a background image for a widget
				 * @property {string} [options.background=""] background image path
				 * @member ns.widget.tv.PageContainer
				 */
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
