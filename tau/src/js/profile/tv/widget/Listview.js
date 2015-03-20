/*global window, define, ns */
/* 
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
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

			/**
			 * Method rebuild widget.
			 * @method rebuild
			 * @param {Listview} self
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.core.Listview
			 */
			function rebuild(self, element) {
				var items = element.children,
					itemsLength = items.length,
					item,
					i;

				for (i = 0; i < itemsLength; i++) {
					item = items[i];
					if (item.firstElementChild && item.firstElementChild.tagName === "A") {
						self._changeLinksToButton(item.firstElementChild);
					}
				}
			}

			prototype._changeLinksToButton = function(item) {
				engine.instanceWidget(
					item,
					"Button"
				);
			};

			/**
			 * build Listview
			 * @method _build
			 * @private
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.Listview
			 */
			prototype._build = function (element) {
				rebuild(this, element);
				return CoreListview.prototype._build.call(this, element);
			};

			/**
			 * refresh structure
			 * @method _refresh
			 * @return {HTMLElement}
			 * @member ns.widget.core.Listview
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element;

				rebuild(self, element);

				return element;
			};

			/**
			 * @method _destroy
			 * @private
			 * @member ns.widget.core.Listview
			 */
			prototype._destroy = function () {
				var items = this.element.children,
					itemsLength = items.length,
					item,
					i,
					widget;

				for (i = 0; i < itemsLength; i++) {
					item = items[i];
					if (item.firstElementChild && item.firstElementChild.tagName === "A") {
						widget = engine.getBinding(item.firstElementChild, "Button");
						if (widget !== null) {
							widget.destroy();
						}
					}
				}
			};


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
