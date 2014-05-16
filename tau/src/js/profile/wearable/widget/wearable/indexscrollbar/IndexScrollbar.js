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
 * #IndexScrollbar Widget
 *
 *
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
			"../../../../../core/engine",
			"../../../../../core/event",
			"../../../../../core/utils/DOM/css",
			"../indexscrollbar",
			"./IndexBar",
			"./IndexIndicator",
			"../../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var IndexScrollbar = function() {
				// Support calling without 'new' keyword
				this.element = null;
				this.indicator = null;
				this.indexBar1 = null;	// First IndexBar. Always shown.
				this.indexBar2 = null;	// 2-depth IndexBar. shown if needed.


				this.index = null;
				this.touchAreaOffsetLeft = 0;
				this.indexElements = null;
				this.selectEventTriggerTimeoutId = null;
				this.ulMarginTop = 0;

				this.eventHandlers = {};

			},
			BaseWidget = ns.widget.BaseWidget,
			/**
			 * @property {Object} engine Alias for class {@link ns.engine}
			 * @member ns.widget.wearable.IndexScrollbar
			 * @private
			 * @static
			 */
				engine = ns.engine,
			/**
			 * @property {Object} events Alias for class {@link ns.event}
			 * @member ns.widget.wearable.IndexScrollbar
			 * @private
			 * @static
			 */
				events = ns.event,
			/**
			 * @property {Object} doms Alias for class {@link ns.utils.DOM}
			 * @member ns.widget.wearable.IndexScrollbar
			 * @private
			 * @static
			 */
				doms = ns.utils.DOM,
				EventType = {},
				prototype = new BaseWidget(),
				utilsObject = ns.utils.object,
				IndexBar = ns.widget.wearable.indexscrollbar.IndexBar,
				IndexIndicator = ns.widget.wearable.indexscrollbar.IndexIndicator;

			utilsObject.inherit(IndexScrollbar, BaseWidget, {
				widgetName: "IndexScrollbar",
				widgetClass: "ui-indexscrollbar",

				_configure: function () {
					this.options = {
						moreChar: "*",
							selectedClass: "ui-state-selected",
							delimeter: ",",
							index: [
							"A", "B", "C", "D", "E", "F", "G", "H",
							"I", "J", "K", "L", "M", "N", "O", "P", "Q",
							"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
						],
							maxIndexLen: 0,
							indexHeight: 36,
							keepSelectEventDelay: 50,
							container: null,
							supplementaryIndex: null,
							supplementaryIndexMargin: 1
					};
				},

				_build: function (element) {
					return element;
				},

				_init: function () {
					this.options.index = this._getIndex();
					this._setInitialLayout();	// This is needed for creating sub objects
					this._createSubObjects();

					this._updateLayout();

					// Mark as extended
					this._extended(true);
				},

				_refresh: function () {
					if( this._isExtended() ) {
						this._unbindEvent();
						this.indicator.hide();
						this._extended( false );
					}

					this._updateLayout();
					this._extended( true );
				},

				_destroy: function() {
					var self = this;
					if (self.isBound()) {
						self._unbindEvent();
						self._extended(false);
						self._destroySubObjects();
						self.indicator = null;
						self.index = null;
						self.eventHandlers = {};
					}
				},

				/**
				 * Protected method be a interface for method options to set option index
				 * If you want set index option please call widgetInstane.option('index', 'A,B,C');
				 * This method automaticly convert string to array and set this to this.option.index
				 * @param {HTMLElement} element
				 * @param {string} value
				 * @protected
				 */
				_setIndex: function (element, value) {
					this.options.index = this._getIndex();
				},

				/* Create indexBar1 and indicator in the indexScrollbar
				 */
				_createSubObjects: function() {
					// indexBar1
					this.indexBar1 = new IndexBar( document.createElement("UL"), {
						container: this.element,
						offsetLeft: 0,
						index: this.options.index,
						verticalCenter: true,
						indexHeight: this.options.indexHeight
					});

					// indexBar2
					if(this.options.supplementaryIndex) {
						this.indexBar2 = new IndexBar( document.createElement("UL"), {
							container: this.element,
							offsetLeft: -this.element.clientWidth - this.options.supplementaryIndexMargin,
							index: [],	// empty index
							indexHeight: this.options.indexHeight,
							ulClass: "ui-indexscrollbar-supplementary"
						});
						this.indexBar2.hide();
					}

					// indicator
					this.indicator = new IndexIndicator(document.createElement("DIV"), {
						container: this._getContainer()
					});

				},

				_destroySubObjects: function() {
					var subObjs = {
							iBar1: this.indexBar1,
							iBar2: this.indexBar2,
							indicator: this.indicator
						},
						subObj,
						el,
						i;
					for(i in subObjs) {
						subObj = subObjs[i];
						if(subObj) {
							el = subObj.element;
							subObj.destroy();
							el.parentNode.removeChild(el);
						}
					}
				},

				/* Set initial layout
				 */
				_setInitialLayout: function () {
					var indexScrollbar = this.element,
						container = this._getContainer(),
						containerPosition = window.getComputedStyle(container).position;

					// Set the indexScrollbar's position, if needed
					if (containerPosition !== "absolute" && containerPosition !== "relative") {
						indexScrollbar.style.top = container.offsetTop + "px";
						indexScrollbar.style.height = container.style.height;
					}
				},

				/* Calculate maximum index length
				 */
				_setMaxIndexLen: function() {
					var maxIndexLen = this.options.maxIndexLen,
						container = this._getContainer(),
						containerHeight = container.offsetHeight;
					if(maxIndexLen <= 0) {
						maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
					}
					if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
						maxIndexLen -= 1;	// Ensure odd number
					}
					this.options.maxIndexLen = maxIndexLen;
				},

				_updateLayout: function() {
					this._setInitialLayout();
					this._draw();

					this.touchAreaOffsetLeft = this.element.offsetLeft - 10;
				},

				/**	Draw additinoal sub-elements
				 *	@param {array} indices	List of index string
				 */
				_draw: function () {
					this.indexBar1.show();
					return this;
				},

				_removeIndicator: function() {
					var indicator = this.indicator,
						parentElem = indicator.element.parentNode;

					parentElem.removeChild(indicator.element);
					indicator.destroy();
					this.indicator = null;
				},

				_getEventReceiverByPosition: function( posX ) {
					var windowWidth = window.innerWidth,
						elementWidth = this.element.clientWidth,
						receiver;

					if( this.options.supplementaryIndex ) {
						if( windowWidth - elementWidth <= posX && posX <= windowWidth) {
							receiver = this.indexBar1;
						} else {
							receiver = this.indexBar2;
						}
					} else {
						receiver = this.indexBar1;
					}
					return receiver;
				},

				_updateIndicatorAndTriggerEvent: function( val ) {
					this.indicator.setValue( val );
					this.indicator.show();
					if(this.selectEventTriggerTimeoutId) {
						window.clearTimeout(this.selectEventTriggerTimeoutId);
					}
					this.selectEventTriggerTimeoutId = window.setTimeout(function() {
						this._trigger(this.element, "select", {index: val});
						this.selectEventTriggerTimeoutId = null;
					}.bind(this), this.options.keepSelectEventDelay);
				},

				_onTouchStartHandler: function( ev ) {
					if (ev.touches.length > 1) {
						ev.preventDefault();
						ev.stopPropagation();
						return;
					}
					var pos = this._getPositionFromEvent( ev ),
					// At touchstart, only indexbar1 is shown.
						iBar1 = this.indexBar1,
						idx = iBar1.getIndexByPosition( pos.y ),
						val = iBar1.getValueByIndex( idx );

					iBar1.select( idx );	// highlight selected value

					this._updateIndicatorAndTriggerEvent( val );
				},

				_onTouchMoveHandler: function( ev ) {
					if (ev.touches.length > 1) {
						ev.preventDefault();
						ev.stopPropagation();
						return;
					}

					var pos = this._getPositionFromEvent( ev ),
						iBar1 = this.indexBar1,
						iBar2 = this.indexBar2,
						idx,
						iBar,
						val;

					// Check event receiver: ibar1 or ibar2
					iBar = this._getEventReceiverByPosition( pos.x );
					if( iBar === iBar2 ) {
						iBar2.options.index = this.options.supplementaryIndex(iBar1.getValueByIndex(iBar1.selectedIndex));
						iBar2.refresh();
					}

					// get index and value from ibar1 or ibar2
					idx = iBar.getIndexByPosition( pos.y );
					val = iBar.getValueByIndex( idx );
					if(iBar === iBar2) {
						// Update val
						val = iBar1.getValueByIndex(iBar1.selectedIndex) + val;

						// Set iBar2's paddingTop
						iBar2.setPaddingTop( iBar1.getOffsetTopByIndex(iBar1.selectedIndex) );
					}

					// update ibars
					iBar.select(idx);	// highlight selected value
					iBar.show();
					if( iBar1 === iBar && iBar2 ) {
						iBar2.hide();
					}

					// update indicator
					this._updateIndicatorAndTriggerEvent( val );

					ev.preventDefault();
					ev.stopPropagation();
				},

				_onTouchEndHandler: function( ev ) {
					if (ev.touches.length > 0) {
						return;
					}

					this.indicator.hide();
					this.indexBar1.clearSelected();
					if(this.indexBar2) {
						this.indexBar2.clearSelected();
						this.indexBar2.hide();
					}
				},

				_bindEvents: function() {
					this._bindResizeEvent();
					this._bindEventToTriggerSelectEvent();
				},

				_unbindEvent: function() {
					this._unbindResizeEvent();
					this._unbindEventToTriggerSelectEvent();
				},

				_bindResizeEvent: function() {
					this.eventHandlers.onresize = function(/* ev */) {
						this.refresh();
					}.bind(this);

					window.addEventListener( "resize", this.eventHandlers.onresize );
				},

				_unbindResizeEvent: function() {
					if ( this.eventHandlers.onresize ) {
						window.removeEventListener( "resize", this.eventHandlers.onresize );
					}
				},

				_bindEventToTriggerSelectEvent: function() {
					this.eventHandlers.touchStart = this._onTouchStartHandler.bind(this);
					this.eventHandlers.touchEnd = this._onTouchEndHandler.bind(this);
					this.eventHandlers.touchMove = this._onTouchMoveHandler.bind(this);

					this.element.addEventListener("touchstart", this.eventHandlers.touchStart);
					this.element.addEventListener("touchmove", this.eventHandlers.touchMove);
					document.addEventListener("touchend", this.eventHandlers.touchEnd);
					document.addEventListener("touchcancel", this.eventHandlers.touchEnd);
				},

				_unbindEventToTriggerSelectEvent: function() {
					this.element.removeEventListener("touchstart", this.eventHandlers.touchStart);
					this.element.removeEventListener("touchmove", this.eventHandlers.touchMove);
					document.removeEventListener("touchend", this.eventHandlers.touchEnd);
					document.removeEventListener("touchcancel", this.eventHandlers.touchEnd);
				},

				/**
				 * Trgger a custom event to the give element
				 * @param {obj}		elem	element
				 * @param {string}	eventName	event name
				 * @param {obj}		detail	detail data of the custom event
				 */
				_trigger: function(elem, eventName, detail) {
					var ev;
					if(!elem || !elem.nodeType || elem.nodeType !== 1) {	// DOM element check
						throw "Given element is not a valid DOM element";
					}
					if("string" !== typeof eventName || eventName.length <= 0) {
						throw "Given eventName is not a valid string";
					}
					ev = new CustomEvent(
						eventName,
						{
							detail: detail,
							bubbles: true,
							cancelable: true
						}
					);
					elem.dispatchEvent(ev);

					return true;
				},

				_data: function (key, val) {
					var el = this.element,
						d = el.__data,
						idx;
					if(!d) {
						d = el.__data = {};
					}
					if(typeof key === "object") {
						// Support data collection
						for(idx in key) {
							this._data(idx, key[idx]);
						}
						return this;
					} else {
						if("undefined" === typeof val) {	// Getter
							return d[key];
						} else {	// Setter
							d[key] = val;
							return this;
						}
					}
				},

				_isValidElement: function (el) {
					return el.classList.contains(this.widgetClass);
				},

				_isExtended: function () {
					return !!this._data("extended");
				},

				_extended: function (flag) {
					this._data("extended", flag);
					return this;
				},

				_getIndex: function () {
					var el = this.element,
						options = this.options,
						indices = el.getAttribute("data-index");
					if(indices) {
						indices = indices.split(options.delimeter);	// Delimeter
					} else {
						indices = options.indices;
					}
					return indices;
				},

				_getOffset: function( el ) {
					var left=0, top=0 ;
					do {
						top += el.offsetTop;
						left += el.offsetLeft;
						el = el.offsetParent;
					} while (el);

					return {
						top: top,
						left: left
					};
				},

				_getContainer: function() {
					return this.options.container || this.element.parentNode;
				},

				_getPositionFromEvent: function( ev ) {
					return ev.type.search(/^touch/) !== -1 ?
					{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
					{x: ev.clientX, y: ev.clientY};
				},

				addEventListener: function (type, listener) {
					this.element.addEventListener(type, listener);
				},

				removeEventListener: function (type, listener) {
					this.element.removeEventListener(type, listener);
				}

			});

			// definition
			ns.widget.wearable.IndexScrollbar = IndexScrollbar;
			engine.defineWidget(
				"IndexScrollbar",
				".ui-indexscrollbar",
				[],
				IndexScrollbar,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
