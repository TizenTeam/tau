var testElement1 = document.getElementById("test1"),
	testElement2 = document.getElementById("test2"),
	testElement3 = document.getElementById("test3"),
	testList1 = document.getElementById("test4"),
	testList1Li1 = testList1.querySelector("li"),
	testList2 = document.getElementById("test5"),
	testList2Li1 = testList2.querySelector("li"),
	testElement6 = document.getElementById("test6"),
	testElement7 = document.getElementById("test7"),
	testElement8 = null,
	testElement9 = document.getElementById("test9"),
	testElement10 = document.getElementById("test10"),
	testElement11 = document.getElementById("test11"),
	dom = ej.util.DOM;

test("util.DOM.css", function () {
	// basic props check
	var props = {
		"width": 0,
		"height": 0,
		"opacity": 0
	};


	floatValue = dom.getCSSProperty(testElement9, "opacity", 0, "float");
	floatValueRound = Math.round(floatValue);
	floatInit = parseInt($(testElement9).css("width"));
	equal(dom.getCSSProperty(testElement1, "display", false), "block", "fetching css property value");
	equal(dom.getCSSProperty(testElement1, "display", false), $(testElement1).css("display"), "compare with jquery");
	deepEqual(dom.getCSSProperty(testElement1, "width", 0, "integer"), 50, "fetching css propety value and matching types");

	ok(floatValueRound !== floatValue, "checks if float");

	dom.extractCSSProperties(testElement1, props);
	equal(typeof props['opacity'], 'number', "Opacity is a typeof number");
	props['opacity'] = Number(props['opacity'].toFixed(1));
	deepEqual(
		props, 
		{
			"width": 50,
			"height": 50,
			"opacity": 0.3
		},
		"fetching multiple props at once"
	);
	equal(props.width, parseInt($(testElement1).css("width")), "comparing with jquery");
	equal(props.height, parseInt($(testElement1).css("height")), "comparing with jquery");

	// height width
	equal(dom.getElementHeight(testElement1), 50, "check element 1 height");
	equal(dom.getElementWidth(testElement1), 50, "check element 1 width");

	equal(dom.getElementWidth(testElement2), 40, "check element 2 width");
	equal(dom.getElementWidth(testElement2), $(testElement2).width(), "compare with jquery");

	equal(dom.getElementHeight(testElement3), 200, "check element 3 height");
	equal(dom.getElementHeight(testElement3), $(testElement3).height(), "compare with jquery");

	equal(dom.getElementHeight(testList1, "outer"), 30, "check list 1 height");
	equal(Math.ceil(dom.getElementHeight(testList1, "outer")),  $(testList1).outerHeight(), "compare with jquery");
	equal(dom.getElementWidth(testList1, "outer"), 30, "check list 1 width");
	equal(dom.getElementWidth(testList1, "outer"), $(testList1).outerWidth(), "compare with jquery");

	equal(dom.getElementWidth(testList1Li1), 10, "check list 1 element 1 width");
	equal(dom.getElementHeight(testList1Li1), 15, "check list 1 element 1 height");

	equal(parseInt(dom.getElementHeight(testList2), 10), 42, "check list 2 height");

	equal(dom.getElementWidth(testList2Li1), 100, "check list 2 element 1 width");

	testElement6.style.width = "55px";
	testElement6.style.border = "1px solid black";
	testElement6.style.margin = "0px";
	testElement6.style.padding = "0px";
	equal(parseInt(dom.getElementWidth(testElement6, "outer", false, true), 10), 57, "check element 6 dynamic set width");
	equal(Math.ceil(dom.getElementWidth(testElement6, "outer", false, true), 10), $(testElement6).outerWidth(true), "compare with jquery");

	equal(parseInt(dom.getElementWidth(testElement7, "outer", false, true, null, true), 10), 72, "check hidden element 7 width");
	equal(parseInt(dom.getElementWidth(testElement7, "outer", false, true, null, true), 10), $(testElement7).outerWidth(true), "compare with jquery");
	equal(parseInt(dom.getElementHeight(testElement7, "outer", false, true, null, true), 10), 72, "check hidden element 7 height");
	equal(parseInt(dom.getElementHeight(testElement7, "outer", false, true, null, true), 10), $(testElement7).outerHeight(true), "compare with jquery");
	equal(testElement7.style.display, "none", "check testElement7 display style attribute modification");

	$("#qunit-fixture").append("<div id='test8'></div>");
	$("#test8").css({
		"width": "100px",
		"height": "100px",
		"margin": "10px",
		"padding": "0",
		"border": "1px solid black",
		"max-height": "10px",
		"height": "10px",
		"border": "0",
		"line-height": "10px",
		"font-size": "8px",
	});
	testElement8 = document.getElementById("test8");
	equal(parseInt(dom.getElementHeight(testElement8, "outer", false, true), 10), $("#test8").outerHeight(true), "compare with jquery method 'outerWidth'");
	equal(parseInt(dom.getElementWidth(testElement8, "outer", false, true), 10), $("#test8").outerWidth(true), "compare with jquery method 'outerWidth'");
	equal(dom.getElementWidth(testElement8, "outer", false, true), 120, "check width of the created element");
	equal(dom.getElementHeight(testElement8, "outer", false, true), 30, "check height of the created element");
	
	$("#test8").css({
		"width": "100px",
		"height": "100px",
		"margin": "10px",
		"padding": "10px",
		"border": "1px solid black",
		"max-height": "10px",
		"height": "10px",
		"border": "0",
		"line-height": "10px",
		"font-size": "8px",
	});
	equal(dom.getElementWidth(testElement8, false, true), 120, "check width of the created element with offset");
	equal(dom.getElementHeight(testElement8, false, true), 30, "check height of the created element with offset");
	equal(dom.getElementWidth(testElement8, 'outer', false), 120,"check width of the created element with outer");
	equal(dom.getElementHeight(testElement8, 'outer', false), 30, "check height of the created element with outer");
	equal(dom.getElementWidth(testElement8, false, false, true), 140, "check width of the created element with margin");
	equal(dom.getElementHeight(testElement8, false, false, true), 50, "check height of the created element with margin");

	// @TODO 50.5% width causes tests fail inside phantom (probably due to different rounding implementation)
	equal(Math.round(dom.getElementWidth(testElement9)), Math.round(document.body.offsetWidth * 0.5057), "Percentage width to pixel (50.57%)");
	equal(dom.getElementWidth(testElement10), document.body.offsetWidth, "Percentage width 2");
	equal(dom.getElementHeight(testElement10), 20, "Percentage height");

	equal(dom.getElementHeight(testElement11), 50, "Auto height");
	equal(dom.getElementWidth(testElement11), document.body.offsetWidth, "Auto width");
});