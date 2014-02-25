/*jslint nomen: true, plusplus: true */
/*
* Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
* License : MIT License V2
*/
/**
 * @class ej.widget.micro.VirtualGrid
 * @extends @class ej.widget.micro.VirtualList
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/DOM/css",
			"../micro",
			"./VirtualListview"
		],
		function () {
			//>>excludeEnd("ejBuildExclude");
			var VirtualList = ns.widget.micro.VirtualListview,
				engine = ns.engine,
				DOM = ns.utils.DOM,
				VirtualGrid = function () {
					this.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: 'y',
						/**
						 * Method which modifies list item, depended at specified index from database.
						 * **Method should overrided by developer using {@link ej.widget.VirtualListview#create .create} method.**
						 * @method
						 * @param {HTMLElement} element List item to be modified.
						 * @param {number} index Index of data set.
						 * @memberOf ej.widget.micro.VirtualGrid
						 */
						listItemUpdater: function () {
							return null;
						}
					};
					return this;
				},
				prototype = new VirtualList(),
				VirtualListPrototype = VirtualList.prototype,
				parent_draw = VirtualListPrototype.draw,
				parent_refreshScrollbar = VirtualListPrototype._refreshScrollbar;

			prototype.draw = function () {
				var newDiv = null,
					newDivStyle = null;
				if (this.options.orientation === 'x') {
					newDiv = document.createElement('div');
					newDivStyle = newDiv.style;
					this.element.parentNode.appendChild(newDiv);
					newDiv.appendChild(this.element);
					newDiv.appendChild(this.ui.spacer);
					newDivStyle.width = '10000px';
					newDivStyle.height = '100%';
					this.ui.container = newDiv;
				}
				this._initListItem();
				parent_draw.call(this);
			};
			
			prototype._refreshScrollbar = function () {
				var width = 0,
					ui = this.ui;
				parent_refreshScrollbar.call(this);
				if (ui.container) {
					width = this.element.clientWidth + ui.spacer.clientWidth;
					ui.container.style.width = width + 'px';
				}
			};

			prototype._initListItem = function () {
				var self = this,
					thisElement = self.element,
					element = document.createElement('div'),
					rowElement = document.createElement('div'),
					elementStyle = element.style,
					orientation = self.options.orientation,
					thisElementStyle = thisElement.style,
					rowElementStyle = rowElement.style;

				elementStyle.overflow = 'hidden';
				elementStyle.float = 'left';
				rowElement.style.overflow = 'hidden';
				thisElement.appendChild(rowElement);
				rowElement.appendChild(element);
				self.options.listItemUpdater(element, 0);

				if (orientation === 'y') {
					thisElementStyle.overflowY = 'auto';
					thisElementStyle.overflowX = 'hidden';
					rowElementStyle.overflow = 'hidden';
					element.style.float = 'left';
					self._cellSize = DOM.getElementWidth(element);
					self._columnsCount = Math.floor(DOM.getElementWidth(thisElement) / self._cellSize);
				} else {
					thisElementStyle.overflowX = 'auto';
					thisElementStyle.overflowY = 'hidden';
					rowElementStyle.overflow = 'hidden';
					rowElementStyle.float = 'left';
					thisElementStyle.height = '100%';
					rowElementStyle.height = '100%';
					self._cellSize = DOM.getElementHeight(element);
					self._columnsCount = Math.floor(DOM.getElementHeight(thisElement) / self._cellSize);
				}
				thisElement.removeChild(rowElement);
				self.options.originalDataLength = self.options.dataLength;
				self.options.dataLength /= self._columnsCount;
			};

			prototype._updateListItem = function (element, index) {
				var elementI,
					i,
					count,
					elementStyle = element.style,
					options = this.options,
					elementIStyle,
					size;
				element.innerHTML = '';
				elementStyle.overflow = 'hidden';
				elementStyle.position = 'relative';
				count = this._columnsCount;
				size = (100 / count);
				for (i = 0; i < count; i++) {
					elementI = document.createElement('div');
					elementIStyle = elementI.style;
					elementIStyle.overflow = 'hidden';
					elementIStyle.float = 'left';
					if (options.orientation === 'y') {
						elementI.style.float = 'left';
						elementI.style.width = size + '%';
					} else {
						elementI.style.height = size + '%';
					}
					this.options.listItemUpdater(elementI, count * index + i);
					element.appendChild(elementI);
				}
			};

			VirtualGrid.prototype = prototype;

			ns.widget.micro.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				"",
				".ui-virtualgrid",
				[],
				VirtualGrid
			);

			//>>excludeStart("ejBuildExclude", pragmas.ejBuildExclude);
			return VirtualGrid;
		}
	);
	//>>excludeEnd("ejBuildExclude");
}(window, window.document, window.ej));
