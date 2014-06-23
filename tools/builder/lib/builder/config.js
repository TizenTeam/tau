/*global exports */
/*jslint nomen: true */
(function (exports) {
	"use strict";
	var config = {};
	exports.get = function (name, def) {
		if (config[name] !== undefined) {
			return config[name];
		}
		return def;
	};

	exports.set = function (name, value) {
		config[name] = value;
	};
}(exports));


