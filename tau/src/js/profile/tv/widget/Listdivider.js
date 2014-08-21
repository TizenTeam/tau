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
/*jslint nomen: true */
/**
 * # List Divider Widget
 * List divider widget creates a list separator, which can be used for building grouping lists using.
 *
 *
 * ## Default selectors
 * In all elements with _data-role=listdivider_ are changed to Tizen Web UI ListDivider.
 *
 * In addition all elements with class _ui-listdivider_ are changed to Tizen Web UI ListDivider.
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider">Item styles</li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *			<li><a href="#">Normal lists</a></li>
 *		</ul>
 *
 * ## Manual constructor
 * For manual creation of listdivider widget you can use constructor of widget:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			var listdivider = tau.widget.ListDivider(document.getElementById("listdivider"));
 *		</script>
 *
 * If jQuery library is loaded, its method can be used:
 *
 *		@example
 *		<ul data-role="listview">
 *			<li>Item</li>
 *			<li id="listdivider">Divider</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *		<script>
 *			$("#listdivider").listdivider();
 *		</script>
 *
 * ## Options
 *
 * ### Style
 * _data-style_ string ["normal" | "checkbox" | "dialogue"] Option sets the style of the list divider.
 *
 * #### Checkbox
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="checkbox">
 *				<form><input type="checkbox">Select All</form>
 *			</li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *			<li><form><input type="checkbox">Item</form></li>
 *		</ul>
 *
 * #### Dialogue
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-style="dialogue">Items</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Theme
 * _data-theme_ string Theme for list divider
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-theme="c">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Folded
 * _data-folded_ string ["true" | "false"] Decide to show divider press effect or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-folded="true">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * ### Line
 * _data-line_ string ["true" | "false"] Decide to draw divider line or not
 *
 *		@example
 *		<ul data-role="listview">
 *			<li data-role="list-divider" data-line="false">Item styles</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *			<li>Item</li>
 *		</ul>
 *
 * @class ns.widget.tv.ListDivider
 * @extends ns.widget.mobile.ListDivider
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../widget",
			"../../../profile/mobile/widget/mobile/Listdivider"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var MobileListDivider = ns.widget.mobile.ListDivider,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.tv.ListDivider
				 * @private
				 * @static
				 */
				engine = ns.engine,
				ListDivider = function () {
					MobileListDivider.call(this);
				},
				prototype = new MobileListDivider();

			ListDivider.events = MobileListDivider.events;
			ListDivider.classes = MobileListDivider.classes;
			ListDivider.prototype = prototype;
			// definition
			ns.widget.tv.ListDivider = ListDivider;
			engine.defineWidget(
				"ListDivider",
				"[data-role='list-divider'], .ui-list-divider",
				[],
				ListDivider,
				"tv"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.tv.ListDivider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
