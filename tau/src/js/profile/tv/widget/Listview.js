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
/*jslint nomen: true */
/**
 * # Listview Widget
 *
 * Shows a list view.
 *
 * ## Default selectors
 *
 * Default selector for listview widget is class *ui-listview*.
 *
 * ## HTML Examples
 *
 * To add a list widget to the application, use the following code.
 *
 * ### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * ### List with link items
 *
 * You can add a list widget with a link and press effect that allows the user to click each list item as follows:
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li>
 *                 <a href="#">1line</a>
 *             </li>
 *             <li>
 *                 <a href="#">2line</a>
 *             </li>
 *             <li>
 *                 <a href="#">3line</a>
 *             </li>
 *             <li>
 *                 <a href="#">4line</a>
 *             </li>
 *             <li>
 *                 <a href="#">5line</a>
 *             </li>
 *         </ul>
 *
 * ### List with checkboxes
 *
 * To create list with checkboxes use class *li-has-checkbox* for 'li' tag.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-checkbox">
 *                 <label>
 *                      List 01
 *                      <input type="checkbox" id="checkbox-1"/>
 *                      <label for="checkbox-1"></label>
 *                 </label>
 *             </li>
 *             <li class="li-has-checkbox">
 *                 <label>
 *                      List 01
 *                      <input type="checkbox" id="checkbox-1"/>
 *                      <label for="checkbox-1"></label>
 *                 </label>
 *             </li>
 *         </ul>
 *
 * ### List with radio buttons
 *
 * To create list with radio buttons use class *li-has-radio* for 'li' tag.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-radio">
 *                 <label>
 *                      Radio 01
 *                      <input type="radio" name="radio-sample" checked="checked" id="rd-1"/>
 *                      <label for="rd-1"></label>
 *                 </label>
 *             </li>
 *             <li class="li-has-radio">
 *                 <label>
 *                      Radio 02
 *                      <input type="radio" name="radio-sample" id="rd-2"/>
 *                      <label for="rd-2"></label>
 *                 </label>
 *             </li>
 *         </ul>
 *
 * ### Multiline list
 *
 * To to apply multiline style use *li-has-multiline* and *li-text-sub* classes. See example code.
 *
 *      @example
 *         <ul class="ui-listview">
 *             <li class="li-has-multiline">
 *                 <a href="#">
 *                     Wallpaper
 *                     <span class="li-text-sub">Overall size of fonts</span>
 *                 </a>
 *             </li>
 *             <li class="li-has-multiline">
 *                 <a href="#">
 *                     Wallpaper
 *                     <span class="li-text-sub">Overall size of fonts</span>
 *                 </a>
 *             </li>
 *         </ul>
 *
 * @class ns.widget.tv.Listview
 * @extends ns.widget.core.Listview
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../tv",
			"../../../core/widget/core/Listview",
			"../../../core/util/object",
			"../../../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreListview = ns.widget.core.Listview,
				engine = ns.engine,
				utilObject = ns.util.object,
				Listview = function () {
					CoreListview.call(this);
				},
				prototype = new CoreListview();

			Listview.events = CoreListview.events;
			Listview.classes = utilObject.merge({}, CoreListview.classes, {
				transparent: "ui-listview-transparent"
			});

			Listview.prototype = prototype;
			ns.widget.tv.Listview = Listview;

			engine.defineWidget(
				"Listview",
				".ui-listview, [data-role=listview]",
				[],
				Listview,
				"tv",
				true
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
