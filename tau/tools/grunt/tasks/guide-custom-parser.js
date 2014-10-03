/*jslint nomen: true, plusplus: true */
/*global module, require, __dirname */
(function () {
	"use strict";
	var sep = require("path").sep,
		rules = require(__dirname + sep + "guide-rules.js"),
		ruleHandlers = require(__dirname + sep + "guide-handlers.js"),
		ruleNames = Object.keys(rules),
		i,
		ruleName;


	function parse(content) {
		i = ruleNames.length;
		while (--i >= 0) {
			ruleName = ruleNames[i];
			content = content.replace(rules[ruleName], ruleHandlers[ruleName]);
		}

		return content;
	}

	module.exports = {
		parse: function (content, success, fail) {
			try {
				success(parse(content));
			} catch (err) {
				fail(err);
			}
		}
	};
}());
