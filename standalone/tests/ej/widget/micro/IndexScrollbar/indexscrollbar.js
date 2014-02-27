	module("ej.widget.micro.IndexScrollbar", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var toucheventHandler;

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

	test ("Not valid element", function () {
		var elem0 = document.getElementById("notvalid"),
			widget = ej.engine.instanceWidget(elem0, "IndexScrollbar");

		equal(widget, null, "Widget isn't built because element doesn't have proper class");
	});

	test ("Settings after building", function () {
		var elem1 = document.getElementById("withdata"),
			elem2 = document.getElementById("settings1"),
			elem3 = document.getElementById("settings2"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget._extended, true, "Widget is extended");
		equal(widget.options.index.length, 3, "Widget has new index from data-index");
		equal(typeof widget.indicator, "object", "Widget has indicator");
		equal(widget.indicator.className, widget.options.indicatorClass, "Widget indicator has proper className");
		equal(widget.indicator.children.length, 1, "Widget indicator has one child");
		equal(widget.indicator.children[0].tagName, "SPAN", "Widget indicator has span child");
		equal(widget.element.previousSibling.className, widget.options.indicatorClass, "Widget indicator is placed before widget");

		widget = ej.engine.instanceWidget(elem2, "IndexScrollbar", {indicatorClass: "new-indicator"});
		equal(widget._extended, true, "Widget is extended");
		equal(widget.options.index.length, 27, "Widget has default index");
		equal(widget.element.previousSibling.className,"new-indicator", "Widget indicator has a new indicator's class from options");

		widget = ej.engine.instanceWidget(elem3, "IndexScrollbar", {delimeter: "#", index: "A#B"});
		equal(widget._extended, true, "Widget is extended");
		equal(widget.options.index.length, 2, "Widget has new a index from options");
		equal(widget.options.index[0], "A", "Widget has new a index from options");
		equal(widget.options.index[1], "B", "Widget has new a index from options");
		equal(widget.options.delimeter, "#", "Widget has a new index");
	});

	test ("Built list", function () {
		var elem1 = document.getElementById("list7"),
			elem2 = document.getElementById("list8"),
			widget,
			list;

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar", {index: ["X", "Y", "Z"]});
		// widget with 3 elements in index (all of them are shown)
		list = widget.element.children[0];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(list.children.length, 3, "List has 3 children");
		equal(list.children[0].innerText, "X", "First child is 'X'");
		equal(list.children[1].innerText, "Y", "Second child is 'Y'");
		equal(list.children[2].innerText, "Z", "Third child is 'Z'");

		widget = ej.engine.instanceWidget(elem2, "IndexScrollbar", {maxIndexLen: 12});
		// widget with default index (olny A, G, L, Q, V and 1 are shown)
		list = widget.element.children[0];
		equal(list.tagName, "UL", "Element has child, which is a list");
		equal(widget.options.maxIndexLen, 11, "maxIndexLen was corrected");
		equal(list.children.length, 11, "List has 11 children");
		equal(list.children[0].innerText, "A", "First child is 'A'");
		equal(list.children[1].innerText, "*", "Second child is '*'");
		equal(list.children[2].innerText, "G", "Third child is 'G");
		equal(list.children[3].innerText, "*", "4. child is '*'");
		equal(list.children[4].innerText, "L", "5. child is 'L'");
		equal(list.children[5].innerText, "*", "6. child is '*'");
		equal(list.children[6].innerText, "Q", "7. child is 'Q'");
		equal(list.children[7].innerText, "*", "8. child is '*'");
		equal(list.children[8].innerText, "V", "9. child is 'V'");
		equal(list.children[9].innerText, "*", "10. child is '*'");
		equal(list.children[10].innerText, "1", "11. child is '1'");
	});

	test ("Refresh", function () {
		var elem1 = document.getElementById("withdata"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget._extended, true, "Widget is _extended before refresh");
		equal(widget.element.children[0].children.length, 3, "Widget has 3 element before refresh");
		widget.refresh();
		equal(widget._extended, true, "Widget is _extended after refresh");
		equal(widget.element.children[0].children.length, 3, "Widget has 3 element after refresh");
	});

	test ("Destroy", function () {
		var elem1 = document.getElementById("withdata"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		equal(widget.widgetName, "IndexScrollbar", "Widget has proper name");
		equal(widget.isBuilt(), true, "Widget is built");
		equal(widget.isBound(), true, "Widget is bound");
		widget.destroy();
		equal(widget.isBuilt(), false, "Widget was destroyed");
		equal(widget.isBound(), false, "Widget was destroyed");
	});

	function testEvent(event) {
		ok(true, "Test event was fired only once");
	}
	asyncTest ("Public - addEventListener", 1, function () {
		var elem1 = document.getElementById("addevent"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		widget.addEventListener("test", testEvent);

		ej.utils.events.trigger(elem1, "test");

		setTimeout(function(){
			widget.removeEventListener("test", testEvent);
			ej.utils.events.trigger(elem1, "test");
			start();
		}, 100);
	});

	asyncTest ("Click", 1, function () {
		var elem1 = document.getElementById("click"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar"),
			elemA = elem1.children[0].children[0],
			elemAtext;

		elemAtext = elemA.innerText;

		elem1.addEventListener("select", function (options) {
			equal(options.detail.index, elemAtext, "First element is checked");
			start();
		});

		ej.utils.events.trigger(elemA, "click");
	});

	function touchevent (elem1, widget) {
		var indicator = widget.indicator,
			value = indicator.innerText,
			lastElementOffset,
			list = elem1.children[0].children;

		equal(window.getComputedStyle(indicator).display, "block", "Indicatior is displayed");

		lastElementOffset = ej.utils.DOM.getElementOffset(list[list.length -1]);

		fireEvent(elem1, "touchmove", {touches: [{clientX: lastElementOffset.left, clientY: lastElementOffset.top}]});
		ok(indicator.innerText !== value, "Indicator has different text");

		fireEvent(elem1, "touchend", {touches: []});
		equal(window.getComputedStyle(indicator).display, "none", "Indicatior is not displayed");

		// make widget invisible
		document.getElementById("first").style.left = "-99999em";
		document.getElementById("first").style.top = "-99999em";

		document.removeEventListener("touchstart", toucheventHandler);

		start();
	};

	asyncTest ("Touch", 3, function () {
		var elem1 = document.getElementById("touch"),
			widget,
			elemA,
			elemOffset;

		// make widget visible for a while
		document.getElementById("first").style.left = "1em";
		document.getElementById("first").style.top = "1em";

		widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");
		toucheventHandler = touchevent.bind(null, elem1, widget);
		elemA = elem1.children[0].children[0];
		elemOffset = ej.utils.DOM.getElementOffset(elemA);

		document.addEventListener("touchstart", toucheventHandler);

		fireEvent(elem1, "touchstart", {touches: [{clientX: elemOffset.left, clientY: elemOffset.top}]});
	});