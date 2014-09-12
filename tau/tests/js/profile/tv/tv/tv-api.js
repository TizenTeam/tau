/*global test, ok, equal, expect, strictEqual, module, ej */
(function (tau) {
	"use strict";

	module("TV Namespace", {});

	test("Namespace is created", function () {
		expect(1);
		equal(typeof tau.widget.tv, "object", "widget.tv namespace exists");
	});
}(window.tau));