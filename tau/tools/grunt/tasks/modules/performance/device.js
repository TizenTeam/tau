/*global module, console, require, __dirname */
(function () {
	"use strict";
	module.exports = (function () {
		var proto,
			path = require("path"),
			BaseTester = require(path.join(__dirname, "base"));

		function DevicePerformanceTester() {
			this.storage = {};
			this.queue = [];
			this.lastApp = null;
		}

		proto = new BaseTester();

		proto.runQueue = function () {

		};

		proto.addData = function () {

		};

		DevicePerformanceTester.prototype = proto;

		return DevicePerformanceTester;
	}());
}());
