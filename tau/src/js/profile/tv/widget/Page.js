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
 * # PageContainer Widget
 * PageContainer is a widget, which is supposed to have multiple child pages but display only one at a time.
 *
 * It allows for adding new pages, switching between them and displaying progress bars indicating loading process.
 *
 * @class ns.widget.wearable.PageContainer
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Krzysztof Głodowski <k.glodowski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../profile/wearable/widget/wearable/Page",
			"../../../core/engine",
			"../../../core/util/DOM/css",
			"./BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var WearablePage = ns.widget.wearable.Page,
				WearablePagePrototype = WearablePage.prototype,
				BaseKeyboardSupport = ns.widget.tv.BaseKeyboardSupport,
				classes = WearablePage.classes,
				util = ns.util,
				DOM = util.DOM,
				Page = function () {
					BaseKeyboardSupport.call(this);
				},
				engine = ns.engine,
				prototype = new WearablePage();

			Page.events = WearablePage.events;
			Page.classes = WearablePage.classes;

			prototype.onShow = function() {
				WearablePagePrototype.onShow.call(this);
				this._supportKeyboard = true;
			};

			prototype.onHide = function() {
				WearablePagePrototype.onHide.call(this);
				this._supportKeyboard = false;
			};

			/**
			 * Sets top-bottom css attributes for content element
			 * to allow it to fill the page dynamically
			 * @method _contentFill
			 * @member ns.widget.wearable.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					contentSelector = classes.uiContent,
					headerSelector = classes.uiHeader,
					footerSelector = classes.uiFooter,
					extraHeight = 0,
					children = [].slice.call(element.children),
					childrenLength = children.length,
					elementStyle = element.style,
					i,
					node,
					contentStyle,
					marginTop,
					marginBottom,
					nodeStyle;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					if (node.classList.contains(headerSelector) ||
						node.classList.contains(footerSelector)) {
						extraHeight += DOM.getElementHeight(node);
					}
				}
				for (i = 0; i < childrenLength; i++) {
					node = children[i];
					nodeStyle = node.style;
					if (node.classList.contains(contentSelector)) {
						contentStyle = window.getComputedStyle(node);
						marginTop = parseFloat(contentStyle.marginTop);
						marginBottom = parseFloat(contentStyle.marginBottom);
						nodeStyle.height = (screenHeight - extraHeight - marginTop - marginBottom - 118) + "px";
						nodeStyle.width = (screenWidth - 282) + "px";
					}
				}
			};

			prototype._bindEvents = function(element) {
				WearablePagePrototype._bindEvents.call(this, element);
				this._bindEventKey();
			};

			prototype._destroy = function() {
				this._destroyEventKey();
				WearablePagePrototype._destroy.call(this);
			};

			Page.prototype = prototype;

			// definition
			ns.widget.tv.Page = Page;

			engine.defineWidget(
				"page",
				"[data-role=page],.ui-page",
				["onBeforeShow", "onShow", "onBeforeHide", "onHide", "setActive"],
				Page,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
