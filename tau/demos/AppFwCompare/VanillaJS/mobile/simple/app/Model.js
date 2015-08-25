/*global define, window */
define(function () {
	"use strict";
	var Model = function () {
			this.data = {};
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
