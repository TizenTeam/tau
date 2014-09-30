/*global window, define, Event, console, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Scroller Widget
 * Widget creates scroller on content.
 * @class ns.widget.wearable.scroller.Scroller
 * @since 2.3
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../../core/engine",
			"../../../../../core/util/object",
			"../../../../../core/event",
			"../../../../../core/event/gesture",
			"./effect/Bouncing",
			"../scroller"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var BaseWidget = ns.widget.BaseWidget,
				Gesture = ns.event.gesture,
				engine = ns.engine,
				utilsObject = ns.util.object,
				utilsEvents = ns.event,
				eventTrigger = utilsEvents.trigger,
				prototype = new BaseWidget(),
				EffectBouncing = ns.widget.wearable.scroller.effect.Bouncing,
				eventType = {
					/**
					 * event trigger when scroller start
					 * @event scrollstart
					 */
					START: "scrollstart",
					/**
					 * event trigger when scroller move
					 * @event scrollmove
					 */
					MOVE: "scrollmove",
					/**
					 * event trigger when scroller end
					 * @event scrollend
					 */
					END: "scrollend",
					/**
					 * event trigger when scroll is cancel
					 * @event scrollcancel
					 */
					CANCEL: "scrollcancel"
				},

				/*
				 * this option is related operation of scroll bar.
				 * the value is true, scroll bar is shown during touching screen even if content doesn't scroll.
				 * the value is false, scroll bar disappear when there is no movement of the scroll bar.
				 */
				_keepShowingScrollbarOnTouch = false,

				Scroller = function () {
				};

			Scroller.Orientation = {
				VERTICAL: "vertical",
				HORIZONTAL: "horizontal"
			};

			prototype._build = function (element) {
				if (element.children.length !== 1) {
					throw "scroller has only one child.";
				}

				this.scroller = element.children[0];
				this.scrollerStyle = this.scroller.style;

				this.bouncingEffect = null;
				this.scrollbar = null;

				this.width = 0;
				this.height = 0;

				this.scrollerWidth = 0;
				this.scrollerHeight = 0;
				this.scrollerOffsetX = 0;
				this.scrollerOffsetY = 0;

				this.maxScrollX = 0;
				this.maxScrollY = 0;

				this.startScrollerOffsetX = 0;
				this.startScrollerOffsetY = 0;

				this.orientation = null;

				this.enabled = true;
				this.scrolled = false;
				this.dragging = false;
				this.scrollCanceled = false;

				return element;
			};

			prototype._configure = function () {
				/**
				 * @property {Object} options Options for widget
				 * @property {number} [options.scrollDelay=0]
				 * @property {number} [options.threshold=10]
				 * @property {""|"bar"|"tab"} [options.scrollbar=""]
				 * @property {boolean} [options.useBouncingEffect=false]
				 * @property {"vertical"|"horizontal"} [options.orientation="vertical"]
				 * @member ns.widget.wearable.Scroller
				 */
				this.options = utilsObject.merge({}, this.options, {
					scrollDelay: 0,
					threshold: 10,
					scrollbar: "",
					useBouncingEffect: false,
					orientation: "vertical"	// vertical or horizontal,
				});
			};

			prototype._init = function () {
				this.width = this.element.offsetWidth;
				this.height = this.element.offsetHeight;

				this.scrollerWidth = this.scroller.offsetWidth;
				this.scrollerHeight = this.scroller.offsetHeight;

				this.maxScrollX = this.width - this.scrollerWidth;
				this.maxScrollY = this.height - this.scrollerHeight;

				this.orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL;

				this.scrolled = false;
				this.touching = true;
				this.scrollCanceled = false;

				if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
					this.maxScrollY = 0;
				} else {
					this.maxScrollX = 0;
				}

				this._initLayout();
				this._initScrollbar();
				this._initBouncingEffect();
			};

			prototype._initLayout = function () {
				var elementStyle = this.element.style,
					scrollerStyle = this.scroller.style;

				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";

				scrollerStyle.position = "absolute";
				scrollerStyle.top = "0px";
				scrollerStyle.left = "0px";
				scrollerStyle.width = this.scrollerWidth + "px";
				scrollerStyle.height = this.scrollerHeight + "px";
			};

			prototype._initScrollbar = function () {
				var type = this.options.scrollbar,
					scrollbarType;

				if ( type ) {
					scrollbarType = ns.widget.wearable.scroller.scrollbar.type[type];
					if ( scrollbarType ) {
						this.scrollbar = engine.instanceWidget(this.element, "ScrollBar", {
							type: scrollbarType,
							orientation: this.orientation
						});
					}
				}
			};

			prototype._initBouncingEffect = function () {
				var o = this.options;
				if ( o.useBouncingEffect ) {
					this.bouncingEffect = new EffectBouncing(this.element, {
						maxScrollX: this.maxScrollX,
						maxScrollY: this.maxScrollY,
						orientation: this.orientation
					});
				}
			};

			prototype._resetLayout = function () {
				var elementStyle = this.element.style,
					scrollerStyle = this.scrollerStyle;

				elementStyle.overflow = "";
				elementStyle.position = "";

				elementStyle.overflow = "hidden";
				elementStyle.position = "relative";

				if (scrollerStyle) {
					scrollerStyle.position = "";
					scrollerStyle.top = "";
					scrollerStyle.left = "";
					scrollerStyle.width = "";
					scrollerStyle.height = "";

					scrollerStyle["-webkit-transform"] = "";
					scrollerStyle["-webkit-transition"] = "";
				}
			};

			prototype._bindEvents = function () {
				ns.event.enableGesture(
					this.scroller,

					new ns.event.gesture.Drag({
						threshold: this.options.threshold,
						delay: this.options.scrollDelay,
						blockVertical: this.orientation === Scroller.Orientation.HORIZONTAL,
						blockHorizontal: this.orientation === Scroller.Orientation.VERTICAL
					})
				);

				utilsEvents.on( this.scroller, "drag dragstart dragend dragcancel", this );
				window.addEventListener("resize", this);
			};

			prototype._unbindEvents = function () {
				if (this.scroller) {
					ns.event.disableGesture( this.scroller );
					utilsEvents.off( this.scroller, "drag dragstart dragend dragcancel", this );
					window.removeEventListener("resize", this);
				}
			};

			/* jshint -W086 */
			prototype.handleEvent = function (event) {
				switch (event.type) {
					case "dragstart":
						this._start( event );
						break;
					case "drag":
						this._move( event );
						break;
					case "dragend":
						this._end( event );
						break;
					case "dragcancel":
						this.cancel( event );
						break;
					case "resize":
						this.refresh();
						break;
				}
			};

			/**
			 * Set options for widget.
			 * @method setOptions
			 * @param {Object} options
			 * @member ns.widget.wearable.scroller.Scroller
			 */
			prototype.setOptions = function (options) {
				var name;
				for ( name in options ) {
					if ( options.hasOwnProperty(name) && !!options[name] ) {
						this.options[name] = options[name];
					}
				}
			};

			prototype._refresh = function () {
				this._clear();
				this._unbindEvents();
				this._init();
				this._bindEvents();
			};

			/**
			 * Scrolls to new position.
			 * @method scrollTo
			 * @param x
			 * @param y
			 * @param duration
			 * @member ns.widget.wearable.scroller.Scroller
			 */
			prototype.scrollTo = function (x, y, duration) {
				this._translate(x, y, duration);
				this._translateScrollbar(x, y, duration);
			};

			prototype._translate = function (x, y, duration) {
				var translate,
					transition,
					scrollerStyle = this.scrollerStyle;

				if ( !duration ) {
					transition = "none";
				} else {
					transition = "-webkit-transform " + duration / 1000 + "s ease-out";
				}
				translate = "translate3d(" + x + "px," + y + "px, 0)";

				scrollerStyle["-webkit-transform"] = translate;
				scrollerStyle["-webkit-transition"] = transition;

				this.scrollerOffsetX = window.parseInt(x, 10);
				this.scrollerOffsetY = window.parseInt(y, 10);
			};

			prototype._translateScrollbar = function (x, y, duration, autoHidden) {
				if (!this.scrollbar) {
					return;
				}

				this.scrollbar.translate(this.orientation === Scroller.Orientation.HORIZONTAL ? -x : -y, duration, autoHidden);
			};

			prototype._start = function(/* e */) {
				this.scrolled = false;
				this.dragging = true;
				this.scrollCanceled = false;
				this.startScrollerOffsetX = this.scrollerOffsetX;
				this.startScrollerOffsetY = this.scrollerOffsetY;
			};

			prototype._move = function (e, pos) {
				var newX = this.startScrollerOffsetX,
					newY = this.startScrollerOffsetY,
					autoHide = !_keepShowingScrollbarOnTouch;

				if ( !this.enabled || this.scrollCanceled || !this.dragging ) {
					return;
				}

				if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
					newX += e.detail.estimatedDeltaX;
				} else {
					newY += e.detail.estimatedDeltaY;
				}

				if ( newX > 0 || newX < this.maxScrollX ) {
					newX = newX > 0 ? 0 : this.maxScrollX;
				}
				if ( newY > 0 || newY < this.maxScrollY ) {
					newY = newY > 0 ? 0 : this.maxScrollY;
				}

				if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
					if ( !this.scrolled ) {
						this._fireEvent( eventType.START );
					}
					this.scrolled = true;

					this._translate( newX, newY );
					this._translateScrollbar( newX, newY, 0, autoHide );
					// TODO to dispatch move event is too expansive. it is better to use callback.
					this._fireEvent( eventType.MOVE );

					if ( this.bouncingEffect ) {
						this.bouncingEffect.hide();
					}
				} else {
					if ( this.bouncingEffect ) {
						this.bouncingEffect.drag( newX, newY );
					}
					this._translateScrollbar( newX, newY, 0, autoHide );
				}
			};

			prototype._end = function (/* e */) {
				if ( !this.dragging ) {
					return;
				}

				// bouncing effect
				if ( this.bouncingEffect ) {
					this.bouncingEffect.dragEnd();
				}

				if ( this.scrollbar ) {
					this.scrollbar.end();
				}

				this._endScroll();
				this.dragging = false;
			};

			prototype._endScroll = function () {
				if (this.scrolled) {
					this._fireEvent(eventType.END);
				}

				this.scrolled = false;
			};

			/**
			 * Cancels scroll.
			 * @method cancel
			 * @member ns.widget.wearable.scroller.Scroller
			 */
			prototype.cancel = function () {
				this.scrollCanceled = true;

				if ( this.scrolled ) {
					this._translate( this.startScrollerOffsetX, this.startScrollerOffsetY );
					this._translateScrollbar( this.startScrollerOffsetX, this.startScrollerOffsetY );
					this._fireEvent( eventType.CANCEL );
				}

				if ( this.scrollbar ) {
					this.scrollbar.end();
				}

				this.scrolled = false;
				this.dragging = false;
			};

			prototype._fireEvent = function (eventName, detail) {
				eventTrigger( this.element, eventName, detail );
			};

			prototype._clear = function () {
				this.scrolled = false;
				this.scrollCanceled = false;

				this._resetLayout();
				this._clearScrollbar();
				this._clearBouncingEffect();
			};

			prototype._clearScrollbar = function () {
				if ( this.scrollbar ) {
					this.scrollbar.destroy();
				}
				this.scrollbar = null;
			};

			prototype._clearBouncingEffect = function () {
				if (this.bouncingEffect) {
					this.bouncingEffect.destroy();
				}
				this.bouncingEffect = null;
			};

			prototype._disable = function () {
				this.enabled = false;
			};

			prototype._enable = function () {
				this.enabled = true;
			};

			prototype._destroy = function () {
				this._clear();
				this._unbindEvents();
				this.scrollerStyle = null;
				this.scroller = null;
			};

			Scroller.prototype = prototype;

			ns.widget.wearable.scroller.Scroller = Scroller;

			engine.defineWidget(
				"Scroller",
				".scroller",
				["scrollTo", "cancel"],
				Scroller
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
