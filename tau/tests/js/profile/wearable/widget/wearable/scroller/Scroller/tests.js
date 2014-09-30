module("tau.widget.wearable.scroller.Scroller", {});

var pageWidget = document.getElementById('first');

function fireEvent(el, type, props) {
	var evt = new CustomEvent(type, {
			"bubbles": true,
			"cancelable": true
		}),
		prop;
	for (prop in props) {
		if (props.hasOwnProperty(prop)) {
			evt[prop] = props[prop];
		}
	}
	try {
		return el.dispatchEvent(evt);
	} catch (err) {
		console.log(err);
	}
	return false;
}

pageWidget.addEventListener('pageshow', function () {
	asyncTest("tau.widget.wearable.scroller.Scroller _build method", function () {
		var scrollerElement = document.getElementById('scroller'),
			scrollerInner = scrollerElement.children[0],
			scrollerWidget = tau.widget.Scroller(scrollerElement),
			scrollBarWidget = tau.engine.getBinding(scrollerElement, 'ScrollBar'),
			bar = scrollerWidget.option("scrollbar"),
			orientation = scrollerWidget.option("orientation"),
			useBouncingEffect = scrollerWidget.option("useBouncingEffect");
		expect(13);
		ok(scrollerWidget, "widget instance exists");
		equal(scrollerElement.style.position, "relative", 'position is set to relative');
		equal(scrollerInner.style.position, "absolute", 'position of first child is set to absolute');
		equal(scrollerInner.style.top, "0px", 'top of first child is set to 0px');
		equal(scrollerInner.style.left, "0px", 'top of first child is set to 0px');
		if (bar) {
			ok(scrollBarWidget, "widget ScrollBar instance exists");
		} else {
			ok(!scrollBarWidget, "widget ScrollBar instance not exists");
		}
		pageWidget.addEventListener( "scrollstart", function(e) {
			ok(true, 'scrollstart was called');
		});

		pageWidget.addEventListener( "scrollend", function(e) {
			ok(true, 'scrollend was called');
		});

		lastElementOffset = ej.util.DOM.getElementOffset(scrollerInner);
		fireEvent(scrollerInner, "mousedown", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 100, which: 1});
		fireEvent(scrollerInner, "mousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 50, which: 1});
		fireEvent(scrollerInner, "mouseup", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 50, which: 1});
		if (orientation === "vertical") {
			ok(scrollerInner.style.WebkitTransform !== "", "element was scrolled");
		} else {
			ok(scrollerInner.style.WebkitTransform === "", "element was scrolled");
		}
		fireEvent(scrollerInner, "mousedown", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 50, which: 1});
		fireEvent(scrollerInner, "mousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 100, which: 1});
		fireEvent(scrollerInner, "mouseup", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 100, which: 1});

		fireEvent(scrollerInner, "mousedown", {clientX: lastElementOffset.left + 100 , clientY: lastElementOffset.top, which: 1});
		fireEvent(scrollerInner, "mousemove", {clientX: lastElementOffset.left + 50 , clientY: lastElementOffset.top, which: 1});
		fireEvent(scrollerInner, "mouseup", {clientX: lastElementOffset.left + 50, clientY: lastElementOffset.top, which: 1});
		if (orientation === "horizontal") {
			ok(scrollerInner.style.WebkitTransform !== "", "element was scrolled");
		} else {
			ok(scrollerInner.style.WebkitTransform === "translate3d(0px, 0px, 0px)", "element was scrolled");
		}
		fireEvent(scrollerInner, "mousedown", {clientX: lastElementOffset.left + 50 , clientY: lastElementOffset.top, which: 1});
		fireEvent(scrollerInner, "mousemove", {clientX: lastElementOffset.left + 100 , clientY: lastElementOffset.top, which: 1});
		fireEvent(scrollerInner, "mouseup", {clientX: lastElementOffset.left + 100, clientY: lastElementOffset.top, which: 1});

		ok(scrollerInner.style.WebkitTransform === "translate3d(0px, 0px, 0px)", "element was scrolled");

		if (bar) {
			equal(scrollerElement.children[1].className, "ui-scrollbar-bar-type ui-scrollbar-vertical", "bar has proper classes");
			equal(scrollerElement.children[1].children[0].className, "ui-scrollbar-indicator", "inner bar has proper classes");
			equal(scrollerElement.children[1].children[0].style.top, "0px", "bar has proper top");
			ok(scrollerElement.children[1].children[0].style.height !== "0px", "bar has proper height");
			expect(17);
		}
		if (useBouncingEffect){
			equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top", "top effect container has proper classes");
			equal(scrollerElement.children[2].className, "ui-scrollbar-bouncing-effect ui-bottom", "bottom effect container has proper classes");
			fireEvent(scrollerInner, "mousedown", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 50, which: 1});
			fireEvent(scrollerInner, "mousemove", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 100, which: 1});
			fireEvent(scrollerInner, "mouseup", {clientX: lastElementOffset.left , clientY: lastElementOffset.top + 100, which: 1});
			tau.event.one(scrollerElement.children[1], "webkitAnimationEnd", function() {
				tau.event.one(scrollerElement.children[1], "webkitAnimationEnd", function() {
					equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top", "top effect container has proper classes (none)");
					start();
				});
				equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top ui-hide", "top effect container has proper classes (hide)");
			});
			equal(scrollerElement.children[1].className, "ui-scrollbar-bouncing-effect ui-top ui-show", "top effect container has proper classes (show)");
			expect(18);
		} else {
			start();
		}

	});
}, false);