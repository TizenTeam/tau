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
				console.error("runQueue: Missing implementation");
			},
			addTest: function (app) {
				this.queue.push(app);
			},
			addData: function (data) {
				console.error("addData: Missing implementation");
			},
			getRawResults: function () {
				return this.storage;
			}
		};

		BaseTester.prototype = proto;

		return BaseTester;
	}());
}());
