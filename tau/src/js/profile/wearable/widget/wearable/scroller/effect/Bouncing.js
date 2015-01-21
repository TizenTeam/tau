/*global window, define, ns */
/* Copyright  2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/*jslint nomen: true, plusplus: true */
/**
 * # Bouncing effect
 * Bouncing effect for scroller widget.
 * @class ns.widget.wearable.scroller.effect.Bouncing
 * @since 2.3
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../effect"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			// scroller.start event trigger when user try to move scroller
			var utilsObject = ns.util.object,
				selectors = ns.util.selectors,
				Bouncing = function (scrollerElement, options) {
					var self = this;
					self._orientation = null;
					self._maxValue = null;

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;

					self.options = utilsObject.merge({}, Bouncing.defaults, {scrollEndEffectArea: ns.getConfig("scrollEndEffectArea", Bouncing.defaults.scrollEndEffectArea)});
				/**
				 * target element for bouncing effect
				 * @property {HTMLElement} targetElement
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
					self._targetElement = null;

					self._isShow = false;
					self._isDrag = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;

					self._create(scrollerElement, options);
				},
				endEffectAreaType = {
					content: "content",
					screen: "screen"
				},
				defaults = {
					duration: 500,
					scrollEndEffectArea : "content"
				},
				classes = {
					bouncingEffect: "ui-scrollbar-bouncing-effect",
					page: "ui-page",
					left: "ui-left",
					right: "ui-right",
					top: "ui-top",
					bottom: "ui-bottom",
					hide: "ui-hide",
					show: "ui-show"
				};

			Bouncing.defaults = defaults;

			Bouncing.prototype = {
				_create: function (scrollerElement, options) {
					var self = this;
					if( self.options.scrollEndEffectArea === endEffectAreaType.content ){
						self._container = scrollerElement;
					} else {
						self._container = selectors.getClosestByClass(scrollerElement, classes.page);
					}

					self._orientation = options.orientation;
					self._maxValue = self._getValue( options.maxScrollX, options.maxScrollY );

					self._initLayout();
				},

				_initLayout: function() {
					var self = this,
						minElement = self._minEffectElement = document.createElement("DIV"),
						maxElement = self._maxEffectElement = document.createElement("DIV"),
						className = classes.bouncingEffect;

					if ( self._orientation === ns.widget.wearable.scroller.Scroller.Orientation.HORIZONTAL ) {
						minElement.className = className + " " + classes.left;
						maxElement.className = className + " " + classes.right;
					} else {
						minElement.className = className + " " + classes.top;
						maxElement.className = className + " " + classes.bottom;
					}

					self._container.appendChild( minElement );
					self._container.appendChild( maxElement );

					minElement.addEventListener("webkitAnimationEnd", this);
					maxElement.addEventListener("webkitAnimationEnd", this);
				},

				/**
				 * ...
				 * @method drag
				 * @param x
				 * @param y
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				drag: function( x, y ) {
					this._isDrag = true;
					this._checkAndShow( x, y );
				},

				/**
				 * ...
				 * @method dragEnd
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				dragEnd: function() {
					var self = this;
					if ( self._isShow && !self._isShowAnimating && !self._isHideAnimating ) {
						self._beginHide();
					}

					self._isDrag = false;
				},

				/**
				 * Shows effect.
				 * @method show
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				show: function() {
					var self = this;
					if ( self._targetElement ) {
						self._isShow = true;
						self._beginShow();
					}
				},

				/**
				 * Hides effect.
				 * @method hide
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				hide: function() {
					var self = this;
					if ( self._isShow ) {
						self._minEffectElement.style.display = "none";
						self._maxEffectElement.style.display = "none";
						self._targetElement.classList.remove(classes.hide);
						self._targetElement.classList.remove(classes.show);
					}
					self._isShow = false;
					self._isShowAnimating = false;
					self._isHideAnimating = false;
					self._targetElement = null;
				},

				_checkAndShow: function( x, y ) {
					var self = this,
						val = self._getValue(x, y);
					if ( !self._isShow ) {
						if ( val >= 0 ) {
							self._targetElement = self._minEffectElement;
							self.show();
						} else if ( val <= self._maxValue ) {
							self._targetElement = self._maxEffectElement;
							self.show();
						}

					} else if ( self._isShow && !self._isDrag && !self._isShowAnimating && !self._isHideAnimating ) {
						self._beginHide();
					}
				},

				_getValue: function(x, y) {
					return this._orientation === ns.widget.wearable.scroller.Scroller.Orientation.HORIZONTAL ? x : y;
				},

				_beginShow: function() {
					var self = this;
					if ( !self._targetElement || self._isShowAnimating ) {
						return;
					}

					self._targetElement.style.display = "block";

					self._targetElement.classList.remove(classes.hide);
					self._targetElement.classList.add(classes.show);

					self._isShowAnimating = true;
					self._isHideAnimating = false;
				},

				_finishShow: function() {
					var self = this;
					self._isShowAnimating = false;
					if ( !self._isDrag ) {
						self._targetElement.classList.remove(classes.show);
						self._beginHide();
					}
				},

				_beginHide: function() {
					var self = this;
					if ( self._isHideAnimating ) {
						return;
					}

					self._targetElement.classList.remove(classes.show);
					self._targetElement.classList.add(classes.hide);

					self._isHideAnimating = true;
					self._isShowAnimating = false;
				},

				_finishHide: function() {
					var self = this;
					self._isHideAnimating = false;
					self._targetElement.classList.remove(classes.hide);
					self.hide();
					self._checkAndShow();
				},

				/**
				 * Supports events.
				 * @method handleEvent
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				handleEvent: function( event ) {
					var self = this;
					if (event.type === "webkitAnimationEnd") {
						if ( self._isShowAnimating ) {
							self._finishShow();
						} else if ( self._isHideAnimating ) {
							self._finishHide();
						}
					}
				},

				/**
				 * Destroys effect.
				 * @method destroy
				 * @member ns.widget.wearable.scroller.effect.Bouncing
				 */
				destroy: function() {
					var self = this;
					self._minEffectElement.removeEventListener("webkitAnimationEnd", self);
					self._maxEffectElement.removeEventListener("webkitAnimationEnd", self);

					self._container.removeChild( self._minEffectElement );
					self._container.removeChild( self._maxEffectElement );

					self._container = null;
					self._minEffectElement = null;
					self._maxEffectElement = null;
					self._targetElement = null;

					self._isShow = null;
					self._orientation = null;
					self._maxValue = null;
				}
			};

			ns.widget.wearable.scroller.effect.Bouncing = Bouncing;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
