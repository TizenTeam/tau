(function() {
	/* listHighlightController.js
	To prevent perfomance regression when scrolling,
	do not apply hover class in anchor and label.
	Instead, this code checks scrolling for time threshold and
	decide how to handle the color.
	When scrolling with anchor or label, it checks flag and decide to highlight them.
	While it helps to improve scroll performance,
	it lowers responsiveness of the element for 10msec.
	*/
	var startX,
	startY,
	didScroll,
	target,
	liTarget,
	addActiveClassTimerID,
	options = {
		scrollThreshold: 5,
		addActiveClassDelay: 10,	// wait before adding activeClass
		keepActiveClassDelay: 100	// stay activeClass after touchend
	},
	activeClass = {
		"LI": "ui-li-active"
	};

	function touchstartHandler( e ) {
		if( e.touches.length !== 1 ) {
			return;
		} else {
			didScroll = false;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			target = e.target;

			document.addEventListener( "touchmove", touchmoveHandler );
			document.addEventListener( "touchcancel", touchcancelHandler );
			addActiveClassTimerID = setTimeout( addActiveClass, options.addActiveClassDelay );
		}
	}

	function touchmoveHandler( e ) {
		didScroll = didScroll ||
		( Math.abs( e.touches[0].clientX - startX ) > options.scrollThreshold || Math.abs( e.touches[0].clientY - startY ) > options.scrollThreshold );

		if( didScroll ) {
			removeTouchMove();
			removeActiveClass();
		}
	}

	function touchcancelHandler( ) {
		removeTouchCancel();
		removeActiveClass();
	}

	function removeTouchMove() {
		document.removeEventListener( "touchmove", touchmoveHandler );
	}

	function removeTouchCancel() {
		document.removeEventListener( "touchcancel", touchcancelHandler );
	}

	function detectHighlightTarget ( target ) {
		while ( target ) {
			if( (target.tagName === "A") || (target.tagName === "LABEL") ) {
				break;
			} else {
				target = target.parentNode;
			}
		}
		return target;
	}

	function detectLiElement ( target ) {
		while ( target ) {
			if( target.tagName === "LI" ) {
				break;
			} else {
				target = target.parentNode;
			}
		}
		return target;
	}

	function addActiveClass() {
		target = detectHighlightTarget(target);
		if(!didScroll && target && ((target.tagName === "A") || (target.tagName === "LABEL"))) {
			liTarget = detectLiElement(target);
			if( liTarget ) {
				liTarget.classList.add(activeClass.LI);
			}
		}
	}

	function removeActiveClass() {
		var activeA = getActiveElements(),
			i;
		for( i=0; i<activeA.length; i++ ) {
			activeA[i].classList.remove( activeClass.LI );
		}
	}

	function getActiveElements() {
		return document.getElementsByClassName( activeClass.LI );
	}

	function touchendHandler( e ) {
		if( e.touches.length >= 1 ) {
			return;
		} else {
			clearTimeout( addActiveClassTimerID );
			addActiveClassTimerID = null;
			if ( !didScroll ) {
				setTimeout( removeActiveClass, options.keepActiveClassDelay );
			}
			didScroll = false;
		}
	}

	function eventBinding() {
		document.addEventListener( "touchstart", touchstartHandler );
		document.addEventListener( "touchend", touchendHandler );
		window.addEventListener( "pagehide", removeActiveClass );
	}

	if(document.readyState === "complete") {
		eventBinding();
	} else {
		window.addEventListener( "load", eventBinding );
	}

}());
