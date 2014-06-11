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
 * Shows an index scroll bar with indices, usually for the list.
 *
 * The index scroll bar widget shows on the screen a scrollbar with indices, and fires a select event when the index characters are clicked. The following table describes the supported index scroll bar APIs.
 *
 * ## Manual constructor
 * For manual creation of widget you can use constructor of widget from **tau** namespace:
 *
 *		@example
 *		var indexscrollbarElement = document.getElementById('indexscrollbar'),
 *			indexscrollbar = tau.widget.IndexScrollbar(IndexScrollbar, {index: "A,B,C"});
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget. We recommend get this element by method *document.getElementById*. Second parameter is **options** and it is a object with options for widget.
 *
 * To add an IndexScrollbar widget to the application, use the following code:
 *
 *      @example
 *      <div id="foo" class="ui-indexscrollbar" data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"></div>
 *      <script>
 *          (function() {
 *              var elem = document.getElementById("foo");
 *              tau.widget.IndexScrollbar(elem);
 *              elem.addEventListener("select", function( event ) {
 *                  var index = event.detail.index;
 *                  console.log(index);
 *              });
 *          }());
 *      </script>
 *
 * The index value can be retrieved by accessing event.detail.index property.
 *
 * In the following example, the list scrolls to the position of the list item defined using the li-divider class, selected by the index scroll bar:
 *
 *      @example
 *         <div id="pageIndexScrollbar" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">IndexScrollbar</h2>
 *             </header>
 *             <section class="ui-content">
 *                 <div style="overflow-y:scroll;">
 *                     <div id="indexscrollbar1"
 *                          class="ui-indexscrollbar"
 *                          data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z">
 *                     </div>
 *                     <ul class="ui-listview" id="list1">
 *                         <li class="li-divider">A</li>
 *                         <li>Anton</li>
 *                         <li>Arabella</li>
 *                         <li>Art</li>
 *                         <li class="li-divider">B</li>
 *                         <li>Barry</li>
 *                         <li>Bibi</li>
 *                         <li>Billy</li>
 *                         <li>Bob</li>
 *                         <li class="li-divider">D</li>
 *                         <li>Daisy</li>
 *                         <li>Derek</li>
 *                         <li>Desmond</li>
 *                     </ul>
 *                 </div>
 *             </section>
 *             <script>
 *                 (function () {
 *                     var page = document.getElementById("pageIndexScrollbar");
 *                     page.addEventListener("pagecreate", function () {
 *                         var elem = document.getElementById("indexscrollbar1"), // Index scroll bar element
 *                                 elList = document.getElementById("list1"), // List element
 *                                 elDividers = elList.getElementsByClassName("li-divider"), // List items (dividers)
 *                                 elScroller = elList.parentElement, // List's parent item (overflow-y:scroll)
 *                                 dividers = {}, // Collection of list dividers
 *                                 indices = [], // List of index
 *                                 elDivider,
 *                                 i, idx;
 *
 *                         // For all list dividers
 *                         for (i = 0; i < elDividers.length; i++) {
 *                             // Add the list divider elements to the collection
 *                             elDivider = elDividers[i];
 *                             // li element having the li-divider class
 *                             idx = elDivider.innerText;
 *                             // Get a text (index value)
 *                             dividers[idx] = elDivider;
 *                             // Remember the element
 *
 *                             // Add the index to the index list
 *                             indices.push(idx);
 *                         }
 *
 *                         // Change the data-index attribute to the indexscrollbar element
 *                         // before initializing IndexScrollbar widget
 *                         elem.setAttribute("data-index", indices.join(","));
 *
 *                         // Create index scroll bar
 *                         tau.IndexScrollbar(elem);
 *
 *                         // Bind the select callback
 *                         elem.addEventListener("select", function (ev) {
 *                             var elDivider,
 *                                     idx = ev.detail.index;
 *                             elDivider = dividers[idx];
 *                             if (elDivider) {
 *                                 // Scroll to the li-divider element
 *                                 elScroller.scrollTop = elDivider.offsetTop - elScroller.offsetTop;
 *                             }
 *                         });
 *                     });
 *                 }());
 *             </script>
 *         </div>
 *
 * The following example uses the supplementScroll argument, which shows a level 2 index scroll bar. The application code must contain a level 2 index array for each level 1 index character. The example shows a way to analyze list items and create a dictionary (secondIndex) for level 1 indices for the index scroll bar, and a dictionary (keyItem) for moving list items at runtime:
 *
 *      @example
 *         <div id="indexscrollbar2" class="ui-indexscrollbar"
 *              data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z">
 *         </div>
 *         <ul class="ui-listview" id="ibar2_list2">
 *             <li>Anton</li>
 *             <li>Arabella</li>
 *             <li>Art</li>
 *             <li>Barry</li>
 *             <li>Bibi</li>
 *             <li>Billy</li>
 *             <li>Bob</li>
 *             <li>Carry</li>
 *             <li>Cibi</li>
 *             <li>Daisy</li>
 *             <li>Derek</li>
 *             <li>Desmond</li>
 *         </ul>
 *
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("pageIndexScrollbar2"),
 *                         isb,
 *                         index = [],
 *                         supIndex = {},
 *                         elIndex = {};
 *                 page.addEventListener("pageshow", function () {
 *                     var elisb = document.getElementById("indexscrollbar2"),
 *                             elList = document.getElementById("ibar2_list2"), // List element
 *                             elItems = elList.children,
 *                             elScroller = elList.parentElement, // Scroller (overflow-y:hidden)
 *                             indexData = getIndexData(
 *                                     {
 *                                         array: elItems,
 *                                         getTextValue: function (array, i) {
 *                                             return array[i].innerText;
 *                                         }
 *                                     });
 *
 *                     function getIndexData(options) {
 *                         var array = options.array,
 *                                 getTextValue = options.getTextValue,
 *                                 item,
 *                                 text,
 *                                 firstIndex = [],
 *                                 secondIndex = {},
 *                                 keyItem = {},
 *                                 c1 = null,
 *                                 c2 = null,
 *                                 i;
 *
 *                         for (i = 0; i < array.length; i++) {
 *                             item = array[i];
 *                             text = getTextValue(array, i);
 *                             if (text.length > 0) {
 *                                 if (!c1 || c1 !== text[0]) {
 *                                     // New c1
 *                                     c1 = text[0];
 *                                     firstIndex.push(c1);
 *                                     keyItem[c1] = item;
 *                                     secondIndex[c1] = [];
 *                                     c2 = text[1];
 *                                     if (c2) {
 *                                         secondIndex[c1].push(c2);
 *                                     }
 *                                     else {
 *                                         c2 = '';
 *                                     }
 *                                     keyItem[c1 + c2] = item;
 *                                 }
 *                                 else {
 *                                     // Existing c1
 *                                     if (c2 !== text[1]) {
 *                                         c2 = text[1];
 *                                         secondIndex[c1].push(c2);
 *                                         keyItem[c1 + c2] = item;
 *                                     }
 *                                 }
 *                             }
 *                         }
 *                         return {
 *                             firstIndex: firstIndex,
 *                             secondIndex: secondIndex,
 *                             keyItem: keyItem
 *                         };
 *                     }
 *
 *                     // Update the data-index attribute to the indexscrollbar element, with the index list above
 *                     elisb.setAttribute("data-index", indexData.firstIndex);
 *                     // Create IndexScrollbar
 *                     isb = new tau.IndexScrollbar(elisb, {
 *                         index: indexData.firstIndex,
 *                         supplementaryIndex: function (firstIndex) {
 *                             return indexData.secondIndex[firstIndex];
 *                         }
 *                     });
 *                     // Bind the select callback
 *                     elisb.addEventListener("select", function (ev) {
 *                         var el,
 *                             index = ev.detail.index;
 *                         el = indexData.keyItem[index];
 *                         if (el) {
 *                             // Scroll to the li-divider element
 *                             elScroller.scrollTop = el.offsetTop - elScroller.offsetTop;
 *                         }
 *                     });
 *                 });
 *                 page.addEventListener("pagehide", function () {
 *                     console.log('isb2:destroy');
 *                     isb.destroy();
 *                     index.length = 0;
 *                     supIndex = {};
 *                     elIndex = {};
 *                 });
 *             }());
 *         </script>
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use tau API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var indexscrollbarElement = document.getElementById('indexscrollbar'),
 *			indexscrollbar = tau.widget.IndexScrollbar(indexscrollbarElement);
 *
 *		indexscrollbar.methodName(methodArgument1, methodArgument2, ...);
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
			"../../../../../core/util/object",
			"../../../../../core/util/DOM/css",
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
			 * @property {Object} doms Alias for class {@link ns.util.DOM}
			 * @member ns.widget.wearable.IndexScrollbar
			 * @private
			 * @static
			 */
				doms = ns.util.DOM,
				EventType = {},
				prototype = new BaseWidget(),
				utilsObject = ns.util.object,
				IndexBar = ns.widget.wearable.indexscrollbar.IndexBar,
				IndexIndicator = ns.widget.wearable.indexscrollbar.IndexIndicator,
				EventType = {
					/**
					 * Event triggered after select index by user
					 * @event select
					 * @member ns.widget.wearable.IndexScrollbar
					 */
					SELECT: "select"
				};

			utilsObject.inherit(IndexScrollbar, BaseWidget, {
				widgetName: "IndexScrollbar",
				widgetClass: "ui-indexscrollbar",

				_configure: function () {
					/**
					 * @property {Object} options All possible widget options
					 * @property {string} [options.moreChar="*"] more character
					 * @property {string} [options.selectedClass="ui-state-selected"] disabled class name
					 * @property {string} [options.delimiter=","] delimiter in index
					 * @property {string|Array} [options.index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,1"] string with list of letters separate be delimiter or array of letters
					 * @property {boolean} [options.maxIndexLen=0]
					 * @property {boolean} [options.indexHeight=36]
					 * @property {boolean} [options.keepSelectEventDelay=50]
					 * @property {?boolean} [options.container=null]
					 * @property {?boolean} [options.supplementaryIndex=null]
					 * @property {integer} [options.supplementaryIndexMargin=1]
					 * @member ns.widget.wearable.IndexScrollbar
					 */
					this.options = {
						moreChar: "*",
						selectedClass: "ui-state-selected",
						delimiter: ",",
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
				 * Create indexBar1 and indicator in the indexScrollbar
				 * @method _createSubObjects
				 * @protected
				 * @member ns.widget.wearable.IndexScrollbar
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

				/**
				 * Set initial layout
				 * @method _setInitialLayout
				 * @protected
				 * @member ns.widget.wearable.IndexScrollbar
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

				/**
				 * Calculate maximum index length
				 * @method _setMaxIndexLen
				 * @protected
				 * @member ns.widget.wearable.IndexScrollbar
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

				/**
				 * Draw additinoal sub-elements
				 * @method _draw
				 * @protected
				 * @member ns.widget.wearable.IndexScrollbar
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
						this.trigger(EventType.SELECT, {index: val});
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

				_getIndex: function (value) {
					var el = this.element,
						options = this.options,
						indices = value || options.index;
					if (indices) {
						indices = indices.split(options.delimiter);	// delimiter
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
