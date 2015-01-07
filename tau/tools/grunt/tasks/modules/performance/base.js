/*global module, console, require */
(function () {
	"use strict";
	module.exports = (function () {
		var proto;

		function BaseTester() {
			this.storage = {};
			this.queue = [];
			this.queueProgress = 0;
			this.queueLength = 0;
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
				this.queueLength = this.queue.length;
			},
			addData: function (data) {
				throw "tester.addData missing implementation";
			},
			getRawResults: function () {
				return this.storage;
			},
			reset: function () {
				this.storage = {};
				this.queue.length = 0;
				this.queueProgress = 0;
				this.queueLength = 0;
			}
		};

		BaseTester.prototype = proto;

		return BaseTester;
	}());
}());
