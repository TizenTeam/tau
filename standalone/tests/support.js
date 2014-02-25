/* 
 * Support checks for phantomjs
 */

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
	if (typeof this !== "function") {
	// closest thing possible to the ECMAScript 5 internal IsCallable function
	throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	}

	var aArgs = Array.prototype.slice.call(arguments, 1),
		fToBind = this,
		fNOP = function () {},
		fBound = function () {
		return fToBind.apply(this instanceof fNOP && oThis
								? this
								: oThis,
							aArgs.concat(Array.prototype.slice.call(arguments)));
		};

	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();

	return fBound;
  };
}

if (!CustomEvent) {
	function CustomEvent(type, data) {
		var evt = document.createEvent('Event');
		evt.initEvent(type, data.bubbles, data.cancelable);
		evt.detail = data.detail;
		return evt;
	}
}
org_pushstate = window.history.pushState;
window.history.pushState = function () {
	try {
		org_pushstate.apply(window.history, arguments);
	}
	catch (e) {
	}
};


Element.prototype.click = function () {
var ev = document.createEvent("MouseEvent");
ev.initMouseEvent(
    "click",
    true /* bubble */, true /* cancelable */,
    window, null,
    0, 0, 0, 0, /* coordinates */
    false, false, false, false, /* modifier keys */
    0 /*left*/, null
);
this.dispatchEvent(ev);
}