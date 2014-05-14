/*global window, define */
/*jslint nomen: true, plusplus: true */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #VirtualGrid Widget
 *
 *
 * @class ns.widget.wearable.VirtualGrid
 * @extends ns.widget.wearable.VirtualListview
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/DOM/css",
			"../wearable",
			"./VirtualListview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} VirtualList Alias for {@link ns.widget.wearable.VirtualListview}
			 * @member ns.widget.wearable.VirtualGrid
			 * @private
			 * @static
			 */
			var VirtualList = ns.widget.wearable.VirtualListview,
				/**
				 * @property {Object} engine Alias for class {@link ns.engine}
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} DOM Alias for class {@link ns.utils.DOM}
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				DOM = ns.utils.DOM,
				/**
				 * @property {string} HORIZONTAL="x" constans for horizontal virtual grid
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * @property {string} VERTICAL="y" constans for vertical virtual grid
				 * @private
				 * @member ns.widget.wearable.VirtualGrid
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * Alias for class VirtualGrid
				 * @method VirtualGrid
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualGrid = function () {
					/**
					 * @property {Object} options Object with default options
					 * @property {number} [options.bufferSize=100] Element count in buffer
					 * @property {number} [options.dataLength=0] Element count in list
					 * @property {number} [options.orientation='y'] Orientation : horizontal ('x'), vertical ('y')
					 * @member ns.widget.wearable.VirtualGrid
					 * @instance
					 */
					this.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						/**
						 * Method which modifies list item, depended at specified index from database.
						 * @method listItemUpdater
						 * @param {HTMLElement} element List item to be modified.
						 * @param {number} index Index of data set.
						 * @member ns.widget.wearable.VirtualGrid
						 */
						listItemUpdater: function () {
							return null;
						}
					};
					return this;
				},

				prototype = new VirtualList(),
				/**
				 * @property {Object} VirtualListPrototype Alias for VirtualList prototype
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				VirtualListPrototype = VirtualList.prototype,
				/**
				 * @method parent_draw alias for {@link ns.widget.wearable.VirtualListview#draw VirtualList.draw}
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parent_draw = VirtualListPrototype.draw,
				/**
				 * @method parent_refreshScrollbar alias for {@link ns.widget.wearable.VirtualListview#_refreshScrollbar VirtualList.\_refreshScrollbar}
				 * @member ns.widget.wearable.VirtualGrid
				 * @private
				 * @static
				 */
				parent_refreshScrollbar = VirtualListPrototype._refreshScrollbar;

			/**
			 * Draw item
			 * @method draw
			 * @instance
			 * @member ns.widget.wearable.VirtualGrid
			 */
			prototype.draw = function () {
				var self = this,
					element = self.element,
					ui = self.ui,
					newDiv = null,
					newDivStyle = null;

				if (self.options.orientation === HORIZONTAL) {
					newDiv = document.createElement('div');
					newDivStyle = newDiv.style;
					element.parentNode.appendChild(newDiv);
					newDiv.appendChild(element);
					newDiv.appendChild(ui.spacer);
					newDivStyle.width = '10000px';
					newDivStyle.height = '100%';
					ui.container = newDiv;
				}
				self._initListItem();
				parent_draw.call(self);
			};

			/**
			 * Sets proper scrollbar size: width (horizontal)
			 * @method _refreshScrollbar
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 * @instance
			 */
			prototype._refreshScrollbar = function () {
				var width = 0,
					ui = this.ui;
				parent_refreshScrollbar.call(this);
				if (ui.container) {
					width = this.element.clientWidth + ui.spacer.clientWidth;
					ui.container.style.width = width + 'px';
				}
			};

			/**
			 * Initializes list item
			 * @method _initListItem
			 * @protected
			 * @member ns.widget.wearable.VirtualGrid
			 * @instance
			 */
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
				rowElement.style.overflow = 'hidden';
				thisElement.appendChild(rowElement);
				rowElement.appendChild(element);
				self.options.listItemUpdater(element, 0);

				if (orientation === VERTICAL) {
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

			/**
			 * Updates list item with data using defined template
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @protected
			 * @instance
			 * @member ns.widget.wearable.VirtualGrid
			 */
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
				if (options.orientation === HORIZONTAL) {
					elementStyle.height = "100%";
				}
				count = this._columnsCount;
				size = (100 / count);
				for (i = 0; i < count; i++) {
					elementI = document.createElement('div');
					elementIStyle = elementI.style;
					elementIStyle.overflow = 'hidden';

					if (options.orientation === VERTICAL) {
						elementI.style.float = 'left';
						elementI.style.width = size + '%';
					} else {
						elementI.style.height = size + '%';
					}

					if (count * index + i < options.originalDataLength) {
						this.options.listItemUpdater(elementI, count * index + i);
					}
					element.appendChild(elementI);
				}
			};

			VirtualGrid.prototype = prototype;

			ns.widget.wearable.VirtualGrid = VirtualGrid;

			engine.defineWidget(
				"VirtualGrid",
				".ui-virtualgrid",
				[],
				VirtualGrid
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualGrid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
