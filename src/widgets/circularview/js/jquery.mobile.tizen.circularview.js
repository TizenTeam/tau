// most of following codes are derived from jquery.mobile.scrollview.js
(function($,window,document,undefined) {

jQuery.widget( "mobile.circularview", jQuery.mobile.widget, {
	options: {
		fps:				60,
		
		scrollDuration:		2000,

		moveThreshold:		10,
		moveIntervalThreshold:	150,

		startEventName:		"scrollstart",
		updateEventName:	"scrollupdate",
		stopEventName:		"scrollstop",

		eventType:			$.support.touch	? "touch" : "mouse",

		delayedClickSelector: "a, .ui-btn",
		delayedClickEnabled: false 
	},
 
	_makePositioned: function($ele) {
		if ( $ele.css( 'position' ) == 'static' ) 
			$ele.css( 'position', 'relative' );

	},

	_create: function() {
		this._$clip = $(this.element).addClass("ui-scrollview-clip");
		var $child = this._$clip.children();
//		if ( $child.length > 1 ) {
			$child = this._$clip.wrapInner("<div></div>").children();
//		}
		this._$view = $child.addClass("ui-scrollview-view");
		this._$list = $child.children();

		this._$clip.css( "overflow", "hidden" );
		this._makePositioned( this._$clip );

		this._$view.css( "overflow", "hidden" );
		this._tracker = new MomentumTracker( this.options );

		this._timerInterval = 1000/ this.options.fps;
		this._timerID = 0;

		var self = this;
		this._timerCB = function() { self._handleMomentumScroll(); };
        
        this.refresh();

		this._addBehaviors();
	},

    refresh: function() {
 		this._viewWidth = this._$view.width();
		this._clipWidth = window.innerWidth;
		this._itemWidth = this._$list.children().first().outerWidth();
		this._$items = this._$list.children().detach();
		var itemsPerView = this._clipWidth / this._itemWidth;
		itemsPerView = Math.ceil( itemsPerView * 10 ) / 10;
		this._itemsPerView = parseInt( itemsPerView );

		this._rx = -this._itemWidth;
		this._sx = -this._itemWidth;
		this._setItems();
    },

	_startMScroll: function( speedX, speedY ) {
		this._stopMScroll();
		
		var keepGoing = false;
		var duration = this.options.scrollDuration;

		this._$clip.trigger(this.options.startEventName);

		var t = this._tracker;
		var c = this._clipWidth;
		var v = this._viewWidth;
		t.start( this._rx, speedX, duration, (v > c ) ? -(v - c) : 0, 0 );
		keepGoing = !t.done();

		if ( keepGoing ) {
			this._timerID = setTimeout( this._timerCB, this._timerInterval );
		} else {
			this._stopMScroll();
		}
		//console.log("startmscroll" + this._rx + "," + this._sx );
	},

	_stopMScroll: function() {
		if ( this._timerID ) {
			this._$clip.trigger(this.options.stopEventName);
			clearTimeout(this._timerID);
		}

		this._timerID = 0;

		if ( this._tracker ) {
			this._tracker.reset();
		}
		//console.log("stopmscroll" + this._rx + "," + this._sx );
	},

	_handleMomentumScroll: function() {
		var keepGoing = false;
		var v = this._$view;

		var x = 0, y = 0;

		var t = this._tracker;
		if ( t ) {
			t.update();
			x = t.getPosition();

			keepGoing = !t.done();

		}

		this._setScrollPosition( x, y );
		this._rx = x;

		this._$clip.trigger( this.options.updateEventName, [ { x: x, y: y } ] );

		if ( keepGoing ) {
			this._timerID = setTimeout( this._timerCB, this._timerInterval );
		} else {
			this._stopMScroll();
		}
	},

	_setItems: function() {
		for ( var i = -1; i < this._itemsPerView + 1; i++ ) {
			var $item = this._$items[ circularNum( i, this._$items.length ) ];
			this._$list.append( $item );
		}
		setElementTransform( this._$view, this._sx + "px", 0 );
        this._$view.width( this._itemWidth * ( this._itemsPerView + 2 ) );
        this._viewWidth = this._$view.width();
	},
	
	_setScrollPosition: function( x, y ) {
		var sx = this._sx;
		var dx = x - sx;
		var di = parseInt( dx / this._itemWidth );
		if ( di > 0 ) {
			for ( var i = 0; i < di; i++ ) {
				this._$list.children().last().detach();
				var idx = -parseInt( ( sx / this._itemWidth ) + i + 3 );
				var $item = this._$items[ circularNum( idx, this._$items.length ) ];
				this._$list.prepend( $item );
				//console.log( "di > 0 : " + idx );
			}
		} else if ( di < 0   ) {
			for ( var i = 0; i > di; i-- ) {  
				this._$list.children().first().detach();
				var idx = this._itemsPerView - parseInt( ( sx / this._itemWidth ) + i );
				var $item = this._$items[ circularNum( idx, this._$items.length ) ];
				this._$list.append( $item );
				//console.log( "di < 0 : " + idx );
			}
		}
		


		this._sx += di * this._itemWidth;

		setElementTransform( this._$view, ( x - this._sx - this._itemWidth ) + "px", 0 );

		//console.log( "rx " + this._rx + "sx " + this._sx );
	},

	_enableTracking: function() {
		$(document).bind( this._dragMoveEvt, this._dragMoveCB );
		$(document).bind( this._dragStopEvt, this._dragStopCB );
	},

	_disableTracking: function() {
		$(document).unbind( this._dragMoveEvt, this._dragMoveCB );
		$(document).unbind( this._dragStopEvt, this._dragStopCB );
	},

	_getScrollHierarchy: function() {
		var svh = [];
		this._$clip.parents('.ui-scrollview-clip').each( function() {
			var d = $(this).jqmData('circulaview');
			if ( d ) svh.unshift(d);
		});
		return svh;
	},
    
    centerTo: function( selector ) {
        for ( var i = 0; i < this._$items.length; i++ ) {
            if ( $(this._$items[i]).is( selector ) ) {
               var newX = -( i * this._itemWidth - this._clipWidth / 2 + this._itemWidth * 2 );
               this.scrollTo( newX, 0 );
               console.log( i + "," + newX );
               return;
            }
        }
    },

	scrollTo: function(x, y, duration) {
		this._stopMScroll();
		if ( !duration ) {
			this._setScrollPosition( x, y );
            this._rx = x;
            return;
		}

		x = -x;
		y = -y;

		var self = this;
		var start = getCurrentTime();
		var efunc = $.easing["easeOutQuad"];
		var sx = this._rx;
		var sy = 0;
		var dx = x - sx;
		var dy = 0;
		var tfunc = function() {
			var elapsed = getCurrentTime() - start;
			if ( elapsed >= duration ) {
				self._timerID = 0;
				self._setScrollPosition( x, y );
			} else {
				var ec = efunc( elapsed / duration, elapsed, 0, 1, duration );
				self._setScrollPosition( sx + ( dx * ec ), sy + ( dy * ec ) );
				self._timerID = setTimeout( tfunc, self._timerInterval );
			}
		};

		this._timerID = setTimeout( tfunc, this._timerInterval );
	},

	getScrollPosition: function() {
		return { x: -this._rx, y: 0 };
	},

	_handleDragStart: function( e, ex, ey ) {
		$.each( this._getScrollHierarchy(), function( i, sv ) { 
			sv._stopMScroll(); } );
		this._stopMScroll();

		if ( this.options.delayedClickEnabled ) {
			this._$clickEle = $(e.target).closest(this.options.delayedClickSelector);
		}
		this._lastX = ex;
		this._lastY = ey;
		this._speedX = 0;
		this._speedY = 0;
		this._didDrag = false;
	
		this._lastMove = 0;
		this._enableTracking();		

		this._ox = ex;
		this._nx = this._rx;
		
		if ( this.options.eventType == "mouse" || this.options.delayedClickEnabled ) {
			e.preventDefault();
		}
		//console.log("scrollstart" + this._rx + "," + this._sx );
		e.stopPropagation();
	},

	_handleDragMove: function( e, ex, ey ) {
		this._lastMove = getCurrentTime();

		var dx = ex - this._lastX;
		var dy = ey - this._lastY;
		
		this._speedX = dx;
		this._speedY = 0;

		this._didDrag = true;

		this._lastX = ex;
		this._lastY = ey;

		this._mx = ex - this._ox;
		
		this._setScrollPosition( this._nx + this._mx, 0 );

		//console.log("scrollmove" + this._rx + "," + this._sx );
		return false;
	},

	_handleDragStop: function( e ) {
		var l = this._lastMove;
		var t = getCurrentTime();
		var doScroll = l && ( t - l ) <= this.options.moveIntervalThreshold;

		var sx = ( this._tracker && this._speedX && doScroll ) ? this._speedX : 0;
		var sy = 0;

		this._rx = this._mx ? this._nx + this._mx : this._rx;

		if ( sx ) {
			this._startMScroll( sx, sy );
		}

		//console.log("scrollstop" + this._rx + "," + this._sx );
		

		this._disableTracking();

		if ( !this._didDrag && this.options.delayedClickEnabled && this._$clickEle.length ) {
			this._$clickEle
				.trigger("mousedown")
				.trigger("mouseup")
				.trigger("click");
		}
        
        if ( this._didDrag ) {
            e.preventDefault();
            e.stopPropagation();
        }

		return this._didDrag ? false : undefined;
	},

	_addBehaviors: function() {
		var self = this;
		if ( this.options.eventType === "mouse" ) {
			this._dragStartEvt = "mousedown";
			this._dragStartCB = function(e) { 
				return self._handleDragStart( e, e.clientX, e.clientY ); 
			};
			
			this._dragMoveEvt = "mousemove";
			this._dragMoveCB = function(e) { 
				return self._handleDragMove( e, e.clientX, e.clientY );
			};

			this._dragStopEvt = "mouseup";
			this._dragStopCB = function(e) {
				return self._handleDragStop( e ); 
			};
            
            this._$view.bind( "vclick", function(e) {
                return !self._didDrag;
            });
            
		} else { //touch
			this._dragStartEvt = "touchstart";
			this._dragStartCB = function(e) {
				var t = e.originalEvent.targetTouches[0];
				return self._handleDragStart(e, t.pageX, t.pageY );
			};

			this._dragMoveEvt = "touchmove";
			this._dragMoveCB = function(e) {
				var t = e.originalEvent.targetTouches[0];
				return self._handleDragMove(e, t.pageX, t.pageY );
			};

			this._dragStopEvt = "touchend";
			this._dragStopCB = function(e) {
				return self._handleDragStop(e);
			};
		
        }
		this._$view.bind( this._dragStartEvt, this._dragStartCB );
	},

});

function circularNum( num, total ) {
		var n = num % total;
		if ( n < 0 ) {
			n = total + n;
		}		
		return n;
}

function setElementTransform( $ele, x, y ) {
	var v = "translate3d(" + x + "," + y + ", 0px)";
	$ele.css({
		"-moz-transform": v,
		"-webkit-transform": v,
		"transform": v
	});
}

function MomentumTracker(options) {
	this.options = $.extend( {}, options );
	this.easing = "easeOutQuad";
	this.reset();
}

var tstates = {
	scrolling : 0,
	done : 1
};

function getCurrentTime() { return (new Date()).getTime(); }

$.extend(MomentumTracker.prototype, {
	start: function( pos, speed, duration ) {
		this.state = (speed != 0) ? tstates.scrolling : tstates.done;
		this.pos = pos;
		this.speed = speed;
		this.duration = duration;
		
		this.fromPos = 0;
		this.toPos = 0;

		this.startTime = getCurrentTime();
	}, 
	
	reset: function() {
		this.state = tstates.done;
		this.pos = 0;
		this.speed = 0;
		this.duration = 0;	
	},

	update: function() {
		var state = this.state;
		if ( state == tstates.done ) {
			return this.pos;
		}

		var duration = this.duration;
		var elapsed = getCurrentTime() - this.startTime;
		elapsed = elapsed > duration ? duration : elapsed;

		var dx = this.speed * ( 1 - $.easing[this.easing](elapsed / duration, elapsed, 0, 1, duration ) );
		
		var x = this.pos + dx;
		this.pos = x;
		
		if ( elapsed >= duration ) {
			this.state = tstates.done;
		}
		
		return this.pos;
	}, 

	done: function() { 
		return this.state == tstates.done; 
	},

	getPosition: function() { 
		return this.pos;
	}
});


$( document ).bind( "pagecreate create", function( e ) {
	$( $.mobile.circularview.prototype.options.initSelector, e.target ).circularview();
});

})(jQuery,window,document); // End Component
