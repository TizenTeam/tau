/*global window, define */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util", // fetch namespace
			"./selectors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var selectors = ns.util.selectors,
				slice = [].slice,
				gridTypes = [
					null,
					"solo", //1
					"a",	//2
					"b",	//3
					"c",	//4
					"d"	//5
				];

			function setClassOnMatches(elements, selector, className) {
				elements.forEach(function (item) {
					if (selectors.matchesSelector(item, selector)) {
						item.classList.add(className);
					}
				});
			}
			/**
			* Class with functions to create css grids
			* @class ns.util.grid
			*/
			ns.util.grid = {
				/**
				* make css grid
				* @method makeGrid
				* @param {HTMLElement} element
				* @param {string=} [gridType="a"]
				* @static
				* @member ns.util.grid
				*/
				makeGrid: function (element, gridType) {
					var gridClassList = element.classList,
						kids = slice.call(element.children),
						iterator;
					if (!gridType) {
						gridType = gridTypes[kids.length];
						if (!gridType) {
							//if gridType is not defined in gritTypes
							//make it grid type "a""
							gridType = "a";
							iterator = 2;
							gridClassList.add("ui-grid-duo");
						}
					}
					if (!iterator) {
						//jquery grid doesn't care if someone gives non-existing gridType
						iterator = gridTypes.indexOf(gridType);
					}

					gridClassList.add("ui-grid-" + gridType);

					setClassOnMatches(kids, ":nth-child(" + iterator + "n+1)", "ui-block-a");

					if (iterator > 1) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+2)", "ui-block-b");
					}
					if (iterator > 2) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+3)", "ui-block-c");
					}
					if (iterator > 3) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+4)", "ui-block-d");
					}
					if (iterator > 4) {
						setClassOnMatches(kids, ":nth-child(" + iterator + "n+5)", "ui-block-e");
					}
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.grid;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
