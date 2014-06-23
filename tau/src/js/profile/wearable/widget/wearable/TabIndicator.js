/*global window, define, Event, console */
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
 * TabIndicator Widget
 * @class ns.widget.wearable.TabIndicator
 * @since 2.3
 * @extends ej.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/object",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				object = ns.util.object,
				TabIndicator = function() {
				this.tabSize = 0;
				this.activeIndex = 0;
				this.width = 0;
			};

			TabIndicator.EventType = {
				/**
				 * Triggered when tab is changing
				 * @event tabchange
				 * @member ns.widget.wearable.TabIndicator
				 */
				change: "tabchange"
			};

			TabIndicator.prototype = new ns.widget.BaseWidget();

			object.fastMerge(TabIndicator.prototype, {
				_init: function(element) {
					var o = this.options;

					this.width = element.offsetWidth;
					element.classList.add( o.wrapperClass );
				},

				_configure: function( ) {
					/**
					 * @property {Object} options Options for widget
					 * @property {number} [options.margin=2]
					 * @property {boolean} [options.triggerEvent=false]
					 * @property {string} [options.wrapperClass="ui-tab-indicator]
					 * @property {string} [options.itemClass="ui-tab-item"]
					 * @property {string} [options.activeClass="ui-tab-active"]
					 * @member ns.widget.wearable.TabIndicator
					 */
					this.options = {
						margin: 2,
						triggerEvent: false,
						wrapperClass: "ui-tab-indicator",
						itemClass: "ui-tab-item",
						activeClass: "ui-tab-active"
					};
				},

				_createIndicator: function() {
					var o = this.options,
						activeIndex = this.activeIndex,
						wrap = document.createDocumentFragment(),
						widthTable = [],
						margin = o.margin,
						i = 0,
						len = this.tabSize,
						width = this.width-margin*(len-1),
						std = Math.floor(width / len),
						remain = width % len,
						span, offset=0;

					for (i=0; i < len; i++) {
						widthTable[i] = std;
					}

					for ( i= Math.floor((len-remain)/2); remain > 0; i++, remain-- ) {
						widthTable[i] += 1;
					}

					for (i=0; i < len; i++) {
						span = document.createElement("span");
						span.classList.add( o.itemClass );
						span.style.width = widthTable[i] + "px";
						span.style.left = offset + "px";
						offset += widthTable[i] + margin;

						if ( i === activeIndex ) {
							span.classList.add( o.activeClass );
						}
						wrap.appendChild(span);
					}

					this.element.appendChild( wrap );
				},

				_removeIndicator: function() {
					this.element.innerHTML = "";
				},

				_fireEvent: function(eventName, detail) {
					ns.fireEvent( this.element, eventName, detail );
				},

				_refresh: function() {
					this._removeIndicator();
					this._createIndicator();
				},

				/**
				 * @method setActive
				 * @param position
				 * @member ns.widget.wearable.TabIndicator
				 */
				setActive: function ( position ) {
					var o = this.options,
						nodes = this.element.children;

					this.activeIndex = position;

					[].forEach.call(nodes, function( element ) {
						element.classList.remove( o.activeClass );
					});

					if ( position < nodes.length ) {
						nodes[position].classList.add( o.activeClass );

						if ( o.triggerEvent ) {
							this._fireEvent(TabIndicator.EventType.change, {
								active: position
							});
						}
					}
				},

				/**
				 * @method setSize
				 * @param size
				 * @member ns.widget.wearable.TabIndicator
				 */
				setSize: function( size ) {
					var needRefresh = this.tabSize !== size;

					this.tabSize = size;
					if ( needRefresh ) {
						this.refresh();
					}
				},

				_destroy: function() {
					var o = this.options;

					this._removeIndicator();

					this.element.classList.remove( o.wrapperClass );
				}
			});

			ns.widget.wearable.TabIndicator = TabIndicator;

			engine.defineWidget(
				"TabIndicator",
				".ui-tab",
				["setActive", "setSize"],
				TabIndicator
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
