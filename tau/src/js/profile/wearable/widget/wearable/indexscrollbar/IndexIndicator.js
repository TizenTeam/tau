/*global define, ns, document, window */
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
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.wearable.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../indexscrollbar",
			"../../../../../core/utils/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.utils.object;

			function IndexIndicator(element, options) {
				this.element = element;
				this.options = utilsObject.merge(options, this._options, false);
				this.value = null;

				this._init();

				return this;
			}
			IndexIndicator.prototype = {
				_options: {
					className: "ui-indexscrollbar-indicator",
					selectedClass: "ui-selected",
					container: null
				},
				_init: function() {
					var element = this.element;
					element.className = this.options.className;
					element.innerHTML = "<span></span>";

					// Add to DOM tree
					this.options.container.appendChild(element);
					this.fitToContainer();
				},

				fitToContainer: function() {
					var element = this.element,
						container = this.options.container,
						containerPosition = window.getComputedStyle(container).position;

					element.style.width = container.offsetWidth + "px";
					element.style.height = container.offsetHeight + "px";

					if ( containerPosition !== "absolute" && containerPosition !== "relative" ) {
						element.style.top = container.offsetTop + "px";
						element.style.left = container.offsetLeft + "px";
					}
				},

				setValue: function( value ) {
					this.value = value;	// remember value
					value = value.toUpperCase();

					var selected = value.substr(value.length - 1),
						remained = value.substr(0, value.length - 1),
						inner = "<span>" + remained + "</span><span class=\"ui-selected\">" + selected + "</span>";
					this.element.firstChild.innerHTML = inner;	// Set indicator text
				},

				show: function() {
					//this.element.style.visibility="visible";
					this.element.style.display="block";
				},
				hide: function() {
					this.element.style.display="none";
				},
				destroy: function() {
					while(this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}
					this.element = null;	// unreference element
				}
			};
			ns.widget.wearable.indexscrollbar.IndexIndicator = IndexIndicator;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return IndexIndicator;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
