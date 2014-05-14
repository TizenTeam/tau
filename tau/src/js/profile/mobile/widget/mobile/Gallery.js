/*global window, define */
/*jslint nomen: true, plusplus: true */
/**
 * #Gallery widget

 * @class ns.widget.mobile.Gallery
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/selectors",
			"../../../../core/utils/DOM/attributes",
			"../../../../core/utils/DOM/css",
			"../../../../core/utils/DOM/manipulation",
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
				* @property {Object} selectors Alias for class {@link ns.utils.selectors}
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				selectors = ns.utils.selectors,
				/**
				* @property {Object} doms Alias for class ns.utils.DOM
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				doms = ns.utils.DOM,
				/**
				* Alias for class ns.widget.mobile.Gallery
				* @method Gallery
				* @member ns.widget.mobile.Gallery
				* @private
				*/
				Gallery = function () {
					/**
					* @property {Object} options Object with default options
					* @member ns.widget.mobile.Gallery
					* @instance
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
			* @instance
			*/
			Gallery.prototype._configure = function () {
				var options = this.options;
				/**
				* flicking
				* @property {boolean} [options.flicking=false]
				* @member ns.widget.mobile.Gallery
				* @instance
				*/
				/** @expose */
				options.flicking = false;
				/**
				* duration
				* @property {number} [options.duration=500]
				* @member ns.widget.mobile.Gallery
				* @instance
				*/
				/** @expose */
				options.duration = 500;
				options.verticalAlign = "top";
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
			* @instance
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
				index = parseInt(doms.getNSData(element, "index"), 10);
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
				options.verticalAlign = doms.getNSData(element, "vertical-align");

				return element;
			};

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @protected
			* @member ns.widget.mobile.Gallery
			* @instance
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
			* @instance
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

			Gallery.prototype.unbind = function () {
				var page = selectors.getClosestBySelectorNS(this.element, "role=page");

				window.removeEventListener("throttledresize", this.throttledresizeHandler, false);
				page.removeEventListener("pageshow", this.pageShowHandler, false);
			};

			/**
			* Destroy gallery
			* @method _destroy
			* @protected
			* @member ns.widget.mobile.Gallery
			* @instance
			*/
			Gallery.prototype._destroy = function () {
				this.unbind();
				this._deleteEvents();
			};

			/*
			* add the image (parameter: url of iamge)
			*/
			Gallery.prototype.add = function (file) {
				this.imagesHold.push(file);
			};

			/*
			* remove the image (parameter: index of image)
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

			/*
			* refresh the widget, should be called after add or remove. (parameter: start index)
			*/
			Gallery.prototype.refresh = function (startIndex) {
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

			/*
			* remove all of images from the gallery
			*/
			Gallery.prototype.empty = function () {
				this.container.innerHTML = "";
				this.images.length = 0;
			};

			/*
			* get length of images
			*/
			Gallery.prototype.length = function () {
				return this.images.length;
			};

			/**
			 * get or set current index of gallery (parameter: index of image)
			 * @param index
			 * @returns {?number}
			 */
			Gallery.prototype.value = function (index) {
				if (index === undefined) {
					return this.index;
				}
				this.refresh(index);
				return null;
			};

			// definition
			ns.widget.mobile.Gallery = Gallery;
			engine.defineWidget(
				"Gallery",
				"[data-role='gallery'], .ui-gallery-container",
				[
					"add",
					"remove",
					"refresh",
					"empty",
					"length",
					"value",
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
