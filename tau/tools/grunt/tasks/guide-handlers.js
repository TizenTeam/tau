/*global module, console */
(function () {
	"use strict";
	module.exports = {
		baloon: function (match, type, title, body) {
			return '\n<div class="bs-callout bs-callout-' + type.trim().replace("!", "") + '">' +
					'<h4>' + title + '</h4>' +
					'<p>' + body + '</p></div>\n';
		}
	};
}());
