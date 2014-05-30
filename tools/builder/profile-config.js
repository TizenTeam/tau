/*global exports */
(function (exports) {
	"use strict";
	exports.config = {
		wearable: {
			themes: {
				"black": "wearable/theme-black"
			},
			defaultTheme: "black",
			useGlobalize: false
		},
		mobile: {
			themes: {
				"black": "mobile/theme-black",
				"white": "mobile/theme-white"
			},
			defaultTheme: "black",
			useGlobalize: true
		},
		custom: {
			themes: {
				"wearable-black": "wearable/theme-black",
				"mobile-black": "mobile/theme-black",
				"mobile-white": "mobile/theme-white"
			},
			defaultTheme: null,
			useGlobalize: true
		}
	};
}(exports));
