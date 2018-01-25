/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("dropdownmenu", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	test("DropdownMenu" , function () {
		var selectTag = document.getElementById("select2"),
			eventsCalled = {},
			id = selectTag.id,
			options = document.getElementById(id+"-options"),
			changeValue = options.children[3];

		$(selectTag).on("change", function(e) {
			eventsCalled[e.type] = true;
		});

		$(changeValue).trigger('vclick');

		ok(eventsCalled.change, 'change event is triggered.');
	});

}(window.document));