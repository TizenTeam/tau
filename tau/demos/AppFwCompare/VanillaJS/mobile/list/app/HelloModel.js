/*global define, window */
define(
	[
		"Model"
	],
	function (Model) {
		"use strict";
		var FRAMEWORK_DATA_KEY = "framework",
			HelloModel = function (options) {
				options = options || {};
				HelloModel.prototype.constructor.call(this, options);
				this.setFrameworkName(options.framework || "");
			},
			proto = new Model();

		proto.setFrameworkName = function (name) {
			this.setProp(FRAMEWORK_DATA_KEY, name);
		};

		proto.getFrameworkName = function () {
			return this.getProp(FRAMEWORK_DATA_KEY);
		};

		HelloModel.prototype = proto;

		return HelloModel;
	}
);
