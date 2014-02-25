
var dom = ej.utils.DOM,
	testNode;

function setup() {
	testNode = document.createElement("div"),
	testNode.setAttribute("class", "test-node");
	testNodes = [];
	tmp = 10;
	while (tmp--) {
		tmpNode = document.createElement("div");
		tmpNode.setAttribute("class", "test-node");
		testNodes.push(tmpNode)
	}
}

test("utils.DOM.manipulation - basic test for function appendNodes", function () {
	var elem1 = document.getElementById("dom1"),
		elem2 = document.getElementById("dom2"),
		elem3 = document.getElementById("dom3"),
		thrownValue;

	equal(typeof dom.appendNodes(elem1, elem2), "object", "function appendNodes returns object");
	ok(dom.appendNodes(elem1, [elem2, elem3]) instanceof Array, "function appendNodes returns array");
	throws(function () { thrownValue = dom.appendNodes(null, elem1); }, "function throws error on null context", "Context empty!");
	equal(thrownValue, null, "thrown value is null");
});

test("utils.DOM.manipulation - check function appendNodes", function () {
	var t5 = document.getElementById("test5"),
		t6 = document.getElementById("test6");

	/********** other setup ***********/
	setup();

	equal(t5.children.length, 0, "appendNodes: element has 0 children before appending 1 node");
	ej.utils.DOM.appendNodes(t5, testNode);
	equal(t5.children.length, 1, "appendNodes: element has 1 children after appending");
	equal(t5.children[0].className, "test-node", "appendNodes: elements child node has proper class");

	equal(t6.children.length, 0, "appendNodes: element has 0 children before appending 10 nodes");
	ej.utils.DOM.appendNodes(t6, testNodes);
	equal(t6.children.length, 10, "appendNodes: element has 10 children after appending");
	equal(t6.children[0].className, "test-node", "appendNodes: elements child node has proper class");
});

test("utils.DOM.manipulation - basic test for function replaceWithNodes", function () {
	var elem1 = document.getElementById("dom1"),
		elem2 = document.getElementById("dom2"),
		elem3 = document.getElementById("dom3"),
		elem4 = document.getElementById("dom4");

	equal(typeof dom.replaceWithNodes(elem1, elem2), "object", "function replaceWithNodes returns object");
	ok(dom.replaceWithNodes(elem2, [elem3, elem4]) instanceof Array, "function replaceWithNodes returns array");
});

test("utils.DOM.manipulation - check function replaceWithNodes", function () {
	var t7 = document.getElementById("test7"),
		t8 = document.getElementById("test8");

	/********** other setup ***********/
	setup();

	equal(t7.parentNode.id, "qunit-fixture", "replaceWithNodes: element has has parent node qunit-fixture");
	ej.utils.DOM.replaceWithNodes(t7, testNode);
	equal(t7.parentNode, null, "replaceWithNodes: element has not any parent node (element has been replaced)");
	equal(testNode.parentNode.id, "qunit-fixture", "replaceWithNodes: test node has a parent qunit-fixture");

	equal(t8.parentNode.id, "qunit-fixture", "replaceWithNodes: element has has parent node qunit-fixture");
	ej.utils.DOM.replaceWithNodes(t8, testNodes);
	equal(t8.parentNode, null, "replaceWithNodes: element no parent (element has been replaced with 10 nodes)");
	equal(testNodes[0].parentNode.id, "qunit-fixture", "replaceWithNodes: testNodes at index 0 has a parent node qunit-fixture");

});

test("utils.DOM.manipulation - check function removeAllChildren", function () {
	var elem1 = document.getElementById("dom1");
	equal(elem1.children.length, 3, "element has 3 children before calling removeAllChildren");
	equal(typeof dom.removeAllChildren(elem1), "undefined", "function removeAllChildren returns nothing");
	equal(elem1.children.length, 0, "element has no child after calling removeAllChildren");
});

test("utils.DOM.manipulation - check function insertNodesBefore", function () {
	var elem1 = document.getElementById("dom1"),
		elem2 = document.getElementById("dom2"),
		elem3 = document.getElementById("dom3"),
		t9 = document.getElementById("test9"),
		t10 = document.getElementById("test10"),
		thrownValue;

	equal(typeof dom.insertNodesBefore(elem1, elem2), "object", "function insertNodesBefore returns object");
	ok(dom.insertNodesBefore(elem1, [elem2, elem3]) instanceof Array, "function insertNodesBefore returns array");
	throws(function () { thrownValue = dom.insertNodesBefore(null, elem1); }, "function throws error on null context", "Context empty!");
	equal(thrownValue, null, "thrown value is null");
	
	setup();
	notEqual(t9.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is not equal test-node");
	ej.utils.DOM.insertNodesBefore(t9, testNode);
	equal(t9.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is equal test-node after insertNodesBefore");


	notEqual(t10.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is not equal test-node");
	ej.utils.DOM.insertNodesBefore(t10, testNodes);
	equal(t10.previousSibling.className, "test-node", "insertNodesBefore: elements previous sibling class name is equal test-node after insertNodesBefore with collection");

});

test("utils.DOM.manipulation - check function insertNodeAfter", function () {
	var elem1 = document.getElementById("dom1"),
		elem2 = document.getElementById("dom2"),
		thrownValue;

	equal(typeof dom.insertNodeAfter(elem1, elem2), "object", "function insertNodeAfter returns object");
	throws(function () { thrownValue = dom.insertNodeAfter(null, elem1); }, "function throws error on null context", "Context empty!");
	equal(thrownValue, null, "thrown value is null");
});

test("utils.DOM.manipulation - basic test for function wrapInHTML", function () {
	var elem1 = document.getElementById("dom1"),
		elem2 = document.getElementById("dom2"),
		elem3 = document.getElementById("dom3");

	equal(typeof dom.wrapInHTML(elem1, "<div></div>"), "object", "function wrapInHTML returns object");
	ok(dom.wrapInHTML([elem2, elem3], "<a></a>") instanceof Array, "function wrapInHTML returns array");
});

test("utils.DOM.manipulation - check function wrapInHTML", function () {
	var t1 = document.getElementById("test1"),
		t1_old_parent = t1.parentNode,
		t2 = document.getElementById("test2"),
		t4 = document.getElementById("qunit-fixture").getElementsByClassName("test4"),
		t1_ref = ej.utils.DOM.wrapInHTML(t1, '<div id="first-test"></div>'),
		t1_parent = t1_ref.parentNode,
		t2_ref,
		t2_prev_sibling,
		t2_next_sibling,
		t3 = document.createElement("div"),
		t3_ref,
		t3_parent,
		t4_ref,
		t4_i,
		t4_len,
		t11 = document.getElementById("test11"),
		testNode,
		testNodes,
		tmpNode,
		tmp,
		tmpParent;

	equal(t1_ref, t1, "wrapInHTML: wrapped node and original node are the same");
	equal(t1_parent, t1.parentNode, "wrapInHTML: wrapped node and original node parents are the same");
	equal("first-test", t1_parent.id, "wrapInHTML: parent node has proper id attribute");
	notEqual(t1_old_parent, t1_parent, "wrapInHTML: previous parent and new parent are not the same");
	equal(t1_old_parent, t1_parent.parentNode, "wrapInHTML: previous parent and new parents parent are the same");

	t2_ref = ej.utils.DOM.wrapInHTML(t2, '<div id="second-test"><span id="sibling-1"></span><span id="sibling-2"></span>${content}<span id="sibling-3"></span></div>')
	t2_prev_sibling = t2_ref.previousSibling;
	t2_next_sibling = t2_ref.nextSibling;
	ok(t2_prev_sibling, "wrapInHTML: ref has prev sibling");
	ok(t2_next_sibling, "wrapInHTML: ref has next sibling");
	ok(t2.previousSibling, "wrapInHTML: original has prev sibling");
	ok(t2.nextSibling, "wrapInHTML: original has next sibling");
	equal("second-test", t2.parentNode.id, "wrapInHTML: parent node has proper id attribute");

	equal(t3.parentNode, null, "wrapInHTML: in-memory element has no parent node");
	t3_ref = ej.utils.DOM.wrapInHTML(t3, '<div id="third-test"></div>');
	t3_parent = t3_ref.parentNode;
	ok(t3_parent, "wrapInHTML: in-memory element has parent after wrap");
	equal(t3_parent.parentNode, null, "wrapInHTML: in-memory elements parent node has no parent node");
	equal("third-test", t3_parent.id, "wrapInHTML: in-memory elements parent node has proper id attribute");

	t4_ref = ej.utils.DOM.wrapInHTML(t4, '<div id="fourth-test"></div>');
	for (t4_i = 0, t4_len = t4_ref.length; t4_i < t4_len; ++t4_i) {
		ok(t4_ref[t4_i], "wrapInHTML: Collection element " + (t4_i+1) +" has a parent");
		equal(t4_ref[t4_i].parentNode.id, "fourth-test", "wrapInHTML: Collection element " + (t4_i+1) +" parent has proper id");
	}

	ej.utils.DOM.wrapInHTML(t11.childNodes, "<span class='foo'></span>");
	equal(t11.childNodes.length, 1, "Wrapped with span");
	equal(t11.childNodes[0].tagName, 'SPAN', "Wrapped with span");
	equal(t11.childNodes[0].childNodes.length, 2, "All nodes moved to span");
});
