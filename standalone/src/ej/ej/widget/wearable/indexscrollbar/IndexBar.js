/*global define, ns, document, window */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * IndexScrollbar widget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @class ns.widget.wearable.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../indexscrollbar",
			"../../../utils/object",
			"../../../utils/DOM/css"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var utilsObject = ns.utils.object,
				utilsDOM = ns.utils.DOM;

			function IndexBar(element, options) {
				this.element = element;
				this.options = utilsObject.merge(options, this._options, false);
				this.container = this.options.container;

				this.indices = {
					original: this.options.index,
					merged: []
				};

				this._init();

				return this;
			}
			IndexBar.prototype = {
				_options: {
					container: null,
					offsetLeft: 0,
					index: [],
					verticalCenter: false,
					moreChar: "*",
					indexHeight: 36,
					selectedClass: "ui-state-selected",
					ulClass: null
				},
				_init: function() {
					this.indices.original = this.options.index;
					this.maxIndexLen = 0;
					this.indexLookupTable = [];
					this.indexElements = null;
					this.selectedIndex = -1;

					this._setMaxIndexLen();
					this._makeMergedIndices();
					this._drawDOM();
					this._appendToContainer();
					if(this.options.verticalCenter) {
						this._adjustVerticalCenter();
					}
					this._setIndexCellInfo();
				},

				_clear: function() {
					while(this.element.firstChild) {
						this.element.removeChild(this.element.firstChild);
					}

					this.indices.merged.length = 0;
					this.indexLookupTable.length = 0;
					this.indexElements = null;
					this.selectedIndex = -1;
				},

				refresh: function() {
					this._clear();
					this._init();
				},

				destroy: function() {
					this._clear();
					this.element = null;
				},

				show: function() {
					this.element.style.visibility="visible";
				},

				hide: function() {
					this.element.style.visibility="hidden";
				},

				_setMaxIndexLen: function() {
					var maxIndexLen,
						containerHeight = this.container.offsetHeight;
					maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
					if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
						maxIndexLen -= 1;	// Ensure odd number
					}
					this.maxIndexLen = maxIndexLen;
				},

				_makeMergedIndices: function() {
					var origIndices = this.indices.original,
						origIndexLen = origIndices.length,
						visibleIndexLen = Math.min(this.maxIndexLen, origIndexLen),
						totalLeft = origIndexLen - visibleIndexLen,
						nIndexPerItem = parseInt(totalLeft / parseInt(visibleIndexLen/2, 10), 10),
						leftItems = totalLeft % parseInt(visibleIndexLen/2, 10),
						indexItemSize = [],
						mergedIndices = [],
						i, len, position=0;

					for(i = 0, len = visibleIndexLen; i < len; i++) {
						indexItemSize[i] = 1;
						if(i % 2) {	// even number: omitter
							indexItemSize[i] += nIndexPerItem + (leftItems-- > 0 ? 1 : 0);
						}
						position +=  indexItemSize[i];
						mergedIndices.push( {
							start: position-1,
							length: indexItemSize[i]
						});
					}
					this.indices.merged = mergedIndices;
				},

				_drawDOM: function() {
					var origIndices = this.indices.original,
						indices = this.indices.merged,
						indexLen = indices.length,
					//container = this.container,
					//containerHeight = container.offsetHeight,
						indexHeight = this.options.indexHeight,
					//maxIndexLen = Math.min(this.maxIndexLen, indices.length),
						moreChar = this.options.moreChar,
						addMoreCharLineHeight = 9,
						text,
						frag,
						li,
						i,
						m;

					frag = document.createDocumentFragment();
					for(i=0; i < indexLen; i++) {
						m = indices[i];
						text = m.length === 1 ? origIndices[m.start] : moreChar;
						li = document.createElement("li");
						li.innerText = text.toUpperCase();
						li.style.height = indexHeight + "px";
						li.style.lineHeight = text === moreChar ? indexHeight + addMoreCharLineHeight + "px" : indexHeight + "px";
						frag.appendChild(li);
					}
					this.element.appendChild(frag);

					if(this.options.ulClass) {
						this.element.classList.add( this.options.ulClass );
					}
				},

				_adjustVerticalCenter: function() {
					var nItem = this.indices.merged.length,
						totalIndexLen = nItem * this.options.indexHeight,
						vPadding = parseInt((this.container.offsetHeight - totalIndexLen) / 2, 10);
					this.element.style.paddingTop = vPadding + "px";
				},

				_appendToContainer: function() {
					this.container.appendChild(this.element);
					this.element.style.left = this.options.offsetLeft + "px";
				},

				setPaddingTop: function(paddingTop) {
					var height = this.element.clientHeight,
						oldPaddingTop = this.element.style.paddingTop,
						oldPaddingBottom = this.element.style.paddingBottom,
						containerHeight = this.container.clientHeight;

					if(oldPaddingTop === "") {
						oldPaddingTop = 0;
					} else {
						oldPaddingTop = parseInt(oldPaddingTop, 10);
					}
					if(oldPaddingBottom === "") {
						oldPaddingBottom = 0;
					} else {
						oldPaddingBottom = parseInt(oldPaddingBottom, 10);
					}

					height = height - oldPaddingTop - oldPaddingBottom;

					if(paddingTop + height > containerHeight) {
						paddingTop -= (paddingTop + height - containerHeight);
					}
					this.element.style.paddingTop = paddingTop + "px";

					this._setIndexCellInfo();	// update index cell info
				},

				// Return index DOM element's offsetTop of given index
				getOffsetTopByIndex: function(index) {
					var cellIndex = this.indexLookupTable[index].cellIndex,
						el = this.indexElements[cellIndex],
						offsetTop = el.offsetTop;

					return offsetTop;
				},

				_setIndexCellInfo: function() {
					var element = this.element,
						mergedIndices = this.indices.merged,
						containerOffsetTop = utilsDOM.getElementOffset(this.container).top,
						listitems = this.element.querySelectorAll("LI"),
						lookupTable = [];

					[].forEach.call(listitems, function(node, idx) {
						var m = mergedIndices[idx],
							i = m.start,
							len = i + m.length,
							top = containerOffsetTop + node.offsetTop,
							height = node.offsetHeight / m.length;

						for ( ; i < len; i++ ) {
							lookupTable.push({
								cellIndex: idx,
								top: top,
								range: height
							});
							top += height;
						}
					});
					this.indexLookupTable = lookupTable;
					this.indexElements = element.children;
				},

				getIndexByPosition: function(posY) {
					var table = this.indexLookupTable,
						info,
						i, len, range;

					// boundary check
					if( table[0] ) {
						info = table[0];
						if(posY < info.top) {
							return 0;
						}
					}
					if( table[table.length -1] ) {
						info = table[table.length -1];
						if(posY >= info.top + info.range) {
							return table.length - 1;
						}
					}
					for ( i=0, len=table.length; i < len; i++) {
						info = table[i];
						range = posY - info.top;
						if ( range >= 0 && range < info.range ) {
							return i;
						}
					}
					return 0;
				},

				getValueByIndex: function(idx) {
					if(idx < 0) { idx = 0; }
					return this.indices.original[idx];
				},

				select: function(idx) {
					var cellIndex,
						eCell;

					this.clearSelected();

					if(this.selectedIndex === idx) {
						return;
					}
					this.selectedIndex = idx;

					cellIndex = this.indexLookupTable[idx].cellIndex;
					eCell = this.indexElements[cellIndex];
					eCell.classList.add(this.options.selectedClass);
				},

				/* Clear selected class
				 */
				clearSelected: function() {
					var el = this.element,
						selectedClass = this.options.selectedClass,
						selectedElement = el.querySelectorAll("."+selectedClass);

					[].forEach.call(selectedElement, function(node) {
						node.classList.remove(selectedClass);
					});
					this.selectedIndex = -1;
				}
			};

			ns.widget.wearable.indexscrollbar.IndexBar = IndexBar;

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window.document, ns));
