/*global window, define, ns */
/*jslint plusplus: true, nomen: true */
(function (document, ns, tau) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./navigator",
			"../../core/exposeApi"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			document.addEventListener("routerinit", function () {

				/**
				 * @method changePage
				 * @inheritdoc ns.router.Router#open
				 * @member tau
				 */
				tau.changePage = ns.changePage;

				/**
				 * @inheritdoc ns.router.history#back
				 * @method back
				 * @member tau
				 */
				tau.back = ns.back;

				/**
				 * @method openPopup
				 * @inheritdoc ns.router.Router#openPopup
				 * @member tau
				 */
				tau.openPopup = ns.openPopup;

				/**
				 * @method closePopup
				 * @inheritdoc ns.router.Router#closePopup
				 * @member tau
				 */
				tau.closePopup = ns.closePopup;

			}, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns, window.tau));
