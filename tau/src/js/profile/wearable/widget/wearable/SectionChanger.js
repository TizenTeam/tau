/*global window, define, Event, console */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # SectionChanger Widget
 * Shows a control that you can use to scroll through multiple *section*
 * elements.
 *
 * The section changer widget provides an application architecture, which has
 * multiple sections on a page and enables scrolling through the *section* elements.
 *
 * ## Manual constructor
 *
 *      @example
 *         <div id="hasSectionchangerPage" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">SectionChanger</h2>
 *             </header>
 *             <div id="sectionchanger" class="ui-content">
 *                 <!--Section changer has only one child-->
 *                 <div>
 *                     <section>
 *                         <h3>LEFT1 PAGE</h3>
 *                     </section>
 *                     <section class="ui-section-active">
 *                         <h3>MAIN PAGE</h3>
 *                     </section>
 *                     <section>
 *                         <h3>RIGHT1 PAGE</h3>
 *                     </section>
 *                 </div>
 *             </div>
 *         </div>
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("hasSectionchangerPage"),
 *                     element = document.getElementById("sectionchanger"),
 *                     sectionChanger;
 *
 *                 page.addEventListener("pageshow", function () {
 *                     // Create the SectionChanger object
 *                     sectionChanger = new tau.SectionChanger(element, {
 *                         circular: true,
 *                         orientation: "horizontal",
 *                         useBouncingEffect: true
 *                     });
 *                 });
 *
 *                 page.addEventListener("pagehide", function () {
 *                     // Release the object
 *                     sectionChanger.destroy();
 *                 });
 *             })();
 *         </script>
 *
 * ## Handling Events
 *
 * To handle section changer events, use the following code:
 *
 *      @example
 *         <script>
 *             (function () {
 *                 var changer = document.getElementById("sectionchanger");
 *                 changer.addEventListener("sectionchange", function (event) {
 *                     console.debug(event.detail.active + " section is active.");
 *                 });
 *             })();
 *         </script>
 *
 * @class ns.widget.wearable.SectionChanger
 * @since 2.2
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event/gesture",
			"../../../../core/widget/BaseWidget",
			"./scroller/Scroller",
			"./TabIndicator",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Scroller = ns.widget.wearable.scroller.Scroller,
				Gesture = ns.event.gesture,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				eventType = {
					/**
					 * Triggered when the section is changed.
					 * @event sectionchange
					 * @member ns.widget.wearable.SectionChanger
					 */
					CHANGE: "sectionchange"
				},
				classes = {
					uiSectionChanger: "ui-section-changer"
				};


			function SectionChanger() {
				this.options = {};
			}

			function calculateCustomLayout(direction, elements, lastIndex) {
				var len = lastIndex !== undefined ? lastIndex : elements.length,
					result = 0,
					i;
				for (i = 0; i < len; i++) {
					result += direction === Scroller.Orientation.HORIZONTAL ? elements[i].offsetWidth : elements[i].offsetHeight;
				}
				return result;
			}
			function calculateCenter(direction, elements, index) {
				var result = calculateCustomLayout(direction, elements, index + 1);
				result -= direction === Scroller.Orientation.HORIZONTAL ? elements[index].offsetWidth / 2 : elements[index].offsetHeight / 2;
				return result;
			}
			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function (element) {

					this.tabIndicatorElement = null;
					this.tabIndicator = null;

					this.sections = null;
					this.sectionPositions = [];

					this.activeIndex = 0;
					this.beforeIndex = 0;

					this._super(element);
					element.classList.add(classes.uiSectionChanger);
					return element;
				},

				_configure : function () {
					this._super();
					/**
					 * Options for widget
					 * @property {Object} options
					 * @property {"horizontal"|"vertical"} [options.orientation="horizontal"] Sets the section changer orientation:
					 * @property {boolean} [options.circular=false] Presents the sections in a circular scroll fashion.
					 * @property {boolean} [options.useBouncingEffect=false] Shows a scroll end effect on the scroll edge.
					 * @property {string} [options.items="section"] Defines the section element selector.
					 * @property {string} [options.activeClass="ui-section-active"] Specifies the CSS classes which define the active section element. Add the specified class (ui-section-active) to a *section* element to indicate which section must be shown first. By default, the first section is shown first.
					 * @property {boolean} [options.fillContent=true] declare to section tag width to fill content or not.
					 * @member ns.widget.wearable.SectionChanger
					 */
					this.options = utilsObject.merge(this.options, {
						items: "section",
						activeClass: "ui-section-active",
						circular: false,
						animate: true,
						animateDuration: 100,
						orientation: "horizontal",
						changeThreshold: -1,
						useTab: false,
						fillContent: true
					});
				},

				_init: function (element) {
					var o = this.options,
						scroller = this.scroller,
						sectionLength, i, className;

					scroller.style.position = "absolute";
					this._sectionChangerWidth = element.offsetWidth;
					this._sectionChangerHeight = element.offsetHeight;
					this._sectionChangerHalfWidth = this._sectionChangerWidth / 2;
					this._sectionChangerHalfHeight = this._sectionChangerHeight / 2;
					this.orientation = o.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL;

					if (o.scrollbar === "tab") {
						o.scrollbar = false;
						o.useTab = true;
					}

					this.sections = typeof o.items === "string" ?
						scroller.querySelectorAll(o.items) :
						o.items;
					sectionLength = this.sections.length;

					if (o.circular && sectionLength < 3) {
						throw "if you use circular option, you must have at least three sections.";
					}

					if (this.activeIndex >= sectionLength) {
						this.activeIndex = sectionLength - 1;
					}

					for (i = 0; i < sectionLength; i++) {
						className = this.sections[i].className;
						if (className && className.indexOf(o.activeClass) > -1) {
							this.activeIndex = i;
						}

						this.sectionPositions[i] = i;
					}

					this._prepareLayout();
					this._initLayout();
					this._super();
					this._repositionSections(true);
					this.setActiveSection(this.activeIndex);

					// set corret options values.
					if (!o.animate) {
						o.animateDuration = 0;
					}
					if (o.changeThreshold < 0) {
						o.changeThreshold = this._sectionChangerHalfWidth;
					}

					if (this.enabled && sectionLength > 1) {
						this.enable();
					} else {
						this.disable();
					}
					return element;
				},

				_prepareLayout: function () {
					var o = this.options,
						sectionLength = this.sections.length,
						width = this._sectionChangerWidth,
						height = this._sectionChangerHeight,
						orientation = this.orientation,
						scrollerStyle = this.scroller.style,
						tabHeight;

					if (o.useTab) {
						this._initTabIndicator();
						tabHeight = this.tabIndicatorElement.offsetHeight;
						height -= tabHeight;
						this._sectionChangerHalfHeight = height / 2;
						this.element.style.height = height + "px";
						this._sectionChangerHeight = height;
					}

					if (orientation === Scroller.Orientation.HORIZONTAL) {
						scrollerStyle.width = (o.fillContent ? width * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
						scrollerStyle.height = height + "px"; //set Scroller width
					} else {
						scrollerStyle.width = width + "px"; //set Scroller width
						scrollerStyle.height = (o.fillContent ? height * sectionLength : calculateCustomLayout(orientation, this.sections)) + "px";
					}

				},

				_initLayout: function () {
					var sectionStyle = this.sections.style,
						left = 0,
						top = 0,
						i, sectionLength;

					//section element has absolute position
					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						//Each section set initialize left position
						sectionStyle = this.sections[i].style;
						sectionStyle.position = "absolute";
						if (this.options.fillContent) {
							sectionStyle.width = this._sectionChangerWidth + "px";
							sectionStyle.height = this._sectionChangerHeight + "px";
						}

						if (this.orientation === Scroller.Orientation.HORIZONTAL) {
							top = 0;
							left = calculateCustomLayout(this.orientation, this.sections, i);
						} else {
							top = calculateCustomLayout(this.orientation, this.sections, i);
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

				},

				_initBouncingEffect: function () {
					var o = this.options;
					if (!o.circular) {
						this._super();
					}
				},

				_translateScrollbar: function (x, y, duration, autoHidden) {
					var offset;

					if (!this.scrollbar) {
						return;
					}

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						offset = (-x + this.minScrollX);
					} else {
						offset = (-y + this.minScrollY);
					}

					this.scrollbar.translate(offset, duration, autoHidden);
				},

				_translateScrollbarWithPageIndex: function (pageIndex, duration) {
					var offset;

					if (!this.scrollbar) {
						return;
					}

					offset = calculateCustomLayout(this.orientation, this.sections, this.activeIndex);

					this.scrollbar.translate(offset, duration);
				},

				_initTabIndicator: function () {
					var elem = this.tabIndicatorElement = document.createElement("div");
					this.element.parentNode.insertBefore(elem, this.element);

					this.tabIndicator = new engine.instanceWidget(elem, "TabIndicator");
					this.tabIndicator.setSize(this.sections.length);
					this.tabIndicator.setActive(this.activeIndex);
					this.tabIndicatorHandler = function (e) {
						this.tabIndicator.setActive(e.detail.active);
					}.bind(this);
					this.element.addEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
				},

				_clearTabIndicator: function () {
					if (this.tabIndicator) {
						this.element.parentNode.removeChild(this.tabIndicatorElement);
						this.element.removeEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
						this.tabIndicator.destroy();
						this.tabIndicator = null;
						this.tabIndicatorElement = null;
						this.tabIndicatorHandler = null;
					}
				},

				_resetLayout: function () {
					var //scrollerStyle = this.scroller.style,
						sectionStyle = this.sections.style,
						i, sectionLength;

					//scrollerStyle.width = "";
					//scrollerStyle.height = "";
					//this.scroller || this.scroller._resetLayout();

					for (i = 0, sectionLength = this.sections.length; i < sectionLength; i++) {
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "";
						sectionStyle.width = "";
						sectionStyle.height = "";
						sectionStyle.top = "";
						sectionStyle.left = "";
					}

					this._super();
				},

				_bindEvents: function () {
					this._super();

					ns.event.enableGesture(
						this.scroller,

						new ns.event.gesture.Swipe({
							orientation: this.orientation === Scroller.Orientation.HORIZONTAL ?
								Gesture.Orientation.HORIZONTAL :
								Gesture.Orientation.VERTICAL
						})
					);

					utilsEvents.on(this.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", this);
				},

				_unbindEvents: function () {
					this._super();

					if (this.scroller) {
						ns.event.disableGesture(this.scroller);
						utilsEvents.off(this.scroller,
							"swipe transitionEnd webkitTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd", this);
					}
				},

				/**
				 * This method manages events.
				 * @method handleEvent
				 * @returns {Event} event
				 * @member ns.widget.wearable.SectionChanger
				 */
				handleEvent: function (event) {
					this._super(event);

					switch (event.type) {
						case "swipe":
							this._swipe(event);
							break;
						case "webkitTransitionEnd":
						case "mozTransitionEnd":
						case "msTransitionEnd":
						case "oTransitionEnd":
						case "transitionEnd":
							this._endScroll();
							break;
					}
				},

				_notifyChanagedSection: function (index) {
					var activeClass = this.options.activeClass,
						sectionLength = this.sections.length,
						i=0, section;

					for (i=0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					this._fireEvent(eventType.CHANGE, {
						active: index
					});
				},

				/**
				 * Changes the currently active section element.
				 * @method setActiveSection
				 * @param {number} index
				 * @param {number} duration For smooth scrolling,
				 * the duration parameter must be in milliseconds.
				 * @member ns.widget.wearable.SectionChanger
				 */
				setActiveSection: function (index, duration) {
					var position = this.sectionPositions[ index ],
						scrollbarDuration = duration,
						oldActiveIndex = this.activeIndex,
						newX=0,
						newY= 0,
						centerX = 0,
						centerY = 0;

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						newX = -calculateCenter(this.orientation, this.sections, position);
					} else {
						newY = -calculateCenter(this.orientation, this.sections, position);
					}

					if (this.beforeIndex - index > 1 || this.beforeIndex - index < -1) {
						scrollbarDuration = 0;
					}

					this.activeIndex = index;
					this.beforeIndex = this.activeIndex;

					if (newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY) {
						if (this.orientation === Scroller.Orientation.HORIZONTAL) {
							centerX = this._sectionChangerHalfWidth + newX;
						} else {
							centerY = this._sectionChangerHalfHeight + newY;
						}

						this._translate(centerX, centerY, duration);
						this._translateScrollbarWithPageIndex(index, scrollbarDuration);
					} else {
						this._endScroll();
					}

					// notify changed section.
					if (this.activeIndex !== oldActiveIndex) {
						this._notifyChanagedSection(this.activeIndex);
					}
				},

				/**
				 * Gets the currently active section element's index.
				 * @method getActiveSectionIndex
				 * @returns {number}
				 * @member ns.widget.wearable.SectionChanger
				 */
				getActiveSectionIndex: function () {
					return this.activeIndex;
				},

				_start: function (e) {
					this._super(e);

					this.beforeIndex = this.activeIndex;
				},

				_move: function (e) {
					var changeThreshold = this.options.changeThreshold,
						delta = this.orientation === Scroller.Orientation.HORIZONTAL ? e.detail.deltaX : e.detail.deltaY,
						oldActiveIndex = this.activeIndex;

					this._super(e);

					if (!this.scrolled) {
						return;
					}

					if (delta > changeThreshold) {
						this.activeIndex = this._calculateIndex(this.beforeIndex - 1);
					} else if (delta < -changeThreshold) {
						this.activeIndex = this._calculateIndex(this.beforeIndex + 1);
					} else {
						this.activeIndex = this.beforeIndex;
					}

					// notify changed section.
					if (this.activeIndex !== oldActiveIndex) {
						this._notifyChanagedSection(this.activeIndex);
					}
				},

				_end: function (/* e */) {
					if ( this.scrollbar ) {
						this.scrollbar.end();
					}

					if (!this.enabled || this.scrollCanceled || !this.dragging) {
						return;
					}

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					this.setActiveSection(this.activeIndex, this.options.animateDuration);
					this.dragging = false;
				},

				_swipe: function (e) {
					var offset = e.detail.direction === Gesture.Direction.UP || e.detail.direction === Gesture.Direction.LEFT ? 1 : -1,
						newIndex = this._calculateIndex(this.beforeIndex + offset);

					if (!this.enabled || this.scrollCanceled || !this.dragging) {
						return;
					}

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					if (this.activeIndex !== newIndex) {
						this.activeIndex = newIndex;
						this._notifyChanagedSection(newIndex);
					}

					this.setActiveSection(newIndex, this.options.animateDuration);
					this.dragging = false;
				},

				_endScroll: function () {
					if (!this.enabled || !this.scrolled || this.scrollCanceled) {
						return;
					}

					this._repositionSections();
					this._super();
				},

				_repositionSections: function (init) {
					// if developer set circular option is true, this method used when webkitTransitionEnd event fired
					var sectionLength = this.sections.length,
						curPosition = this.sectionPositions[this.activeIndex],
						centerPosition = window.parseInt(sectionLength/2, 10),
						circular = this.options.circular,
						centerX = 0,
						centerY = 0,
						i, sectionStyle, sIdx, top, left, newX, newY;

					if (this.orientation === Scroller.Orientation.HORIZONTAL) {
						newX = -(calculateCenter(this.orientation, this.sections, (circular ? centerPosition : this.activeIndex)));
						newY = 0;
					} else {
						newX = 0;
						newY = -(calculateCenter(this.orientation, this.sections, (circular ? centerPosition : this.activeIndex)));
					}

					this._translateScrollbarWithPageIndex(this.activeIndex);

					if (init || (curPosition === 0 || curPosition === sectionLength - 1)) {

						if (this.orientation === Scroller.Orientation.HORIZONTAL) {
							centerX = this._sectionChangerHalfWidth + newX;
						} else {
							centerY = this._sectionChangerHalfHeight + newY;
						}
						this._translate(centerX, centerY);

						if (circular) {
							for (i = 0; i < sectionLength; i++) {
								sIdx = (sectionLength + this.activeIndex - centerPosition + i) % sectionLength;
								sectionStyle = this.sections[ sIdx ].style;

								this.sectionPositions[sIdx] = i;

								if (this.orientation === Scroller.Orientation.HORIZONTAL) {
									top = 0;
									left = calculateCustomLayout(this.orientation, this.sections, i);
								} else {
									top = calculateCustomLayout(this.orientation, this.sections, i);
									left = 0;
								}

								sectionStyle.top = top + "px";
								sectionStyle.left = left + "px";
							}
						}
					}
				},

				_calculateIndex: function (newIndex) {
					var sectionLength = this.sections.length;

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					return newIndex;
				},

				_clear: function () {
					this._clearTabIndicator();
					this._super();
					this.sectionPositions.length = 0;
				}
			});

			ns.widget.wearable.SectionChanger = SectionChanger;

			engine.defineWidget(
				"SectionChanger",
				".scroller",
				["getActiveSectionIndex", "setActiveSection"],
				SectionChanger
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
