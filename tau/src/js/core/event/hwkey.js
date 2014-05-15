/*global window, define */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var popupClose = function (event) {
					var keyName = event.keyName,
						activePopup = ns.activePopup,
						container,
						containerClass,
						focused;
					// Check enableHWKeyHandler property
					if (ns.getConfig("enableHWKeyHandler", true) && activePopup) {
						container = activePopup._ui.container;
						containerClass = container && container.classList;
						if (keyName === "menu") {
							focused = activePopup.element.querySelector(".ui-focus");
							if (focused) {
								// NOTE: If a popup is opened and focused element exists in it,
								//       do not close that popup.
								//       'false' is returned here, hence popup close routine is not run.
								event.preventDefault();
								event.stopPropagation();
								return;
							}
						}
						if (keyName === "menu" || keyName === "back") {
							if (containerClass && (!containerClass.contains("ui-datetimepicker") || containerClass.contains("in"))) {
								activePopup.close();
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				},
				hwkey = {
					bind: function () {
						document.addEventListener("tizenhwkey", popupClose, true);
					},

					unbind: function () {
						document.removeEventListener("tizenhwkey", popupClose, true);
					}
				};

			/**
			* Namespace to support tizenhwkey event
			* @class ns.event.hwkey
			*/
			/**
			* Event tizenhwkey
			* @event tizenhwkey
			* @member ns.event.hwkey
			*/
			ns.event.hwkey = hwkey;

			document.addEventListener(ns.engine.eventType.INIT, function() {
				hwkey.unbind();
				hwkey.bind();
			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return hwkey;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));