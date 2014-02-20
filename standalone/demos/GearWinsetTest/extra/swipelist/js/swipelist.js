(function(window, undefined) {
	'use strict';

var eventType = {
		//swipelist provide two event 
		CALL: "swipelist.call",
		MESSAGE: "swipelist.message"
};

var SwipeList = function ( listElement, callElement, messageElement, options ){
	this._create( listElement, callElement, messageElement, options );
	return this;
}

SwipeList.prototype = {
	_create: function( listElement, callElement, messageElement, options ) {
		this.listElement = listElement;
		this.callElement = callElement;
		this.messageElement = messageElement;

		this.options = {};

		this.startX = 0;
		this.dragging = 0;

		this._callElementStyle = this.callElement.style;
		this._messageElementStyle = this.messageElement.style;


		this._initOptions( options );
		this._bindEvents();
		this._init();
	},

	_init: function() {
		var page;
		if( !this.listElement || !this.callElement || !this.messageElement ) {
			// If developer don't give parameter, this object set default section
			page = document.getElementsByClassName("ui-page-active");
			this.listElement = page[0].getElementsByClassName("genlist","ul")[0];
			this.callElement = page[0].getElementsByClassName("genlist-call","div")[0];
			this.messageElement = page[0].getElementsByClassName("genlist-message","div")[0];
			this._create( listElement, callElement, messageElement );
		}

		this._callElementStyle["background-position-x"] = "-400px";
		this._messageElementStyle["background-position-x"] = "-80px";
		this._callElementBPX = this._callElementStyle["background-position-x"];
		this._messageElementBPX = this._messageElementStyle["background-position-x"];
	},

	_initOptions: function( options ){
		this.options = {
			threshold: 50
		}
		this.setOptions( options );
	},
	setOptions: function (options) {
		var name;
		for ( name in options ) {
			if ( options.hasOwnProperty(name) && !!options[name] ) {
				this.options[name] = options[name];
			}
		}
	},

	_bindEvents: function( ) {
		if ('ontouchstart' in window) {
			this.listElement.addEventListener( "touchstart", this);
			this.listElement.addEventListener( "touchmove", this);
			this.listElement.addEventListener( "touchend", this);
		} else {
			this.listElement.addEventListener( "mousedown", this);
			document.addEventListener( "mousemove", this);
			document.addEventListener( "mouseup", this);
		}

		window.addEventListener( "resize", this);
	},

	_unbindEvents: function() {
		if ('ontouchstart' in window) {
			this.listElement.removeEventListener( "touchstart", this);
			this.listElement.removeEventListener( "touchmove", this);
			this.listElement.removeEventListener( "touchend", this);
		} else {
			this.listElement.removeEventListener( "mousedown", this);
			document.removeEventListener( "mousemove", this);
			document.removeEventListener( "mouseup", this);
		}

		window.removeEventListener( "resize", this);
	},

	handleEvent: function( event ) {
		var pos = this._getPointPositionFromEvent( event );

		switch (event.type) {
		case "mousedown":
		case "touchstart":
			this._start( event, pos );
			break;
		case "mousemove":
		case "touchmove":
			this._move( event, pos );
			break;
		case "mouseup":
		case "touchend":
			this._end( event, pos );
			break;
		case "scroll":
			this._end( event, pos );
		}
	},

	_getPointPositionFromEvent: function ( ev ) {
		return ev.type.search(/^touch/) !== -1 && ev.touches && ev.touches.length ?
				{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
				{x: ev.clientX, y: ev.clientY};
	},

	_fireEvent: function( eventName, detail ) {
		var evt = new CustomEvent( eventName, {
				"bubbles": true,
				"cancelable": true,
				"detail": detail
			});
		this.listElement.dispatchEvent(evt);
	},

	_detectLiTarget: function( target ) {
		while (target && target.tagName !== 'LI') {
			target = target.parentNode;
		}
		return target;
	},

	_setMovingElementTop: function( element, lastScrollTop, lastElementTop ){
		var diff = lastScrollTop - this.callElement.parentNode.scrollTop;
		element.style.top = parseInt( lastElementTop,10 ) + diff + "px";
	},

	_start: function( e, pos ) {

		if ( this._detectLiTarget( e.target ) ) {
			this.startX = pos.x;
			this.dragging = true;
		}
	},

	_move: function( e, pos ) {

		var target = this._detectLiTarget(e.target),
		sx = pos.x - this.startX,
		top;

		if( this.dragging && target ) {
			top = target.offsetTop - this.callElement.parentNode.scrollTop + "px";
			if ( sx > this.options.threshold ) {
				// appear call scroller
				this._callElementStyle["top"] = top;
				this._callElementStyle["display"] = "block";
				this._callElementStyle["background-position-x"] = parseInt( this._callElementBPX, 10 ) + sx + "px";

				e.preventDefault();
			} else if ( sx < -this.options.threshold ) {
				this._messageElementStyle["top"] = top;
				this._messageElementStyle["display"] = "block";
				this._messageElementStyle["background-position-x"] = parseInt( this._messageElementBPX, 10 ) + sx + "px";

				e.preventDefault();
			}
		}
	},

	_end: function( e ) {
		var interval,
		lastScrollTop = this.callElement.parentNode.scrollTop,
		lastElementTop,
		self = this;

		if( parseInt( self._callElementStyle["background-position-x"], 10 ) > -250 ) {
			// animate call background x position
			var i = parseInt( self._callElementStyle["background-position-x"], 10 );
			lastElementTop = this.callElement.style.top;
			(function animate(){
				if ( i < 0 ){
					self._setMovingElementTop( self.callElement, lastScrollTop, lastElementTop );
					self._callElementStyle["background-position-x"] = i + "px";
					i+=20;
					webkitRequestAnimationFrame( animate );
				} else {
					self._callElementStyle["background-position-x"] = "-400px";
					self._callElementStyle[ "display" ] = "none";
					// fired custom event
					self._fireEvent( eventType.CALL );
				}
			})();

		} else if( parseInt( self._messageElementStyle["background-position-x"] ) < -250 ) {
			// animate message background x position
			var i = parseInt( self._messageElementStyle["background-position-x"], 10 );
			lastElementTop = this.messageElement.style.top;
			(function animate(){
				if ( i > -400 ){
					self._setMovingElementTop( self.messageElement, lastScrollTop, lastElementTop );
					self._messageElementStyle["background-position-x"] = i + "px";
					i-=20;
					webkitRequestAnimationFrame( animate );
				} else {
					self._messageElementStyle["background-position-x"] = "-80px";
					self._messageElementStyle[ "display" ] = "none";
					// fired custom event
					self._fireEvent( eventType.MESSAGE );
				}
			})();
		} else {
			this.callElement.style.display = "none";
			this.messageElement.style.display = "none";
		}

		this.dragging = false;
	}
}

window.SwipeList = SwipeList;

})(this);
