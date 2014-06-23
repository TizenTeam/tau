/*global window, define, Event, console, ns */
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
 * Scroll Bar Widget
 * @class ns.widget.wearable.ScrollerScrollBar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../../../core/engine",
			"../../../../../../core/util/object",
			"../scrollbar",
			"./type/bar",
			"../../../../../../core/widget/BaseWidget",
			"../Scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				prototype = new BaseWidget(),
				utilsObject = ns.util.object,
				scrollbarType = ns.widget.wearable.scroller.scrollbar.type,

				Scroller = ns.widget.wearable.scroller.Scroller,
				ScrollerScrollBar = function () {

					this.wrapper = null;
					this.barElement = null;

					this.container = null;
					this.clip = null;

					this.options = {};
					this.type = null;

					this.maxScroll = null;
					this.started = false;
					this.displayDelayTimeoutId = null;

				};

			prototype._build = function (scrollElement) {
				this.container = scrollElement;
				this.clip = scrollElement.children[0];
				return scrollElement;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {boolean} [options.type=false]
				 * @property {number} [options.displayDelay=700]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.wearable.ScrollerScrollBar
				 */
				this.options = utilsObject.merge({}, this.options, {
					type: false,
					displayDelay: 700,
					orientation: Scroller.Orientation.VERTICAL
				});
			};

			prototype._init = function () {
				this.type = this.options.type;

				if ( !this.type ) {
					return;
				}
				this._createScrollbar();
			};

			prototype._createScrollbar = function () {
				var orientation = this.options.orientation,
					wrapper = document.createElement("DIV"),
					bar = document.createElement("span");

				wrapper.appendChild(bar);

				this.type.insertAndDecorate({
					orientation: orientation,
					wrapper: wrapper,
					bar: bar,
					container: this.container,
					clip: this.clip
				});

				this.wrapper = wrapper;
				this.barElement = bar;
			};

			prototype._removeScrollbar = function () {
				if ( this.wrapper ) {
					this.wrapper.parentNode.removeChild(this.wrapper);
				}

				this.wrapper = null;
				this.barElement = null;
			};

			prototype._refresh = function () {
				this.clear();
				this.init();
			};

			/**
			 * @method translate
			 * @param offset
			 * @param duration
			 * @member ns.widget.wearable.ScrollerScrollBar
			 */
			prototype.translate = function (offset, duration) {
				var orientation = this.options.orientation,
					translate, transition, barStyle, endDelay;

				if ( !this.wrapper || !this.type ) {
					return;
				}

				offset = this.type.offset( orientation, offset );

				barStyle = this.barElement.style;
				if ( !duration ) {
					transition = "none";
				} else {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				}

				translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

				barStyle["-webkit-transform"] = translate;
				barStyle["-webkit-transition"] = transition;

				if ( !this.started ) {
					this._start();
				}

				endDelay = ( duration || 0 ) + this.options.displayDelay;
				if ( this.displayDelayTimeoutId !== null ) {
					window.clearTimeout( this.displayDelayTimeoutId );
				}
				this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
			};

			prototype._start = function () {
				this.type.start(this.wrapper, this.barElement);
				this.started = true;
			};

			prototype._end = function () {
				this.started = false;
				this.displayDelayTimeoutId = null;

				if ( this.type ) {
					this.type.end(this.wrapper, this.barElement);
				}
			};

			prototype._clear = function () {
				this._removeScrollbar();

				this.started = false;
				this.type = null;
				this.barElement = null;
				this.displayDelayTimeoutId = null;
			};

			prototype._destroy = function () {
				this._clear();

				this.options = null;
				this.container = null;
				this.clip = null;
			};

			ScrollerScrollBar.prototype = prototype;

			ns.widget.wearable.ScrollerScrollBar = ScrollerScrollBar;

			engine.defineWidget(
				"ScrollBar",
				"",
				["translate"],
				ScrollerScrollBar
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
