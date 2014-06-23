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
 * # Button Widget
 * Shows a control that can be used to generate an action event.
 *
 * ## Default selectors
 * The button widget shows a control on the screen that you can use to generate an action event when it is pressed and released. This widget is coded with standard HTML anchor and input elements.
 *
 * Default selector for buttons is class *ui-btn*
 *
 * ### HTML Examples
 *
 * #### Standard button
 * To add a button widget to the application, use the following code:
 *
 *      @example
 *      <button type="button" class="ui-btn">Button</button>
 *      <a href="#" class="ui-btn">Button</a>
 *      <input type="button" class="ui-btn" value="Button" />
 *
 * #### Inline button
 *
 *      @example
 *      <input type="button" class="ui-btn ui-inline" value="Button" />
 *
 * #### Multiline text button
 *
 *      @example
 *      <a href="#" class="ui-btn ui-multiline ui-inline">A Button<br />Icon</a>
 *
 * ## Options
 *
 * ### Icons
 * Buttons can contains icons
 *
 * Creates an icon button in the header area is permitted but in content or footer area creating icon are not supported.
 *
 * To use menu icon in header add class *ui-more* to the button element:
 *
 *      @example
 *      <button class="ui-btn ui-more ui-icon-overflow">More Options</button>
 *
 * Samsung Gear Web UI Framework supports 3 icon css styles:
 *
 *  - ui-icon-detail
 *  - ui-icon-overflow
 *  - ui-icon-selectall
 *
 * ### Disabled
 *
 * If you want to make disabled button, add attribute *disabled* in button tag:
 *
 *      @example
 *      <button class="ui-btn" disabled="disabled">Button disabled</button>
 *
 * ### Inline
 *
 * If you want to make inline button, add class *ui-inline* to button element:
 *
 *      @example
 *      <button class="ui-btn ui-inline">Inline button</button>
 *
 * ### Multiline
 *
 * If you want to make multiline text button, add *ui-multiline* class
 *
 *      @example
 *      <button class="ui-btn ui-multiline">Multiline button</button>
 *
 * ### Color theme
 *
 *To optimize color support for the Samsung Gear, the following styles below are supported
 *
 * <table>
 *  <tr>
 *      <th>Class</th>
 *      <th>Default</th>
 *      <th>Press</th>
 *      <th>Disable</th>
 *  </tr>
 *  <tr>
 *      <td>ui-color-red</td>
 *      <td>#ce2302</td>
 *      <td>#dd654e</td>
 *      <td>#3d0a0a</td>
 *  </tr>
 *  <tr>
 *      <td>ui-color-orange</td>
 *      <td>#ed8600</td>
 *      <td>#f0aa56</td>
 *      <td>#462805</td>
 *  </tr>
 *  <tr>
 *      <td>ui-color-green</td>
 *      <td>#64a323</td>
 *      <td>#92be5e</td>
 *      <td>#1e3108</td>
 *  </tr>
 * </table>
 *
 * ### Button Group
 *
 * You can group buttons in columns or rows. The following table lists the supported button column and row classes.
 *
 * <table>
 *  <tr>
 *      <th>Class</th>
 *      <th>Description</th>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-1</td>
 *      <td>Defines the button column width as 100% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-2</td>
 *      <td>Defines the button column width as 50% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-3</td>
 *      <td>Defines the button column width as 33% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-row</td>
 *      <td>Arranges the buttons in a row.</td>
 *  </tr>
 * </table>
 *
 * To implement the button groups, use the following code:
 *
 * #### For columns:
 *
 *      @example
 *      <div class="ui-grid-col-3" style="height:76px">
 *          <button type="button" class="ui-btn">Button Circle</button>
 *          <a href="#" class="ui-btn ui-color-red" >A Button Circle</a>
 *          <input type="button" class="ui-btn ui-color-orange" value="Input Button Circle" />
 *      </div>
 *
 * #### For rows:
 *
 *      @example
 *      <div class="ui-grid-row">
 *          <button type="button" class="ui-btn">Button Circle</button>
 *          <a href="#" class="ui-btn ui-color-red" >A Button Circle</a>
 *          <input type="button" class="ui-btn ui-color-orange" value="Input Button Circle" />
 *      </div>
 * @class ns.widget.wearable.Button
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				Button = function () {
					return this;
				},
				prototype = new BaseWidget();

			Button.events = {};

			/**
			* build Button
			* @method _build
			* @private
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @member ns.widget.wearable.Button
			*/
			prototype._build = function (element) {
				return element;
			};

			prototype._init = function (element) {
				return element;
			};

			prototype._bindEvents = function (element) {
				return element;
			};

			/**
			* refresh structure
			* @method _refresh
			* @new
			* @member ns.widget.wearable.Button
			*/
			prototype._refresh = function () {
				return null;
			};

			/**
			* @method _destroy
			* @private
			* @member ns.widget.wearable.Button
			*/
			prototype._destroy = function () {
				return null;
			};

			Button.prototype = prototype;
			ns.widget.wearable.Button = Button;

			engine.defineWidget(
				"Button",
				".ui-btn",
				[],
				Button,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
