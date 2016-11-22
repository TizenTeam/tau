/*global window, define */
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
 */
/*
* # ColoredListview component
* ColoredListview is special feature for Tizen Mobile profile. ColoredListview was designed to show for
* each list item has gradient background color.
* ColoredListview used WebGL technology. So, you need to check for your develop browser support the WebGL.
*/
/*jslint nomen: true, plusplus: true */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/widget/core/Page",
			"../../../../core/event",
			"../mobile",
			"./Listview"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ColoredListview = function () {
					var self = this;
					self._ui = {};
				},
				slice = Array.prototype.slice,
				requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
				cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.mobile.ColoredListview
				 * @private
				 * @static
				 */
				engine = ns.engine,
				events = ns.event,
				/**
				 * Alias for class ns.widget.core.Page
				 * @property {Function} Page
				 * @member ns.widget.mobile.ColoredListview
				 * @static
				 * @private
				 */
				Page = ns.widget.core.Page,
				Expandable = ns.widget.mobile.Expandable,

				Listview = ns.widget.mobile.Listview,
				ListviewPrototype = Listview.prototype,
				classes = {
					CANVAS: "ui-colored-list-canvas",
					SCROLL_CLIP: "ui-scrollview-clip",
					COLORED_LIST: "ui-colored-list",
					COLORED_LIST_CLIP: "ui-colored-list-clip"
				},
				DEFAULT = {
					FIRST_SPACE: 200
				},
				/**
				 * Alias to ns.util.selectors
				 * @property {Object} selectors
				 * @member ns.widget.mobile.ColoredListview
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				prototype = new Listview();

			ColoredListview.prototype = prototype;

			ColoredListview.classes = classes;

			/**
			 * Fill the buffer with the values that define a rectangle.
			 * @method setRectangle
			 * @param {WebGL_Object} gl
			 * @param {Number} x
			 * @param {Number} y
			 * @param {Number} width
			 * @param {Number} height
			 * @private
			 * @member ns.widget.mobile.ColoredListview
			 */
			function setRectangle(gl, x, y, width, height) {
				var x1 = x;
				var x2 = x + width;
				var y1 = y;
				var y2 = y + height;
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					x1, y1,
					x2, y1,
					x1, y2,
					x1, y2,
					x2, y1,
					x2, y2]), gl.STATIC_DRAW);
			}

			/**
			 * Configure ColoredListview component
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._configure = function () {
				var self = this,
					options = self.options || {};

				options.coloredListviewNumber = 15;

			};

			/**
			 * Build ColoredListview component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._build = function (element) {
				element.classList.add(classes.COLORED_LIST);
				return element;
			};

			/**
			 * Init ColoredListview component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					expandableClass = Expandable.classes.uiExpandable,
					expandableHeadingSelector = Expandable.selectors.HEADING;

				self._scrollTop = 0;
				self._ColoredListviewTop = 0;
				self._liElementOffsetTop = [];
				self._liElementOffsetHeight = [];
				ui.liElements = slice.call(element.getElementsByTagName("li")).map(function (element) {
					return {
						element: element,
						collapsible: element.classList.contains(expandableClass),
						collapsibleParent: selectors.getClosestByClass(element, expandableClass),
						collapsibleHeader: selectors.getChildrenBySelector(element, expandableHeadingSelector)[0]
					}
				});
				// if list is not inside scrollable element then add to parent
				ui.clipElement = selectors.getClosestByClass(element, classes.SCROLL_CLIP);

				ui.page = selectors.getClosestByClass(element, Page.classes.uiPage);

				return element;
			};

			/**
			 * Init canvas layout of ColoredListview component
			 * @method _initCanvasLayout
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._initCanvasLayout = function() {
				var self = this,
					element = self.element,
					ui = self._ui,
					clipElement = ui.clipElement,
					page = ui.page,
					pageOffsetHeight = page.offsetHeight,
					elementOffsetHeight = element.offsetHeight,
					canvasElement,
					i, len;

				if (ui.canvasElement) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.error("ColoredListView: canvas element is missing, aborting...");
					//>>excludeEnd("tauDebug");
					return;
				}
				canvasElement = document.createElement("canvas");
				canvasElement.classList.add(classes.CANVAS);
				ui.canvasElement = canvasElement;

				self._getItemsHeightAndPosition();

				if (clipElement){
					// List in scrollview
					element.parentNode.insertBefore(canvasElement, element.parentNode.firstChild);

					if (self._scrollTop) {
						// It was scrolled before that means ColoredListview element made before and don't need to init more.
						//>>excludeStart("tauDebug", pragmas.tauDebug);
						ns.info("ColoredListView: Canvas element already moved from top");
						//>>excludeEnd("tauDebug");
						return;
					}

					canvasElement.style.top = self._liElementOffsetTop[self._ColoredListviewTop] - DEFAULT.FIRST_SPACE  + "px";
				} else {
					clipElement = element.parentNode;
					element.parentNode.insertBefore(canvasElement, element.parentNode.firstChild);
					canvasElement.style.top = -DEFAULT.FIRST_SPACE + "px";
				}

				clipElement.classList.add(classes.COLORED_LIST_CLIP);
				clipElement.style.backgroundColor = "transparent";

				canvasElement.width = page.offsetWidth;
				canvasElement.height = DEFAULT.FIRST_SPACE + (pageOffsetHeight > elementOffsetHeight ? pageOffsetHeight : elementOffsetHeight);
				self._makeWebglColoredListview();
			};

			/**
			 * Bind events on ColoredListview
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._bindEvents = function() {
				var self = this,
					ui = self._ui,
					page = ui.page;

				events.on(page, "pagebeforeshow", self, false);
				if (ui.clipElement) {
					events.on(ui.clipElement, "scroll", self, false);
				}

				events.on(self.element, "expand collapse", self, false);
			};

			/**
			 * Unbind events on ColoredListview
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._unbindEvents = function() {
				var self = this,
					ui = self._ui,
					page = ui.page;

				events.off(page, "pagebeforeshow", self, false);
				if (ui.clipElement) {
					events.off(ui.clipElement, "scroll", self, false);
				}

				events.off(self.element, "expand collapse", self, false);
			};

			/**
			 * Add handling functions
			 * @method handleEvent
			 * @param {Event} event
			 * @public
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype.handleEvent = function(event) {
				var self = this;
				switch (event.type) {
					case "pagebeforeshow":
						self._initCanvasLayout();
						break;
					case "scroll":
						self._scrollHandler();
						break;
					case "expand":
					case "collapse":
						self._getItemsHeightAndPosition();
						self._scrollHandler();
						break;
				}
			};

			/**
			 * Check top element of ColoredListview
			 * @method _checkTop
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._checkTop = function() {
				var self = this,
					ui = self._ui,
					scrollTop = self._ui.clipElement.scrollTop,
					liElementOffsetTop = self._liElementOffsetTop,
					ColoredListviewTop = self._ColoredListviewTop,
					liElementOffsetHeight = self._liElementOffsetHeight;

				if (self._startTime && Date.now() - self._startTime > 1000) {
					if (self._requestId) {
						cancelAnimationFrame(self._requestId);
					}
				}
				if (scrollTop > liElementOffsetTop[ColoredListviewTop + 1]) {
					if (scrollTop > liElementOffsetTop[ColoredListviewTop + 1] + liElementOffsetHeight[ColoredListviewTop + 1]) {
						// scroll was moved by scrollTo.
						while(scrollTop > liElementOffsetTop[ColoredListviewTop + 1] + liElementOffsetHeight[ColoredListviewTop + 1]) {
							ColoredListviewTop++;
						}
					}
					ColoredListviewTop++;
				} else if (scrollTop <= liElementOffsetTop[ColoredListviewTop]) {
					if (scrollTop < liElementOffsetTop[ColoredListviewTop - 1]) {
						// scroll was moved by scrollTo
						while(scrollTop < liElementOffsetTop[ColoredListviewTop - 1]) {
							ColoredListviewTop--;
						}
					}
					if (ColoredListviewTop > 0) {
						ColoredListviewTop--;
					}
				}
				self._ColoredListviewTop = ColoredListviewTop;
				ui.canvasElement.style.top = liElementOffsetTop[ColoredListviewTop] - DEFAULT.FIRST_SPACE + "px";
				self._paintWebglColoredListview();
			};

			/**
			 * Scroll event handler
			 * @method _scrollHandler
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._scrollHandler = function () {
				var self = this;

				self._checkTop();
				if (self._requestId) {
					cancelAnimationFrame(self._requestId);
				}
				self._startTime = Date.now();
				self._requestId = requestAnimationFrame(self._checkTop.bind(self));
			};

			prototype._getItemsHeightAndPosition = function () {
				var self = this,
					ui = self._ui,
					i,
					len = ui.liElements.length,
					currentItem = null,
					widgetOffsetTop = self.element.offsetTop;

				for (i = 0; i < len; i++){
					currentItem = ui.liElements[i];
					self._liElementOffsetTop[i] = currentItem.element.offsetTop + widgetOffsetTop;
					self._liElementOffsetHeight[i] = currentItem.element.offsetHeight;

					// If current element is collapsible, height should be based on header
					if (currentItem.collapsible) {
						self._liElementOffsetHeight[i] = currentItem.collapsibleHeader.offsetHeight;
					// If current element has a collapsible parent (element from sublist)
					// offset from top will return invalid values, this is handled here
					} else if(currentItem.collapsibleParent) {
						self._liElementOffsetTop[i] += currentItem.collapsibleParent.offsetTop + widgetOffsetTop;
					}
				}
			};

			/**
			 * Make WebGL canvas element
			 * @method _makeWebglColoredListview
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._makeWebglColoredListview = function () {
				var self = this,
					webglSettings = {
						alpha: true,
						premultipliedAlpha: false,
						antialias: false
					},
					canvasElement = self._ui.canvasElement,
					gl,
					program,
					vertexShader,
					vertexShaderSrc,
					fragmentShaderSrc,
					fragmentShader,
					positionLocation,
					resolutionLocation,
					buffer;

				///////////Canvas//////////////////////////
				// Get A WebGL context
				gl = canvasElement.getContext("webgl", webglSettings) || canvasElement.getContext("experimental-webgl", webglSettings);
				if (!gl) {
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.error("ColoredListView: WebGL context is missing");
					//>>excludeEnd("tauDebug");
					return;
				}

				// set shader
				fragmentShaderSrc = "precision mediump float;" +
				"uniform vec4 u_color;" +
				"void main() {" +
				"gl_FragColor = u_color;" +
				"}";
				vertexShaderSrc = "attribute vec2 a_position;" +
				"uniform vec2 u_resolution;" +
				"void main() {" +
				"vec2 zeroToOne = a_position / u_resolution;" +
				"vec2 zeroToTwo = zeroToOne * 2.0;" +
				"vec2 clipSpace = zeroToTwo - 1.0;" +
				"gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);" +
				"}";
				vertexShader = gl.createShader(gl.VERTEX_SHADER);
				gl.shaderSource(vertexShader, vertexShaderSrc);
				gl.compileShader(vertexShader);

				fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
				gl.shaderSource(fragmentShader, fragmentShaderSrc);
				gl.compileShader(fragmentShader);

				// create program
				program = gl.createProgram();
				gl.attachShader(program, vertexShader);
				gl.attachShader(program, fragmentShader);
				gl.linkProgram(program);
				gl.useProgram(program);

				// look up where the vertex data needs to go.
				positionLocation = gl.getAttribLocation(program, "a_position");

				// lookup uniforms
				resolutionLocation = gl.getUniformLocation(program, "u_resolution");
				self._colorLocation = gl.getUniformLocation(program, "u_color");

				gl.uniform2f(resolutionLocation, canvasElement.width, canvasElement.height);
				buffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
				gl.enableVertexAttribArray(positionLocation);
				gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

				self._gl = gl;
				self._program = program;
				self._paintWebglColoredListview(); // Init linear-gradient
			};

			/**
			 * Paint canvas of ColoredListview
			 * @method _paintWebglColoredListview
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._paintWebglColoredListview = function () {
				var self = this,
					ui = self._ui,
					gl = self._gl,
					ColoredListviewTop = self._ColoredListviewTop,
					liElementOffsetTop = self._liElementOffsetTop,
					offsetWidth = ui.canvasElement.offsetWidth,
					offsetHeight = ui.canvasElement.offsetHeight,
					liElementOffsetHeight = self._liElementOffsetHeight,
					listNumber = liElementOffsetTop.length,
					alphaValue = 1.0,
					optionColoredListviewNumber = parseInt(self.options.coloredListviewNumber, 10),
					max = optionColoredListviewNumber ? optionColoredListviewNumber : listNumber,
					validMax = ColoredListviewTop + max,
					listTop,
					top,
					i;
				if (!gl) {
					return;
				}

				top = liElementOffsetTop[ColoredListviewTop];

				for (i = ColoredListviewTop; i < validMax + 1; i++) {
					listTop = liElementOffsetTop[i] - top + DEFAULT.FIRST_SPACE;
					if (i === ColoredListviewTop) {
						setRectangle(gl, 0, 0, offsetWidth, liElementOffsetHeight[i] + DEFAULT.FIRST_SPACE);
					} else if (i === validMax) {
						setRectangle(gl, 0, listTop, offsetWidth, offsetHeight - listTop);
					} else {
						setRectangle(gl, 0, listTop, offsetWidth, liElementOffsetHeight[i]);
					}

					// @note: #FAFAFA (B0211 code)
					gl.uniform4f(self._colorLocation, 0.98, 0.98, 0.98, alphaValue);

					//// Draw the rectangle.
					gl.drawArrays(gl.TRIANGLES, 0, 6);

					// Alpha reduced only when element is visible
					if (liElementOffsetHeight[i] > 0) {
						// @note: based on Mobile GUI Guidelines
						// "The opacity of list decrease 4% per list.(The opacity of 1st list is 100%)"
						alphaValue -= 0.04;
					}
				}
			};

			/**
			 * Destroy canvas of _destroyColoredListview
			 * @method _destroyColoredListview
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._destroyColoredListview = function () {
				var self = this,
					ui = self._ui;
				if (ui.canvasElement.parentNode) {
					ui.canvasElement.parentNode.removeChild(ui.canvasElement);
				}
			};

			/**
			 * Refresh ColoredListview
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._refresh = function() {
				var self = this;
				ListviewPrototype._refresh.call(self);
				self._initCanvasLayout();
			};

			/**
			 * Destroy ColoredListview
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ColoredListview
			 */
			prototype._destroy = function () {
				var self = this;
				self._unbindEvents();
				self._destroyColoredListview();
				self._gl = null;
				self._program = null;
				self._colorLocation = null;
				self._ui = null;
				self._liElementOffsetTop = null;
				self._liElementOffsetHeight = null;
			};

			ns.widget.mobile.ColoredListview = ColoredListview;
			engine.defineWidget(
				"ColoredListview",
				"[data-role='coloredlistview'], .ui-colored-list",
				[],
				ColoredListview,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ColoredListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
