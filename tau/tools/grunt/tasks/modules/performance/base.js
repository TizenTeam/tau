/*global module, console, require */
(function () {
	"use strict";
	module.exports = (function () {
		var proto;

		function BaseTester() {

		}

		proto = {
			run: function (doneCallback) {
				this.doneCallback = doneCallback;
				this.runQueue();
			},
			runQueue: function () {
				throw "tester.runQueue missing implementation";
			},
			addTest: function (app) {
				this.queue.push(app);
			},
			addData: function (data) {
				throw "tester.addData missing implementation";
			},
			getRawResults: function () {
				return this.storage;
			}
		};

		BaseTester.prototype = proto;

		return BaseTester;
	}());
}());
