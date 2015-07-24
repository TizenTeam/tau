/*global define, ns */
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
 * # Index Scrollbar Widget
 * The index scrollbar widget shows a shortcut list that can be bound with a other widget eg. listview.
 *
 * If you move the mouse on the shortcut column then a pop-up with the text currently
 * under the cursor is also displayed.
 *
 *
 * ## Default selectors
 *
 * In default all elements with class _ui-indexcrollbar_ are changed to Tizen Web UI Index Scrollbar
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul data-role="listview" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * #### Create Index Scrollbar widget using tau method:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="list" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var fastscroll = tau.widget.FastScroll(document.getElementById("list"));
 *		</script>
 *
 * #### Create Index Scrollbar widget using jQueryMobile notation:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="list" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var fastscroll = $("#list").fastscroll();
 *		</script>
 *
 * ## Options
 *
 * ### Index Scrollbar
 * _data-fastscroll_ option set to true, creates a fast scroll using the HTML unordered list (&lt;ul&gt;) element.
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="contacts" data-role="listview" data-fastscroll="true">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *		@example
 *		<div data-role="page" id="main">
 *			<div data-role="content">
 *				<ul id="contacts">
 *					<li data-role="list-divider">A</li>
 *					<li>Anton</li>
 *					<li>Arabella</li>
 *					<li data-role="list-divider">B</li>
 *					<li>Barry</li>
 *					<li>Bily</li>
 *				</ul>
 *			</div>
 *		</div>
 *		<script>
 *			var element = document.getElementById("contacts"),
 *				contacts = tau.widget.FastScroll(element, {fastscroll: true});
 *
 *			contacts.methodName(methodArgument1, methodArgument2, ...);
 *
 *			// or JQueryMobile notation:
 *			$(element).contacts("methodName", methodArgument1, methodArgument2, ...);
 *		</script>
 *
 * @class ns.widget.mobile.IndexScrollbar
 * @extends ns.widget.core.IndexScrollbar
 * @since 2.0
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/indexscrollbar/IndexScrollbar",
			"../mobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var engine = ns.engine,
				CoreIndexScrollbar = ns.widget.core.IndexScrollbar,
				prototype = new CoreIndexScrollbar(),
				IndexScrollbar = function () {
					CoreIndexScrollbar.call(this);
				};

			// definition
			IndexScrollbar.prototype = prototype;
			ns.widget.mobile.IndexScrollbar = IndexScrollbar;

			engine.defineWidget(
				"IndexScrollbar",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
