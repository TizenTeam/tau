/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * # PageContainer
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
 * @class ns.widget.mobile.PageContainer
 * @extends ns.widget.core.PageContainer
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../mobile",
			"../../../../core/widget/core/PageContainer",
			"../../../../core/engine",
			"../../../../core/util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CorePageContainer = ns.widget.core.PageContainer,
				PageContainer = function () {
					CorePageContainer.call(this);
				},
				util = ns.util,
				engine = ns.engine,
				prototype = new CorePageContainer();

			PageContainer.events = CorePageContainer.events;
			PageContainer.classes = CorePageContainer.classes;

			/**
			 * This method adds an element as a page.
			 * @method _include
			 * @param {HTMLElement} page an element to add
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.PageContainer
			 * @protected
			 */
			prototype._include = function (page) {
				var element = this.element;

				if (!page.parentNode || page.ownerDocument !== document) {
					page = util.importEvaluateAndAppendElement(page, element);
				}
				return page;
			};

			PageContainer.prototype = prototype;

			// definition
			ns.widget.mobile.PageContainer = PageContainer;

			engine.defineWidget(
				"pagecontainer",
				"body",
				["change", "getActivePage", "showLoading", "hideLoading"],
				PageContainer,
				"mobile",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
