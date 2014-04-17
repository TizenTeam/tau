
var fingerCount = 0;
var startX = 0;
var startY = 0;
var curX = 0;
var curY = 0;
var deltaX = 0;
var deltaY = 0;
var horzDiff = 0;
var vertDiff = 0;
var minLength = 72;
var swipeLength = 0;
var swipeAngle = null;
var swipeDirection = null;
var dataCount = 0;
function touchStart(event) {
	event.preventDefault();
	fingerCount = event.touches.length;
	if ( fingerCount == 1 ) {
		startX = event.touches[0].pageX;
		startY = event.touches[0].pageY;
	} else {
		touchCancel(event);
	}
}

function touchMove(event) {
	event.preventDefault();
	if ( event.touches.length == 1 ) {
		curX = event.touches[0].pageX;
		curY = event.touches[0].pageY;
	} else {
		touchCancel(event);
	}
}

function touchEnd(event) {
	event.preventDefault();
	var con = document.getElementById("container");
	if ( fingerCount == 1 && curX != 0 ) {
		swipeLength = Math.round(Math.sqrt(Math.pow(curX - startX,2) + Math.pow(curY - startY,2)));
		if ( swipeLength >= minLength ) {
			caluculateAngle();
			determineSwipeDirection();
		if( swipeDirection == "left" ) {
				dataCount++;
				if( dataCount > 7 ) dataCount = 7;
		} else if(swipeDirection == "right"){
				dataCount--;
				if( dataCount < 0 ) dataCount = 0;
		}
		con.style.webkitTransform = "translateX(-"+ (dataCount * 320) + "px)";
		touchCancel(event);
		} else {
			touchCancel(event);
		}
	} else {
		touchCancel(event);
	}
}

function touchCancel(event) {
	fingerCount = 0;
	startX = 0;
	startY = 0;
	curX = 0;
	curY = 0;
	deltaX = 0;
	deltaY = 0;
	horzDiff = 0;
	vertDiff = 0;
	swipeLength = 0;
	swipeAngle = null;
	swipeDirection = null;
}

function caluculateAngle() {
	var X = startX-curX;
	var Y = curY-startY;
	var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2)));
	var r = Math.atan2(Y,X);
	swipeAngle = Math.round(r*180/Math.PI);
	if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); }
}

function determineSwipeDirection() {

	if ( (swipeAngle <= 45) && (swipeAngle >= 0) ) {
		swipeDirection = 'left';
	} else if ( (swipeAngle <= 360) && (swipeAngle >= 315) ) {
		swipeDirection = 'left';
	} else if ( (swipeAngle >= 135) && (swipeAngle <= 225) ) {
		swipeDirection = 'right';
	} else if ( (swipeAngle > 45) && (swipeAngle < 135) ) {
		swipeDirection = 'down';
	} else {
		swipeDirection = 'up';
	}
}

window.onload = function () {
	if ( document.body.clientHeight == 320 && document.body.clientWidth == 320 ) {
	var con = document.getElementById("container");
	con.addEventListener ( "touchstart", touchStart );
	con.addEventListener ( "touchmove", touchMove );
	con.addEventListener ( "touchend" , touchEnd );
	}
}
