var calling =  new CustomEvent(
	// This custom event is called when user calling swipe
	"swipelist.call",
	{
		bubbles: true,
		cancelable: true
	}
), messaging =  new CustomEvent(
	// This custom event is called when user message swipe
	"swipelist.message",
	{
		bubbles: true,
		cancelable: true
	}
)

function SwipeList( liElem, callElem, messageElem ) {
	this.options = {
		threshold: 50
	}
	this.init( liElem, callElem, messageElem );
}

function detectLiTarget (target) {
	while (target && target.tagName !== 'LI') {
		target = target.parentNode;
	}
	return target;
}

SwipeList.prototype = {
	init: function( liElem, callElem, messageElem ) {
		var page;
		if( !liElem || !callElem || !messageElem ) {
			// If developer don't give parameter, this object set default section
			page = document.getElementsByClassName("ui-page-active");
			this._genlistUl = page[0].getElementsByClassName("genlist","ul")[0];
			this._genlistCall = page[0].getElementsByClassName("genlist-call","div")[0];
			this._genlistMessage = page[0].getElementsByClassName("genlist-message","div")[0];
		} else {
			this._genlistUl = liElem;
			this._genlistCall = callElem;
			this._genlistMessage = messageElem;
		}
		if ( !this._genlistUl || !this._genlistCall || !this._genlistMessage ) {
			return;
		}
		this._genlistCallStyle = this._genlistCall.style;
		this._genlistMessageStyle = this._genlistMessage.style;

		this._genlistLi = this._genlistUl.getElementsByTagName("li");
		this._genlistCallStyle["background-position-x"] = "-400px";
		this._genlistMessageStyle["background-position-x"] = "-20px";

		this._addEvent();
	},

	_addEvent: function() {
		var self = this,
		startX,
		dragging,
		callBPX = self._genlistCallStyle["background-position-x"],
		messageBPX = self._genlistMessageStyle["background-position-x"];

		document.addEventListener( "touchstart", function( e ) {
			var touches = e.touches;
			if (detectLiTarget(e.target)) {
				startX = touches[0].pageX;
				dragging = true;
			}
		});
		document.addEventListener( "touchmove", function( e ) {
			var touches = e.touches,
				target = detectLiTarget(e.target),
				sx = touches[0].pageX - startX,
				top;
			if( dragging && target) {
				top = target.offsetTop - self._genlistCall.parentNode.scrollTop + "px";
				if ( sx > self.options.threshold ){
					// appear call scroller
					var bpx = self._genlistCallStyle["background-position-x"];
					self._genlistCallStyle["top"] = top;
					self._genlistCallStyle["display"] = "block";
					self._genlistCallStyle["background-position-x"] = parseInt( callBPX ) + sx + "px";

					e.preventDefault();
				} else if ( sx < -self.options.threshold ) {
					var bpx = self._genlistMessageStyle["background-position-x"];
					self._genlistMessageStyle["top"] = top;
					self._genlistMessageStyle["display"] = "block";
					self._genlistMessageStyle["background-position-x"] = parseInt( messageBPX ) + sx + "px";

					e.preventDefault();
				}
			}
		});

		document.addEventListener( "touchend", function( e ) {
			var callBPX = self._genlistCallStyle["background-position-x"],
			messageBPX = self._genlistMessageStyle["background-position-x"],
			interval;

			if( parseInt( callBPX ) > -200 ) {
				// animate call background x position
				var i = parseInt( callBPX );

				(function animate(){
					if ( i < 0 ){
						self._genlistCallStyle["background-position-x"] = i + "px"
						i+=20;
						webkitRequestAnimationFrame( animate );
					} else {
						self._genlistCallStyle["background-position-x"] = "-400px";
						self._genlistCall.style.display = "none";
						// fired custom event
						self._genlistCall.dispatchEvent( calling );
					}
				})();

			} else if( parseInt( messageBPX ) < -200 ) {
				// animate message background x position
				var i = parseInt( messageBPX );

				(function animate(){
					if ( i > -400 ){
						self._genlistMessageStyle["background-position-x"] = i + "px"
						i-=20;
						webkitRequestAnimationFrame( animate );
					} else {
						self._genlistMessageStyle["background-position-x"] = "-20px";
						self._genlistMessage.style.display = "none";
						// fired custom event
						self._genlistCall.dispatchEvent( messaging );
					}
				})();
			} else {
				self._genlistCall.style.display = "none";
				self._genlistMessage.style.display = "none";
			}

			dragging = false;
		});
	}
}
