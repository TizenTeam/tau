/*global exports */
(function (exports) {
	"use strict";
	exports.config = {
		wearable: {
			themes: {
				"changeable": "wearable/changeable/theme-changeable"
			},
			defaultTheme: "changeable",
			useGlobalize: false
		},
		mobile: {
			themes: {
				"changeable": "mobile/changeable/theme-changeable"
			},
			defaultTheme: "changeable",
			useGlobalize: true
		},
		tv: {
			themes: {
				"black": "tv/default/theme-black"
			},
			defaultTheme: "black",
			useGlobalize: false
		},
		custom: {
			themes: {
				"wearable-changeable":  "wearable/changeable/theme-changeable",
				"mobile-changeable": "mobile/changeable/theme-changeable",
				"tv-black": "tv/default/theme-black"
			},
			defaultTheme: null,
			useGlobalize: true
		}
	};
}(exports));
