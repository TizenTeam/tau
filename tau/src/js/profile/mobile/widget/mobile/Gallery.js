/*global window, define */
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
 * #Gallery Widget
 * The gallery widget shows images in a gallery on the screen.
 *
 * @class ns.widget.mobile.Gallery
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/css",
			"../../../../core/util/DOM/manipulation",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			* {Object} Widget Alias for {@link ns.widget.BaseWidget}
			* @member ns.widget.mobile.Gallery
			* @private
			*/
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				* @property {Object} engine Alias for class {@link ns.engine}
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				engine = ns.engine,
				/**
				* @property {Object} selectors Alias for class {@link ns.util.selectors}
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				selectors = ns.util.selectors,
				/**
				* @property {Object} doms Alias for class ns.util.DOM
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				doms = ns.util.DOM,

				Gallery = function () {
					/**
					* @property {Object} options Object with default options
					* @member ns.widget.mobile.Gallery
					*/
					this.options = {};

					this.dragging = false;
					this.moving = false;
					this.maxImageWidth = 0;
					this.maxImageHeight = 0;
					this.orgX = 0;
					this.orgTime = null;
					this.currentImage = null;
					this.previousImage = null;
					this.nextImage = null;
					this.images = [];
					this.imagesHold = [];
					this.direction = 1;
					this.container = null;

					// events' handlers
					this.pageShowHandler = null;
					this.throttledresizeHandler = null;
					this.vmousemoveHandler = null;
					this.vmousedownHandler = null;
					this.vmouseupHandler = null;
					this.vmouseoutHandler = null;
					this.orientationEventFire = false;
				};

			Gallery.prototype = new BaseWidget();

			function getHeight(element) {
				var page = selectors.getClosestBySelectorNS(element, "role=page"),
					content = selectors.getAllByDataNS(element, "role=content"),
					header = selectors.getAllByDataNS(page, "role=header"),
					footer = selectors.getAllByDataNS(page, "role=footer"),
					headerHeight = header.length ? doms.getElementHeight(header[0]) : 0,
					footerHeight = footer.length ? doms.getElementHeight(footer[0]) : 0,
					paddings = doms.getCSSProperty(content, "padding-top", 0, "integer") + doms.getCSSProperty(content, "padding-bottom", 0, "integer"),
					contentHeight = window.innerHeight - headerHeight - footerHeight - paddings;

				return contentHeight;
			}

			function resizeImage(image, maxHeight, maxWidth) {
				var width = image.clientWidth,
					height = image.clientHeight,
					ratio = height / width,
					imageStyle = image.style;

				if (maxWidth === 0 && isNaN(maxHeight)) {
					/*
					* Exception : When image max width and height has incorrect value.
					* This exception is occured when this.maxImageWidth value is 0 and this.maxImageHeight value is NaN when page transition like rotation.
					* This exception affect that image width and height values are 0.
					*/
					imageStyle.width = width;
					imageStyle.height = width * ratio;
				} else {
					if (width > maxWidth) {
						imageStyle.width = maxWidth + "px";
						imageStyle.height = maxWidth * ratio + "px";
					}
					height = image.clientHeight;
					if (height > maxHeight) {
						imageStyle.height = maxHeight + "px";
						imageStyle.width = maxHeight / ratio + "px";
					}
				}
			}

			function setTranslatePosition(imageContainer, value) {
				var translate = "translate3d(" + value + ", 0px, 0px)",
					style = imageContainer.style;

				style.webkitTransform = translate;
				style.OTransform = translate;
				style.MozTransform = translate;
				style.transform = translate;

				return imageContainer;
			}

			function vmousemoveEvent(self, event) {
				event.preventDefault();
				if (self.moving || !self.dragging) {
					event.stopPropagation();
					return;
				}
				self._drag(event.pageX);
			}

			function vmousedownEvent(self, event) {
				event.preventDefault();
				if (self.moving) {
					event.stopPropagation();
					return;
				}
				self.dragging = true;
				self.orgX = event.pageX;
				self.orgTime = Date.now();
			}

			function vmouseupEvent(self, event) {
				if (self.moving) {
					event.stopPropagation();
					return;
				}
				self.dragging = false;
				self._move(event.pageX);
			}

			function vmouseoutEvent(self, event) {
				if (self.moving || !self.dragging) {
					return;
				}
				if ((event.pageX < 20) || (event.pageX > (self.maxImageWidth - 20))) {
					self._move(event.pageX);
					self.dragging = false;
				}
			}

			function loading(self, index, container) {
				var loadFunction = loading.bind(null, self, index, container);
				if (self.images[index] === undefined) {
					return;
				}
				if (!self.images[index].clientHeight) {
					setTimeout(loadFunction, 10);
					return;
				}
				resizeImage(self.images[index], self.maxImageHeight, self.maxImageWidth);
				self._align(index, container);
			}

			//function hideImage(image) {
			//	if (image) {
			//		image.style.visibility = "hidden";
			//	}
			//}

			/**
			* @property {Object} classes Dictionary for gallery related css class names
			* @member ns.widget.mobile.Gallery
			* @static
			*/
			Gallery.classes = {
				uiGallery: "ui-gallery",
				uiGalleryBg: "ui-gallery-bg",
				uiContent: "ui-content",
				uiHeader: "ui-header",
				uiFooter: "ui-footer"
			};

			/**
			* Configure gallery widget
			* @method _configure
			* @protected
			* @member ns.widget.mobile.Gallery
			*/
			Gallery.prototype._configure = function () {
				var options = this.options;
				/**
				 * @property {Object} options All possible widget options
				 * @property {boolean} [options.flicking=false] This property enables swinging of the first and the last images.
				 * @property {number} [options.duration=500] This property determines how long the animation of switching images will run.
				 * @property {"top"|"middle"|"bottom"} [options.verticalAlign="top"] This property sets the vertical alignment of a widget. The alignment options are top, middle, and bottom.
				 * @property {number} [options.index=0] This property defines the index number of the first image in the gallery.
				 * @member ns.widget.mobile.Gallery
				 */
				options.flicking = false;
				options.duration = 500;
				options.verticalAlign = "top";
				options.index = 0;
			};

			Gallery.prototype._detachAll = function (images) {
				var i = 0,
					length = images.length,
					image;
				while (i < length) {
					image = images[0];
					this.images[i] = image.parentNode.removeChild(image);
					i = i + 1;
				}
			};

			Gallery.prototype._detach = function (index, container) {
				var images = this.images,
					image = images[index];
				if (container && index >= 0 && index < images.length && image.parentNode) {
					container.style.display = "none";
					images[index] = image.parentNode.removeChild(image);
				}
			};

			/**
			* Build structure of gallery widget
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement}
			* @protected
			* @member ns.widget.mobile.Gallery
			*/
			Gallery.prototype._build = function (element) {
				var classes = Gallery.classes,
					options = this.options,
					images,
					image,
					index,
					i,
					length;

				images = selectors.getChildrenByTag(element, "img");
				for (i = 0, length = images.length; i < length; i++) {
					image = images[i];
					doms.wrapInHTML(image, "<div class='" + classes.uiGalleryBg + "'></div>");
				}
				if (element.children.length) {
					doms.wrapInHTML(element.children, "<div class='" + classes.uiGallery + "'></div>");
				} else {
					element.innerHTML = "<div class='" + classes.uiGallery + "'></div>";
				}
				index = parseInt(options.index, 10);
				if (!index) {
					index = 0;
				}
				if (index < 0) {
					index = 0;
				}
				if (index >= length) {
					index = length - 1;
				}

				this.index = index;

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Gallery
			*/
			Gallery.prototype._init = function (element) {
				var images = element.getElementsByTagName("img"),
					classes = Gallery.classes;
				this.container = selectors.getChildrenByClass(element, classes.uiGallery)[0];
				this._detachAll(images);

				// for 'compare' test
				this.max_width = this.maxImageWidth;
				this.max_height = this.maxImageHeight;
				this.org_x = this.orgX;
				this.org_time = this.orgTime;
				this.prev_img = this.previousImage;
				this.cur_img = this.currentImage;
				this.next_img = this.nextImage;
				this.images_hold = this.imagesHold;
			};

			/**
			* Bind events to widget
			* @method _bindEvents
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Gallery
			*/
			Gallery.prototype._bindEvents = function (element) {
				//todo
				//galleryorientationchanged

				var container = this.container,
					page = selectors.getClosestBySelectorNS(element, "role=page");

				this.vmousemoveHandler = vmousemoveEvent.bind(null, this);
				this.vmousedownHandler = vmousedownEvent.bind(null, this);
				this.vmouseupHandler =  vmouseupEvent.bind(null, this);
				this.vmouseoutHandler = vmouseoutEvent.bind(null, this);
				this.pageShowHandler = this.show.bind(this);
				this.throttledresizeHandler = this.refresh.bind(this);

				window.addEventListener("throttledresize", this.throttledresizeHandler, false);
				page.addEventListener("pageshow", this.pageShowHandler, false);

				container.addEventListener("vmousemove", this.vmousemoveHandler, false);
				container.addEventListener("vmousedown", this.vmousedownHandler, false);
				container.addEventListener("vmouseup", this.vmouseupHandler, false);
				container.addEventListener("vmouseout", this.vmouseoutHandler, false);
			};

			Gallery.prototype._align = function (index, container) {
				var image = this.images[index],
					imageTop = 0,
					align = this.options.verticalAlign;

				if (container) {
					if (align === "middle") {
						imageTop = (this.maxImageHeight - image.clientHeight) / 2;
					} else if (align === "bottom") {
						imageTop = this.maxImageHeight - image.clientHeight;
					} else {
						imageTop = 0;
					}
					container.style.top = imageTop + "px";
				}
			};

			Gallery.prototype._moveLeft = function (imageContainer, value, duration) {
				var transition = "";

				if (imageContainer) {
					if (duration !== undefined) {
						transition =  "-webkit-transform " + (duration / 1000) + "s ease";
						imageContainer.style.webkitTransition = transition;
					}
					imageContainer = setTranslatePosition(imageContainer, value);
				}
				return imageContainer;
			};

			Gallery.prototype._attach = function (index, container) {
				if (container && index >= 0 && this.images.length && index < this.images.length) {
					container.style.display = "block";
					container.appendChild(this.images[index]);
					loading(this, index, container);
				}
			};

			/**
			 * The show method is used to display the gallery.
			 * This method is called on event 'pageshow' and during refreshing.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *
			 *      galleryWidget.show();
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "show" );
			 *
			 * @method show
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.show = function () {
				var classes = Gallery.classes,
					index = this.index,
					element = this.element,
					previousImage,
					nextImage,
					currentImage;
				/* resizing */

				if (this.images.length) {
					this.windowWidth = window.innerWidth;
					this.maxImageWidth = element.clientWidth;
					this.maxImageHeight = getHeight(element);
					this.container.style.height = this.maxImageHeight + "px";

					currentImage = this.currentImage = element.getElementsByClassName(classes.uiGalleryBg)[index];
					previousImage = this.previousImage = currentImage.previousSibling;
					nextImage = this.nextImage = currentImage.nextSibling;

					this._attach(index - 1, previousImage);
					this._attach(index, currentImage);
					this._attach(index + 1, nextImage);

					if (previousImage) {
						setTranslatePosition(previousImage, -this.windowWidth + "px");
					}

					this._moveLeft(currentImage, "0px");
					if (nextImage) {
						setTranslatePosition(nextImage, this.windowWidth + "px");
					}
				}
			};

			Gallery.prototype._drag = function (x) {
				var delta,
					coordX,
					previousImage = this.previousImage,
					nextImage = this.nextImage,
					windowWidth = this.windowWidth;

				if (this.dragging) {
					if (this.options.flicking === false) {
						delta = this.orgX - x;

						// first image
						if (delta < 0 && !previousImage) {
							return;
						}
						// last image
						if (delta > 0 && !nextImage) {
							return;
						}
					}

					coordX = x - this.orgX;

					this._moveLeft(this.currentImage, coordX + "px");
					if (nextImage) {
						this._moveLeft(nextImage, coordX + windowWidth + "px");
					}
					if (previousImage) {
						this._moveLeft(previousImage, coordX - windowWidth + "px");
					}
				}
			};

			Gallery.prototype._move = function (x) {
				var delta = this.orgX - x,
					flip = 0,
					dragTime,
					sec,
					self,
					previousImage = this.previousImage,
					nextImage = this.nextImage;

				if (delta !== 0) {
					if (delta > 0) {
						flip = delta < (this.maxImageWidth * 0.45) ? 0 : 1;
					} else {
						flip = -delta < (this.maxImageWidth * 0.45) ? 0 : 1;
					}

					if (!flip) {
						dragTime = Date.now() - this.orgTime;

						if (Math.abs(delta) / dragTime > 1) {
							flip = 1;
						}
					}

					if (flip) {
						if (delta > 0 && nextImage) {
							/* next */
							this._detach(this.index - 1, previousImage);

							this.previousImage = this.currentImage;
							this.currentImage = nextImage;
							nextImage = this.nextImage = nextImage.nextSibling;

							this.index++;

							if (nextImage) {
								this._moveLeft(nextImage, this.windowWidth + "px");
								this._attach(this.index + 1, nextImage);
							}

							this.direction = 1;

						} else if (delta < 0 && previousImage) {
							/* prev */
							this._detach(this.index + 1, nextImage);

							this.nextImage = this.currentImage;
							this.currentImage = previousImage;
							previousImage = this.previousImage = this.previousImage.previousSibling;

							this.index--;

							if (previousImage) {
								this._moveLeft(previousImage, -this.windowWidth + "px");
								this._attach(this.index - 1, previousImage);
							}

							this.direction = -1;
						}
					}

					sec = this.options.duration;
					self = this;

					this.moving = true;

					setTimeout(function () {
						self.moving = false;
					}, sec - 25);

					this._moveLeft(this.currentImage, "0px", sec);
					if (this.nextImage) {
						this._moveLeft(this.nextImage, this.windowWidth + "px", sec);
					}
					if (this.previousImage) {
						this._moveLeft(this.previousImage, -this.windowWidth + "px", sec);
					}
				}
			};

			Gallery.prototype._deleteEvents = function () {
				var container = this.container;

				container.removeEventListener("vmousemove", this.vmousemoveHandler, false);
				container.removeEventListener("vmousedown", this.vmousedownHandler, false);
				container.removeEventListener("vmouseup", this.vmouseupHandler, false);
				container.removeEventListener("vmouseout", this.vmouseoutHandler, false);
			};

			/**
			 * The _unbind method is used to disable showing gallery on 'pageshow' event and refreshing gallery on 'throttledresize' event.
			 * @method _unbind
			 * @member ns.widget.mobile.Gallery
			 * @protected
			 */
			Gallery.prototype._unbind = function () {
				var page = selectors.getClosestBySelectorNS(this.element, "role=page");

				window.removeEventListener("throttledresize", this.throttledresizeHandler, false);
				page.removeEventListener("pageshow", this.pageShowHandler, false);
			};

			/**
			 * Removes the gallery functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *      galleryWidget.destroy();
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "destroy" );
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Gallery
			 */

			/**
			* Destroy gallery
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Gallery
			*/
			Gallery.prototype._destroy = function () {
				this._unbind();
				this._deleteEvents();
				//@todo adding returning element back
			};

			/**
			 * The add method is used to add an image to the gallery. As a parameter, the file URL of image should be passed.
			 *
			 * The refresh method must be call after adding. Otherwise, the file will be added, but not displayed.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *
			 *      galleryWidget.add( "./images/01.jpg" ); // image with attribute src='./images/01.jpg' will be added
			 *      galleryWidget.refresh( );
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "add", "./images/01.jpg" );
			 *      $( "#gallery" ).gallery( "add", "./images/02.jpg" );
			 *      $( "#gallery" ).gallery( "refresh" ); // to see changes, method 'refresh' must be called
			 *
			 * @method add
			 * @param {string} file the image's file URL
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.add = function (file) {
				this.imagesHold.push(file);
			};

			/**
			 * The remove method is used to delete an image from the gallery.
			 * If parameter is defined, the selected image is deleted. Otherwise, the current image is deleted.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *
			 *      galleryWidget.remove( 0 ); // the first image will be removed
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "remove", 0 );
			 *
			 * @method remove
			 * @param {number} [index] index of image, which should be deleted
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.remove = function (index) {
				var classes = Gallery.classes,
					images = this.images,
					currentIndex = this.index,
					container = this.container,
					previousImage,
					nextImage,
					tempImageContainer;

				if (index === undefined) {
					index = currentIndex;
				}

				if (index >= 0 && index < images.length) {
					if (index === currentIndex) {
						tempImageContainer = this.currentImage;
						if (currentIndex === 0) {
							this.direction = 1;
						} else if (currentIndex === images.length - 1) {
							this.direction = -1;
						}
						if (this.direction < 0) {
							previousImage = this.previousImage;
							this.currentImage = previousImage;
							this.previousImage = previousImage ? previousImage.previousSibling : null;
							if (this.previousImage) {
								this._moveLeft(this.previousImage, -this.windowWidth + "px");
								this._attach(index - 2, this.previousImage);
							}
							this.index--;
						} else {
							nextImage = this.nextImage;
							this.currentImage = nextImage;
							this.nextImage = nextImage ? nextImage.nextSibling : null;
							if (this.nextImage) {
								this._moveLeft(this.nextImage, this.windowWidth + "px");
								this._attach(index + 2, this.nextImage);
							}
						}
						this._moveLeft(this.currentImage, "0px", this.options.duration);
					} else if (index === currentIndex - 1) {
						tempImageContainer = this.previousImage;
						this.previousImage = this.previousImage.previousSibling;
						if (this.previousImage) {
							this._moveLeft(this.previousImage, -this.windowWidth + "px");
							this._attach(index - 1, this.previousImage);
						}
						this.index--;
					} else if (index === currentIndex + 1) {
						tempImageContainer = this.nextImage;
						this.nextImage = this.nextImage.nextSibling;
						if (this.nextImage) {
							this._moveLeft(this.nextImage, this.windowWidth + "px");
							this._attach(index + 1, this.nextImage);
						}
					} else {
						tempImageContainer = container.getElementsByClassName(classes.uiGalleryBg)[index];
					}

					container.removeChild(tempImageContainer);
					images.splice(index, 1);
				}

				return;
			};

			Gallery.prototype._hide = function () {
				var index = this.index;

				this._detach(index - 1, this.previousImage);
				this._detach(index, this.currentImage);
				this._detach(index + 1, this.nextImage);
			};

			/**
			 * The hide method is used to hide the gallery. It makes all images invisible and also unbinds all touch events.
			 *
			 *       @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *
			 *      galleryWidget.hide( ); // gallery will be hidden
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "hide" );
			 *
			 * @method hide
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.hide = function () {
				this._hide();
				this._deleteEvents();
			};

			Gallery.prototype._update = function () {
				var self = this,
					galleryBgClass = Gallery.classes.uiGalleryBg,
					images = self.images,
					imagesHold = self.imagesHold,
					imagesHoldLen = imagesHold.length,
					container = self.container,
					image,
					wrapped,
					imageFile,
					i;

				for (i = 0; i < imagesHoldLen; i++) {
					imageFile = imagesHold.shift();
					image = document.createElement("img");
					image.src = imageFile;
					wrapped = document.createElement("div");
					wrapped.classList.add(galleryBgClass);
					container.appendChild(wrapped);
					images.push(image);
				}
			};

			/**
			 * The refresh method is used to refresh the gallery.
			 *
			 * This method must be called after adding images to the gallery.
			 *
			 * This method is called automatically after changing any option of widget and calling method value with not empty parameter.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *      galleryWidget.refresh();
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "refresh" );
			 *
			 *      // also will be called automatically in during changing option (method 'option') or setting value (method 'value')
			 *
			 *      galleryWidget.option("flicking", true);
			 *      galleryWidget.value(0);
			 *
			 *
			 * @method refresh
			 * @param {number} [startIndex] index of the first image
			 * @return {?number} index of the first image, which will be displayed
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype._refresh = function (startIndex) {
				this._update();

				this._hide();

				if (startIndex === undefined) {
					startIndex = this.index;
				}

				startIndex = parseInt(startIndex, 10);

				if (startIndex < 0) {
					startIndex = 0;
				}
				if (startIndex >= this.images.length) {
					startIndex = this.images.length - 1;
				}

				this.index = startIndex;

				this.show();

				return this.index;

			};

			/**
			 * The empty method is used to remove all of images from the gallery.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *
			 *      galleryWidget.empty( ); // all images will be deleted
			 *
			 *      // or
			 *
			 *      $( "#gallery" ).gallery( "empty" );
			 *
			 * @method empty
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.empty = function () {
				this.container.innerHTML = "";
				this.images.length = 0;
			};

			/**
			 * The length method is used to get the number of images.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery")),
			 *          imagesItems;
			 *
			 *      imagesLength = galleryWidget.length( ); // number of images
			 *
			 *      // or
			 *
			 *      imagesLength = $( "#gallery" ).gallery( "length" );
			 *
			 * @method length
			 * @return {number}
			 * @member ns.widget.mobile.Gallery
			 */
			Gallery.prototype.length = function () {
				return this.images.length;
			};

			/**
			 * The value method is used to get or set current index of gallery.
			 * If parameter is not defined, the current index is return. Otherwise, the index of the image is set and proper image is displayed. The index of images is counted from 0. If new index is less than 0 or greater than or equal length of images, then the index will not be changed.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery")),
			 *          value = galleryWidget.value(); // value contains the index of current image
			 *
			 *      galleryWidget.value( 0 ); // the first image will be displayed
			 *
			 *      // or
			 *
			 *      value = $( "#gallery" ).gallery( "value" ); // value contains the index of current image
			 *
			 *      $( "#gallery" ).gallery( "value",  0 ); // the first image will be displayed
			 *
			 * @method value
			 * @param {?number} index of image, which should be displayed now
			 * @return {?number}
			 * @member ns.widget.mobile.Gallery
			 */

			Gallery.prototype._setValue = function (index) {
				this.refresh(index);
				return null;
			};

			Gallery.prototype._getValue = function () {
				return this.index;
			};

			/**
			* This method changes state of gallery on enabled and removes CSS classes connected with state.
			*
			*      @example
			*      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			*
			*      galleryWidget.enable();
			*
			*      // or
			*
			*      $( "#gallery" ).gallery( "enable" );
			*
			* @method enable
			* @chainable
			* @member ns.widget.mobile.Gallery
			*/

			/**
			* This method changes state of gallery on disabled and adds CSS classes connected with state.
			*
			*      @example
			*      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			*
			*      galleryWidget.disable();
			*
			*      // or
			*
			*      $( "#gallery" ).gallery( "disable" );
			*
			* @method disable
			* @chainable
			* @member ns.widget.mobile.Gallery
			*/

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Gallery
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery"));
			 *      galleryWidget.trigger("eventName");
			 *
			 *      // or
			 *
			 *      $("#gallery").gallery("trigger", "eventName");
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.Gallery
			*/

			/**
			 * Add event listener to widget's element.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery")),
			 *          callback = function () {
			 *              console.log("event fires");
			 *          });
			 *
			 *      galleryWidget.on("eventName", callback);
			 *
			 *      // or
			 *
			 *      $("#gallery").gallery("on", callback);
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Gallery
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *      @example
			 *      var galleryWidget = tau.widget.Gallery(document.getElementById("gallery")),
			 *          callback = function () {
			 *              console.log("event fires");
			 *          });
			 *
			 *      // add callback on event "eventName"
			 *      galleryWidget.on("eventName", callback);
			 *      // ...
			 *      // remove callback on event "eventName"
			 *      galleryWidget.off("eventName", callback);
			 *
			 *      // or
			 *
			 *      // add callback on event "eventName"
			 *      $("#gallery").gallery("on", callback);
			 *      // ...
			 *      // remove callback on event "eventName"
			 *      $("#gallery").gallery("off", "eventName", callback);
			 *
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Gallery
			 */

			// definition
			ns.widget.mobile.Gallery = Gallery;
			engine.defineWidget(
				"Gallery",
				"[data-role='gallery'], .ui-gallery-container",
				[
					"add",
					"remove",
					"empty",
					"length",
					"hide",
					"show"
				],
				Gallery,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Gallery;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
