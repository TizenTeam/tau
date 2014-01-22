function SectionChanger( elem ) {
	// This constructor has section element parameter in active page
	this.init( elem );
	return this;
}

SectionChanger.prototype = {
	init: function( elem ) {
		var sectionLength;

		if( !elem ) {
			// If developer don't give parameter, this object set default section
			this._page = document.getElementsByClassName("ui-page-active");
			this._sections = this._page[0].getElementsByTagName("section");
		} else {
			this._sections = elem;
		}

		sectionLength = this._sections.length;
		this.scroller = new Scroller();

		if( !this.scroller.getElement() || sectionLength === 1 ) {
			// If section element exist only one, don't need swipe event
			return;
		}

		this._dragging = false;
		this._lsw = 0;
		this._ex = 0; // user click x position in element
		this._sx = 0; // last x position plus move space between last x position and current x position
		this._lastX = 0;
		this._width = screen.width;
		if ( this.scroller.options.circularElement === "true" ) {
			// circular option is true.
			this.scroller.setWidth( this._width * 3 + "px" ); //set Scroller width
		} else {
			// circular option is false.
			this.scroller.setWidth( this._width * sectionLength + "px" );
		}
		//section element has absolute position
		for( var i = 0; i < this._sections.length; i++ ){
			//Each section set initialize left position
			var sectionStyle = this._sections[i].style;
			sectionStyle["width"] = this._width + "px";
			sectionStyle["left"] = this._width * i + "px";

			if ( new RegExp( "section-start" ).test( this._sections[i].className ) ) {
				// set start position
				var startX = this._width * -i;
				this._lastX = startX;
				this._sx = this._lastX; // last x position plus move space between last x position and current x position
				this._activeSection = this._sections[i];
				this._activeSection.className += " section-active";
				this.scroller.scrollTo( startX, 0, 1 ); //  For webkitTransitionEnd event fire, duration value '1' needed
			}
		}
		if ( !this._activeSection ) {
			// Developer don't implement section-start class
			this._activeSection = this._sections[0];
			this._activeSection.className += " section-active";
			this.scroller.scrollTo( 0, 0, 1 );
		}
		this._addEvent();
	},

	_addEvent: function() {
		var ew,
			sectionStyle,
			startX,
			scrollerElement = this.scroller.getElement(),
			self = this;

		ew = parseInt( self.scroller.getWidth() );
		self._lsw = ew - self._width; // limit scroll width

		scrollerElement.addEventListener( "scroller.end", function( e ){
			if ( self.scroller.options.autoFitting === "true" ) {
				self._fitSectionPosition( e.lastX );
			}
		});

		scrollerElement.addEventListener( "webkitTransitionEnd", function( e ){

			self._lastX = self.scroller.getLastXPosition();
			if ( self.scroller.options.circularElement === "true" ) {
				if ( self._lastX === 0 ) {
					self._moveCircularElement( "left" );
				} else if ( self._lastX === -self._lsw ) {
					self._moveCircularElement( "right" );
				}
			} else {
				// circular element options is false
				for( var i = 0; i < self._sections.length; i++ ){
					// find now showing section
					var sectionStyle = self._sections[i].style;
					if ( parseInt( sectionStyle["left"] ) === -self._lastX ) {
						self._activeSection = self._sections[i];
						break;
					}
				}
			}
			self._setScrollerStatus();
		});
	},

	_setScrollerStatus: function() {
		// This method set scroller status, none or horizontal or vertical or all.
		// Scroller has forth status.
		// 1) page don't need to scroller
		// 2) page only need to horizontal scroller
		// 3) page only need to vertical scroller
		// 4) page only need to all direction scroller
		var originActiveSection = document.getElementsByClassName("section-active", "div" )[0];

		if ( this._sections.length > 1 ) {
			if ( this._activeSection.scrollHeight > parseInt( this.scroller.getHeight() ) ) {
				// set all
				this.scroller.setDirection( "all" );
			} else {
				// horizontal
				this.scroller.setDirection( "horizontal" );
			}
		}
		// remove section-active class
		originActiveSection.className = originActiveSection.className.replace(" section-active","");
		this._activeSection.className += " section-active";
		this.scroller.getElement().scrollTop = 0;
	},

	_fitSectionPosition: function( lastX ) {
		var interval = -lastX % this._width,
			fitValue = lastX - ( this._width - interval );

		if ( interval <= this._width / 2 ) {
			this.scroller.scrollTo( lastX + interval, 0, 300 );
			this._lastX = lastX + interval;
		} else {
			this.scroller.scrollTo( fitValue, 0, 300 );
			this._lastX = fitValue;
		}
	},

	_moveCircularElement: function( direction ) {
		// if developer set circular option is true, this method used when webkitTransitionEnd event fired
		var sectionLength = this._sections.length,
		sectionStyle,
		containerWidth = sectionLength * this._width,
		deltaX,
		left;
		if ( direction === "left" ) {
			deltaX = this._width;
			this.scroller.scrollTo( -this._width, 0 );
			this._lastX = -this._width;
		} else {
			deltaX = -this._width;
			this.scroller.scrollTo( -this._lsw + this._width, 0 );
			this._lastX = -this._lsw + this._width;
		}

		for ( var i = 0; i < sectionLength; i++ ) {
			// This loop need to circular view of sections
			// deltaX value add to correct section x position, left side deltaX value is section width and right side deltaX value is minus section width.
			// In order to remove negative values, containerWidth variable add and modular operate for this value.
			// For example, var temp = [ one(0), two(300), three(600), four(900), five(1200) ] each element has width value '300' and has 'left' value in parentheses and 'two' is main page
			// If user move left side, user want to one element, each element left value plus element width.
			// Then each element has value [ one(300), two(600), three(600), four(1200), five(1500) ] and operate modular operation for container width, width is '1500', each value.
			// Then, this array section has value [ one(300), two(600), three(600), four(1200), five(0) ]
			sectionStyle = this._sections[i].style;
			left = ( parseInt( sectionStyle["left"], 10) + deltaX + containerWidth ) % containerWidth;
			sectionStyle["left"] = left + "px";
			if ( left === this._width ) {
				// set activeSection
				this._activeSection = this._sections[i];
			}
		}
	}
}
