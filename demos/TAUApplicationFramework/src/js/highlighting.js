(function (window, document) {
	"use strict";
	var h = window.hljs;
	document.addEventListener("pageshow", function (e) {
		[].slice.call(e.target.querySelectorAll("pre code")).forEach(function (code) {
			h.highlightBlock(code);
		});
	});
}(window, window.document));
