/*global $, document, CustomEvent, asyncTest, ok, start */

var events = ("touchstart touchmove touchend").split( " " );

QUnit.config.testTimeout = 5000;

module('anchorHighlight');

function fireEvent(el, type, props, touches) {
	var evt = new CustomEvent(type, {
			"bubbles": true,
			"cancelable": true
		}),
		prop;
	
	for (prop in props) {
		evt[prop] = props[prop];
	}
	if (touches) {
		evt.touches = touches;
	}
	try {
		return el.dispatchEvent(evt);
	} catch (err) {
		console.log(err);
	}
	return false;
};

function hasClassName(node) {
	var classname = "ui-li-active";
	return node.classList.contains(classname);
}


function checkClassTimerAnchor(target){
	var testClass = hasClassName(target.parentNode.parentNode);
	ok(testClass, "add class and find anchor element");
	start();
}
function checkClassAnchor(event){
	var target = event.target;

	document.removeEventListener('touchstart', checkClassAnchor, false);
	ok(true, "event fired");
	setTimeout(checkClassTimerAnchor.bind(null,target), 100);
}
asyncTest( "class added", function(){
	var element = document.getElementById("innerAnchor");

	document.addEventListener("touchstart", checkClassAnchor, false);
	fireEvent(element, "touchstart", {
		"clientX": 50,
		"clientY": 50
	}, [{pageX: 0, pageY:0, clientX:0, clientY:0}]);
});


function checkClassTimer(target){
	var testClass = hasClassName(target.parentNode);
	ok(testClass, "class added");
	start();
}
function checkClass(event){
	var target = event.target;

	document.removeEventListener('touchstart', checkClass, false);
	ok(true, "event fired");
	setTimeout(checkClassTimer.bind(null,target), 100);
}
asyncTest( "class added", function(){
	var element = document.getElementById("link");

	document.addEventListener("touchstart", checkClass, false);
	fireEvent(element, "touchstart", {
		"clientX": 50,
		"clientY": 50
	}, [{pageX: 0, pageY:0, clientX:0, clientY:0}]);
});


function checkRemoveClassTimer(target){
	start();
}
function checkRemoveClass(event){
	var target = event.target;

	document.removeEventListener('touchstart', checkRemoveClass, false);
	ok(true, "event fired");
	setTimeout(checkRemoveClassTimer.bind(null,target), 100);
}
asyncTest( "touch move class removed", function(){
	var element = document.getElementById("link");

	document.addEventListener("touchstart", checkRemoveClass, false);
	fireEvent(element, "touchstart", {
		"clientX": 50,
		"clientY": 50
	}, [{pageX: 0, pageY:0, clientX:0, clientY:0}]);

	setTimeout(function () {
	fireEvent(element, "touchmove", {
		"clientX": 150,
		"clientY": 150
	}, [{pageX: 100, pageY:100, clientX:100, clientY:100}]);
	}, 100);
	equal(hasClassName(element.parentNode), false, 'class removed');
});


function checkRemoveClassEndTimer(target){
	start();
}
function checkRemoveClassEnd(event){
	var target = event.target;

	document.removeEventListener('touchstart', checkRemoveClassEnd, false);
	ok(true, "event fired");
	setTimeout(checkRemoveClassEndTimer.bind(null,target), 100);
}
asyncTest( "touch end class removed", function(){
	var element = document.getElementById("link");

	document.addEventListener("touchstart", checkRemoveClassEnd, false);
	fireEvent(element, "touchstart", {
		"clientX": 50,
		"clientY": 50
	}, [{pageX: 0, pageY:0, clientX:0, clientY:0}]);

	setTimeout(function () {
	fireEvent(element, "touchend", {
		"clientX": 150,
		"clientY": 150
	}, [{pageX: 100, pageY:100, clientX:100, clientY:100}]);
	}, 100);
	equal(hasClassName(element.parentNode), false, 'class removed');
});
