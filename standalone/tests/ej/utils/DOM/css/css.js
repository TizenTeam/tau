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
	dom = ej.utils.DOM;

test("utils.DOM.css", function () {
	// basic props check
	var props = {
		"width": 0,
		"height": 0
	};


	floatValue = dom.getCSSProperty(testElement9, "opacity", 0, "float");
	floatValueRound = Math.round(floatValue);
	floatInit = parseInt($(testElement9).css("width"));
	equal(dom.getCSSProperty(testElement1, "display", false), "block", "fetching css property value");
	equal(dom.getCSSProperty(testElement1, "display", false), $(testElement1).css("display"), "compare with jquery");
	deepEqual(dom.getCSSProperty(testElement1, "width", 0, "integer"), 50, "fetching css propety value and matching types");

	ok(floatValueRound !== floatValue, "checks if float");

	dom.extractCSSProperties(testElement1, props);
	deepEqual(
		props, 
		{
			"width": 50,
			"height": 50
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

	equal(dom.getElementHeight(testList1, "outer"), 22, "check list 1 height");
	equal(dom.getElementHeight(testList1, "outer"), $(testList1).outerHeight(), "compare with jquery");
	equal(dom.getElementWidth(testList1, "outer"), 30, "check list 1 width");
	equal(dom.getElementWidth(testList1, "outer"), $(testList1).outerWidth(), "compare with jquery");

	equal(dom.getElementWidth(testList1Li1), 10, "check list 1 element 1 width");
	equal(dom.getElementHeight(testList1Li1), 15, "check list 1 element 1 height");

	equal(dom.getElementHeight(testList2), 42, "check list 2 height");

	equal(dom.getElementWidth(testList2Li1), 100, "check list 2 element 1 width");

	testElement6.style.width = "55px";
	testElement6.style.border = "1px solid black";
	testElement6.style.margin = "0px";
	testElement6.style.padding = "0px";
	equal(dom.getElementWidth(testElement6, "outer", false, true), 57, "check element 6 dynamic set width");
	equal(dom.getElementWidth(testElement6, "outer", false, true), $(testElement6).outerWidth(true), "compare with jquery");

	equal(dom.getElementWidth(testElement7, "outer", false, true, null, true), 72, "check hidden element 7 width");
	equal(dom.getElementWidth(testElement7, "outer", false, true, null, true), $(testElement7).outerWidth(true), "compare with jquery");
	equal(dom.getElementHeight(testElement7, "outer", false, true, null, true), 72, "check hidden element 7 height");
	equal(dom.getElementHeight(testElement7, "outer", false, true, null, true), $(testElement7).outerHeight(true), "compare with jquery");
	equal(testElement7.style.display, "none", "check testElement7 display style attribute modification");

	$("#qunit-fixture").append("<div id='test8'></div>");
	$("#test8").css({
		"width": "100px",
		"height": "100px",
		"margin": "10px",
		"padding": "0",
		"border": "1px solid black"
	});
	testElement8 = document.getElementById("test8");
	equal(dom.getElementWidth(testElement8, "outer", false, true), 122, "check created element 8 width");
	equal(dom.getElementWidth(testElement8, "outer", false, true), $("#test8").outerWidth(true), "compare with jquery");
	equal(dom.getElementHeight(testElement8, "outer", false, true), 122, "check created element 8 height");
	equal(dom.getElementHeight(testElement8, "outer", false, true), $("#test8").outerWidth(true), "compare with jquery");
});