/*global window, define, Event, console */
/*jslint nomen: true, plusplus: true */
/**
 * section Changer widget
 * @class ns.widget.SectionChanger
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../utils/selectors",
			"../BaseWidget",
			"./scroller/Scroller",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Scroller = ns.widget.wearable.scroller.Scroller,
				engine = ns.engine,
				utilsObject = ns.utils.object,
				eventType = {
					CHANGE: "sectionchange"
				};

			function SectionChanger( ) {
				this.options = {};
			}

			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function( element ) {

					this.sections = null;
					this.sectionPositions = [];
					this.activeIndex = 0;

					this._super( element );
					return element;
				},

				_configure : function( ) {
					this._super();
					var options = this.options;
					options.items = "section";
					options.activeClass = "section-active";
					options.circular = false;
					options.animate = true;
					options.animateDuration = 100;
					options.orientation = "horizontal";
					options.changeThreshold = -1;
				},

				_init: function() {
					var sectionLength, i, className;

					this.sections = typeof this.options.items === "string" ?
						this.scroller.querySelectorAll( this.options.items ) :
						this.options.items;

					sectionLength = this.sections.length;

					if (  this.options.circular && sectionLength < 3 ) {
						throw "if you use circular option, you must have at least three sections.";
					}

					if ( this.activeIndex >= sectionLength ) {
						this.activeIndex = sectionLength - 1;
					}

					for( i = 0; i < sectionLength; i++ ) {
						className = this.sections[i].className;
						if ( className && className.indexOf( this.options.activeClass ) > -1 ) {
							this.activeIndex = i;
						}

						this.sectionPositions[i] = i;
					}

					this.setActiveSection( this.activeIndex );
					this._prepareLayout();
					this._super();
					this._repositionSections( true );

					// set corret options values.
					if ( !this.options.animate ) {
						this.options.animateDuration = 0;
					}
					if ( this.options.changeThreshold < 0 ) {
						this.options.changeThreshold = this.width / 3;
					}

					if ( sectionLength > 1 ) {
						this.enable();
					} else {
						this.disable();
					}
				},

				_prepareLayout: function() {
					var sectionLength = this.sections.length,
						width = this.element.offsetWidth,
						height = this.element.offsetHeight,
						orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL,
						scrollerStyle = this.scroller.style;

					// circular option is false.
					if ( orientation === Scroller.Orientation.HORIZONTAL ) {
						scrollerStyle.width = width * sectionLength + "px"; //set Scroller width
						scrollerStyle.height = height + "px"; //set Scroller width
					} else {
						scrollerStyle.width = width + "px"; //set Scroller width
						scrollerStyle.height = height * sectionLength + "px"; //set Scroller width
					}
				},

				_initLayout: function() {
					var sectionStyle = this.sections.style,
						i, sectionLength, top, left;

					//section element has absolute position
					for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
						//Each section set initialize left position
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "absolute";
						sectionStyle.width = this.width + "px";
						sectionStyle.height = this.height + "px";
						if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
							top = 0;
							left = this.width * i;
						} else {
							top = this.height * i;
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

					this._super();
				},

				_initScrollbar: function() {
					var scrollbarType = this.options.scrollbar,
						i;

					this.scrollbarelement = document.createElement('div');
					for (i=0; i<this.element.children.length; i++) {
						this.scrollbarelement.appendChild(this.element.children[i]);
					}
					this.element.appendChild(this.scrollbarelement);
					if (scrollbarType) {
						this.scrollbar = engine.instanceWidget(this.scrollbarelement, 'Scrollbar', {
							type: scrollbarType,
							orientation: this.orientation
						});
					}
				},

				_initBouncingEffect: function() {
					var o = this.options;
					if ( o.useBouncingEffect && !o.circular ) {
						this.bouncingEffect = new Scroller.Effect.Bouncing(this.element, {
							maxScrollX: this.maxScrollX,
							maxScrollY: this.maxScrollY,
							orientation: this.orientation
						});
					}
				},

				_translateScrollbar: function( x, y, duration ) {
					var offset, preOffset, fixedOffset;

					if ( !this.scrollbar ) {
						return;
					}

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						preOffset = this.sectionPositions[this.activeIndex] * this.width;
						offset = this.activeIndex * this.width;
						fixedOffset = offset - preOffset;
						offset = -x + fixedOffset;
					} else {
						preOffset = this.sectionPositions[this.activeIndex] * this.height;
						offset = this.activeIndex * this.height;
						fixedOffset = offset - preOffset;
						offset = -y + fixedOffset;
					}

					this.scrollbar.translate( offset, duration );
				},

				_translateScrollbarWithPageIndex: function(pageIndex, duration) {
					var offset;

					if ( !this.scrollbar ) {
						return;
					}

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						offset = pageIndex * this.width;
					} else {
						offset = pageIndex * this.height;
					}

					this.scrollbar.translate( offset, duration );
				},

				_resetLayout: function() {
					var scrollerStyle = this.scroller.style,
						sectionStyle = this.sections.style,
						i, sectionLength;

					scrollerStyle.width = "";
					scrollerStyle.height = "";

					for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "";
						sectionStyle.width = "";
						sectionStyle.height = "";
						sectionStyle.top = "";
						sectionStyle.left = "";
					}

					this._super();
				},

				_bindEvents: function() {
					this._super();
					this.scroller.addEventListener( "webkitTransitionEnd", this);
				},

				_unbindEvents: function() {
					this._super();
					this.scroller.removeEventListener( "webkitTransitionEnd", this);
				},

				handleEvent: function( event ) {
					this._super( event );
					switch (event.type) {
						case "webkitTransitionEnd":
							this._endScroll();
							break;
					}
				},

				setActiveSection: function( index, duration ) {
					var activeClass = this.options.activeClass,
						scrollbarIndex, section, sectionLength, position, newX, newY, i;

					sectionLength = this.sections.length;
					position = this.sectionPositions[ index ];

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						newY = 0;
						newX = -this.width * position;
					} else {
						newY = -this.height * position;
						newX = 0;
					}

					// scrollbar index when circular option is true.
					if ( this.activeIndex - index > 1 ) {
						scrollbarIndex = this.activeIndex + 1;
					} else if ( this.activeIndex - index < -1 ) {
						scrollbarIndex = this.activeIndex - 1;
					} else {
						scrollbarIndex = index;
					}

					this.activeIndex = index;

					for ( i=0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
						this._translate( newX, newY, duration);
						this._translateScrollbarWithPageIndex( scrollbarIndex, duration);
					} else {
						this._endScroll();
					}
				},

				getActiveSectionIndex: function() {
					return this.activeIndex;
				},

				_end: function(/* e */) {
					var lastX = Math.round(this.lastTouchPointX),
						lastY = Math.round(this.lastTouchPointY),
						distX = this.lastTouchPointX - this.startTouchPointX,
						distY = this.lastTouchPointY - this.startTouchPointY,
						dist = this.orientation === Scroller.Orientation.HORIZONTAL ? distX : distY,
						distanceX = Math.abs(lastX - this.startTouchPointX),
						distanceY = Math.abs(lastY - this.startTouchPointY),
						distance = this.orientation === Scroller.Orientation.HORIZONTAL ? distanceX : distanceY,
						maxDistance = this.orientation === Scroller.Orientation.HORIZONTAL ? this.maxScrollX : this.maxScrollY,
						endOffset = this.orientation === Scroller.Orientation.HORIZONTAL ? this.scrollerOffsetX : this.scrollerOffsetY,
						endTime = (new Date()).getTime(),
						duration = endTime - this.startTime,
						flick = duration < 300 && endOffset <= 0 && endOffset >= maxDistance && distance > this.options.flickThreshold,
						requestScrollEnd = this.initiated && ( this.moved || flick ),
						sectionLength = this.sections.length,
						changeThreshold = this.options.changeThreshold,
						cancel = !flick && changeThreshold > distance,
						newIndex=0;

					this.touching = false;

					// bouncing effect
					if ( this.bouncingEffect ) {
						this.bouncingEffect.dragEnd();
					}

					if ( !requestScrollEnd ) {
						this._endScroll();
						return;
					}

					if ( !cancel && dist < 0 ) {
						newIndex = this.activeIndex + 1;
					} else if ( !cancel && dist > 0 ){
						newIndex = this.activeIndex - 1;
					} else {
						// canceled
						newIndex = this.activeIndex;
					}

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					this.setActiveSection( newIndex, this.options.animateDuration );
				},

				_endScroll: function() {
					this._repositionSections();
					this._fireEvent( eventType.CHANGE, {
						active: this.activeIndex
					});
					this._super();
				},

				_repositionSections: function( init ) {
					// if developer set circular option is true, this method used when webkitTransitionEnd event fired
					var sectionLength = this.sections.length,
						curPosition = this.sectionPositions[this.activeIndex],
						centerPosition = window.parseInt(sectionLength/2, 10),
						circular = this.options.circular,
						i, sectionStyle, sIdx, top, left, newX, newY;

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						newX = -(this.width * ( circular ? centerPosition : this.activeIndex) );
						newY = 0;
					} else {
						newX = 0;
						newY = -(this.height * ( circular ? centerPosition : this.activeIndex) );
					}

					this._translateScrollbarWithPageIndex(this.activeIndex);

					if ( init || ( curPosition === 0 || curPosition === sectionLength - 1) ) {

						this._translate( newX, newY );

						if ( circular ) {
							for ( i = 0; i < sectionLength; i++ ) {
								sIdx = ( sectionLength + this.activeIndex - centerPosition + i ) % sectionLength;
								sectionStyle = this.sections[ sIdx ].style;

								this.sectionPositions[sIdx] = i;

								if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
									top = 0;
									left = this.width * i;
								} else {
									top = this.height * i;
									left = 0;
								}

								sectionStyle.top = top + "px";
								sectionStyle.left = left + "px";
							}
						}
					}
				},

				_clear: function() {
					this._super();
					this.sectionPositions.length = 0;
				}
			});

			ns.widget.wearable.SectionChanger = SectionChanger;

			engine.defineWidget(
				"SectionChanger",
				".scroller",
				[],
				SectionChanger
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
