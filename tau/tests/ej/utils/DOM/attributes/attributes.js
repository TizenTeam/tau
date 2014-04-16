var dom = ej.utils.DOM,
	div = document.getElementById("test1");

test("utils.DOM.attributes - check function inheritAttr", function () {
	var elem1 = document.getElementById("dom5"),
		elem2 = document.getElementById("dom6"),
		elem3 = document.getElementById("dom6-child"),
		elem4 = document.getElementById("dom6-child2"),
		elem5 = document.getElementById("dom6-child3");

	equal(dom.inheritAttr(elem1, "name", "div"), null, "function inheritAttr returns null if attribute is not found");
	equal(dom.inheritAttr(elem2, "name", "div"), "dom6", "function inheritAttr returns own attribute");
	equal(dom.inheritAttr(elem3, "name", "form"), "dom6", "function inheritAttr returns inherited attribute");

	equal(dom.inheritAttr(elem4, "child", "[id='dom6']"), "parent", "function inheritAttr returns inherited attribute");
	equal(dom.inheritAttr(elem4, "child", "div"), null, "function inheritAttr returns null if the closest parent which matches the selector doesn't have such attribute");
	equal(dom.inheritAttr(elem5, "child", "[id='dom6']"), "child", "function inheritAttr returns own attribute");
	equal(dom.inheritAttr(elem5, "child", "form"), "child", "function inheritAttr returns own attribute");
});

test("utils.DOM.attributes - check function getNumberFromAttribute", function () {
	var elem1 = document.getElementById("dom1");

	equal(typeof dom.getNumberFromAttribute(elem1, "nothing"), "undefined", "function getNumberFromAttribute returns nothing if element doesn't have such attribute.");
	equal(typeof dom.getNumberFromAttribute(elem1, "param"), "undefined", "function getNumberFromAttribute returns nothing if value of element can't be converted to number");
	equal(dom.getNumberFromAttribute(elem1, "param", "string", 10), 10, "function getNumberFromAttribute returns default value if value of element can't be converted to number");
	equal(dom.getNumberFromAttribute(elem1, "number"), 4, "function getNumberFromAttribute returns value of attribute");
	equal(typeof dom.getNumberFromAttribute(elem1, "int"), "number", "function getNumberFromAttribute returns integer");
	equal(dom.getNumberFromAttribute(elem1, "float", "float"), 3.4, "function getNumberFromAttribute returns value of attribute");
	equal(typeof dom.getNumberFromAttribute(elem1, "float", "float"), "number", "function getNumberFromAttribute returns float");
});

test("utils.DOM.attributes - check functions: setNSData, getNSData, hasNSData, removeNSData", function () {
	var elem1 = document.getElementById("dom2");

	equal(dom.hasNSData(elem1, "ns-attr"), false, "function hasNSData returns false if element doesn't have such attribute.");
	dom.setNSData(elem1, "ns-attr", "value");
	equal(dom.hasNSData(elem1, "ns-attr"), true, "function hasNSData returns true if element has such attribute.");
	equal(dom.getNSData(elem1, "ns-attr"), "value", "function getNSData returns value of attribute.");
	equal(dom.getNSData(elem1, "no-ns-attr"), null, "function getNSData returns null if element doesn't have such attribute.");
	dom.removeNSData(elem1, "ns-attr", "value");
	equal(dom.hasNSData(elem1, "ns-attr"), false, "function hasNSData returns false after removing attribute.");
});

test("utils.DOM.attributes - check function setNSData", function () {
	dom.setNSData(div, "id", 5);
	dom.setNSData(div, "build", true);
	equal(typeof dom.setNSData(div, "text", "test"), "undefined", "setNSData returns nothing");
	equal(div.dataset.id, "5", "setNSData(div, 'id', 5)");
	equal(div.dataset.build, "true", "setNSData(div, 'build', 'true')");
	equal(div.dataset.text, "test", "setNSData(div, 'text', 'test')");
});

test("utils.DOM.attributes - check function getNSData", function () {
	div.dataset.id = 5;
	div.dataset.build = true;
	div.dataset.text = "test";
	equal(dom.getNSData(div, "nothing"), null, "getNSData returns null if element doesn't have such attribute");
	equal(dom.getNSData(div, "id"), "5", "getNSData(div, 'id')");
	equal(dom.getNSData(div, "build"), true, "getNSData(div, 'build')");
	dom.setNSData(div, "build", false);
	equal(dom.getNSData(div, "build"), false, "getNSData(div, 'build')");
	equal(dom.getNSData(div, "text"), "test", "getNSData(div, 'text')");
});

test("utils.DOM.attributes - check function hasNSData", function () {
	div.dataset.id = 5;
	div.dataset.build = true;
	div.dataset.text = "text";
	equal(dom.hasNSData(div, "text"), true, "hasNSData(div, 'text')");
	delete div.dataset.text;
	equal(dom.hasNSData(div, "id"), true, "hasNSData(div, 'id')");
	equal(dom.hasNSData(div, "build"), true, "hasNSData(div, 'build')");
	equal(dom.hasNSData(div, "text"), false, "hasNSData(div, 'text')");
});

test("utils.DOM.attributes - check function removeNSData", function () {
	div.dataset.id = 5;
	div.dataset.build = true;
	div.dataset.text = "test";
	dom.removeNSData(div, "id");
	dom.removeNSData(div, "build");
	dom.removeNSData(div, "text");
	equal(div.dataset.id, undefined, "removeNSData(div, 'id')");
	equal(div.dataset.build, undefined, "removeNSData(div, 'build')");
	equal(div.dataset.text, undefined, "removeNSData(div, 'text')");
});

test("utils.DOM.attributes - check function getData", function () {
	var elem1 = document.getElementById("dom3"),
		elem2 =  document.getElementById("dom4"),
		elem3 = document.getElementById("dom5"),
		attributes,
		numberOfElements = function (object) {
			var i,
				c = 0;
			for (i in object) {
				if (object.hasOwnProperty(i)) {
					c++;
				}
			}
			return c;
		};

	attributes = dom.getData(elem1);
	equal(typeof attributes, "object", "function getData returns object");
	equal(attributes.hasOwnProperty("attr"), false, "function getData returns only attributes with data- prefix");
	equal(numberOfElements(attributes), 0, "function getData returns all attributes with data- prefix");
	attributes = dom.getData(elem2);
	equal(typeof attributes, "object", "function getData returns object");
	equal(attributes.hasOwnProperty("attr"), true, "function getData returns only attributes with data- prefix");
	equal(numberOfElements(attributes), 1, "function getData returns all attributes with data- prefix");
	attributes = dom.getData(elem3);
	equal(typeof attributes, "object", "function getData returns object");
	equal(attributes.hasOwnProperty("attr2"), true, "function getData returns only attributes with data- prefix");
	equal(numberOfElements(attributes), 2, "function getData returns all attributes with data- prefix");
});

test("utils.DOM.attributes - check function removeAttribute", function () {
	var elem1 = document.getElementById("dom7");

	equal(elem1.hasAttribute("data-attr"), true, "element has such attribute before calling removeAttribute");
	equal(typeof dom.removeAttribute(elem1, "data-attr"), "undefined", "function removeAttribute returns nothing");
	equal(elem1.hasAttribute("data-attr"), false, "element doesnt't have such attribute after calling removeAttribute");
});

test("utils.DOM.attributes - check function setAttribute", function () {
	var elem1 = document.getElementById("dom7");

	equal(elem1.hasAttribute("attr2"), false, "element doesnt't have such attribute before calling setAttribute");
	dom.setAttribute(elem1, "attr2", "attribute");
	equal(elem1.hasAttribute("attr2"), true, "element has such attribute after calling setAttribute");
	equal(typeof dom.setAttribute(elem1, "data-attr", "attribute"), "undefined", "function setAttribute returns nothing");
});



