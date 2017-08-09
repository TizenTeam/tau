/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
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
 *
 */
/*global window, ns */
/**
 * #Grid
 *
 * @class ns.widget.wearable.Grid
 * @since 3.0
 * @extends ns.widget.wearable.Listview
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document) {
	"use strict";

	var Listview = ns.widget.wearable.Listview,
		/**
		 * Alias for class {@link ns.engine}
		 * @property {Object} engine
		 * @member ns.widget.wearable.Grid
		 * @private
		 * @static
		 */
		engine = ns.engine,

		/* Alias for helper methods from Array */
		slice = [].slice,
		min = Math.min,
		max = Math.max,
		round = Math.round,
		ceil = Math.ceil,

		easeOutQuad = ns.util.easing.easeOutQuad,

		/**
		 * Cache for anim states
		 * @property {Array} anims
		 */
		anims = [],

		/**
		 * Method scroll element content with animation
		 * Extension for TAU (animated-scroll.js)
		 * @method scrollTo
		 * @param {HTMLElement} element
		 * @param {number} changeValue
		 * @param {number} duration
		 * @param {Object} [options=null]
		 * @param {string} [options.propertyName=scrollTop] element property name to animate
		 */
		scrollTo = function (element, changeValue, duration, options) {
			var propertyName = options.propertyName || "scrollTop",
				state = find(element) ||
					createState(element[propertyName], changeValue, element, duration, options);

			state.startTime = Date.now();

			if (!state.end) {
				state.from = state.current;
				// snap to multiplication of change value
				state.to += 2 * changeValue - (state.current + state.to) % changeValue;
			} else {
				state.end = false;
				state.from = element[propertyName];
				state.to = changeValue;
				state.duration = duration;
				state.render();
			}
		},

		render = function (state) {
			var dTime = Date.now() - state.startTime,
				progress = dTime / state.duration;

			if (!state.end) {
				state.current = easeOutQuad(Math.min(progress, 1), state.from, state.to, 1);

				// apply scroll value to element
				state.element[state.propertyName] = state.current;

				// register callback for next request animation frame;
				state.requestHandler = window.requestAnimationFrame(state.render);
			}

			if (progress > 1) {
				state.end = true;
				window.cancelAnimationFrame(state.requestHandler);
				state.requestHandler = null;
			}
		},

		createState = function (from, to, element, duration, options) {
			var state = {
				from: from,
				to: to,
				current: from,
				startTime: Date.now(),
				duration: duration,
				end: true,
				render: null,
				requestHandler: null,
				element: element,
				propertyName: options && options.propertyName || "scrollTop"
			};

			state.render = render.bind(null, state);
			anims.push(state);
			return state;
		},

		find = function (element) {
			return anims.filter(function (state) {
				return state.element === element;
			})[0];
		},


		request = function (state, items) {
			var len = items.length,
				i = 0,
				duration = state.duration,
				progress = (Date.now() - state.startTime) / duration,
				draw = state.drawFn,
				timing = state.timingFn;

			// calculation
			for (; i < len; ++i) {
				timing(items[i], min(progress, 1));
			}

			// draw
			for (i = 0; i < len; ++i) {
				draw(items[i], i);
			}

			// add request animation frame
			if (!state.end) {
				state.handler = window.requestAnimationFrame(state.request);
			} else {
				if (typeof state.onEnd === "function") {
					state.onEnd();
				}
			}
			if (progress > 1) {
				state.end = true;
			}
		},

		/**
		 * Method to create animation on object properties
		 * @param {Array|Object} items
		 * @param {number} duration
		 * @param {Function} timingFn
		 * @param {Function} drawFn
		 * @param {Function} onEnd
		 * @return {{end: boolean, startTime: number, duration: number, timingFn: Function, drawFn: Function, onEnd: Function}}
		 */
		anim = function anim(items, duration, timingFn, drawFn, onEnd) {
			// item (or items) should has properties: from, to

			var state = {
				end: false,
				startTime: Date.now(),
				duration: duration,
				timingFn: timingFn,
				drawFn: drawFn,
				onEnd: onEnd
			};

			items = (Array.isArray(items)) ? items : [items];
			state.request = request.bind(null, state, items);

			// animation run
			state.handler = window.requestAnimationFrame(state.request);

			return state;
		},

		/**
		 * Alias for class Grid
		 * @method Grid
		 * @member ns.widget.wearable.Grid
		 * @private
		 * @static
		 */
		Grid = function () {
			/**
			 * Object with default options
			 * @property {Object} options
			 * @property {string} [options.mode="3x3"] grid mode
			 * @member ns.widget.wearable.Grid
			 */
			this.options = {
				// default Grid mode is Thumbnail 3x3
				mode: "3x3"
			};
			this._ui = {
				container: null
			};
			this._currentIndex = -1;
		},
		CLASS_PREFIX = "ui-grid",
		CLASSES = {
			MODE3X3: CLASS_PREFIX + "-3x3",
			THUMBNAIL: CLASS_PREFIX + "-thumbnail",
			IMAGE: CLASS_PREFIX + "-image",
			THUMB: "thumb",
			POSITIONED: "ui-positioned"
		},
		GALLERY_WIDTH = 360,
		MARGIN_TOP = 0,
		MARGIN_LEFT = 11,
		THUMBNAIL_MARGIN = 26,
		SCROLL_DURATION = 250,
		TRANSFORM_DURATION = 450, // [ms]
		SCALE = {
			"GALLERY": 0.3027,
			"IMAGE": 1,
			"THUMBNAIL": 0.6
		},
		prototype = new Listview();

	/**
	 * Toggle selected item by changing class
	 * @protected
	 * @param {boolean} visible
	 * @method _toggleSelectedItem
	 * @member ns.widget.wearable.Grid
	 * @protected
	 */
	prototype._toggleSelectedItem = function (visible) {
		var self = this,
			item = this._items[self._currentIndex];

		if (visible) {
			item.element.classList.add("ui-selected");
		} else {
			item.element.classList.remove("ui-selected");
		}
	};

	function createThumbnail(url, href) {
		var li = document.createElement("li"),
			a = document.createElement("a"),
			img = document.createElement("img");

		href = href || "#";
		img.setAttribute("src", url);
		img.setAttribute("class", CLASSES.THUMB);
		a.setAttribute("href", href);

		a.appendChild(img);
		li.appendChild(a);
		li.setAttribute("class", CLASSES.POSITIONED);

		return li;
	}

	function getItemWidth(self, mode) {
		switch (mode || self.options.mode) {
			case "3x3":
				return GALLERY_WIDTH * SCALE.GALLERY;
			case "image":
				return GALLERY_WIDTH; // full screen
			case "thumbnail":
				return GALLERY_WIDTH * SCALE.THUMBNAIL + THUMBNAIL_MARGIN;
			default:
				return 0;
		}
	}

	function prepareInsertItem(items, index, width, scale) {
		var newItem = items[index],
			beforeItems = items.filter(function (item, key) {
				return key < index;
			}),
			afterItems = items.filter(function (item, key) {
				return key > index;
			});

		// apply "to" properties on items
		applyItemsTo(beforeItems);

		// set how to items after insert position will be moved on right
		setItemsPositionTo(afterItems, width, 0);

		// prepare starting position for new item
		setItemsPositionTo([newItem], width * index, 0);

		// apply "to" properties at new item
		applyItemsTo([newItem]);
		// set new item scale before show
		newItem.scale = 0;

		// set item scale on end
		setItemsScaleTo([newItem], scale);

		// prepare items.from
		updateItemsFrom(items);
	}

	function prepareRemoveItem(items, index, width) {
		var afterItems = items.filter(function (item, key) {
			return key > index;
		});

		// set how to items after removed item will be moved on left
		setItemsPositionTo(afterItems, -1 * width, 0);
	}

	/**
	 * Add image to grid
	 * @param {string} url image url
	 * @param {number} [index] list index where image will be added
	 * @return {ns.widget.wearable.Grid}
	 * @method add
	 * @member ns.widget.wearable.Grid
	 */
	prototype.add = function (url, index) {
		var self = this,
			element = self.element,
			thumb = createThumbnail(url),
			snapPoint = createSnapPoint(),
			items = self._items;

		// Add new item to "items" array in grid widget
		if (index !== undefined && index < element.children.length) {
			items.splice(index, 0, createItem(thumb));
			self._snapPoints.splice(index, 0, snapPoint);
			element.insertBefore(thumb, element.children[index]);
		} else {
			items.push(createItem(thumb));
			self._snapPoints.push(snapPoint);
			element.appendChild(thumb);
		}

		updateSnapPointPositions(self);

		// Add thumbnail HTMLElement to grid with animation
		switch (self.options.mode) {
			case "3x3" :
				updateItemsFrom(items);
				assembleItemsTo3x3(items);
				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style.width = getGridSize(self, "3x3") + "px";
				});
				break;
			case "image" :
				prepareInsertItem(items, index, getItemWidth(self), SCALE.IMAGE);
				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style.width = getGridSize(self, "image") + "px";
				});
				break;
			case "thumbnail" :
				prepareInsertItem(items, index, getItemWidth(self), SCALE.THUMBNAIL);
				anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
					element.style.width = getGridSize(self, "thumbnail") + "px";
				});
				break;
		}

		// chain
		return self;
	};

	/**
	 * Remove image from grid
	 * @param {number} index image index
	 * @return {ns.widget.wearable.Grid}
	 * @method remove
	 * @member ns.widget.wearable.Grid
	 */
	prototype.remove = function (index) {
		var self = this,
			element = self.element,
			items = self._items,
			item = items[index],
			thumb = item.element;

		if (index !== undefined && index < element.children.length) {

			updateItemsFrom([item]);

			switch (self.options.mode) {
				case "3x3" :
					// hide item with animation
					item.to.scale = 0;
					// move to center of item during disappearing
					item.to.position = {
						left: item.position.left + getItemWidth(self) / 2,
						top: item.position.top
					};
					anim(item, TRANSFORM_DURATION, changeItems, transformItem);

					items.splice(index, 1);
					self._snapPoints.splice(index, 1);

					// refresh grid 3x3
					updateItemsFrom(items);
					assembleItemsTo3x3(items);

					anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
						updateSnapPointPositions(self);
						element.removeChild(thumb);
						element.style.width = getGridSize(self, "3x3") + "px";
					});
					break;
				case "image" :
					// hide item with animation
					item.to.scale = 0;

					// move items after removed item to left
					updateItemsFrom(items);
					prepareRemoveItem(items, index, getItemWidth(self));

					// transformation
					anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
						updateSnapPointPositions(self);
						element.removeChild(thumb);
						element.style.width = getGridSize(self, "image") + "px";

						items.splice(index, 1);
						self._snapPoints.splice(index, 1);
					});
					break;
				case "thumbnail" :
					// hide item with animation
					item.to.scale = 0;

					// move items after removed item to left
					updateItemsFrom(items);
					prepareRemoveItem(items, index, getItemWidth(self));

					// transformation
					anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
						updateSnapPointPositions(self);
						element.removeChild(thumb);
						element.style.width = getGridSize(self, "thumbnail") + "px";

						items.splice(index, 1);
						self._snapPoints.splice(index, 1);
					});
					break;
			}
		}

		// chain
		return self;
	};

	function changeModeTo3x3(self) {
		var element = self.element;

		// remove previous classes;
		element.classList.remove(CLASSES.IMAGE);

		// add new classes
		element.classList.add(CLASSES.MODE3X3);

		// set proper mode in options
		self.options.mode = "3x3";

		element.style.width = getGridSize(self, "3x3") + "px";
	}

	function changeModeToImage(self) {
		var element = self.element,
			elementClassList = element.classList;

		if (self._currentIndex > -1) {

			elementClassList.remove(CLASSES.MODE3X3);
			elementClassList.remove(CLASSES.THUMBNAIL);

			// set grid mode to image
			elementClassList.add(CLASSES.IMAGE);

			// set proper mode in options
			self.options.mode = "image";
		}
	}

	function changeModeToThumbnail(self) {
		var element = self.element;

		// thumbnail mode is accessible only from image mode
		if (self.options.mode === "image" && self._currentIndex !== -1) {
			element.classList.add(CLASSES.THUMBNAIL);
		}
	}

	/**
	 * Change grid mode
	 * @param {"3x3"|"thumbnail"|"image"} toMode Grid works in three mode
	 * @return {ns.widget.wearable.Grid}
	 * @method mode
	 * @member ns.widget.wearable.Grid
	 */
	prototype.mode = function (toMode) {
		var self = this,
			currentMode = self.options.mode;

		switch (toMode) {
			case "3x3" :
				if (currentMode === "image") {
					imageToGrid(self);
				} else {
					changeModeTo3x3(self);
				}
				break;
			case "image" :
				if (currentMode === "3x3") {
					gridToImage(self);
				} else if (currentMode === "thumbnail") {
					thumbnailToImage(self);
				}
				break;
			case "thumbnail" :
				if (currentMode === "image") {
					imageToThumbnail(self);
				} else if (currentMode === "3x3") {
					ns.warn("thumbnail mode is not allowed directly from 3x3 mode, change to image mode before");
				}
				break;
			default:
				ns.warn("unsupported grid mode, available: 3x3 | image | thumbnail");
				break;
		}

		// chain
		return self;
	};

	/**
	 * Change current exposed image to image indicated by index
	 * @param {number} index Image index
	 * @return {ns.widget.wearable.Grid}
	 * @method changeIndex
	 * @member ns.widget.wearable.Grid
	 */
	prototype.changeIndex = function (index) {
		var self = this,
			container = self._ui.container;

		self._currentIndex = index;
		scrollTo(
			container,
			getGridScrollPosition(self, self.options.mode) - container.scrollLeft,
			SCROLL_DURATION, {
				propertyName: "scrollLeft"
			}
		);

		// chain
		return self;
	};

	/**
	 * Get current exposed image
	 * @method getIndex
	 * @member ns.widget.wearable.Grid
	 * @return {number}
	 */
	prototype.getIndex = function () {
		var self = this;

		return self._currentIndex = findItemIndexByScroll(self, self._ui.container);
	};

	function createSnapPoint() {
		var point = document.createElement("div");

		point.setAttribute("class", "snap-point");
		return point;
	}

	function createSnapPoints(self) {
		var frag = document.createDocumentFragment(),
			items = self._items,
			len = items.length,
			i = 0,
			point = null,
			snapPoints = [];

		for (; i < len; i++) {
			point = createSnapPoint();
			snapPoints.push(point);
			frag.appendChild(point);
		}
		self._ui.container.appendChild(frag);
		self._snapPoints = snapPoints;
	}

	function updateSnapPointPositions(self) {
		var snapPoints = self._snapPoints,
			len = snapPoints.length,
			start = 0,
			delta = 0,
			interval = 3,
			point = null,
			i = 0;

		switch (self.options.mode) {
			case "3x3" :
				start = GALLERY_WIDTH * SCALE.GALLERY / 2 + MARGIN_LEFT;
				delta = GALLERY_WIDTH * SCALE.GALLERY / 3;
				interval = 3;
				break;
			case "image" :
				start = GALLERY_WIDTH / 2;
				delta = GALLERY_WIDTH;
				interval = 1;
				break;
			case "thumbnail" :
				start = GALLERY_WIDTH / 2;
				delta = GALLERY_WIDTH * SCALE.THUMBNAIL + THUMBNAIL_MARGIN;
				interval = 1;
				break;
		}

		for (; i < len; i++) {
			point = snapPoints[i];
			point.style.left = start + delta * (i - i % interval) + "px";
		}
	}

	/**
	 * Widget build method
	 * @protected
	 * @method _build
	 * @param {HTMLElement} element
	 * @member ns.widget.wearable.Grid
	 * @return {HTMLElement}
	 */
	prototype._build = function (element) {
		var self = this,
			container = document.createElement("div");

		container.setAttribute("class", "ui-grid-container");
		container.setAttribute("tizen-circular-scrollbar", "");
		element.parentElement.replaceChild(container, element);

		container.appendChild(element);
		self._ui.container = container;

		return element;
	};

	/**
	 * Widget init method
	 * @protected
	 * @method _init
	 * @member ns.widget.wearable.Grid
	 */
	prototype._init = function () {
		var self = this,
			items = [];

		self._items = items;

		self.element.classList.add("ui-children-positioned");

		// collect grid items from DOM
		getItems(self);

		//updateItemsFrom(items);
		assembleItemsTo3x3(items);
		// apply transformations to items immediately
		transformItems(self);

		// snap points are used as places where scroll will be stopped
		createSnapPoints(self);
		updateSnapPointPositions(self);

		// set proper grid look
		self.mode(self.options.mode);
	};

	function findChildIndex(self, target) {
		var children = slice.call(self.element.children, 0),
			index = -1;

		while (target !== null && index < 0) {
			index = children.indexOf(target);
			if (index > -1) {
				return index;
			} else {
				target = target.parentNode;
			}
		}
		return index;
	}

	/**
	 * Method used by animation to apply transformation on grid element
	 * @param {Object} item
	 * @private
	 * @method transformItem
	 * @member ns.widget.wearable.Grid
	 */
	function transformItem(item) {
		var element = item.element,
			style = element.style,
			transform = "translate3d(" + item.position.left + "px, " + item.position.top + "px, 0)",
			scale = "scale(" + item.scale + ", " + item.scale + ")";

		style.transform = transform + " " + scale;
		style.webkitTransform = transform + " " + scale;
	}

	function transformItems(self) {
		var items = self._items;

		applyItemsTo(items);
		items.forEach(transformItem);
	}

	/**
	 * Calculation of item position
	 * @param {Object} item
	 * @param {number} progress
	 * @private
	 * @method changeItems
	 * @member ns.widget.wearable.Grid
	 */
	function changeItems(item, progress) {
		var to = item.to,
			from = item.from,
			position = item.position,
			fromPosition = null,
			toPosition = null;

		if (to && from) {
			fromPosition = from.position;
			toPosition = to.position;

			if (toPosition && fromPosition) {
				position.top = easeOutQuad(
					progress, fromPosition.top, toPosition.top - fromPosition.top, 1
				);
				position.left = easeOutQuad(
					progress, fromPosition.left, toPosition.left - fromPosition.left, 1
				);
			}
			item.scale = easeOutQuad(
				progress, from.scale, to.scale - from.scale, 1
			);
		}
	}

	/*
	 *
	 * Items transformations
	 *
	 */
	function createItem(element, item) {
		if (typeof item !== "object") {
			item = {};
		}
		item.element = element;
		item.position = {
			left: 0,
			top: 0
		};
		item.scale = 0;
		item.to = {
			position: {},
			scale: 1
		};
		item.from = {
			position: {},
			scale: 0
		};
		return item;
	}

	function applyItemsTo(items) {
		var len = items.length,
			item = null,
			to = null,
			i = 0;

		for (; i < len; ++i) {
			item = items[i];
			to = item.to;
			if (to.position) {
				item.position.left = to.position.left;
				item.position.top = to.position.top;
			}
			if (to.scale) {
				item.scale = to.scale;
			}
		}
	}

	function updateItemsFrom(items) {
		var len = items.length,
			item = null,
			i = 0,
			from = null;

		for (; i < len; ++i) {
			item = items[i];
			from = item.from;
			from.position = {
				left: item.position.left,
				top: item.position.top
			};
			from.scale = item.scale;
		}
	}

	function assembleItemsTo3x3(items) {
		var len = items.length,
			i = 0,
			index = 0,
			left = 0,
			top = 0,
			width = 115,
			height = 101,
			to = null,
			pattern = [[width / 2, -height], [width, 0], [width / 2, height]];

		for (; i < len; ++i) {
			to = items[i].to;

			if (i === 0) {
				left = MARGIN_LEFT;
				top = MARGIN_TOP;
			} else {
				index = (i - 1) % 3;
				left = pattern[index][0] + (((i - 1) / 3) | 0) * width + MARGIN_LEFT;
				top = pattern[index][1] + MARGIN_TOP;
			}

			to.position = {
				left: left,
				top: top
			};
			to.scale = SCALE.GALLERY;
		}
	}

	function assembleItemsToImages(self) {
		var items = self._items,
			len = items.length,
			to = null,
			i = 0,
			width = getItemWidth(self, "image");

		for (; i < len; ++i) {
			to = items[i].to;
			to.position = {
				left: i * width,
				top: 0
			};
			to.scale = SCALE.IMAGE;
		}
	}

	function scaleItemsToThumbnails(self) {
		var items = self._items,
			len = items.length,
			to = null,
			width = getItemWidth(self, "thumbnail"),
			i = 0;

		for (; i < len; ++i) {
			to = items[i].to;
			to.position = {
				left: i * width,
				top: 0
			};
			to.scale = SCALE.THUMBNAIL;
		}
	}

	function setItemsPositionTo(items, deltaX, deltaY) {
		var len = items.length,
			item = null,
			i = 0,
			to = null;

		for (; i < len; ++i) {
			item = items[i];
			to = item.to;
			to.position = {
				left: item.position.left + deltaX,
				top: item.position.top + deltaY
			};
		}
	}

	function setItemsScaleTo(items, scale) {
		var len = items.length,
			i = 0;

		for (; i < len; ++i) {
			items[i].to.scale = scale;
		}
	}

	function moveItemsToImages(self) {
		var items = self._items,
			len = items.length,
			to = null,
			i = 0;

		for (; i < len; ++i) {
			to = items[i].to;
			to.position = {
				left: i * getItemWidth(self, "image"),
				top: 0
			};
			to.scale = SCALE.THUMBNAIL;
		}
	}

	function moveItemsToThumbnails(self) {
		var items = self._items,
			len = items.length,
			to = null,
			i = 0;

		for (; i < len; ++i) {
			to = items[i].to;
			to.position = {
				left: i * getItemWidth(self, "thumbnail") +
				(i - self._currentIndex) * 200,
				top: 0
			};
			to.scale = SCALE.IMAGE;
		}
	}

	function getItems(self) {
		var children = slice.call(self.element.children),
			len = children.length,
			child = null,
			items = self._items,
			i = 0;

		for (; i < len; ++i) {
			child = children[i];
			items[i] = createItem(child, items[i]);
			child.classList.add("ui-positioned");
		}
	}

	function getGridSize(self, mode) {
		var width = 0,
			items = self._items;

		switch (mode) {
			case "3x3" :
				width = max(
					(ceil(items.length / 3)) * ceil(GALLERY_WIDTH * SCALE.GALLERY) + MARGIN_LEFT,
					GALLERY_WIDTH
				);
				break;
			case "image" :
				width = items.length * GALLERY_WIDTH;
				break;
			case "thumbnail" :
				width = items.length * GALLERY_WIDTH * SCALE.THUMBNAIL +
					(items.length - 1.5) * THUMBNAIL_MARGIN +
					GALLERY_WIDTH * (1 - SCALE.THUMBNAIL);
				break;
			default:
				width = GALLERY_WIDTH;
		}
		return width;
	}

	function getGridScrollPosition(self, mode) {
		var scroll = 0,
			itemWidth = getItemWidth(self, mode),
			currentIndex = self._currentIndex;

		switch (mode) {
			case "3x3" :
				scroll = (((currentIndex - 1) / 3) | 0) * ceil(itemWidth);
				break;
			case "image" :
			case "thumbnail" :
				scroll = currentIndex * itemWidth;
				break;
			default:
				scroll = 0;
		}
		return scroll;
	}

	function setGridSize(self, mode) {
		var element = self.element;

		// set proper mode in options
		self.options.mode = "image";
		element.style.width = getGridSize(self, mode) + "px";
		element.parentElement.scrollLeft = getGridScrollPosition(self, mode);
	}

	function findItemIndexByScroll(self, element) {
		var scroll = element.scrollLeft,
			itemWidth = getItemWidth(self),
			items = self._items;

		switch (self.options.mode) {
			case "image" :
				return min(
					round(scroll / itemWidth),
					items.length - 1
				);
			case "thumbnail" :
				return min(
					round((scroll - THUMBNAIL_MARGIN) / itemWidth),
					items.length - 1
				);
			default :
				return -1;
		}
	}

	function gridToImage(self) {
		var element = self.element;

		if (self._currentIndex === -1) {
			self._currentIndex = 0;
		}

		self._dispersionItems(self._currentIndex);
		updateItemsFrom(self._items);

		anim(self._items, TRANSFORM_DURATION, changeItems, transformItem, function () {
			changeModeToImage(self);

			assembleItemsToImages(self);
			transformItems(self);

			setGridSize(self, "image");
			updateSnapPointPositions(self);
		});

		// change history
		ns.engine.getRouter().open(element, {
			url: "#image", rel: "grid"
		});

	}

	function imageToThumbnail(self) {
		var element = self.element,
			items = self._items;

		moveItemsToThumbnails(self);
		transformItems(self);

		// set proper mode in options
		self.options.mode = "thumbnail";

		element.parentElement.scrollLeft = getGridScrollPosition(self, "thumbnail");

		updateItemsFrom(items);
		scaleItemsToThumbnails(self);

		anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
			element.style.width = getGridSize(self, "thumbnail") + "px";
			changeModeToThumbnail(self);
			updateSnapPointPositions(self);
		});

		// change history
		ns.engine.getRouter().open(element, {
			url: "#thumbnail", rel: "grid"
		});
	}

	function imageToGrid(self) {
		var element = self.element,
			items = self._items,
			scrollLeft = getGridScrollPosition(self, "3x3");

		assembleItemsTo3x3(items);
		transformItems(self);

		self._dispersionItems(self._currentIndex);
		transformItems(self);

		changeModeTo3x3(self);

		element.parentElement.scrollLeft = min(scrollLeft, getGridSize(self, "3x3") - GALLERY_WIDTH);
		items[self._currentIndex].position.left = min(scrollLeft, getGridSize(self, "3x3") - GALLERY_WIDTH);

		updateItemsFrom(items);
		assembleItemsTo3x3(items);

		anim(items, TRANSFORM_DURATION, changeItems, transformItem, function onTransitionEnd() {
			element.style.width = getGridSize(self, "3x3") + "px";
			updateSnapPointPositions(self);
		});
	}

	function thumbnailToImage(self) {
		var items = self._items;

		moveItemsToImages(self);
		transformItems(self);

		setGridSize(self, "image");

		assembleItemsToImages(self);
		updateItemsFrom(items);

		anim(items, TRANSFORM_DURATION, changeItems, transformItem, function () {
			changeModeToImage(self);
			updateSnapPointPositions(self);
		});
	}

	prototype._dispersionItems = function (fromItemIndex) {
		var self = this,
			element = self.element,
			items = self._items,
			center = items[fromItemIndex],
			item = null,
			len = items.length,
			i = 0,
			state;

		for (; i < len; ++i) {
			item = items[i];
			state = item.position;
			if (i !== fromItemIndex) {
				item.to = {
					position: {
						left: state.left + 2.2 * (state.left - center.position.left),
						top: state.top + 2.2 * (state.top - center.position.top)
					},
					scale: SCALE.GALLERY
				};
			} else {
				item.to = {
					position: {
						left: element.parentElement.scrollLeft,
						top: 0
					},
					scale: SCALE.IMAGE
				};
			}
		}
	};

	/**
	 * Event handlers
	 * @param {ns.widget.wearable.Grid} self
	 * @param {Event} ev
	 */
	function onClick(self, ev) {
		self._currentIndex = findChildIndex(self, ev.target);

		switch (self.options.mode) {
			case "3x3" :
				self.mode("image");
				break;
			case "image" :
				self.mode("thumbnail");
				break;
		}
	}

	function onPopState(self, ev) {
		self._currentIndex = findItemIndexByScroll(self, self._ui.container);

		switch (self.options.mode) {
			case "image":
				ev.preventDefault();
				ev.stopImmediatePropagation();
				self.mode("3x3");
				break;
			case "thumbnail":
				ev.preventDefault();
				ev.stopImmediatePropagation();
				self.mode("image");
				break;
		}
	}

	function onHWKey(self, ev) {
		switch (ev.keyName) {
			case "back" :
				onPopState(self, ev);
				break;
		}
	}

	function onRotary(self, ev) {
		var itemWidth = getItemWidth(self),
			direction = (ev.detail.direction === "CW") ? 1 : -1,
			container = self._ui.container;

		if (itemWidth !== 0) {
			scrollTo(container, direction * itemWidth, SCROLL_DURATION, {
				propertyName: "scrollLeft"
			});
		}
	}

	prototype._onScroll = function () {
		var self = this,
			currentIndex = findItemIndexByScroll(self, self._ui.container);

		self.trigger("change", {
			active: currentIndex
		});
	};

	/**
	 * Event handler for widget
	 * @param {Event} ev
	 * @method handleEvent
	 * @member ns.widget.wearable.Grid
	 * @protected
	 */
	prototype.handleEvent = function (ev) {
		switch (ev.type) {
			case "rotarydetent" :
				onRotary(this, ev);
				break;
			case "click" :
				onClick(this, ev);
				break;
			case "tizenhwkey" :
				onHWKey(this, ev);
				break;
			case "popstate" :
				onPopState(this, ev);
				break;
			case "scroll":
				this._onScroll();
		}
	};

	/**
	 * Bind event listeners to widget instance
	 * @protected
	 * @method _bindEvents
	 * @param {HTMLElement} element
	 * @member ns.widget.wearable.Grid
	 * @protected
	 */
	prototype._bindEvents = function (element) {
		var self = this;

		document.addEventListener("rotarydetent", self, true);
		window.addEventListener("popstate", self, true);
		element.addEventListener("click", self, true);
		// @todo wearable not supported taphold
		// element.addEventListener("taphold", self, true);
		window.addEventListener("tizenhwkey", self, true);
		self._ui.container.addEventListener("scroll", self, true);
	};

	/**
	 * Remove event listeners from widget instance
	 * @protected
	 * @method _unbindEvents
	 * @member ns.widget.wearable.Grid
	 * @protected
	 */
	prototype._unbindEvents = function () {
		var self = this;

		document.removeEventListener("rotarydetent", self, true);
		window.removeEventListener("popstate", self, true);
		self.element.removeEventListener("click", self, true);
		// @todo wearable not supported taphold
		// element.addEventListener("taphold", this, true);
		window.removeEventListener("tizenhwkey", self, true);
		self._ui.container.removeEventListener("scroll", self, true);
	};

	/**
	 * Destroy widget instance
	 * @protected
	 * @method _destroy
	 * @member ns.widget.wearable.Grid
	 * @protected
	 */
	prototype._destroy = function () {
		var self = this,
			items = self._items,
			len = items.length,
			i = 0;

		self._unbindEvents();

		// remove items
		for (; i < len; ++i) {
			items[i] = null;
		}
		self._items = [];
	};

	Grid.prototype = prototype;
	ns.widget.wearable.Grid = Grid;

	engine.defineWidget(
		"Grid",
		"." + CLASS_PREFIX,
		[],
		Grid,
		"wearable"
	);

}(window, window.document));
