/*global define, window */
define(function () {
	"use strict";
	var Model = function (options) {
			var prop = "";
			options = options || {};
			this.data = {};
			for (prop in options) {
				if (options.hasOwnProperty(prop)) {
					this.data[prop] = options[prop];
				}
			}
		},
		proto = Model.prototype;

	proto.setProp = function (name, value) {
		this.data[name] = value;
	};

	proto.getProp = function (name) {
		return this.data[name] || null;
	};

	proto.setData = function (data) {
		this.data = data;
	};

	proto.getData = function () {
		return this.data;
	};

	return Model;
});
