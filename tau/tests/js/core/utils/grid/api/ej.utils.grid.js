(function (ns) {
	'use strict';
	var grid = ns.utils.grid;

	test("ns.utils.grid - check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.utils, "object", "ns.utils exists");
		equal(typeof ns.utils.grid, "object", "ns.utils.grid exists");
		equal(typeof grid.makeGrid, "function", "function cubicOut");
	});

	test("ns.utils.grid - check function makeGrid", function () {
		var elem1 = document.getElementById("grid1");
		equal(grid.makeGrid(elem1, "a"), null, "function makeGrid returns number value");
	});
}(ej));