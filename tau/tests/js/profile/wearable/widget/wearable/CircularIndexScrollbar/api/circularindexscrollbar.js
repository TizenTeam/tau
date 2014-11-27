module("tau.widget.CircularIndexScrollbar", {});

test ("API of CircularIndexScrllbar Widget", function() {
	var widget;

	equal(typeof tau, 'object', 'Class tau exists');
	equal(typeof tau.widget, 'object', 'Class tau.widget exists');
	equal(typeof tau.widget.wearable, 'object', 'Class tau.widget.wearable exists');
	equal(typeof tau.widget.wearable.CircularIndexScrollbar, 'function', 'Class tau.widget.wearable.CircularIndexScrollbar exists');

	widget = new tau.widget.wearable.CircularIndexScrollbar(document.getElementById("widget"));

	equal(typeof widget._configure, 'function', 'Method circularIndexScrollbar._configure exists');
	equal(typeof widget._init, 'function', 'Method circularIndexScrollbar._init exists');
	equal(typeof widget._setIndices, 'function', 'Method circularIndexScrollbar._setIndices exists');
	equal(typeof widget._draw, 'function', 'Method circularIndexScrollbar._draw exists');
	equal(typeof widget._drawBasicIndices, 'function', 'Method circularIndexScrollbar._drawBasicIndices exists');
	equal(typeof widget._drawOmitIndices, 'function', 'Method circularIndexScrollbar._drawOmitIndices exists');
	equal(typeof widget._setChildStyle, 'function', 'Method circularIndexScrollbar._setChildStyle exists');
	equal(typeof widget.show, 'function', 'Method circularIndexScrollbar.show exists');
	equal(typeof widget.hide, 'function', 'Method circularIndexScrollbar.hide exists');
	equal(typeof widget._setValueByPosition, 'function', 'Method circularIndexScrollbar.setValueByPosition exists');
	equal(typeof widget._nextIndex, 'function', 'Method circularIndexScrollbar._nextIndex exists');
	equal(typeof widget._prevIndex, 'function', 'Method circularIndexScrollbar._prevIndex exists');
	equal(typeof widget._setValue, 'function', 'Method circularIndexScrollbar._setValue exists');
	equal(typeof widget._getValue, 'function', 'Method circularIndexScrollbar._getValue exists');
	equal(typeof widget._start, 'function', 'Method circularIndexScrollbar._start exists');
	equal(typeof widget._move, 'function', 'Method circularIndexScrollbar._move exists');
	equal(typeof widget._end, 'function', 'Method circularIndexScrollbar._end exists');
	equal(typeof widget._swipe, 'function', 'Method circularIndexScrollbar._swipe exists');
	equal(typeof widget._wheel, 'function', 'Method circularIndexScrollbar._wheel exists');
	equal(typeof widget._transitionEnd, 'function', 'Method circularIndexScrollbar._transitionEnd exists');
	equal(typeof widget._rotary, 'function', 'Method circularIndexScrollbar._rotary exists');
	equal(typeof widget.handleEvent, 'function', 'Method circularIndexScrollbar.handleEvent exists');
	equal(typeof widget._bindEvents, 'function', 'Method circularIndexScrollbar._bindEvents exists');
	equal(typeof widget._unbindEvents, 'function', 'Method circularIndexScrollbar._unbindEvents exists');
	equal(typeof widget._reset, 'function', 'Method circularIndexScrollbar._reset exists');
	equal(typeof widget._refresh, 'function', 'Method circularIndexScrollbar._refresh exists');
	equal(typeof widget._destroy, 'function', 'Method circularIndexScrollbar._destroy exists');
	equal(typeof widget._destroySubObjects, 'function', 'Method circularIndexScrollbar._destroySubObjects exists');
});
