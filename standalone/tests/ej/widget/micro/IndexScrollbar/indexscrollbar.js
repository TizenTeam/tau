module("ej.widget.micro.IndexScrollbar", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

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

	test ("Settings after building", function () {
		var elem1 = document.getElementById("indexscrollbar1"),
			elem2 = document.getElementById("indexscrollbar2"),
			elem3 = document.getElementById("indexscrollbar3"),
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
		equal(widget.element.previousSibling.className, widget.options.indicatorClass, "Widget indicator is placed before widget");

		widget = ej.engine.instanceWidget(elem3, "IndexScrollbar", {delimeter: "#", index: "A#B"});
		equal(widget._extended, true, "Widget is extended");
		equal(widget.options.index.length, 2, "Widget has new index from options");
		equal(widget.options.index[0], "A", "Widget has new index from options");
		equal(widget.options.index[1], "B", "Widget has new index from options");
		equal(widget.options.delimeter, "#", "Widget has default index");
	});

	test ("Built list", function () {
		var elem1 = document.getElementById("indexscrollbar1"),
			elem2 = document.getElementById("indexscrollbar2"),
			elem3 = document.getElementById("indexscrollbar3"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar"),
			child;

		child = widget.element.children[0];
		equal(child.tagName, "UL", "Element has child, which is a list");
		// todo: set height and check children of list

	});

	function testEvent(event) {
		ok(true, "Test event was fired");
	}
	asyncTest ("Public - addEventListener", 1, function () {
		var elem1 = document.getElementById("indexscrollbar6"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar");

		widget.addEventListener("test", testEvent);

		ej.utils.events.trigger(elem1, "test");

		setTimeout(function(){
			widget.removeEventListener("test", testEvent);
			ej.utils.events.trigger(elem1, "test");
			start();
		}, 100);
	});

	asyncTest ("Click", 2, function () {
		var elem1 = document.getElementById("indexscrollbar4"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar"),
			elemA;

	
		elemA = elem1.children[0].children[0];
		
		elem1.addEventListener("select", function (options) {
			equal(options.detail.index, "A", "First element is checked");
			equal(window.getComputedStyle(widget.indicator).display, "none", "Indicatior is not displayed on click");
			start();
		});

		ej.utils.events.trigger(elemA, "click");
	});


	asyncTest ("Touch", 2, function () {
		var elem1 = document.getElementById("indexscrollbar5"),
			widget = ej.engine.instanceWidget(elem1, "IndexScrollbar"),
			elemA,
			touchevent = function () {
				var indicator,
					value;
				indicator = widget.indicator;
				value = indicator.innerText;
				equal(window.getComputedStyle(indicator).display, "block", "Indicatior is displayed");
				fireEvent(elem1, "touchmove", {touches: [{clientX: x, clientY: -2999430}]});
				// todo move to proper position (clientY = y + 50)
				//ok(indicator.innerText !== value, "Indicator has different text");
				fireEvent(elem1, "touchend", {touches: []});
				equal(window.getComputedStyle(indicator).display, "none", "Indicatior is not displayed");
				document.removeEventListener("touchstart", touchevent);
				start();
			},
			x,
			y;

		elemA = elem1.children[0].children[0];
		// todo computer top and left position of elemA
		x = elemA.offsetLeft;
		y = elemA.offsetTop;

		document.addEventListener("touchstart", touchevent);

		fireEvent(elem1, "touchstart", {touches: [{clientX: x, clientY: y}]});
	});
