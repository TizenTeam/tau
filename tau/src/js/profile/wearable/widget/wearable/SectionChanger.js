/*global window, define, Event, console */
/*jslint nomen: true, plusplus: true */
/**
 * #SectionChanger Widget
 *
 *
 * @class ns.widget.SectionChanger
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/utils/selectors",
			"../../../../core/events/gesture",
			"../../../../core/widget/BaseWidget",
			"./scroller/Scroller",
			"./TabIndicator",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Scroller = ns.widget.wearable.scroller.Scroller,
				Gesture = ns.events.gesture,
				engine = ns.engine,
				utilsObject = ns.utils.object,
				utilsEvents = ns.utils.events,
				eventType = {
					CHANGE: "sectionchange"
				};

			function SectionChanger( ) {
				this.options = {};
			}

			utilsObject.inherit(SectionChanger, Scroller, {
				_build: function( element ) {

					this.tabIndicatorElement = null;
					this.tabIndicator = null;

					this.sections = null;
					this.sectionPositions = [];

					this.activeIndex = 0;
					this.beforeIndex = 0;

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
					options.useTab = false;
				},

				_init: function(element) {
					var o = this.options,
						sectionLength, i, className;

					if ( o.scrollbar === "tab" ) {
						o.scrollbar = false;
						o.useTab = true;
					}

					this.sections = typeof o.items === "string" ?
						this.scroller.querySelectorAll( o.items ) :
						o.items;

					sectionLength = this.sections.length;

					if ( o.circular && sectionLength < 3 ) {
						throw "if you use circular option, you must have at least three sections.";
					}

					if ( this.activeIndex >= sectionLength ) {
						this.activeIndex = sectionLength - 1;
					}

					for( i = 0; i < sectionLength; i++ ) {
						className = this.sections[i].className;
						if ( className && className.indexOf( o.activeClass ) > -1 ) {
							this.activeIndex = i;
						}

						this.sectionPositions[i] = i;
					}

					this.setActiveSection( this.activeIndex );

					this._prepareLayout();
					this._super();
					this._repositionSections( true );

// set corret options values.
					if ( !o.animate ) {
						o.animateDuration = 0;
					}
					if ( o.changeThreshold < 0 ) {
						o.changeThreshold = this.width / 2;
					}

					if ( sectionLength > 1 ) {
						this.enable();
					} else {
						this.disable();
					}
					return element;
				},

				_prepareLayout: function() {
					var o = this.options,
						sectionLength = this.sections.length,
						width = this.element.offsetWidth,
						height = this.element.offsetHeight,
						orientation = o.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL,
						scrollerStyle = this.scroller.style,
						tabHeight;

					if ( o.useTab ) {
						this._initTabIndicator();
						tabHeight = this.tabIndicatorElement.offsetHeight;
						this.element.style.height = (height - tabHeight) + "px";
						height -= tabHeight;
					}

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
						width = this.width,
						height = this.height,
						i, sectionLength, top, left;

//section element has absolute position
					for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
//Each section set initialize left position
						sectionStyle = this.sections[i].style;

						sectionStyle.position = "absolute";
						sectionStyle.width = width + "px";
						sectionStyle.height = height + "px";
						if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
							top = 0;
							left = width * i;
						} else {
							top = height * i;
							left = 0;
						}

						sectionStyle.top = top + "px";
						sectionStyle.left = left + "px";
					}

					this._super();
				},

				_initBouncingEffect: function() {
					var o = this.options;
					if ( !o.circular ) {
						this._super();
					}
				},

				_translateScrollbar: function( x, y, duration ) {
					var standard = this.orientation === Scroller.Orientation.HORIZONTAL ? this.width : this.height,
						preOffset = this.sectionPositions[this.activeIndex] * standard,
						offset = this.activeIndex * standard,
						fixedOffset = offset - preOffset;

					if ( !this.scrollbar ) {
						return;
					}

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						offset = -x + fixedOffset;
					} else {
						offset = -y + fixedOffset;
					}

					this.scrollbar.translate( offset, duration );
				},

				_translateScrollbarWithPageIndex: function(pageIndex, duration) {
					var standard = this.orientation === Scroller.Orientation.HORIZONTAL ? this.width : this.height,
						offset = pageIndex * standard;

					if ( !this.scrollbar ) {
						return;
					}

					this.scrollbar.translate( offset, duration );
				},

				_initTabIndicator: function() {
					var elem = this.tabIndicatorElement = document.createElement("div");
					this.element.parentNode.insertBefore(elem, this.element);

					this.tabIndicator = new engine.instanceWidget(elem, "TabIndicator");
					this.tabIndicator.setSize( this.sections.length );
					this.tabIndicator.setActive( this.activeIndex );
					this.tabIndicatorHandler = function( e ){
						this.tabIndicator.setActive( e.detail.active );
					}.bind(this);
					this.element.addEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
				},

				_clearTabIndicator: function() {
					if ( this.tabIndicator ) {
						this.element.parentNode.removeChild( this.tabIndicatorElement );
						this.element.removeEventListener(eventType.CHANGE, this.tabIndicatorHandler, false);
						this.tabIndicator.destroy();
						this.tabIndicator = null;
						this.tabIndicatorElement = null;
						this.tabIndicatorHandler = null;
					}
				},

				_resetLayout: function() {
					var //scrollerStyle = this.scroller.style,
						sectionStyle = this.sections.style,
						i, sectionLength;

					//scrollerStyle.width = "";
					//scrollerStyle.height = "";
					//this.scroller || this.scroller._resetLayout();

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

					ns.events.enableGesture(
						this.scroller,

						new ns.events.gesture.Swipe({
							orientation: this.orientation === Scroller.Orientation.HORIZONTAL ?
								Gesture.Orientation.HORIZONTAL :
								Gesture.Orientation.VERTICAL
						})
					);

					utilsEvents.on( this.scroller, "swipe webkitTransitionEnd", this);
				},

				_unbindEvents: function() {
					this._super();

					if (this.scroller) {
						ns.events.disableGesture( this.scroller );
						utilsEvents.off( this.scroller, "swipe webkitTransitionEnd", this);
					}
				},

				handleEvent: function( event ) {
					this._super( event );

					switch (event.type) {
						case "swipe":
							this._swipe( event );
							break;
						case "webkitTransitionEnd":
							this._endScroll();
							break;
					}
				},

				_notifyChanagedSection: function( index ) {
					var activeClass = this.options.activeClass,
						sectionLength = this.sections.length,
						i=0, section;

					for ( i=0; i < sectionLength; i++) {
						section = this.sections[i];
						section.classList.remove(activeClass);
						if (i === this.activeIndex) {
							section.classList.add(activeClass);
						}
					}

					this._fireEvent( eventType.CHANGE, {
						active: index
					});
				},

				setActiveSection: function( index, duration ) {
					var position = this.sectionPositions[ index ],
						scrollbarDuration = duration,
						newX=0,
						newY=0;

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						newX = -this.width * position;
					} else {
						newY = -this.height * position;
					}

					if ( this.beforeIndex - index > 1 || this.beforeIndex - index < -1 ) {
						scrollbarDuration = 0;
					}

					this.activeIndex = index;
					this.beforeIndex = this.activeIndex;

					if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
						this._translate( newX, newY, duration);
						this._translateScrollbarWithPageIndex( index, scrollbarDuration);
					} else {
						this._endScroll();
					}
				},

				getActiveSectionIndex: function() {
					return this.activeIndex;
				},

				_start: function( e ) {
					this._super( e );

					this.beforeIndex = this.activeIndex;
				},

				_move: function(e) {
					var changeThreshold = this.options.changeThreshold,
						delta = this.orientation === Scroller.Orientation.HORIZONTAL ? e.detail.deltaX : e.detail.deltaY,
						oldActiveIndex = this.activeIndex;

					this._super( e );

					if ( !this.scrolled ) {
						return;
					}

					if ( delta > changeThreshold ) {
						this.activeIndex = this._calculateIndex(this.beforeIndex - 1);
					} else if ( delta < -changeThreshold ) {
						this.activeIndex = this._calculateIndex(this.beforeIndex + 1);
					} else {
						this.activeIndex = this.beforeIndex;
					}

// notify changed section.
					if ( this.activeIndex !== oldActiveIndex ) {
						this._notifyChanagedSection( this.activeIndex );
					}
				},

				_end: function(/* e */) {
					if ( this.scrollCanceled || !this.dragging ) {
						return;
					}

// bouncing effect
					if ( this.bouncingEffect ) {
						this.bouncingEffect.dragEnd();
					}

					this.setActiveSection( this.activeIndex, this.options.animateDuration );
					this.dragging = false;
				},

				_swipe: function( e ) {
					var offset = e.detail.direction === Gesture.Direction.UP || e.detail.direction === Gesture.Direction.LEFT ? 1 : -1,
						newIndex = this._calculateIndex(this.beforeIndex + offset);

					if ( this.scrollCanceled || !this.dragging) {
						return;
					}

// bouncing effect
					if ( this.bouncingEffect ) {
						this.bouncingEffect.dragEnd();
					}

					if ( this.activeIndex !== newIndex ) {
						this.activeIndex = newIndex;
						this._notifyChanagedSection( newIndex );
					}

					this.setActiveSection( newIndex, this.options.animateDuration );
					this.dragging = false;
				},

				_endScroll: function() {
					if ( !this.scrolled || this.scrollCanceled ) {
						return;
					}

					this._repositionSections();
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

				_calculateIndex: function( newIndex ) {
					var sectionLength = this.sections.length;

					if (this.options.circular) {
						newIndex = (sectionLength + newIndex) % sectionLength;
					} else {
						newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
					}

					return newIndex;
				},

				_clear: function() {
					this._clearTabIndicator();
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
