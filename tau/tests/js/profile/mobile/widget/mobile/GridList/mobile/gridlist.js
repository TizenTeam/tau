/*global module, test, asyncTest, ok, equal, tau, window */
(function(ns) {
	"use strict";

	module("gridlist", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	test("GridList" , function () {
		var elGridList = document.getElementById("gridlist"),
			gridList = tau.widget.GridList(elGridList),
			addedItem, listLength;

		ok(window.parseInt(elGridList.children[0].style.width, 10) > 0, "grid item has width");
		$(elGridList).trigger('pinchout');
		equal(gridList.options.cols, 3, "pinchout event has fired and adjust cols");
		$(elGridList).trigger('pinchin');
		equal(gridList.options.cols, 4, "pinchin event has fired and adjust cols");

		listLength = elGridList.children.length;
		equal(listLength, 4, "There are 4 list items");
		addedItem = document.createElement("li");
		addedItem.innerHTML = '<img class="ui-gridlist-image" src=""><p class="ui-gridlist-label">1</p><div class="ui-gridlist-handler"></div>';
		gridList.addItem(addedItem);
		equal(elGridList.children[listLength], addedItem, "Item has been added");
		gridList.removeItem(addedItem);
		equal(listLength, 4, "There are 4 list items");

		gridList.option("reorder", true);
		ok(elGridList.classList.contains("ui-gridlist-reorder"), "reorder options has been activated.");
	});

}(window.tau));