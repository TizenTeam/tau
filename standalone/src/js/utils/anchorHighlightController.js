(function() {
	/* anchorHighlightController.js
	To prevent perfomance regression when scrolling,
	do not apply hover class in anchor.
	Instead, this code checks scrolling for time threshold and
	decide how to handle the color.
	When scrolling with anchor, it checks flag and decide to highlight anchor.
	While it helps to improve scroll performance,
	it lowers responsiveness of the element for 50msec.
	*/
	var startX,
	startY,
	didScroll,
	target,
	touchLength,
	addActiveClassTimerID,
	options = {
		scrollThreshold: 5,
		addActiveClassDelay: 50,	// wait before adding activeClass
		keepActiveClassDelay: 100	// stay activeClass after touchend
	},
	activeClass = {
		"A": "ui-a-active"
	};

	function touchstartHandler( e ) {
		touchLength = e.touches.length;

		if( touchLength !== 1 ) {
			return;
		} else {
			didScroll = false;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			target = e.target;

			document.addEventListener( "touchmove", touchmoveHandler );
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

	function removeTouchMove() {
		document.removeEventListener( "touchmove", touchmoveHandler );
	}

	function detectATarget (target) {
		while (target && target.tagName !== "A") {
			target = target.parentNode;
		}
		return target;
	}

	function addActiveClass() {
		target = detectATarget(target);
		if(!didScroll && target && target.tagName === "A") {
			target.classList.add(activeClass.A);
		}
	}

	function removeActiveClass() {
		var activeA = getActiveElements(),
			i;
		for( i=0; i<activeA.length; i++ ) {
			activeA[i].classList.remove( activeClass.A );
		}
	}

	function getActiveElements() {
		return document.getElementsByClassName( activeClass.A );
	}

	function touchendHandler() {
		if( touchLength !== 1 ) {
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

	window.addEventListener( "DOMContentLoaded", eventBinding );

}());
