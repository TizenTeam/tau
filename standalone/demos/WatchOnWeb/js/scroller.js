// Make scroller custom events
var scrollerStart =  new CustomEvent(
	// scroller.start event trigger when user try to move scroller
	"scroller.start",
	{
		lastX: 0,
		bubbles: true,
		cancelable: true
	}
), scrollerMove =  new CustomEvent(
	// scroller.move event trigger when scroller move
	"scroller.move",
	{
		lastX: 0,
		bubbles: true,
		cancelable: true
	}
), scrollerEnd =  new CustomEvent(
	// scroller.end event trigger when scroller end
	"scroller.end",
	{
		lastX: 0,
		bubbles: true,
		cancelable: true
	}
), flick =  new CustomEvent(
	// scroller.end event trigger when scroller end
	"scroller.flick",
	{
		lastX: 0,
		interval: 0,
		bubbles: true,
		cancelable: true
	}
)
;

function Scroller( elem ) {
	this.options = {
		autoFitting: "true",
		circularElement: "true",
		threshold: 50,
		flickThreshold: 28
	}
	this.init( elem );
	return this;
}

var     G_oldTouchX,
G_oldTimeStamp,
G_lastX,
G_lastVelocity;

Scroller.prototype = {
	init: function( elem ) {
		var page;

		if( !elem ) {
			// If developer don't give parameter, this object set default section
			page = document.getElementsByClassName("ui-page-active");
			this._scroller = page[0].getElementsByClassName("scroller","div")[0];
		} else {
			this._scroller = elem;
		}

		if ( !this._scroller ){
			return;
		}
		this._width = screen.width;
		this._height = screen.height;
		this._lastX = 0;

		this.options.autoFitting = this._scroller.getAttribute("data-auto-fitting");
		this.options.circularElement = this._scroller.getAttribute("data-circular-element");

		this._scroller.style.height = this._scroller.parentElement.clientHeight + "px";

		this._scrollerDirection = "horizontal"; // default scroller direction is horizontal
		this._addEvent();
	},

	setDirection: function( direction ) {
		// Scroller has forth status.
		// 1) 0 or 'undefined' : page don't need to scroller
		// 2) 'horizontal' : page only need to horizontal scroller
		// 3) 'vertical' : page only need to vertical scroller
		// 4) 'all' : page only need to all direction scroller

		if ( !direction || direction === undefined ) {
			this._scrollerDirection = 0;
		}

		this._scrollerDirection = direction;
	},

	setWidth: function( value ) {
		this._scroller.style.width = value;
		this._lsw = parseInt( value ) - this._width;
	},

	setHeight: function( value ) {
		this._scroller.style.height = value;
	},

	getWidth: function() {
		return this._scroller.style.width;
	},

	getHeight: function() {
		return this._scroller.style.height;
	},

	getLastXPosition: function() {
		return this._lastX;
	},

	getElement: function() {
		return this._scroller;
	},

	scrollTo: function( x, y, duration ) {
		//This method try to move scroller
		this._setElementTransform( x, y, duration );
	},

	_setElementTransform: function( x, y, duration ) {

		var translate,
			transition,
			scrollerStyle = this._scroller.style;

		if ( !this._dragging ){
			this._lastX = x;
		}

		if ( !duration || duration === undefined ) {
			transition = "none";
		} else {
			transition = "-webkit-transform " + duration / 1000 + "s ease-out";
		}
		translate = "translate3d(" + x + "px," + y + "px, 0)";

		scrollerStyle["-webkit-transform"] = translate;
		scrollerStyle["-webkit-transition"] = transition;
	},

	getEstimatedCurrentPoint: function( currentX, currentTimeStamp) {
		var velocity,
			estimatedX = G_lastX,
			date = new Date(),
			currentTime = date.getTime();
		//item1 : currentX, item2: oldX
		//var timeDifference = currentTime - currentTimeStamp;
		var timeDifference = 10;

		if ( timeDifference < 50 /*pause time threshold */) {
			velocity = (currentX - G_oldTouchX ) / 22; /*( currentTimeStamp - G_oldTimeStamp )*//*46.8 s_moveEventPerSecond*/
			var x = currentX + (timeDifference + (-5) /*s_extraPredictionTime*/) * velocity;

			// Prevent that point goes back even though direction of velocity is not changed.
			if ((G_lastVelocity  * velocity >= 0)
					&& (!velocity || (velocity < 0 && x > G_lastX) || (velocity > 0 && x < G_lastX)))
				x = G_lastX;

			estimatedX = x;
		}
		G_lastVelocity = velocity;

		return estimatedX;
	},
	_addEvent: function( ) {
		var self = this,
		startTime,
		endTime;
		self._ex = 0;
		self._ey = 0;
		self._sy = 0;

		self._scroller.addEventListener( "touchstart", function( e ) {
			var touches = e.touches;
			startTime = new Date();
			// set oldTouchX to -1 if it starts touch.
			G_oldTouchX = -1;
			self.lastVelocity = 0;
			self.lastX = e.touches[0].pageX;

			if ( !self._scrollerDirection || self._scrollerDirection === "vertical" ) {
				// don't need to scroller
				return;
			}
			self._ex = touches[0].pageX;
			self._ey = touches[0].pageY;
			self._sx = self._lastX;
			self._dragging = true;
			scrollerStart.lastX = self._ex;
			self._scroller.dispatchEvent( scrollerStart );
		});

		self._scroller.addEventListener( "touchmove", function( e ) {
			var touches = e.touches;
			self._hInterval = touches[0].pageX - self._ex; // horizontal move interval
			self._vInterval = touches[0].pageY - self._ey; // vertical move interval

			var estimatedX = touches[0].pageX;
			if ( G_oldTouchX != -1 )
					estimatedX= self.getEstimatedCurrentPoint( touches[0].pageX, e.timeStamp );
				
			self._hInterval =  estimatedX - self._ex;
			G_oldTimeStamp = e.timeStamp;
			G_oldTouchX = touches[0].pageX;
			G_lastX = estimatedX;


			if ( self._dragging ) {
				switch( self._scrollerDirection ) {
				case !self._scrollerDirection || "vertical":
					return;
				case "horizontal":
					if ( 2 * Math.abs( self._vInterval ) > Math.abs( self._hInterval ) ) {
						// invalid degree
						self._sx = self._lastX;
						e.preventDefault();
						return;
					}
					break;
				case "all":
					// This condition need to threshold
					if ( Math.abs( self._hInterval ) < self.options.threshold ) {
						self._sx = self._lastX;
						return;
					}
				}
				//valid degree and over horizontal threshold
				self._sx = self._lastX + self._hInterval;
				if ( self._sx > 0 ) {
					// left side
					self._sx = 0;
				} else if ( self._sx < -self._lsw ) {
					self._sx = -self._lsw;
				}
				self._setElementTransform( self._sx, 0 );
				scrollerMove.lastX = self._sx;
				self._scroller.dispatchEvent( scrollerMove );
				e.preventDefault(); //this function make overflow scroll don't used
			}
		});

		self._scroller.addEventListener( "touchend", function( e ) {
			endTime = new Date();
			if ( !self._scrollerDirection || self._scrollerDirection === "vertical" ) {
				// don't need to scroller
				return;
			}
			self._dragging = false;
			self._ex = 0;
			self._lastX = self._sx;
			if ( ( endTime - startTime ) <= 500 && Math.abs(self._hInterval) > self.options.flickThreshold && self._sx > -self._lsw && self._sx < 0) {
				//flick
				flick.interval = self._hInterval;
				flick.lastX = self._lastX;
				self._scroller.dispatchEvent( flick );
			} else {
				scrollerEnd.lastX = self._lastX;
				self._scroller.dispatchEvent( scrollerEnd );
			}
		});
	}
}
